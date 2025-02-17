import { base, baseSepolia } from "viem/chains";
import { IRevolutionConfig } from "../interfaces";

const config: IRevolutionConfig = {
  revolutionToken: {
    address: "0xcb30ec2bb2e3829769c2f4fc5933474ff72eaf51",
    chainId: base.id,
  },
  auctionLaunchTime: new Date("2024-07-03T02:00:00.000Z"),
  auctionPreLaunchPlaceholderImage:
    "https://revolution.mypinata.cloud/ipfs/QmdJtXW1jBEjZ8WqoCJRnp4PkFjiGUEDkqkRdzSir7iA6Q",
  darkMode: false,
  name: "Characters",
  missionBackgroundPattern: "/images/characters/pattern.avif",
  aboutBackgroundPattern: "/images/characters/pattern.avif",
  faqBackgroundPattern: "/images/characters/pattern.avif",
  homepageRedirect: "auction",
  votesShortName: "bops",
  url: "build.characters.lol",
  logoUrl: "https://revolution.mypinata.cloud/ipfs/QmdJtXW1jBEjZ8WqoCJRnp4PkFjiGUEDkqkRdzSir7iA6Q",
  faviconUrl:
    "https://revolution.mypinata.cloud/ipfs/QmdJtXW1jBEjZ8WqoCJRnp4PkFjiGUEDkqkRdzSir7iA6Q",
  socialLinks: {
    farcaster: "https://warpcast.com/~/channel/characters",
  },
  aboutTagline: "Make the web smile with Characters",
  missionIllustration: "/images/characters/backdrop.png",
  landingPage: {
    tagline: "Embrace Expression",
    baseDomain: "build.characters.lol",
    backdropImage: "/images/characters/backdrop.png",
  },
  hiddenMenuItems: ["stories", ""],
  colorPalette: { lead: "noir", secondary: "neutral" },
  backgroundPattern: null,
  backgroundColor: "#fff",
  cardColor: "#fafafa",
  hashtag: ":^)",
  palette: {
    light: {
      background: "#fff",
      card: "#fafafa",
      lead: "noir",
      secondary: "neutral",
    },
    dark: {
      background: "#18181b",
      card: "#27272a",
      lead: "noir",
      secondary: "neutral",
    },
  },
  defaultSeo: {
    title: "Characters DAO",
    description: "Welcome Characters!",
  },
};

export default config;
