"use client";

import { IGrant } from "@cobuild/database/models/revolution/grants/IGrant";
import { Serialized } from "@cobuild/database/types";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { PinataStorage } from "@cobuild/libs/storage/Pinata";
import { getEthAddress } from "@cobuild/libs/utils/account";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { Button } from "@cobuild/ui/atoms/Button";
import Markdown from "@cobuild/ui/atoms/Markdown";
import StaticModal from "@cobuild/ui/molecules/StaticModal/StaticModal";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { UserProfileClient } from "app/components/user-profile/UserProfileClient";
import { useRevolution } from "app/libs/useRevolution";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useCreateAlloProfile } from "../apply/hooks/useCreateAlloProfile";
import { createSubgrant } from "./createSubgrant";
import { getBalance } from "viem/actions";
import { getClient } from "@cobuild/libs/web3/viem/clients";

interface Props {
  grant: Serialized<IGrant>;
  isOpen: boolean;
  close: () => void;
  withDescription?: boolean;
}

const MarkdownEditor = dynamic(
  () => import("@cobuild/ui/organisms/MarkdownEditor/MarkdownEditor"),
  { ssr: false },
);

export const GrantApplicationModal = (props: Props) => {
  const { grant, isOpen, close, withDescription } = props;
  const { revolutionId, name, chainId, config } = useRevolution();

  const [step, setStep] = useState<"description" | "application">(
    withDescription ? "description" : "application",
  );

  const { user, isConnected, connect } = useUser();
  const [isPending, startTransition] = useTransition();
  const [body, setBody] = useState("");
  const router = useRouter();

  const initialContent = `### What's your background?\nWrite a few words about your experience and interests\n### What will you be doing?\nMaybe you already have some creative ideas?\n\n### Time you can commit\nHow much time per week can you allocate?\n ### Why you care about ${name}?\nWhy you think you're a good fit for this grant?`;

  const { createProfile } = useCreateAlloProfile(chainId, "grant-application");

  const handleFormSubmission = async (formData: FormData) => {
    startTransition(async () => {
      try {
        if (!isConnected || !user) throw new Error("Please connect your wallet");
        if (!grant.contractAddress) throw new Error("Couldn't find grant contract address");

        const title = `${grant.title}`;

        const { ipfsHash } = await PinataStorage.uploadJSON({ title, body });

        const balance = await getBalance(getClient(chainId), { address: user });

        if (balance === 0n) {
          toast.error("You need money for the gas fee");
          return;
        }

        const alloProfileId = await createProfile({
          name: title,
          metadata: {
            protocol: BigInt(1),
            pointer: ipfsHash,
          },
          owner: user,
          members: [user],
        });

        if (!alloProfileId) throw new Error("Failed to create Allo profile onchain");

        const { error } = await createSubgrant(
          {
            body,
            team: [user],
            alloProfileId,
            title,
            chainId,
            parentGrantsContract: getEthAddress(grant.contractAddress),
            imageUrl: grant.imageUrl,
            isApplicable: false,
            isApplication: true,
          },
          revolutionId,
        );

        if (error) throw new Error(error);

        router.refresh();

        console.debug(`Grant application ${grant.alloProfileId} created`);
        toast.success("Application created!", { id: "grant-application" });

        close();
      } catch (e: any) {
        console.error(e);
        toast.error(getErrorMessage(e, "Failed to create grant application"), {
          id: "grant-application",
        });
      }
    });
  };

  return (
    <StaticModal
      isOpen={isOpen}
      closeModal={close}
      title={grant.title}
      width={760}
      showCloseButton
      confirmClose={body.length > 5}
      actions={
        <>
          <Button
            type="button"
            onClick={() => {
              if (withDescription && step === "application") {
                setStep("description");
              } else {
                close();
              }
            }}
            color="transparent"
          >
            Cancel
          </Button>
          {step === "description" && (
            <Button
              type="button"
              onClick={() => {
                if (!isConnected) {
                  return connect();
                }
                setStep("application");
              }}
              size="md"
              autoFocus
            >
              Start application
            </Button>
          )}
          {step === "application" && (
            <Button
              type="submit"
              form="application-modal"
              pulse={isPending}
              disabled={isPending || !isConnected}
              size="md"
              autoFocus
            >
              Submit application
            </Button>
          )}
        </>
      }
    >
      <main>
        <section>
          <h1 className="text-3xl font-semibold tracking-tight dark:text-white">{grant.title}</h1>
          <h2 className="mt-1 text-lg text-zinc-500">Apply and help grow {name}</h2>
          {step === "description" && withDescription && (
            <>
              <div className="prose prose-a:text-lead-400 dark:prose-a:text-lead-300 prose-a:break-all mt-6 max-w-none border-t border-zinc-200 pt-6 dark:text-white">
                <Markdown>{grant.body}</Markdown>
              </div>
            </>
          )}
        </section>
        {step === "application" && user && (
          <section className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lead-500 font-semibold">Your application</h3>
              <div className="flex items-center text-sm text-zinc-500">
                <UserProfileClient address={user}>
                  {profile => (
                    <span className="ml-1.5 inline-flex items-center">
                      <Avatar
                        id={user}
                        imageUrl={profile.profilePicture}
                        size={16}
                        className="mr-1"
                      />
                      {profile.displayUsername}
                    </span>
                  )}
                </UserProfileClient>
              </div>
            </div>

            <form
              method="post"
              id="application-modal"
              onSubmit={e => {
                e.preventDefault();
                handleFormSubmission(new FormData(e.target as HTMLFormElement));
              }}
            >
              <div className="relative mt-2.5 min-h-64 rounded-lg border py-6">
                <input type="hidden" name="body" value={body} />
                <MarkdownEditor
                  theme={config.darkMode ? "dark" : "light"}
                  onUpdate={content => {
                    setBody(content);
                  }}
                  editable={isConnected}
                  initialContent={initialContent}
                />
              </div>
            </form>
          </section>
        )}
      </main>
    </StaticModal>
  );
};
