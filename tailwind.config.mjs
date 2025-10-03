// tailwind.config.mjs
import { heroui } from "@heroui/react";
import { createRequire } from "module";
import path from "path";

const require = createRequire(import.meta.url);
const herouiThemeDist = path.join(
  path.dirname(require.resolve("@heroui/theme/package.json")),
  "dist"
);
const heroUiContentGlob = `${herouiThemeDist.replace(/\\/g, "/")}/**/*.{js,ts,jsx,tsx,mjs}`;

// ---------------------- Themes ----------------------
// All colors defined in OKLCH with <alpha-value> for opacity support

const bossLight = {
  extend: "light",
  colors: {
    background: "oklch(100% 0 0 / <alpha-value>)",
    foreground: "oklch(29% 0 0 / <alpha-value>)",

    default: {
      50: "oklch(96% 0 0 / <alpha-value>)",
      100: "oklch(87% 0 0 / <alpha-value>)",
      200: "oklch(78% 0 0 / <alpha-value>)",
      300: "oklch(68% 0 0 / <alpha-value>)",
      400: "oklch(60% 0 0 / <alpha-value>)",
      500: "oklch(55% 0 0 / <alpha-value>)",
      600: "oklch(46% 0 0 / <alpha-value>)",
      700: "oklch(36% 0 0 / <alpha-value>)",
      800: "oklch(28% 0 0 / <alpha-value>)",
      900: "oklch(18% 0 0 / <alpha-value>)",
      DEFAULT: "oklch(55% 0 0 / <alpha-value>)",
      foreground: "oklch(0% 0 0 / <alpha-value>)",
    },

    primary: {
      50: "oklch(91% 0 0 / <alpha-value>)",
      100: "oklch(74% 0 0 / <alpha-value>)",
      200: "oklch(60% 0 0 / <alpha-value>)",
      300: "oklch(45% 0 0 / <alpha-value>)",
      400: "oklch(28% 0 0 / <alpha-value>)",
      500: "oklch(0% 0 0 / <alpha-value>)",
      600: "oklch(0% 0 0 / <alpha-value>)",
      700: "oklch(0% 0 0 / <alpha-value>)",
      800: "oklch(0% 0 0 / <alpha-value>)",
      900: "oklch(0% 0 0 / <alpha-value>)",
      DEFAULT: "oklch(0% 0 0 / <alpha-value>)",
      foreground: "oklch(100% 0 0 / <alpha-value>)",
    },

    secondary: {
      50: "oklch(98% 0.02 300 / <alpha-value>)",
      100: "oklch(95% 0.03 300 / <alpha-value>)",
      200: "oklch(92% 0.04 300 / <alpha-value>)",
      300: "oklch(89% 0.05 300 / <alpha-value>)",
      400: "oklch(86% 0.06 300 / <alpha-value>)",
      500: "oklch(82% 0.07 300 / <alpha-value>)",
      600: "oklch(69% 0.06 300 / <alpha-value>)",
      700: "oklch(55% 0.05 300 / <alpha-value>)",
      800: "oklch(40% 0.04 300 / <alpha-value>)",
      900: "oklch(25% 0.03 300 / <alpha-value>)",
      DEFAULT: "oklch(82% 0.07 300 / <alpha-value>)",
      foreground: "oklch(0% 0 0 / <alpha-value>)",
    },

    success: {
      50: "oklch(96% 0.02 145 / <alpha-value>)",
      100: "oklch(88% 0.04 145 / <alpha-value>)",
      200: "oklch(80% 0.06 145 / <alpha-value>)",
      300: "oklch(72% 0.08 145 / <alpha-value>)",
      400: "oklch(64% 0.1 145 / <alpha-value>)",
      500: "oklch(56% 0.12 145 / <alpha-value>)",
      600: "oklch(46% 0.1 145 / <alpha-value>)",
      700: "oklch(36% 0.08 145 / <alpha-value>)",
      800: "oklch(26% 0.06 145 / <alpha-value>)",
      900: "oklch(16% 0.04 145 / <alpha-value>)",
      DEFAULT: "oklch(56% 0.12 145 / <alpha-value>)",
      foreground: "oklch(0% 0 0 / <alpha-value>)",
    },

    warning: {
      50: "oklch(97% 0.03 80 / <alpha-value>)",
      100: "oklch(92% 0.06 80 / <alpha-value>)",
      200: "oklch(87% 0.09 80 / <alpha-value>)",
      300: "oklch(82% 0.12 80 / <alpha-value>)",
      400: "oklch(77% 0.15 80 / <alpha-value>)",
      500: "oklch(72% 0.18 80 / <alpha-value>)",
      600: "oklch(62% 0.15 80 / <alpha-value>)",
      700: "oklch(50% 0.12 80 / <alpha-value>)",
      800: "oklch(38% 0.09 80 / <alpha-value>)",
      900: "oklch(26% 0.06 80 / <alpha-value>)",
      DEFAULT: "oklch(72% 0.18 80 / <alpha-value>)",
      foreground: "oklch(0% 0 0 / <alpha-value>)",
    },

    danger: {
      50: "oklch(97% 0.03 30 / <alpha-value>)",
      100: "oklch(90% 0.06 30 / <alpha-value>)",
      200: "oklch(83% 0.09 30 / <alpha-value>)",
      300: "oklch(76% 0.12 30 / <alpha-value>)",
      400: "oklch(69% 0.15 30 / <alpha-value>)",
      500: "oklch(62% 0.18 30 / <alpha-value>)",
      600: "oklch(52% 0.15 30 / <alpha-value>)",
      700: "oklch(42% 0.12 30 / <alpha-value>)",
      800: "oklch(32% 0.09 30 / <alpha-value>)",
      900: "oklch(22% 0.06 30 / <alpha-value>)",
      DEFAULT: "oklch(62% 0.18 30 / <alpha-value>)",
      foreground: "oklch(100% 0 0 / <alpha-value>)",
    },

    content1: { DEFAULT: "oklch(94% 0 0 / <alpha-value>)", foreground: "oklch(0% 0 0 / <alpha-value>)" },
    content2: { DEFAULT: "oklch(90% 0 0 / <alpha-value>)", foreground: "oklch(0% 0 0 / <alpha-value>)" },
    content3: { DEFAULT: "oklch(86% 0 0 / <alpha-value>)", foreground: "oklch(0% 0 0 / <alpha-value>)" },
    content4: { DEFAULT: "oklch(82% 0 0 / <alpha-value>)", foreground: "oklch(0% 0 0 / <alpha-value>)" },

    focus: "oklch(72% 0.2 50 / <alpha-value>)",
    overlay: "oklch(0% 0 0 / <alpha-value>)",
  },
};

// Dark theme just extends light with palette inversion (we can expand if needed)
const bossDark = { extend: "dark", colors: bossLight.colors };

// ---------------------- Tailwind Export ----------------------

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", heroUiContentGlob],
  darkMode: "class",
  theme: { extend: {} },
  plugins: [
    heroui({
      themes: { light: bossLight, dark: bossDark },
    }),
  ],
};
