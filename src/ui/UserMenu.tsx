import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { supabase } from "@/lib/supabase/client";

type Org = {
  org_id: string;
  organizations: { name: string }[]; // Supabase returns an array
};

export default function UserMenu() {
  const { user, signOut, orgId, setOrgId } = useAuth();
  const [open, setOpen] = useState(false);
  const [orgs, setOrgs] = useState<Org[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    supabase
      .from("user_orgs")
      .select("org_id, organizations(name)")
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (!error && data) setOrgs(data as Org[]);
      });
  }, [user?.id]);

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-sm text-gray-200"
        onClick={() => setOpen((v) => !v)}
      >
        <span>{user?.email ?? "User"}</span>
        <span className="text-gray-400">▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-gray-900 border border-gray-700 z-50">
          <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
            Signed in as
            <div className="truncate text-gray-200">{user?.email}</div>
          </div>

          {/* Org Switcher */}
          {orgs.length > 1 && (
            <div className="px-2 py-1 border-b border-gray-700">
              <div className="text-xs text-gray-400 px-2 mb-1">Organizations</div>
              {orgs.map((o) => (
                <button
                  key={o.org_id}
                  onClick={() => {
                    setOrgId(o.org_id);
                    setOpen(false);
                  }}
                  className={`block w-full text-left px-2 py-1 rounded-md text-sm ${
                    orgId === o.org_id
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {o.organizations?.[0]?.name ?? o.org_id}
                </button>
              ))}
            </div>
          )}

          {/* Links */}
          <a href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">
            Profile
          </a>
          <a href="/preferences" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">
            Preferences
          </a>

          <div className="border-t border-gray-700">
            <button
              onClick={signOut}
              className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
