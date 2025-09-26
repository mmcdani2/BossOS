/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/auth/__tests__/AuthCallback.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi, describe, it, beforeEach, expect } from "vitest";
import AuthCallback from "../AuthCallback";
import { supabase } from "@/lib/supabase/client";

vi.mock("@/lib/supabase/client", () => {
  const auth = {
    exchangeCodeForSession: vi.fn(),
    getUser: vi.fn(),
    getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: "u1" } } } }),
  };
  const from = vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn(),
  }));
  return { supabase: { auth, from } };
});

const mocked = vi.mocked(supabase, true);

function renderWithRoutes(initial = "/auth/callback") {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={<div>Dashboard</div>} />
        <Route path="/onboarding" element={<div>Onboarding</div>} />
        <Route path="/signin" element={<div>SignIn</div>} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  mocked.auth.exchangeCodeForSession.mockResolvedValue({ data: { session: {} } } as any);
  mocked.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } } } as any);
});

describe("AuthCallback", () => {
  it("routes to / when onboarding_complete = true", async () => {
    // profiles query returns complete
    (mocked.from as any)().maybeSingle.mockResolvedValue({ data: { onboarding_complete: true } });

    renderWithRoutes();

    expect(await screen.findByText(/dashboard/i)).toBeInTheDocument();
  });

  it("routes to /onboarding when onboarding_complete = false", async () => {
    (mocked.from as any)().maybeSingle.mockResolvedValue({ data: { onboarding_complete: false } });

    renderWithRoutes();

    expect(await screen.findByText(/onboarding/i)).toBeInTheDocument();
  });

  it("on exchange error shows error phase then routes to /signin", async () => {
    mocked.auth.exchangeCodeForSession.mockRejectedValueOnce(new Error("boom"));

    renderWithRoutes();

    // brief phase text appears first (AuthTransition)
    await waitFor(() =>
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    );

    expect(await screen.findByText(/signin/i)).toBeInTheDocument();
  });
});
