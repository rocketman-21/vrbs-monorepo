import { IRevolutionConfig } from "../interfaces";

const config: IRevolutionConfig = {
  darkMode: true,
  name: "Coletivo XV",
  url: "skateboardingcares.com/coletivoxv",
  logoUrl: "https://i.imgur.com/2LW2Qbh.png",
  faviconUrl: "https://i.imgur.com/2LW2Qbh.png",
  parent: { revolutionId: "skateboardingcares" },
  landingPage: {
    tagline: "Skate Urbano, Arte e Ativismo na Praça XV desde 1997.",
    backdropImage:
      "https://revolution.mypinata.cloud/ipfs/bafkreig4kijxm7y6xppzprzaz2fxaf4dqdfcvv4u3rf3p3qsmag3ynmlfa",
    baseDomain: "skateboardingcares.com/coletivoxv",
  },
  backgroundPattern: null,
  colorPalette: { lead: "red" },
  hashtag: "ilovexv",
  defaultSeo: {
    title: "Coletivo XV",
    description: "Skate Urbano, Arte e Ativismo na Praça XV desde 1997.",
  },
  socialLinks: {
    instagram: "https://instagram.com/coletivoxv",
  },
};

export default config;
