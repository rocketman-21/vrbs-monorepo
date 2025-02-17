"use client";

import { useUser } from "@cobuild/libs/hooks/useUser";
import { Button } from "@cobuild/ui/atoms/Button";
import { TextArea } from "@cobuild/ui/atoms/TextArea";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { useRevolution } from "app/libs/useRevolution";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createIdea } from "./createIdea";

interface Props {
  revolutionId: string;
}

export const CreateIdeaForm = (props: Props) => {
  const { revolutionId } = props;
  const [isPending, startTransition] = useTransition();
  const { isAuthenticated, login } = useUser();
  const { aiName } = useRevolution();
  const router = useRouter();

  return (
    <form
      className="bg-card rounded-xl p-4"
      onSubmit={e => {
        e.preventDefault();
        if (!isAuthenticated) return login();

        const id = toast.loading(`Saving idea & generating image with ${aiName}...`, {
          duration: 60000,
        });

        startTransition(async () => {
          const form = e.target as HTMLFormElement;
          const formdata = new FormData(form);
          const body = formdata.get("body")?.toString() || "";
          const { idea, error } = await createIdea({ body, revolutionId });

          if (idea) {
            toast.success("Created! Redirecting...", { id, duration: 5000 });
            router.push(`/${revolutionId}/dao/ideas/${idea.ideaId}`);
            form.reset();
            return;
          }

          toast.error(error, { id, duration: 5000 });
          return;
        });
      }}
    >
      <h3 className="font-bold">💡 Have an idea?</h3>
      <p className="mt-2.5 text-sm text-zinc-500">
        Have a brilliant idea for our community? Share it below!
      </p>
      <fieldset className="bg-card mb-2.5 mt-4 w-full">
        <TextArea
          name="body"
          maxHeight={240}
          maxLength={256}
          rows={3}
          autosize
          placeholder="I have an idea..."
          onSubmit={textarea => textarea.form?.requestSubmit()}
        />
      </fieldset>
      <Button type="submit" disabled={isPending} pulse={isPending}>
        {isPending ? "Please wait..." : "Share it"}
      </Button>
    </form>
  );
};
