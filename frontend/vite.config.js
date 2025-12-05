import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// import { Https } from "@mui/icons-material";
// import cert from "vite-plugin-mkcert";

// https://vite.dev/config/
export default defineConfig({
  // plugins: [react(), cert()],
  plugins: [react()],
  server: {
    port: 3000,
    // https: true,
  },
});
