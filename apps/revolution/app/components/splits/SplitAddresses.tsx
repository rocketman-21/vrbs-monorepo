"use client";

import UserPlus from "@cobuild/ui/pixel-icons/UserPlus";
import { CreatorSplit } from "@cobuild/database/types";
import { isEthAddress } from "@cobuild/libs/utils/account";
import clsx from "classnames";
import { useState } from "react";
import * as Yup from "yup";
import { SplitAddress } from "./SplitAddress";

type ExtendedCreatorSplit = CreatorSplit & { name: string; isRequired?: true };
type CreatorSplitWithKey = CreatorSplit & { key: string };

interface Props {
  label?: string;
  requiredValue?: ExtendedCreatorSplit[];
  initialValue?: CreatorSplit[];
  size?: "base" | "lg";
  onChange: (splits: CreatorSplit[]) => void;
  onError?: (hasError: boolean) => void;
  min?: number;
  max?: number;
  chainId: number;
}

const schema = Yup.array()
  .of(
    Yup.object({
      address: Yup.string()
        .required("Provide ETH address")
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
  });

export const SplitAddresses = (props: Props) => {
  const {
    onChange,
    initialValue = [],
    requiredValue = [],
    label = "creator",
    min = 1,
    max = 15,
    chainId,
    onError,
    size = "lg",
  } = props;
  const [error, setError] = useState<string | null>(null);
  const [hasTouched, setHasTouched] = useState(false);
  const [splits, setSplits] = useState<CreatorSplitWithKey[]>(
    [...requiredValue, ...initialValue].map(split => ({ ...split, key: crypto.randomUUID() })),
  );

  const updateSplits = (splits: CreatorSplitWithKey[]) => {
    setHasTouched(true);
    setSplits(splits);
    onChange(splits.map(({ address, bps }) => ({ address, bps })));
    schema
      .validate(splits)
      .then(() => updateError(null))
      .catch(e => updateError(e.message));
  };

  const updateSplit = (split: CreatorSplitWithKey) => {
    updateSplits(splits.map(s => (s.key === split.key ? split : s)));
  };

  const updateError = (message: string | null) => {
    setError(message);
    if (onError) onError(message !== null);
  };

  return (
    <>
      {splits.map(split => (
        <SplitAddress
          key={`address_${split.key}`}
          initialValue={split}
          canBeEdited={!requiredValue.map(r => r.address).includes(split.address)}
          canBeRemoved={
            splits.length > min && !requiredValue.map(r => r.address).includes(split.address)
          }
          removeSplit={() => updateSplits(splits.filter(s => s.key !== split.key))}
          chainId={chainId}
          size={size}
          onChange={data => updateSplit({ ...data, key: split.key })}
          name={requiredValue.find(r => r.address === split.address)?.name}
        />
      ))}
      <div className="flex items-center justify-between">
        <button
          onClick={() =>
            updateSplits([...splits, { address: "", bps: 1000, key: crypto.randomUUID() }])
          }
          className={clsx(
            "flex items-center text-xs capitalize text-zinc-500 hover:text-black disabled:opacity-50 dark:hover:text-white",
            { "cursor-not-allowed": splits.length >= max },
          )}
          type="button"
          disabled={splits.length >= max}
        >
          <UserPlus className="mr-1.5 h-3.5 w-3.5 opacity-80" />
          Add {label}
        </button>
        {hasTouched && (
          <div className="flex items-center text-xs">
            <span
              className={clsx("mr-1.5 inline-block size-2.5 rounded-full", {
                "bg-green-500": !error,
                "bg-red-500": error,
              })}
            />
            <span className={clsx({ "text-green-500": !error, "text-red-500": error })}>
              {error || "Looking good!"}
            </span>
          </div>
        )}
      </div>
    </>
  );
};
