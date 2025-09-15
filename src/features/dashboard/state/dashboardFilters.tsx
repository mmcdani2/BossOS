import React, {createContext, useContext, useMemo, useState, PropsWithChildren} from "react";
import { startOfDay, endOfDay, subDays } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

type RangePreset = "today" | "7d" | "30d" | "90d";
const TZ = "America/Chicago";

type Ctx = {
  preset: RangePreset;
  setPreset: (p: RangePreset) => void;
  fromUtc: Date; // use in Supabase queries
  toUtc: Date;   // use in Supabase queries (exclusive)
  refreshToken: number;
  refresh: () => void;
};

const DashboardFiltersContext = createContext<Ctx | null>(null);

function computeRange(preset: RangePreset) {
  const nowCST = utcToZonedTime(new Date(), TZ);
  if (preset === "today") {
    const s = startOfDay(nowCST);
    const e = endOfDay(nowCST);
    return { fromUtc: zonedTimeToUtc(s, TZ), toUtc: zonedTimeToUtc(e, TZ) };
  }
  const days = preset === "7d" ? 6 : preset === "30d" ? 29 : 89; // inclusive window
  const endLocal = endOfDay(nowCST);
  const startLocal = startOfDay(subDays(nowCST, days));
  return { fromUtc: zonedTimeToUtc(startLocal, TZ), toUtc: zonedTimeToUtc(endLocal, TZ) };
}

export function DashboardFiltersProvider({children}: PropsWithChildren) {
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

  return <DashboardFiltersContext.Provider value={value}>{children}</DashboardFiltersContext.Provider>;
}

export function useDashboardFilters() {
  const ctx = useContext(DashboardFiltersContext);
  if (!ctx) throw new Error("useDashboardFilters must be used within DashboardFiltersProvider");
  return ctx;
}
