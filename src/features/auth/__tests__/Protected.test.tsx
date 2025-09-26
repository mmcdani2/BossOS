/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/auth/__tests__/Protected.test.tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi, describe, it, beforeEach, expect } from "vitest";
import Protected from "@/features/auth/Protected";
import { supabase } from "@/lib/supabase/client";

// --- Supabase mock (configurable per test) ---
vi.mock("@/lib/supabase/client", () => {
  const auth = {
    getUser: vi.fn(),
    getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
  };
  const from = vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn(),
  }));
  return { supabase: { auth, from } };
});

const mocked = vi.mocked(supabase, true);

function renderWithRouter(initial = "/app") {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route
          path="/app"
          element={
            <Protected>
              <div>Secret App</div>
            </Protected>
          }
        />
        <Route path="/signin" element={<div>Sign In</div>} />
        <Route path="/onboarding" element={<div>Onboarding</div>} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  // default signed out
  mocked.auth.getUser.mockResolvedValue({ data: { user: null } } as any);
  (mocked.from as any)().maybeSingle.mockResolvedValue({ data: null });
});

describe("Protected guard", () => {
  it("redirects unauthenticated users to /signin", async () => {
    renderWithRouter();
    expect(await screen.findByText(/sign in/i)).toBeInTheDocument();
  });

  it("redirects authenticated users with incomplete onboarding to /onboarding", async () => {
    mocked.auth.getUser.mockResolvedValueOnce({
      data: { user: { id: "u1" } },
    } as any);
    (mocked.from as any)().maybeSingle.mockResolvedValueOnce({
      data: { onboarding_complete: false },
    });

    renderWithRouter();

    expect(await screen.findByText(/onboarding/i)).toBeInTheDocument();
  });

  it("renders children when authenticated and onboarding is complete", async () => {
    mocked.auth.getUser.mockResolvedValueOnce({
      data: { user: { id: "u1" } },
    } as any);
    (mocked.from as any)().maybeSingle.mockResolvedValueOnce({
      data: { onboarding_complete: true },
    });

    renderWithRouter();

    expect(await screen.findByText(/secret app/i)).toBeInTheDocument();
  });
});
