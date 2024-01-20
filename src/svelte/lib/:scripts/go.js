import { store_previous_pathname } from ':stores/store_previous_pathname'
import { navigate } from 'svelte-routing'

/**
 *
 * @param {string} pathname
 */
export function go(pathname) {
  store_previous_pathname.set(location.pathname)
  navigate(`${pathname}${location.hash}`)
}
