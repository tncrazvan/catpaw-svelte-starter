<script>
  import { find_all } from ':scripts/remote_todos'
</script>

{#await find_all() then [todos, error]}
  {#if error}
    {error.message}
  {:else}
    <slot using={{ todos }} />
  {/if}
{/await}
