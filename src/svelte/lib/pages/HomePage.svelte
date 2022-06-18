<script lang="ts">
  import { lazy, type Lazy } from '@catpaw'
import { Icon } from '@components'  

  import { mdiDatabase } from '@mdi/js'

  import type { Writable } from 'svelte/store'
  export let state: Writable<{
    clicks: number
    message: Lazy<string>
  }>

  const message = lazy<string>($state.message)

  let localMessage = $message
</script>

<div class="grid justify-center self-center align-center text-center">
  <div class="mt-3" />
  <button
    class="btn"
    on:click={() => {
      $state.clicks++
    }}>Click me</button
  >

  <div class="pt-1" />
  <span class="gap-2">
    Clicks
    <div class="badge">+{$state.clicks}</div>
  </span>
  <div class="pt-1" />

  <div class="card w-96 bg-neutral text-neutral-content">
    <div class="card-body items-center text-center">
      <input
        type="text"
        placeholder="Type here"
        class="input input-bordered w-full max-w-xs"
        bind:value={localMessage}
      />
      <div class="card-actions justify-end">
        <button class="btn btn-primary" on:click={() => ($message = localMessage)}>
          <span>Save</span>
          <Icon path={mdiDatabase} />
        </button>
      </div>
    </div>
  </div>
</div>
