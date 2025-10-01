import { createTheme, heroui } from "@heroui/react";
import { createRequire } from "module";
import path from "path";

const require = createRequire(import.meta.url);
const herouiThemeDist = path.join(
  path.dirname(require.resolve("@heroui/theme/package.json")),
  "dist",
);
const heroUiContentGlob = `${herouiThemeDist.replace(/\\/g, "/")}/**/*.{js,ts,jsx,tsx,mjs}`;

// Signature brand palettes that power both the Tailwind + HeroUI tokens
const bossLight = createTheme({
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
    background: "#fdfcf9",
    foreground: "#0f172a",
    focus: "#facc15",
    border: "#e5e7eb",
    divider: "#e5e7eb",
    primary: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
      DEFAULT: "#ef4444",
      foreground: "#ffffff",
    },
    secondary: {
      50: "#fefce8",
      100: "#fef08a",
      200: "#fde047",
      300: "#facc15",
      400: "#f59e0b",
      500: "#facc15",
      600: "#eab308",
      700: "#ca8a04",
      800: "#a16207",
      900: "#854d0e",
      DEFAULT: "#facc15",
      foreground: "#422006",
    },
    default: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5f5",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
      foreground: "#0f172a",
    },
    success: {
      500: "#22c55e",
      600: "#16a34a",
      foreground: "#052e16",
    },
    warning: {
      500: "#f97316",
      600: "#ea580c",
      foreground: "#431407",
    },
    danger: {
      500: "#ef4444",
      600: "#dc2626",
      foreground: "#450a0a",
    },
  },
});

const bossDark = createTheme({
  extend: "dark",
  layout: bossLight.layout,
  colors: {
    background: "#0b0f14",
    foreground: "#f8fafc",
    focus: "#facc15",
    border: "#1f2933",
    divider: "#1f2933",
    primary: {
      50: "#2b0b0b",
      100: "#3d1111",
      200: "#5a1616",
      300: "#7a1a1a",
      400: "#a11f1f",
      500: "#ef4444",
      600: "#f87171",
      700: "#fca5a5",
      800: "#fecaca",
      900: "#fee2e2",
      DEFAULT: "#ef4444",
      foreground: "#fff7f7",
    },
    secondary: {
      50: "#2d2004",
      100: "#3f2f07",
      200: "#604909",
      300: "#825f0b",
      400: "#a87c0e",
      500: "#facc15",
      600: "#fde047",
      700: "#fef08a",
      800: "#fef9c3",
      900: "#fffbeb",
      DEFAULT: "#facc15",
      foreground: "#201500",
    },
    default: {
      50: "#101621",
      100: "#151d2c",
      200: "#1d2739",
      300: "#253145",
      400: "#303e56",
      500: "#3c4a67",
      600: "#4b5b7c",
      700: "#627294",
      800: "#7d8bae",
      900: "#9aa6c7",
      foreground: "#f8fafc",
    },
    success: {
      500: "#22c55e",
      600: "#4ade80",
      foreground: "#042f14",
    },
    warning: {
      500: "#f97316",
      600: "#fb923c",
      foreground: "#431407",
    },
    danger: {
      500: "#f87171",
      600: "#fca5a5",
      foreground: "#450a0a",
    },
  },
});

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
