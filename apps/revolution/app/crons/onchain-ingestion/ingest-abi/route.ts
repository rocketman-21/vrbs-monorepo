export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 300;

import "server-only";

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { TrackerType } from "prisma-database";
import { getUser } from "@cobuild/libs/user/server";
import { EntityTrackers } from "@cobuild/database/models/eth/EntityTrackers";
import { getAbiForImplementation } from "onchain-ingestion/events/utils/AbiMapping";
import { AbiItem } from "viem";

export async function GET(req: NextRequest) {
  try {
    const user = await getUser("thatsgnarly");

    if (!user) {
      return NextResponse.json({
        error: "unauthorized",
      });
    }

    const searchParams = new URL(req.url).searchParams;

    const chainId = parseInt(searchParams.get("chainId")?.toString() || "0");
    const implementationContract = searchParams.get("implementationContract")?.toString();
    const contractAddress = searchParams.get("contractAddress")?.toString();
    const trackerTypeRaw = searchParams.get("trackerType")?.toString();

    if (!chainId) {
      return NextResponse.json({
        error: "missing contractName",
      });
    }
    if (!implementationContract) {
      return NextResponse.json({
        error: "missing implementationContract",
      });
    }
    if (!contractAddress) {
      return NextResponse.json({
        error: "missing contractAddress",
      });
    }
    if (!trackerTypeRaw) {
      return NextResponse.json({
        error: "missing trackerType",
      });
    }
    //ensure trackertype is valid
    if (!Object.values(TrackerType).includes(trackerTypeRaw as any)) {
      return NextResponse.json({
        error: "invalid trackerType",
      });
    }

    await EntityTrackers().createEntityTracker(
      user,
      contractAddress as `0x${string}`,
      trackerTypeRaw as TrackerType,
      chainId,
      implementationContract,
      (await getAbiForImplementation(implementationContract, chainId)) as AbiItem[],
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error({ error });
    return new Response(error.message, { status: 500 });
  }
}
