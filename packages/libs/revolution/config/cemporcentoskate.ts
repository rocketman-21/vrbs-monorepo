import { IRevolutionConfig } from "../interfaces";

const config: IRevolutionConfig = {
  darkMode: true,
  name: "100% SKATE",
  url: "skateboardingcares.com/100skate",
  logoUrl: "https://i.imgur.com/TlK5AcG.png",
  faviconUrl: "https://i.imgur.com/TlK5AcG.png",
  parent: { revolutionId: "skateboardingcares" },
  landingPage: {
    tagline: "pólo de mídia brasileira especializada em skate",
    backdropImage: "https://i.imgur.com/3NNrWa5.jpeg",
    baseDomain: "skateboardingcares.com/100skate",
  },
  backgroundPattern: null,
  colorPalette: { lead: "slate" },
  hashtag: "100%skate",
  defaultSeo: {
    title: "100% SKATE",
    description: "pólo de mídia brasileira especializada em skate",
  },
  socialLinks: {
    instagram: "https://www.instagram.com/cemporcentoskate",
    twitter: "https://twitter.com/skate_",
  },
};

export default config;
