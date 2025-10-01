import { heroui } from "@heroui/react";
import { createRequire } from "module";
import path from "path";

const require = createRequire(import.meta.url);
const herouiThemeDist = path.join(
  path.dirname(require.resolve("@heroui/theme/package.json")),
  "dist"
);
const heroUiContentGlob = `${herouiThemeDist.replace(/\\/g, "/")}/**/*.{js,ts,jsx,tsx,mjs}`;

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    heroUiContentGlob,
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui()],
};
