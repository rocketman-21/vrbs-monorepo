import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { generateVoteImage } from "../(website)/dao/components/VoteImage";

export const runtime = "edge";

interface Props {
  params: { revolutionId: string };
}

export async function GET(req: NextRequest, { params }: Props) {
  try {
    const { revolutionId } = params;

    const { searchParams } = req.nextUrl;
    const username = searchParams.get("username");
    const reason = (searchParams.get("reason") || "").replace(/⌐◨-◨/g, "").trimEnd();
    const profilePicture = searchParams.get("profilePicture");
    const name = searchParams.get("name") || "";
    const numVotes = searchParams.get("numVotes") || "";
    const proposalId = searchParams.get("proposalId") || "";
    const proposalTitle = searchParams.get("proposalTitle") || "";

    if (!username || !name || !proposalTitle) {
      throw new Error("Invalid data");
    }

    const { image, width, height } = generateVoteImage({
      username,
      reason,
      profilePicture,
      name,
      numVotes,
      proposalId,
      proposalTitle,
      revolutionId,
    });

    return new ImageResponse(image, { width, height });
  } catch (e: any) {
    console.error(e);
    return new Response(e?.msg || "Error", { status: 500 });
  }
}
