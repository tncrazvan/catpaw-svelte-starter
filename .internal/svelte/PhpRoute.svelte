<script lang="ts">
  import axios from 'axios'
  import type { SvelteComponent } from 'svelte'
  import { Route } from 'svelte-routing'
  import { writable, type Writable } from 'svelte/store'
  export let path: string
  export let component: undefined | typeof SvelteComponent = undefined

  function register(data:any):Writable<any>{
    const store = writable(data)
    store.subscribe(async function(value){
      await axios.put(`/api/pages${location.pathname}${location.search}`,value,{
        headers: {
          "Content-Type": "application/json"
        }
      })
    })
    return store
  }
</script>

<Route {path} let:params let:location>
  {#await axios.get(`/api/pages${location.pathname}${location.search}`)}
    <slot name="loading" {params} {location} />
  {:then response}
    <slot name="data" {params} {location} data={register(response.data)}>
      <svelte:component this={component} {location} {...params} data={register(response.data)} />
    </slot>
  {:catch error}
    <slot name="error" {location} {error}>
      {error}
    </slot>
  {/await}
</Route>
