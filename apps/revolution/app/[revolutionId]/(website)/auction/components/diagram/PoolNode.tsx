"use client";

import { Price } from "@cobuild/ui/molecules/Price/Price";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import Image from "next/image";
import { memo } from "react";

export type IPoolNode = Node<
  {
    name: string;
    logoUrl: string;
    balanceEth: number;
  },
  "pool"
>;

function PoolNode(props: NodeProps<IPoolNode>) {
  const { width, height } = props;
  const { logoUrl, name, balanceEth } = props.data;

  return (
    <div
      className="bg-secondary-50 pointer-events-auto inline-block cursor-auto rounded-lg px-6 py-4"
      style={{ width, height }}
    >
      <div className="flex flex-col items-center justify-center">
        <Image src={logoUrl} width={48} height={48} alt={name} className="size-12 rounded-lg" />
        <div className="dark:text-secondary-950 mt-2.5 text-xl font-medium">{name}</div>
        <div className="dark:text-secondary-950 text-xs">Treasury</div>
        <div className="bg-lead-500 mt-2 rounded-md px-1.5 py-0.5 text-xs font-medium text-white">
          <Price>{balanceEth}</Price>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={false}
        style={{ background: "var(--color-lead-500)" }}
      />

      <Handle
        type="target"
        position={Position.Top}
        isConnectable={false}
        style={{ background: "var(--color-lead-500)" }}
      />
    </div>
  );
}

export default memo(PoolNode);
