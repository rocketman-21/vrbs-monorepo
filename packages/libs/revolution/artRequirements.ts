import { CultureIndexData } from "./cultureIndex";
import { CultureIndexMediaType, CultureIndexRequiredMediaPrefix } from "../web3/revolution/types";

export function getArtRequirements(cultureIndex: CultureIndexData): string {
  const { requiredMediaType, requiresSvg, requiredMediaPrefix, checklist } = cultureIndex;

  let formatted = checklist;

  if (requiredMediaType > 0) formatted += `\n- ${getMediaTypeMessage(requiredMediaType)}`;

  if (requiredMediaPrefix > 0)
    formatted += `\n- File must be ${CultureIndexRequiredMediaPrefix[requiredMediaPrefix]}`;

  if (requiresSvg) formatted += "\n- Must be less than ~25KB";

  return formatted.trim();
}

function getMediaTypeMessage(mediaType: CultureIndexMediaType) {
  const type = CultureIndexMediaType[mediaType].toLowerCase();

  switch (mediaType) {
    case CultureIndexMediaType.IMAGE:
    case CultureIndexMediaType.ANIMATION:
      return `Must be an ${type}`;
    case CultureIndexMediaType.TEXT:
    case CultureIndexMediaType.AUDIO:
    default:
      return `Must be ${type}`;
  }
}
