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

      '@components': `${path.resolve(dir, 'src/svelte/@components.ts')}`,
      '@pages': `${path.resolve(dir, 'src/svelte/@pages.ts')}`,
      '@types': `${path.resolve(dir, 'src/svelte/@types.d.ts')}`,
      '@scripts': `${path.resolve(dir, 'src/svelte/@scripts.ts')}`,
      '@assets': `${path.resolve(dir, 'src/svelte/@assets.ts')}`,
      '@stores': `${path.resolve(dir, 'src/svelte/@stores.ts')}`,
      '@constants': `${path.resolve(dir, 'src/svelte/@constants.ts')}`,
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
      '^.*:state': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: false,
        secure: false,
        ws: true,
      },
    },
  },
})
