import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { supabase } from "@/lib/supabase/client";

type Org = { org_id: string; organizations: { name: string }[] };
type UserMeta = {
  full_name?: string;
  name?: string;
  user_name?: string;
  avatar_url?: string;
  is_admin?: boolean;
};
type AppMeta = { roles?: string[]; is_admin?: boolean };

function Portal({ children }: { children: React.ReactNode }) {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
}

const DEV_KEEP_OPEN = true; // set to false (or remove) when routes are live

export default function UserMenu() {
  const { user, signOut, orgId, setOrgId } = useAuth();
  const [open, setOpen] = useState(false);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [liveMsg, setLiveMsg] = useState("");

  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const wasOpen = useRef(false);

  const email = user?.email ?? "";
  const meta = (user?.user_metadata ?? {}) as UserMeta;
  const appMeta = (user?.app_metadata ?? {}) as AppMeta;
  const isAdmin = Boolean(
    appMeta.roles?.includes("admin") || appMeta.is_admin || meta.is_admin
  );

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

  const displayName = useMemo(() => {
    const cand =
      meta.full_name?.trim() || meta.name?.trim() || meta.user_name?.trim();
    if (cand) return cand;
    const local = email.split("@")[0] ?? "User";
    return local
      .split(/[._-]/g)
      .filter(Boolean)
      .map((w) => (w[0] ? w[0].toUpperCase() + w.slice(1) : ""))
      .join(" ");
  }, [email, meta.full_name, meta.name, meta.user_name]);

  const avatarUrl =
    typeof meta.avatar_url === "string" ? meta.avatar_url : undefined;
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  // -------- focus mgmt (open -> focus first item, close -> return to trigger)
  useEffect(() => {
    if (open && !wasOpen.current) {
      requestAnimationFrame(() => {
        const items = getItems();
        items[0]?.focus();
      });
      setLiveMsg("Account menu opened");
    }
    if (!open && wasOpen.current) {
      triggerRef.current?.focus();
      setLiveMsg("Account menu closed");
    }
    wasOpen.current = open;
  }, [open]);

  // -------- behavior: outside click + Escape (respect portal panel)
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: PointerEvent) => {
      const t = e.target as Node | null;
      const insideTrigger = !!(
        rootRef.current &&
        t &&
        rootRef.current.contains(t)
      );
      const insidePanel = !!(
        panelRef.current &&
        t &&
        panelRef.current.contains(t)
      );
      if (insideTrigger || insidePanel) return; // click happened inside menu UI — keep open
      setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc, true); // capture = true catches early
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("pointerdown", onDoc, true);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  // -------- Accordion state (persisted per-user; single-open; default: all collapsed)
  type Sections = {
    account: boolean;
    work: boolean;
    company: boolean;
    support: boolean;
    growth: boolean;
  };
  const defaultSections: Sections = {
    account: false,
    work: false,
    company: false,
    support: false,
    growth: false,
  };
  const sectionsKey = `bossos.um.sections.${user?.id ?? "anon"}`;

  // ensure at most one open
  const clampSingleOpen = (s: Sections): Sections => {
    const keys = Object.keys(s) as (keyof Sections)[];
    const firstOpen = keys.find((k) => s[k]);
    return keys.reduce<Sections>((acc, k) => {
      acc[k] = firstOpen ? k === firstOpen : false;
      return acc;
    }, {} as Sections);
  };

  const [sections, setSections] = useState<Sections>(() => {
    try {
      const raw = localStorage.getItem(sectionsKey);
      if (!raw) return defaultSections;
      const parsed = { ...defaultSections, ...JSON.parse(raw) } as Sections;
      return clampSingleOpen(parsed);
    } catch (e) {
      // ignore persistence errors (e.g., private mode)
      void e; // mark as used to satisfy no-unused-vars
      return defaultSections;
    }
  });

  // open one / close others; if nextOpen=false, collapse all
  const setOpenSection = (key: keyof Sections, nextOpen: boolean) => {
    setSections(() => {
      if (!nextOpen) return { ...defaultSections }; // all closed
      return {
        account: false,
        work: false,
        company: false,
        support: false,
        growth: false,
        [key]: true,
      } as Sections;
    });
  };
  const onToggle = (key: keyof Sections) => setOpenSection(key, !sections[key]);

  useEffect(() => {
    try {
      localStorage.setItem(sectionsKey, JSON.stringify(sections));
    } catch (e) {
      // ignore persistence errors (e.g., private mode)
      void e; // mark as used to satisfy no-unused-vars
    }
  }, [sections, sectionsKey]);

  // -------- keyboard nav: roving focus + Tab trap + expand/collapse with arrows
  const getItems = () =>
    panelRef.current
      ? Array.from(
          panelRef.current.querySelectorAll<HTMLElement>('[data-mi="1"]')
        )
      : [];

  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    const items = getItems();
    if (!items.length) return;

    if (e.key === "Tab") {
      e.preventDefault();
      const i = items.findIndex((el) => el === document.activeElement);
      const next = (i + (e.shiftKey ? -1 : 1) + items.length) % items.length;
      items[next].focus();
      return;
    }

    // Expand/collapse on ArrowRight/ArrowLeft when header is focused
    const active = document.activeElement as HTMLElement | null;
    const isHeader = active?.dataset?.accHeader === "1";
    if (isHeader && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
      e.preventDefault();
      const k = active.getAttribute("data-acc-key") as keyof Sections | null;
      if (!k) return;
      const wantOpen = e.key === "ArrowRight";
      setOpenSection(k, wantOpen);
      return;
    }

    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      const i = items.findIndex((el) => el === document.activeElement);
      if (e.key === "Home") return items[0].focus();
      if (e.key === "End") return items[items.length - 1].focus();
      const next =
        e.key === "ArrowDown"
          ? (i + 1 + items.length) % items.length
          : (i - 1 + items.length) % items.length;
      items[next].focus();
    }
  };

  return (
    <div ref={rootRef} className="um-root">
      {/* SR-only live region */}
      <span className="sr-only" aria-live="polite">
        {liveMsg}
      </span>

      {/* Avatar-only trigger (circle) */}
      <button
        type="button"
        className="um-trigger um-trigger--icon"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="account-menu"
        aria-label={open ? "Close account menu" : "Open account menu"}
        ref={triggerRef}
      >
        <span className="um-avatar">
          {avatarUrl ? <img src={avatarUrl} alt="" /> : initials}
        </span>
      </button>

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

            {/* Organizations (if more than 1) */}
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
                        className={`um-item ${
                          selected ? "um-item--active" : ""
                        }`}
                        role="menuitemradio"
                        aria-checked={selected}
                        onClick={() => {
                          setOrgId(o.org_id);
                          setOpen(false);
                        }}
                        data-mi="1"
                      >
                        <span
                          className={`um-radio ${
                            selected ? "um-radio--on" : ""
                          }`}
                          aria-hidden
                        />
                        <span className="um-item-text">{name}</span>
                        <span className="um-item-caret">›</span>
                      </button>
                    );
                  })}
                </div>
                <hr className="um-sep" />
              </>
            )}

            {/* ===== Accordion Sections (single-open) ===== */}
            <div className="um-accordion">
              {/* Account */}
              <button
                className="um-acc-header"
                aria-controls="acc-account"
                aria-expanded={sections.account}
                onClick={() => onToggle("account")}
                data-mi="1"
                data-acc-header="1"
                data-acc-key="account"
                role="menuitem"
              >
                <span className="um-acc-title">Account</span>
                <span
                  className={`um-acc-caret ${
                    sections.account ? "um-acc-caret--open" : ""
                  }`}
                >
                  ▾
                </span>
              </button>
              <div id="acc-account" role="group" hidden={!sections.account}>
                <div className="um-list">
                  <Link
                    to="/profile"
                    className="um-item"
                    role="menuitem"
                    data-mi="1"
                    onClick={(e) => {
                      if (DEV_KEEP_OPEN) e.preventDefault();
                    }}
                  >
                    <span className="um-item-text">Profile</span>
                    <span className="um-item-caret">›</span>
                  </Link>
                  <Link
                    to="/preferences"
                    className="um-item"
                    role="menuitem"
                    data-mi="1"
                    onClick={(e) => {
                      if (DEV_KEEP_OPEN) e.preventDefault();
                    }}
                  >
                    <span className="um-item-text">Preferences</span>
                    <span className="um-item-caret">›</span>
                  </Link>
                  <button
                    className="um-item um-item--danger"
                    onClick={() => {
                      setOpen(false);
                      void signOut();
                    }}
                    role="menuitem"
                    data-mi="1"
                  >
                    <span className="um-item-text">Sign out</span>
                    <span className="um-item-caret">›</span>
                  </button>
                </div>
              </div>

              {/* Work */}
              <button
                className="um-acc-header"
                aria-controls="acc-work"
                aria-expanded={sections.work}
                onClick={() => onToggle("work")}
                data-mi="1"
                data-acc-header="1"
                data-acc-key="work"
                role="menuitem"
              >
                <span className="um-acc-title">Work</span>
                <span
                  className={`um-acc-caret ${
                    sections.work ? "um-acc-caret--open" : ""
                  }`}
                >
                  ▾
                </span>
              </button>
              <div id="acc-work" role="group" hidden={!sections.work}>
                <div className="um-list">
                  <Link
                    to="/jobs"
                    className="um-item"
                    role="menuitem"
                    data-mi="1"
                  >
                    <span className="um-item-text">My Jobs</span>
                    <span className="um-item-caret">›</span>
                  </Link>
                  <Link
                    to="/tasks"
                    className="um-item"
                    role="menuitem"
                    data-mi="1"
                  >
                    <span className="um-item-text">My Tasks</span>
                    <span className="um-item-caret">›</span>
                  </Link>
                  <Link
                    to="/activity"
                    className="um-item"
                    role="menuitem"
                    data-mi="1"
                  >
                    <span className="um-item-text">Activity Feed</span>
                    <span className="um-item-caret">›</span>
                  </Link>
                </div>
              </div>

              {/* Company (Admins only) */}
              {isAdmin && (
                <>
                  <button
                    className="um-acc-header"
                    aria-controls="acc-company"
                    aria-expanded={sections.company}
                    onClick={() => onToggle("company")}
                    data-mi="1"
                    data-acc-header="1"
                    data-acc-key="company"
                    role="menuitem"
                  >
                    <span className="um-acc-title">Company</span>
                    <span
                      className={`um-acc-caret ${
                        sections.company ? "um-acc-caret--open" : ""
                      }`}
                    >
                      ▾
                    </span>
                  </button>
                  <div id="acc-company" role="group" hidden={!sections.company}>
                    <div className="um-list">
                      <Link
                        to="/admin/team"
                        className="um-item"
                        role="menuitem"
                        data-mi="1"
                      >
                        <span className="um-item-text">Team Management</span>
                        <span className="um-item-caret">›</span>
                      </Link>
                      <Link
                        to="/admin/settings"
                        className="um-item"
                        role="menuitem"
                        data-mi="1"
                      >
                        <span className="um-item-text">Company Settings</span>
                        <span className="um-item-caret">›</span>
                      </Link>
                      <Link
                        to="/admin/integrations"
                        className="um-item"
                        role="menuitem"
                        data-mi="1"
                      >
                        <span className="um-item-text">Integrations</span>
                        <span className="um-item-caret">›</span>
                      </Link>
                    </div>
                  </div>
                </>
              )}

              {/* Support */}
              <button
                className="um-acc-header"
                aria-controls="acc-support"
                aria-expanded={sections.support}
                onClick={() => onToggle("support")}
                data-mi="1"
                data-acc-header="1"
                data-acc-key="support"
                role="menuitem"
              >
                <span className="um-acc-title">Support</span>
                <span
                  className={`um-acc-caret ${
                    sections.support ? "um-acc-caret--open" : ""
                  }`}
                >
                  ▾
                </span>
              </button>
              <div id="acc-support" role="group" hidden={!sections.support}>
                <div className="um-list">
                  <Link
                    to="/help"
                    className="um-item"
                    role="menuitem"
                    data-mi="1"
                  >
                    <span className="um-item-text">Help</span>
                    <span className="um-item-caret">›</span>
                  </Link>
                  <Link
                    to="/whats-new"
                    className="um-item"
                    role="menuitem"
                    data-mi="1"
                  >
                    <span className="um-item-text">What’s New</span>
                    <span className="um-item-caret">›</span>
                  </Link>
                </div>
              </div>

              {/* Growth */}
              <button
                className="um-acc-header"
                aria-controls="acc-growth"
                aria-expanded={sections.growth}
                onClick={() => onToggle("growth")}
                data-mi="1"
                data-acc-header="1"
                data-acc-key="growth"
                role="menuitem"
              >
                <span className="um-acc-title">Growth</span>
                <span
                  className={`um-acc-caret ${
                    sections.growth ? "um-acc-caret--open" : ""
                  }`}
                >
                  ▾
                </span>
              </button>
              <div id="acc-growth" role="group" hidden={!sections.growth}>
                <div className="um-list">
                  <Link
                    to="/billing"
                    className="um-item"
                    role="menuitem"
                    data-mi="1"
                  >
                    <span className="um-item-text">
                      Billing & Subscriptions
                    </span>
                    <span className="um-item-caret">›</span>
                  </Link>
                  <Link
                    to="/refer"
                    className="um-item"
                    role="menuitem"
                    data-mi="1"
                  >
                    <span className="um-item-text">Refer a Friend</span>
                    <span className="um-item-caret">›</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Support contact pinned at bottom */}
            <div className="um-support">
              <div className="um-support-title">Customer Support</div>
              <div className="um-support-contacts">
                <a
                  href="tel:+18776710153"
                  className="um-support-phone"
                  data-mi="1"
                >
                  (877) 671-0153
                </a>
                <a
                  href="mailto:support@bossos.app"
                  className="um-support-email"
                  data-mi="1"
                >
                  support@bossos.app
                </a>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
