import { getContract } from "viem";
import { getClient } from "../../../web3/viem/clients";
import { unstable_cache } from "next/cache";
import { gnosisDaoExecutorAbi } from "@cobuild/revolution";

export interface ExecutorData {
  avatar: `0x${string}`;
}

// function to pull all the data from the contract
export const getGnosisDAOExecutorData = (executor: `0x${string}`, chainId: number) =>
  unstable_cache(
    async () => {
      return await executorData(executor, chainId);
    },
    [executor, `${chainId}`],
    { revalidate: 180, tags: ["executor-data"] },
  );

const executorData = async (executor: `0x${string}`, chainId: number): Promise<ExecutorData> => {
  const contract = getContract({
    address: executor,
    abi: gnosisDaoExecutorAbi,
    client: { public: getClient(chainId) },
  });

  const avatar = await contract.read.avatar();

  return {
    avatar,
  };
};
