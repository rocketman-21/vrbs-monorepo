import "server-only";

import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { Submissions } from "@cobuild/database/models/revolution/submissions/Submissions";
import { serialize } from "@cobuild/database/utils";
import { Skeleton } from "@cobuild/ui/atoms/Skeleton";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CreationsGridItem } from "../creations/CreationsGrid/CreationsGridItem";

interface Props {
  revolutionId: string;
}

export const Creations = async (props: Props) => {
  const { revolutionId } = props;

  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution) notFound();

  if (!revolution.addresses?.cultureIndex) return null;

  const { submissions } = await Submissions().getForScope({
    contractAddress: revolution.addresses.cultureIndex,
    filter: "recent",
    perPage: 20,
  });

  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 xl:gap-4">
      <Suspense fallback={<Skeleton count={4} height={256} className="md:h-80 dark:bg-zinc-900" />}>
        {submissions.map(async submission => (
          <CreationsGridItem
            key={submission.id}
            submission={await serialize(submission, ["creatorProfiles"])}
          />
        ))}
      </Suspense>
    </div>
  );
};
