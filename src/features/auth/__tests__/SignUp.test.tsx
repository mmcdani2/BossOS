import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import SignUp from "../SignUp";
import { supabase } from "@/lib/supabase/client";

// Make a typed-ish mocked handle (types are permissive due to our mock)
const mockedSupabase = vi.mocked(supabase, true);

describe("SignUp", () => {
  it("shows validation when empty", async () => {
    render(<SignUp />);
    await userEvent.click(screen.getByRole("button", { name: /magic link/i }));

    expect(
      await screen.findByText(/enter a valid email/i)
    ).toBeInTheDocument();

    expect(
      await screen.findByText(/accept the terms/i)
    ).toBeInTheDocument();
  });

  it("submits and shows success", async () => {
    render(<SignUp />);

    await userEvent.type(
      screen.getByLabelText(/work email/i),
      "alex@example.com"
    );
    await userEvent.click(screen.getByText(/i agree/i));
    await userEvent.click(screen.getByRole("button", { name: /magic link/i }));

    expect(await screen.findByText(/check your email/i)).toBeInTheDocument();

    expect(mockedSupabase.auth.signInWithOtp).toHaveBeenCalledWith(
      expect.objectContaining({ email: "alex@example.com" })
    );
  });

  it("surfaces API error from Supabase", async () => {
    mockedSupabase.auth.signInWithOtp.mockRejectedValueOnce(new Error("Bad email"));

    render(<SignUp />);
    await userEvent.type(
      screen.getByLabelText(/work email/i),
      "bad@example.com"
    );
    await userEvent.click(screen.getByText(/i agree/i));
    await userEvent.click(screen.getByRole("button", { name: /magic link/i }));

    expect(await screen.findByText(/bad email/i)).toBeInTheDocument();
  });
});
