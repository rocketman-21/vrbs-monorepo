import { getContract, zeroAddress } from "viem";
import { revolutionBuilderAbi } from "@cobuild/revolution";
import { getClient } from "../clients";
import { unstable_cache } from "next/cache";
import { reportApiError } from "../../../utils/apiError";
import { RegisteredRevolutionExtension } from "../../../revolution/extensionData";

export const getRevolutionDAOEntityId = (chainId: number, tokenContract: `0x${string}`) =>
  `ethereum-${chainId}-revolution-${tokenContract.toLowerCase()}`;

export interface RevolutionAddresses {
  token?: `0x${string}`;
  descriptor?: `0x${string}`;
  auction?: `0x${string}`;
  executor?: `0x${string}`;
  dao?: `0x${string}`;
  cultureIndex?: `0x${string}`;
  points?: `0x${string}`;
  pointsEmitter?: `0x${string}`;
  maxHeap?: `0x${string}`;
  revolutionVotingPower?: `0x${string}`;
  vrgda?: `0x${string}`;
  splitsCreator?: `0x${string}`;
  drop?: `0x${string}`;
  treasury?: `0x${string}`;
  mintHouse?: `0x${string}`;
}

//get proxy contracts for token
export const getRevolutionDAOAddresses = async (
  builderProxyAddress: `0x${string}`,
  tokenAddress: `0x${string}`,
  chainId: number,
): Promise<RevolutionAddresses | null> => {
  try {
    return await revolutionDAOAddresses(builderProxyAddress, tokenAddress, chainId);
  } catch (e) {
    console.error(e);
    reportApiError(e, { builderProxyAddress, tokenAddress, chainId }, "get-revolution-addresses");
    return null;
  }
};

const revolutionDAOAddresses = async (
  builderAddress: `0x${string}`,
  tokenAddress: `0x${string}`,
  chainId: number,
): Promise<RevolutionAddresses | null> => {
  const contract = getContract({
    address: builderAddress,
    abi: revolutionBuilderAbi,
    client: { public: getClient(chainId) },
  });

  const addresses = await unstable_cache(
    () => contract.read.getAddresses([tokenAddress]),
    [tokenAddress],
    { revalidate: 604800 }, // 7 days in seconds
  )();

  // if they are 0 addresses return null
  if (addresses.some(address => address === zeroAddress)) {
    return null;
  }

  return {
    token: addresses[0].toLowerCase() as `0x${string}`,
    descriptor: addresses[1].toLowerCase() as `0x${string}`,
    auction: addresses[2].toLowerCase() as `0x${string}`,
    executor: addresses[3].toLowerCase() as `0x${string}`,
    dao: addresses[4].toLowerCase() as `0x${string}`,
    cultureIndex: addresses[5].toLowerCase() as `0x${string}`,
    points: addresses[6] as `0x${string}`,
    pointsEmitter: addresses[7].toLowerCase() as `0x${string}`,
    maxHeap: addresses[8].toLowerCase() as `0x${string}`,
    revolutionVotingPower: addresses[9].toLowerCase() as `0x${string}`,
    vrgda: addresses[10].toLowerCase() as `0x${string}`,
    splitsCreator: addresses[11].toLowerCase() as `0x${string}`,
  };
};

export const getExtensionByToken = unstable_cache(
  async (
    builderAddress: `0x${string}`,
    tokenAddress: `0x${string}` | undefined,
    chainId: number,
  ): Promise<{ name: RegisteredRevolutionExtension } | null> => {
    try {
      if (!tokenAddress) return null;

      const contract = getContract({
        address: builderAddress,
        abi: revolutionBuilderAbi,
        client: { public: getClient(chainId) },
      });

      const extension = await contract.read.getExtensionByToken([tokenAddress]);

      return extension ? { name: extension as RegisteredRevolutionExtension } : null;
    } catch (e) {
      console.error(e);
      reportApiError(e, { builderAddress, tokenAddress, chainId }, "get-extension-by-token");
      return null;
    }
  },
  undefined,
  { revalidate: 604800 }, // 7 days in seconds
);

//get implementation contracts for ingestion
export const getRevolutionBuilderImplementations = unstable_cache(
  async (proxyAddress: `0x${string}`, chainId: number) => {
    return await revolutionBuilderImplementations(proxyAddress, chainId);
  },
  undefined,
  { revalidate: 30, tags: ["revolution-contract-implementations"] },
);

// pull implementations from the revolution builder contract
const revolutionBuilderImplementations = async (proxyAddress: `0x${string}`, chainId: number) => {
  const contract = getContract({
    address: proxyAddress,
    abi: revolutionBuilderAbi,
    client: { public: getClient(chainId) },
  });

  const pointsEmitterImpl = await contract.read.revolutionPointsEmitterImpl();
  const tokenImpl = await contract.read.revolutionTokenImpl();
  const pointsImpl = await contract.read.revolutionPointsImpl();
  const votingPowerImpl = await contract.read.revolutionVotingPowerImpl();

  const cultureIndexImpl = await contract.read.cultureIndexImpl();
  const auctionImpl = await contract.read.auctionImpl();
  const daoImpl = await contract.read.daoImpl();
  const executorImpl = await contract.read.executorImpl();
  const descriptorImpl = await contract.read.descriptorImpl();
  const maxHeapImpl = await contract.read.maxHeapImpl();
  const vrgdaImpl = await contract.read.vrgdaImpl();
  const splitsCreatorImpl = await contract.read.splitsCreatorImpl();

  return {
    pointsEmitterImpl: pointsEmitterImpl.toLowerCase() as `0x${string}`,
    tokenImpl: tokenImpl.toLowerCase() as `0x${string}`,
    pointsImpl: pointsImpl.toLowerCase() as `0x${string}`,
    votingPowerImpl: votingPowerImpl.toLowerCase() as `0x${string}`,
    cultureIndexImpl: cultureIndexImpl.toLowerCase() as `0x${string}`,
    auctionImpl: auctionImpl.toLowerCase() as `0x${string}`,
    daoImpl: daoImpl.toLowerCase() as `0x${string}`,
    executorImpl: executorImpl.toLowerCase() as `0x${string}`,
    descriptorImpl: descriptorImpl.toLowerCase() as `0x${string}`,
    maxHeapImpl: maxHeapImpl.toLowerCase() as `0x${string}`,
    vrgdaImpl: vrgdaImpl.toLowerCase() as `0x${string}`,
    splitsCreatorImpl: splitsCreatorImpl.toLowerCase() as `0x${string}`,
  };
};
