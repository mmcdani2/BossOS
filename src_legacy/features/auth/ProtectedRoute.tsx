import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { supabase } from "@/lib/supabase/client";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user, initialized } = useAuth();
    const location = useLocation();
    const isAuthRoute = location.pathname.startsWith("/auth/");
    const isOnboardingRoute = location.pathname.startsWith("/onboarding");

    // null = unknown (loading), true/false = known
    const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);

    useEffect(() => {
        if (!user) {
            setOnboardingComplete(null);
            return;
        }
        let cancelled = false;
        (async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("onboarding_complete")
                .eq("id", user.id)
                .maybeSingle();

            if (!cancelled) {
                if (error) { setOnboardingComplete(null); return; }
                setOnboardingComplete(!!data?.onboarding_complete);
            }
        })();
        return () => { cancelled = true; };
    }, [user?.id]);

    // Wait for auth provider to boot
    if (!initialized) return null;

    // Not logged in: allow /auth/*, otherwise push to /signin
    if (!user) return isAuthRoute ? <>{children}</> : <Navigate to="/signin" replace />;

    // Logged in but we haven't read profile yet
    if (onboardingComplete === null) return null;

    // Route guards based on onboarding status
    if (!onboardingComplete && !isOnboardingRoute)
        return <Navigate to="/onboarding" replace />;

    if (onboardingComplete && isOnboardingRoute)
        return <Navigate to="/" replace />;

    return <>{children}</>;
}
