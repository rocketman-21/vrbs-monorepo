"use client";

import { IGoal } from "@cobuild/database/models/revolution/goals/IGoal";
import { CONTEST_BUILDER_ADDRESSES } from "@cobuild/database/models/revolution/revolutions/addresses";
import { Serialized } from "@cobuild/database/types";
import {
  CultureIndexMediaType,
  CultureIndexRequiredMediaPrefix,
} from "@cobuild/libs/web3/revolution/types";
import { contestBuilderAbi } from "@cobuild/revolution";
import { Button } from "@cobuild/ui/atoms/Button";
import { Select } from "@cobuild/ui/atoms/Select";
import { TextInput } from "@cobuild/ui/atoms/TextInput/TextInput";
import { toast } from "@cobuild/ui/organisms/Notifications";
import UploadIcon from "@cobuild/ui/pixel-icons/Upload";
import { useContractWrite } from "app/libs/useContractWrite";
import { ImageInput, useImageUpload } from "app/libs/useImageUpload";
import { useRevolution } from "app/libs/useRevolution";
import clsx from "classnames";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAccount } from "wagmi";
import { RewardsSplits } from "./RewardsSplits";
import { updateContest } from "./updateContest";

const MarkdownEditor = dynamic(
  () => import("@cobuild/ui/organisms/MarkdownEditor/MarkdownEditor"),
  { ssr: false },
);

interface Props {
  revolutionId: string;
  votingPower: `0x${string}`;
  splitMain: `0x${string}`;
  user: `0x${string}` | null;
  goals: Serialized<IGoal>[];
}

