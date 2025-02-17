import { IPost } from "@cobuild/database/types";
import { Markdown } from "@cobuild/ui/atoms/Markdown";

type Props = Pick<IPost, "markdown">;

export const CommentBody = (props: Props) => {
  const { markdown } = props;

  return (
    <div className="whitespace-pre-line pr-2 lg:pr-0 dark:text-zinc-200">
      <Markdown>{markdown || ""}</Markdown>
    </div>
  );
};
