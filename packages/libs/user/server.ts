import "server-only";

import { cookies } from "next/headers";
import { TOKEN_KEY } from "./access-token";
import { getUserFromToken } from "./dynamic-payload";

export const getUser = async (revolutionId: string) => {
  const cookieValue = cookies().get(TOKEN_KEY)?.value;
  const user = await getUserFromToken(cookieValue, revolutionId);
  return user?.address || null;
};
