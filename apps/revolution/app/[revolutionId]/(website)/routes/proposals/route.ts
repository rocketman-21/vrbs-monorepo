import "server-only";

import { Proposals } from "@cobuild/database/models/governance/Proposals";
import { IProposal, ProposalStatus } from "@cobuild/database/types";
import { serializeSync } from "@cobuild/database/utils";
import pick from "lodash/pick";
import { NextRequest, NextResponse } from "next/server";

const returnFields: Array<keyof IProposal> = [
  "profile",
  "creation",
  "proposalId",
  "proposer",
  "status",
  "title",
  "type",
  "options",
  "values",
  "numericId",
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const entityId = searchParams.get("entityId")?.trim();
    const phrase = searchParams.get("phrase")?.trim();
    const sort = searchParams.get("sort")?.trim();
    const status = searchParams.get("status")?.trim() as ProposalStatus;

    if (!entityId) throw new Error("Invalid entityId");

    const proposals = await Proposals().search({ entityId, phrase, status, sort });

    return NextResponse.json(serializeSync(proposals.map(p => pick(p, returnFields))));
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Error" }, { status: 500 });
  }
}
