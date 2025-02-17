"use client";

import { Dropdown } from "@cobuild/ui/atoms/Dropdown";
import ArrowsVertical from "@cobuild/ui/pixel-icons/ArrowsVertical";

const PROPOSAL_SORT_OPTIONS = ["Newest", "Oldest", "Most favored", "Highest Budget"];

type Props = {
  sort: string;
  onChange: (sort: string) => void;
};

export const ProposalsSorter = (props: Props) => {
  const { sort, onChange } = props;

  return (
    <Dropdown
      className="text-sm"
      button={
        <button className="flex items-center text-zinc-800 opacity-75 duration-150 hover:opacity-100 dark:text-white">
          {sort || "Newest"} <ArrowsVertical width="16" height="16" className="ml-1" />
        </button>
      }
    >
      {PROPOSAL_SORT_OPTIONS.map(option => (
        <Dropdown.Item key={option} onClick={() => onChange(option)}>
          {option}
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
};
