import { IRevolutionConfig } from "../interfaces";

const config: IRevolutionConfig = {
  darkMode: true,
  name: "FLYING NOMADS DAO",
  url: "thatsgnar.ly/flyingnomads",
  logoUrl: "/images/flyingnomads/logo.png",
  faviconUrl: "/images/flyingnomads/logo.png",
  parent: { revolutionId: "thatsgnarly" },
  landingPage: {
    tagline: "Voe, ganhe dinheiro e impulsione iniciativas globais.",
    backdropImage: "/images/flyingnomads/banner.jpg",
    baseDomain: "thatsgnar.ly/flyingnomads",
  },

  colorPalette: { lead: "orange" },
  backgroundPattern: null,
  hashtag: "flyingnomads",
  socialLinks: {
    discord: "https://www.instagram.com/flyingnomads.com.br",
    twitter: "https://www.twitter.com/flyingnomads",
  },
  defaultSeo: {
    title: "FLYING NOMADS",
    description:
      "FLYING NOMADS - /ˈflīiNG ˈnōˌmads/ Pessoas capazes de se mover pelo ar e que viajam permanentemente de um lugar para outro. Voe, ganhe dinheiro e impulsione iniciativas globais que promovem a preservação da natureza.",
  },
};

export default config;
