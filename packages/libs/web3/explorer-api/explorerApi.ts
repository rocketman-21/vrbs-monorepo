import "server-only";

import { base, baseSepolia, mainnet, optimism, polygon, sepolia } from "viem/chains";
import { getClient } from "../viem/clients";
import { TransactionReceipt, decodeFunctionData } from "viem";
import { multiCall3Address } from "../wagmi";
import { serialize } from "../../utils/data";
import { cacheResult } from "../../cache";
import { revolutionGrantsAbi } from "@cobuild/revolution";

export const baseBlockExplorerUrls = {
  [mainnet.id]: "https://api.etherscan.io/api",
  [sepolia.id]: "https://api-sepolia.etherscan.io/api",
  [polygon.id]: "https://api.polygonscan.com/api",
  [base.id]: "https://api.basescan.org/api",
  [baseSepolia.id]: "https://api-sepolia.basescan.org/api",
  [optimism.id]: "https://api-optimistic.etherscan.io/api",
};

const envVars = {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  [mainnet.id]: process.env.ETHERSCAN_API_KEY,
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  [sepolia.id]: process.env.ETHERSCAN_API_KEY,
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  [polygon.id]: process.env.POLYGONSCAN_API_KEY,
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  [base.id]: process.env.BASESCAN_API_KEY,
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  [baseSepolia.id]: process.env.BASESCAN_API_KEY,
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  [optimism.id]: process.env.OP_ETHERSCAN_API_KEY,
};

export async function fetchContractName(
  chainId: typeof base.id | typeof mainnet.id | typeof polygon.id,
  implementationContract: string,
): Promise<string> {
  const baseUrl = baseBlockExplorerUrls[chainId];
  const apiKey = envVars[chainId];

  if (!baseUrl || !apiKey) throw new Error(`Missing baseUrl or apiKey for chainId: ${chainId}`);

  const response = await fetch(
    `${baseUrl}?module=contract&action=getsourcecode&address=${implementationContract}&apikey=${apiKey}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch contract name: ${response.statusText}`);
  }

  const data = await response.json();
  return data.result[0].ContractName;
}

