import daisyui from 'daisyui'

/** @type {import('daisyui').Config} */
export default {
  content: ['./src/svelte/**/*.{html,js,ts,svelte}'],
  plugins: [daisyui],
  daisyui: {
    themes: true,
  },
}
