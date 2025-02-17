import "server-only";

import { Profile as AlloProfile } from "@allo-team/allo-v2-sdk/dist/Registry/types";
import { cacheResult } from "@cobuild/libs/cache";
import { isAdmin } from "@cobuild/libs/revolution/admin";
import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { nonNullable, serialize } from "@cobuild/libs/utils/data";
import { alloRegistry } from "@cobuild/libs/web3/allo/registry";
import { getClient } from "@cobuild/libs/web3/viem/clients";
import { gdAv1ForwarderAbi } from "@cobuild/libs/web3/wagmi";
import { revolutionGrantsAbi } from "@cobuild/revolution";
import uniq from "lodash/uniq";
import { unstable_cache } from "next/cache";
import { AlloProfile as Grant } from "prisma-database";
import { erc20Abi, getContract } from "viem";
import { base } from "viem/chains";
import { database } from "../../..";
import { Profiles } from "../../social/Profiles";
import { Pools } from "../pools/Pools";
import { BASE_USDC_ADDRESS, GDA_FORWARDER, VRBS_GRANTS_PROXY } from "../revolutions/addresses";
import { Stories } from "../stories/Stories";
import { Grants } from "./Grants";
import { IGrant } from "./IGrant";

export async function transformGrant(
  grant: Omit<Grant, "body"> & { body?: string },
): Promise<IGrant> {
  const { alloProfileId, chainId, revolutionId } = grant;

  const alloProfile = await getAlloProfile(grant);

  const config = getRevolutionConfig(revolutionId);
  const url = `/${revolutionId}/grants/${chainId}/${alloProfileId}`;
  const absoluteUrl = `${config.url}${url}`;

  // be very careful changing this value, it's where all donations go etc.
  const salaryRecipientAddress = (grant.contractAddress as `0x${string}`) || alloProfile.anchor;

  const parentContract = grant.parentGrantsContract as `0x${string}`;

  const client = getClient(chainId);
  const contract = getContract({ address: parentContract, abi: revolutionGrantsAbi, client });

  const [poolBalance, memberFlowRate, parentPool] = await Promise.all([
    getPoolBalanceFor(salaryRecipientAddress, base.id, parentContract),
    cacheResult(`memberFlowRate${salaryRecipientAddress}_${chainId}`, 600, async () => {
      return await contract.read.getMemberFlowRate([salaryRecipientAddress]).then(Number);
    }),
    cacheResult(
      `pool_${chainId}_${parentContract}`,
      60 * 60 * 24,
      async () => await contract.read.pool(),
    ),
  ]);

  const contractAddress = grant.contractAddress as `0x${string}` | null;
  const isOpenGrantPool = !!grant.contractAddress;

  const maxOpenings = grant.isApplicable ? grant.maxOpenings || 1 : 0;

  const team = uniq([alloProfile.owner, ...grant.team].map(a => a.toLowerCase() as `0x${string}`));

  return Object.assign(grant, {
    alloProfile,
    body: grant.body || "",
    contractAddress,
    salaryRecipientAddress,
    isOpenGrantPool,
    isApproved: poolBalance.isApprovedRecipient,
    isTopLevel: grant.parentGrantsContract === VRBS_GRANTS_PROXY,
    parentPool,
    poolBalance: {
      ...poolBalance,
      claimableBalancePerMember: Math.floor(poolBalance.claimableBalance / grant.team.length),
      totalEarnedPerMember: Math.floor(poolBalance.totalEarned / grant.team.length),
      superTokenBalancePerMember: Math.floor(poolBalance.superTokenBalance / grant.team.length),
    },
    parentContract,
    maxOpenings,
    openings: grant.openings === null ? maxOpenings || 0 : grant.openings,
    url,
    absoluteUrl,
    team,
    memberFlowRate,
    memberFlowRatePerMember: Math.floor(memberFlowRate / grant.team.length),
    monthlyFlowRate: memberFlowRate * 60 * 60 * 24 * 30,
    monthlyFlowRatePerMember: (memberFlowRate * 60 * 60 * 24 * 30) / grant.team.length,
    totalVotes: poolBalance.memberUnits * 1e15,
    members: async () => {
      const users = await getGrantMembers(contractAddress, team);
      return await Profiles().getMany(users);
    },
    userVotes: async (user: `0x${string}`) => {
      const votes = await Pools().getVotesForUser(user, parentContract);

      return (
        (votes.find(v => v.recipient === salaryRecipientAddress)?.memberUnitsDelta || 0) * 1e15
      );
    },
    canBeManagedBy: (user: `0x${string}` | null) => {
      if (!user) return false;
      return team.includes(user) || isAdmin(user, revolutionId);
    },
    canBeUpdatedBy: async (user: `0x${string}` | null) => {
      if (!user) return false;

      if (grant.isApplicable) {
        const members = (await Grants().getAllForParentContract(parentContract))
          .filter(s => s.isApproved)
          .map(s => s.team)
          .flat();
        return members.includes(user);
      }

      return team.includes(user);
    },
    stories: async () => {
      if (!alloProfileId) return [];
      return await Stories().getForGrant(alloProfileId);
    },
    subgrants: async () => {
      if (!contractAddress) return [];
      return await Grants().getAllForParentContract(contractAddress);
    },
    parent: async () => (parentContract ? await getParent(parentContract) : null),
    isMemberConnectedToPool: () =>
      cacheResult(
        `isMemberConnectedToPool_${parentPool}_${salaryRecipientAddress}`,
        300,
        async () => {
          const gdaForwarder = getContract({
            address: GDA_FORWARDER[chainId],
            abi: gdAv1ForwarderAbi,
            client,
          });
          return await gdaForwarder.read.isMemberConnected([parentPool, salaryRecipientAddress]);
        },
      ),
  });
}

