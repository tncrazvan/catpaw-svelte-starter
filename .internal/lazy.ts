import { type Writable, get, derived, writable } from 'svelte/store'

export type Lazy<T> = Writable<Record<string, T>>

export function lazy<T>(store: Lazy<T>) {
  const lazyPath = get(store)['!lazy'] as unknown as string
  return {
    ...derived($setup[lazyPath], value => {
      return value
    }),
    set: (value: T) => {
      $setup[lazyPath].set(value)
    },
  }
}

export const setup = writable<Record<string, Writable<any>>>({})

let $setup = {} as Record<string, Writable<any>>

setup.subscribe(v => ($setup = v))
