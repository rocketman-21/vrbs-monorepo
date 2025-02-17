import { mainnet } from "viem/chains";
import { IRevolutionConfig } from "../interfaces";

const config: IRevolutionConfig = {
  darkMode: false,
  name: "Lil Nouns",
  url: "houseofnouns.wtf/lilnouns",
  logoUrl: "/images/lilnouns/logo.png",
  faviconUrl: "/images/lilnouns/logo.png",
  dao: {
    name: "Lil Nouns DAO",
    entityId: "ethereum-1-nouns-0x4b10701bfd7bfedc47d50562b76b436fbb5bdb3b",
    link: "https://lilnouns.wtf",
    description:
      "Lil Nouns DAO is an internet organization that empowers creators around the world.",
    treasury: {
      vaults: [{ address: "0xd5f279ff9EB21c6D40C8f345a66f2751C4eeA1fB", chainId: mainnet.id }],
      tokens: [
        {
          address: "0xae7ab96520de3a18e5e111b5eaab095312d7fe84", // Lido
          chainId: mainnet.id,
        },
      ],
    },
  },
  homepageRedirect: "dao",
  hiddenMenuItems: ["stories", "visionaries", "creations", "faq", ""],
  landingPage: {
    backdropImage: "/images/lilnouns/backdrop.png",
    tagline: "Dive into Nouns.",
    baseDomain: "houseofnouns.wtf/lilnouns",
  },
  colorPalette: { lead: "blue" },
  backgroundPattern: { color: "red" },
  hashtag: "lilnouns",
  defaultSeo: {
    title: "Lil Nouns",
    description:
      "Discover the greatest content in the Nouniverse. Where creators earn money and ownership in their movement. #thatsnounish",
  },
};

export default config;
