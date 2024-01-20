<script>
  import { find_all } from ':scripts/remote_todos'
  let promise = find_all()

  export async function reload(){
    const result = await find_all()
    promise = new Promise(function run(send){
      send(result)
    })
  }
</script>

{#await promise then [todos, error]}
  {#if error}
    {error.message}
  {:else}
    <slot using={{ todos, reload }} />
  {/if}
{/await}
