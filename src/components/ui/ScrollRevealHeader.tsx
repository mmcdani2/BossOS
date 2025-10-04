// src/components/ScrollRevealNavbar.tsx
"use client";
import { useEffect, useState } from "react";

export default function ScrollRevealNavbar({
  children,
  threshold = 80, // px to reveal
  className = "",
}: {
  children: React.ReactNode;
  threshold?: number;
  className?: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY >= threshold);
    onScroll(); // initialize state based on current scroll
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return (
    <div
      className={[
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        // subtle blur + theme-aware bg when visible
        show
          ? "opacity-100 translate-y-0 backdrop-blur bg-background/80"
          : "opacity-0 -translate-y-2 pointer-events-none",
        className,
      ].join(" ")}
    >
      <div className="mx-auto max-w-7xl px-6 py-4 sm:px-10">
        {children}
      </div>
    </div>
  );
}
