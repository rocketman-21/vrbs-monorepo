import "server-only";

export function reportIngestionError(
  error: string | Error | unknown,
  params: string | object,
  type: string,
) {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  // Slack notification was here
}
