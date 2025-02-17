import Check from "@cobuild/ui/pixel-icons/Check";
import Close from "@cobuild/ui/pixel-icons/Close";
import Minus from "@cobuild/ui/pixel-icons/Minus";
import { IProposal, ProposalOption } from "@cobuild/database/types";
import { PresetOption } from "@cobuild/libs/governance/voting";
import cx from "classnames";
import { Dispatch, SetStateAction } from "react";

interface Props {
  options: IProposal["options"];
  hasPresetOptions: boolean;
  onChange: Dispatch<SetStateAction<number | undefined>>;
  selectedOptionId: number | undefined;
  alreadyVoted: boolean;
}

export const VoteButtons = (props: Props) => {
  const { options, ...rest } = props;

  return (
    <div className={cx("flex", { "flex-wrap": !props.hasPresetOptions })}>
      {options.map(option => (
        <VoteButton key={option.optionId} option={option} {...rest} />
      ))}
    </div>
  );
};

const VoteButton = (props: Omit<Props, "options"> & { option: ProposalOption }) => {
  const { selectedOptionId, onChange, option, alreadyVoted } = props;
  const { color, name, optionId } = option;

  const isSelected = selectedOptionId === optionId;

  return (
    <button
      onClick={() => onChange(isSelected ? undefined : optionId)}
      className={cx(
        "m-1 flex grow items-center justify-center rounded-3xl border p-2 text-sm font-medium duration-150 ease-in-out",
        {
          "opacity-50 grayscale": alreadyVoted && !isSelected,
          "bg-white dark:border-zinc-700 dark:bg-transparent": !isSelected,
          "bg-lead-100 text-contrast border-transparent dark:bg-zinc-700 dark:contrast-75":
            isSelected,
        },
      )}
      style={{
        backgroundColor: isSelected && color ? color : undefined,
        color: !isSelected && color ? color : "#fff",
      }}
      disabled={alreadyVoted}
    >
      {getVoteIcon(name)} <span>{name}</span>
    </button>
  );
};

const getVoteIcon = (vote: PresetOption | string) => {
  switch (vote) {
    case "For":
      return <Check width={16} height={16} className="mr-1" />;
    case "Against":
      return <Close width={16} height={16} className="mr-1" />;
    case "Abstain":
      return <Minus width={16} height={16} className="mr-1" />;
    default:
      return <></>;
  }
};
