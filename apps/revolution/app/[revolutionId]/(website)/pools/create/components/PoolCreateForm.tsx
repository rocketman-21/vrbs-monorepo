"use client";

import { Button } from "@cobuild/ui/atoms/Button";
import { TextInput } from "@cobuild/ui/atoms/TextInput/TextInput";
import { toast } from "@cobuild/ui/organisms/Notifications";
import UploadIcon from "@cobuild/ui/pixel-icons/Upload";
import { ImageInput, useImageUpload } from "app/libs/useImageUpload";
import clsx from "classnames";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ManagingMembers } from "./PoolManagers";
import { PinataStorage } from "@cobuild/libs/storage/Pinata";
import { useAccount } from "wagmi";
import { useCreateAlloPool } from "../hooks/useCreateAlloPool";
import { savePoolToDb } from "../../createPool";
import { useAlloPoolInitialData } from "../hooks/useAlloPoolInitialData";
import { useRevolution } from "app/libs/useRevolution";
import { sepolia } from "viem/chains";

const MarkdownEditor = dynamic(
  () => import("@cobuild/ui/organisms/MarkdownEditor/MarkdownEditor"),
  { ssr: false },
);

interface Props {
  revolutionId: string;
  user: `0x${string}` | null;
}

export const PoolCreateForm = (props: Props) => {
  const { revolutionId, user } = props;
  const disabled = !user;

  // const { chainId } = useRevolution();
  const chainId = sepolia.id;

  const router = useRouter();

  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const { address } = useAccount();
  const [managers, setManagers] = useState<`0x${string}`[]>(user ? [user] : []);
  const [toastId, setToastId] = useState("createAlloPool");
  const [isLoading, setIsLoading] = useState(false);

  const { upload, isUploading } = useImageUpload(url => setImageUrl(url));
  const { initStrategyData } = useAlloPoolInitialData(chainId);

  const { createPool } = useCreateAlloPool(chainId, toastId);

  useEffect(() => {
    if (!user) return;
    if (managers.length === 0) setManagers([user]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleFormSubmission = async (formData: FormData) => {
    try {
      if (disabled) return;
      if (!address) return toast.error("Please connect your wallet");
      if (!imageUrl) return toast.error("Please upload an icon for your pool");

      setIsLoading(true);

      const title = formData.get("title") as string;
      const tags = (formData.get("tags") as string)
        .split(",")
        .map(tag => tag.trim())
        .filter(c => c.length > 2);

      const { ipfsHash } = await PinataStorage.uploadJSON({
        title,
        tags,
        body,
        imageUrl,
      });

      const QVSimple = "0xA9e9110fe3B4B169b2CA0e8825C7CE76EB0b9438";
      const DirectGrants = "0xaC3f288a7A3efA3D33d9Dd321ad31072915D155d";
      // rocketman21.eth
      const AlloProfileId = "0x5ff7dad041a75219e67008203292dd97356b4d8256d0a76c256c4b3b096c385d";
      const NATIVE_TOKEN = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

      // const initStrategyData =
      //   "0x000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001";

      const res = await createPool({
        strategy: DirectGrants,
        metadata: {
          protocol: BigInt(1),
          pointer: ipfsHash,
        },
        profileId: AlloProfileId,
        managers,
        // how much to fund the pool with initially
        amount: 0n,
        token: NATIVE_TOKEN,
        initStrategyData,
      });

      const { alloPoolId, strategyAddress } = res || {};

      if (!alloPoolId || !strategyAddress) {
        throw new Error("Failed to get pool data");
      }

      const { pool, error } = await savePoolToDb(
        {
          body,
          imageUrl,
          managers,
          alloPoolId,
          strategy: strategyAddress,
          title,
          chainId,
          tags,
        },
        revolutionId,
      );

      setIsLoading(false);

      if (error) {
        console.error(error);
        toast.error(error, { id: toastId });
      } else {
        console.debug(`Pool ${pool?.alloPoolId} created`);
        toast.success("Created! Redirecting...", { id: toastId });
        router.push(`/${revolutionId}/pools/${pool?.chainId}/${pool?.alloPoolId}`);
      }
    } catch (e: any) {
      setIsLoading(false);
      console.error(e);
      toast.error(e?.message || "Failed to create pool");
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
          label="Goal"
          size="lg"
          autoComplete="off"
          placeholder="The goal"
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
            Managers
          </h3>
          <div className="mt-2.5 lg:col-span-2">
            <ManagingMembers user={user} onChange={setManagers} />
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
      {loading ? "Please wait..." : "Create pool"}
    </Button>
  );
};
