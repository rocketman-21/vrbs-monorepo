import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { getNounsProposalThreshold } from "@cobuild/libs/web3/nouns";
import { getNounsBuilderProposalThreshold } from "@cobuild/libs/web3/nounsbuilder";
import { getRevolutionProposalThreshold } from "@cobuild/libs/web3/revolution/proposalThreshold";

export async function getProposalThreshold(revolutionId: string): Promise<string> {
  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution) throw new Error("Revolution not found");

  const { governanceType, chainId, daoContract } = revolution;

  if (!daoContract) return "0";

  switch (governanceType) {
    case "nouns":
      return getNounsProposalThreshold(daoContract, chainId);
    case "nounsbuilder":
      return getNounsBuilderProposalThreshold(daoContract, chainId);
    case "revolution":
      return getRevolutionProposalThreshold(daoContract, chainId);
  }
}
