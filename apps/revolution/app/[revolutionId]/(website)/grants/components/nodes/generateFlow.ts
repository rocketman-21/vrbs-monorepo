import { IGrant } from "@cobuild/database/types";
import { serializeSync } from "@cobuild/database/utils";
import type { Node, Edge } from "@xyflow/react";
import { IGrantNode } from "./GrantNode";
import { IMemberNode } from "./MemberNode";

export function generateFlow(grants: IGrant[]): {
  nodes: Node[];
  edges: Edge[];
  height: number;
} {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  let y = 0;

  grants
    .filter(grant => grant.poolBalance.isApprovedRecipient && grant.monthlyFlowRate > 0)
    .filter(grant => grant.isTopLevel)
    .forEach(grant => {
      const x = 400;
      const subgrants = grants.filter(s => s.parentContract === grant.contractAddress);

      const childrenItems = generateGrantChildrenItems(grant, subgrants, x, y);
      const childrenHeight = Math.max(48, 12 + childrenItems.height);

      nodes.push({
        type: "grant",
        id: grant.id,
        position: { x, y: y + childrenHeight / 2 - 36 },
        data: { grant: serializeSync(grant) },
        connectable: false,
      } satisfies IGrantNode);

      edges.push({
        id: `pool-1_grant_${grant.id}`,
        source: "pool-1",
        target: grant.id,
      });

      nodes.push(...childrenItems.nodes);
      edges.push(...childrenItems.edges);

      y += childrenHeight + 24;
    });

  return { nodes, edges, height: y };
}

function generateGrantChildrenItems(
  grant: IGrant,
  subgrants: IGrant[],
  x: number,
  y: number,
): { nodes: Node[]; edges: Edge[]; height: number } {
  const hasSubgrants = subgrants.length > 0;

  if (!hasSubgrants) {
    return generateTeamItems(grant.team, grant.id, x + 400, y + 12);
  }

  return generateSubgrantItems(subgrants, grant.id, x + 400, y + 12);
}

function generateSubgrantItems(subgrants: IGrant[], parentNodeId: string, x: number, y: number) {
  const nodes: IGrantNode[] = [];
  const edges: Edge[] = [];

  const nodeHeight = 60;
  const nodeMargin = 12;

  subgrants.forEach((subgrant, j) => {
    nodes.push({
      type: "grant",
      id: subgrant.id,
      position: { x, y: y + j * (nodeHeight + nodeMargin) },
      data: { grant: serializeSync(subgrant) },
      connectable: false,
    } satisfies IGrantNode);

    edges.push({
      id: `${parentNodeId}_subgrant_${subgrant.id}`,
      source: parentNodeId,
      target: subgrant.id,
    });
  });

  return { nodes, edges, height: subgrants.length * (nodeHeight + nodeMargin) };
}

function generateTeamItems(team: `0x${string}`[], parentNodeId: string, x: number, y: number) {
  const nodes: IMemberNode[] = [];
  const edges: Edge[] = [];

  const nodeHeight = 36;
  const nodeMargin = 12;

  team.forEach((address, j) => {
    nodes.push({
      type: "member",
      id: `${parentNodeId}_${address}`,
      position: { x, y: y + j * (nodeHeight + nodeMargin) },
      data: { address },
      connectable: false,
    });

    edges.push({
      id: `${parentNodeId}_member_${address}`,
      source: parentNodeId,
      target: `${parentNodeId}_${address}`,
    });
  });

  return { nodes, edges, height: team.length * (nodeHeight + nodeMargin) };
}
