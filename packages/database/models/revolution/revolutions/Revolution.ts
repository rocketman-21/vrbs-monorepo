import "server-only";

import { getAuctionData } from "@cobuild/libs/revolution/auction";
import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { getCultureIndexData } from "@cobuild/libs/revolution/cultureIndex";
import { getRevolutionDAOData } from "@cobuild/libs/revolution/dao";
import { getDescriptorData } from "@cobuild/libs/revolution/descriptor";
import { RegisteredRevolutionExtension } from "@cobuild/libs/revolution/extensionData";
import { getGnosisDAOExecutorData } from "@cobuild/libs/revolution/extensions/gnosis-executor/gnosisDAOExecutor";
import { EvmContract } from "@cobuild/libs/revolution/interfaces";
import { getPointsEmitterData } from "@cobuild/libs/revolution/pointsEmitter";
import { getRevolutionTokenData } from "@cobuild/libs/revolution/revolutionToken";
import { getVotingPowerData } from "@cobuild/libs/revolution/votingPower";
import { getVrgdaData } from "@cobuild/libs/revolution/vrgda";
import { getDaoTreasuryBalance } from "@cobuild/libs/web3/balance";
import { convertIpfsToHttp } from "@cobuild/libs/web3/utils";
import { getContractURIData } from "@cobuild/libs/web3/viem/utils/contractURI";
import { getErc20TokenSymbol } from "@cobuild/libs/web3/viem/utils/erc20balance";
import { getNounsMainnetGovernanceContract } from "@cobuild/libs/web3/viem/utils/getNounsGovernanceContract";
import {
  RevolutionAddresses,
  getExtensionByToken,
  getRevolutionDAOAddresses,
  getRevolutionDAOEntityId,
} from "@cobuild/libs/web3/viem/utils/revolutionBuilder";
import { unstable_cache } from "next/cache";
import { Revolution } from "prisma-database";
import { GovernanceType, TrackerType } from "../../../types";
import { IRevolution, IRevolutionContractsData } from "./IRevolution";
import { REVOLUTION_BUILDER_ADDRESSES } from "./addresses";

export async function transformRevolution(revolution: Revolution): Promise<IRevolution> {
  const { revolutionId } = revolution;
  const config = getRevolutionConfig(revolutionId);
  const { revolutionToken } = config;

  const chainId = revolutionToken?.chainId || revolution.chainId;

  const governanceEntityId = getGovernanceEntityId(revolution, chainId, revolutionToken?.address);
  const governanceType = getGovernanceType(governanceEntityId);

  const [addresses, extension] = await Promise.all([
    getDAOAddresses(chainId, revolutionId, revolutionToken?.address),
    getExtensionByToken(REVOLUTION_BUILDER_ADDRESSES[chainId], revolutionToken?.address, chainId),
  ]);

  const treasuryAddress = await getPrimaryTreasuryAddress(
    revolutionId,
    addresses?.executor ?? null,
    chainId,
    extension?.name ?? null,
  )();

  const treasuryTokens = config.dao?.treasury?.tokens || [];

  const tokenContract =
    addresses?.token || getTokenContractFromGovernanceEntityId(governanceEntityId);

  const contractsDataPromise = getContractsData(chainId, addresses, tokenContract);
  const logoAndURIPromise = getLogoAndContractURI(
    tokenContract || undefined,
    revolution.name,
    chainId,
    revolutionId,
  );

  const [contractsData, logoAndURI, treasury] = await Promise.all([
    contractsDataPromise,
    logoAndURIPromise,
    getTreasuryData(treasuryAddress, treasuryTokens, chainId),
  ]);

  const name =
    config.name || revolution.name || contractsData.dao?.name || contractsData?.token?.name;
  const collectibleName =
    contractsData.descriptor?.tokenNamePrefix || contractsData.token?.name || "art";

  return Object.assign(revolution, {
    ...logoAndURI,
    ...contractsData,
    treasury,
    tokenContract,
    collectibleName,
    extension: extension ?? null,
    primaryTreasuryAddress: treasuryAddress,
    symbol: contractsData.dao?.flag || "⌐◨-◨",
    socialLinks: config.socialLinks || {},
    name,
    farcasterChannelId: config.socialLinks?.farcaster?.split("/channel/").pop() || "",
    tokens: treasuryTokens,
    vaults: getVaults(revolutionId, chainId, treasuryAddress),
    chainId,
    config, //todo overwrite default with correct values - put on top level so i dont have to override everything manually
    governanceTrackerType: getTrackerType(revolutionId, governanceEntityId),
    addresses,
    governanceType,
    coverImage: config.landingPage?.backdropImage,
    governanceEntityId,
    builderAddress: REVOLUTION_BUILDER_ADDRESSES[chainId],
    aiName: name?.replace("DAO ", "") + "AI",
    hasAuction: !!addresses?.auction,
    hasDrops: !!addresses?.drop,
    hasGrants: revolutionId === "vrbs",
    hasSplits: !!addresses?.splitsCreator,
  });
}

const getPrimaryTreasuryAddress = (
  revolutionId: string,
  executor: `0x${string}` | null,
  chainId: number,
  extensionName: RegisteredRevolutionExtension | null,
) =>
  unstable_cache(
    async (): Promise<`0x${string}` | null> => {
      if (executor && extensionName === "gnosis.guild.executor") {
        return (await getGnosisDAOExecutorData(executor, chainId)()).avatar;
      }

      if (executor) return executor;

      const config = getRevolutionConfig(revolutionId);
      return config.dao?.treasury.vaults?.[0]?.address || null;
    },
    [executor || "", `${chainId}`, extensionName || ""],
    { revalidate: 2592000, tags: ["treasury-address"] },
  );

