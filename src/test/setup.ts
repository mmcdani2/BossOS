import "@testing-library/jest-dom";
import { vi } from "vitest";

// Tell Vitest to use our mock whenever "@/lib/supabase/client" is imported
vi.mock("@/lib/supabase/client", () => import("@/test/mocks/supabase"));