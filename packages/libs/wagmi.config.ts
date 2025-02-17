/* eslint-disable turbo/no-undeclared-env-vars */
import { ContractConfig, defineConfig } from "@wagmi/cli";
import { etherscan } from "@wagmi/cli/plugins";
import { base, mainnet, sepolia } from "wagmi/chains";

const etherscanApiKey = `${process.env.ETHERSCAN_API_KEY}`;
const basescanApiKey = `${process.env.BASESCAN_API_KEY}`;

const abisToGenerateSepolia = [
  {
    address: { [sepolia.id]: "0xac3f288a7a3efa3d33d9dd321ad31072915d155d" as `0x${string}` },
    name: "AlloDirectGrantsSimpleStrategy",
  },
  {
    name: "GDAv1Forwarder",
    address: { [sepolia.id]: "0x6DA13Bde224A05a288748d857b9e7DDEffd1dE08" as `0x${string}` },
  },
];

const abisToGenerateBase = [
  {
    address: { [base.id]: "0x4b249E2ef4eabed97D63F8B077DFF4152D54dd2c" as `0x${string}` },
    name: "RevolutionGrantsBeta",
  },
  {
    address: { [base.id]: "0xe77e4fa003b2cc07ad10a9d1db216cae5ed14d3f" as `0x${string}` },
    name: "GnarsToken",
  },
  {
    address: { [base.id]: "0x1Eb7Bf3a08784D7cB08CC2AE1448012C0c02bDa2" as `0x${string}` },
    name: "ZoraCreator1155",
  },
  {
    address: { [base.id]: "0x04e2516a2c207e84a1839755675dfd8ef6302f0a" as `0x${string}` },
    name: "ZoraCreatorFixedPriceSaleStrategy",
  },
  {
    address: { [base.id]: "0xa582f080c36b7551dbc541a0cffeb6101183c9b3" as `0x${string}` },
    name: "ZoraTimedSaleStrategy",
  },
  {
    address: { [base.id]: "0x8e860e0f9dce5ffc507661ac606c8f1546aaefcc" as `0x${string}` },
    name: "ThatsGnarlyCultureIndex",
  },
  {
    address: { [base.id]: "0x858b85803f3424c36cafb50d50c019bd7cf84f1e" as `0x${string}` },
    name: "MintHouse",
  },
  {
    address: { [base.id]: "0x7777777f279eba3d3ad8f4e708545291a6fdba8b" as `0x${string}` },
    name: "ZoraProtocolRewards",
  },
];

const abisToGenerateEth = [
  {
    address: "0xa2327a938Febf5FEC13baCFb16Ae10EcBc4cbDCF",
    name: "USDC",
  },
  {
    address: "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
    name: "NounsToken",
  },
  { address: "0x138d8aef5cbbbb9ea8da98cc0847fe0f3b573b40", name: "NounsBuilderManagerV1" },
  {
    name: "NounsBuilderGovernorV1",
    address: {
      [mainnet.id]: "0x46eA3fd17DEb7B291AeA60E67E5cB3a104FEa11D",
    },
  },
  {
    name: "NounsDAOLogicV3",
    address: {
      [mainnet.id]: "0xdd1492570beb290a2f309541e1fddcaaa3f00b61",
    },
  },
  {
    name: "NounsDAOLogicV2",
    address: {
      [mainnet.id]: "0x51c7d7c47e440d937208bd987140d6db6b1e4051",
    },
  },
  {
    name: "NounsDAOLogicV1",
    address: { [mainnet.id]: "0xa43aFE317985726E4e194eb061Af77fbCb43F944" },
  },
  {
    name: "AlloV2",
    address: {
      [mainnet.id]: "0xb087535db0df98fc4327136e897a5985e5cfbd66",
    },
  },
  {
    name: "AlloRegistry",
    address: {
      [mainnet.id]: "0xa3fd7042f83960398de6ceddbf513f8cac877cbe",
    },
  },
  {
    name: "MultiCall3",
    address: {
      [mainnet.id]: "0xca11bde05977b3631167028862be2a173976ca11",
    },
  },
  {
    //usdc
    name: "SuperToken",
    address: {
      [mainnet.id]: "0xeb69ed9143d33d5fbad67f394456f212c65c1544",
    },
  },
] satisfies Omit<ContractConfig, "abi">[];

export default defineConfig([
  {
    out: "web3/wagmi.ts",
    contracts: [],
    plugins: [
      etherscan({ apiKey: etherscanApiKey, chainId: mainnet.id, contracts: abisToGenerateEth }),
      etherscan({ apiKey: etherscanApiKey, chainId: sepolia.id, contracts: abisToGenerateSepolia }),
      etherscan({ apiKey: basescanApiKey, chainId: base.id, contracts: abisToGenerateBase }),
    ],
  },
]);
