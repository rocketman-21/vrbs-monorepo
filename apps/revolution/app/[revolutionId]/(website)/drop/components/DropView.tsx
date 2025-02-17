import "server-only";

import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { Button } from "@cobuild/ui/atoms/Button";
import Skeleton from "@cobuild/ui/atoms/Skeleton";
import { Countdown } from "app/components/Countdown";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DropMetadata } from "./DropMetadata";
import { DropNavigation } from "./DropNavigation";
import { getDrop } from "./getDrop";
import { UserProfile } from "app/components/user-profile/UserProfile";
import Link from "next/link";
import { Avatar } from "@cobuild/ui/atoms/Avatar";

const DropMint = dynamic(() => import("./DropMint").then(mod => mod.DropMint), {
  ssr: false,
});

interface Props {
  revolutionId: string;
  tokenId: string;
}

export const DropView = async (props: Props) => {
  const { tokenId, revolutionId } = props;

  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution || !revolution.hasDrops) notFound();

  const drop = await getDrop(revolutionId, tokenId);
  if (!drop) notFound();

  return (
    <div className="relative mx-auto grid max-w-full gap-8 rounded-2xl px-4 md:max-w-screen-xl lg:min-h-96 lg:grid-cols-2 lg:px-6">
      <Suspense fallback={<Skeleton className="aspect-square w-full rounded-xl" height="auto" />}>
        <DropMetadata revolutionId={revolutionId} tokenId={tokenId} />
      </Suspense>

      <div className="group relative flex max-w-full flex-col justify-center overflow-hidden rounded-r-2xl lg:px-12 lg:pb-8">
        <DropNavigation tokenId={tokenId} revolutionId={revolutionId} />

        <h1 className="text-lead-600 dark:text-lead-300 mt-4 text-center text-3xl font-bold lg:mt-10 lg:text-5xl">
          {drop.metadata.name || `Drop ${tokenId}`}
        </h1>

        <div className="mt-3 flex w-full justify-center">
          <UserProfile address={drop.saleConfig.fundsRecipient} revolutionId={revolutionId}>
            {profile => (
              <div>
                <Link
                  href={`/${revolutionId}/users/${profile.username}`}
                  className="hover:text-lead-500 dark:hover:text-lead-300 inline-flex w-full items-center space-x-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-100"
                >
                  <span>by</span>
                  <Avatar
                    id={drop.saleConfig.fundsRecipient}
                    size={20}
                    imageUrl={profile.profilePicture}
                  />
                  <span>{profile.displayUsername}</span>
                </Link>
              </div>
            )}
          </UserProfile>
        </div>

        {drop.metadata.description && (
          <span className="mt-6 whitespace-pre-line text-pretty text-center text-sm text-zinc-700 dark:text-zinc-300">
            {drop.metadata.description}
          </span>
        )}

        <div className="mb-4 mt-10 text-center">
          <div className="flex items-center justify-center space-x-4">
            {new Date() < new Date(Number(drop.saleConfig.saleEnd) * 1000) && (
              <DropMint
                chainId={revolution.chainId}
                contract={revolution.addresses?.drop!}
                tokenId={tokenId}
              />
            )}
            <a href={drop.zoraUrl} target="_blank">
              <Button size="lg" color="outline">
                View on Zora
              </Button>
            </a>
          </div>

          {drop.totalMinted > 0 && (
            <div className="mt-4 flex items-center justify-center text-sm text-zinc-700 dark:text-zinc-300">
              {drop.totalMinted} minted <span className="mx-1">•</span>
              <Countdown
                targetTime={new Date(Number(drop.saleConfig.saleEnd) * 1000).toISOString()}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
