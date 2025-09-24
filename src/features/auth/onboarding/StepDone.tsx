import { Link, useNavigate } from "react-router-dom";

export default function StepDone() {
  const navigate = useNavigate();
  return (
    <div className="space-y-4 sm:space-y-6 text-center">
      <h2 className="text-lg font-semibold text-white">All set! 🎉</h2>
      <p className="text-sm text-slate-300/80">
        Your workspace is ready. You can invite teammates later from Settings.
      </p>
      <div className="auth-wizard-actions justify-center">
        <button
          className="auth-btn-primary"
          onClick={() => navigate("/dashboard")}
        >
          Go to dashboard
        </button>
        <Link
          to="/account/settings/company/people"
          className="auth-btn-secondary inline-flex items-center justify-center"
        >
          Invite teammates
        </Link>
      </div>
    </div>
  );
}
