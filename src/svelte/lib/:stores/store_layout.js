import { derived } from 'svelte/store'
import { store_width } from './store_width'

/**
 * @type {import('svelte/store').Readable<Layout>}
 */
export const store_layout = derived(
  store_width,
  function start($store_width, set) {
    if ($store_width < 1280) {
      set('smaller')
    } else if ($store_width < 1450) {
      set('small')
    } else {
      set('large')
    }
  },
)
