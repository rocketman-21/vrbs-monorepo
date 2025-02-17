import { base } from "viem/chains";
import { IRevolutionConfig } from "../interfaces";

const config: IRevolutionConfig = {
  revolutionToken: {
    address: "0x1a1beF77b8aA987c91eDC81998347DF0ad299f94",
    chainId: base.id,
  },
  auctionLaunchTime: new Date("2024-06-15T18:01:00.000Z"),
  auctionPreLaunchPlaceholderImage: "/images/dfw/placeholder.png",
  darkMode: false,
  name: "DFW DAO",
  aboutTagline: "Creating the Future of Web3 in DFW",
  homepageRedirect: "auction",
  missionIllustration: "/images/dfw/illustration.jpg",
  aboutBackgroundPattern: "/images/dfw/austin_noggles.jpeg",
  url: "dfw.builders",
  logoUrl: "/images/dfw/logo.png",
  faviconUrl: "/images/dfw/logo.png",
  socialLinks: {
    telegram: "https://t.me/createdfw",
  },
  font: "Roboto Mono",
  hiddenMenuItems: ["stories", "", "build"],
  customMenuItems: [
    // { url: "grants", name: "Grants", icon: null },
    // { url: "build", name: "Let's Build", icon: null },
  ],
  landingPage: {
    tagline:
      "A nonprofit operating as a Dallas and Fort Worth DAOs (decentralized autonomous organization) focused on mobilizing the local web3 community to support Dallas Fort Worth.",
    baseDomain: "dfw.builders",
    backdropImage: "/images/dfw/illustration.jpg",
  },
  colorPalette: { lead: "blue", secondary: "slate" },
  backgroundPattern: null,
  hashtag: "dfwbuilders",
  defaultSeo: {
    title: "DFW DAO",
    description:
      "DFW Builders is a city DAO lead by Fort Worth DAO and Dallas DAO working to unite DFW crypto communities, enable artists and local businesses to participate in the crypto ecosystem, and educate the government about the benefits of Web3.",
  },
  palette: {
    light: {
      background: "#fff",
      card: "#fafafa",
      lead: "blue",
      secondary: "slate",
    },
    dark: {
      background: "#18181b",
      card: "#27272a",
      lead: "blue",
      secondary: "slate",
    },
  },
};

export default config;
