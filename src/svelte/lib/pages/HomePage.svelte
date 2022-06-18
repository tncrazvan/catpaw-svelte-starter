<script lang="ts">
import { lazy, type Lazy } from '@catpaw';

  import type { Writable } from 'svelte/store'
  export let state: Writable<{
    clicks: number,
    message: Lazy<string>
  }>

  const message = lazy<string>($state.message)

  let localMessage = $message
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

<input type="text" bind:value={localMessage}/>

<button
  class="btn"
  on:click={() => {
    $message = localMessage
  }}>update</button
>