import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { getUser } from "@cobuild/libs/user/server";
import Collapsable from "@cobuild/ui/molecules/Collapsable/Collapsable";
import { UserProfile } from "app/components/user-profile/UserProfile";
import clsx from "classnames";
import { notFound } from "next/navigation";
import { getAddress } from "viem";
import { AuctionSpeechForm } from "./AuctionSpeechForm";
import { getAuction } from "./getAuction";

interface Props {
  revolutionId: string;
  tokenId: string;
}

export const AuctionSpeech = async (props: Props) => {
  const { tokenId, revolutionId } = props;

  const [auction, revolution] = await Promise.all([
    getAuction(revolutionId, tokenId),
    Revolutions().getById(revolutionId),
  ]);
  if (!revolution) return notFound();
  if (auction.wasBurned || !auction.winner) return null;

  const speech = auction.acceptanceManifestoSpeech;

  const user = await getUser(revolutionId);
  const userIsWinner = user && user === auction.winner;

  if (!speech && !userIsWinner) return null;

  const speechLength = speech?.length || 0;

  return (
    <div className="border-lead-600 border-t p-4 lg:p-5">
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-300">
        {!userIsWinner && (
          <UserProfile address={getAddress(auction.winner)} revolutionId={revolutionId}>
            {({ displayUsername }) => <>A word from {displayUsername}</>}
          </UserProfile>
        )}
        {userIsWinner && `Your ${revolution.name} manifesto`}
      </p>
      <div className="mt-2.5">
        {speech && !userIsWinner && (
          <Collapsable collapsedHeight="128px">
            <blockquote className="flex w-full items-start text-left md:space-x-4">
              <svg
                className="text-lead-600 dark:text-lead-300 size-8 shrink-0 max-sm:hidden"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M7.39762 10.3C7.39762 11.0733 7.14888 11.7 6.6514 12.18C6.15392 12.6333 5.52552 12.86 4.76621 12.86C3.84979 12.86 3.09047 12.5533 2.48825 11.94C1.91222 11.3266 1.62421 10.4467 1.62421 9.29999C1.62421 8.07332 1.96459 6.87332 2.64535 5.69999C3.35231 4.49999 4.33418 3.55332 5.59098 2.85999L6.4943 4.25999C5.81354 4.73999 5.26369 5.27332 4.84476 5.85999C4.45201 6.44666 4.19017 7.12666 4.05926 7.89999C4.29491 7.79332 4.56983 7.73999 4.88403 7.73999C5.61716 7.73999 6.21938 7.97999 6.69067 8.45999C7.16197 8.93999 7.39762 9.55333 7.39762 10.3ZM14.6242 10.3C14.6242 11.0733 14.3755 11.7 13.878 12.18C13.3805 12.6333 12.7521 12.86 11.9928 12.86C11.0764 12.86 10.3171 12.5533 9.71484 11.94C9.13881 11.3266 8.85079 10.4467 8.85079 9.29999C8.85079 8.07332 9.19117 6.87332 9.87194 5.69999C10.5789 4.49999 11.5608 3.55332 12.8176 2.85999L13.7209 4.25999C13.0401 4.73999 12.4903 5.27332 12.0713 5.85999C11.6786 6.44666 11.4168 7.12666 11.2858 7.89999C11.5215 7.79332 11.7964 7.73999 12.1106 7.73999C12.8437 7.73999 13.446 7.97999 13.9173 8.45999C14.3886 8.93999 14.6242 9.55333 14.6242 10.3Z"
                  fill="currentColor"
                />
              </svg>
              <em
                className={clsx(
                  "text-lead-600 dark:text-lead-400 whitespace-pre-line not-italic md:italic md:leading-relaxed",
                  {
                    "text-balance text-xl font-medium": speechLength <= 25,
                    "text-balance text-lg": speechLength > 25 && speechLength <= 100,
                    "text-pretty text-sm md:text-base": speechLength > 100,
                  },
                )}
              >
                {speech}
              </em>
            </blockquote>
          </Collapsable>
        )}
        {userIsWinner && (
          <AuctionSpeechForm
            user={user}
            speech={speech}
            tokenId={tokenId}
            revolutionId={revolutionId}
          />
        )}
      </div>
    </div>
  );
};