async function getGrantsTopLevelData(
  address: `0x${string}`,
  chainId: number,
  grantsContract: `0x${string}`,
) {
  const contract = getGrantsContract(chainId, grantsContract);
  return await Promise.all([
    cacheResult(`totalEarned_${address}_${chainId}`, 600, async () => {
      return Number(await contract.read.getTotalAmountReceivedByMember([address]));
    }),
    cacheResult(`memberUnits_${address}_${chainId}`, 600, async () => {
      return Number(await contract.read.getPoolMemberUnits([address]));
    }),
  ]);
}

async function getGrantsPoolData(
  address: `0x${string}`,
  chainId: number,
  grantsContract: `0x${string}`,
  superToken: `0x${string}`,
) {
  const client = getClient(chainId);
  const contract = getGrantsContract(chainId, grantsContract);
  return await Promise.all([
    cacheResult(`approvedRecipients_${address}_${chainId}`, 600, async () => {
      return await contract.read.approvedRecipients([address]);
    }),
    cacheResult(`claimableBalance_${address}_${chainId}`, 600, async () => {
      return Number(await contract.read.getClaimableBalanceNow([address]));
    }),
    cacheResult(`balance_${address}_${superToken}`, 600, async () => {
      const erc20 = getContract({ address: superToken, abi: erc20Abi, client });
      return Number(await erc20.read.balanceOf([address]));
    }),
    cacheResult(`usdc_balance_${address}_${chainId}`, 600, async () => {
      const erc20 = getContract({ address: BASE_USDC_ADDRESS, abi: erc20Abi, client });
      return Number(await erc20.read.balanceOf([address]));
    }),
    cacheResult(`balance_${address}_${chainId}`, 600, async () => {
      return Number(await client.getBalance({ address }));
    }),
  ]);
}

const getGrantsContract = (chainId: number, grantsContract: `0x${string}`) => {
  const client = getClient(chainId);
  return getContract({
    address: grantsContract,
    abi: revolutionGrantsAbi,
    client,
  });
};

async function getPoolBalanceFor(
  address: `0x${string}`,
  chainId: number,
  grantsContract: `0x${string}`,
) {
  const superToken = await cacheResult(
    `superToken_${chainId}_${grantsContract}`,
    60 * 60 * 24 * 30,
    async () => {
      return await getGrantsContract(chainId, grantsContract).read.superToken();
    },
  );

  const [
    [totalEarned, memberUnits],
    [isApprovedRecipient, claimableBalance, superTokenBalance, usdcBalance, ethBalance],
  ] = await Promise.all([
    getGrantsTopLevelData(address, chainId, grantsContract),
    getGrantsPoolData(address, chainId, grantsContract, superToken),
  ]);

  return {
    claimableBalance,
    totalEarned,
    memberUnits,
    superTokenBalance,
    ethBalance,
    superToken,
    isApprovedRecipient,
    usdcBalance,
  };
}

async function getAlloProfile(grant: Omit<Grant, "body">): Promise<AlloProfile> {
  return cacheResult(`allo_profile_${grant.alloProfileId}_${grant.chainId}`, 3600, async () => {
    const profile = await alloRegistry.getProfileById(grant.alloProfileId as `0x${string}`);

    return serialize({
      ...profile,
      owner: profile.owner.toLowerCase(),
      anchor: profile.anchor.toLowerCase(),
    }) as AlloProfile;
  });
}

async function getParent(contractAddress: `0x${string}`) {
  return await cacheResult(`grant_contract_${contractAddress}`, 480, async () => {
    const parent = await database.alloProfile.findFirst({ where: { contractAddress } });
    return parent ? transformGrant(parent) : null;
  });
}

export const getGrantMembers = unstable_cache(
  async (contractAddress: `0x${string}` | null, team: `0x${string}`[]) => {
    if (!contractAddress) return team;

    const subgrants = await database.alloProfile.findMany({
      where: { parentGrantsContract: contractAddress },
    });

    const nestedSubgrants = await database.alloProfile.findMany({
      where: {
        parentGrantsContract: { in: subgrants.map(s => s.contractAddress).filter(nonNullable) },
      },
    });

    return uniq([
      ...team,
      ...subgrants.map(s => s.team).flat(),
      ...nestedSubgrants.map(s => s.team).flat(),
    ] as `0x${string}`[]);
  },
  undefined,
  { revalidate: 360, tags: ["grant"] },
);
