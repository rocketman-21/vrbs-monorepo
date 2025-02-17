const colors = {
  for: "#068940",
  against: "#D22209",
  abstain: "#a1a1aa",
  yes: "#068940",
  no: "#D22209",
  approve: "#068940",
} as const;

export function getOptionColor(name: string) {
  return colors.hasOwnProperty(name.toLowerCase())
    ? colors[name.toLowerCase() as keyof typeof colors]
    : undefined;
}

export type PresetOption = "For" | "Against" | "Abstain";

export function isPresetOption(name: string): name is PresetOption {
  return ["For", "Against", "Abstain"].includes(name);
}

export function calculateCutoffsForVote(
  count: bigint,
  total: bigint,
  maxTicks: bigint = BigInt(40),
) {
  if (total === BigInt(0)) return 0;
  const cutoffs = Math.floor((Number(count) / Number(total)) * Number(maxTicks));
  return Number.isNaN(cutoffs) ? 0 : cutoffs;
}
