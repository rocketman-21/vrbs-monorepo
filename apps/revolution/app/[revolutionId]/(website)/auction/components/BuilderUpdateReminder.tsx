import "server-only";

import { getFeedForFid } from "@cobuild/libs/farcaster/getCasts";
import { getFarcasterUserByEthAddress } from "@cobuild/libs/farcaster/getUser";
import { Button } from "@cobuild/ui/atoms/Button";
import DateRelative from "@cobuild/ui/atoms/DateRelative";
import { Popover } from "@cobuild/ui/molecules/Popover/Popover";
import clsx from "classnames";
import { unstable_cache } from "next/cache";

interface Props {
  user: `0x${string}`;
  channelId: string;
}

const DAYS_TO_REMIND = 5;

const contents = (lastUpdate: Date | null, channelId: string) =>
  ({
    noAccount: {
      color: "red",
      text: "You need a Farcaster account",
      modal: (
        <>
          We couldn't find Farcaster account associated with your ETH address.
          <br />
          <br />
          If you need invite, please reach out to us on Discord.
          <br />
          <br />
          <a href="https://warpcast.com/~/signup" target="_blank">
            <Button>Create account</Button>
          </a>
        </>
      ),
    },
    isUnactive: {
      color: "red",
      text: "Please post an update",
      modal: (
        <>
          {lastUpdate && (
            <>
              Your last update on <strong>/{channelId}</strong> channel was posted{" "}
              <DateRelative date={lastUpdate} />.
            </>
          )}
          {!lastUpdate && (
            <>
              You haven't posted an update on <strong>/{channelId}</strong> channel yet.
            </>
          )}
          <br />
          <br />
          Keep our community updated! It's important and helps us grow.
          <br />
          <br />
          More visitors on the site and more people bidding means a bigger salary for you.
        </>
      ),
    },
    isActive: {
      color: "green",
      text: "You're doing great!",
      modal: (
        <>
          You've posted an update on <strong>/{channelId}</strong>{" "}
          <DateRelative date={lastUpdate || new Date()} />.
          <br />
          <br />
          Keep up the good work! Your regular updates help us grow.
        </>
      ),
    },
  }) as const;

export const BuilderUpdateReminder = async (props: Props) => {
  const { user, channelId } = props;
  const { hasAccount, recentlyPostedUpdate, lastUpdate } = await getFarcasterLastUpdateFor(
    user,
    channelId,
  );

  const contentKey = hasAccount ? (recentlyPostedUpdate ? "isActive" : "isUnactive") : "noAccount";
  const { color, text, modal } = contents(lastUpdate, channelId)[contentKey];

  return (
    <Popover
      button={
        <span className="flex items-center space-x-1.5">
          <span
            className={clsx("size-2.5 rounded-full", {
              "bg-red-500": color === "red",
              "bg-green-500": color === "green",
            })}
          />
          <span className="text-xs text-white">{text}</span>
        </span>
      }
      onHover
      placement="top-start"
    >
      <div className="bg-secondary-50 dark:bg-lead-950 dark:text-lead-50 mb-1.5 max-w-72 rounded-md p-5 text-xs">
        {modal}
      </div>
    </Popover>
  );
};

const getFarcasterLastUpdateFor = unstable_cache(
  async (address: `0x${string}`, channel: string) => {
    const user = await getFarcasterUserByEthAddress(address);
    if (!user) return { hasAccount: false, lastUpdate: null, recentlyPostedUpdate: false };

    // We can't get last X casts from user AND channel, so we get all 100 recent and filter by channel on our side
    const feed = (await getFeedForFid(user.fid, 100)).filter(c => c.channel?.id === channel);

    const lastUpdate =
      feed.length > 0
        ? new Date(feed.sort((a, b) => Number(b.timestamp) - Number(a.timestamp))[0].timestamp)
        : null;

    return {
      hasAccount: true,
      lastUpdate,
      recentlyPostedUpdate: lastUpdate
        ? new Date().getTime() - lastUpdate.getTime() < 1000 * 60 * 60 * 24 * DAYS_TO_REMIND
        : false,
    };
  },
  undefined,
  { revalidate: 60 },
);
