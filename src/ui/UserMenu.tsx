import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom"; // ⬅️ add
import { useAuth } from "@/app/providers/AuthProvider";
import { supabase } from "@/lib/supabase/client";

type Org = { org_id: string; organizations: { name: string }[] };
type UserMeta = { full_name?: string; name?: string; user_name?: string; avatar_url?: string };

function Portal({ children }: { children: React.ReactNode }) {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
}

export default function UserMenu() {
  const { user, signOut, orgId, setOrgId } = useAuth();
  const [open, setOpen] = useState(false);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // -------- data
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

  const email = user?.email ?? "";
  const meta = (user?.user_metadata ?? {}) as UserMeta;

  const displayName = useMemo(() => {
    const cand = meta.full_name?.trim() || meta.name?.trim() || meta.user_name?.trim();
    if (cand) return cand;
    const local = email.split("@")[0] ?? "User";
    return local
      .split(/[._-]/g)
      .filter(Boolean)
      .map((w) => (w[0] ? w[0].toUpperCase() + w.slice(1) : ""))
      .join(" ");
  }, [email, meta.full_name, meta.name, meta.user_name]);

  const avatarUrl = typeof meta.avatar_url === "string" ? meta.avatar_url : undefined;
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  // -------- behavior: open/close, a11y
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (rootRef.current && !rootRef.current.contains(t)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  // Arrow-key roving focus inside panel
  const getItems = () =>
    panelRef.current ? Array.from(panelRef.current.querySelectorAll<HTMLElement>('[data-mi="1"]')) : [];
  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const items = getItems();
    if (!items.length) return;
    const i = items.findIndex((el) => el === document.activeElement);
    if (e.key === "Home") return items[0].focus();
    if (e.key === "End") return items[items.length - 1].focus();
    const next = e.key === "ArrowDown" ? (i + 1 + items.length) % items.length : (i - 1 + items.length) % items.length;
    items[next].focus();
  };

  return (
    <div ref={rootRef} className="um-root">
      {/* Trigger */}
      <button
        type="button"
        className="um-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="account-menu"
      >
        <span className="um-avatar">
          {avatarUrl ? <img src={avatarUrl} alt="" /> : initials}
        </span>
        <span className="um-trigger-text">
          <span className="um-trigger-name">{displayName}</span>
          <span className="um-trigger-email">{email}</span>
        </span>
        <span className={`um-caret ${open ? "um-caret--open" : ""}`}>▾</span>
      </button>

      {/* Panel — FIXED so it can’t go off-screen */}
      {open && (
        <Portal>
          <div
            id="account-menu"
            ref={panelRef}
            role="menu"
            className="um-panel"
            onKeyDown={onPanelKeyDown}
          >
          {/* Header */}
          <div className="um-header">
            <span className="um-avatar um-avatar--lg">
              {avatarUrl ? <img src={avatarUrl} alt="" /> : initials}
            </span>
            <div className="um-header-text">
              <div className="um-header-name">{displayName}</div>
              <div className="um-header-email">{email}</div>
            </div>
            <button
              aria-label="Close"
              className="um-close"
              onClick={() => setOpen(false)}
              data-mi="1"
            >
              ✕
            </button>
          </div>
          

          {/* Orgs */}
          {orgs.length > 1 && (
            <>
              <div className="um-section-label">Organizations</div>
              <div className="um-list">
                {orgs.map((o) => {
                  const name = o.organizations?.[0]?.name ?? o.org_id;
                  const selected = orgId === o.org_id;
                  return (
                    <button
                      key={o.org_id}
                      className={`um-item ${selected ? "um-item--active" : ""}`}
                      role="menuitemradio"
                      aria-checked={selected}
                      onClick={() => {
                        setOrgId(o.org_id);
                        setOpen(false);
                      }}
                      data-mi="1"
                    >
                      <span className={`um-radio ${selected ? "um-radio--on" : ""}`} aria-hidden />
                      <span className="um-item-text">{name}</span>
                      <span className="um-item-caret">›</span>
                    </button>
                  );
                })}
              </div>
              <hr className="um-sep" />
            </>
          )}

          {/* Links */}
          <div className="um-list">
            <a href="/profile" className="um-item" role="menuitem" data-mi="1">
              <span className="um-item-text">Profile</span>
              <span className="um-item-caret">›</span>
            </a>
            <a href="/preferences" className="um-item" role="menuitem" data-mi="1">
              <span className="um-item-text">Preferences</span>
              <span className="um-item-caret">›</span>
            </a>
            <button
              className="um-item um-item--danger"
              onClick={() => { setOpen(false); void signOut(); }}
              role="menuitem"
              data-mi="1"
            >
              <span className="um-item-text">Sign out</span>
              <span className="um-item-caret">›</span>
            </button>
          </div>

          {/* Support */}
          <div className="um-support">
            <div className="um-section-label">Support</div>
            <a href="/help" className="um-support-link" role="menuitem" data-mi="1">Help</a>
            <div className="um-support-title">Customer Support</div>
            <a href="tel:+18776710153" className="um-support-phone" data-mi="1">(877) 671-0153</a>
          </div>
        </div>
        </Portal>
      )}
    </div>
  );
}
