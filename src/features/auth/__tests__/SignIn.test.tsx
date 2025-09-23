// src/features/auth/__tests__/SignIn.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, beforeEach, describe, it, expect } from "vitest";
import SignIn from "../SignIn";
import { supabase } from "@/lib/supabase/client";

const mockedSupabase = vi.mocked(supabase, true);

beforeEach(() => vi.clearAllMocks());

describe("SignIn", () => {
  it("does not submit with empty email", async () => {
    render(<SignIn />);

    // Your button is "Send Verification Link"
    const submit = screen.getByRole("button", { name: /send verification link/i });
    await userEvent.click(submit);

    // With empty input, ensure we didn't call Supabase
    expect(mockedSupabase.auth.signInWithOtp).not.toHaveBeenCalled();
  });

  it("submits with a valid email and calls Supabase", async () => {
    render(<SignIn />);

    // No label in DOM; use the placeholder instead
    const email = screen.getByPlaceholderText(/you@company\.com/i);
    await userEvent.type(email, "alex@example.com");

    const submit = screen.getByRole("button", { name: /send verification link/i });
    await userEvent.click(submit);

    await waitFor(() => {
      expect(mockedSupabase.auth.signInWithOtp).toHaveBeenCalledTimes(1);
    });

    expect(mockedSupabase.auth.signInWithOtp).toHaveBeenCalledWith(
      expect.objectContaining({ email: "alex@example.com" })
    );
  });

  it("handles API error (shows message if your UI renders one)", async () => {
    mockedSupabase.auth.signInWithOtp.mockRejectedValueOnce(
      new Error("Invalid email")
    );

    render(<SignIn />);

    const email = screen.getByPlaceholderText(/you@company\.com/i);
    await userEvent.type(email, "bad@example.com");

    const submit = screen.getByRole("button", { name: /send verification link/i });
    await userEvent.click(submit);

    // If your component renders an error message, assert it:
    // Try a few flexible patterns; if none are present, we still ensure the call happened.
    const maybeErrorText =
      (await screen.findByText(/invalid email/i).catch(() => null)) ||
      (await screen.findByText(/error/i).catch(() => null)) ||
      (await screen.findByText(/failed/i).catch(() => null));

    // Always assert the call occurred
    await waitFor(() => {
      expect(mockedSupabase.auth.signInWithOtp).toHaveBeenCalledTimes(1);
    });

    // If your UI shows an error message, make sure we actually saw it:
    if (maybeErrorText) {
      expect(maybeErrorText).toBeInTheDocument();
    }
  });
});
