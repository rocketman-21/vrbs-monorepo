import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import UpVote from "@cobuild/ui/icons/UpVote";
import Zap from "@cobuild/ui/pixel-icons/Zap";
import clsx from "classnames";
import Image from "next/image";

type Props = {
  revolutionId: string;
  hasBeenDropped: boolean;
  hasUpvoted: boolean;
};

export const UpvoteIcon = (props: Props) => {
  const { revolutionId, hasUpvoted, hasBeenDropped } = props;

  const { upvoteIcon } = getRevolutionConfig(revolutionId);

  if (upvoteIcon) {
    return (
      <Image
        src={hasUpvoted ? upvoteIcon.hasVotedUrl : upvoteIcon.notVotedUrl}
        width={upvoteIcon.width}
        height={upvoteIcon.height}
        style={{ width: upvoteIcon.width, height: upvoteIcon.height }}
        className={clsx({
          "lg:group-hover/upvote:animate-bounce": !hasUpvoted && !hasBeenDropped,
          "size-4 lg:size-5": !upvoteIcon.width || !upvoteIcon.height,
        })}
        alt="Vote"
      />
    );
  }

  const Icon = hasUpvoted ? Zap : UpVote;

  return (
    <Icon
      className={clsx("size-4 lg:size-5", {
        "lg:group-hover/upvote:animate-bounce": !hasUpvoted && !hasBeenDropped,
      })}
    />
  );
};
