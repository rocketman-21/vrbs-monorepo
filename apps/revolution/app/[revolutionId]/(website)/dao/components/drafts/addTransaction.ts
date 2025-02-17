"use server";

import { database } from "@cobuild/database";
import { TransactionType } from "@cobuild/database/types";
import { getUser } from "@cobuild/libs/user/server";
import { isEthAddress } from "@cobuild/libs/utils/account";
import { reportApiError } from "@cobuild/libs/utils/apiError";
import { isValidChainId } from "@cobuild/libs/web3/utils";
import omit from "lodash/omit";
import { z } from "zod";

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

export async function addTransaction(draftId: string, args: z.infer<typeof schema>) {
  try {
    if (!draftId) throw new Error("Missing draftId");
    const data = schema.parse(args);

    const user = await getUser(data.revolutionId);

    if (!user) throw new Error("Unauthorized");

    const draft = await database.draft.findUnique({ where: { draftId } });

    if (!draft) throw new Error("Draft not found");

    if (!draft.team.includes(user) && user !== draft.address) throw new Error("Unauthorized");

    const existingTransaction = draft.transactions.find(
      txn =>
        txn.type === data.type &&
        txn.from === data.from &&
        txn.target === data.target &&
        txn.amount === data.amount &&
        txn.chainId === data.chainId &&
        txn.symbol === data.symbol &&
        (txn.contractAddress || "") === (data.contractAddress || ""),
    );

    if (existingTransaction) {
      throw new Error("Transaction already exists on the draft");
    }

    await database.draft.update({
      where: { draftId },
      data: { transactions: { push: omit(data, "revolutionId") } },
    });
  } catch (error: any) {
    console.error(error, args);
    reportApiError(error, args, "add-draft-transaction");
    throw error;
  }
}
