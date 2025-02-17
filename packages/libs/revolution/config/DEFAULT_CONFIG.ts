import { IRevolutionConfig } from "../interfaces";

const config: IRevolutionConfig = {
  darkMode: false,
  name: "",
  url: "",
  logoUrl: "",
  faviconUrl: "",
  homepageRedirect: "dao", //assumes HoN communities don't have config
  hiddenMenuItems: ["stories", "creations", "faq", ""],
  landingPage: {
    backdropImage: "",
    tagline: "Dive into your revolution.",
    baseDomain: "co.build",
  },
  colorPalette: { lead: "blue" },
  backgroundPattern: { color: "slate" },
  hashtag: "",
  defaultSeo: {
    title: "",
    description: "",
  },
};

export default config;
