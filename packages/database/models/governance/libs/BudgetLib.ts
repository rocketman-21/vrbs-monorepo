import { ProposalOption } from "../IProposal";
import { getUsdcPayoutForExecutionData } from "./ContractParse";
import { Proposal } from "prisma-database";

const TOKEN_BUYER_CONTRACT = "0x4f2acdc74f6941390d9b1804fabc3e780388cfe5";

interface Payout {
  quantity: string;
  unit: string;
}

interface FundedAmount {
  eth: number;
  usdc: number;
  payouts?: Payout[];
}

//get the total funded amount for a proposal by summing the execution data values
export const getFundedAmountsForProposal = (
  options: Proposal["options"],
  executionDataAddressFilter?: string[],
): FundedAmount => {
  try {
    const filteredContracts = [...(executionDataAddressFilter || []), TOKEN_BUYER_CONTRACT];

    const payoutEth = (Object.values(options || {}) as ProposalOption[]).reduce(
      (acc: number, option: ProposalOption) => {
        return (
          acc +
          ((option.executionData as ProposalOption["executionData"])
            ?.filter(execution =>
              filteredContracts ? !filteredContracts.includes(execution.target) : true,
            )
            ?.reduce((txnValue: number, execution) => {
              return txnValue + (execution.value.eth || 0);
            }, 0) || 0)
        );
      },
      0,
    );

    const payouts: Payout[] = [];

    //get usdc
    // @ts-ignore
    const usdcPayout = getUsdcPayoutForExecutionData(options?.[1]?.executionData);

    if (usdcPayout) {
      payouts.push({ quantity: usdcPayout.toString(), unit: "USDC" });
    }

    if (payoutEth) {
      payouts.push({ quantity: payoutEth.toString(), unit: "ETH" });
    }

    return { eth: payoutEth, usdc: usdcPayout, payouts };
  } catch (e: any) {
    console.error("error getting funded amount for proposal", e.msg, options);
    return { eth: 0, usdc: 0 };
  }
};
