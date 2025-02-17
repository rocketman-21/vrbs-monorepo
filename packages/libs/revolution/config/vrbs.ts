import { base } from "viem/chains";
import { IRevolutionConfig } from "../interfaces";

const config: IRevolutionConfig = {
  revolutionToken: {
    address: "0x9ea7fd1b8823a271bec99b205b6c0c56d7c3eae9",
    chainId: base.id,
  },
  auctionLaunchTime: new Date("2024-03-05T18:01:00.000Z"),
  auctionPreLaunchPlaceholderImage: "https://i.imgur.com/f5I74RW.png",
  darkMode: false,
  brandResources:
    "https://revolution.mypinata.cloud/ipfs/QmWTAMVMX1w7GSdVnmLh2xAkGFkXeRrsMuPEKgH2gs7nkn",
  name: "Vrbs",
  homepageRedirect: "auction",
  missionBackgroundPattern: "/images/vrbs/pattern_05.png",
  missionIllustration: "/images/vrbs/illustration.jpg",
  aboutBackgroundPattern: "/images/vrbs/pattern_07.png",
  faqBackgroundPattern: "/images/vrbs/vrbs-pattern.svg",
  url: "vrbs.build",
  logoUrl: "/images/vrbs/logo.svg",
  faviconUrl: "/images/vrbs/logo.png",
  socialLinks: {
    twitter: "https://twitter.com/vrbsdao",
    discord: "https://discord.gg/abCdKVQf8a",
    farcaster: "https://warpcast.com/~/channel/vrbs",
  },
  font: "Roboto Mono",
  hiddenMenuItems: ["", "stories"],
  customMenuItems: [
    { url: "grants", name: "Grants", icon: null },
    { url: "users", name: "Builders", icon: null },
    { url: "impact", name: "Impact", icon: null },
  ],
  landingPage: {
    tagline: "Vrbs is a super community of people and a fork of @NounsDAO.",
    baseDomain: "ourrevolution.com",
    backdropImage: "/images/vrbs/backdrop.png",
  },
  colorPalette: { lead: "emerald", secondary: "amber" },
  backgroundPattern: null,
  hashtag: "vrbish",
  defaultSeo: {
    title: "Vrbs [DAO]",
    description:
      "Vrbs is a super community of people and a fork of the @NounsDAO protocol. We share a decentralized wallet, vote, and execute on culture impacting ideas. Where builders earn ownership in their movement. #vrbsdao",
  },
  palette: {
    light: {
      background: "#fff",
      card: "#fafafa",
      lead: "emerald",
      secondary: "amber",
    },
    dark: {
      background: "#18181b",
      card: "#27272a",
      lead: "emerald",
      secondary: "amber",
    },
  },
};

export default config;
