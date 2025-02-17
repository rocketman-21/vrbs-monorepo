import { base, baseSepolia } from "viem/chains";
import { IRevolutionConfig } from "../interfaces";

const config: IRevolutionConfig = {
  auctionLaunchTime: new Date("2024-10-01T00:00:00.000Z"),
  auctionPreLaunchPlaceholderImage: "/images/token8/illustration.jpg",
  darkMode: false,
  name: "token8.life",
  revolutionToken: {
    chainId: baseSepolia.id,
    address: "0x97c71fcba0e75e78d22fbda1d844548aa25bd9d9",
  },
  homepageRedirect: "auction",
  url: "token8.life",
  missionBackgroundPattern: "/images/token8/pattern.png",
  missionIllustration: "/images/token8/illustration.jpg",
  logoUrl: "/images/token8/logo.png",
  faviconUrl: "/images/token8/logo.png",
  socialLinks: {
    twitter: "https://twitter.com/_nft_brasil",
  },
  font: "Roboto Mono",
  hiddenMenuItems: ["stories"],
  customMenuItems: [
    { url: "creations", name: "Art Game", icon: null },
    { url: "auction", name: "Auction", icon: null },
  ],
  landingPage: {
    tagline:
      "Cultivate spaces where technology, art, and community intertwine to educate, engage, and elevate.",
    baseDomain: "token8.life",
    backdropImage: "/images/token8/backdrop.png",
  },
  colorPalette: { lead: "slate" },
  backgroundPattern: null,
  backgroundColor: "#fff",
  cardColor: "#cbd5e1",
  hashtag: "token8",
  defaultSeo: {
    title: "Token8",
    description:
      "Cultivate spaces where technology, art, and community intertwine to educate, engage, and elevate.",
  },
};

export default config;
