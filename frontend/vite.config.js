import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  // plugins: [react(), cert()],
  build: {
    outDir: "../backend/API/wwwroot",
    chunkSizeWarningLimit: 1500,
    emptyOutDir: true,
  },
  plugins: [react()],
  server: {
    port: 3000,
    // https: true,
  },
});
