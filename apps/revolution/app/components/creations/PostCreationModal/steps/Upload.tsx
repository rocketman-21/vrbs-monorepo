"use client";

import { useUser } from "@cobuild/libs/hooks/useUser";
import { getFileDimensions } from "@cobuild/libs/media";
import { PinataStorage } from "@cobuild/libs/storage/Pinata";
import { optimizeSvg } from "@cobuild/libs/svg/optimizeSvg";
import { Button } from "@cobuild/ui/atoms/Button";
import { toast } from "@cobuild/ui/organisms/Notifications";
import Upload from "@cobuild/ui/pixel-icons/Upload";
import { useRevolution } from "app/libs/useRevolution";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { Guidelines } from "../Guidelines";
import { Action, usePostCreation } from "../PostCreationProvider";
import UploadProgressBar from "./UploadProgressBar";

const Dropzone = dynamic(() => import("react-dropzone"), { ssr: false });

export const UploadStep = () => {
  const { setFieldValue, setIsLoading, setCurrentStep, isLoading, cultureIndex } =
    usePostCreation();
  const [progress, setProgress] = useState(0);
  const { isAuthenticated } = useUser();
  const { revolutionId } = useRevolution();

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file) return;

      //if requires svg, store raw svg string
      if (cultureIndex.requiresSvg) {
        try {
          setIsLoading(true);
          const svgString = await file.text();
          if (svgString.includes("<image xlink:href=")) {
            toast.error("Please upload a vector image, not a PNG or JPG inside an SVG.", {
              duration: 10000,
            });
            return;
          }

          const svgStringBase64 = await optimizeSvg(svgString);

          setFieldValue("url", svgStringBase64);
          setFieldValue("mediaType", "image");
          setFieldValue("thumbnailUrl", svgStringBase64);
          setCurrentStep("details");
        } catch (error) {
          toast.error("Error uploading file");
          console.error({ error });
        } finally {
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);

        const dimensions = await getFileDimensions(file);

        if (dimensions) {
          setFieldValue("mediaWidth", dimensions.width);
          setFieldValue("mediaHeight", dimensions.height);
        }

        const { url } = await PinataStorage.upload(file, ({ loaded, total = 1 }) =>
          setProgress(Math.round((loaded * 100) / total)),
        );
        setFieldValue("url", url);
        setFieldValue("mediaType", file.type.includes("image") ? "image" : "video");
        if (file.type.includes("image")) {
          setFieldValue("thumbnailUrl", url);
        }
        setCurrentStep("details");
      } catch (error) {
        toast.error("Error uploading file");
        console.error({ error });
      } finally {
        setIsLoading(false);
      }
    },
    [setFieldValue, setIsLoading, setCurrentStep, cultureIndex.requiresSvg],
  );

  return (
    <div className="grid grid-cols-1 gap-6 pb-6 md:grid-cols-5 md:gap-12 md:pt-6">
      <div className="md:col-span-2">
        <Guidelines />
      </div>
      <div className="md:col-span-3">
        <div className="flex min-h-[350px] flex-col">
          <h1 className="text-xl font-semibold dark:text-white">Choose file to upload</h1>

          <Dropzone
            onDrop={acceptedFiles => uploadFile(acceptedFiles[0])}
            accept={
              !cultureIndex.requiresSvg
                ? {
                    "video/mp4": [],
                    "video/x-m4v": [],
                    "video/*": [],
                    "image/*": [],
                  }
                : {
                    "image/svg+xml": [],
                  }
            }
            autoFocus
            maxFiles={1}
            onError={error => toast.error(error.message)}
            maxSize={
              revolutionId === "grounds"
                ? 1024 * 1024 * 5
                : cultureIndex.requiresSvg
                  ? 1024 * 30
                  : 250 * 1024 * 1024
            } // 5MB for 'grounds', 30KB for SVG, 250MB for the rest (images/video)
            disabled={isLoading || !isAuthenticated}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className="dark:border-lead-200 border-lead-500 mt-4 flex grow cursor-pointer flex-col items-center justify-center border-2 border-dashed bg-zinc-50/50 px-2.5 duration-150 md:mt-6 dark:bg-zinc-900"
              >
                <input {...getInputProps()} />
                {!isLoading && (
                  <div className="bg-lead-200 flex size-12 items-center justify-center rounded-full text-black">
                    <Upload className="size-6" />
                  </div>
                )}
                <p className="mt-4 select-none text-center text-sm font-medium text-zinc-500 dark:text-zinc-300">
                  {isLoading && "Uploading. Please wait..."}
                  {!isLoading &&
                    isAuthenticated &&
                    "Drag & drop your file here, or click to select file"}
                  {!isLoading && !isAuthenticated && "Please login to upload a file"}
                </p>
                <div className="mt-2.5 w-full max-w-[320px] px-4">
                  <UploadProgressBar progress={progress} />
                </div>
              </div>
            )}
          </Dropzone>
        </div>
      </div>
    </div>
  );
};

const Actions = (props: Action) => {
  const { setCurrentStep, isLoading, values } = props;
  const { isAuthenticated, login } = useUser();

  return (
    <>
      {isAuthenticated && (
        <Button
          size="md"
          onClick={() => setCurrentStep("details")}
          disabled={isLoading || !values.url}
        >
          Continue
        </Button>
      )}
      {!isAuthenticated && (
        <Button size="md" onClick={login}>
          Login to continue
        </Button>
      )}
    </>
  );
};

UploadStep.actions = Actions;
UploadStep.width = "920px";
