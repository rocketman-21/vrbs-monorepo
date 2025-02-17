import { decodeJwt, jwtVerify, type JWTPayload } from "jose";
import Cookies from "js-cookie";
import { getPublicKey } from "./dynamic-config";

export const TOKEN_KEY = `${process.env.NEXT_PUBLIC_TOKEN_KEY}`;

export const setAccessToken = async (token: string) => {
  Cookies.set(TOKEN_KEY, token, { expires: getTokenExpiry(token) });

  // Wait 100ms to ensure cookie is set & available
  await new Promise(resolve => setTimeout(resolve, 100));
};

export const getAccessToken = () => Cookies.get(TOKEN_KEY);

export const removeAccessToken = () => Cookies.remove(TOKEN_KEY);

const getTokenExpiry = (token: string): Date => {
  const { exp } = decodeJwt(token);
  if (!exp) throw new Error("Error decoding auth token");
  return new Date(exp * 1000);
};

export const decodeToken = async (token: string, revolutionId?: string): Promise<JWTPayload> => {
  const result = await jwtVerify(token, await getPublicKey(revolutionId));
  return result?.payload || null;
};
