"use client";

import Search from "@cobuild/ui/pixel-icons/Search";

type Props = {
  phrase: string;
  onChange: (phrase: string) => void;
};

export const ProposalSearchInput = (props: Props) => {
  const { phrase, onChange } = props;

  return (
    <div className="flex grow items-center space-x-1">
      <Search width={16} height={16} className="opacity-75" />
      <input
        placeholder="Search..."
        className="focus:border-lead-50 w-full max-w-full border-spacing-y-2 border-b border-dotted border-transparent bg-transparent py-px text-sm outline-none duration-150"
        type="search"
        value={phrase}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
};
