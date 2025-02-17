import { mainnet } from "viem/chains";
import { IRevolutionConfig } from "../interfaces";

const config: IRevolutionConfig = {
  darkMode: false,
  name: "That's Nounish",
  url: "thatsnounish.com",
  logoUrl: "/images/thatsnounish/logo.svg",
  faviconUrl: "/images/thatsnounish/logo.svg",
  dao: {
    name: "Nouns DAO",
    entityId: "ethereum-1-nouns-0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
    link: "https://nouns.wtf",
    description: "Nouns DAO is an internet organization that empowers creators around the world.",
    treasury: {
      vaults: [{ address: "0x0BC3807Ec262cB779b38D65b38158acC3bfedE10", chainId: mainnet.id }],
      tokens: [
        {
          address: "0xae7ab96520de3a18e5e111b5eaab095312d7fe84", // Lido
          chainId: mainnet.id,
        },
      ],
    },
  },
  landingPage: {
    tagline:
      "Discover the greatest content in the Nouniverse. \n Where creators earn money and ownership in their movement.",
    baseDomain: "thatsnounish.com",
    backdropImage: "/images/thatsnounish/backdrop.jpeg",
  },
  colorPalette: { lead: "teal" },
  backgroundPattern: { color: "teal" },
  hashtag: "thatsnounish",
  defaultSeo: {
    title: "That's Nounish",
    description:
      "Discover the greatest content in the Nouniverse. Where creators earn money and ownership in their movement. #thatsnounish",
  },
};

export default config;
