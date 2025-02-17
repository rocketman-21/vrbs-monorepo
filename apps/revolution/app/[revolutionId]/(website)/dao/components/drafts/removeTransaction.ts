"use server";

import { database } from "@cobuild/database";
import { TransactionType } from "@cobuild/database/types";
import { isEthAddress } from "@cobuild/libs/utils/account";
import { isValidChainId } from "@cobuild/libs/web3/utils";
import { reportApiError } from "@cobuild/libs/utils/apiError";
import { z } from "zod";
import { getUser } from "@cobuild/libs/user/server";

const schema = z.object({
  type: z.nativeEnum(TransactionType),
  from: z.custom<string>(val => isEthAddress(`${val}`), "Invalid vault's address"),
  target: z.custom<string>(val => isEthAddress(`${val}`), "Invalid recipient's address"),
  amount: z.number().min(0),
  contractAddress: z
    .custom<string>(val => !val || isEthAddress(`${val}`), "Invalid Vault")
    .optional(),
  chainId: z.custom<number>(val => isValidChainId(Number(val)), "Invalid Chain ID"),
  symbol: z.string().min(2).max(8),
  revolutionId: z.string(),
});

export async function removeTransaction(draftId: string, args: z.infer<typeof schema>) {
  try {
    if (!draftId) throw new Error("Missing draftId");
    const data = schema.parse(args);

    const user = await getUser(data.revolutionId);

    if (!user) throw new Error("Unauthorized");

    const draft = await database.draft.findUnique({ where: { draftId } });

    if (!draft) throw new Error("Draft not found");

    if (!draft.team.includes(user) && user !== draft.address) throw new Error("Unauthorized");

    const updatedTransactions = draft.transactions.filter(txn => {
      return !(
        txn.type === data.type &&
        txn.from === data.from &&
        txn.target === data.target &&
        txn.amount === data.amount &&
        txn.chainId === data.chainId &&
        txn.symbol === data.symbol &&
        (txn.contractAddress || "") === (data.contractAddress || "")
      );
    });

    console.log({ txns: draft.transactions, updatedTransactions, data });

    await database.draft.update({
      where: { draftId },
      data: { transactions: updatedTransactions },
    });
  } catch (error: any) {
    console.error(error, args);
    reportApiError(error, args, "remove-draft-transaction");
    throw error;
  }
}
