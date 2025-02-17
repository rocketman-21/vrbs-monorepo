"use client";

import { useUser } from "@cobuild/libs/hooks/useUser";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { Button } from "@cobuild/ui/atoms/Button";
import { Popover } from "@cobuild/ui/molecules/Popover/Popover";
import { Votes } from "app/components/Votes";
import { getRevolutionSocials } from "app/libs/social";
import { useRevolution } from "app/libs/useRevolution";
import clsx from "classnames";
import { Balances } from "./Balances";
import { ConnectedChain } from "./ConnectedChain";
import { ProfileHeader } from "./ProfileHeader";
import { UserBreakdown } from "./UserBreakdown";

interface Props {
  user: `0x${string}`;
  nfts: { name: string; imageUrl: string; tokenId: string }[];
}

export const AvatarMenu = (props: Props) => {
  const { user, nfts } = props;
  const { profile, logout, votingPower } = useUser();
  const { socialLinks } = useRevolution();

  const socials = getRevolutionSocials(socialLinks);

  return (
    <Popover
      button={({ isOpen }) => (
        <span
          className={clsx("group flex items-center rounded-xl pr-2 duration-100 ease-in-out", {
            "bg-zinc-100/95 hover:bg-zinc-100/80 dark:bg-zinc-800": !isOpen,
            "bg-secondary-100 dark:bg-secondary-300 dark:text-secondary-950": isOpen,
          })}
        >
          <Avatar
            id={user}
            imageUrl={profile?.profilePicture}
            size="24"
            className="ease-in-out group-hover:opacity-80"
          />
          <span className="ml-1.5 min-w-[20px] text-[13px] font-medium leading-[26px]">
            <Votes>{votingPower}</Votes>
          </span>
        </span>
      )}
      placement="bottom-end"
    >
      {({ close, isOpen }) => (
        <div className="mt-2.5 w-full overflow-hidden rounded-lg md:w-[400px] md:border md:border-zinc-100 md:bg-white/95 md:shadow-lg md:backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-800/95">
          <ProfileHeader close={close} user={user} />

          <UserBreakdown isOpen={isOpen} nfts={nfts} />

          <Balances address={user} className="px-2.5 py-5" />

          <ConnectedChain />

          <div className="flex items-center justify-between rounded-b-lg bg-zinc-50 px-5 py-2.5 pt-5 dark:bg-zinc-900">
            <div className="flex space-x-3">
              {socials.map(social => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="nofollow noreferrer noopener"
                  className="hover:text-lead-400 dark:hover:text-lead-300 text-zinc-400 duration-100"
                >
                  <social.Icon className="size-[18px]" aria-label={social.name} />
                </a>
              ))}
            </div>

            <Button
              size="sm"
              color="transparent"
              onClick={() => {
                logout();
                close();
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      )}
    </Popover>
  );
};
