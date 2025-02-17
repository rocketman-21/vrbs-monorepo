import { base } from "viem/chains";
import { IRevolutionConfig } from "../interfaces";

const config: IRevolutionConfig = {
  revolutionToken: {
    address: "0x0d49bfa99ef1b37c60d4e5b8cf5e5435fd3fd79b",
    chainId: base.id,
  },
  auctionLaunchTime: new Date("2024-05-21T23:00:00.000Z"),
  auctionPreLaunchPlaceholderImage: "/images/durian/placeholder.png",
  darkMode: false,
  name: "DurianDAO",
  homepageRedirect: "auction",
  votesShortName: "pulp",
  aboutBackgroundPattern: "/images/durian/durian_mission.png",
  missionBackgroundPattern: "/images/durian/durian_mission.png",
  missionIllustration: "/images/durian/durian_mission.png",
  url: "duriandao.lol",
  logoUrl: "/images/durian/logo_square.png",
  faviconUrl: "/images/durian/logo_square.png",
  socialLinks: {
    twitter: "https://twitter.com/DurianDaolol",
    telegram: "https://t.me/duriandao",
  },
  font: "Roboto Mono",
  hiddenMenuItems: ["stories", ""],
  customMenuItems: [
    { url: "creations", name: "Art Race", icon: null },
    // { url: "grants", name: "Grants", icon: null },
    // { url: "build", name: "Let's Build", icon: null },
  ],
  landingPage: {
    tagline: "Enjoy your day, eat durian. Plant trees for public good benefits.",
    baseDomain: "duriandao.lol",
    backdropImage: "/images/durian/durian_mission.png",
  },
  colorPalette: { lead: "yellow", secondary: "green" },
  backgroundPattern: null,
  backgroundColor: "#fff",
  cardColor: "#fafafa",
  hashtag: "pulpy",
  palette: {
    light: {
      background: "#fff",
      card: "#fafafa",
      lead: "yellow",
      secondary: "green",
    },
    dark: {
      background: "#18181b",
      card: "#27272a",
      lead: "yellow",
      secondary: "green",
    },
  },
  defaultSeo: {
    title: "Durian DAO",
    description: "Enjoy your day, eat durian. Plant trees for public good benefits.",
  },
};

export default config;
