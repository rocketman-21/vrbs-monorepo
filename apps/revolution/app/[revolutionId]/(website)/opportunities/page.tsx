import { Grants } from "@cobuild/database/models/revolution/grants/Grants";
import { serializeSync } from "@cobuild/database/utils";
import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { EmptyState } from "@cobuild/ui/atoms/EmptyState/EmptyState";
import { Metadata } from "next";
import Image from "next/image";
import { formatEther } from "viem";
import Link from "next/link";
import { OpportunityItem } from "../grants/components/OpportunityItem";

interface Props {
  params: {
    revolutionId: string;
  };
}

export default async function GrantOpportunitiesPage(props: Props) {
  const { revolutionId } = props.params;

  const opportunities = await Grants().getOpportunities(revolutionId);

  const pools = await Grants().getOpenPools(revolutionId);

  return (
    <>
      <section className="mx-auto mt-20 w-full max-w-3xl px-3 pb-16 lg:mt-28 lg:px-6">
        <h1 className="dark:text-lead-200 text-center text-3xl font-bold tracking-tight text-zinc-900">
          Opportunities
        </h1>
        <h3 className="mt-1.5 text-center text-lg text-zinc-500">
          Help us achieve our goals and get paid for your efforts.
        </h3>
        {opportunities.length > 0 && (
          <div className="mt-10 space-y-6">
            {opportunities.map(opportunity => (
              <OpportunityItem grant={serializeSync(opportunity)} key={opportunity.alloProfileId} />
            ))}
          </div>
        )}
        {opportunities.length === 0 && (
          <EmptyState
            className="mt-16"
            text="Sorry! There aren't any opportunities currently available"
          />
        )}
      </section>
      <section className="bg-zinc-50 px-3 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="dark:text-lead-200 text-center text-2xl font-semibold tracking-tight text-zinc-900">
            Have your own idea?
          </h2>
          <h3 className="mt-1.5 text-center text-zinc-500">
            Apply for a grant within the following pools with existing budgets.
          </h3>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {pools.map(pool => (
              <Link
                href={pool.url}
                key={pool.alloProfileId}
                className="group rounded-xl bg-white p-4 shadow duration-100 ease-in-out hover:-translate-y-1"
              >
                <div className="size-12 rounded-full bg-zinc-800">
                  <Image
                    src={pool.imageUrl}
                    alt={pool.title}
                    width={48}
                    height={48}
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
                <h4 className="group-hover:text-lead-500 mt-2.5 font-semibold leading-tight tracking-tight text-zinc-800 duration-100 ease-in-out">
                  {pool.title}
                </h4>
                <h5 className="mt-1 text-sm text-zinc-500">{pool.tagline}</h5>
                <span className="bg-lead-500 mt-2 inline-block rounded-md px-2 py-1 text-xs font-medium tabular-nums text-white">
                  {Intl.NumberFormat("en", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(Number(formatEther(BigInt(pool.monthlyFlowRate))))}
                  /month
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { revolutionId } = props.params;
  const { name } = getRevolutionConfig(revolutionId);

  return {
    title: `Opportunities | ${name}`,
    description: `Check opportunities to participate in ${name}. Help us achieve our goals and get paid for your efforts.`,
  };
}
