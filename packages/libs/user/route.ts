import "server-only";

import { TOKEN_KEY } from "./access-token";
import { getUserFromToken } from "./dynamic-payload";
import { type NextRequest } from "next/server";

const getTokenFromRouteRequest = (request: NextRequest) => {
  const headers = new Headers(request.headers);
  const token = request.cookies.get(TOKEN_KEY);

  return headers.get("authorization") ? headers.get("authorization")?.split(" ")[1] : token?.value;
};

export const getUserFromHeaders = async (request: NextRequest, revolutionId?: string) => {
  const user = await getUserFromToken(getTokenFromRouteRequest(request), revolutionId);
  return user?.address || null;
};
