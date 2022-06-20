<script lang="ts">
  import axios from 'axios'
  import { setup } from '../lazy'
  import type { SvelteComponent } from 'svelte'
  import { Route } from 'svelte-routing'
  import { get, writable, type Writable } from 'svelte/store'
  export let path: string
  export let component: undefined | typeof SvelteComponent = undefined

  function isStore(target: any) {
    if (!(target.subscribe ?? false)) return false
    if (typeof target.subscribe === 'function') {
      return true
    }
    return false
  }

  function isObject(value: any) {
    return typeof value === 'object' && !Array.isArray(value) && value !== null
  }

  function isLazy(value: any): false | string {
    if (isObject(value)) {
      const keys = Object.keys(value)
      if (1 === keys.length && keys[0].startsWith('__lazy;')) {
        return keys[0].substring(7)
      }
    }
    return false
  }

  let cache: Record<string, any> = {}

  async function unwrap(data: any): Promise<{
    lazyid: false | string
    computed: any
    plain: any
  }> {
    const lazyid = isLazy(data)

    if (lazyid) {
      const lazykey = `__lazy;${lazyid}`
      if (cache[lazykey] ?? false) {
        return cache[lazykey]
      }
      const path = data[lazykey]
      const response = await axios(path)
      $setup[lazykey] = writable(response.data[lazykey])

      let firstPass = true
      $setup[lazykey].subscribe(async value => {
        if (firstPass) {
          firstPass = false
          return
        }
        const tmp:Record<string, any> = {}
        tmp[lazykey] = value
        await axios.put(`/:lazy:${lazyid}${location.search}`, tmp, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
      })

      cache[lazykey] = { lazyid, computed: writable(data), plain: data }
      return cache[lazykey]
    }

    if (isStore(data)) return unwrap(get(data))

    if (!isObject(data)) return { lazyid: false, computed: data, plain: data }

    const computedState: Record<string, any> = {}
    const plainState: Record<string, any> = {}
    for (const key in data) {
      const element = data[key]
      let { computed, plain } = await unwrap(element)
      computedState[key] = computed
      if (isStore(plain)) {
        plain = get(plain)
      }

      plainState[key] = plain
    }

    return { lazyid: false, computed: computedState, plain: plainState }
  }

  async function register(data: any): Promise<Writable<any>> {
    const { computed } = await unwrap(data)
    const store = writable(computed)
    store.subscribe(async function (v) {
      const { lazyid, plain } = await unwrap(v)
      if (lazyid) {
        return
      }
      await axios.put(`${location.pathname}:state${location.search}`, plain, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    })
    return store
  }
</script>

<Route {path} let:params let:location>
  {#await axios.get(`${location.pathname}:state${location.search}`)}
    <slot name="loading" {params} {location} />
  {:then response}
    {#await register(response.data)}
      <slot name="loading" {params} {location} />
    {:then state}
      <slot name="state" {params} {location} {state}>
        <svelte:component this={component} {location} {...params} {state} />
      </slot>
    {:catch error}
      <slot name="error" {location} {error} />
    {/await}
  {:catch error}
    <slot name="error" {location} {error}>
      {error}
    </slot>
  {/await}
</Route>
