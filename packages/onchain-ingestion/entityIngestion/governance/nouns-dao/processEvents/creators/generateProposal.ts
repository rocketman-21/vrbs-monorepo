import { Proposal, ProposalStatus, GovernanceType, TrackerType } from "prisma-database";
import { OnchainEvent } from "prisma-database";
import { ExecutionData } from "@cobuild/database/models/governance/IProposal";
import { formatEther } from "viem";

interface IProposalCreatedDecodedEvent {
  id: string;
  proposer: `0x${string}`;
  targets: readonly `0x${string}`[];
  values: readonly bigint[];
  signatures: readonly string[];
  calldatas: readonly `0x${string}`[];
  startBlock?: bigint;
  endBlock?: bigint;
  startTimestamp?: number; // for nouns builder
  endTimestamp?: number; // for nouns builder
  proposalThreshold: bigint;
  description: string;
}

export const generateNounishProposal = (
  args: IProposalCreatedDecodedEvent,
  entityId: string,
  tokenContract: string | undefined,
  event: OnchainEvent,
  blockTimestamp: Date,
  type: GovernanceType,
  trackerType: TrackerType,
): Omit<Proposal, "id"> => {
  const id = args.id.toString();
  const uniqueId = `${entityId}-${id}`;
  const proposalThreshold = BigInt(args.proposalThreshold);
  const startBlock = args.startBlock ? Number(args.startBlock) : null;
  const endBlock = args.endBlock ? Number(args.endBlock) : null;
  const startDate = args.startTimestamp ? new Date(args.startTimestamp) : null;
  const endDate = args.endTimestamp ? new Date(args.endTimestamp) : null;

  const status = calculateStatus(
    startBlock,
    args.startTimestamp ?? null,
    blockTimestamp,
    event.blockNumber,
  );

  if (!startBlock && !args.startTimestamp)
    throw new Error(`No start block or timestamp found for proposal ${id}`);

  const { totalPayout, executionDatas } = getProposalPayoutAndExecutionData({
    targets: args.targets,
    values: args.values,
    signatures: args.signatures,
    calldatas: args.calldatas,
  });

  let doc: Omit<Proposal, "id"> = {
    governanceContract: event.address.toLowerCase(),
    trackerType,
    entityId,
    chainId: event.chainId,
    blockchain: "ethereum",
    customFields: null,
    auctionId: null,
    title: null,
    v: 0,
    updatedAt: new Date(),
    proposalId: id,
    network: "mainnet",
    type: type === "revolution" ? "revolution" : "nouns",
    uniqueId,
    totalVotes: "0",
    totalUniqueVotes: 0,
    tokenContract: tokenContract?.toLowerCase() ?? null,
    status,
    strategy: {
      proposalThreshold: proposalThreshold.toString(),
      snapshotBlock: Number(startBlock || 0),
    },
    creation: {
      date: blockTimestamp,
      block: event.blockNumber,
      transactionHash: event.transactionHash,
    },
    options: {
      "0": {
        name: "Against",
        voteCount: "0",
        uniqueVotes: 0,
        executionData: [],
      },
      "1": {
        name: "For",
        voteCount: "0",
        uniqueVotes: 0,
        executionData: executionDatas,
      },
      "2": {
        name: "Abstain",
        voteCount: "0",
        uniqueVotes: 0,
        executionData: [],
      },
    },
    proposer: args.proposer.toLowerCase(),
    targets: [...args.targets.map(target => target.toLowerCase())],
    values: args.values.map(d => d.toString()),
    signatures: [...args.signatures],
    calldatas: [...args.calldatas],
    payoutAmount: totalPayout as any,
    metadata: {
      startBlock,
      startDate: startBlock ? null : startDate,
      endDate: endBlock ? null : endDate,
      endBlock,
    },
    description: args.description,
    lastUpdated: {
      blockNumber: 0,
      transactionIndex: 0,
      logIndex: 0,
    },
  };

  return doc;
};

interface IProposalOnchainExecution {
  targets: readonly `0x${string}`[];
  values: readonly bigint[];
  signatures: readonly string[];
  calldatas: readonly `0x${string}`[];
}

export const getProposalPayoutAndExecutionData = (decoded: IProposalOnchainExecution) => {
  let executionDatas: ExecutionData = [];
  const { calldatas, signatures, targets, values } = decoded;

  if (!calldatas || !signatures || !targets || !values) throw new Error("Missing decoded data");

  let totalPayout = {
    quantity: BigInt(0),
    eth: BigInt(0),
  };

  for (let i = 0; i < targets.length; i++) {
    let ethValue = values[i];

    totalPayout.quantity = totalPayout.quantity + values[i];
    totalPayout.eth += ethValue;

    executionDatas.push({
      calldata: calldatas[i],
      signature: signatures[i],
      target: targets[i],
      value: {
        quantity: Number(values[i]),
        eth: parseFloat(formatEther(ethValue)),
      },
    });
  }

  return {
    totalPayout: {
      quantity: totalPayout.quantity.toString(),
      eth: parseFloat(formatEther(totalPayout.eth)),
    },
    executionDatas,
  };
};

/**
 * Calculates the status of a proposal based on its start and end blocks/timestamps and the current block number.
 *
 * @param startBlock The starting block number of the proposal.
 * @param startTimestamp The starting timestamp of the proposal.
 * @param blockTimestamp The current block timestamp.
 * @param currentBlockNumber The current block number.
 * @returns The status of the proposal.
 */
function calculateStatus(
  startBlock: number | null,
  startTimestamp: number | null,
  blockTimestamp: Date,
  currentBlockNumber: number,
): ProposalStatus {
  if (startBlock && currentBlockNumber >= startBlock) {
    return "active";
  } else if (startTimestamp) {
    return startTimestamp <= blockTimestamp.getTime() ? "active" : "pending";
  }

  return "pending";
}
