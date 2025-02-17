import { AuctionData } from "@cobuild/libs/revolution/auction";
import { DescriptorData } from "@cobuild/libs/revolution/descriptor";
import { VrgdaData } from "@cobuild/libs/revolution/vrgda";
import { EvmContract, IRevolutionConfig, SocialLinks } from "@cobuild/libs/revolution/interfaces";
import { PointsEmitterData } from "@cobuild/libs/revolution/pointsEmitter";
import { RevolutionTokenData } from "@cobuild/libs/revolution/revolutionToken";
import { CultureIndexData } from "@cobuild/libs/revolution/cultureIndex";
import { RevolutionDAOData } from "@cobuild/libs/revolution/dao";
import { VotingPowerData } from "@cobuild/libs/revolution/votingPower";
import { RevolutionAddresses } from "@cobuild/libs/web3/viem/utils/revolutionBuilder";
import { Revolution } from "prisma-database";
import { GovernanceType, TrackerType } from "../../../types";
import { TreasuryBalance } from "@cobuild/libs/web3/balance";
import { RegisteredRevolutionExtension } from "@cobuild/libs/revolution/extensionData";

export interface IRevolution extends Revolution {
  chainId: number;
  config: IRevolutionConfig;
  governanceEntityId: string;
  governanceType: GovernanceType;
  vaults: EvmContract[];
  farcasterChannelId?: string;
  symbol: string;
  socialLinks: SocialLinks;
  tokens?: EvmContract[];
  daoContract: `0x${string}` | null; //backwards compatibility with Nounish DAOs
  tokenContract: `0x${string}` | null;
  governanceTrackerType: TrackerType;
  treasury: TreasuryBalance[] | null;
  primaryTreasuryAddress: `0x${string}` | null;
  extension: { name: RegisteredRevolutionExtension } | null;
  contractURI: ContractURIData | null;
  collectibleName: string;
  logo: string;
  addresses: RevolutionAddresses | null;
  coverImage?: string;
  name: string;
  points: {
    name: string;
    symbol: string;
  } | null;
  token: RevolutionTokenData | null;
  descriptor: DescriptorData | null;
  pointsEmitter: PointsEmitterData | null;
  builderAddress: `0x${string}`;
  cultureIndex: CultureIndexData | null;
  vrgda: VrgdaData | null;
  auction: AuctionData | null;
  votingPower: VotingPowerData | null;
  dao: RevolutionDAOData | null;
  aiName: string;

  hasAuction: boolean;
  hasGrants: boolean;
  hasDrops: boolean;
  hasSplits: boolean;
}

export interface IRevolutionContractsData {
  daoContract: `0x${string}` | null; //backwards compatibility with Nounish DAOs
  points: {
    name: string;
    symbol: string;
  } | null;
  token: RevolutionTokenData | null;
  descriptor: DescriptorData | null;
  pointsEmitter: PointsEmitterData | null;
  cultureIndex: CultureIndexData | null;
  auction: AuctionData | null;
  vrgda: VrgdaData | null;
  votingPower: VotingPowerData | null;
  dao: RevolutionDAOData | null;
}

interface ContractURIData {
  uri: string;
  parsed: any | null;
}
