import { Submissions } from "@cobuild/database/models/revolution/submissions/Submissions";
import { serializeMany } from "@cobuild/database/utils";
import { getUserFromHeaders } from "@cobuild/libs/user/route";
import { getEthAddress } from "@cobuild/libs/utils/account";
import { reportApiError } from "@cobuild/libs/utils/apiError";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { revolutionId: string } }) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const justCount = searchParams.get("justCount") === "true";

    const filter = (searchParams.get("filter")?.toString() || "") as any;
    const creatorAddress = searchParams.get("creatorAddress")?.toLowerCase() || "";

    const user = await getUserFromHeaders(request);

    if (filter === "mine" && !user) {
      throw new Error("Incorrect address");
    }

    const { submissions, count } = await Submissions().getForScope({
      contractAddress: getEthAddress(searchParams.get("contractAddress")),
      filter,
      creatorAddress: filter === "mine" ? user || undefined : creatorAddress,
      perPage: Number(searchParams.get("perPage")) || 5,
      page: Number(searchParams.get("page")) || 0,
    });

    const serialized = await serializeMany(submissions, ["creatorProfiles"]);

    return NextResponse.json(justCount ? count : serialized);
  } catch (e: any) {
    console.error({ e, params });
    const message = reportApiError(e, params, "submissions");
    return new Response(message, { status: 500 });
  }
}
