import { IRevolutionConfig } from "../interfaces";

const config: IRevolutionConfig = {
  darkMode: false,
  name: "Surfguru DAO",
  url: "thatsgnar.ly/surfguru",
  logoUrl: "https://revolution.mypinata.cloud/ipfs/QmS83eUhgTmz53Pmrfr51jVh4QVTiXM2jiCtKzhzph38rv",
  faviconUrl:
    "https://revolution.mypinata.cloud/ipfs/QmS83eUhgTmz53Pmrfr51jVh4QVTiXM2jiCtKzhzph38rv",
  parent: { revolutionId: "thatsgnarly" },
  landingPage: {
    tagline: "Surfe, ganhe dinheiro e impulsione iniciativas globais.",
    backdropImage: "/images/surfguru/banner.jpeg",
    baseDomain: "thatsgnar.ly/surfguru",
  },
  colorPalette: { lead: "cyan" },
  backgroundPattern: null,
  hashtag: "surfguru",
  socialLinks: {
    discord: "https://www.instagram.com/surfgurupro",
    twitter: "https://www.twitter.com/surfgurupro",
  },
  defaultSeo: {
    title: "Surfguru",
    description:
      "Surfe, ganhe dinheiro e impulsione iniciativas globais, tudo isso abraçando o espírito Aloha e protegendo nossos oceanos.",
  },
};

export default config;
