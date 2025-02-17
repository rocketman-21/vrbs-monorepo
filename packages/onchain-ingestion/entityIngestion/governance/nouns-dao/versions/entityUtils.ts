export const generateNounishGovernanceEntityId = (chainId: number, tokenContract: `0x${string}`) =>
  `ethereum-${chainId}-nouns-${tokenContract}`;

export const generateNounsBuilderGovernanceEntityId = (
  chainId: number,
  tokenContract: `0x${string}`,
) => `ethereum-${chainId}-nounsbuilder-${tokenContract}`;
