"use client";

import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { memo } from "react";
import { funding } from "./funding";

export type IFundingNode = Node<
  {
    id: (typeof funding)[number]["id"];
  },
  "funding"
>;

function FundingNode(props: NodeProps<IFundingNode>) {
  const { width, height } = props;
  const { id } = props.data;

  const { icon: Icon, name, description } = funding.find(f => f.id === id)!;

  return (
    <div
      className="bg-lead-50 pointer-events-auto inline-block cursor-auto rounded-lg p-4"
      style={{ width, height }}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="bg-secondary-300 inline-flex size-9 items-center justify-center rounded-full p-2">
          <Icon className="text-lead-900 h-full w-full" />
        </div>
        <div className="dark:text-lead-950 mt-1.5 text-base font-medium">{name}</div>
        <div className="text-lead-800 mt-1 text-center text-xs">{description}</div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={false}
        style={{ background: "var(--color-lead-500)" }}
      />
    </div>
  );
}

export default memo(FundingNode);