export async function getContractCreationDetails(
  chainId: typeof base.id | typeof mainnet.id | typeof polygon.id,
  contractAddresses: `0x${string}`,
): Promise<{
  contractAddress: `0x${string}`;
  creatorAddress: `0x${string}`;
  creationBlockNumber: bigint;
}> {
  const baseUrl = baseBlockExplorerUrls[chainId];
  const apiKey = envVars[chainId];

  if (!baseUrl || !apiKey) throw new Error(`Missing baseUrl or apiKey for chainId: ${chainId}`);

  const response = await fetch(
    `${baseUrl}?module=contract&action=getcontractcreation&contractaddresses=${contractAddresses}&apikey=${apiKey}`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch contract creation details: ${response.statusText} | ${chainId}: ${contractAddresses}}`,
    );
  }

  const data = await response.json();
  if (data.status !== "1") {
    throw new Error(
      `Failed to parse contract creation details: ${data.message} | ${chainId}: ${contractAddresses}}`,
    );
  }

  const creationDetailsPromises = data.result.map(async (result: any) => {
    const transactionId = result.txHash;
    const receipt = await getClient(chainId).waitForTransactionReceipt({ hash: transactionId });

    return {
      contractAddress: result.contractAddress,
      creatorAddress: result.contractCreator,
      creationBlockNumber: receipt.blockNumber,
    };
  });

  const creationDetails = await Promise.all(creationDetailsPromises);
  return creationDetails[0];
}

interface InternalTxnsParams {
  address: string;
  startblock?: number;
  endblock?: number;
  page?: number;
  offset?: number;
  sort?: "asc" | "desc";
  chainId: number;
}

export interface InternalTxn {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  to: string;
  value: string;
  contractAddress: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
  type: string;
  traceId: string;
  isError: string;
  errCode: string;
  tokenName?: string;
  tokenSymbol?: string;
  tokenDecimal?: string;
}

export const getTransactionReceiptWithRetry = async (
  hash: `0x${string}`,
  chainId: number,
  retries = 3,
): Promise<TransactionReceipt> => {
  return await cacheResult(`transaction-receipt-${hash}-${chainId}`, 21600, async () => {
    try {
      const publicClient = getClient(chainId);

      return serialize(await publicClient.waitForTransactionReceipt({ hash }));
    } catch (error) {
      if (retries === 0) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      return getTransactionReceiptWithRetry(hash, chainId, retries - 1);
    }
  });
};

export async function getInternalTxns(params: InternalTxnsParams): Promise<InternalTxn[]> {
  const {
    address,
    startblock = 0,
    endblock = 99999999,
    page = 1,
    offset = 0,
    sort = "desc",
    chainId,
  } = params;

  const url = new URL(baseBlockExplorerUrls[base.id]);
  url.searchParams.append("module", "account");
  url.searchParams.append("action", "txlistinternal");
  url.searchParams.append("address", address);
  url.searchParams.append("startblock", startblock.toString());
  url.searchParams.append("endblock", endblock.toString());
  url.searchParams.append("page", page.toString());
  url.searchParams.append("offset", offset.toString());
  url.searchParams.append("sort", sort);
  url.searchParams.append("apikey", envVars[chainId as keyof typeof envVars] || "");

  const response = await fetch(url.toString());
  const data = await response.json();

  if (data.status !== "1") {
    console.error(data);
    return [];
  }

  return (data.result as InternalTxn[]).filter(txn => txn.value !== "0");
}

export async function getERC20Transfers(params: {
  address: string;
  contractaddress?: string;
  page?: number;
  offset?: number;
  startblock?: number;
  endblock?: number;
  sort?: "asc" | "desc";
  chainId: number;
}): Promise<any[]> {
  const {
    address,
    contractaddress,
    page = 0,
    offset = 100,
    startblock = 0,
    endblock = 99999999,
    sort = "desc",
    chainId,
  } = params;

  const url = new URL(baseBlockExplorerUrls[base.id]);
  url.searchParams.append("module", "account");
  url.searchParams.append("action", "tokentx");
  url.searchParams.append("address", address);
  if (contractaddress) {
    url.searchParams.append("contractaddress", contractaddress);
  }
  url.searchParams.append("page", page.toString());
  url.searchParams.append("offset", offset.toString());
  url.searchParams.append("startblock", startblock.toString());
  url.searchParams.append("endblock", endblock.toString());
  url.searchParams.append("sort", sort);
  url.searchParams.append("apikey", envVars[chainId as keyof typeof envVars] || "");

  const response = await fetch(url.toString());
  const data = await response.json();

  if (data.status !== "1") {
    return [];
  }

  return data.result;
}

export async function getGrantsDonations(params: InternalTxnsParams): Promise<InternalTxn[]> {
  return cacheResult(`grant-donations-${params.address}-${params.chainId}`, 3600, async () => {
    const [internalTxns, usdcTransfers] = await Promise.all([
      getInternalTxns(params),
      getERC20Transfers({
        ...params,
        contractaddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
      }),
    ]);
    const { chainId } = params;
    const multicallAddress = multiCall3Address[1]; // Example multicall address

    // filter out where txn.from is from the params.address
    let updatedTxns = internalTxns.filter(
      txn => txn.from.toLowerCase() !== params.address.toLowerCase(),
    );

    updatedTxns = [
      ...updatedTxns,
      ...usdcTransfers.filter(txn => txn.from.toLowerCase() !== params.address.toLowerCase()),
    ];
    updatedTxns = await Promise.all(
      updatedTxns.map(async txn => {
        if (txn.from.toLowerCase() === multicallAddress.toLowerCase()) {
          const originalTxn = await getTransactionReceiptWithRetry(
            txn.hash as `0x${string}`,
            chainId,
          );
          txn.from = originalTxn.from;
        }
        return txn;
      }),
    );

    return updatedTxns;
  });
}

export async function getTxns(params: InternalTxnsParams): Promise<InternalTxn[]> {
  const {
    address,
    startblock = 0,
    endblock = 99999999,
    page = 1,
    offset = 0,
    sort = "desc",
    chainId,
  } = params;

  const url = new URL(baseBlockExplorerUrls[base.id]);
  url.searchParams.append("module", "account");
  url.searchParams.append("action", "txlist");
  url.searchParams.append("address", address);
  url.searchParams.append("startblock", startblock.toString());
  url.searchParams.append("endblock", endblock.toString());
  url.searchParams.append("page", page.toString());
  url.searchParams.append("offset", offset.toString());
  url.searchParams.append("sort", sort);
  url.searchParams.append("apikey", envVars[chainId as keyof typeof envVars] || "");

  const response = await fetch(url.toString());
  const data = await response.json();

  console.log({ data });

  if (data.status !== "1") {
    throw new Error(data.message || "Failed to fetch transactions");
  }

  return (data.result as InternalTxn[]).filter(
    txn =>
      (txn as any).functionName ===
      "setVotesAllocations(address[] recipients,uint32[] percentAllocations)",
  );
}

export const getExistingVoteAllocationTxns = async (): Promise<{
  voters: `0x${string}`[];
  recipients: `0x${string}`[][];
  allocations: number[][];
}> => {
  // past grants address
  const grants = "0x76cf99ebf0f1b672c1e0a2ce5d33c3a9e0ac92df";
  const txns = await getTxns({
    address: grants,
    chainId: base.id,
  });

  // remove duplicates with the same "from" and only keep the most recent of them
  // assumes txns are sorted by blockNumber in descending order
  const filtered = txns.filter(
    (txn, index, self) => index === self.findIndex(t => t.from === txn.from),
  );

  const txnData = filtered.map(txn => {
    const decoded = decodeFunctionData({
      abi: revolutionGrantsAbi,
      data: txn.input as `0x${string}`,
    });
    return {
      recipients: decoded.args[0],
      allocations: decoded.args[1],
      from: txn.from,
    };
  });

  const fromAddresses = txnData.map(txn => txn.from as `0x${string}`);
  const recipientsArrays = txnData.map(txn => txn.recipients as `0x${string}`[]);
  const allocationsArrays = txnData.map(txn => txn.allocations as number[]);

  return {
    voters: fromAddresses,
    recipients: recipientsArrays,
    allocations: allocationsArrays,
  };
};
