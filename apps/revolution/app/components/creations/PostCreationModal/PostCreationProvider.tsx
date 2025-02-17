"use client";

import { useUser } from "@cobuild/libs/hooks/useUser";
import { CultureIndexData } from "@cobuild/libs/revolution/cultureIndex";
import { isEthAddress } from "@cobuild/libs/utils/account";
import { CultureIndexMediaType } from "@cobuild/libs/web3/revolution/types";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { useRevolution } from "app/libs/useRevolution";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import React, { PropsWithChildren, useContext, useState } from "react";
import { useBalance } from "wagmi";
import * as Yup from "yup";
import { createOffchainSubmission } from "./createOffchainSubmission";
import { DetailsStep } from "./steps/Details";
import { UploadStep } from "./steps/Upload";
import { useOnchainPublish } from "./useOnchainPublish";

type ContextValue = {
  revolutionId: string;
  currentStep: Step;
  setCurrentStep: (step: Step) => void;
  steps: typeof steps;
  width: string | number;
  setWidth: (width: string | number) => void;
  actions?: (props: Action) => JSX.Element;
  isModalOpen: boolean;
  closeModal: () => void;
  isLoading: boolean;
  hasSufficientBalance: boolean;
  setIsLoading: (isLoading: boolean) => void;
  cultureIndex: CultureIndexData;
} & FormikProps<CreationSchema>;

const steps = {
  upload: UploadStep,
  details: DetailsStep,
} as const;

type Step = keyof typeof steps;

export type Action = Omit<ContextValue, "actions">;

const creationSchema = Yup.object({
  name: Yup.string().max(100).required("Title is required"),
  description: Yup.string().optional().max(255),
  url: Yup.string().required(),
  thumbnailUrl: Yup.string().optional(),
  mediaType: Yup.string().optional().oneOf(["image", "video"]),
  mediaWidth: Yup.number().optional(),
  mediaHeight: Yup.number().optional(),
  embedUrl: Yup.string().optional().url(),
  requirements: Yup.boolean().required().oneOf([true], "Confirm requirements"),
  license: Yup.boolean().required().oneOf([true], "Agree to the license"),
  creators: Yup.array()
    .of(
      Yup.object({
        address: Yup.string()
          .required("Provide ETH Address")
          .test("valid-eth-address", `Invalid ETH address`, function test(value) {
            return isEthAddress(value);
          }),
        bps: Yup.number()
          .required()
          .min(100, "Minimum percentage is 1%")
          .max(10000, "Maximum percentage is 100%"),
      }),
    )
    .required()
    .test("sums-to-10000", `Percentages must sum to 100`, function test(value) {
      return value?.reduce((acc, split) => acc + split.bps, 0) === 10000;
    }),
});

type CreationSchema = Yup.InferType<typeof creationSchema>;

export const PostCreation = React.createContext<ContextValue | undefined>(undefined);
PostCreation.displayName = "PostCreation";

export const PostCreationProvider = (
  props: PropsWithChildren<{
    isOpen: boolean;
    closeModal: () => void;
    cultureIndex: CultureIndexData;
  }>,
) => {
  const { isOpen, closeModal, cultureIndex } = props;
  const { user } = useUser();
  const { revolutionId } = useRevolution();
  const [currentStep, setCurrentStepState] = useState<Step>("upload");
  const [width, setWidth] = useState<number | string>(steps[currentStep].width);
  const [isLoading, setIsLoading] = useState(false);
  const { data: balance } = useBalance({
    address: user ?? undefined,
    chainId: cultureIndex.chainId,
  });

  const hasSufficientBalance = Number(balance?.formatted || 0) > 0.01;

  const setCurrentStep = (step: Step) => {
    setCurrentStepState(step);
    setWidth(steps[step].width);
  };

  const { createPiece } = useOnchainPublish({
    contractAddress: cultureIndex.address,
    chainId: cultureIndex.chainId,
    onSuccess: async (_: string, slug?: string) => {
      if (slug) {
        window.location.assign(`/${revolutionId}/creations/${slug}`);
      } else {
        closeModal();
        toast.loading("Failed to index, art piece will show up on your profile within 2 minutes.", {
          duration: 10000,
        });
      }
    },
  });

  const onSubmit = async (
    values: CreationSchema,
    { setSubmitting }: FormikHelpers<CreationSchema>,
  ) => {
    setSubmitting(true);

    if (hasSufficientBalance) {
      await createPiece(
        {
          name: values.name,
          description: values.description || "",
          animationUrl: values.mediaType === "video" ? values.url : "",
          image: values.mediaType === "image" ? values.url : "",
          mediaType:
            values.mediaType === "video"
              ? CultureIndexMediaType.ANIMATION
              : CultureIndexMediaType.IMAGE,
          text: "",
        },
        values.creators,
      );
    } else {
      const res = await createOffchainSubmission({
        revolutionId,
        chainId: cultureIndex.chainId,
        contractAddress: cultureIndex.address,
        data: {
          name: values.name,
          description: values.description || "",
          url: values.url,
          creators: values.creators,
          type: (values.mediaType || "image") as "image" | "video",
        },
      });
      if (res.error) {
        return toast.error(res.error);
      }

      if (!res.submission) {
        return toast.error("Failed to submit art piece");
      }

      const { submission } = res;

      if (submission.slug) window.location.assign(`/${revolutionId}/creations/${submission.slug}`);
    }

    setSubmitting(false);
  };

  return (
    <Formik
      onSubmit={onSubmit}
      validationSchema={
        revolutionId === "thatsgnarly"
          ? creationSchema.omit(["license", "requirements"])
          : creationSchema
      }
      enableReinitialize
      initialValues={{
        url: "",
        name: "",
        creators: [{ address: user || "0x", bps: 10000 }],
        license: false,
        requirements: false,
      }}
    >
      {formikProps => (
        <Form>
          <PostCreation.Provider
            value={{
              cultureIndex,
              revolutionId,
              hasSufficientBalance,
              currentStep,
              setCurrentStep,
              steps,
              width,
              setWidth,
              actions: steps[currentStep].actions,
              isModalOpen: isOpen,
              closeModal: () => {
                setCurrentStep("upload");
                formikProps.resetForm();
                closeModal();
              },
              isLoading,
              setIsLoading,
              ...formikProps,
            }}
          >
            {props.children}
          </PostCreation.Provider>
        </Form>
      )}
    </Formik>
  );
};

export function usePostCreation() {
  const context = useContext(PostCreation);
  if (context === undefined) {
    throw new Error(`usePostCreation must be used within an PostCreationProvider`);
  }
  return context;
}
