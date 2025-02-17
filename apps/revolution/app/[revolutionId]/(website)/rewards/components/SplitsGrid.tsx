import "server-only";

import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { Splits } from "@cobuild/database/models/revolution/splits/Splits";
import { getUser } from "@cobuild/libs/user/server";
import { Button } from "@cobuild/ui/atoms/Button";
import Skeleton from "@cobuild/ui/atoms/Skeleton";
import SvgPlus from "@cobuild/ui/pixel-icons/Plus";
import TrendingUp from "@cobuild/ui/pixel-icons/TrendingUp";
import Link from "next/link";
import { Suspense } from "react";
import { SplitCard } from "./SplitCard";

interface Props {
  revolutionId: string;
  address?: `0x${string}`;
  page: number;
}

const PER_PAGE = 20;

export const SplitsGrid = async (props: Props) => {
  const { revolutionId, address, page } = props;

  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution || !revolution.addresses || !revolution.points) return null;

  const user = await getUser(revolutionId);

  const { chainId, addresses, points } = revolution;
  const { splitsCreator } = addresses;

  if (!splitsCreator) return null;

  const splitsCount = !address ? await Splits().countAll(splitsCreator, chainId) : undefined;

  const splits = address
    ? Splits().getForUser(address, splitsCreator, chainId)
    : Splits().getAll(splitsCreator, chainId, page, PER_PAGE);

  const hasMore = (splitsCount || 0) > page * PER_PAGE;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="flex flex-col rounded-2xl bg-white p-4 shadow lg:p-7">
        <dt className="text-2xl font-semibold text-zinc-900">
          <div className="bg-secondary-100 mb-6 flex size-12 items-center justify-center rounded-lg">
            <TrendingUp className="text-lead-500 size-6" aria-hidden="true" />
          </div>
          Earn {points.name}
        </dt>
        <p className="mt-2.5 grow text-sm text-zinc-500 sm:text-base">
          Build on our brand, it&apos;s CC0. Sell goods and services, split revenue with our
          treasury, and earn votes for yourself and your supporters in the process.
        </p>
        <Link href={`/${revolutionId}/rewards?createSplit=true`} passHref className="mt-5">
          <Button fullWidth size="md">
            Create Split <SvgPlus className="ml-1.5 size-4" />
          </Button>
        </Link>
      </div>
      <Suspense fallback={<Skeleton height={320} count={2} rounded />}>
        {(await splits)
          .sort((a, b) => parseFloat(b.earned) - parseFloat(a.earned))
          .map((split, index) => (
            <SplitCard
              key={`${split.split}`}
              index={index + 1}
              split={split}
              revolution={revolution}
              user={user}
            />
          ))}
      </Suspense>
      <div className="col-span-full flex justify-between space-x-2.5">
        <div>
          {page > 1 && (
            <Link href={`?tab=all&page=${page - 1}`}>
              <Button color="outline">&laquo; Previous</Button>
            </Link>
          )}
        </div>
        <div>
          {hasMore && (
            <Link href={`?tab=all&page=${page + 1}`}>
              <Button color="outline">Next &raquo;</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
