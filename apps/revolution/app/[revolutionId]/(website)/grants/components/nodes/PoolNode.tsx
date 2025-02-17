"use client";

import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import Image from "next/image";
import { memo } from "react";
import { formatEther } from "viem";

export type IPoolNode = Node<
  {
    name: string;
    logoUrl: string;
    totalFlowRate: number;
    totalUnits: number;
    monthlyFlowRate: number;
    balance: number;
  },
  "pool"
>;

function PoolNode(props: NodeProps<IPoolNode>) {
  const { logoUrl, name, monthlyFlowRate } = props.data;

  return (
    <div className="bg-secondary-50 pointer-events-auto inline-block cursor-auto rounded-lg px-6 py-4">
      <div className="flex flex-col items-center justify-center">
        <Image src={logoUrl} width={48} height={48} alt={name} className="size-12 rounded-lg" />
        <div className="mt-2.5 text-lg font-medium">{name}</div>
        <div className="bg-lead-500 mt-2 rounded-md px-1.5 py-0.5 text-xs font-medium text-white">
          {Intl.NumberFormat("en", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(Number(formatEther(BigInt(monthlyFlowRate))))}
          /month
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={false}
        style={{ background: "var(--color-lead-500)" }}
      />
    </div>
  );
}

export default memo(PoolNode);
