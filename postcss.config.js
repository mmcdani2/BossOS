// postcss.config.js
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import postcssOklab from "@csstools/postcss-oklab-function";

export default {
  plugins: [
    tailwindcss(), // ✅ must be invoked
    postcssOklab({ preserve: true }), // ✅ proper import + call
    autoprefixer()
  ],
};
