"use client";

import { useUrlState } from "@cobuild/libs/hooks/useUrlState";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { useVotesBreakdown } from "@cobuild/libs/web3/revolution/useVotesBreakdown";
import { Button } from "@cobuild/ui/atoms/Button";
import { useRevolution } from "app/libs/useRevolution";
import pluralize from "pluralize";
import { Votes, formatVotes } from "../../Votes";
import { VotingPowerIcon } from "../../VotingPowerIcon";
import { UserTokens } from "./UserTokens";

interface Props {
  isOpen: boolean;
  nfts: { name: string; imageUrl: string; tokenId: string }[];
}

export const UserBreakdown = (props: Props) => {
  const { isOpen, nfts } = props;
  const { votingPower } = useUser();

  const { addresses, descriptor, chainId, governanceType } = useRevolution();

  const { token } = useVotesBreakdown({
    chainId,
    contract: addresses?.revolutionVotingPower,
    disabled: !isOpen,
  });

  const [, openBuyPoints] = useUrlState("buyPoints");

  return (
    <div className="mt-1.5 grid w-full overflow-hidden">
      <div className="bg-zinc-50/95 p-5 dark:bg-zinc-900/95">
        <h4 className="flex items-center text-xs text-zinc-700 dark:text-zinc-200">
          <VotingPowerIcon className="mr-1.5 h-3.5 text-zinc-500 dark:text-zinc-200" /> Your voting
          power
        </h4>
        <div className="flex items-center justify-between space-x-2.5">
          <div className="mt-1.5 text-4xl font-bold tracking-tight text-zinc-800 dark:text-white">
            <Votes>{votingPower}</Votes>
          </div>
          {governanceType === "revolution" && (
            <Button
              onClick={() => openBuyPoints("true")}
              className="translate-y-0.5"
              color="outline"
            >
              Buy more
            </Button>
          )}
        </div>
      </div>
      {nfts.length > 0 && (
        <div className="bg-white/90 px-5 pb-2.5 pt-5 dark:bg-zinc-800/95">
          <div className="flex items-center justify-between">
            <h4 className="text-xs text-zinc-700 dark:text-zinc-200">
              {pluralize(descriptor?.tokenNamePrefix || "Token", 2)}
            </h4>
            {addresses?.revolutionVotingPower && (
              <div className="text-xs">
                <span className="text-zinc-500">
                  {`${token.balance || 0}`} x {formatVotes(token.weight, "revolution")}{" "}
                  <span className="mx-0.5">=</span>{" "}
                </span>
                <Votes>{token.power}</Votes>
              </div>
            )}
          </div>
          <div className="max-w-[calc(100vw-2.5rem)] md:max-w-[360px]">
            <UserTokens nfts={nfts} />
          </div>
        </div>
      )}
    </div>
  );
};
