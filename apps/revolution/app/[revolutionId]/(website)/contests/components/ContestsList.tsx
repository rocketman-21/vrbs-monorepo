import { Contests } from "@cobuild/database/models/revolution/contests/Contests";
import { markdownToPlainText } from "@cobuild/libs/utils/text";
import { DateLocal } from "@cobuild/ui/atoms/DateLocal";
import { EmptyState } from "@cobuild/ui/atoms/EmptyState/EmptyState";
import { Ether } from "@cobuild/ui/atoms/Ether";
import Image from "next/image";
import Link from "next/link";

interface Props {
  revolutionId: string;
}

export async function ContestsList(props: Props) {
  const { revolutionId } = props;

  const contests = await Contests().getForRevolution(revolutionId);

  return (
    <section className="bg-secondary-50 relative my-8 rounded-2xl py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex flex-col items-center justify-between max-sm:space-y-4 md:flex-row">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              All contests
            </h2>
            <p className="mt-4 leading-8 text-zinc-600 lg:text-lg">
              Check all contests that are live or will launch soon.
            </p>
          </div>
        </div>
        <table className="divide-lead-500 relative mt-8 min-w-full divide-y md:mt-12">
          <thead className="bg-secondary-50 sticky top-0">
            <tr>
              <th className="py-3.5 pr-1.5 text-left text-sm font-semibold sm:pr-3">Contest</th>
              <th className="px-1.5 py-3.5 text-sm font-semibold sm:px-3">Active Rewards</th>
              <th className="px-1.5 py-3.5 text-sm font-semibold sm:px-3">Period</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/20">
            {contests.map(contest => {
              return (
                <tr key={contest.address}>
                  <td className="py-3 pr-1 md:pr-3">
                    {contest.imageUrl && (
                      <Image
                        className="float-left mr-4 flex size-8 shrink-0 rounded-xl object-cover md:size-16"
                        src={contest.imageUrl}
                        alt={contest.name}
                        width={64}
                        height={64}
                      />
                    )}

                    <h3>
                      <Link
                        href={contest.url}
                        className="hover:text-lead-600 font-medium tracking-tight text-zinc-900 md:text-lg"
                      >
                        {contest.name}
                      </Link>
                    </h3>
                    <p className="mt-1 line-clamp-1 text-sm text-zinc-500 max-sm:hidden md:max-w-[450px] md:text-[15px]">
                      {getShortDescription(contest.description, contest.name)}
                    </p>
                  </td>
                  <td className="px-3 text-center">
                    Ξ
                    <span className="ml-1 tabular-nums">
                      <Ether amount={BigInt(contest.balance)} />
                    </span>
                  </td>
                  <td className="px-3 text-center">
                    <DateLocal
                      dateTime={new Date(contest.startTime * 1000)}
                      options={{ month: "short", day: "numeric" }}
                    />{" "}
                    -{" "}
                    <DateLocal
                      dateTime={new Date(contest.endTime * 1000)}
                      options={{ month: "short", day: "numeric" }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {contests.length === 0 && (
          <EmptyState className="mt-8" text="There aren't any active contests." />
        )}
      </div>
    </section>
  );
}

function getShortDescription(contestDescription: string, contestName: string) {
  let description = markdownToPlainText(contestDescription);
  console.log({ description, contestName, contestDescription });
  if (description.startsWith(contestName) || description.startsWith(" " + contestName)) {
    description = description.replace(contestName, "");
  }

  return description;
}
