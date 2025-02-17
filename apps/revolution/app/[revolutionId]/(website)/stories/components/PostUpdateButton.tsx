"use client";

import { useUser } from "@cobuild/libs/hooks/useUser";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { Button } from "@cobuild/ui/atoms/Button";
import { Dropdown } from "@cobuild/ui/atoms/Dropdown";
import { TextInput } from "@cobuild/ui/atoms/TextInput/TextInput";
import SvgPaperClip from "@cobuild/ui/icons/PaperClip";
import SvgPen from "@cobuild/ui/icons/Pen";
import StaticModal from "@cobuild/ui/molecules/StaticModal/StaticModal";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { useRevolution } from "app/libs/useRevolution";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { attachCast } from "./attachCast";

interface Props {
  url: string;
  slug: string;
}

const formId = `attach-cast-form`;

export const PostUpdateButton = (props: Props) => {
  const { url, slug } = props;
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { revolutionId, farcasterChannelId } = useRevolution();
  const { user, login } = useUser();

  const handleFormSubmission = (formData: FormData) => {
    if (!user) return login();

    startTransition(async () => {
      try {
        const { error } = await attachCast(
          { url: formData.get("url") as string },
          slug,
          revolutionId,
        );

        if (error) throw new Error(error || "Couldn't attach cast");

        setShowAttachModal(false);
        toast.success("Cast attached");
        router.refresh();
      } catch (e: any) {
        console.error(e);
        toast.error(getErrorMessage(e) || "Couldn't attach cast. Try again");
      }
    });
  };
  return (
    <>
      <Dropdown button={<Button color="outline">Post update</Button>}>
        <a
          href={`https://warpcast.com/~/compose?text=&channelKey=${farcasterChannelId}&embeds[]=${url}`}
          target="_blank"
        >
          <Dropdown.Item icon={SvgPen}>Write new cast</Dropdown.Item>
        </a>
        <Dropdown.Item icon={SvgPaperClip} onClick={() => setShowAttachModal(true)}>
          Attach existing cast
        </Dropdown.Item>
      </Dropdown>
      <StaticModal
        isOpen={showAttachModal}
        closeModal={() => setShowAttachModal(false)}
        title="Attach cast to the story"
        showCloseButton
        actions={
          <Button type="submit" form={formId} size="md" disabled={isPending}>
            {isPending ? "Please wait... " : "Attach cast"}
          </Button>
        }
      >
        <div className="flex w-full flex-col">
          <h1 className="mb-1 text-xl font-semibold max-sm:hidden dark:text-white">Attach cast</h1>
          <h3 className="text-zinc-500 md:pr-8">Add new update to the story.</h3>

          <form className="mt-6 space-y-4" id={formId} action={handleFormSubmission}>
            <TextInput
              name="url"
              label="Cast URL"
              placeholder="https://warpcast.com/..."
              type="text"
              autoComplete="off"
            />
          </form>
        </div>
      </StaticModal>
    </>
  );
};
