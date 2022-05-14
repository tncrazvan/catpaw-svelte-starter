<script lang="ts">
  import axios from 'axios'
  import type { SvelteComponent } from 'svelte'
  import { Route } from 'svelte-routing'
  export let path: string
  export let component: undefined | typeof SvelteComponent = undefined
</script>

<Route {path} let:params let:location>
  {#await axios.get(`/api/pages${location.pathname}${location.search}`)}
    <slot name="loading" {params} {location} />
  {:then response}
    <slot name="data" {params} {location} data={response.data}>
      <svelte:component this={component} {location} {...params} data={response.data} />
    </slot>
  {:catch error}
    <slot name="error" {location} {error}>
      {error}
    </slot>
  {/await}
</Route>
