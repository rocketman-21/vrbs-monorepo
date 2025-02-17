import wretch from "wretch";
import { sleep } from "../utils/dom";
import { convertIpfsToHttp } from "../web3/utils";
import { pinByHash } from "./Pinata";

export async function fetchIpfsData<T>(url: string): Promise<T & { pinned: boolean }> {
  try {
    const data = await wretch()
      .options({
        signal: AbortSignal.timeout(2500),
        next: { revalidate: 10 },
      })
      .url(convertIpfsToHttp(url))
      .get()
      .json<T>();

    return { ...data, pinned: false };
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error && error.status === 403) {
      await pinByHash(url.replace("ipfs://", ""));

      await sleep(1000);

      const data = await wretch()
        .options({ signal: AbortSignal.timeout(2500), next: { revalidate: 10 } })
        .url(convertIpfsToHttp(url))
        .get()
        .json<T>();

      return { ...data, pinned: true };
    } else {
      throw error;
    }
  }
}
