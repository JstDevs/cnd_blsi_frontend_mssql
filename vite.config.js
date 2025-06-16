import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    allowedHosts: [
      "cddemo.testthelink.online",
      "staging-portal.testthelink.online",
      ".testthelink.online"
    ],
    // allowedHosts: 'all', // Allow all incoming hostnames
    open: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
