"use client";

import { IGrant } from "@cobuild/database/models/revolution/grants/IGrant";
import { Serialized } from "@cobuild/database/types";
import { Button } from "@cobuild/ui/atoms/Button";
import Image from "next/image";
import Link from "next/link";
import pluralize from "pluralize";
import { useState } from "react";
import { formatEther } from "viem";
import { GrantApplicationModal } from "./GrantApplicationModal";

interface Props {
  grant: Serialized<IGrant>;
  className?: string;
}

export const OpportunityItem = (props: Props) => {
  const { grant, className = "" } = props;

  const [isOpen, setIsOpen] = useState(false);

  const { maxOpenings, openings } = grant;

  return (
    <article
      className={`flex w-full items-center space-x-4 ${className} group rounded-xl border border-zinc-300 p-4 duration-100 hover:border-zinc-400`}
    >
      <GrantApplicationModal
        grant={grant}
        isOpen={isOpen}
        close={() => setIsOpen(false)}
        withDescription
      />
      <Link
        href={grant.url}
        className="flex shrink-0"
        onClick={e => {
          e.preventDefault();
          setIsOpen(true);
        }}
      >
        <Image
          src={grant.imageUrl}
          alt={grant.title}
          width={64}
          height={64}
          className="size-16 rounded-xl object-cover duration-100 hover:opacity-75"
        />
      </Link>

      <div className="grow">
        <h3 className="mt-1 font-semibold text-zinc-900 md:text-lg dark:text-zinc-50">
          <Link
            href={grant.url}
            className="hover:text-lead-500 dark:hover:text-lead-300 duration-100"
            onClick={e => {
              e.preventDefault();
              setIsOpen(true);
            }}
          >
            {grant.title}
          </Link>
        </h3>
        {maxOpenings && maxOpenings > 0 && (
          <h5 className="text-sm text-zinc-500">
            {openings} of {maxOpenings} {pluralize("opening", maxOpenings)} available
          </h5>
        )}
        <div className="mt-1.5">
          <span className="bg-lead-500 inline-block rounded-md px-2 py-1 text-xs font-medium tabular-nums text-white">
            {Intl.NumberFormat("en", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(Number(formatEther(BigInt(grant.monthlyFlowRate))))}
            /month
          </span>
        </div>
      </div>
      <div className="max-sm:hidden shrink-0">
        <Button
          className="pointer-events-none -translate-x-2 opacity-0 duration-100 ease-in-out group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100"
          type="button"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Apply
        </Button>
      </div>
    </article>
  );
};
