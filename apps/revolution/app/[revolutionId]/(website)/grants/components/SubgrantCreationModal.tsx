"use client";

import { IGrant } from "@cobuild/database/models/revolution/grants/IGrant";
import { Serialized } from "@cobuild/database/types";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { PinataStorage } from "@cobuild/libs/storage/Pinata";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { Button } from "@cobuild/ui/atoms/Button";
import Markdown from "@cobuild/ui/atoms/Markdown";
import { TextInput } from "@cobuild/ui/atoms/TextInput/TextInput";
import StaticModal from "@cobuild/ui/molecules/StaticModal/StaticModal";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { getRevolutionSocials } from "app/libs/social";
import { useRevolution } from "app/libs/useRevolution";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { GrantTeam } from "../apply/components/GrantTeam";
import { useCreateAlloProfile } from "../apply/hooks/useCreateAlloProfile";
import { createSubgrant } from "./createSubgrant";
import { getBalance } from "viem/actions";
import { getClient } from "@cobuild/libs/web3/viem/clients";

interface Props {
  parent: Serialized<IGrant>;
  type: "subgrant" | "opportunity";
  isOpen: boolean;
  close: () => void;
}

const MarkdownEditor = dynamic(
  () => import("@cobuild/ui/organisms/MarkdownEditor/MarkdownEditor"),
  { ssr: false },
);

