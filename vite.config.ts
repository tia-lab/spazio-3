import typescript from '@rollup/plugin-typescript'
import path, { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { PluginOption, defineConfig } from 'vite'
import { chunkSplitPlugin } from 'vite-plugin-chunk-split'
import { compression } from 'vite-plugin-compression2'

/// <reference types="vitest" />

const root = resolve(__dirname, 'src')
const outDir = resolve(__dirname, 'dist')

module.exports = defineConfig({
  // Define environment variable
  define: {
    __APP_ENV__: process.env.VITE_VERCEL_ENV,
  },
  root: './src',
  base: './',
  envDir: '../',
  build: {
    assetsDir: '',
    outDir,
    manifest: true,
    emptyOutDir: true,
    sourcemap: true,

    rollupOptions: {
      plugins: [
        typescript(), // Use TypeScript plugin for Rollup
        visualizer({ filename: './dist/analyze.html' }) as PluginOption, // Generate bundle analysis report
        chunkSplitPlugin(), // Split chunks for better caching
        compression(), // Apply compression to generated assets
      ],
      input: {
        init: path.resolve(root, '/init.ts'), // Entry point for 'init' module
        main: path.resolve(root, '/main.ts'), // Entry point for 'main' module
      },
      output: {
        noConflict: true,
        entryFileNames: `[name].js`, // Output file name for entry points
        chunkFileNames: `[name].js`, // Output file name for chunks
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
            return 'images/[name][extname]' // Output file name for images
          }

          if (/\.css$/.test(name ?? '')) {
            return 'css/[name][extname]' // Output file name for CSS files
          }

          return '[name].[extname]' // Output file name for other assets
        },
      },
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') }, // Alias for the 'src' directory
      { find: '$', replacement: path.resolve(__dirname) }, // Alias for the root directory
      {
        find: '@gsap',
        replacement: path.resolve(__dirname, 'src/animations/gsap'), // Alias for the 'gsap' directory
      },
    ],
  },

  server: {
    open: '/index.html', // Open 'index.html' in the browser on server start
    host: true,
    cors: true,
    hmr: {
      host: 'localhost',
      protocol: 'ws',
    },
  },
})
