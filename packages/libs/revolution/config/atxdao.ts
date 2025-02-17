import { baseSepolia } from "viem/chains";
import { IRevolutionConfig } from "../interfaces";

const config: IRevolutionConfig = {
  revolutionToken: {
    address: "0x23e425ae14efc4b8637bf8d77fb02bf5ce0d6e26",
    chainId: baseSepolia.id,
  },
  auctionLaunchTime: new Date("2024-04-15T18:01:00.000Z"),
  auctionPreLaunchPlaceholderImage: "/images/atxdao/placeholder.png",
  darkMode: false,
  name: "ATX DAO",
  aboutTagline: "Elevating Austin, one Noun at a time",
  homepageRedirect: "auction",
  missionIllustration: "/images/atxdao/illustration.jpg",
  aboutBackgroundPattern: "/images/atxdao/austin_noggles.jpeg",
  url: "atxdao.wtf",
  logoUrl: "/images/atxdao/logo.png",
  faviconUrl: "/images/atxdao/logo.png",
  socialLinks: {
    twitter: "https://twitter.com/atxdao",
    discord: "https://discord.gg/fCG8B9vN7z",
    instagram: "http://instagram.com/atx.dao",
  },
  font: "Roboto Mono",
  hiddenMenuItems: ["stories", "", "build"],
  customMenuItems: [
    // { url: "grants", name: "Grants", icon: null },
    // { url: "build", name: "Let's Build", icon: null },
  ],
  landingPage: {
    tagline:
      "A nonprofit operating as a DAO (decentralized autonomous organization) focused on mobilizing the local web3 community to support the city of Austin.",
    baseDomain: "atxdao.wtf",
    backdropImage: "/images/atxdao/illustration.jpg",
  },
  colorPalette: { lead: "orange", secondary: "slate" },
  backgroundPattern: null,
  hashtag: "atxdao",
  defaultSeo: {
    title: "ATX DAO",
    description:
      "ATX DAO is a city DAO working to unite Austin's crypto communities, enable artists and local businesses to participate in the crypto ecosystem, and educate the government about the benefits of Web3.",
  },
  palette: {
    light: {
      background: "#fff",
      card: "#fafafa",
      lead: "orange",
      secondary: "slate",
    },
    dark: {
      background: "#18181b",
      card: "#27272a",
      lead: "orange",
      secondary: "slate",
    },
  },
};

export default config;
