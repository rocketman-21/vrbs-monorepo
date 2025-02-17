import "server-only";

import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { getBalanceInEth } from "@cobuild/libs/web3/balance";
import { Price } from "@cobuild/ui/molecules/Price/Price";
import { notFound } from "next/navigation";

interface Props {
  revolutionId: string;
}

export async function Numbers(props: Props) {
  const { revolutionId } = props;

  const [revolution, membersCount, ideasCounts, fundedAmounts] = await Promise.all([
    Revolutions().getById(revolutionId),
    Revolutions().getTotalMembers(revolutionId),
    Revolutions().getUniqueIdeaCounts(revolutionId),
    Revolutions().getTotalFunded(revolutionId),
  ]);

  if (!revolution) return notFound();

  const treasuryBalance = await getBalanceInEth(revolution.treasury || []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-center dark:text-zinc-100">
          Build with us
        </h2>
        <p className="mt-2.5 leading-7 text-zinc-600 lg:text-center dark:text-zinc-300">
          The {revolution.name} ecosystem gives you the tools and support you need to bring your
          best ideas to life.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-8 lg:mt-16 lg:max-w-none lg:flex-row lg:items-end">
        <div className="dark:bg-card flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-zinc-50 p-8 sm:w-3/4 sm:max-w-md sm:flex-row-reverse sm:items-end lg:w-72 lg:max-w-none lg:flex-none lg:flex-col lg:items-start">
          <p className="flex-none text-2xl font-bold text-zinc-900 lg:text-3xl dark:text-zinc-100">
            {new Intl.NumberFormat("en").format(membersCount.total)}
          </p>
          <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Members</p>
            <p className="mt-2 text-base leading-7 text-black/60 dark:text-white/60">
              Excited to give your project or idea a try.
            </p>
          </div>
        </div>
        <div className="bg-lead-600 flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl p-8 sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-sm lg:flex-auto lg:flex-col lg:items-start lg:gap-y-44">
          <div className="flex-none text-2xl font-bold text-white lg:text-3xl">
            <Price className="" currentCurrency={"eth"} desiredCurrency={"usd"}>
              {treasuryBalance}
            </Price>{" "}
            in our treasury
          </div>
          <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
            <p className="text-lg font-semibold text-white">Funding your biggest ideas</p>
            <p className="mt-2 text-base leading-7 text-white/70 dark:text-white/80">
              We are committed to funding people and projects that are building and growing{" "}
              {revolution.name}.
            </p>
          </div>
        </div>
        <div className="bg-secondary-200 flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl p-8 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start lg:gap-y-28">
          <div className="flex-none text-2xl font-bold text-black lg:text-3xl">
            {new Intl.NumberFormat("en").format(ideasCounts.total)} unique ideas{" "}
            {fundedAmounts.total > 0 && <>funded</>}
          </div>
          <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
            <p className="text-lg font-semibold text-black">{revolution.name} funds you</p>
            <p className="mt-2 text-base leading-7 text-black/60">
              Creators and builders are rewarded by the community via automatic payments.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
