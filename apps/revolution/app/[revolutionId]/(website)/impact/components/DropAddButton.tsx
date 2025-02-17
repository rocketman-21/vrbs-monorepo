"use client";

import { Button } from "@cobuild/ui/atoms/Button";
import { Popover } from "@cobuild/ui/molecules/Popover/Popover";
import { useRevolution } from "app/libs/useRevolution";

interface Props {
  revolutionId: string;
  channelId: string;
}

export const DropAddButton = (props: Props) => {
  const { revolutionId, channelId } = props;

  const { name: revolutionName } = useRevolution();

  return (
    <Popover
      button={
        <Button size="md" color="outline" as="span">
          Add your drop
        </Button>
      }
      placement="bottom-start"
    >
      <div className="bg-secondary-50 dark:bg-lead-950 dark:text-lead-50 mb-1.5 max-w-96 rounded-xl p-5">
        <h3 className="mt-1 font-medium tracking-tight">1. Create a split </h3>
        <p className="mt-1 text-sm text-zinc-700">
          <a
            href={`/${revolutionId}/rewards?createSplit=true`}
            className="underline ease-in-out hover:opacity-75"
            target="_blank"
          >
            Create a split
          </a>{" "}
          with our community treasury.
        </p>

        <h3 className="mt-4 font-medium tracking-tight">2. Post on Zora</h3>
        <p className="mt-1 text-sm text-zinc-700">
          Visit{" "}
          <a
            href="https://zora.co/create"
            className="underline ease-in-out hover:opacity-75"
            target="_blank"
          >
            zora.co
          </a>{" "}
          to post your impact. Use "Advanced options" to pay out funds to the split address you
          created in step 1. <b>Make sure you post on the Base network</b>.
        </p>

        <h3 className="mt-4 font-medium tracking-tight">3. Post on Farcaster</h3>
        <p className="mt-1 text-sm text-zinc-700">
          Share a link to your Zora mint in the{" "}
          <a
            href={`https://warpcast.com/~/compose?channelKey=${channelId}`}
            className="underline ease-in-out hover:opacity-75"
            target="_blank"
          >
            /{channelId}
          </a>{" "}
          channel on Farcaster.
          <br />
          <br />
          That's it! The drop will be included below within 30 minutes.
        </p>
      </div>
    </Popover>
  );
};