export const ContestCreationForm = (props: Props) => {
  const { revolutionId, user, votingPower, splitMain, goals } = props;
  const disabled = !user;

  const { chainId } = useRevolution();

  const router = useRouter();

  const [guidelines, setGuidelines] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [goal, setGoal] = useState("");
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  const { isUploading, upload } = useImageUpload(url => setImageUrl(url));

  const { write, status } = useContractWrite({
    chainId,
    contract: CONTEST_BUILDER_ADDRESSES[chainId],
    type: "createContest",
    trackerType: "contest_builder",
    successText: "Contest created!",
    waitingText: "Creating contest...",
    onSuccess: async (hash, contestAddress) => {
      try {
        // Store revolutionId & goal offchain
        await updateContest(`${contestAddress}`, revolutionId, goal, imageUrl);
      } catch (e) {
        console.error(e);
      }
      router.push(`/${revolutionId}/contests/${chainId}/${contestAddress}`);
    },
  });

  const handleFormSubmission = async (formData: FormData) => {
    try {
      if (!user) return;
      if (status !== "idle") return;

      setIsLoading(true);

      const title = formData.get("title")?.toString();
      const startTime = formData.get("startTime")?.toString();
      const endTime = formData.get("endTime")?.toString();
      const payoutSplits = JSON.parse(
        formData.get("payoutSplits")?.toString() || "[0]",
      ) as number[];

      if (!address) throw new Error("Please connect your wallet");
      if (!description) throw new Error("Please add a description");
      if (!imageUrl) throw new Error("Please upload a thumbnail");
      if (!title) throw new Error("Please add a title");
      if (!startTime || !endTime) throw new Error("Please set a start and end time");

      const totalSplit = payoutSplits.reduce((acc, curr) => acc + curr, 0);
      if (totalSplit !== 100) throw new Error("Payout splits must sum to 100%");

      await write(client => {
        return client.simulateContract({
          account: user,
          address: CONTEST_BUILDER_ADDRESSES[chainId],
          abi: contestBuilderAbi,
          functionName: "deployBaseContest",
          args: [
            //initial owner
            user,
            //weth
            "0x4200000000000000000000000000000000000006",
            //voting power
            votingPower,
            //splitmain
            splitMain,
            //builder reward address
            user,
            {
              name: title,
              description: description,
              template: imageUrl || "",
              checklist: guidelines,
              tokenVoteWeight: BigInt(1e18 * 1000),
              pointsVoteWeight: BigInt(1),
              pieceMaximums: {
                name: BigInt(210),
                description: BigInt(2_000),
                image: BigInt(64_000),
                text: BigInt(100_000),
                animationUrl: BigInt(1_000),
              },
              quorumVotesBPS: BigInt(0),
              minVotingPowerToCreate: BigInt(0),
              minVotingPowerToVote: BigInt(1),
              requiredMediaType: CultureIndexMediaType.NONE,
              requiredMediaPrefix: CultureIndexRequiredMediaPrefix.MIXED,
            },
            {
              // PERCENTAGE_SCALE by 1e6
              entropyRate: BigInt(1e6 / 2),
              startTime: BigInt(new Date(startTime).getTime() / 1000),
              endTime: BigInt(new Date(endTime).getTime() / 1000),
              payoutSplits: payoutSplits
                .map(split => BigInt(1e6 * (split / 100)))
                .sort((a, b) => Number(b - a)),
            },
          ],
        });
      });

      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      console.error(e);
      toast.error(e?.message || "Failed to create contest application");
    }
  };

  return (
    <form
      method="post"
      onSubmit={e => {
        e.preventDefault();
        handleFormSubmission(new FormData(e.target as HTMLFormElement));
      }}
    >
      <h3 className="text-lead-500 text-sm uppercase tracking-tight">Basic information</h3>
      <div className="mt-4 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
        <TextInput
          type="text"
          name="title"
          label="Title"
          size="lg"
          autoComplete="off"
          placeholder="My contest"
          required
          disabled={disabled}
        />
        <div className="self-end">
          <ImageInput disabled={disabled || isUploading} isUploading={isUploading} upload={upload}>
            <input type="hidden" name="imageUrl" value={imageUrl} />
            <div className="group/thumbnail-btn flex items-center space-x-4">
              {!imageUrl && (
                <div className="border-lead-400 flex aspect-square w-14 shrink-0 items-center justify-center rounded-lg border-2 border-dashed">
                  <UploadIcon className="text-lead-500 h-6 w-6" />
                </div>
              )}
              {imageUrl && (
                <Image
                  src={imageUrl}
                  width={60}
                  height={60}
                  className="aspect-square size-14 rounded-lg object-cover"
                  alt="contest"
                />
              )}
              <div>
                <div
                  className={clsx("text-zinc-900 duration-150", {
                    "animate-pulse": isUploading,
                    "lg:group-hover/thumbnail-btn:text-lead-500": !disabled,
                  })}
                >
                  {!imageUrl ? "Upload" : "Change"} thumbnail
                </div>
                <div className="text-sm text-zinc-500">Thumbnail image for display</div>
              </div>
            </div>
          </ImageInput>
        </div>

        <TextInput
          name="startTime"
          type="datetime-local"
          label="Start time"
          size="lg"
          min={new Date().toISOString().slice(0, 16)}
          defaultValue={new Date().toISOString().slice(0, 16)}
          required
        />

        <TextInput
          name="endTime"
          type="datetime-local"
          label="End time"
          size="lg"
          min={new Date(Date.now() + 1 * 60 * 60 * 24 * 1000).toISOString().slice(0, 16)} // 1 day from now
          defaultValue={new Date(Date.now() + +8 * 60 * 60 * 24 * 1000).toISOString().slice(0, 16)} // 8 days from now
          required
        />

        <Select
          value={goal}
          onChange={options => setGoal((options as any)?.value || "")}
          name="goal"
          label="Goal"
          options={goals.map(goal => ({ label: goal.title, value: goal.slug }))}
          inputSize="lg"
          placeholder="Select optional goal"
        />
      </div>

      <h3 className="text-lead-500 mt-8 text-sm uppercase tracking-tight">Description</h3>
      <div className="relative mt-2.5 min-h-[270px] rounded-lg border bg-white py-6">
        <input type="hidden" name="description" value={description} />
        <MarkdownEditor
          theme={"light"}
          onUpdate={content => {
            setDescription(content);
          }}
          editable={!disabled}
        />
      </div>

      <h3 className="text-lead-500 mt-8 text-sm uppercase tracking-tight">Guidelines</h3>
      <div className="relative mt-2.5 min-h-[170px] rounded-lg border bg-white py-6">
        <input type="hidden" name="guidelines" value={guidelines} />
        <MarkdownEditor
          theme={"light"}
          onUpdate={content => {
            setGuidelines(content);
          }}
          editable={!disabled}
        />
      </div>

      <h3 className="text-lead-500 mt-8 text-sm uppercase tracking-tight">Payout splits</h3>
      <div className="mt-1 text-sm text-zinc-500">
        Choose how the rewards will be split between the top creators
      </div>
      <div className="mt-2.5 max-w-72 space-y-1">
        <RewardsSplits max={15} />
      </div>

      <div className="mt-10 flex gap-x-6 max-sm:flex-col max-sm:space-y-2.5 lg:items-center">
        <SubmitButton loading={isLoading || status !== "idle"} disabled={disabled} />
        <Link
          href={`/${revolutionId}/contests`}
          className="inline-flex text-sm font-semibold text-zinc-500 hover:underline"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
};

const SubmitButton = ({ disabled, loading }: { disabled: boolean; loading: boolean }) => {
  return (
    <Button type="submit" size="lg" disabled={loading || disabled}>
      {loading ? "Please wait..." : "Create contest"}
    </Button>
  );
};
