import { vlyPlugin } from "@vly-ai/integrations";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vlyPlugin(), react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
    target: 'esnext',
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 100000000,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router',
    ],
  },
  // Performance hints
  server: {
    // HMR disabled — Freebuff serves the Vite dev server through a proxy,
    // and leaving HMR on makes the browser try (and fail) to open a
    // WebSocket back to the upstream dev backend.
    hmr: false,
  },
});
