import "server-only";

import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { getClient } from "@cobuild/libs/web3/viem/clients";
import { revolutionVotingPowerAbi } from "@cobuild/revolution";
import { cache } from "react";
import { getContract } from "viem";
import { getNounishGovernancePower } from "./nounishGovernancePower";

export const getVotingPower = cache(async (address: `0x${string}`, revolutionId: string) => {
  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution) throw new Error("Invalid revolutionId");

  const { addresses, chainId, config, tokenContract } = revolution;

  if (!addresses?.revolutionVotingPower && tokenContract) {
    return (
      BigInt(await getNounishGovernancePower(address, tokenContract, chainId, revolutionId)) *
      BigInt(config.dao?.votingPowerFactor || 1)
    ).toString();
  }

  if (!addresses?.revolutionVotingPower || !chainId) {
    return "0";
  }

  const votingPowerContract = getContract({
    client: { public: getClient(chainId) },
    address: addresses.revolutionVotingPower,
    abi: revolutionVotingPowerAbi,
  });

  const votes = await votingPowerContract.read.getVotes([address]);
  return votes.toString();
});
