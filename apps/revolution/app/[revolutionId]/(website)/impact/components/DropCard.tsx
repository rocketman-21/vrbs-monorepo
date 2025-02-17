import { IDrop } from "@cobuild/database/types";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import { Countdown } from "app/components/Countdown";
import { UserProfile } from "app/components/user-profile/UserProfile";
import Image from "next/image";
import Link from "next/link";
import { DropMintButton } from "./DropMintButton";

interface Props {
  drop: IDrop;
  revolutionName: string;
}

export const DropCard = (props: Props) => {
  const { drop, revolutionName } = props;

  const splitPercent = Math.floor(drop.splitToDAOBps / 1e4);

  return (
    <div className="bg-card group rounded-xl">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-200">
        <Image
          src={drop.metadata.image}
          alt={drop.metadata.name}
          width={384}
          height={384}
          className="h-full w-full object-cover"
        />

        <div className="absolute right-0 top-2">
          <Tooltip
            subtitle={`Every mint earns this builder votes in ${revolutionName} DAO.`}
            title={`This mint shares ${splitPercent}% of proceeds with the Vrbs treasury.`}
          >
            <div className="bg-secondary-300 text-secondary-950 inline-block rounded-l-md px-3 py-1 text-xs font-semibold tracking-tighter antialiased">
              {splitPercent}%
            </div>
          </Tooltip>
        </div>

        {/* <div className="gradient-mask-t-0 absolute inset-x-0 bottom-0 top-1/2 backdrop-blur-xl" /> */}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-b from-transparent to-black/60 p-3 pt-10">
          <h3 className="line-clamp-2 text-balance text-base font-semibold tracking-tighter">
            <a
              href={drop.url}
              className="text-white duration-100 ease-in-out hover:underline"
              target="_blank"
            >
              {drop.metadata.name}
            </a>
          </h3>

          <UserProfile address={drop.collectionOwner} revolutionId={drop.revolutionId}>
            {profile => (
              <Link
                href={`/${drop.revolutionId}/users/${profile.username}`}
                className="mt-1 flex items-center space-x-1.5 text-xs text-white hover:underline"
              >
                <Avatar id={profile.address} imageUrl={profile.profilePicture} size={20} />
                <span className="">{profile.displayUsername}</span>
              </Link>
            )}
          </UserProfile>
        </div>
      </div>

      <div className="flex min-h-14 items-center justify-between p-3">
        <Tooltip subtitle={`Total minted: ${Intl.NumberFormat("en").format(drop.totalMinted)}`}>
          <div className="flex items-center text-sm font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 256 256"
              className="mr-1 size-5 shrink-0"
            >
              <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88Zm48-88a8 8 0 0 1-8 8h-32v32a8 8 0 0 1-16 0v-32H88a8 8 0 0 1 0-16h32V88a8 8 0 0 1 16 0v32h32a8 8 0 0 1 8 8Z"></path>
            </svg>
            {Intl.NumberFormat("en", { notation: "compact" }).format(drop.totalMinted)}
          </div>
        </Tooltip>
        {drop.isMintingOpen && (
          <div className="flex items-center space-x-2.5">
            {!drop.isMintOpenForever && (
              <Countdown
                targetTime={new Date(Number(drop.saleConfig.saleEnd) * 1000).toISOString()}
                maxItems={3}
                className="text-xs tracking-tighter"
              />
            )}

            <DropMintButton
              chainId={drop.chainId}
              contract={drop.contract}
              tokenId={drop.tokenId}
            />
          </div>
        )}
      </div>
    </div>
  );
};
