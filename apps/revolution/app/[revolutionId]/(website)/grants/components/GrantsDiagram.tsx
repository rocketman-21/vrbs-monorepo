import { Grants } from "@cobuild/database/models/revolution/grants/Grants";
import { Pools } from "@cobuild/database/models/revolution/pools/Pools";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { ReactFlow } from "@xyflow/react";
import GrantNode from "./nodes/GrantNode";
import MemberNode from "./nodes/MemberNode";
import PoolNode, { IPoolNode } from "./nodes/PoolNode";
import { generateFlow } from "./nodes/generateFlow";

import "@xyflow/react/dist/style.css";

interface Props {
  revolutionId: string;
}

export const GrantsDiagram = async (props: Props) => {
  const { revolutionId } = props;

  const revolution = await Revolutions().getById(revolutionId);
  const { logo, name } = revolution!;

  const [pool, grants] = await Promise.all([
    Pools().getVrbsSuperfluidPool(),
    Grants().getAll(revolutionId),
  ]);

  const poolNode = {
    type: "pool",
    id: "pool-1",
    position: { x: 0, y: 0 },
    data: {
      name: `${name} Grants`,
      logoUrl: logo,
      totalFlowRate: pool.totalFlowRate,
      totalUnits: pool.totalUnits,
      monthlyFlowRate: pool.monthlyFlowRate,
      balance: pool.balance,
    },
    connectable: false,
  } satisfies IPoolNode;

  const { nodes, edges, height } = generateFlow(grants);

  return (
    <div className="mx-auto px-4 pt-14 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          Supporting builders
        </h2>
        <p className="mt-4 max-w-2xl leading-8 text-zinc-600 lg:text-lg">
          We continuously reward people for growing {name}
        </p>
      </div>
      <div style={{ height }}>
        <ReactFlow
          defaultNodes={[poolNode, ...nodes]}
          defaultEdges={edges}
          fitView
          maxZoom={1.5}
          panOnDrag={true}
          nodesDraggable={true}
          nodesFocusable={false}
          edgesFocusable={false}
          elementsSelectable={false}
          zoomOnPinch={true}
          zoomOnScroll={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
          proOptions={{ hideAttribution: true }}
          nodeTypes={{
            grant: GrantNode,
            pool: PoolNode,
            member: MemberNode,
          }}
          defaultEdgeOptions={{
            animated: true,
            style: { stroke: "var(--color-lead-400)", strokeWidth: 2 },
          }}
        />
      </div>
    </div>
  );
};
