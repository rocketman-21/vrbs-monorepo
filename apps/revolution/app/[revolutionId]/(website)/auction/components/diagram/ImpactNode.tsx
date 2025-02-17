"use client";

import { IGrant, Serialized } from "@cobuild/database/types";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import Link from "next/link";
import { memo } from "react";
import { formatEther } from "viem";

export type IImpactNode = Node<{ grant: Serialized<IGrant> }, "impact">;

function ImpactNode(props: NodeProps<IImpactNode>) {
  const { width, height } = props;
  const { grant } = props.data;
  const { title, url, monthlyFlowRate } = grant;

  return (
    <div
      className="bg-secondary-50 pointer-events-auto flex cursor-auto flex-col items-center justify-center rounded-lg p-2.5 text-center"
      style={{ width, height }}
    >
      <h2 className="text-lg font-medium">
        <Link href={url} className="hover:text-lead-400 dark:text-secondary-950 duration-100">
          {title}
        </Link>
      </h2>
      <div className="bg-lead-500 mt-2 inline-flex rounded-md px-1.5 py-0.5 text-xs font-medium text-white">
        {Intl.NumberFormat("en", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(Number(formatEther(BigInt(monthlyFlowRate))))}
        /month
      </div>

      <Handle
        type="target"
        position={Position.Top}
        isConnectable={false}
        style={{ background: "var(--color-lead-500)" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={false}
        style={{ background: "var(--color-lead-500)" }}
      />
    </div>
  );
}

export default memo(ImpactNode);
