import { writable } from 'svelte/store'

export const store_previous_pathname = writable(location.pathname)
