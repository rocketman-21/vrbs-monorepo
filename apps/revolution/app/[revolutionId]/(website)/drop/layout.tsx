import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import Skeleton from "@cobuild/ui/atoms/Skeleton";
import { notFound } from "next/navigation";
import { PropsWithChildren, Suspense } from "react";
import { ChannelUpdates } from "../grants/components/ChannelUpdates";
import { StoriesGrid } from "../stories/components/StoriesGrid";

type Props = PropsWithChildren<{ params: { revolutionId: string } }>;

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DropLayout(props: Props) {
  const { revolutionId } = props.params;
  const revolution = await Revolutions().getById(revolutionId);

  if (!revolution || !revolution.hasDrops) notFound();

  const { farcasterChannelId } = revolution;

  return (
    <main className="relative">
      <div className="relative overflow-hidden pb-10 pt-20 lg:pt-28">{props.children}</div>

      <Suspense fallback={<Skeleton height={620} count={2} />}>
        <StoriesGrid revolutionId={revolutionId} count={8} />
      </Suspense>

      {farcasterChannelId && (
        <Suspense>
          <ChannelUpdates channelId={farcasterChannelId} revolutionId={revolutionId} />
        </Suspense>
      )}
    </main>
  );
}
