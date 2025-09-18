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
    document.body.classList.add("with-bottomnav");
    return () => document.body.classList.remove("with-bottomnav");
  }, []);
  return (
    <>
      <Outlet />
      <BottomNavPortalInsideRouter />
    </>
  );
}

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
      { index: true, element: <Dashboard /> },
      { path: "scheduling", element: <Scheduler /> },
      { path: "jobs", element: <Jobs /> },
      { path: "estimates", element: <Estimates /> },
      { path: "billing", element: <Billing /> },
      { path: "crm", element: <Customers /> },
      { path: "inventory", element: <Inventory /> },
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