export const SubgrantCreationModal = (props: Props) => {
  const { parent, isOpen, type } = props;
  const { revolutionId, socialLinks, name, chainId } = useRevolution();
  const socials = getRevolutionSocials(socialLinks);

  const isOpportunity = type === "opportunity";
  const isSubgrant = type === "subgrant";

  const [step, setStep] = useState<"description" | "application">(
    isSubgrant ? "description" : "application",
  );

  function closeModal() {
    setBody("");
    setStep("description");
    props.close();
  }

  const { user, isConnected, connect } = useUser();

  const router = useRouter();
  const [body, setBody] = useState("");
  const [team, setTeam] = useState<Array<`0x${string}`>>(user ? [user] : []);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!user) return;
    if (team.length === 0) setTeam([user]);
  }, [user]);

  useEffect(() => {
    if (isOpportunity) setStep("application");
  }, [type]);

  const initialSubgrantContent = `### Summary\n\nBasic description.\n\n### Short Term Goal\nBrief description of the short term goals for the project.\n\n### North Star\nThe long-term vision or ultimate goal of the project.\n\n### Author\nBrief background of the author, including relevant experience and qualifications.\n\n### Success Metrics\nWhat will be used to measure the success of the project.\n\n### Other info\n`;
  const initialOpportunityContent = `${name} needs help with...\n\n### Responsibilities\n- Responsibility 1\n- Responsibility 2\n- Responsibility 3\n\n### Short term goals\n- Goal 1\n- Goal 2\n\n### Long term goals\n- Goal 1\n- Goal 2`;

  const { createProfile } = useCreateAlloProfile(chainId, "subgrant-creation");

  const handleFormSubmission = async (formData: FormData) => {
    startTransition(async () => {
      try {
        if (!isConnected || !user) throw new Error("Please connect your wallet");
        if (!parent.contractAddress) throw new Error("Couldn't find grant contract address");

        const title = formData.get("title") as string;
        const maxOpenings = isOpportunity ? Number(formData.get("maxOpenings")) : undefined;

        const { ipfsHash } = await PinataStorage.uploadJSON({ title, body });

        const balance = await getBalance(getClient(chainId), { address: user });

        if (balance === 0n) {
          toast.error("You need money for the gas fee");
          return;
        }

        const alloProfileId = await createProfile({
          name: title,
          metadata: { protocol: BigInt(1), pointer: ipfsHash },
          owner: user,
          members: team,
        });

        if (!alloProfileId) throw new Error("Failed to create Allo profile onchain");

        const { grant, error } = await createSubgrant(
          {
            body,
            team,
            alloProfileId,
            title,
            chainId,
            parentGrantsContract: parent.contractAddress,
            imageUrl: parent.imageUrl,
            isApplicable: isOpportunity,
            isApplication: false,
            maxOpenings,
            openings: maxOpenings,
          },
          revolutionId,
        );

        if (error) throw new Error(error);
        if (!grant) throw new Error("Failed to create grant application");

        console.debug(`Grant ${grant.alloProfileId} created`);
        toast.success("Created! Redirecting...");

        // wait 300ms for alloRegistry object to update onchain vals
        await new Promise(res => setTimeout(res, 300));

        router.push(`/${revolutionId}/grants/${grant.chainId}/${grant.alloProfileId}`);
      } catch (e: any) {
        console.error(e);
        toast.error(getErrorMessage(e, "Failed to create"), { id: "subgrant-creation" });
      }
    });
  };

  return (
    <StaticModal
      isOpen={isOpen}
      closeModal={closeModal}
      title={parent.title}
      width={760}
      showCloseButton
      confirmClose={body.length > 5}
      actions={
        <>
          <Button
            type="button"
            onClick={() => {
              if (isSubgrant && step === "application") {
                setStep("description");
              } else {
                closeModal();
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
                if (!isConnected) return connect();
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
              form="subgrant-modal"
              pulse={isPending}
              disabled={isPending || !isConnected}
              size="md"
              autoFocus
            >
              {isOpportunity ? "Create opportunity" : "Apply for grant"}
            </Button>
          )}
        </>
      }
    >
      <main>
        <section>
          <h1 className="text-3xl font-semibold tracking-tight dark:text-white">
            {isOpportunity ? `Create opportunity` : `Help grow ${name}`}
          </h1>

          <h2 className="mt-1 text-lg text-zinc-500">
            {isSubgrant
              ? `Apply for a new grant in ${parent.title}`
              : `Find people to help in ${parent.title}`}
          </h2>

          {isSubgrant && step === "description" && (
            <>
              <div className="prose prose-a:text-lead-400 dark:prose-a:text-lead-300 prose-a:break-all mt-6 max-w-none border-t border-zinc-200 pt-6 dark:text-white">
                <Markdown>{parent.body}</Markdown>
              </div>
              <div className="mt-4 flex flex-col text-sm max-md:gap-y-4 md:flex-row md:gap-x-12 lg:mt-4">
                <button
                  onClick={() => closeModal()}
                  className="font-medium underline-offset-4 hover:underline"
                >
                  View examples <span aria-hidden="true">&rarr;</span>
                </button>
                <a
                  href={socials?.[0]?.url || "https://twitter.com/rocketman_w"}
                  className="font-medium underline-offset-4 hover:underline"
                  target="_blank"
                >
                  Got a question?
                </a>
              </div>
            </>
          )}
        </section>

        {step === "application" && user && (
          <section className="mt-6">
            <form
              method="post"
              id="subgrant-modal"
              onSubmit={e => {
                e.preventDefault();
                handleFormSubmission(new FormData(e.target as HTMLFormElement));
              }}
              className="space-y-5"
            >
              <GrantTeam
                user={user}
                onChange={setTeam}
                label={isSubgrant ? "team member" : "point of contact"}
              />

              <TextInput
                type="text"
                name="title"
                label="Title"
                size="lg"
                autoComplete="off"
                placeholder={isSubgrant ? "My initiative" : "Social Media Manager"}
                required
              />

              {isOpportunity && (
                <TextInput
                  type="number"
                  name="maxOpenings"
                  label="Max Openings"
                  size="lg"
                  min={1}
                  max={10}
                  autoComplete="off"
                  required
                  defaultValue={1}
                  wrapperClassName="max-w-20"
                />
              )}

              <div className="relative min-h-64 rounded-lg border py-6">
                <input type="hidden" name="body" value={body} />
                <MarkdownEditor
                  theme={"light"}
                  onUpdate={content => {
                    setBody(content);
                  }}
                  editable={isConnected}
                  initialContent={isSubgrant ? initialSubgrantContent : initialOpportunityContent}
                />
              </div>
            </form>
          </section>
        )}
      </main>
    </StaticModal>
  );
};
