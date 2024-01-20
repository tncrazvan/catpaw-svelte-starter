<script>
  import { remove } from ':scripts/remote_todos'
  /**
   * @type {string}
   */
  export let id
</script>

{#await remove({ id }) then [ok, error]}
  {#if error}
    {error.message}
  {:else}
    <slot using={{ ok }} />
  {/if}
{/await}
