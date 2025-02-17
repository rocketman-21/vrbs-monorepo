"use client";

import { Dropdown } from "@cobuild/ui/atoms/Dropdown";
import ChevronDown from "@cobuild/ui/pixel-icons/ChevronDown";
import { StatusIcons } from "./StatusBadge";

enum ProposalStatus {
  ACTIVE = "active",
  EXECUTED = "executed",
  CANCELLED = "cancelled",
  DEFEATED = "defeated",
  QUEUED = "queued",
  PENDING = "pending",
  CLOSED = "closed",
  SUCCEEDED = "succeeded",
}

const PROPOSAL_FILTER_OPTIONS = [
  { label: "All", value: "" },
  ...Object.values(ProposalStatus).map(status => ({
    label: status.charAt(0).toUpperCase() + status.slice(1),
    value: status,
  })),
];

type Props = {
  status: string;
  onChange: (status: string) => void;
};

export const ProposalsFilter = (props: Props) => {
  const { status, onChange } = props;

  return (
    <Dropdown
      className="text-sm"
      button={
        <button className="flex items-center text-zinc-800 opacity-75 duration-150 hover:opacity-100 dark:text-white">
          {status ? status.charAt(0).toUpperCase() + status.slice(1) : "All"}{" "}
          <ChevronDown width="16" height="16" className="ml-1" />
        </button>
      }
    >
      {PROPOSAL_FILTER_OPTIONS.map(option => {
        return (
          <Dropdown.Item key={option.label} onClick={() => onChange(option.value)}>
            <span className="flex items-center">
              {renderStatusIcon(option.value as ProposalStatus)}
              {option.label}
            </span>
          </Dropdown.Item>
        );
      })}
    </Dropdown>
  );
};

const renderStatusIcon = (status: ProposalStatus) => {
  const StatusIcon = StatusIcons[status];
  if (StatusIcon) {
    return <StatusIcon width="16" height="16" className="mr-1" />;
  }

  return <></>;
};
