export function isDatabaseUnavailableError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const value = error as {
    code?: string;
    message?: string;
    cause?: unknown;
  };

  if (value.code === "P1001") {
    return true;
  }

  const message = value.message?.toLowerCase() ?? "";
  if (
    message.includes("can't reach database server") ||
    message.includes("database_url points to localhost in production") ||
    message.includes("database_url is not set") ||
    message.includes("database_url is not a valid database connection string")
  ) {
    return true;
  }

  return value.cause ? isDatabaseUnavailableError(value.cause) : false;
}
