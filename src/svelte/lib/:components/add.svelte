<script>
  import { add } from ':scripts/remote_todos'
  /**
   * @type {string}
   */
  export let description
</script>

{#await add({ description }) then [todo, error]}
  {#if error}
    {error.message}
  {:else}
    <slot using={{ todo }} />
  {/if}
{/await}
