/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  
  // Server configuration
  server: {
    port: 3000,
    open: true,
    host: true, // Allows access from other devices on network
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Optimize for your app's dependencies
    rollupOptions: {
      output: {
        manualChunks: {
          // Split your chart libraries for better caching
          charts: ['chart.js', 'react-chartjs-2', 'chartjs-adapter-date-fns'],
          vendor: ['react', 'react-dom', 'react-router-dom'],
          utils: ['date-fns', 'dexie']
        }
      }
    }
  },
  
  // Path resolution (for your imports)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@styles': path.resolve(__dirname, './src/styles')
    }
  },
  
  // Environment variables configuration
  define: {
    // If you have any global constants
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  },
  
  // Vitest configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'clover', 'json'],
      exclude: [
        'node_modules/',
        'src/setupTests.ts',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/__tests__/**',
        '**/coverage/**'
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    }
  }
})