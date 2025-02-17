import { add } from "date-fns/add";
import {
  decodeAbiParameters,
  formatEther,
  keccak256,
  parseAbiParameters,
  stringToBytes,
} from "viem";
import { base, baseSepolia, mainnet, optimism, optimismSepolia } from "viem/chains";

function getAverageBlockTimeInSec(chainId: number): number {
  switch (chainId) {
    case baseSepolia.id:
      return 2;
    case base.id:
      return 2;
    case optimism.id:
      return 2;
    case optimismSepolia.id:
      return 2;
    case mainnet.id:
      return 13;
    default:
      return 13;
  }
}

export function calculateProposalDate(
  currentBlockNumber: number,
  proposalBlockNumber: number,
  chainId: number,
) {
  const timestamp = new Date();

  const seconds = getAverageBlockTimeInSec(chainId) * (proposalBlockNumber - currentBlockNumber);
  return add(timestamp, { seconds });
}

export function processTransactions(
  targets: string[],
  calldatas: string[],
  values: string[],
  signatures: string[],
) {
  // format each transaction nicely and return as a string
  // e.g. 0x412344312412451211.transfer()

  if (!targets || !calldatas || !values || !signatures) return "";

  const transactions = targets.map((target, i) => {
    const signature = signatures[i] || "";
    const value = BigInt(values[i]);
    const callData = calldatas[i] as `0x${string}`;

    // Split at first occurrence of '('
    let [name, types] = signature.substring(0, (signature?.length || 1) - 1)?.split(/\((.*)/s);

    if (!name || !types) {
      // If there's no signature and calldata is present, display the raw calldata
      if (callData && callData !== "0x") {
        return {
          target,
          callData: concatSelectorToCalldata(signature, callData),
          value: value > 0 ? `{ value: ${formatEther(value)} ETH } ` : "",
        };
      }

      return {
        target,
        functionSig: name === "" ? "transfer" : name === undefined ? "unknown" : name,
        callData: types ? types : value ? `${formatEther(value)} ETH` : "",
      };
    }

    try {
      const decoded = decodeAbiParameters(parseAbiParameters(types), callData);

      return {
        target,
        functionSig: name,
        callData: decoded.join(),
        value: value > 0 ? `{ value: ${formatEther(value)} ETH }` : "",
      };
    } catch (error) {
      // We failed to decode. Display the raw calldata, appending function selectors if they exist.
      return {
        target,
        callData: concatSelectorToCalldata(signature, callData),
        value: value > 0 ? `{ value: ${formatEther(value)} ETH } ` : "",
      };
    }
  });

  return transactions
    .map((transaction, index) => {
      return `${index + 1}. ${transaction.target}.${transaction.functionSig}(${
        transaction.callData
      }) ${transaction.value || ""}`;
    })
    .join("\n");
}

function concatSelectorToCalldata(signature: string, callData: string) {
  if (!signature) return callData;
  return `${keccak256(stringToBytes(signature)).substring(0, 10)}${callData.substring(2)}`;
}
