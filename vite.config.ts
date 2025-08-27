
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";
import { compression } from "vite-plugin-compression2";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      // Simplified React plugin configuration
      devTarget: 'es2020',
    }),
    mode === 'development' && componentTagger(),
    
    // Bundle analyzer - generates stats.html in dist folder
    mode === 'production' && visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
    
    // Brotli and Gzip compression for production
    mode === 'production' && compression({
      algorithms: ['brotliCompress'],
    }),
    mode === 'production' && compression({
      algorithms: ['gzip'],
    })
  ].filter(Boolean),
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  build: {
    target: 'es2020',
    cssTarget: 'chrome80',
    
    rollupOptions: {
      output: {
        // Simplified code splitting
        manualChunks: mode === 'production' ? (id) => {
          // React core chunk
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-core';
          }
          // UI libraries chunk
          if (id.includes('@radix-ui') || id.includes('framer-motion') || id.includes('lucide-react')) {
            return 'ui-libs';
          }
          // Charts and data visualization
          if (id.includes('recharts') || id.includes('@tanstack/react-virtual')) {
            return 'data-viz';
          }
          // Query and routing
          if (id.includes('@tanstack/react-query') || id.includes('react-router')) {
            return 'app-libs';
          }
        } : undefined,
        
        // Optimize chunk names for caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split('.').pop();
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif/i.test(extType || '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/css/i.test(extType || '')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    
    // Production optimizations
    minify: mode === 'production' ? 'terser' : false,
    terserOptions: mode === 'production' ? {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    } : undefined,
    
    // Source maps only in development
    sourcemap: mode === 'development',
    
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
    
    // Asset inlining threshold
    assetsInlineLimit: 4096
  },
  
  // CSS optimization
  css: {
    devSourcemap: mode === 'development',
  },
  
  // Performance optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'framer-motion',
      'lucide-react'
    ]
  },
  
  // Simplified esbuild configuration
  esbuild: {
    target: 'es2020',
    legalComments: 'none',
    minifyIdentifiers: mode === 'production',
    minifySyntax: mode === 'production',
    drop: mode === 'production' ? ['console', 'debugger'] : []
  }
}));
