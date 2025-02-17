"use client";

import { getArtRequirements } from "@cobuild/libs/revolution/artRequirements";
import { getErrorMessage } from "@cobuild/libs/utils/error";
import { Button } from "@cobuild/ui/atoms/Button";
import { Checkbox } from "@cobuild/ui/atoms/Checkbox";
import { FormElement } from "@cobuild/ui/atoms/FormElement";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import { FormTextArea } from "@cobuild/ui/molecules/Form/FormTextArea";
import FormTextInput from "@cobuild/ui/molecules/Form/FormTextInput";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { MobileConditionalTooltip } from "app/components/MobileConditionalTooltip";
import { SplitAddresses } from "app/components/splits/SplitAddresses";
import clsx from "classnames";
import { useEffect, useState } from "react";
import { CreationThumbnail } from "../CreationThumbnail";
import { Action, usePostCreation } from "../PostCreationProvider";

export const DetailsStep = () => {
  const {
    values,
    setWidth,
    setFieldValue,
    errors,
    touched,
    setFieldTouched,
    cultureIndex,
    revolutionId,
  } = usePostCreation();
  const [imageOpacity, setImageOpacity] = useState(100);
  const nogglesRequirement = cultureIndex.checklist.includes("⌐◨-◨ in the");

  const hasPreview = !!values.thumbnailUrl || values.mediaType === "video" || !!values.embedUrl;

  useEffect(() => {
    if (!hasPreview) setWidth("600px");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!cultureIndex) return null;

  return (
    <div>
      {hasPreview && (
        <div className="overflow-hidden max-sm:mb-6 md:absolute md:inset-y-0 md:left-0 md:w-[320px] md:rounded-l-lg">
          <CreationThumbnail imageOpacity={imageOpacity} setImageOpacity={setImageOpacity} />
        </div>
      )}

      <div className={clsx("min-h-[350px]", { "md:pl-[320px]": hasPreview })}>
        <h1 className="text-xl font-semibold dark:text-white">Details</h1>

        <div className="mt-4 flex flex-col space-y-4 md:mt-6">
          <FormTextInput
            label="Title*"
            name="name"
            autoComplete="off"
            showErrorText={false}
            placeholder="Title or name..."
            autoFocus
          />
          <FormTextArea
            label="Description"
            name="description"
            placeholder="A word from the artist (optional)..."
            rows={1}
            maxHeight={138}
            autosize
          />
          <FormElement.Label className="translate-y-1.5 pl-4">Creators</FormElement.Label>
          <SplitAddresses
            onChange={splits => setFieldValue("creators", splits)}
            initialValue={values.creators || []}
            chainId={cultureIndex.chainId}
            max={cultureIndex.MAX_NUM_CREATORS}
            size="base"
            label="Creator"
          />
          {revolutionId !== "thatsgnarly" && (
            <div className="!mt-8 space-y-4 rounded-lg bg-zinc-100/85 px-3.5 py-5 tracking-[-0.015em] lg:-mx-3.5 dark:bg-zinc-800">
              <div
                onMouseEnter={() => {
                  if (nogglesRequirement)
                    setImageOpacity(imageOpacity == 100 ? 21.21 : imageOpacity);
                }}
                onMouseLeave={() => setImageOpacity(imageOpacity == 21.21 ? 100 : imageOpacity)}
              >
                <Checkbox
                  checked={values.requirements}
                  onChange={e => {
                    setFieldTouched("requirements", true);
                    setFieldValue("requirements", e.target.checked);
                  }}
                  hasError={!!errors.requirements && touched.requirements}
                  name="requirements"
                  label={
                    nogglesRequirement ? (
                      "I confirm that my art features ⌐◨-◨ in the correct location."
                    ) : (
                      <>
                        I confirm that my art complies with{" "}
                        <Tooltip
                          title="Requirements"
                          subtitle={getArtRequirements(cultureIndex)}
                          className="inline-block underline duration-100 hover:opacity-75"
                        >
                          requirements
                        </Tooltip>
                      </>
                    )
                  }
                />
              </div>

              <Checkbox
                checked={values.license}
                onChange={e => {
                  setFieldTouched("license", true);
                  setFieldValue("license", e.target.checked);
                }}
                hasError={!!errors.license && touched.license}
                name="license"
                label={
                  revolutionId === "token8" ? (
                    "If selected my art will be auctioned."
                  ) : (
                    <>
                      If selected, my art will be in the{" "}
                      <a
                        href="https://creativecommons.org/publicdomain/zero/1.0/"
                        target="_blank"
                        className="underline duration-100 hover:opacity-75"
                      >
                        public domain
                      </a>
                    </>
                  )
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Actions = (props: Action) => {
  const { submitForm, isSubmitting, closeModal, hasSufficientBalance } = props;
  const { errors } = usePostCreation();

  return (
    <>
      <button
        disabled={isSubmitting}
        onClick={() => {
          if (!window.confirm("Are you sure you want to cancel?")) return;
          closeModal();
        }}
        className="pr-2.5 text-sm hover:underline"
      >
        Cancel
      </button>
      <MobileConditionalTooltip
        subtitle={
          hasSufficientBalance
            ? ""
            : "Insufficient balance to pay gas fees. You can still publish offchain."
        }
      >
        <Button
          disabled={isSubmitting}
          size="md"
          onClick={() => {
            // if there are any validation errors, show them
            if (Object.keys(errors).length > 0) {
              return toast.error(getErrorMessage(errors));
            }
            submitForm();
          }}
        >
          {isSubmitting ? "Please wait..." : hasSufficientBalance ? "Publish" : "Publish offchain"}
        </Button>
      </MobileConditionalTooltip>
    </>
  );
};

DetailsStep.actions = Actions;
DetailsStep.width = "880px";
