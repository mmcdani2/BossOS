import React, { useMemo, useState, useEffect } from "react";
import {
  addDays,
  startOfWeek,
  format,
  setHours,
  setMinutes,
  isSameDay,
} from "date-fns";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type JobEvent = {
  id: string;
  title: string;
  start: string; // ISO
  end: string; // ISO
  customer?: string;
};

const HOURS = Array.from({ length: 11 }, (_, i) => 8 + i); // 8 → 18

function startOfWeekISO(d: Date) {
  // Sunday start to match field service conventions
  return startOfWeek(d, { weekStartsOn: 0 });
}

export default function Scheduler() {
  const [anchor, setAnchor] = useState<Date>(startOfWeekISO(new Date()));
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(anchor, i)),
    [anchor]
  );

  // demo: keep in memory; we’ll swap to Supabase next
  const [events, setEvents] = useState<JobEvent[]>([]);

  // example: load from supabase (safe & non-blocking)
  type JobRow = {
    id: string;
    title: string | null;
    start_at: string; // ISO
    end_at: string; // ISO
    customer_name: string | null;
  };

  useEffect(() => {
    (async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        const uid = session?.session?.user?.id;
        if (!uid) return;

        const weekStart = startOfWeekISO(anchor);
        const startISO = weekStart.toISOString();
        const endISO = addDays(weekStart, 7).toISOString();

        const { data, error } = await supabase
          .from("jobs")
          .select("id, title, start_at, end_at, customer_name")
          .gte("start_at", startISO)
          .lt("start_at", endISO);

        if (error) {
          console.warn("[Scheduler] jobs fetch error:", error.message);
          return;
        }

        setEvents(
          ((data as JobRow[]) ?? []).map((r) => ({
            id: r.id,
            title: r.title ?? "Job",
            start: r.start_at,
            end: r.end_at,
            customer: r.customer_name ?? undefined,
          }))
        );
      } catch (e) {
        console.warn("[Scheduler] unexpected:", e);
      }
    })();
  }, [anchor]);

  function createQuick(slotDay: Date, hour: number) {
    const start = setMinutes(setHours(slotDay, hour), 0);
    const end = setMinutes(setHours(slotDay, hour + 1), 0);
    const title = prompt("New job title?");
    if (!title) return;
    const ev: JobEvent = {
      id: crypto.randomUUID(),
      title,
      start: start.toISOString(),
      end: end.toISOString(),
    };
    setEvents((prev) => [...prev, ev]);
    // TODO: persist to supabase (see section 3)
  }

  return (
    <div className="route-root px-3 pb-6">
      {/* Toolbar */}
      <div className="sticky top-14 z-10 -mx-3 px-3 py-2 bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-black/30 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 hover:bg-white/10"
              onClick={() => setAnchor(addDays(anchor, -7))}
              aria-label="Previous week"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 hover:bg-white/10"
              onClick={() => setAnchor(addDays(anchor, 7))}
              aria-label="Next week"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="text-sm text-white/80">
              {format(days[0], "MMM d")} – {format(days[6], "MMM d, yyyy")}
            </div>
          </div>
          <button
            className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10"
            onClick={() => createQuick(new Date(), new Date().getHours())}
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm">New Job</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1200px] mx-auto mt-4 border border-white/10 rounded-xl overflow-hidden">
        {/* Day headers */}
        <div
          className="grid"
          style={{ gridTemplateColumns: "80px repeat(7, minmax(0,1fr))" }}
        >
          <div className="bg-white/5 backdrop-blur px-2 py-2 text-xs text-white/60 border-b border-white/10">
            Time
          </div>
          {days.map((d) => (
            <div
              key={d.toISOString()}
              className="bg-white/5 backdrop-blur px-2 py-2 text-xs text-white/80 border-b border-white/10"
            >
              <div className="font-medium">{format(d, "EEE")}</div>
              <div className="text-white/60">{format(d, "MMM d")}</div>
            </div>
          ))}
        </div>

        {/* Rows */}
        <div
          className="grid"
          style={{ gridTemplateColumns: "80px repeat(7, minmax(0,1fr))" }}
        >
          {HOURS.map((h) => (
            <React.Fragment key={h}>
              {/* Time column */}
              <div className="border-t border-white/10 px-2 py-3 text-xs text-white/60">
                {format(setHours(new Date(), h), "h a")}
              </div>

              {/* 7 day cells for this hour */}
              {days.map((day) => (
                <div
                  key={day.toISOString() + h}
                  className="relative border-t border-l border-white/10 min-h-12 hover:bg-white/5 transition"
                  onDoubleClick={() => createQuick(day, h)}
                  role="button"
                  title="Double-click to create job"
                >
                  {/* Events that start within this hour & day */}
                  {events
                    .filter((ev) => {
                      const sd = new Date(ev.start);
                      return isSameDay(sd, day) && sd.getHours() === h;
                    })
                    .map((ev) => (
                      <div
                        key={ev.id}
                        className="absolute inset-x-1 top-1 rounded-md border border-indigo-400/40 bg-indigo-400/20 text-white px-2 py-1 text-xs shadow-inner"
                      >
                        <div className="truncate font-medium">{ev.title}</div>
                        <div className="text-white/70">
                          {format(new Date(ev.start), "h:mma")}–
                          {format(new Date(ev.end), "h:mma")}
                        </div>
                        {ev.customer && (
                          <div className="text-white/60 truncate">
                            {ev.customer}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs text-white/60">
        Tip: Double-click a cell to add a quick one-hour job. We’ll hook this to
        Supabase next.
      </p>
    </div>
  );
}
