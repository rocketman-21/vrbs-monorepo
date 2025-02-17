import { Metadata } from "next";
import { SVGProps } from "react";
import { IBackgroundPattern, ITailwindPalette, RevolutionPalette } from "./palette";
import { RevolutionAddresses } from "../web3/viem/utils/revolutionBuilder";

export interface IRevolutionConfig {
  //new entrypoint for onchain execution
  revolutionToken?: { address: `0x${string}`; chainId: number };
  addresses?: RevolutionAddresses;
  auctionLaunchTime?: Date;
  aboutTagline?: string;
  creationOrientation?: "square" | "vertical" | "horizontal";
  grantsImage?: string;
  votesShortName?: string;
  missionIllustration?: string;
  missionBackgroundPattern?: string;
  auctionPreLaunchPlaceholderImage?: string;
  mintActionTerm?: string;
  faqBackgroundPattern?: string;
  darkMode: boolean;
  homepageRedirect?: string;
  font?: AvailableFont;
  parent?: { revolutionId: string; associatedTags?: string[] };
  socialLinks?: SocialLinks;
  brandResources?: string;
  faviconUrl?: string;
  url: string;
  dao?: {
    name: string;
    link: string;
    logoUrl?: string;
    description: string;
    treasury: {
      vaults?: EvmContract[];
      tokens?: EvmContract[];
    };
    entityId?: string;
    votingPowerFactor?: string;
  };
  backgroundColor?: string;
  aboutBackgroundPattern?: string;
  cardColor?: string;
  colorPalette: { lead: ITailwindPalette; secondary?: ITailwindPalette };
  hiddenMenuItems?: string[];
  customMenuItems?: MenuOption[];
  backgroundPattern: IBackgroundPattern | null;
  logoUrl: string;
  upvoteIcon?: { hasVotedUrl: string; notVotedUrl: string; width: number; height: number };
  name: string;
  auth?: {
    dynamic?: {
      environmentId: string;
      publicKey: string;
    };
  };

  landingPage: {
    creationCentric?: boolean;
    tagline: string;
    baseDomain: string;
    backdropImage?: string;
  };
  hashtag: string;
  defaultSeo: Metadata;
  palette?: RevolutionPalette;
}

export type SplitPercent = {
  creator: number;
  dao: number;
};

export interface SocialLinks {
  twitter?: string;
  telegram?: string;
  instagram?: string;
  youtube?: string;
  discord?: string;
  github?: string;
  reddit?: string;
  medium?: string;
  facebook?: string;
  farcaster?: string;
}

export interface MenuOption {
  url: string;
  name: string;
  icon?: ((props: SVGProps<SVGSVGElement>) => JSX.Element) | null;
  onlyMobile?: boolean;
  isExternal?: boolean;
}

export type ICreationsFilter = "recent" | "next-up" | "auctioned" | "hidden" | "mine" | "user";

export type AvailableFont = "Public Sans" | "Roboto Mono";

export interface EvmContract {
  address: `0x${string}`;
  chainId: number;
}
