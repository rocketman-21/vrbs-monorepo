import { kv } from "@vercel/kv";

//USD value of 1
export interface Rates {
  matic: number;
  eth: number;
  updatedAt: Date;
}

const KEY = "eth_rates";

async function storePriceData(rates: Rates) {
  await kv.set(KEY, rates);
}

export async function getLatestEthRates() {
  const rates = await kv.get<Rates>(KEY);
  return rates;
}

export const fetchAndSetEthRates = async () => {
  const res = await fetch("https://production.api.coindesk.com/v2/tb/price/ticker?assets=ETH,MATIC")
    .then(coinRes => coinRes.json())
    .catch(e => console.error(e));

  const ethRate = res.data?.ETH?.ohlc?.c;
  const maticRate = res.data?.MATIC?.ohlc?.c;

  if (!ethRate && !maticRate) {
    console.error("No rates fetched");
  } else {
    const rates = {
      eth: ethRate,
      matic: maticRate,
      updatedAt: new Date(),
    };
    await storePriceData(rates);
  }
};
