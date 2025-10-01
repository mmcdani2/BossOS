// tailwind-heroui-theme.ts (or tailwind.config.ts if you inline it)
// ESM config, HeroUI + Tailwind v3/v4 compatible plugin usage.

import { heroui } from "@heroui/react";
import { createRequire } from "module";
import path from "path";

const require = createRequire(import.meta.url);
const herouiThemeDist = path.join(
  path.dirname(require.resolve("@heroui/theme/package.json")),
  "dist",
);
// Ensure Tailwind scans HeroUI's generated classes
const heroUiContentGlob = `${herouiThemeDist.replace(/\\/g, "/")}/**/*.{js,ts,jsx,tsx,mjs}`;

// ---------- Brand Themes ----------

// Light theme aligned with mockup (cyan/blue primary, neutral slate, subtle gold accent)
const bossLight = {
  extend: "light",
  layout: {
    radius: {
      small: "0.6rem",
      medium: "0.85rem",
      large: "1.25rem",
    },
    borderWidth: {
      small: "1px",
      medium: "1.5px",
      large: "2px",
    },
    fontSize: {
      tiny: "0.75rem",
      small: "0.875rem",
      medium: "1rem",
      large: "1.125rem",
      huge: "3.5rem",
    },
    disabledOpacity: 0.45,
  },
  colors: {
    background: "#f8fafc", // slate-50 vibe
    foreground: "#0f172a", // slate-900
    focus: "#0ea5e9",      // cyan-500 for focus rings
    border: "#e5e7eb",
    divider: "#e5e7eb",

    // Primary = cyan/blue (CTA, active states)
    primary: {
      50:  "#ecfeff",
      100: "#cffafe",
      200: "#a5f3fc",
      300: "#67e8f9",
      400: "#22d3ee",
      500: "#0ea5e9",
      600: "#0284c7", // darker on hover/press
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
      DEFAULT: "#0ea5e9",
      foreground: "#06202b",
    },

    // Secondary = cool slate for subtle accents
    secondary: {
      50:  "#f1f5f9",
      100: "#e2e8f0",
      200: "#cbd5e1",
      300: "#94a3b8",
      400: "#64748b",
      500: "#475569",
      600: "#334155",
      700: "#1f2937",
      800: "#0f172a",
      900: "#0b1220",
      DEFAULT: "#475569",
      foreground: "#0f172a",
    },

    // Neutral ramp powering cards/tables/forms
    default: {
      50:  "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1", // fixed typo from #cbd5f5
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
      foreground: "#0f172a",
    },

    // Status colors (WCAG-friendly ramps; hover = darker)
    success: {
      500: "#22c55e",
      600: "#16a34a",
      foreground: "#052e16",
    },
    warning: {
      500: "#f59e0b",
      600: "#d97706",
      foreground: "#2a1602",
    },
    danger: {
      500: "#ef4444",
      600: "#dc2626",
      foreground: "#3f0a0a",
    },

    // Optional gold accent (limited use: highlights, not primary)
    accent: {
      DEFAULT: "#facc15",
      foreground: "#1f1300",
    },
  },
};

// ————— in your theme config file: replace bossDark with this —————
const bossDark = {
  extend: "dark",
  layout: bossLight.layout,
  colors: {
    // Warm charcoal shell + soft white text
    background: "#0a0c0f",
    foreground: "#f5f7fa",

    // Focus ring = premium gold
    focus: "#d8a800",

    // Warm graphite separators (no blue tint)
    border:  "#23262d",
    divider: "#23262d",

    // PRIMARY = BossOS red for actions (hover goes darker)
    primary: {
      50:  "#2b0b0b",
      100: "#3d1111",
      200: "#5a1616",
      300: "#7a1a1a",
      400: "#a11f1f",
      500: "#ef4444",   // DEFAULT
      600: "#dc2626",   // hover/press (darker)
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
      DEFAULT: "#ef4444",
      foreground: "#fff7f7",
    },

    // SECONDARY = deeper gold (not lemon), for tasteful accents
    secondary: {
      50:  "#2a2207",
      100: "#3a2e09",
      200: "#5a430c",
      300: "#7a590e",
      400: "#9b6f10",
      500: "#d8a800",   // DEFAULT accent
      600: "#c39600",
      700: "#9d7a00",
      800: "#7a5f00",
      900: "#5c4800",
      DEFAULT: "#d8a800",
      foreground: "#140e00",
    },

    // NEUTRALS = warm charcoal ramp powering glass surfaces
    // 500 is the card base; pair with /10–/20 + blur for glass feel
    default: {
      50:  "#0e1114",
      100: "#13171c",
      200: "#171c22",
      300: "#1d232b",
      400: "#242b35",
      500: "#2b343f",   // card base glass
      600: "#333e4a",
      700: "#3f4b58",
      800: "#536371",
      900: "#6c7d8c",
      foreground: "#f5f7fa",
    },

    // Status ramps (hover = darker)
    success: { 500: "#22c55e", 600: "#16a34a", foreground: "#06240f" },
    warning: { 500: "#f97316", 600: "#ea580c", foreground: "#431407" },
    danger:  { 500: "#ef4444", 600: "#dc2626", foreground: "#450a0a" },
  },
};



// ---------- Tailwind Export ----------

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    heroUiContentGlob,
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "'Inter'",
          "var(--font-sans, ui-sans-serif)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [
    heroui({
      themes: {
        light: bossLight,
        dark: bossDark,
      },
    }),
  ],
};
