import { ENABLE_ADMIN_MUTATIONS } from "@/lib/app-flags";

export class MutationBlockedError extends Error {
  constructor(context: string) {
    super(`Mutations are disabled in viewer mode. Blocked action: ${context}`);
    this.name = "MutationBlockedError";
  }
}

export function assertMutationAllowed(context: string) {
  if (!ENABLE_ADMIN_MUTATIONS) {
    throw new MutationBlockedError(context);
  }
}
