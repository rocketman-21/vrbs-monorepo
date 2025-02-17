import { Abi } from "viem";
import { getRevolutionBuilderImplementations } from "@cobuild/libs/web3/viem/utils/revolutionBuilder";
import {
  nounsAuctionHouseAbi,
  nounsAuctionHouseAddress,
  nounsDaoLogicV1Abi,
  nounsDaoLogicV1Address,
  nounsDaoLogicV2Abi,
  nounsDaoLogicV2Address,
  nounsDaoLogicV3Abi,
  nounsDaoLogicV3Address,
  nounsTokenAbi,
  nounsTokenAddress,
  skateContractV2AuctionHouseV2Abi,
  skateContractV2AuctionHouseV2Address,
  nounsBuilderGovernorV1Address,
  nounsBuilderGovernorV1Abi,
} from "../../web3/wagmi";
import {
  cultureIndexAbi,
  auctionHouseAbi,
  revolutionPointsEmitterAbi,
  revolutionTokenAbi,
  revolutionPointsAbi,
  revolutionDaoLogicV1Abi,
  revolutionBuilderAbi,
  contestBuilderAbi,
} from "@cobuild/revolution";
import { base, baseSepolia, mainnet, optimism } from "viem/chains";
import {
  CONTEST_BUILDER_ADDRESSES,
  REVOLUTION_BUILDER_ADDRESSES,
} from "@cobuild/database/models/revolution/revolutions/addresses";
import { splitMainAbi } from "@cobuild/splits";

const AbiMapping = {
  [REVOLUTION_BUILDER_ADDRESSES[base.id].toLowerCase()]: revolutionBuilderAbi as Abi,
  [REVOLUTION_BUILDER_ADDRESSES[baseSepolia.id].toLowerCase()]: revolutionBuilderAbi as Abi,
  [REVOLUTION_BUILDER_ADDRESSES[optimism.id].toLowerCase()]: revolutionBuilderAbi as Abi,

  // contest builder
  [CONTEST_BUILDER_ADDRESSES[baseSepolia.id].toLowerCase()]: contestBuilderAbi as Abi,
  [CONTEST_BUILDER_ADDRESSES[base.id].toLowerCase()]: contestBuilderAbi as Abi,
  [CONTEST_BUILDER_ADDRESSES[optimism.id].toLowerCase()]: contestBuilderAbi as Abi,

  //mainnet
  [nounsBuilderGovernorV1Address[mainnet.id].toLowerCase()]: nounsBuilderGovernorV1Abi as Abi,
  [nounsAuctionHouseAddress[mainnet.id].toLowerCase()]: nounsAuctionHouseAbi as Abi,
  [nounsDaoLogicV1Address[mainnet.id].toLowerCase()]: nounsDaoLogicV1Abi as Abi,
  [nounsDaoLogicV2Address[mainnet.id].toLowerCase()]: nounsDaoLogicV2Abi as Abi,
  [nounsDaoLogicV3Address[mainnet.id].toLowerCase()]: nounsDaoLogicV3Abi as Abi,
  [nounsTokenAddress[mainnet.id].toLowerCase()]: nounsTokenAbi as Abi,
  [skateContractV2AuctionHouseV2Address[mainnet.id].toLowerCase()]:
    skateContractV2AuctionHouseV2Abi as Abi,
} as const;

//get abi from implementation contract address
export const getAbiForImplementation = async (implementationContract: string, chainId: number) => {
  const abi = AbiMapping[implementationContract.toLowerCase()];

  if (!abi) {
    //todo need to new versions
    const {
      auctionImpl,
      tokenImpl,
      pointsEmitterImpl,
      pointsImpl,
      cultureIndexImpl,
      daoImpl,
      splitsCreatorImpl,
    } = await getRevolutionBuilderImplementations(REVOLUTION_BUILDER_ADDRESSES[chainId], chainId);

    if (implementationContract.toLowerCase() === auctionImpl) {
      return auctionHouseAbi as Abi;
    }
    if (implementationContract.toLowerCase() === tokenImpl) {
      return revolutionTokenAbi as Abi;
    }
    if (implementationContract.toLowerCase() === pointsEmitterImpl) {
      return revolutionPointsEmitterAbi as Abi;
    }
    if (implementationContract.toLowerCase() === pointsImpl) {
      return revolutionPointsAbi as Abi;
    }
    if (implementationContract.toLowerCase() === cultureIndexImpl) {
      return cultureIndexAbi as Abi;
    }
    if (implementationContract.toLowerCase() === daoImpl) {
      return revolutionDaoLogicV1Abi as Abi;
    }
    if (implementationContract.toLowerCase() === splitsCreatorImpl.toLowerCase()) {
      return splitMainAbi as Abi;
    }

    //OLDER VERSIONS
    // CULTURE INDEX baseSepolia
    if (implementationContract.toLowerCase() === "0xceabc08735b414f2fb245215e482478c8ba37ea7") {
      return cultureIndexAbi as Abi;
    }
    // CULTURE INDEX base
    if (implementationContract.toLowerCase() === "0xcec54e2dad26aa685364c30cfbc0e274e3e77db3") {
      return cultureIndexAbi as Abi;
    }

    throw new Error(`No abi found for implementation contract ${implementationContract}`);
  }

  return abi;
};
