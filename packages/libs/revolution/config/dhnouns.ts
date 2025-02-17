import { optimism } from "viem/chains";
import { IRevolutionConfig } from "../interfaces";

const config: IRevolutionConfig = {
  darkMode: true,
  revolutionToken: {
    address: "0x206825ca958b9e7df846047a6665e7f976c55c6d",
    chainId: optimism.id,
  },
  creationOrientation: "vertical",
  auctionLaunchTime: new Date("2024-04-01T18:01:00.000Z"),
  homepageRedirect: "auction",
  name: "Downhill Nouns DAO",
  url: "dhnouns.com",
  logoUrl: "/images/dhnouns/logo.png",
  faviconUrl: "/images/dhnouns/logo.png",
  parent: { revolutionId: "thatsgnarly" },
  hiddenMenuItems: ["grants", "build", "", "stories"],
  customMenuItems: [
    { url: "creations", name: "Downhill Race", icon: null },
    { url: "goals/1", name: "Contest", icon: null },
  ],
  font: "Roboto Mono",
  landingPage: {
    tagline: "",
    backdropImage: "/images/dhnouns/banner.png",
    baseDomain: "thatsgnar.ly/dhnouns",
  },
  backgroundColor: "#fff",
  cardColor: "#fafafa",
  missionIllustration: "/images/dhnouns/busfriends.webp",
  missionBackgroundPattern: "/images/dhnouns/dh_pattern.jpg",
  backgroundPattern: { color: "teal", opacity: 0.025 },
  colorPalette: { lead: "lime", secondary: "amber" },
  hashtag: "dhnouns",
  defaultSeo: {
    title: "Downhill Nouns",
    description:
      "Somos una comunidad que se une por los deportes de descenso de gravedad, downhill skateboarding, roller inline, downhill street luge, nos apasiona la práctica del deporte y nos motiva mejorar y compartir descensos en comunidad.",
  },
};

export default config;
