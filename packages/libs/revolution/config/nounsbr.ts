import { mainnet, polygon } from "viem/chains";
import { IRevolutionConfig } from "../interfaces";

const config: IRevolutionConfig = {
  darkMode: false,
  name: "NounsBR",
  url: "thatsgnar.ly/nounsbr",
  logoUrl: "/images/nounsbr/logo.png",
  faviconUrl: "/images/nounsbr/logo.png",
  parent: { revolutionId: "thatsnounish" },
  landingPage: {
    tagline: "Supporting projects that are cool, do good and change lives ⌐🄱-🅁",
    backdropImage: "/images/nounsbr/banner.jpeg",
    baseDomain: "thatsgnar.ly/nounsbr",
  },
  dao: {
    name: "NounsBR DAO",
    link: "https://nounsbr.wtf/",
    description: "NounsBR DAO is a subdao of Nouns DAO.",
    entityId: "ethereum-1-nouns-0x36b2aa1795d8cdef4b784fe34045fadc45d61e8c",
    treasury: {
      vaults: [
        { address: "0x6159B003fF5a37de6Ca0859f4617e9A0064226d1", chainId: mainnet.id },
        {
          address: "0xd77EB37dBE6743094f46939cCe8b3bfC93b2116E",
          chainId: polygon.id,
        },
      ],
    },
  },
  colorPalette: { lead: "lime" },
  backgroundPattern: null,
  hashtag: "nounsbr",
  defaultSeo: {
    title: "NounsBR",
    description:
      "Apoiando projetos que são legais, fazem o bem e mudam vidas ⌐🄱-🅁. Junte-se ao nosso movimento hoje.",
  },
  socialLinks: {
    twitter: "https://www.twitter.com/nounsbr",
  },
};

export default config;
