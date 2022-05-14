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
      '@catpaw': `${path.resolve(dir, '.internal/catpaw.ts')}`,

      '@components': `${path.resolve(dir, 'src/svelte/lib/components')}`,
      '@pages': `${path.resolve(dir, 'src/svelte/lib/pages')}`,
      '@types': `${path.resolve(dir, 'src/svelte/lib/types')}`,
      '@scripts': `${path.resolve(dir, 'src/svelte/lib/scripts')}`,
      '@assets': `${path.resolve(dir, 'src/svelte/assets')}`,

      '@stores': `${path.resolve(dir, 'src/svelte/lib/stores.ts')}`,
      '@constants': `${path.resolve(dir, 'src/svelte/lib/constants.ts')}`,
    },
  },
  optimizeDeps: {
    exclude: ['svelte-routing'],
  },
  build: {
    outDir: 'public',
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  server: {
    proxy: {
      '^/api/.*': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: false,
        secure: false,
        ws: true,
      },
    },
  },
})
