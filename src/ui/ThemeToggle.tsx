export default function ThemeToggle() {
  const cycle = () => {
    const el = document.documentElement;
    const cur = el.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = cur === "dark" ? "light" : "dark";
    el.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };
  return (
    <button onClick={cycle} className="auth-btn-secondary" aria-label="Toggle theme">
      Toggle theme
    </button>
  );
}
