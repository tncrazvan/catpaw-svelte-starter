<script lang="ts">
  import type { Writable } from 'svelte/store'
  export let state: Writable<{
    clicks: number
  }>
</script>

<div class="grid justify-center text-center">
  <div class="mt-3" />
  <button
    class="btn"
    on:click={() => {
      $state.clicks++
    }}>Click me</button
  >
  <h1>clicks: {$state.clicks}</h1>
</div>
