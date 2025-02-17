"use client";

import { useUrlState } from "@cobuild/libs/hooks/useUrlState";
import { useState } from "react";
import Search from "@cobuild/ui/pixel-icons/Search";
import { useDebouncedCallback } from "use-debounce";

export const RevolutionSearch = () => {
  const [urlFilter, setUrl] = useUrlState("revolutionName");
  const [username, setUsername] = useState(urlFilter);

  const debounced = useDebouncedCallback(
    // function
    value => {
      setUrl(value);
    },
    // delay in ms
    350,
  );

  return (
    <div className="flex flex-row items-center justify-start gap-2 text-lg">
      <Search width={22} height={22} />
      <input
        placeholder="Search"
        className="bg-transparent focus:outline-none"
        value={username ?? ""}
        onChange={e => {
          console.log({ target: e.target.value });
          setUsername(e.target.value);
          debounced(e.target.value);
        }}
      />
    </div>
  );
};
