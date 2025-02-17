import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { Submissions } from "@cobuild/database/models/revolution/submissions/Submissions";
import { Profiles } from "@cobuild/database/models/social/Profiles";
import { getUser } from "@cobuild/libs/user/server";
import { etherscanNetworkUrl } from "@cobuild/libs/utils/url";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { CreationsGrid } from "app/components/creations/CreationsGrid/CreationsGrid";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { base } from "viem/chains";
import { GrantsBio } from "./components/GrantsBio";
import { Portfolio } from "./components/Portfolio";
import { ShortBio } from "./components/ShortBio";
import { UploadImpact } from "./components/UploadImpact";
import { UserCasts } from "./components/UserCasts";
import { UserStats } from "./components/UserStats";

interface Props {
  params: {
    revolutionId: string;
    username: string;
  };
  searchParams: { page?: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = params;

  return {
    title: username,
    description: `User profile for ${username}`,
  };
}

export default async function UserPage(props: Props) {
  const { params, searchParams } = props;
  const { revolutionId, username } = params;

  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const [profile, revolution, user] = await Promise.all([
    Profiles().getByUsername(username),
    Revolutions().getById(revolutionId),
    getUser(revolutionId),
  ]);

  if (!profile) return notFound();
  if (!revolution) return notFound();

  const { bio, website, profilePicture, address, displayUsername } = profile;
  const isOwner = address === user;

  const submissionsCount = await Submissions().countByCreator(
    address,
    revolution.addresses?.cultureIndex || null,
  );
  const isCreator = submissionsCount > 0;

  return (
    <main>
      <section className="mt-20 px-4 pb-12 md:mt-32 lg:px-6">
        <div className="mx-auto grid w-full max-w-full grid-cols-1 gap-8 md:max-w-7xl md:grid-cols-8 lg:gap-x-28 lg:gap-y-20">
          <article className="md:col-span-5">
            <header className="flex items-center space-x-2.5 md:space-x-6">
              <Avatar id={address} imageUrl={profilePicture} size={80} />
              <h1 className="text-2xl font-medium tracking-tight md:text-5xl dark:text-white">
                <a
                  href={etherscanNetworkUrl(address, base.id, "address")}
                  target="_blank"
                  className="transition-opacity hover:opacity-75"
                >
                  {displayUsername}
                </a>
              </h1>
            </header>
            <ShortBio editable={isOwner} bio={bio} />
            {revolution.hasGrants && (
              <Suspense>
                <GrantsBio revolutionId={revolutionId} user={profile.address} />
              </Suspense>
            )}
            {website && (
              <div className="mt-6">
                <a
                  href={website}
                  target="_blank"
                  rel="nofollow noreferer"
                  className="text-lead-500 hover:text-lead-600 font-medium tracking-tight underline duration-100 ease-in-out"
                >
                  {website}
                </a>
              </div>
            )}
          </article>

          <aside className="col-span-1 md:col-span-3">
            <div className="space-y-6 md:sticky md:top-6 md:pb-6">
              <UserStats revolutionId={revolutionId} address={address} />
            </div>
          </aside>

          <div className="col-span-full">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold tracking-tight">Impact in {revolution.name}</h3>
              {isOwner && <UploadImpact />}
            </div>
            <section className="mt-4 border-t border-zinc-300 pt-8 dark:border-zinc-600">
              <Portfolio address={address} revolutionId={revolutionId} page={page} />
            </section>
          </div>

          {isCreator && revolution.addresses?.cultureIndex && (
            <div className="col-span-full">
              <h3 className="text-2xl font-bold tracking-tight">Creations</h3>
              <section className="mt-4 border-t border-zinc-300 pt-8 dark:border-zinc-600">
                <CreationsGrid
                  contractAddress={revolution.addresses.cultureIndex}
                  filter="user"
                  creatorAddress={profile.address}
                  columns={5}
                  perPage={15}
                />
              </section>
            </div>
          )}

          {revolution.farcasterChannelId && (
            <UserCasts
              address={address}
              channelId={revolution.farcasterChannelId}
              isOwner={isOwner}
            />
          )}
        </div>
      </section>
    </main>
  );
}
