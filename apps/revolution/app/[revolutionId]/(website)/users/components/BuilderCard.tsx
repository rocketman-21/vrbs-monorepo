import { IGrant, IProfile, IStory } from "@cobuild/database/types";
import { IUserSalary } from "@cobuild/libs/revolution/salary";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { Ether } from "@cobuild/ui/atoms/Ether";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import PlaceholderIcon from "@cobuild/ui/pixel-icons/Hourglass";
import Image from "next/image";
import Link from "next/link";
import { formatEther } from "viem";
import { GrantsBadge } from "./GrantsBadge";
import { ResidencyBadge } from "./ResidencyBadge";

interface Props {
  revolutionId: string;
  profile: IProfile;
  grants: IGrant[];
  residency?: IGrant;
  earnedForDao: number;
  stories: Pick<IStory, "title" | "slug" | "thumbnailUrl">[];
  salary: IUserSalary;
}

export const BuilderCard = (props: Props) => {
  const { revolutionId, profile, grants, residency, earnedForDao, stories, salary } = props;

  return (
    <div className="isolate flex flex-col justify-between overflow-hidden rounded-2xl bg-white shadow lg:min-h-[360px] dark:bg-zinc-800">
      <div className="p-4 lg:p-5">
        <div className="flex items-center">
          <Avatar
            id={profile.address}
            imageUrl={profile.profilePicture}
            size={48}
            className="shadow shadow-zinc-100"
          />
          <div className="ml-2.5">
            <Link
              href={`/${revolutionId}/users/${profile.username}`}
              className="hover:text-lead-500 dark:hover:text-lead-300 text-pretty text-xl font-semibold tracking-tighter text-zinc-900 duration-100 ease-in-out dark:text-zinc-50"
            >
              {profile.displayUsername}
            </Link>

            {profile.bio && (
              <p className="line-clamp-1 text-sm tracking-tighter text-zinc-500 dark:text-zinc-300">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        <div className="my-4 flex flex-wrap items-center *:mb-1 *:mr-1">
          <span className="bg-lead-500 rounded-md px-2 py-0.5 text-xs font-medium tabular-nums text-white">
            {Intl.NumberFormat("en", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(salary.yearly)}
            /year
          </span>
          {residency && <ResidencyBadge title={residency.title} />}
          {grants.length > 0 && <GrantsBadge grants={grants.filter(g => !g.isApplication)} />}
        </div>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {stories.length > 0 &&
            stories.map(s => (
              <Link
                href={`/${revolutionId}/stories/${s.slug}`}
                key={s.slug}
                className="inline-flex duration-100 ease-in-out hover:opacity-75"
              >
                <Tooltip subtitle={s.title}>
                  <Image
                    src={s.thumbnailUrl}
                    width={64}
                    height={64}
                    alt={s.title}
                    className="size-[52px] rounded-md object-cover"
                  />
                </Tooltip>
              </Link>
            ))}

          {stories.length === 0 && <ImpactPlaceholder />}
        </div>
      </div>

      <div className="mt-8 grid w-full grid-cols-2 gap-4 bg-zinc-50 p-4 lg:p-5 dark:bg-zinc-700">
        <div>
          <h5 className="text-xs tracking-tight text-zinc-500 dark:text-zinc-200">Total earned</h5>
          <div className="mt-1 items-center text-xl font-medium tracking-tight text-zinc-700 dark:text-white">
            {Intl.NumberFormat("en", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }).format(Number(formatEther(BigInt(Math.round(salary.totalEarned)))))}
          </div>
        </div>

        <div>
          <h5 className="text-xs tracking-tight text-zinc-500 dark:text-zinc-200">
            Earned for DAO
          </h5>
          <div className="mt-1 items-center text-xl font-medium tracking-tight text-zinc-700 dark:text-white">
            <Ether amount={BigInt(Math.round(earnedForDao))} symbol="Ξ" />
          </div>
        </div>
      </div>
    </div>
  );
};

function ImpactPlaceholder() {
  return (
    <Tooltip subtitle="Waiting for impact...">
      <div className="text-lead-600 flex size-11 items-center justify-center rounded-md bg-zinc-50 p-3">
        <PlaceholderIcon className="h-full w-full" />
      </div>
    </Tooltip>
  );
}
