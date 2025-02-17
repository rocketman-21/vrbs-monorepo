import "server-only";

import { getGrantMembers } from "@cobuild/database/models/revolution/grants/Grant";
import { Grants } from "@cobuild/database/models/revolution/grants/Grants";
import { Profiles } from "@cobuild/database/models/social/Profiles";
import { IRevolution } from "@cobuild/database/types";
import { serializeSync } from "@cobuild/database/utils";
import { getBalanceInEth } from "@cobuild/libs/web3/balance";
import type { Edge, Node } from "@xyflow/react";
import { IFundingNode } from "./FundingNode";
import { IImpactNode } from "./ImpactNode";
import { IMembersNode } from "./MembersNode";
import { IPoolNode } from "./PoolNode";
import { funding } from "./funding";

const WIDTH = 1024;

export async function generateRevolutionFlow(revolution: IRevolution): Promise<{
  nodes: Node[];
  edges: Edge[];
  height: number;
  width: number;
}> {
  const [grants, balanceEth] = await Promise.all([
    Grants().getImpactGrants(revolution.revolutionId),
    getBalanceInEth(revolution.treasury || []),
  ]);

  const { logo, name } = revolution!;

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  let x = 0;
  let y = 0;
  let spacing = 50;
  let itemWidth = (WIDTH - (funding.length - 1) * spacing) / funding.length;

  funding.forEach(({ id }, index) => {
    nodes.push({
      type: "funding",
      id,
      position: { x, y: index === 0 || index === funding.length - 1 ? y + 40 : y },
      data: { id },
      connectable: false,
      width: itemWidth,
      height: 140,
    } satisfies IFundingNode);

    edges.push({
      id: `pool-1_funding_${id}`,
      source: id,
      target: "pool-1",
    });

    x += itemWidth + spacing;
  });

  x = 0;
  y += 320;

  nodes.push({
    type: "pool",
    id: "pool-1",
    width: 220,
    height: 160,
    position: { x: WIDTH / 2 - 200 / 2, y },
    data: {
      name: `${name} DAO`,
      logoUrl: logo,
      balanceEth,
    },
  } satisfies IPoolNode);

  x = 0;
  y += 280;

  spacing = 70;
  itemWidth = (WIDTH - (grants.length - 1) * spacing) / grants.length;

  await Promise.all(
    grants.map(async (grant, index) => {
      const currentX = x + (itemWidth + spacing) * index;
      nodes.push({
        type: "impact",
        id: grant.id,
        position: { x: currentX, y },
        data: { grant: serializeSync(grant) },
        connectable: false,
        width: itemWidth,
        height: 110,
      } satisfies IImpactNode);

      edges.push({
        id: `pool-1_grant_${grant.id}`,
        source: "pool-1",
        target: grant.id,
      });

      const members = await getGrantMembers(grant.contractAddress, grant.team);
      const profiles = await Profiles().getMany(members);

      nodes.push({
        type: "members",
        id: `members_${grant.id}`,
        position: { x: currentX, y: y + 160 },
        data: { profiles, revolutionId: revolution.revolutionId },
        connectable: false,
        width: itemWidth,
      } satisfies IMembersNode);

      edges.push({
        id: `grant_${grant.id}_members`,
        source: grant.id,
        target: `members_${grant.id}`,
      });
    }),
  );

  x = 0;
  y += 640;

  return { nodes, edges, height: y, width: WIDTH };
}
