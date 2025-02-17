"use client";

import { IRevolution } from "@cobuild/database/types";
import { useUrlState } from "@cobuild/libs/hooks/useUrlState";
import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { Scrollable } from "@cobuild/ui/atoms/Scrollable";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface Props {
  revolutions: Pick<IRevolution, "revolutionId" | "name" | "logo" | "coverImage">[];
}

export const RevolutionList = (props: Props) => {
  const { revolutions } = props;

  const [urlFilter] = useUrlState("revolutionName");
  const [filteredRevolutions, setFilteredRevolutions] = useState(revolutions);

  const search = useCallback(
    async (query: string) => {
      const Fuse = (await import("fuse.js")).default;
      const fuse = new Fuse(revolutions, {
        threshold: 0.3,
        keys: ["name"],
        distance: 1000,
      });
      setFilteredRevolutions(fuse.search(query).map(result => result.item));
    },
    [revolutions],
  );

  useEffect(() => {
    if (urlFilter && revolutions?.length) {
      search(urlFilter);
    } else {
      setFilteredRevolutions(revolutions);
    }
  }, [urlFilter, revolutions, search]);

  return (
    <Scrollable vertical className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
      {filteredRevolutions.map(r => (
        <RelatedRevolution {...r} key={r.revolutionId} />
      ))}
    </Scrollable>
  );
};

const RelatedRevolution = (props: Props["revolutions"][number]) => {
  const { name, revolutionId, logo, coverImage } = props;
  const { homepageRedirect = "" } = getRevolutionConfig(revolutionId);

  return (
    <Link
      href={`/${revolutionId}/${homepageRedirect}`}
      className="group relative flex h-36 w-full cursor-pointer flex-col items-start justify-end overflow-hidden rounded-lg p-2.5 md:w-80"
    >
      <Image
        src={coverImage || logo}
        alt={name}
        width="320"
        height="144"
        className={classNames(
          "absolute inset-0 h-full w-full rounded-md object-cover duration-200 ease-in-out group-hover:scale-110",
          {
            "blur-xl": !coverImage,
          },
        )}
        priority
      />

      <div className="absolute inset-0 rounded-md bg-gradient-to-b from-black/0 via-black/25 to-black/80 duration-200 ease-in-out" />
      <div className="relative flex items-center space-x-2.5 pb-1 text-left">
        <Image
          src={logo}
          alt={name}
          width="36"
          height="36"
          className="h-8 w-auto rounded-sm"
          priority
        />
        <h5 className="text-[15px] font-medium text-white">{name}</h5>
      </div>
    </Link>
  );
};
