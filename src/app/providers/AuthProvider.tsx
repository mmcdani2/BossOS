/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

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
 * tiny localStorage sync for orgId
 * - keyed by userId when available (so different users keep different org selections)
 * - hydrates once after auth resolves (userId becomes string|null instead of undefined)
 */
function useOrgPersistence(
  userId: string | null | undefined,
  orgId: string | null,
  setOrgId: (id: string | null) => void
) {
  const inited = useRef(false);

  // hydrate once after auth resolves
  useEffect(() => {
    if (inited.current) return;
    if (userId === undefined) return;

    const key = userId ? `bossos.orgId.${userId}` : "bossos.orgId";
    try {
      const saved = localStorage.getItem(key);
      if (saved && saved !== orgId) setOrgId(saved);
    } catch {
      // ignore localStorage errors
    }
    inited.current = true;
  }, [userId, orgId, setOrgId]);

  // persist on change
  useEffect(() => {
    if (userId === undefined) return;

    const key = userId ? `bossos.orgId.${userId}` : "bossos.orgId";
    try {
      if (orgId) localStorage.setItem(key, orgId);
      else localStorage.removeItem(key);
    } catch {
      // ignore localStorage errors
    }
  }, [orgId, userId]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // keep orgId persisted in localStorage per-user
  useOrgPersistence(user?.id ?? null, orgId, setOrgId);

  // 1) Session boot + auth change (unchanged behavior, just grouped)
useEffect(() => {
  const init = async () => {
    const { data } = await supabase.auth.getSession();
    setUser(data.session?.user ?? null);
    setInitialized(true);
  };
  init();

  const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
    setUser(sess?.user ?? null);
  });
  return () => sub.subscription.unsubscribe();
}, []);

// 2) Resolve org on user change with persistence + validation
useEffect(() => {
  type UserOrgRow = { org_id: string };
  // no user -> no org
  if (!user) {
    setOrgId(null);
    return;
  }

  (async () => {
    const uid = user.id;
    const key = `bossos.orgId.${uid}`;

    // fetch all orgs the user belongs to
    const { data: memberships, error } = await supabase
      .from("user_orgs")
      .select("org_id")
      .eq("user_id", uid);

    if (error) {
      console.warn("user_orgs fetch error:", error);
    }

   const mems = (memberships ?? []) as UserOrgRow[];
const allowed = new Set<string>(mems.map((m) => m.org_id));

    // try saved org first (only if user still has access)
    const saved = localStorage.getItem(key);
    if (saved && allowed.has(saved)) {
      setOrgId(saved);
      return;
    }

    // otherwise fall back to your server default
    const { data: ensured, error: rpcErr } = await supabase.rpc("ensure_user_org");
    if (!rpcErr && ensured) {
      const ensuredId = String(ensured);
      setOrgId(ensuredId);
      // persist the resolved org
      localStorage.setItem(key, ensuredId);
      return;
    }

    // last resort: if user has at least one org, pick the first and persist
    const first = memberships?.[0]?.org_id as string | undefined;
    if (first) {
      setOrgId(first);
      localStorage.setItem(key, first);
    } else {
      setOrgId(null);
      localStorage.removeItem(key);
    }
  })();
}, [user]);

// 3) Persist any org change for this user
useEffect(() => {
  if (!user) return;
  const key = `bossos.orgId.${user.id}`;
  if (orgId) localStorage.setItem(key, orgId);
  else localStorage.removeItem(key);
}, [orgId, user]);


  // When orgId changes, persist it to Supabase so the server remembers the preference
useEffect(() => {
  if (!user || !orgId) return;
  (async () => {
    const { error } = await supabase
      .from("user_orgs")
      .update({ org_id: orgId })
      .eq("user_id", user.id);

    // If the row didn't exist yet (first-time users), fall back to upsert
    if (error) {
      const { error: upsertErr } = await supabase
        .from("user_orgs")
        .upsert({ user_id: user.id, org_id: orgId }, { onConflict: "user_id" });
      if (upsertErr) {
        // don't block the app; log for debugging
        console.debug("persist org failed", { error, upsertErr });
      }
    }
  })();
}, [user, orgId]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOrgId(null);
  };

  return (
    <Ctx.Provider value={{ user, orgId, setOrgId, initialized, signOut }}>
      {children}
    </Ctx.Provider>
  );
}
