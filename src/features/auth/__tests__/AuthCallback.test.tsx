/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/auth/__tests__/AuthCallback.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi, describe, it, beforeEach, afterEach, expect } from "vitest";

// 1) Kill animations (no intervals)
vi.mock("../AuthTransition", () => ({
  default: (p: any) => (
    <div data-testid="transition">
      {p.phase === "error" && <div role="status">Something went wrong</div>}
    </div>
  ),
}));

// 2) Stable Supabase mock
vi.mock("@/lib/supabase/client", () => {
  const chain: any = {
    select: vi.fn(() => chain),
    eq: vi.fn(() => chain),
    maybeSingle: vi.fn(),
  };
  const from = vi.fn(() => chain);
  const auth = {
    exchangeCodeForSession: vi.fn(),
    getUser: vi.fn(),
    getSession: vi.fn(),
  };
  return { supabase: { auth, from, __chain: chain } };
});

// Import after mocks
import AuthCallback from "../AuthCallback";
import { supabase } from "@/lib/supabase/client";

const mocked = vi.mocked(supabase as any, true);
const db = (supabase as any).__chain as { maybeSingle: ReturnType<typeof vi.fn> };

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

let stSpy: any;
beforeEach(() => {
  // 3) Make setTimeout run immediately (no fake timers)
  stSpy = vi.spyOn(globalThis, "setTimeout").mockImplementation((fn: any) => {
    try { fn(); } catch {}
    return 0 as any;
  });

  // default: fast success path
  mocked.auth.exchangeCodeForSession.mockResolvedValue({ data: { session: {} } });
  mocked.auth.getSession.mockResolvedValue({ data: { session: { user: { id: "u1" } } } });
  mocked.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } } });

  db.maybeSingle.mockResolvedValue({ data: { onboarding_complete: true } });
});

afterEach(() => {
  stSpy?.mockRestore();
  vi.clearAllMocks();
});

describe("AuthCallback", () => {
  it("routes to / when onboarding_complete = true", async () => {
    db.maybeSingle.mockResolvedValueOnce({ data: { onboarding_complete: true } });
    renderWithRoutes();
    expect(await screen.findByText(/dashboard/i)).toBeInTheDocument();
  });

  it("routes to /onboarding when onboarding_complete = false", async () => {
    db.maybeSingle.mockResolvedValueOnce({ data: { onboarding_complete: false } });
    renderWithRoutes();
    expect(await screen.findByText(/onboarding/i)).toBeInTheDocument();
  });

  it("on exchange error shows error phase (no auto-redirect)", async () => {
    mocked.auth.exchangeCodeForSession.mockRejectedValueOnce(new Error("boom"));
    renderWithRoutes();
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(/something went wrong/i)
    );
  });
});
