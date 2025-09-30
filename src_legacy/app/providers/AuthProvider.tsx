/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useRef, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

type AuthCtx = {
  user: User | null;
  orgId: string | null;
  setOrgId: (id: string | null) => void;
  initialized: boolean;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  orgId: null,
  setOrgId: () => {},
  initialized: false,
  signOut: async () => {},
});

export const useAuth = () => useContext(Ctx);

/**
 * Keep orgId persisted per user (read-only hydration).
 */
function useOrgPersistence(
  userId: string | null | undefined,
  orgId: string | null,
  setOrgId: (id: string | null) => void
) {
  const inited = useRef(false);

  // Hydrate once after auth resolves to string|null (not undefined)
  useEffect(() => {
    if (inited.current) return;
    if (userId === undefined) return;

    const key = userId ? `bossos.orgId.${userId}` : "bossos.orgId";
    try {
      const saved = localStorage.getItem(key);
      if (saved && saved !== orgId) setOrgId(saved);
    } catch { /* ignore */ }

    inited.current = true;
  }, [userId, orgId, setOrgId]);

  // Persist on change (when we know which user this is)
  useEffect(() => {
    if (userId === undefined) return;
    const key = userId ? `bossos.orgId.${userId}` : "bossos.orgId";
    try {
      if (orgId) localStorage.setItem(key, orgId);
      else localStorage.removeItem(key);
    } catch { /* ignore */ }
  }, [orgId, userId]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Keep orgId persisted in localStorage per-user
  useOrgPersistence(user?.id ?? null, orgId, setOrgId);

  /**
   * 1) Deterministic auth bootstrap:
   *    - getSession() to seed (no redirect yet)
   *    - onAuthStateChange to finalize and set initialized=true when the first event arrives
   *      (prevents a brief user=null that can bounce you to /signin)
   */
  useEffect(() => {
    let firstEventSeen = false;
    let cancelled = false;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      setUser(data.session?.user ?? null);

      // Fallback: if no event arrives quickly (older SDKs), mark initialized shortly after seeding
      const fallbackTimer = setTimeout(() => {
        if (!firstEventSeen && !cancelled) setInitialized(true);
      }, 200);

      const { data: sub } = supabase.auth.onAuthStateChange((event, session: Session | null) => {
        if (cancelled) return;

        // Seed/refresh user from event session
        setUser(session?.user ?? null);

        // First event is our authoritative "boot finished" signal
        if (!firstEventSeen) {
          firstEventSeen = true;
          clearTimeout(fallbackTimer);
          setInitialized(true);
        }
      });

      // Cleanup
      return () => {
        cancelled = true;
        clearTimeout(fallbackTimer);
        sub.subscription.unsubscribe();
      };
    })();

    return () => { cancelled = true; };
  }, []);

  /**
   * 2) Resolve orgId (read-only). No inserts here.
   *    Prefers a saved org if the user is still a member; else picks first membership.
   */
  useEffect(() => {
    type Row = { org_id: string };
    if (!user) {
      setOrgId(null);
      return;
    }

    (async () => {
      const uid = user.id;
      const key = `bossos.orgId.${uid}`;

      const { data: memberships, error } = await supabase
        .from("user_orgs")
        .select("org_id")
        .eq("user_id", uid);

      if (error) {
        // Non-fatal: keep whatever orgId we had; guard/screens will still work
        console.debug("[Auth] user_orgs read error:", error);
        return;
      }

      const mems = (memberships ?? []) as Row[];
      const allowed = new Set<string>(mems.map(m => m.org_id));

      const saved = localStorage.getItem(key);
      if (saved && allowed.has(saved)) {
        setOrgId(saved);
        return;
      }

      const first = mems[0]?.org_id ?? null;
      setOrgId(first);
      if (first) localStorage.setItem(key, first);
      else localStorage.removeItem(key);
    })();
  }, [user]);

  // Mirror orgId persistence (already handled in useOrgPersistence, but safe to keep)
  useEffect(() => {
    if (!user) return;
    const key = `bossos.orgId.${user.id}`;
    if (orgId) localStorage.setItem(key, orgId);
    else localStorage.removeItem(key);
  }, [orgId, user]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOrgId(null);
    // (Your router guard will handle redirecting to /signin)
  };

  const value = useMemo<AuthCtx>(() => ({
    user,
    orgId,
    setOrgId,
    initialized,
    signOut,
  }), [user, orgId, initialized]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
