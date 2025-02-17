import { baseSepolia } from "viem/chains";
import { IRevolutionConfig } from "../interfaces";

const config: IRevolutionConfig = {
  auctionLaunchTime: new Date("2024-03-22T00:00:00.000Z"),
  auctionPreLaunchPlaceholderImage: "https://i.imgur.com/f5I74RW.png",
  darkMode: false,
  name: "NFT BR",
  url: "co.build",
  missionBackgroundPattern: "/images/nftbr/pattern.png",
  missionIllustration: "/images/nftbr/illustration.jpg",
  logoUrl: "/images/nftbr/logo.png",
  faviconUrl: "/images/nftbr/logo.png",
  socialLinks: {
    twitter: "https://twitter.com/_nft_brasil",
  },
  font: "Roboto Mono",
  hiddenMenuItems: ["stories"],
  customMenuItems: [
    { url: "creations", name: "Art", icon: null },
    { url: "auction", name: "Auction", icon: null },
    { url: "build", name: "Let's Build", icon: null },
  ],
  landingPage: {
    tagline: "Principal encontro das comunidades Web 3.0 do Brasil.",
    baseDomain: "co.build",
    backdropImage: "/images/nftbr/backdrop.png",
  },
  colorPalette: { lead: "yellow" },
  backgroundPattern: null,
  backgroundColor: "#fff",
  cardColor: "#fefce8",
  hashtag: "brasil",
  defaultSeo: {
    title: "NFT BR DAO",
    description: "Principal encontro das comunidades Web 3.0 do Brasil.",
  },
};

export default config;
