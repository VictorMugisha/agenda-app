import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  console.log("Build mode:", mode);
  
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, ".");

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
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
