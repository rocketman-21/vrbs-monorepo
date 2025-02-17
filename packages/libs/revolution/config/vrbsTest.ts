import { baseSepolia } from "viem/chains";
import { IRevolutionConfig } from "../interfaces";

import vrbsConfig from "./vrbs";

const config: IRevolutionConfig = {
  ...vrbsConfig,
  revolutionToken: {
    address: "0x6d128ec41c3c1d894d57b1269baec35b14a82d43",
    chainId: baseSepolia.id,
  },
  // auctionLaunchTime: new Date("2024-03-05T18:01:00.000Z"),
  // auctionPreLaunchPlaceholderImage: "https://i.imgur.com/f5I74RW.png",
  name: "Vrbs TEST",
  landingPage: {
    tagline: "Vrbs is a super community of people and a fork of @NounsDAO.",
    baseDomain: "ourrevolution.com",
    backdropImage: "/images/vrbs/backdrop.jpeg",
  },
};

export default config;
