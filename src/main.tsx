/* eslint-disable react-refresh/only-export-components */
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { createPortal } from "react-dom";

import { AuthProvider, useAuth } from "@/app/providers/AuthProvider";
import SignIn from "@/features/auth/SignIn";
import Dashboard from "@/features/dashboard/Dashboard";
import Scheduler from "@/features/scheduling/Scheduler";
import BottomNav from "./ui/BottomNav";
import "./index.css";
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

console.log(
  "ENV:",
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 8)
);

// ---- Auth guard (unchanged) ----
function Protected({ children }: { children: React.ReactNode }) {
  const { user, initialized } = useAuth();

  if (!initialized) {
    return (
      <div className="auth-center">
        <div className="auth-card">Loading…</div>
      </div>
    );
  }
  if (!user) return <Navigate to="/signin" replace />;
  return <>{children}</>;
}

// ---- Bottom nav rendered inside Router context ----
function BottomNavPortalInsideRouter() {
  return createPortal(<BottomNav />, document.body);
}

// ---- Layout that shows page content + bottom nav ----
function Chrome() {
  React.useEffect(() => {
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

// generic placeholder page
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

// ---- Router: single 'children' array ----
const router = createBrowserRouter([
  { path: "/signin", element: <SignIn /> },
  {
    path: "/",
    element: (
      <Protected>
        <Chrome />
      </Protected>
    ),
    children: [
      //Main feature views
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
      // Settings hub
      { path: "account/settings", element: <Settings /> },

      // Company
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

      // Products & Pricing
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

      // Communications
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

      // Service Plans
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

      // Add-Ons
      { path: "account/settings/addons", element: <Wip title="Add-Ons" /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
