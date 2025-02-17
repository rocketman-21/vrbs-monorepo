import { getChannelFeedForAddress } from "@cobuild/libs/farcaster/getCasts";
import { Cast } from "app/components/farcaster/Cast";
import EmptyState from "@cobuild/ui/atoms/EmptyState/EmptyState";
import { shortenIfEthAddress } from "@cobuild/libs/utils/account";
import { CastWithInteractions } from "@cobuild/libs/farcaster/client";
import { Button } from "@cobuild/ui/atoms/Button";

interface UserCastsProps {
  address: `0x${string}`;
  channelId: string;
  isOwner: boolean;
}

export const UserCasts = async ({ address, channelId, isOwner }: UserCastsProps) => {
  const { connected, casts: recentCasts } = await getChannelFeedForAddress(address, channelId);

  const columnsThree: CastWithInteractions[][] = [[], [], []];
  const columnsTwo: CastWithInteractions[][] = [[], []];

  recentCasts
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    .forEach((cast, index) => {
      columnsThree[index % 3].push(cast);
      columnsTwo[index % 2].push(cast);
    });

  columnsThree.forEach(column => column.sort((a, b) => Number(a.timestamp) - Number(b.timestamp)));
  columnsTwo.forEach(column => column.sort((a, b) => Number(a.timestamp) - Number(b.timestamp)));

  return (
    <div className="col-span-full">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold tracking-tight">Updates</h3>
        {isOwner && (
          <a href={`https://warpcast.com/~/compose?channelKey=${channelId}`} target="_blank">
            <Button>Post update</Button>
          </a>
        )}
      </div>
      <section className="mt-4 border-t border-zinc-300 pt-8 dark:border-zinc-600">
        {recentCasts.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <EmptyState>
              {!connected ? (
                <div className="flex flex-col items-center space-y-4">
                  <div>
                    Please verify wallet ({shortenIfEthAddress(address)}) on your Farcaster profile.
                  </div>
                  <div>
                    <a
                      href="https://warpcast.com/~/settings/verified-addresses"
                      target="_blank"
                      className="text-lead-500 hover:text-lead-600 dark:text-lead-300 dark:hover:text-lead-200 font-medium tracking-tight underline duration-100 ease-in-out"
                    >
                      Verify here
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <div>No casts in the /vrbs channel</div>
                  <div>
                    <a
                      href={`https://warpcast.com/~/channel/${channelId}`}
                      target="_blank"
                      className="text-lead-500 hover:text-lead-600 dark:hover:text-lead-200 dark:text-lead-200 font-medium tracking-tight underline duration-100 ease-in-out"
                    >
                      Post update
                    </a>
                  </div>
                </div>
              )}
            </EmptyState>
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-3 sm:gap-6 lg:grid">
              {columnsThree.map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col space-y-6">
                  {column.map(cast => (
                    <div key={cast.hash}>
                      <Cast cast={cast} key={cast.hash} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="hidden grid-cols-2 md:grid lg:hidden">
              {columnsTwo.map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col space-y-6">
                  {column.map(cast => (
                    <div key={cast.hash}>
                      <Cast cast={cast} key={cast.hash} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:hidden">
              {recentCasts.map(cast => (
                <div key={cast.hash} className="mb-6">
                  <Cast cast={cast} key={cast.hash} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};
