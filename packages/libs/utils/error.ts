import { z } from "zod";

export function getErrorMessage(error: unknown, defaultError = "Unknown error"): string {
  if (typeof error === "string") return error;

  if (error instanceof z.ZodError) {
    return error.issues[0]?.message;
  }

  // Viem & Wagmi
  if (typeof error === "object" && error?.hasOwnProperty("shortMessage")) {
    const shortMesage: string = (error as any).shortMessage;

    if (shortMesage.startsWith("User rejected the request")) {
      return "You rejected the transaction";
    }

    return shortMesage + " " + (error as any).metaMessages?.[0];
  }

  // Ethers
  if (typeof error === "object" && error?.hasOwnProperty("reason")) {
    return (error as any).reason;
  }

  // Generic Error
  if (error instanceof Error) return error.message;

  // Yup x2
  if (Array.isArray(error)) return getErrorMessage(error[0]);
  if (typeof error === "object") return getErrorMessage(Object.values(error as object)[0]);

  try {
    return JSON.stringify(error);
  } catch {
    return String(error) || defaultError;
  }
}
