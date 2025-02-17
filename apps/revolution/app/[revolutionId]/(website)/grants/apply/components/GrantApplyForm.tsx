"use client";

import { PinataStorage } from "@cobuild/libs/storage/Pinata";
import { Button } from "@cobuild/ui/atoms/Button";
import { TextInput } from "@cobuild/ui/atoms/TextInput/TextInput";
import { toast } from "@cobuild/ui/organisms/Notifications";
import UploadIcon from "@cobuild/ui/pixel-icons/Upload";
import { ImageInput, useImageUpload } from "app/libs/useImageUpload";
import { useRevolution } from "app/libs/useRevolution";
import clsx from "classnames";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { createGrant } from "../createGrant";
import { useCreateAlloProfile } from "../hooks/useCreateAlloProfile";
import { GrantTeam } from "./GrantTeam";
import { getBalance } from "viem/actions";
import { getClient } from "@cobuild/libs/web3/viem/clients";

const MarkdownEditor = dynamic(
  () => import("@cobuild/ui/organisms/MarkdownEditor/MarkdownEditor"),
  { ssr: false },
);

interface Props {
  revolutionId: string;
  user: `0x${string}` | null;
}

export const GrantApplyForm = (props: Props) => {
  const { revolutionId, user } = props;
  const disabled = !user;

  const { chainId } = useRevolution();

  const router = useRouter();

  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const { address } = useAccount();
  const [team, setTeam] = useState<Array<`0x${string}`>>(user ? [user] : []);
  const [toastId, setToastId] = useState("createAlloProfile");
  const [isLoading, setIsLoading] = useState(false);

  const { isUploading, upload } = useImageUpload(url => setImageUrl(url));

  const { createProfile } = useCreateAlloProfile(chainId, toastId);

  useEffect(() => {
    if (!user) return;
    if (team.length === 0) setTeam([user]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleFormSubmission = async (formData: FormData) => {
    try {
      if (disabled) return;
      if (!address) return toast.error("Please connect your wallet");
      if (!imageUrl) return toast.error("Please upload an icon for your application");

      setIsLoading(true);

      const title = formData.get("title") as string;
      const tagline = formData.get("tagline") as string;
      const tags = (formData.get("tags") as string)
        .split(",")
        .map(tag => tag.trim())
        .filter(c => c.length > 2);

      const { ipfsHash } = await PinataStorage.uploadJSON({
        title,
        tagline,
        tags,
        body,
        imageUrl,
      });

      const balance = await getBalance(getClient(chainId), { address });

      if (balance === 0n) {
        setIsLoading(false);
        toast.error("You need money for the gas fee");
        return;
      }

      const alloProfileId = await createProfile({
        name: title,
        metadata: {
          protocol: BigInt(1),
          pointer: ipfsHash,
        },
        owner: address,
        members: team,
      });

      if (!alloProfileId) {
        setIsLoading(false);
        toast.error("Failed to create Allo profile onchain");
        return;
      }

      const { grant, error } = await createGrant(
        {
          body,
          imageUrl,
          team,
          alloProfileId,
          title,
          tagline,
          chainId,
          tags,
        },
        revolutionId,
      );

      setIsLoading(false);

      if (error || !grant) {
        console.error(error);
        toast.error(error || "Failed to create grant application");
      } else {
        console.debug(`Grant ${grant.alloProfileId} created`);
        toast.success("Created! Redirecting...");

        // wait 300ms for alloRegistry object to update onchain vals
        await new Promise(res => setTimeout(res, 300));

        router.push(`/${revolutionId}/grants/${grant.chainId}/${grant.alloProfileId}`);
      }
    } catch (e: any) {
      setIsLoading(false);
      console.error(e);
      toast.error(e?.message || "Failed to create grant application");
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
          placeholder="My initiative"
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
                  className="aspect-square w-14 rounded-lg object-cover"
                  alt="Initiative"
                />
              )}
              <div>
                <div
                  className={clsx("text-zinc-900 duration-150", {
                    "animate-pulse": isUploading,
                    "lg:group-hover/thumbnail-btn:text-lead-500": !disabled,
                  })}
                >
                  {!imageUrl ? "Upload" : "Change"} icon
                </div>
                <div className="text-sm text-zinc-500">Please use the square (1:1) ratio</div>
              </div>
            </div>
          </ImageInput>
        </div>

        <TextInput
          type="text"
          name="tagline"
          label="Tagline"
          size="lg"
          autoComplete="off"
          placeholder="One sentence description"
          required
          disabled={disabled}
        />

        <TextInput
          type="text"
          name="tags"
          label="Tags (comma separated)"
          size="lg"
          autoComplete="off"
          placeholder="design, marketing"
          required
          disabled={disabled}
        />
      </div>

      {user && (
        <>
          <h3 className="text-lead-500 mt-8 text-sm uppercase tracking-tight lg:col-span-2">
            Your Team
          </h3>
          <div className="mt-2.5 lg:col-span-2">
            <GrantTeam user={user} onChange={setTeam} />
          </div>
        </>
      )}

      <h3 className="text-lead-500 mt-8 text-sm uppercase tracking-tight">Description</h3>
      <div className="relative mt-2.5 min-h-[320px] rounded-lg border bg-white py-6">
        <input type="hidden" name="body" value={body} />
        <MarkdownEditor
          theme={"light"}
          onUpdate={content => {
            setBody(content);
          }}
          editable={!disabled}
        />
      </div>

      <div className="mt-10 flex gap-x-6 max-sm:flex-col max-sm:space-y-2.5 lg:items-center">
        <SubmitButton loading={isLoading} disabled={disabled} />
        <Link
          href={`/${revolutionId}/grants`}
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
      {loading ? "Please wait..." : "Apply for grant"}
    </Button>
  );
};
