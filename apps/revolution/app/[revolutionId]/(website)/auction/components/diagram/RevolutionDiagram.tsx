import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { notFound } from "next/navigation";
import FundingNode from "./FundingNode";
import ImpactNode from "./ImpactNode";
import MembersNode from "./MembersNode";
import PoolNode from "./PoolNode";
import { generateRevolutionFlow } from "./generateRevolutionFlow";

interface Props {
  revolutionId: string;
}

export const RevolutionDiagram = async (props: Props) => {
  const { revolutionId } = props;

  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution) notFound();

  const { nodes, edges, height } = await generateRevolutionFlow(revolution);

  return (
    <div className="mx-auto px-4 pt-14 lg:px-6 dark:bg-zinc-800">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="dark:text-lead-100 text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          {revolution.name} makes impact
        </h2>
        <p className="mx-auto mt-2 max-w-2xl leading-8 text-zinc-600 lg:text-lg dark:text-zinc-200">
          We continuously fund people to build a better future
        </p>
      </div>
      <div style={{ height }}>
        <ReactFlow
          defaultNodes={nodes}
          defaultEdges={edges}
          fitView
          maxZoom={1.25}
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
            impact: ImpactNode,
            pool: PoolNode,
            funding: FundingNode,
            members: MembersNode,
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
