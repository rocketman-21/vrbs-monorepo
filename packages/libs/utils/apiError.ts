import "server-only";

import { getErrorMessage } from "./error";

export function reportApiError(
  error: string | Error | unknown,
  params: string | object,
  type: string,
) {
  const errorMessage = getErrorMessage(error);

  // Slack notification was here
  // Can be added back if needed
  // Or we can use different notification service

  return errorMessage;
}
