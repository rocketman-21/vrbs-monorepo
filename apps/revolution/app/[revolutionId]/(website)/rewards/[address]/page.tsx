import "server-only";

import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { Profiles } from "@cobuild/database/models/social/Profiles";
import { getUser } from "@cobuild/libs/user/server";
import { getEthAddress } from "@cobuild/libs/utils/account";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { UserProfile } from "app/components/user-profile/UserProfile";
import { Suspense } from "react";
import { RewardsClaim } from "../components/RewardsClaim";
import { SplitStats } from "../components/SplitStats";
import { SplitsGrid } from "../components/SplitsGrid";

interface Props {
  params: {
    revolutionId: string;
    address: string;
  };
}

export default async function UserRewardsPage(props: Props) {
  ``;
  const { revolutionId, address: rawAddress } = props.params;

  const address = getEthAddress(rawAddress);

  const [revolution, user, profile] = await Promise.all([
    Revolutions().getById(revolutionId),
    getUser(revolutionId),
    Profiles().get(address),
  ]);

  if (!revolution || !revolution.addresses || !revolution.points) return null;

  const { chainId, addresses } = revolution;

  if (!addresses.splitsCreator) return null;

  return (
    <>
      <section className="mx-auto mt-24 flex w-full max-w-7xl flex-col px-4 md:mt-32 md:flex-row md:items-center md:justify-between md:space-x-12 lg:px-6">
        <div>
          <div className="flex flex-row items-center space-x-4">
            <UserProfile
              profile={profile}
              address={address}
              revolutionId={revolutionId}
              withPopover
            >
              {({ profilePicture, displayUsername }) => (
                <div className="hover:text-lead-600 inline-flex items-center space-x-2.5 text-2xl font-bold sm:text-4xl">
                  <Avatar id={address} imageUrl={profilePicture} size={48} className="size-6" />
                  <h5>{displayUsername}</h5>
                </div>
              )}
            </UserProfile>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl">splits</h2>
          </div>
          <div className="mt-2.5 space-y-1.5 text-zinc-500">
            <Suspense>
              <SplitStats
                chainId={chainId}
                splitsCreator={addresses.splitsCreator}
                entityName={profile.username}
                controller={address}
              />
            </Suspense>
          </div>
        </div>
        {user === address && (
          <RewardsClaim chainId={chainId} splitsCreator={addresses.splitsCreator} user={address} />
        )}
      </section>

      <section className="mt-12 bg-zinc-100 py-12">
        <div className="mx-auto w-full max-w-7xl space-y-6 px-4 lg:px-6">
          <SplitsGrid revolutionId={revolutionId} address={address} page={1} />
        </div>
      </section>
    </>
  );
}
