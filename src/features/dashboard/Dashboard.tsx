import Nav from "@/ui/Nav";
import { useDashboardKPIs } from "./useDashboardKPIs";

export default function Dashboard() {
    const {
        openEstimatesValue,
        jobsTodayCount,
        arBalance,
        leadsThisWeekCount,
        loading,
        error,
    } = useDashboardKPIs();

    const fmtMoney = (v: number | null) =>
        v !== null ? `$${v.toLocaleString()}` : "—";
    const fmtCount = (v: number | null) => (v !== null ? v : "—");

    return (
        <>
            <Nav />
            <div className="shell">
                {error && <div className="dashboard-alert">{error}</div>}
                <div className="kpi-grid">
                    <div className="kpi-card">
                        <div className="kpi-value">{fmtMoney(openEstimatesValue)}</div>
                        <div className="kpi-label">Open Estimates</div>
                    </div>
                    <div className="kpi-card">
                        <div className="kpi-value">{fmtCount(jobsTodayCount)}</div>
                        <div className="kpi-label">Jobs Today</div>
                    </div>
                    <div className="kpi-card">
                        <div className="kpi-value">{fmtMoney(arBalance)}</div>
                        <div className="kpi-label">AR Balance</div>
                    </div>
                    <div className="kpi-card">
                        <div className="kpi-value">{fmtCount(leadsThisWeekCount)}</div>
                        <div className="kpi-label">Leads This Week</div>
                    </div>
                </div>
                {loading && <div className="dashboard-subtle">Loading KPIs…</div>}
            </div>
        </>
    );
}
