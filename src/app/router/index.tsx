// index.tsx
// Basic router setup with public and app shells

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chrome from "../layouts/Chrome";
import PublicLayout from "../layouts/PublicLayout";
import Onboarding from "../../features/auth/onboarding/Onboarding";
import Landing from "../../features/landing/Landing";

// Main Router component
export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public marketing pages */}
                <Route element={<PublicLayout />}>
                    <Route index element={<Landing />} />
                </Route>

                {/* Authenticated app shell */}
                <Route element={<Chrome />}>
                    <Route path="/onboarding" element={<Onboarding />} />

                    {/* TODO: add more routes here as we build */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
