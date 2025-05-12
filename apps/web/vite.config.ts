import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    nodePolyfills({
      // Enable polyfill for node protocol imports like 'node:fs'
      protocolImports: true,
      globals: {
        Buffer: true, // Ensure Buffer is polyfilled
        global: true, // Ensure global is polyfilled
        process: true, // Ensure process is polyfilled
      },
    }),
  ],
  define: {
    // Provide a more comprehensive shim for the process object
    'process.env': process.env ?? {},
    'process.version': JSON.stringify(process.version ?? 'v18.0.0'), // Example version
    'process.platform': JSON.stringify(process.platform ?? 'browser'),
    'process.browser': true,
    global: 'globalThis',
  },
  // optimizeDeps: {
  //   include: ['@secure-tasks-mono/auth'],
  // },
  // build: {
  //   commonjsOptions: {
  //     transformMixedEsModules: true,
  //     include: [/node_modules/, /@secure-tasks-mono\/auth/]
  //   }
  // }
});
