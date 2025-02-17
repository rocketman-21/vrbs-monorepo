"use server";

import { sleep } from "@cobuild/libs/utils/dom";
import { revalidateTag } from "next/cache";

export async function revalidateTags(tags: string[], sleepTime = 200): Promise<void> {
  tags.map(tag => revalidateTag(tag));
  await sleep(sleepTime); // wait for revalidation to finish
  return;
}
