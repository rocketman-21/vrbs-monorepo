"use client";

import { Button } from "@cobuild/ui/atoms/Button";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import SvgMagicWand from "@cobuild/ui/icons/MagicWand";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { useRevolution } from "app/libs/useRevolution";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { convertIdea } from "./convertIdea";

interface Props {
  ideaId: string;
  revolutionId: string;
}

export const ConvertIdeaButton = (props: Props) => {
  const { ideaId, revolutionId } = props;
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { aiName } = useRevolution();

  return (
    <Tooltip subtitle={`Use ${aiName} to create draft proposal from this idea`}>
      <Button
        type="submit"
        disabled={isPending}
        pulse={isPending}
        onClick={() => {
          const id = toast.loading(`Creating draft with ${aiName}. Please wait...`, {
            duration: 60000,
          });
          startTransition(async () => {
            const { draft, error } = await convertIdea({ ideaId, revolutionId });
            if (!draft || error) {
              toast.error(error, { id, duration: 5000 });
              return;
            }
            toast.success("Created! Redirecting...", { id, duration: 5000 });
            router.push(`/${revolutionId}/dao/drafts/${draft.draftId}`);
          });
        }}
      >
        <SvgMagicWand className="mr-1 h-3 w-3" />
        Convert to Draft
      </Button>
    </Tooltip>
  );
};
