export enum CultureIndexMediaType {
  NONE, // never used by end user, only used in CultureIndex when using requriedMediaType
  IMAGE,
  ANIMATION,
  AUDIO,
  TEXT,
}

export enum CultureIndexRequiredMediaPrefix {
  MIXED, // IPFS or SVG
  SVG,
  IPFS,
}
