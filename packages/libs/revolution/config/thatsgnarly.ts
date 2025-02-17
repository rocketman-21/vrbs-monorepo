import { base } from "viem/chains";
import { IRevolutionConfig } from "../interfaces";

const config: IRevolutionConfig = {
  addresses: {
    cultureIndex: "0x1806e0959f2b9cb487300302be7b283e31689ce2" as const,
    token: "0x880fb3cf5c6cc2d7dfc13a993e839a9411200c17" as const,
    drop: "0xf9a6470c704e391a64d1565ba4d50ad9c456b1dc" as const,
    mintHouse: "0x23a1eae6428ee2739830717b377534ceaa23c09f" as const,
  },
  darkMode: true,
  homepageRedirect: "drop",
  name: "That's Gnarly",
  socialLinks: {
    twitter: "https://twitter.com/thatsgnar_ly",
    farcaster: "https://warpcast.com/~/channel/gnars",
  },
  url: "thatsgnar.ly",
  hiddenMenuItems: ["faq", "dao"],
  customMenuItems: [{ url: "creations", name: "Creations", icon: null }],
  logoUrl: "/images/thatsgnarly/img/gnars.svg",
  faviconUrl: "/images/thatsgnarly/img/favicon.png",
  dao: {
    name: "Gnars DAO",
    link: "https://gnars.com",
    description:
      "Gnars DAO is an internet organization that empowers action sports athletes around the world. It is a community-owned movement that is governed by a group of action sports enthusiasts and athletes. The community has a treasaury of over $100k that it uses to fund action sports athletes and creators. It is the Red Bull of the future.",
    treasury: {
      vaults: [{ address: "0x72ad986ebac0246d2b3c565ab2a1ce3a14ce6f88", chainId: base.id }],
      tokens: [
        {
          //usdc
          address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
          chainId: base.id,
        },
      ],
    },
    entityId: "ethereum-1-nouns-0x558bfff0d583416f7c4e380625c7865821b8e95c",
    votingPowerFactor: "10000000000000000000",
  },
  landingPage: {
    tagline:
      "Discover the sickest content in action sports. \nWhere athletes earn money and ownership in their movement.",
    baseDomain: "thatsgnar.ly",
    backdropImage: "/images/thatsgnarly/img/banner.jpg",
  },
  upvoteIcon: {
    hasVotedUrl: `/images/thatsgnarly/hasVoted.svg`,
    notVotedUrl: `/images/thatsgnarly/notVoted.svg`,
    width: 16,
    height: 21,
  },
  colorPalette: { lead: "amber" },
  backgroundPattern: null,
  hashtag: "thatsgnarly",
  defaultSeo: {
    title: "That's Gnarly",
    description:
      "Discover the sickest content in action sports, where athletes earn money and ownership in their movement. #thatsgnarly",
  },
  creationOrientation: "vertical",
};

export default config;