const getContractURI = unstable_cache(
  async (tokenContract: `0x${string}`, chainId: number) => {
    return getContractURIData(tokenContract, chainId);
  },
  undefined,
  { revalidate: 2592000, tags: ["contract-uri"] },
);

function getTokenContractFromGovernanceEntityId(governanceEntityId?: string): `0x${string}` | null {
  if (governanceEntityId) {
    // pull out tokenContract from ethereum-mainnet-nounsbuilder-0x1c69aa9caa7ceef740b00bdd28ea8b8009efc7e8
    const tokenContract = governanceEntityId?.split("-")[3];
    if (tokenContract) {
      return tokenContract as `0x${string}`;
    }
  }
  return null;
}

async function getTreasuryData(
  address: `0x${string}` | null,
  tokens: EvmContract[],
  chainId: number,
) {
  return await getDaoTreasuryBalance(address ? [{ address, chainId }] : [], tokens);
}

async function getContractsData(
  chainId: number,
  addresses: RevolutionAddresses | null,
  tokenContract: `0x${string}` | null,
): Promise<IRevolutionContractsData> {
  const daoContract = addresses?.dao || (await getNounsMainnetGovernanceContract(tokenContract));

  if (!addresses)
    return {
      daoContract: daoContract || null,
      points: null,
      token: null,
      descriptor: null,
      pointsEmitter: null,
      cultureIndex: null,
      auction: null,
      vrgda: null,
      votingPower: null,
      dao: null,
    };

  const [points, token, descriptor, pointsEmitter, cultureIndex, auction, vrgda, votingPower, dao] =
    await Promise.all([
      addresses.points ? getErc20TokenSymbol(addresses.points, chainId) : null,
      addresses.token ? getRevolutionTokenData(addresses.token, chainId) : null,
      addresses.descriptor ? getDescriptorData(addresses.descriptor, chainId) : null,
      addresses.pointsEmitter ? getPointsEmitterData(addresses.pointsEmitter, chainId) : null,
      addresses.cultureIndex ? getCultureIndexData(addresses.cultureIndex, chainId) : null,
      addresses.auction ? getAuctionData(addresses.auction, chainId) : null,
      addresses.vrgda ? getVrgdaData(addresses.vrgda, chainId) : null,
      addresses.revolutionVotingPower
        ? getVotingPowerData(addresses.revolutionVotingPower, chainId)
        : null,
      addresses.dao ? getRevolutionDAOData(addresses.dao, chainId) : null,
    ]);

  return {
    daoContract: daoContract || null,
    points,
    token,
    descriptor,
    pointsEmitter,
    cultureIndex,
    auction,
    vrgda,
    votingPower,
    dao,
  };
}

async function getDAOAddresses(
  chainId: number,
  revolutionId: string,
  tokenContract?: `0x${string}`,
): Promise<RevolutionAddresses | null> {
  return unstable_cache(
    async () => {
      const config = getRevolutionConfig(revolutionId);

      if (config.addresses) return config.addresses;

      let addresses = tokenContract
        ? await getRevolutionDAOAddresses(
            REVOLUTION_BUILDER_ADDRESSES[chainId],
            tokenContract,
            chainId,
          )
        : null;

      return addresses;
    },
    [`${chainId}`, tokenContract || "", revolutionId],
    { revalidate: 360 },
  )();
}

function getGovernanceEntityId(
  revolution: Revolution,
  chainId: number | null,
  tokenContract?: `0x${string}`,
) {
  const { dao } = getRevolutionConfig(revolution.revolutionId);

  if (revolution.governanceEntityId) return revolution.governanceEntityId;

  if (dao?.entityId) return dao?.entityId;

  if (tokenContract && chainId) return getRevolutionDAOEntityId(chainId, tokenContract);

  return undefined;
}

async function getLogoAndContractURI(
  tokenContract: `0x${string}` | undefined,
  revolutionName: string | null,
  chainId: number,
  revolutionId: string,
) {
  const { logoUrl, name: configName } = getRevolutionConfig(revolutionId);
  const contractURI = tokenContract ? await getContractURI(tokenContract, chainId) : null;

  const logo = convertIpfsToHttp(logoUrl || contractURI?.parsed?.image || "/images/revolution.jpg");

  const name = revolutionName || configName || contractURI?.parsed?.name;

  return { logo, contractURI, name };
}

function getGovernanceType(governanceEntityId?: string): GovernanceType {
  if (governanceEntityId?.includes("nounsbuilder")) return "nounsbuilder";

  if (governanceEntityId?.includes("nouns")) return "nouns";

  return "revolution";
}

//todo get better way to do this eventually
function getTrackerType(revolutionId: string, governanceEntityId?: string): TrackerType {
  if (revolutionId === "nouns") return "nouns_dao_v3";
  if (revolutionId === "lilnouns" || revolutionId === "thatsgnarly") return "nouns_dao_v2";
  if (revolutionId === "nounsbr") return "nouns_dao_v1";

  if (governanceEntityId?.includes("nounsbuilder")) return "nounsbuilder_v1";

  return "revolution_dao_v1";
}

function getVaults(revolutionId: string, chainId: number, treasuryAddress: `0x${string}` | null) {
  const { dao } = getRevolutionConfig(revolutionId);

  const vaults = dao?.treasury?.vaults || [];

  if (treasuryAddress) {
    vaults.push({
      address: treasuryAddress,
      chainId: chainId,
    });
  }

  return vaults;
}
