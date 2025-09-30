export default function StepDone() {
  return (
    <div className="text-center space-y-4 sm:space-y-6">
      <h2 className="title">All set! 🎉</h2>
      <p className="subtext">
        Your workspace is ready.
      </p>
      <p className="subtext">
        You can invite teammates later from Settings.
      </p>
      <div className="auth-wizard-actions justify-center">
        <button className="btn-primary" onClick={() => window.location.replace("/")}>
          Go to dashboard
        </button>
      </div>
    </div>
  );
}
