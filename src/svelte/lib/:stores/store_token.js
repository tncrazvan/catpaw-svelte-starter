import { storable } from ':scripts/storable'

/**
 * @type {import('svelte/store').Writable<false|AccessToken>}
 */
export const store_token = storable({
  name: 'store_token',
  default_value: false,
})
