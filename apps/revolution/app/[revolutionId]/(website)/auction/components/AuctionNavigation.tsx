import "server-only";

import { ConditionalWrapper } from "@cobuild/ui/atoms/ConditionalWrapper";
import { DateLocal } from "@cobuild/ui/atoms/DateLocal";
import SvgArrowLeft from "@cobuild/ui/pixel-icons/ArrowLeft";
import SvgArrowRight from "@cobuild/ui/pixel-icons/ArrowRight";
import Link from "next/link";
import { AuctionNavigationKeyboard } from "./AuctionNavigationKeyboard";
import { getAuction } from "./getAuction";

interface Props {
  tokenId: string;
  revolutionId: string;
}

export const AuctionNavigation = async (props: Props) => {
  const { revolutionId } = props;

  const auction = await getAuction(revolutionId, props.tokenId);

  const tokenId = Number(props.tokenId);
  const currentTokenId = Number(auction.currentTokenId);

  const previousTokenUrl = tokenId > 0 ? `/${revolutionId}/auction/${tokenId - 1}` : null;
  const nextTokenUrl = tokenId < currentTokenId ? `/${revolutionId}/auction/${tokenId + 1}` : null;

  return (
    <div className="flex items-center justify-center space-x-4">
      <AuctionNavigationKeyboard previousTokenUrl={previousTokenUrl} nextTokenUrl={nextTokenUrl} />
      <ArrowButton url={previousTokenUrl} type="previous" />

      <DateLocal
        className="opacity-70"
        dateTime={auction.details.startTime}
        options={{ year: "numeric", month: "long", day: "numeric" }}
      />

      <ArrowButton url={nextTokenUrl} type="next" />
    </div>
  );
};

const ArrowButton = (props: { url: string | null; type: "previous" | "next" }) => {
  const { url, type } = props;

  const Icon = type === "previous" ? SvgArrowLeft : SvgArrowRight;

  return (
    <ConditionalWrapper
      condition={url !== null}
      wrapper={children => (
        <Link href={`${url}`} className="inline-flex">
          {children}
        </Link>
      )}
    >
      <button
        className="border-lead-600 enabled:hover:bg-lead-600 text-lead-600 rounded-full border p-1 duration-150 ease-in-out enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        disabled={url === null}
      >
        <Icon className="h-5 w-5" />
      </button>
    </ConditionalWrapper>
  );
};
