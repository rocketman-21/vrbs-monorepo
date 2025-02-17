"use client";

import { Button } from "@cobuild/ui/atoms/Button";
import { deleteIdea } from "./deleteIdea";

interface Props {
  ideaId: string;
  revolutionId: string;
}

export const DeleteIdeaButton = (props: Props) => {
  const { ideaId, revolutionId } = props;

  return (
    <form
      action={async () => {
        await deleteIdea({ ideaId, revolutionId });
        window.location.replace(`/${revolutionId}/dao/ideas`);
      }}
      onSubmit={e => {
        if (!confirm("Are you sure?")) {
          e.preventDefault();
        }
      }}
    >
      <Button type="submit" color="transparent">
        Delete Idea
      </Button>
    </form>
  );
};
