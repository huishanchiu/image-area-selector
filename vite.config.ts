import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@component": path.resolve(__dirname, "src/component"),
      "@constant": path.resolve(__dirname, "src/constant"),
      "@type": path.resolve(__dirname, "src/type"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@context": path.resolve(__dirname, "src/context"),
    },
  },
});
