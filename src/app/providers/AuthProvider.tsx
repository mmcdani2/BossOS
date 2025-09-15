/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";


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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

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

  useEffect(() => {
    if (!user) {
      setOrgId(null);
      return;
    }
    (async () => {
      const { data } = await supabase.rpc("ensure_user_org");
      if (data) setOrgId(data as string);
    })();
  }, [user]);

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
