import svgr from "@honkhonk/vite-plugin-svgr";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(), react()],
  resolve: {
    alias: {
      "@propound/utils": path.resolve(__dirname, "../utils/src/index.ts"),
      "@propound/types": path.resolve(__dirname, "../types/src/index.ts"),
    },
  },
  optimizeDeps: {
    exclude: [
      "firebase",
      "firebase/app",
      "firebase/auth",
      "firebase/firestore",
      "firebase/analytics",
    ],
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
});
