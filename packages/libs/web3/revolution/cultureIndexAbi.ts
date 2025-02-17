import { cultureIndexAbi } from "@cobuild/revolution";
import { CultureIndexVersion } from "prisma-database";

export function getCultureIndexAbi(version: CultureIndexVersion) {
  switch (version) {
    case "v1":
      return cultureIndexAbi;
    default:
      throw new Error(`Couldn't find Abi for Culture Index: ${version}`);
  }
}
