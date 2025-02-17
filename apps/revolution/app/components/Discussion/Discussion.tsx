import "server-only";

import { Posts } from "@cobuild/database/models/social/Posts";
import { IScope } from "@cobuild/database/types";
import { serialize } from "@cobuild/libs/utils/data";
import SvgMessageClock from "@cobuild/ui/pixel-icons/MessageClock";
import AddComment from "./AddComment";
import Comments from "./Comments";

interface Props {
  scope: IScope;
  variant?: "base" | "compact";
  autofocus?: boolean;
}

export const Discussion = async (props: Props) => {
  const { scope, variant, autofocus } = props;

  const comments = await Posts().getForScope(scope.id);

  return (
    <div className="space-y-6">
      <AddComment scope={scope} variant={variant} autofocus={autofocus} />

      {comments.length > 0 && <Comments comments={serialize(comments)} variant={variant} />}
      {comments.length === 0 && (
        <div className="mt-8 flex flex-col items-center justify-center">
          <SvgMessageClock className="h-8 w-8 text-zinc-500 dark:text-white/30" />
          <div className="mt-2.5 text-xs font-medium text-zinc-700 dark:text-white/40">
            No comments so far...
          </div>
        </div>
      )}
    </div>
  );
};

export default Discussion;
