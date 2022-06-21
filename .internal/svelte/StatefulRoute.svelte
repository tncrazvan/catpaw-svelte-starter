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
      if (1 === keys.length && keys[0] === '!lazy') {
        return value[keys[0]]
      }
    }
    return false
  }

  let cache: Record<string, any> = {}

  async function unwrap(data: any): Promise<{
    lazyPath: false | string
    computed: any
    plain: any
  }> {
    const lazyPath = isLazy(data)

    if (lazyPath) {
      if (cache[lazyPath] ?? false) {
        return cache[lazyPath]
      }
      const response = await axios(lazyPath)
      $setup[lazyPath] = writable(response.data['!lazy'])

      let firstPass = true
      $setup[lazyPath].subscribe(async value => {
        if (firstPass) {
          firstPass = false
          return
        }
        await axios.put(`${lazyPath}${location.search}`, { '!lazy': value }, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
      })

      cache[lazyPath] = { lazyPath, computed: writable(data), plain: data }
      return cache[lazyPath]
    }

    if (isStore(data)) return unwrap(get(data))

    if (!isObject(data)) return { lazyPath: false, computed: data, plain: data }

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

    return { lazyPath: false, computed: computedState, plain: plainState }
  }

  async function register(data: any): Promise<Writable<any>> {
    const { computed } = await unwrap(data)
    const store = writable(computed)
    store.subscribe(async function (v) {
      const { lazyPath, plain } = await unwrap(v)
      if (lazyPath) {
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
