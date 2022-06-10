<script lang="ts">
import type { Writable } from "svelte/store";
  export let data: Writable<{
    clicks:number
  }>
</script>

<div class="grid justify-center text-center">
  <div class="mt-3"></div>
  <button class="btn" on:click={()=>{
    $data.clicks++
  }}>Click me</button>
  <h1>clicks: {$data.clicks}</h1>
</div>