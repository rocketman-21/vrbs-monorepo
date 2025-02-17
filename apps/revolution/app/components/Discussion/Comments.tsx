import { IPost, Serialized } from "@cobuild/database/types";
import { Comment } from "./Comment";

interface Props {
  comments: Serialized<IPost>[];
  level?: number;
  variant?: "base" | "compact";
  isServerSide?: boolean;
}

export const Comments = (props: Props) => {
  const { level = 1, comments, variant = "base", isServerSide } = props;

  if (comments?.length === 0) return null;

  return (
    <div className="space-y-4">
      {comments?.map(comment => (
        <Comment
          key={comment?.postId}
          comment={comment as any}
          level={level}
          variant={variant}
          isServerSide={isServerSide}
        />
      ))}
    </div>
  );
};

export default Comments;
