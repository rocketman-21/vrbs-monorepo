import { IRevolutionConfig } from "../interfaces";

const config: IRevolutionConfig = {
  darkMode: true,
  name: "Skatehive",
  url: "skateboardingcares.com/skatehive",
  logoUrl: "https://i.imgur.com/ybtVdoS.png",
  faviconUrl: "https://i.imgur.com/ybtVdoS.png",
  parent: { revolutionId: "skateboardingcares" },
  landingPage: {
    tagline: "The home of Web 3 skateboarders.",
    backdropImage: "https://i.imgur.com/z8vgkxC.png",
    baseDomain: "skateboardingcares.com/skatehive",
  },
  backgroundPattern: null,
  colorPalette: { lead: "orange" },
  hashtag: "skatehive",
  defaultSeo: {
    title: "Skatehive DAO",
    description: "The Web 3.0 Portal For Skateboarders",
  },
  socialLinks: {
    discord: "discord.gg/skatehive",
    twitter: "https://twitter.com/skate_hive",
  },
};

export default config;
