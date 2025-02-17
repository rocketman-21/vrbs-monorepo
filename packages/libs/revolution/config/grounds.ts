import { base, baseSepolia } from "viem/chains";
import { IRevolutionConfig } from "../interfaces";

const config: IRevolutionConfig = {
  revolutionToken: {
    address: "0xebf2d8b25d3dcc3371d54c6727c207c4f3080b8c",
    chainId: base.id,
  },
  auctionLaunchTime: new Date("2024-04-08T23:00:00.000Z"),
  auctionPreLaunchPlaceholderImage: "https://i.imgur.com/QZ0ST0M.png",
  darkMode: false,
  name: "Grounds",
  homepageRedirect: "auction",
  votesShortName: "beans",
  aboutBackgroundPattern: "/images/grounds/grounds_pattern.png",
  missionBackgroundPattern: "https://i.imgur.com/NyPlMYv.jpeg",
  missionIllustration: "/images/grounds/mission_illustration.jpg",
  url: "groundsdao.wtf",
  logoUrl: "/images/grounds/logo.svg",
  faviconUrl: "/images/grounds/logo_square.png",
  socialLinks: {
    twitter: "https://twitter.com/groundsdao",
    telegram: "https://t.me/groundsdao",
    farcaster: "https://warpcast.com/~/channel/groundsdao",
  },
  font: "Roboto Mono",
  aboutTagline: "Ground fresh, daily.",
  hiddenMenuItems: ["stories", ""],
  customMenuItems: [
    { url: "creations", name: "Art Race", icon: null },
    // { url: "grants", name: "Grants", icon: null },
    // { url: "build", name: "Let's Build", icon: null },
  ],
  landingPage: {
    tagline: "Wake up! Be bold, pour freely, and brew good.",
    baseDomain: "grounds.build",
    backdropImage: "/images/grounds/backdrop.png",
  },
  colorPalette: { lead: "red", secondary: "brown" },
  backgroundPattern: null,
  backgroundColor: "#fff",
  cardColor: "#fafafa",
  hashtag: "groundish",
  palette: {
    light: {
      background: "#fff",
      card: "#fafafa",
      lead: "red",
      secondary: "brown",
    },
    dark: {
      background: "#18181b",
      card: "#27272a",
      lead: "red",
      secondary: "brown",
    },
  },
  defaultSeo: {
    title: "Grounds DAO",
    description: "Wake up! Be bold, pour freely, and brew good.",
  },
};

export default config;
