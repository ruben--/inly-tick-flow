
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize chunks
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Optimize asset chunking
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@/components/ui'],  // Fix incorrect path reference here
        },
      },
    },
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode !== 'development',  // Keep console logs in development
        drop_debugger: mode !== 'development',
      },
    },
    // Optimize CSS
    cssCodeSplit: true,
    // Use source maps in development only
    sourcemap: mode === 'development',
  },
}));
