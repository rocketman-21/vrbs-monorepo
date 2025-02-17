import { baseGoerli, goerli, polygonMumbai, sepolia } from "viem/chains";
import { IRevolutionConfig } from "../interfaces";
import { getPalette, getStylesForBackgroundPattern, getStylesForPalette } from "../palette";
import DEFAULT_CONFIG from "./DEFAULT_CONFIG";
import cemporcentoskate from "./cemporcentoskate";
import chavemestra from "./chavemestra";
import coletivoxv from "./coletivoxv";
import dhnouns from "./dhnouns";
import flyingnomads from "./flyingnomads";
import gnarssc from "./gnarssc";
import nouns from "./nouns";
import nounsbr from "./nounsbr";
import ontheroofs from "./ontheroofs";
import shreddingsassy from "./shreddingsassy";
import shreddingsassysc from "./shreddingsassysc";
import skateboardingcares from "./skateboardingcares";
import skatecuida from "./skatecuida";
import skatehive from "./skatehive";
import surfguru from "./surfguru";
import gnarly from "./thatsgnarly";
import nounish from "./thatsnounish";
import vrbs from "./vrbs";
import nftbr from "./nftbr";
import grounds from "./grounds";
import lilnouns from "./lilnouns";
import vrbstest from "./vrbsTest";
import atxdao from "./atxdao";
import durian from "./durian";
import dfw from "./dfw";
import characters from "./characters";
import token8 from "./token8";

const configs = {
  thatsgnarly: gnarly,
  thatsnounish: nounish,
  ontheroofs: ontheroofs,
  shreddingsassy: shreddingsassy,
  surfguru: surfguru,
  dhnouns: dhnouns,
  flyingnomads: flyingnomads,
  skateboardingcares: skateboardingcares,
  nounsbr: nounsbr,
  skatehive: skatehive,
  coletivoxv: coletivoxv,
  cemporcentoskate: cemporcentoskate,
  shreddingsassysc: shreddingsassysc,
  gnarssc: gnarssc,
  skatecuida: skatecuida,
  chavemestra: chavemestra,
  nouns: nouns,
  vrbs: vrbs,
  nftbr: nftbr,
  grounds: grounds,
  lilnouns: lilnouns,
  vrbstest: vrbstest,
  atxdao: atxdao,
  durian: durian,
  dfw: dfw,
  characters: characters,
  token8: token8,
} as const;

export type IRevolutionId = keyof typeof configs;
export const TESTNET_CHAIN_IDS: number[] = [goerli.id, sepolia.id, polygonMumbai.id, baseGoerli.id];

export const getRevolutionConfig = (revolutionId: string): IRevolutionConfig => {
  if (!isValidLegacyRevolutionId(revolutionId)) {
    return DEFAULT_CONFIG; // make sure to populate
  }
  return configs[revolutionId];
};

const isValidLegacyRevolutionId = (revolutionId: string): revolutionId is IRevolutionId => {
  return !!revolutionId && configs.hasOwnProperty(revolutionId);
};

export function getRevolutionStyles(revolutionId: string) {
  const config = getRevolutionConfig(revolutionId);

  if (config.palette) return undefined;

  // Palette 1.0
  return {
    ...getStylesForPalette(config.colorPalette.lead, "lead"),
    ...(config.colorPalette.secondary
      ? getStylesForPalette(config.colorPalette.secondary, "secondary")
      : {}),
    ...getStylesForBackgroundPattern(config.backgroundPattern),
    ["--color-bg"]: getRevolutionBackgroundColor(config.backgroundColor, config.darkMode),
    ["--color-card"]: getRevolutionCardColor(config.cardColor, config.darkMode),
  };
}

export function getRevolutionPalette(revolutionId: string) {
  const { colorPalette } = getRevolutionConfig(revolutionId);
  return getPalette(colorPalette.lead);
}

function getRevolutionBackgroundColor(backgroundColor?: string, darkMode?: boolean) {
  if (backgroundColor) return backgroundColor;
  return darkMode ? "#111" : "#f7f7f7";
}

function getRevolutionCardColor(cardColor?: string, darkMode?: boolean) {
  if (cardColor) return cardColor;
  return darkMode ? "#18181b" : "#fff";
}

export function getRevolutionThemeColor(revolutionId: string) {
  const config = getRevolutionConfig(revolutionId);

  if (config.darkMode) {
    return getRevolutionBackgroundColor(config.backgroundColor, config.darkMode);
  }

  return getRevolutionPalette(revolutionId)[100];
}
