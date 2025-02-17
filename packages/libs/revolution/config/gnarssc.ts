import { IRevolutionConfig } from "../interfaces";

const config: IRevolutionConfig = {
  darkMode: true,
  name: "Gnars DAO",
  url: "skateboardingcares.com/gnarssc",
  logoUrl: "https://revolution.mypinata.cloud/ipfs/QmeShoGNBYS5kyfBjBnNzjhrQ1wq7w44y3MsXv1wrywqrr",
  faviconUrl:
    "https://revolution.mypinata.cloud/ipfs/QmeShoGNBYS5kyfBjBnNzjhrQ1wq7w44y3MsXv1wrywqrr",
  parent: { revolutionId: "skateboardingcares", associatedTags: ["thatsgnarly"] },
  landingPage: {
    tagline:
      "Gnars is a community owned action sports club. Empowering extreme athletes with a shared treasury and tools for collective creation. Make history, together.",
    backdropImage:
      "https://revolution.mypinata.cloud/ipfs/QmetuvgrejN41RqwmJmb5totL6XuirfnpJMyHVUke5Hud4",
    baseDomain: "skateboardingcares.com/gnarssc",
  },
  backgroundPattern: null,
  colorPalette: { lead: "amber" },
  hashtag: "thatsgnarly",
  defaultSeo: {
    title: "Gnars DAO",
    description:
      "Gnars is a community owned action sports club. Empowering extreme athletes with a shared treasury and tools for collective creation. Make history, together.",
  },
  socialLinks: {
    twitter: "https://twitter.com/gnars_dao",
  },
};

export default config;
