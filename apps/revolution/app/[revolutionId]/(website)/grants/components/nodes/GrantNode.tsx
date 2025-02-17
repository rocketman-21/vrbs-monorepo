"use client";

import { IGrant, Serialized } from "@cobuild/database/types";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import SvgSun from "@cobuild/ui/pixel-icons/Sun";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import clsx from "classnames";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { formatEther } from "viem";

export type IGrantNode = Node<{ grant: Serialized<IGrant> }, "grant">;

function GrantNode(props: NodeProps<IGrantNode>) {
  const { grant } = props.data;
  const { imageUrl, title, url, tagline, monthlyFlowRate, isOpenGrantPool, isTopLevel } = grant;

  return (
    <div
      className={clsx("pointer-events-auto cursor-auto rounded-lg", {
        "bg-secondary-50 p-2.5": isTopLevel,
        "bg-lead-50 p-1.5": !isTopLevel,
      })}
    >
      <div className="flex items-center">
        <Image
          src={imageUrl}
          width={80}
          height={80}
          alt={title}
          className={clsx("", {
            "size-18 rounded-lg": isTopLevel,
            "size-10 rounded-full": !isTopLevel,
          })}
        />
        <div className="ml-2.5 flex flex-col items-start pr-1.5">
          <h2 className={clsx("font-medium", { "text-sm": !isTopLevel })}>
            <Link href={url} className="hover:text-lead-400 duration-100">
              {title}
            </Link>
          </h2>
          {isTopLevel && (
            <div className="line-clamp-2 max-w-48 text-xs text-zinc-700">{tagline}</div>
          )}
          <div className="mt-2 flex items-center space-x-1">
            <div className="bg-lead-500 rounded-md px-1.5 py-0.5 text-xs font-medium text-white">
              {Intl.NumberFormat("en", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(Number(formatEther(BigInt(monthlyFlowRate))))}
              /month
            </div>
            {isOpenGrantPool && (
              <Tooltip subtitle="Help wanted" className="inline-flex">
                <span className="bg-secondary-200 text-secondary-950 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium leading-none">
                  <SvgSun className="size-4" />
                </span>
              </Tooltip>
            )}
          </div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        isConnectable={false}
        style={{ background: "var(--color-lead-500)" }}
      />
      {isTopLevel && (
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={false}
          style={{ background: "var(--color-lead-500)" }}
        />
      )}
    </div>
  );
}

export default memo(GrantNode);
