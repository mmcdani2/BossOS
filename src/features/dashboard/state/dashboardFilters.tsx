/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  PropsWithChildren,
} from "react";
import { addDays } from "date-fns";

type RangePreset = "today" | "7d" | "30d" | "90d";

type Ctx = {
  preset: RangePreset;
  setPreset: (p: RangePreset) => void;
  fromUtc: Date; // inclusive
  toUtc: Date;   // exclusive
  refreshToken: number;
  refresh: () => void;
};

const DashboardFiltersContext = createContext<Ctx | null>(null);

/** Build [start of UTC day, start of next UTC day) windows. */
function computeRange(preset: RangePreset) {
  const now = new Date();

  // Start of "today" in UTC
  const startTodayUtc = new Date(Date.UTC(
    now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0
  ));

  if (preset === "today") {
    const fromUtc = startTodayUtc;
    const toUtc   = addDays(startTodayUtc, 1);
    return { fromUtc, toUtc };
  }

  // For last Nd: start at start of (N-1) days ago; end at start of tomorrow
  const daysBack = preset === "7d" ? 6 : preset === "30d" ? 29 : 89;
  const fromUtc = addDays(startTodayUtc, -daysBack);
  const toUtc   = addDays(startTodayUtc, 1); // exclusive
  return { fromUtc, toUtc };
}

export function DashboardFiltersProvider({ children }: PropsWithChildren) {
  const [preset, setPreset] = useState<RangePreset>("7d");
  const [refreshToken, setRefreshToken] = useState(0);

  const value = useMemo(() => {
    const { fromUtc, toUtc } = computeRange(preset);
    return {
      preset,
      setPreset,
      fromUtc,
      toUtc,
      refreshToken,
      refresh: () => setRefreshToken((n) => n + 1),
    };
  }, [preset, refreshToken]);

  return (
    <DashboardFiltersContext.Provider value={value}>
      {children}
    </DashboardFiltersContext.Provider>
  );
}

export function useDashboardFilters() {
  const ctx = useContext(DashboardFiltersContext);
  if (!ctx) throw new Error("useDashboardFilters must be used within DashboardFiltersProvider");
  return ctx;
}
