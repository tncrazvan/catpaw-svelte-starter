<script>
  import { toggle } from ':scripts/remote_todos'
  /**
   * @type {string}
   */
  export let id
</script>

{#await toggle({ id }) then [todo, error]}
  {#if error}
    {error.message}
  {:else}
    <slot using={{ todo }} />
  {/if}
{/await}
