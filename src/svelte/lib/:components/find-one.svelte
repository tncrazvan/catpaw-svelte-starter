<script>
  import { find_one } from ':scripts/remote_todos'
  /**
   * @type {string}
   */
  export let id
</script>

{#await find_one({ id }) then [todo, error]}
  {#if error}
    {error.message}
  {:else}
    <slot using={{ todo }} />
  {/if}
{/await}
