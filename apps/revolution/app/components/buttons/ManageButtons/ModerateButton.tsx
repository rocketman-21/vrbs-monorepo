"use client";

import { Button } from "@cobuild/ui/atoms/Button";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { useRevolution } from "app/libs/useRevolution";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { moderateSubmission } from "./moderateSubmission";

interface Props {
  slug: string;
  isHidden: boolean;
}

export const ModerateButton = (props: Props) => {
  const { slug, isHidden } = props;
  const [isPending, startTransition] = useTransition();
  const { revolutionId } = useRevolution();
  const router = useRouter();

  const action = isHidden ? "show" : "hide";

  return (
    <Button
      onClick={() => {
        try {
          startTransition(async () => {
            if (!window.confirm(`Are you sure you want to ${action} it?`)) return;
            const { error, isSuccess } = await moderateSubmission(action, slug, revolutionId);

            if (error) throw new Error(error);

            if (isSuccess) {
              toast.success(
                action === "show" ? "Creation is visible again" : "Creation is now hidden",
              );
              router.push(
                `/${revolutionId}/creations?filter=${action === "show" ? "next-up" : "hidden"}`,
              );
            }
          });
        } catch (e: any) {
          toast.error(e.message);
        }
      }}
      disabled={isPending}
      pulse={isPending}
      color="outline"
      grow
    >
      <span className="ml-1.5">{action === "show" ? "Unhide creation" : "Hide creation"}</span>
    </Button>
  );
};
