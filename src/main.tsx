import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/app/providers/AuthProvider";
import SignIn from "@/features/auth/SignIn";
import Dashboard from "@/features/dashboard/Dashboard";
import "./index.css";

console.log("ENV:", import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 8));

function Protected({ children }: { children: React.ReactNode }) {
  const { user, initialized } = useAuth();

  if (!initialized) {
    return (
      <div className="auth-center">
        <div className="auth-card">Loading…</div>
      </div>
    );
  }

  if (initialized && !user) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}


const router = createBrowserRouter([
  { path: "/signin", element: <SignIn /> },
  { path: "/", element: <Protected><Dashboard /></Protected> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
