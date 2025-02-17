import "server-only";

import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { getDropCurrentTokenId } from "@cobuild/libs/web3/zora-drop/current-token-id";
import { ConditionalWrapper } from "@cobuild/ui/atoms/ConditionalWrapper";
import SvgArrowLeft from "@cobuild/ui/pixel-icons/ArrowLeft";
import SvgArrowRight from "@cobuild/ui/pixel-icons/ArrowRight";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DropNavigationKeyboard } from "./DropNavigationKeyboard";

interface Props {
  tokenId: string;
  revolutionId: string;
}

export const DropNavigation = async (props: Props) => {
  const { revolutionId } = props;

  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution || !revolution.addresses?.drop) notFound();

  const currentTokenId = Number(
    await getDropCurrentTokenId(revolution.addresses?.drop, revolution.chainId),
  );

  const tokenId = Number(props.tokenId);

  const previousTokenUrl = tokenId > 1 ? `/${revolutionId}/drop/${tokenId - 1}` : null;
  const nextTokenUrl = tokenId < currentTokenId ? `/${revolutionId}/drop/${tokenId + 1}` : null;

  return (
    <div className="flex items-center justify-center space-x-4">
      <DropNavigationKeyboard previousTokenUrl={previousTokenUrl} nextTokenUrl={nextTokenUrl} />
      <ArrowButton url={previousTokenUrl} type="previous" />
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
        className="border-lead-600 dark:border-lead-300 enabled:dark:hover:bg-lead-300 enabled:hover:bg-lead-600 text-lead-600 dark:text-lead-300 rounded-full border p-1 duration-150 ease-in-out enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:enabled:hover:text-black"
        disabled={url === null}
      >
        <Icon className="size-5" />
      </button>
    </ConditionalWrapper>
  );
};
