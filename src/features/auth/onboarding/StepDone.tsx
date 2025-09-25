import { Link, useNavigate } from "react-router-dom";

export default function StepDone() {
  const navigate = useNavigate();
  return (
    <div className="text-center space-y-4 sm:space-y-6">
      <h2 className="auth-title">All set! 🎉</h2>
      <p className="auth-subtext">
        Your workspace is ready. You can invite teammates later from Settings.
      </p>
      <div className="auth-wizard-actions justify-center">
        <button className="auth-btn-primary" onClick={() => navigate("/dashboard")}>
          Go to dashboard
        </button>
        <Link to="/account/settings/company/people" className="auth-btn-secondary">
          Invite teammates
        </Link>
      </div>
    </div>
  );
}
