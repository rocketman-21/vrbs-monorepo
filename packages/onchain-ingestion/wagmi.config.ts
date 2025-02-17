/* eslint-disable turbo/no-undeclared-env-vars */
import { defineConfig } from "@wagmi/cli";
import { etherscan } from "@wagmi/cli/plugins";
import { base, mainnet } from "viem/chains";

const etherscanApiKey = `${process.env.ETHERSCAN_API_KEY}`;
const basescanApiKey = `${process.env.BASESCAN_API_KEY}`;

const abisToGenerateBase = [
  {
    address: { [base.id]: "0x8e860e0f9dce5ffc507661ac606c8f1546aaefcc" as `0x${string}` },
    name: "ThatsGnarlyCultureIndex",
  },
];

export default defineConfig({
  out: "web3/wagmi.ts",
  plugins: [
    etherscan({ apiKey: basescanApiKey, chainId: base.id, contracts: abisToGenerateBase }),
    etherscan({
      apiKey: etherscanApiKey,
      chainId: mainnet.id,
      contracts: [
        {
          name: "NounsBuilderManagerImplV1",
          address: {
            [mainnet.id]: "0x138D8Aef5Cbbbb9Ea8da98CC0847FE0F3b573b40",
          },
        },
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
          name: "GnarsDAOProxyV2",
          address: {
            [mainnet.id]: "0x249846ee9acfdcd7685ec7fd7ab02d536d343e3d",
          },
        },
        {
          name: "NounsBRDAOLogicV1",
          address: {
            [mainnet.id]: "0x23039028b1891b6db2764a5b6a5113b131608d1a",
          },
        },
        {
          name: "NounsToken",
          address: {
            [mainnet.id]: "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
          },
        },
        {
          name: "NounsAuctionHouse",
          address: { [mainnet.id]: "0xf15a943787014461d94da08ad4040f79cd7c124e" },
        },
        //gnars v2?
        {
          name: "SkateContractV2AuctionHouseV2",
          address: { [mainnet.id]: "0xee16206051c9c59668de0d370c008ec1b1bbc249" },
        },
      ],
    }),
  ],
});
