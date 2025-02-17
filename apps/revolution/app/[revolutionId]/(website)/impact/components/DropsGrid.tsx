import { Drops } from "@cobuild/database/models/revolution/drops/Drops";
import { IRevolution } from "@cobuild/database/types";
import { Button } from "@cobuild/ui/atoms/Button";
import EmptyState from "@cobuild/ui/atoms/EmptyState/EmptyState";
import Skeleton from "@cobuild/ui/atoms/Skeleton";
import Link from "next/link";
import { Suspense } from "react";
import { DropCard } from "./DropCard";

interface Props {
  revolution: IRevolution;
  page: number;
}

const PER_PAGE = 12;

export async function DropsGrid(props: Props) {
  const { revolution, page } = props;
  const { revolutionId } = revolution;

  const dropsCount = await Drops().countForRevolution(revolutionId);

  if (dropsCount === 0) {
    return <EmptyState text="No impact yet..." />;
  }

  const drops = Drops().getForRevolution(revolutionId, page, PER_PAGE);
  const hasMore = dropsCount > page * PER_PAGE;

  return (
    <>
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-5">
        <Suspense fallback={<Skeleton count={PER_PAGE / 3} square rounded />}>
          {(await drops).map(drop => (
            <DropCard key={drop.id} drop={drop} revolutionName={revolution.name} />
          ))}
        </Suspense>
      </div>
      <div className="mt-12 flex justify-between space-x-2.5">
        <div>
          {page > 1 && (
            <Link href={`?page=${page - 1}`}>
              <Button color="outline">&laquo; Previous</Button>
            </Link>
          )}
        </div>
        <div>
          {hasMore && (
            <Link href={`?page=${page + 1}`}>
              <Button color="outline">Next &raquo;</Button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
