import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, '.')
  
  return {
    plugins: [react()],
    define: {
      "import.meta.env.VITE_SOCKET_URL": JSON.stringify(
        env.VITE_SOCKET_URL || "https://victor-agenda-app.onrender.com"
      ),
    },
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:8000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        "/socket.io": {
          target: "http://localhost:8000",
          ws: true,
        },
      },
    },
  }
});
