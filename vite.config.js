import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'
import { fileURLToPath } from 'url'
const file = fileURLToPath(import.meta.url)
const dir = path.dirname(file).replace(/\\+/, '/')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      ':pages': `${path.resolve(dir, './src/svelte/lib/:pages')}`,
      ':components': `${path.resolve(dir, './src/svelte/lib/:components')}`,
      ':stores': `${path.resolve(dir, './src/svelte/lib/:stores')}`,
      ':scripts': `${path.resolve(dir, './src/svelte/lib/:scripts')}`,
      ':assets': `${path.resolve(dir, './:assets')}`,
      ':constants': `${path.resolve(dir, './src/svelte/lib/:constants.js')}`,
      ':types': `${path.resolve(dir, './src/svelte/lib/:types.js')}`,
      ':style': `${path.resolve(dir, './src/svelte/lib/:style.scss')}`
    },
  },
  optimizeDeps: {
    exclude: ['svelte-routing'],
  },
  build: {
    sourcemap: true,
    outDir: './www',
    minify: false,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  server: {
    https: false,
    host: '::',
    proxy: {
      '^/api(/.*)?': {
        target: 'http://127.0.0.1:5757',
        changeOrigin: false,
        secure: false,
        ws: true,
      },
    },
  },
})
