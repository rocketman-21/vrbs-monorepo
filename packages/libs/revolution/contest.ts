"use server";

import { baseContestAbi } from "@cobuild/revolution";
import { getContract } from "viem";
import { cacheResult } from "../cache";
import { getEthAddress } from "../utils/account";
import { getClient } from "../web3/viem/clients";
import { CultureIndexData, getCultureIndexData } from "./cultureIndex";

export interface ContestData {
  address: `0x${string}`;
  chainId: number;
  entropyRate: number;
  startTime: number;
  endTime: number;
  paused: boolean;
  paidOut: boolean;
  balance: string;
  cultureIndex: CultureIndexData;
  payoutSplits: number[];
  status: "upcoming" | "active" | "ended";
}

export async function getContestData(
  address: `0x${string}`,
  chainId: number,
): Promise<ContestData> {
  const data = await cacheResult(
    `contests-data-${address}-${chainId}`,
    Math.floor(Math.random() * 180) + 300,
    async () => {
      const contract = getContract({
        address,
        abi: baseContestAbi,
        client: { public: getClient(chainId) },
      });
      const entropyRate = Number(await contract.read.entropyRate());
      const startTime = Number(await contract.read.startTime());
      const endTime = Number(await contract.read.endTime());
      const paused = await contract.read.paused();
      const paidOut = await contract.read.paidOut();
      const cultureIndexAddress = getEthAddress(await contract.read.cultureIndex());

      const cultureIndex = await getCultureIndexData(cultureIndexAddress, chainId);

      const payoutSplits = await contract.read.getPayoutSplits();

      return {
        address: address.toLowerCase() as `0x${string}`,
        chainId,
        entropyRate,
        paidOut,
        startTime,
        endTime,
        paused,
        cultureIndex,
        payoutSplits: payoutSplits.map(Number),
      };
    },
  );

  const status = getStatus(data.startTime, data.endTime, data.paused);

  const ttl = status === "ended" ? 3600 : Math.floor(Math.random() * 300) + 300;
  const balance = await cacheResult(`contests-balance-${address}-${chainId}`, ttl, async () => {
    return (await getClient(chainId).getBalance({ address })).toString();
  });

  return { balance, status, ...data };
}

function getStatus(
  startTime: number | undefined,
  endTime: number | undefined,
  paused: boolean,
): ContestData["status"] {
  if (!startTime || !endTime || paused) return "upcoming";

  const now = new Date();
  if (now < new Date(Number(startTime) * 1000)) return "upcoming";
  if (now > new Date(Number(endTime) * 1000)) return "ended";

  return "active";
}
