import { vi } from "vitest";

/**
 * Keep the mock shape the same as what your code calls,
 * but make the types permissive (unknown) so tests can
 * set error/data without pulling in Supabase's classes.
 */
export const supabase = {
  auth: {
    signInWithOtp: vi
      .fn<(...args: unknown[]) => Promise<{ data: unknown; error: unknown }>>()
      .mockResolvedValue({ data: {}, error: null }),
    getSession: vi
      .fn<() => Promise<{ data: unknown; error: unknown }>>()
      .mockResolvedValue({ data: { session: {} }, error: null }),
  },
};
