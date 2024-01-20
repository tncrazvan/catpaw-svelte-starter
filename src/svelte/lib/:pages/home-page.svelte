<script>
  import FindAll from ':components/find-all.svelte'
  import { add, remove, toggle } from ':scripts/remote_todos'
  let description = ''
  /**
   * @type {FindAll}
   */
  let find_all
</script>

<div class="grid w-96 gap-2" style="grid-template-columns: auto 1fr;">
  <input
    type="text"
    placeholder="Type here"
    class="input input-bordered w-96 max-w-xs rounded-3xl"
    bind:value={description}
  />
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="w-20 btn btn-ghost rounded-3xl"
    on:mouseup={async function run() {
      const [,error] = await add({ description })
      if(error || !find_all){
        return
      }
      description = ''
      find_all.reload()
    }}
  >
    <span>+ Add</span>
  </div>
</div>
<div class="pt-4" />

<FindAll bind:this={find_all} let:using={{ todos, reload }}>
  {#each todos.data as todo}
    <div class="grid gap-2" style="grid-template-columns: auto 1fr auto">
      <div class="grid">
        <input
          id={todo.id}
          type="checkbox"
          checked={todo.checked}
          class="checkbox mt-2 rounded-full"
          on:change={async function toggle_todo() {
            const [,error] = await toggle({ id: todo.id })
            if(error){
              todo.checked = !todo.checked
              return
            }
          }}
        />
      </div>

      <label for={todo.id}>
        <div class="grid">
          <div class="btn btn-ghost rounded-3xl grid justify-start">
            <span class="p-2">{todo.description}</span>
          </div>
        </div>
      </label>

      <div class="grid">
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          class="btn btn-error rounded-3xl grid justify-start"
          on:mouseup={async function remove_todo() {
            const [,error] = await remove({ id: todo.id })
            if(error){
              return
            }
            reload()
          }}
        >
          <span class="p-2">Remove</span>
        </div>
      </div>
    </div>
    <div class="pt-4"></div>
  {/each}
</FindAll>
