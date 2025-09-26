/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { createPortal } from "react-dom";
import { AuthProvider, useAuth } from "@/app/providers/AuthProvider";
import { supabase } from "@/lib/supabase/client";

import SignIn from "@/features/auth/SignIn";
import SignUp from "@/features/auth/SignUp";
import AuthCallback from "@/features/auth/AuthCallback";

import OnboardingShell from "@/features/auth/onboarding/OnboardingShell";
import StepProfile from "@/features/auth/onboarding/StepProfile";
import StepCompany from "@/features/auth/onboarding/StepCompany";
import StepPreferences from "@/features/auth/onboarding/StepPreferences";
import StepDone from "@/features/auth/onboarding/StepDone";

import Dashboard from "@/features/dashboard/Dashboard";
import Scheduler from "@/features/scheduling/Scheduler";
import Jobs from "@/features/jobs/Jobs";
import Estimates from "@/features/estimates/Estimates";
import Billing from "@/features/billing/Billing";
import Customers from "@/features/crm/Customers";
import Inventory from "@/features/inventory/Inventory";
import Profile from "@/features/account/Profile";
import Preferences from "@/features/account/Preferences";
import Settings from "@/features/account/Settings";

import PageHeader from "@/ui/PageHeader";
import ViewToolbar from "@/ui/ViewToolbar";
import GlassCard from "@/ui/GlassCard";
import BottomNav from "./ui/BottomNav";

import "./index.css";

console.log(
  "ENV:",
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 8)
);

