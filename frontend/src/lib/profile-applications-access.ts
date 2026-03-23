import type { AuthAccount } from "@/types/auth";

/**
 * Stub for future role-based messaging. Return `null` to show the page as normal.
 */
export function getProfileApplicationsAccessMessage(
  _role: AuthAccount["role"] | undefined | null,
): string | null {
  return null;
}

/**
 * Stub for future redirect (e.g. non-students). Currently never redirects.
 */
export function shouldRedirectProfileApplications(
  _role: AuthAccount["role"] | undefined | null,
): boolean {
  return false;
}
