import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../../features/dashboard/Dashboard";

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                {/* TODO: add /signin, /clients, etc. */}
            </Routes>
        </BrowserRouter>
    );
}