/** ---------- Auth guard ---------- */
function Protected({ children }: { children: React.ReactNode }) {
  const { user, initialized } = useAuth();
  const location = useLocation();
  const isAuthRoute = location.pathname.startsWith("/auth/");
  const isOnboardingRoute = location.pathname.startsWith("/onboarding");

  // Hooks FIRST (no conditional hooks)
  const [complete, setComplete] = useState<boolean | null>(null);

  useEffect(() => {
    // reset while booting/unauthenticated
    if (!user) {
      setComplete(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("onboarding_complete")
        .eq("id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        // Treat error as "unknown" so we don't misroute
        setComplete(null);
        return;
      }
      const v = data?.onboarding_complete;
     setComplete(v === true ? true : v === false ? false : null);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // Now render decisions (no hooks below this line)
  if (!initialized) return null;

  if (!user) {
    // allow /auth/* while unauthenticated
    return isAuthRoute ? <>{children}</> : <Navigate to="/signin" replace />;
  }

  if (complete === null) return null; // wait for profile read

  if (complete === false && !isOnboardingRoute)
    return <Navigate to="/onboarding" replace />;
  if (complete === true && isOnboardingRoute)  
    return <Navigate to="/" replace />;

  return <>{children}</>;
}

/** ---------- Bottom nav inside router ---------- */
function BottomNavPortalInsideRouter() {
  return createPortal(<BottomNav />, document.body);
}

/** ---------- App chrome ---------- */
function Chrome() {
  useEffect(() => {
    document.body.classList.add("with-bottomnav", "with-topnav");
    return () =>
      document.body.classList.remove("with-bottomnav", "with-topnav");
  }, []);
  return (
    <>
      <Outlet />
      <BottomNavPortalInsideRouter />
    </>
  );
}

/** ---------- Generic placeholder ---------- */
const Wip = ({ title }: { title: string }) => (
  <>
    <PageHeader />
    <div className="shell page-viewport">
      <div
        className="sticky-under-nav"
        style={{ top: "calc(var(--nav-h) - 64px)" }}
      >
        <GlassCard className="p-3">
          <ViewToolbar label={title} />
        </GlassCard>
      </div>
      <div className="mt-4">
        <GlassCard className="p-6 text-white/70">Coming soon.</GlassCard>
      </div>
    </div>
  </>
);

/** ---------- Router ---------- */
const router = createBrowserRouter([
  // Public
  { path: "/signin", element: <SignIn /> },
  { path: "/register", element: <SignUp /> },
  { path: "/auth/callback", element: <AuthCallback /> },

  // Onboarding (protected)
  {
    path: "/onboarding",
    element: (
      <Protected>
        <OnboardingShell />
      </Protected>
    ),
    children: [
      { index: true, element: <StepProfile /> },
      { path: "company", element: <StepCompany /> },
      { path: "preferences", element: <StepPreferences /> },
      { path: "done", element: <StepDone /> },
    ],
  },

  // App (protected)
  {
    path: "/",
    element: (
      <Protected>
        <Chrome />
      </Protected>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "scheduling", element: <Scheduler /> },
      { path: "jobs", element: <Jobs /> },
      { path: "estimates", element: <Estimates /> },
      { path: "billing", element: <Billing /> },
      { path: "crm", element: <Customers /> },
      { path: "inventory", element: <Inventory /> },
      { path: "account/profile", element: <Profile /> },
      { path: "account/preferences", element: <Preferences /> },
      { path: "account/settings", element: <Settings /> },

      // Company (WIP)
      {
        path: "account/settings/company/profile",
        element: <Wip title="Company Profile" />,
      },
      {
        path: "account/settings/company/business",
        element: <Wip title="Business Settings" />,
      },
      {
        path: "account/settings/company/hours",
        element: <Wip title="Hours & Availability" />,
      },
      {
        path: "account/settings/company/service-areas",
        element: <Wip title="Service Areas" />,
      },
      {
        path: "account/settings/company/branding",
        element: <Wip title="Branding" />,
      },
      {
        path: "account/settings/company/people",
        element: <Wip title="People & Access" />,
      },
      {
        path: "account/settings/company/permissions",
        element: <Wip title="Teams & Permissions" />,
      },
      {
        path: "account/settings/company/auth",
        element: <Wip title="Login & Authentication" />,
      },
      {
        path: "account/settings/company/time-tracking",
        element: <Wip title="Time Tracking" />,
      },
      {
        path: "account/settings/company/commissions",
        element: <Wip title="Commissions" />,
      },

      // Pricing
      {
        path: "account/settings/pricing/price-book",
        element: <Wip title="Price Book" />,
      },
      {
        path: "account/settings/pricing/material-tracking",
        element: <Wip title="Material Tracking" />,
      },
      {
        path: "account/settings/pricing/job-costing",
        element: <Wip title="Job Costing Defaults" />,
      },

      // Checklists
      {
        path: "account/settings/checklists/templates",
        element: <Wip title="Checklists Templates" />,
      },

      // Workflows
      {
        path: "account/settings/workflows/jobs",
        element: <Wip title="Jobs Workflow" />,
      },
      {
        path: "account/settings/workflows/estimates",
        element: <Wip title="Estimates Workflow" />,
      },
      {
        path: "account/settings/workflows/invoices",
        element: <Wip title="Invoices Workflow" />,
      },
      {
        path: "account/settings/workflows/templates",
        element: <Wip title="Workflow Templates" />,
      },
      {
        path: "account/settings/workflows/automations",
        element: <Wip title="Automations" />,
      },

      // Comms
      {
        path: "account/settings/comms/channels",
        element: <Wip title="Channels" />,
      },
      {
        path: "account/settings/comms/templates",
        element: <Wip title="Message Templates" />,
      },
      {
        path: "account/settings/comms/notifications",
        element: <Wip title="Notifications" />,
      },
      {
        path: "account/settings/comms/portal",
        element: <Wip title="Customer Portal" />,
      },

      // Sales & Marketing
      {
        path: "account/settings/sales/lead-sources",
        element: <Wip title="Lead Sources" />,
      },
      {
        path: "account/settings/sales/pipeline",
        element: <Wip title="Pipeline" />,
      },
      {
        path: "account/settings/sales/campaigns",
        element: <Wip title="Campaigns" />,
      },
      {
        path: "account/settings/sales/referrals",
        element: <Wip title="Referrals & Review Requests" />,
      },
      {
        path: "account/settings/sales/online-booking",
        element: <Wip title="Online Booking & Lead Forms" />,
      },

      // Finance
      {
        path: "account/settings/finance/payments",
        element: <Wip title="Payments" />,
      },
      {
        path: "account/settings/finance/billing",
        element: <Wip title="Billing & Subscription" />,
      },
      {
        path: "account/settings/finance/accounting",
        element: <Wip title="Accounting Integrations" />,
      },
      {
        path: "account/settings/finance/tax",
        element: <Wip title="Tax Rules" />,
      },

      // Plans
      {
        path: "account/settings/plans/catalog",
        element: <Wip title="Plan Catalog" />,
      },
      {
        path: "account/settings/plans/renewals",
        element: <Wip title="Renewals" />,
      },
      {
        path: "account/settings/plans/compliance",
        element: <Wip title="Compliance Logs" />,
      },

      // Inventory
      {
        path: "account/settings/inventory/locations",
        element: <Wip title="Locations" />,
      },
      {
        path: "account/settings/inventory/reorder",
        element: <Wip title="Stock Levels & Reorder Rules" />,
      },
      {
        path: "account/settings/inventory/receiving",
        element: <Wip title="Receiving/Adjustments" />,
      },
      {
        path: "account/settings/inventory/usage",
        element: <Wip title="Job Usage Tracking" />,
      },

      // Catch-all (protected area)
      { path: "*", element: <Navigate to="/signin" replace /> },
    ],
  },

  // Fallback for any unknown public route
  { path: "*", element: <Navigate to="/signin" replace /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
