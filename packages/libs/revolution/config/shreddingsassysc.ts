import { getPalette } from "../palette";
import { IRevolutionConfig } from "../interfaces";

const config: IRevolutionConfig = {
  darkMode: true,
  name: "Shredding Sassy",
  url: "skateboardingcares.com/shreddingsassysc",
  faviconUrl:
    "https://revolution.mypinata.cloud/ipfs/Qmf6NSfCdum4nW19gQy1XjbwB46byVUFX5AY4qY3TwsgTn",
  logoUrl: "https://revolution.mypinata.cloud/ipfs/Qmf6NSfCdum4nW19gQy1XjbwB46byVUFX5AY4qY3TwsgTn",
  parent: { revolutionId: "skateboardingcares", associatedTags: ["shreddingsassy"] },
  landingPage: {
    tagline:
      "A lifestyle brand where passionate people come together to make the world a better place.",
    backdropImage:
      "https://revolution.mypinata.cloud/ipfs/QmYXoR2wnU4TrnLzmHcygXcCxSuNwGg4833Mk4T1z1z7si",
    baseDomain: "skateboardingcares.com/shreddingsassysc",
  },
  cardColor: getPalette("purple")[950],
  backgroundPattern: null,
  colorPalette: { lead: "purple" },
  hashtag: "shreddingsassy",
  defaultSeo: {
    title: "Shredding Sassy",
    description:
      "At the intersection of action sports and web3 culture, we're unifying a global community of shredders & shaping the future together.",
  },
  socialLinks: {
    twitter: "https://twitter.com/ShreddingSassy",
  },
};

export default config;
