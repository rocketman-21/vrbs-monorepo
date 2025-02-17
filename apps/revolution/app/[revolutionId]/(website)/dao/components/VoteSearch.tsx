"use client";

import SvgSearch from "@cobuild/ui/pixel-icons/Search";
import { useUrlState } from "@cobuild/libs/hooks/useUrlState";

export const VoteSearch = () => {
  const [phrase, setPhrase] = useUrlState("phrase");

  return (
    <div className="flex grow items-center space-x-2">
      <SvgSearch className="h-4 w-4 shrink-0 grow-0 text-zinc-400" />
      <input
        placeholder="Search"
        className="w-full bg-transparent text-sm focus:outline-none"
        value={phrase || ""}
        onChange={e => setPhrase(e.target.value)}
        type="search"
      />
    </div>
  );
};
