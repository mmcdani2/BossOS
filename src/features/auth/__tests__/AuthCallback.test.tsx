import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, it, expect } from "vitest";
import AuthCallback from "../AuthCallback";
import { supabase } from "@/lib/supabase/client";
const mockedSupabase = vi.mocked(supabase, true);

it("calls getSession (smoke test)", async () => {
  render(
    <MemoryRouter initialEntries={["/auth/callback"]}>
      <AuthCallback />
    </MemoryRouter>
  );
  expect(mockedSupabase.auth.getSession).toHaveBeenCalled();
});
