"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateAuction(revolutionId: string) {
  revalidatePath(`/${revolutionId}/auction`, "layout");
  revalidateTag("auction-item-creators");
  console.debug(`Auction revalidated (${revolutionId})`);
  return new Promise(resolve => setTimeout(resolve, 250)); // wait for revalidation to finish
}
