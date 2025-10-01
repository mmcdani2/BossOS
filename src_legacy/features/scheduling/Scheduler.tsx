// src/features/scheduler/Scheduler.tsx
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

import PageHeader from "@/ui/PageHeader";
import ViewToolbar from "@/ui/ViewToolbar";
import GlassCard from "@/ui/GlassCard";

type JobEvent = {
  id: string;
  title: string;
  start: string; // ISO
  end: string; // ISO
  customer?: string;
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const COLS = "80px repeat(7, minmax(0,1fr))";

function startOfWeekISO(d: Date) {
  // Sunday
  return startOfWeek(d, { weekStartsOn: 0 });
}

export default function Scheduler() {
  const [anchor, setAnchor] = useState<Date>(startOfWeekISO(new Date()));
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(anchor, i)),
    [anchor]
  );

  const [events, setEvents] = useState<JobEvent[]>([]);

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
    // TODO: persist to Supabase
  }

  return (
    <>
      <PageHeader />

      <div className="shell page-viewport">
        <GlassCard accent="teal" padding="sm" className="p-3">
          <ViewToolbar
            label="Scheduler"
            right={
              <div className="flex items-center gap-2">
                {/* Prev/Next buttons grouped */}
                <div className="flex gap-1.5 rounded-2xl border border-white/20 bg-white/5 p-1.5">
                  <button
                    aria-label="Previous week"
                    onClick={() => setAnchor(addDays(anchor, -7))}
                    className="px-2.5 py-1.5 text-xs leading-none rounded-[9px] text-slate-300
                               hover:bg-white/5 hover:text-slate-200 active:translate-y-px"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    aria-label="Next week"
                    onClick={() => setAnchor(addDays(anchor, 7))}
                    className="px-2.5 py-1.5 text-xs leading-none rounded-[9px] text-slate-300
                               hover:bg-white/5 hover:text-slate-200 active:translate-y-px"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Date range */}
                <div className="text-sm text-white/80 tabular-nums">
                  {format(days[0], "MMM d")} –{" "}
                  {format(days[6], "MMM d, yyyy")}
                </div>

                {/* New Job button */}
                <button
                  onClick={() =>
                    createQuick(new Date(), new Date().getHours())
                  }
                  title="New Job"
                  className="px-2.5 py-1.5 text-xs leading-none rounded-[9px] text-slate-200
                             border border-white/20 bg-white/10 hover:bg-white/15 hover:border-white/30
                             active:translate-y-px"
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">New Job</span>
                </button>
              </div>
            }
          />
        </GlassCard>

        {/* === Schedule grid as a SEPARATE CARD === */}
        <div className="panel mt-4" style={{ flex: 1 }}>
          <div
            className="panel-header panel-header--frost grid"
            style={{ gridTemplateColumns: COLS }}
          >
            <div className="px-3 py-2 text-xs text-white/60 border-b border-white/10">
              Time
            </div>
            {days.map((d) => (
              <div
                key={d.toISOString()}
                className="px-3 py-2 text-xs text-white/80 border-b border-white/10"
              >
                <div className="font-medium">{format(d, "EEE")}</div>
                <div className="text-white/60">{format(d, "MMM d")}</div>
              </div>
            ))}
          </div>

          <div
            className="panel-scroll grid"
            style={{ gridTemplateColumns: COLS }}
          >
            {HOURS.map((h) => (
              <React.Fragment key={h}>
                <div className="border-t border-white/10 px-3 py-3 text-xs text-white/60">
                  {format(setHours(new Date(), h), "h a")}
                </div>

                {days.map((day) => (
                  <div
                    key={day.toISOString() + h}
                    className="relative border-t border-l border-white/10 min-h-12 hover:bg-white/5 transition"
                    onDoubleClick={() => createQuick(day, h)}
                    role="button"
                    title="Double-click to create job"
                  >
                    {events
                      .filter((ev) => {
                        const sd = new Date(ev.start);
                        return isSameDay(sd, day) && sd.getHours() === h;
                      })
                      .map((ev) => (
                        <div
                          key={ev.id}
                          className="absolute inset-x-1 top-1 rounded-md border border-indigo-400/40
                                   bg-indigo-400/20 text-white px-2 py-1 text-xs shadow-inner"
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
      </div>
    </>
  );
}
