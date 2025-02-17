import "server-only";

import { ISubmission } from "@cobuild/database/types";
import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { shortenUsername } from "@cobuild/libs/utils/account";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { Button } from "@cobuild/ui/atoms/Button";
import DateRelative from "@cobuild/ui/atoms/DateRelative";
import { ModerateButton } from "app/components/buttons/ManageButtons/ModerateButton";
import { ShareButton } from "app/components/buttons/ShareButton";
import { UserProfile } from "app/components/user-profile/UserProfile";
import Link from "next/link";
import pluralize from "pluralize";
import { MetaItem } from "./MetaItem";

interface Props {
  submission: ISubmission;
  revolutionId: string;
  canManage: boolean;
}

export const Details = async (props: Props) => {
  const { submission, revolutionId, canManage } = props;
  const {
    name,
    description,
    createdAt,
    creators,
    sponsorAddress,
    isHidden,
    hasBeenDropped,
    isOnchain,
  } = submission;

  const sponsorAddressInCreators = creators.find(c => c.address === sponsorAddress.toLowerCase());

  const { url } = getRevolutionConfig(revolutionId);

  return (
    <div className="bg-card rounded-2xl p-5">
      <h3 className="text-balance text-lg font-semibold">{name}</h3>
      {description && (
        <div className="mt-1.5 whitespace-pre-line text-pretty text-sm text-zinc-700 dark:text-zinc-400">
          {description}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-x-2.5 gap-y-4">
        {createdAt && (
          <MetaItem label="Created">
            <DateRelative date={createdAt} />
          </MetaItem>
        )}

        {isOnchain && !sponsorAddressInCreators && (
          <MetaItem label="Sponsor" columns={2}>
            <UserProfile address={sponsorAddress} revolutionId={revolutionId} withPopover>
              {({ username, profilePicture }) => (
                <Link
                  href={`/${revolutionId}/users/${username}`}
                  className="flex items-center space-x-1.5 text-sm"
                >
                  <Avatar id={sponsorAddress} imageUrl={profilePicture} size={20} />
                  <span>{shortenUsername(username)}</span>
                </Link>
              )}
            </UserProfile>
          </MetaItem>
        )}
        {creators.length > 0 && (
          <MetaItem label={pluralize("Creator", creators.length)} columns={2}>
            <div className="flex flex-col items-start space-y-2">
              {creators.map(c => (
                <UserProfile
                  address={c.address as `0x${string}`}
                  key={c.address}
                  revolutionId={revolutionId}
                  withPopover
                >
                  {({ username, profilePicture }) => (
                    <Link
                      href={`/${revolutionId}/users/${username}`}
                      className="flex items-center space-x-1.5 text-sm"
                    >
                      <Avatar id={c.address} imageUrl={profilePicture} size={20} />
                      <span>{shortenUsername(username)}</span>{" "}
                      {c.bps !== 10000 && <span className="opacity-50">{c.bps / 100}%</span>}
                    </Link>
                  )}
                </UserProfile>
              ))}
            </div>
          </MetaItem>
        )}
      </div>

      {(canManage || !isHidden) && (
        <div className="mt-6 flex items-center space-x-2.5">
          {!isHidden && (
            <ShareButton
              className="grow"
              title={submission.name}
              url={`https://${url}/${revolutionId}/creations/${submission.slug}`}
            >
              <Button color="outline" fullWidth>
                Share creation
              </Button>
            </ShareButton>
          )}

          {canManage && !hasBeenDropped && (
            <ModerateButton slug={submission.slug} isHidden={isHidden} />
          )}
        </div>
      )}
    </div>
  );
};
