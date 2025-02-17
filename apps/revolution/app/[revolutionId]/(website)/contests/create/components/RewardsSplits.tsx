"use client";

import { ordinal } from "@cobuild/libs/utils/numbers";
import { TextInput } from "@cobuild/ui/atoms/TextInput/TextInput";
import SvgClose from "@cobuild/ui/pixel-icons/Close";
import UserPlus from "@cobuild/ui/pixel-icons/UserPlus";
import clsx from "classnames";
import { useState } from "react";

interface Props {
  max?: number;
}

export const RewardsSplits = (props: Props) => {
  const { max = 15 } = props;

  const [splits, setSplits] = useState([
    { percent: 50, key: crypto.randomUUID() },
    { percent: 30, key: crypto.randomUUID() },
    { percent: 20, key: crypto.randomUUID() },
  ]);

  const updateSplit = (split: { key: string; percent: number }) => {
    setSplits(splits.map(s => (s.key === split.key ? split : s)));
  };

  return (
    <>
      <input name="payoutSplits" type="hidden" value={JSON.stringify(splits.map(s => s.percent))} />
      {splits.map((split, i) => (
        <div className="flex items-center space-x-2" key={`split_${split.key}`}>
          <div className="grow text-sm">{ordinal(i + 1)} Place</div>
          <TextInput
            value={split.percent}
            type="number"
            min={1}
            max={100}
            step={1}
            placeholder="0"
            append={"%"}
            onChange={e => updateSplit({ key: split.key, percent: parseFloat(e.target.value) })}
            name={`rewardsPercent_${i + 1}`}
            wrapperClassName="w-[108px]"
            autoComplete="off"
          />
          <button
            onClick={() => setSplits(splits.filter(s => s.key !== split.key))}
            type="button"
            disabled={splits.length === 1}
            className="disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SvgClose className="h-4 w-4 text-zinc-500 duration-150 hover:text-black dark:hover:text-white" />
          </button>
        </div>
      ))}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSplits([...splits, { percent: 10, key: crypto.randomUUID() }])}
          className={clsx(
            "flex items-center text-xs text-zinc-500 hover:text-black disabled:opacity-50 dark:hover:text-white",
            { "cursor-not-allowed": splits.length >= max },
          )}
          type="button"
          disabled={splits.length >= max}
        >
          <UserPlus className="mr-1.5 h-3.5 w-3.5 opacity-80" />
          Add split
        </button>
      </div>
    </>
  );
};
