import { mainnet } from "viem/chains";
import { IRevolutionConfig } from "../interfaces";

const config: IRevolutionConfig = {
  darkMode: true,
  name: "Nouns",
  grantsImage: "https://i.imgur.com/KkIyGMW.jpeg",
  url: "houseofnouns.wtf/lilnouns",
  logoUrl: "/images/nouns/logo.jpg",
  faviconUrl: "/images/nouns/logo.jpg",
  dao: {
    name: "Nouns DAO",
    entityId: "ethereum-1-nouns-0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
    link: "https://nouns.wtf",

    description: "Nouns DAO is an internet organization that empowers creators around the world.",
    treasury: {
      vaults: [{ address: "0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71", chainId: mainnet.id }],
      tokens: [
        {
          address: "0xae7ab96520de3a18e5e111b5eaab095312d7fe84", // Lido
          chainId: mainnet.id,
        },
      ],
    },
  },
  homepageRedirect: "dao",
  hiddenMenuItems: ["stories", "creations", "faq", ""],
  landingPage: {
    backdropImage: "/images/thatsnounish/backdrop.jpeg",
    tagline: "Dive into Nouns.",
    baseDomain: "houseofnouns.wtf/nouns",
  },
  colorPalette: { lead: "blue" },
  backgroundPattern: { color: "red" },
  hashtag: "nouns",
  defaultSeo: {
    title: "Nouns",
    description:
      "Discover the greatest content in the Nouniverse. Where creators earn money and ownership in their movement. #thatsnounish",
  },
};

export default config;
