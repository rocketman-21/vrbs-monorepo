import { base, baseSepolia, optimism } from "viem/chains";

export const REVOLUTION_BUILDER_ADDRESSES: { [chainId: number]: `0x${string}` } = {
  [baseSepolia.id]: "0x20e882943e630f54e56cc8d9320d8e4ca9e88e13",
  [base.id]: "0x4d09b3c6c1b8455e1e863da672581a2bbd5ead12",
  [optimism.id]: "0x30b54e00d54c844025fa0d73da99056c64ffa7a4",
};

export const CONTEST_BUILDER_ADDRESSES: { [chainId: number]: `0x${string}` } = {
  [baseSepolia.id]: "0x05a3910e27720aa220ddbcea8ab3fcdb2c66b768",
  [base.id]: "0xd7c51e494b778bff7334afbe38d3961935144b0a",
  [optimism.id]: "0x9e4e047004aedde4e5bd130432358f943e93ff25",
};

export const VRBS_GRANTS_PROXY = "0x12e0c1bfddcbed42a4d4bc27e946ff3ead9b3dd5";

export const GDA_FORWARDER: { [chainId: number]: `0x${string}` } = {
  [base.id]: "0x6DA13Bde224A05a288748d857b9e7DDEffd1dE08",
};

export const BASE_USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
