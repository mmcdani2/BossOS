import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider } from "@/app/providers/AuthProvider";
import Chrome from "@/app/layouts/Chrome";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import WipNotice from "@/features/common/components/WipNotice";

// Public
import SignIn from "@/features/auth/SignIn";
import SignUp from "@/features/auth/SignUp";
import AuthCallback from "@/features/auth/AuthCallback";

// Onboarding
import OnboardingShell from "@/features/auth/onboarding/OnboardingShell";
import StepProfile from "@/features/auth/onboarding/StepProfile";
import StepCompany from "@/features/auth/onboarding/StepCompany";
import StepPreferences from "@/features/auth/onboarding/StepPreferences";
import StepDone from "@/features/auth/onboarding/StepDone";

// App pages
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

export const router = createBrowserRouter([
    // Public
    { path: "/signin", element: <SignIn /> },
    { path: "/register", element: <SignUp /> },
    { path: "/auth/callback", element: <AuthCallback /> },

    // Onboarding (protected)
    {
        path: "/onboarding",
        element: (
            <ProtectedRoute>
                <OnboardingShell />
            </ProtectedRoute>
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
            <ProtectedRoute>
                <Chrome />
            </ProtectedRoute>
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

            // ---- Company (WIP)
            { path: "account/settings/company/profile", element: <WipNotice title="Company Profile" /> },
            { path: "account/settings/company/business", element: <WipNotice title="Business Settings" /> },
            { path: "account/settings/company/hours", element: <WipNotice title="Hours & Availability" /> },
            { path: "account/settings/company/service-areas", element: <WipNotice title="Service Areas" /> },
            { path: "account/settings/company/branding", element: <WipNotice title="Branding" /> },
            { path: "account/settings/company/people", element: <WipNotice title="People & Access" /> },
            { path: "account/settings/company/permissions", element: <WipNotice title="Teams & Permissions" /> },
            { path: "account/settings/company/auth", element: <WipNotice title="Login & Authentication" /> },
            { path: "account/settings/company/time-tracking", element: <WipNotice title="Time Tracking" /> },
            { path: "account/settings/company/commissions", element: <WipNotice title="Commissions" /> },

            // ---- Pricing
            { path: "account/settings/pricing/price-book", element: <WipNotice title="Price Book" /> },
            { path: "account/settings/pricing/material-tracking", element: <WipNotice title="Material Tracking" /> },
            { path: "account/settings/pricing/job-costing", element: <WipNotice title="Job Costing Defaults" /> },

            // ---- Checklists
            { path: "account/settings/checklists/templates", element: <WipNotice title="Checklists Templates" /> },

            // ---- Workflows
            { path: "account/settings/workflows/jobs", element: <WipNotice title="Jobs Workflow" /> },
            { path: "account/settings/workflows/estimates", element: <WipNotice title="Estimates Workflow" /> },
            { path: "account/settings/workflows/invoices", element: <WipNotice title="Invoices Workflow" /> },
            { path: "account/settings/workflows/templates", element: <WipNotice title="Workflow Templates" /> },
            { path: "account/settings/workflows/automations", element: <WipNotice title="Automations" /> },

            // ---- Comms
            { path: "account/settings/comms/channels", element: <WipNotice title="Channels" /> },
            { path: "account/settings/comms/templates", element: <WipNotice title="Message Templates" /> },
            { path: "account/settings/comms/notifications", element: <WipNotice title="Notifications" /> },
            { path: "account/settings/comms/portal", element: <WipNotice title="Customer Portal" /> },

            // ---- Sales & Marketing
            { path: "account/settings/sales/lead-sources", element: <WipNotice title="Lead Sources" /> },
            { path: "account/settings/sales/pipeline", element: <WipNotice title="Pipeline" /> },
            { path: "account/settings/sales/campaigns", element: <WipNotice title="Campaigns" /> },
            { path: "account/settings/sales/referrals", element: <WipNotice title="Referrals & Review Requests" /> },
            { path: "account/settings/sales/online-booking", element: <WipNotice title="Online Booking & Lead Forms" /> },

            // ---- Finance
            { path: "account/settings/finance/payments", element: <WipNotice title="Payments" /> },
            { path: "account/settings/finance/billing", element: <WipNotice title="Billing & Subscription" /> },
            { path: "account/settings/finance/accounting", element: <WipNotice title="Accounting Integrations" /> },
            { path: "account/settings/finance/tax", element: <WipNotice title="Tax Rules" /> },

            // ---- Plans
            { path: "account/settings/plans/catalog", element: <WipNotice title="Plan Catalog" /> },
            { path: "account/settings/plans/renewals", element: <WipNotice title="Renewals" /> },
            { path: "account/settings/plans/compliance", element: <WipNotice title="Compliance Logs" /> },

            // ---- Inventory
            { path: "account/settings/inventory/locations", element: <WipNotice title="Locations" /> },
            { path: "account/settings/inventory/reorder", element: <WipNotice title="Stock Levels & Reorder Rules" /> },
            { path: "account/settings/inventory/receiving", element: <WipNotice title="Receiving/Adjustments" /> },
            { path: "account/settings/inventory/usage", element: <WipNotice title="Job Usage Tracking" /> },

            // Catch-all (protected area)
            { path: "*", element: <Navigate to="/signin" replace /> },
        ],
    },

    // Fallback for any unknown public route
    { path: "*", element: <Navigate to="/signin" replace /> },
]);
