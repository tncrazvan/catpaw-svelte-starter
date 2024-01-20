import { storable } from ':scripts/storable'

/**
 * A map of paths and the time when they've been requested through `GET` requests.
 * @type {import('svelte/store').Writable<Record<string, number>>}
 */
export const store_cache_touches = storable({
  name: 'touches',
  default_value: {},
})
