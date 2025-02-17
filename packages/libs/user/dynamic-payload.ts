import { DynamicJwt, DynamicJwtFromJSON } from "@dynamic-labs/sdk-api-core";
import { normalizeEthAddress } from "../utils/account";
import { decodeToken } from "./access-token";

export async function getUserFromToken(
  token?: string,
  revolutionId?: string,
): Promise<(DynamicJwt & { address: `0x${string}` }) | null> {
  if (!token) return null;
  try {
    const jwt = DynamicJwtFromJSON(await decodeToken(token, revolutionId));

    if (!jwt || !jwt.sub) return null;

    const address = normalizeEthAddress(
      jwt.verifiedAccount?.address || jwt.verifiedCredentials?.[0]?.address,
    );

    if (!address) return null;

    return {
      ...jwt,
      address,
    };
  } catch (e: any) {
    console.error(e);
    return null;
  }
}
