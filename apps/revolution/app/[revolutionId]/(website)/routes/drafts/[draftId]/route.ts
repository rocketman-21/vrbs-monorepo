import "server-only";

import { database } from "@cobuild/database";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { Drafts } from "@cobuild/database/models/social/Drafts";
import { IDraft, Serialized } from "@cobuild/database/types";
import { serializeSync } from "@cobuild/database/utils";
import { getUserFromHeaders } from "@cobuild/libs/user/route";
import pick from "lodash/pick";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { ingestEntityByType } from "onchain-ingestion/entityIngestion/ingestEntityByType";

interface Props {
  params: { revolutionId?: string; draftId?: string };
}

const allowedFieldsToUpdate: Array<keyof Serialized<IDraft>> = [
  "body",
  "title",
  "team",
  "isOnChain",
  "transactionHash",
  "isPrivate",
];

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const draftId = params.draftId?.toString();
    if (!draftId) throw new Error("Invalid draftId");

    const draft = await Drafts().findById(draftId);
    if (!draft) throw new Error("Invalid draft");

    if (draft.isPrivate) {
      const user = await getUserFromHeaders(request, draft.revolutionId);
      if (!draft.canBeManagedBy(user)) throw new Error("Invalid draft");
    }

    return NextResponse.json(serializeSync(draft));
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const body = await request.json();
    const revolutionId = params.revolutionId?.toString();
    const draftId = params.draftId?.toString();
    const user = await getUserFromHeaders(request, revolutionId);

    if (!draftId) {
      throw new Error("Invalid draftId");
    }

    if (!revolutionId) {
      throw new Error("Invalid revolutionId");
    }

    const revolution = await Revolutions().getById(revolutionId);

    if (!revolution) {
      throw new Error("Invalid revolution");
    }

    const draft = await Drafts().findById(draftId);

    if (!draft) {
      throw new Error("Invalid draft");
    }

    if (!draft.canBeManagedBy(user)) {
      return new Response("Not authorized.", { status: 403 });
    }

    if (draft.isOnChain) {
      throw new Error("Couldn't update draft that's already on chain");
    }

    const data = pick(body, allowedFieldsToUpdate);

    if (Object.keys(data).length < 1) {
      throw new Error("No data to update");
    }

    const updatedDraft = await Drafts().update(draftId, data);

    // Ingest proposals if draft is now on chain
    if (data.isOnChain === true) {
      //todo change this
      await ingestEntityByType(revolution.governanceTrackerType);
    }

    revalidatePath(`/${revolutionId}/dao/drafts/${draftId}`);
    revalidatePath(`/${revolutionId}/dao/proposals`);
    revalidatePath(`/${revolutionId}/dao/drafts/`);

    return NextResponse.json(serializeSync(updatedDraft));
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const revolutionId = params.revolutionId?.toString();
    const draftId = params.draftId?.toString();
    const user = await getUserFromHeaders(request, revolutionId);

    if (!draftId) {
      throw new Error("Invalid draftId");
    }

    const draft = await Drafts().findById(draftId);

    if (!draft) {
      throw new Error("Invalid draft");
    }

    if (!draft.canBeManagedBy(user)) {
      return new Response("Not authorized.", { status: 403 });
    }

    if (draft.isOnChain) {
      throw new Error("Couldn't delete draft that's already on chain");
    }

    await database.draft.delete({ where: { draftId } });

    revalidatePath(`/${revolutionId}/dao/drafts/`);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Error" }, { status: 500 });
  }
}
