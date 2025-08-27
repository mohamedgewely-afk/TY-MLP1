
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
      // Disable react-refresh in production builds
      devTarget: mode === 'development' ? 'es2020' : undefined,
    }),
    mode === 'development' && componentTagger(),
    
    // Bundle analyzer - generates stats.html in dist folder
    mode === 'production' && visualizer({
      filename: 'dist/stats.html',
      open: false, // Don't auto-open in CI
      gzipSize: true,
      brotliSize: true,
    }),
    
    // Brotli and Gzip compression for production
    mode === 'production' && compression({
      algorithms: ['brotli'],
      filename: '[path][base].br',
    }),
    mode === 'production' && compression({
      algorithms: ['gzip'],
      filename: '[path][base].gz',
    })
  ].filter(Boolean),
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  build: {
    // Enhanced build optimization
    target: mode === 'production' ? ['es2020', 'chrome80', 'firefox78', 'safari13'] : 'es2020',
    cssTarget: 'chrome80',
    
    rollupOptions: {
      output: {
        // Enhanced code splitting configuration
        manualChunks: (id) => {
          // Core React chunk
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          // UI library chunk
          if (id.includes('@radix-ui') || id.includes('framer-motion')) {
            return 'ui-vendor';
          }
          // Charts chunk
          if (id.includes('recharts')) {
            return 'charts-vendor';
          }
          // Query/routing chunk
          if (id.includes('@tanstack/react-query') || id.includes('react-router')) {
            return 'query-vendor';
          }
          // Heavy vehicle components
          if (id.includes('vehicle-details/VirtualShowroom') || 
              id.includes('vehicle-details/CarBuilder') ||
              id.includes('vehicle-details/EnhancedLifestyleGallery')) {
            return 'heavy-components';
          }
        },
        
        // Optimize chunk file names for caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? 
            chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '') || 'chunk' : 
            'chunk';
          return `assets/js/${facadeModuleId}-[hash].js`;
        },
        
        // Optimize asset file names for caching
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split('.').pop();
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif/i.test(extType || '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/woff2?|eot|ttf|otf/i.test(extType || '')) {
            return 'assets/fonts/[name]-[hash][extname]';
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
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      mangle: {
        safari10: true
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
    postcss: {
      plugins: mode === 'production' ? [
        require('autoprefixer'),
        require('cssnano')({
          preset: ['default', {
            discardComments: { removeAll: true },
            normalizeWhitespace: true,
            mergeLonghand: true,
            mergeRules: true
          }]
        })
      ] : []
    }
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
    ],
    exclude: ['@vite/client', '@vite/env']
  },
  
  // Experimental features for better performance
  esbuild: {
    target: mode === 'production' ? 'es2020' : 'esnext',
    legalComments: 'none',
    minifyIdentifiers: mode === 'production',
    minifySyntax: mode === 'production',
    drop: mode === 'production' ? ['console', 'debugger'] : []
  }
}));
