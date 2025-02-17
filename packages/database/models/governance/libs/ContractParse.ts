import { ExecutionData } from "../IProposal";
import { decodeAbiParameters, parseAbiParameters } from "viem";

const NOUNS_DAO_USDC_CONTRACT = "0xd97bcd9f47cee35c0a9ec1dc40c1269afc9e8e1d";
const USDC_TOKEN = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

const decodeCalldata = (signature: string, callData: string) => {
  try {
    const args = signature.match(/\(([^)]*)\)/);
    if (!args || !args[1]) throw new Error("No args found");
    const params = parseAbiParameters(args[1]);
    return decodeAbiParameters(params, callData as `0x${string}`) as [string, bigint];
  } catch (e: any) {
    console.error("Couldn't decode calldata", { signature, callData, error: e.message });
  }
};

export const getUsdcPayoutForExecutionData = (executionData?: ExecutionData) => {
  if (!executionData) return 0;

  //for every transaction in the execution data, get the calldata decoded
  const calldataDecoded = executionData
    .filter(
      ({ target }) =>
        target.toLowerCase() === NOUNS_DAO_USDC_CONTRACT || target.toLowerCase() === USDC_TOKEN,
    )
    .filter(
      execution =>
        execution.calldata &&
        execution.signature &&
        execution.calldata.length > 3 &&
        execution.signature.includes("("),
    )
    .map(execution => decodeCalldata(execution.signature as string, execution.calldata as string));

  //make an array of all the calldata decoded values
  const payouts = calldataDecoded.map(data => {
    //filter out the first param, which is the address
    return data?.[1] || BigInt(0);
  });

  //get total payout in usdc
  const totalPayout = payouts.reduce((acc, payout) => acc + payout, BigInt(0));

  //return usdc base unit in dollars
  return Number(totalPayout) / 1000000;
};
