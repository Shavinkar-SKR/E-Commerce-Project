import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      //Any request starting with /api (e.g., /api/v1/products) will be proxied to your backend server (localhost:8000).
      //axios.get("/api/v1/products") will now correctly hit the backend.
      "/api": {
        target: "http://localhost:8000", //backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
