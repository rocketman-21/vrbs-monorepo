import { cache } from "react";
import { getAbsoluteUrl } from "../url";

export const getEthRateData = cache(async (): Promise<{ eth: number; matic: number } | null> => {
  const res = await fetch(getAbsoluteUrl(`/crons/eth-rates/get-latest`), {
    next: { revalidate: 1 * 3600 },
  })
    .then(coinRes => coinRes.json())
    .catch(e => console.error(e));

  if (!res.eth || !res.matic) {
    console.error("No rates fetched");
    return null;
  }

  return {
    eth: res.eth,
    matic: res.matic,
  };
});
