<script>
  import FindAll from ':components/find-all.svelte'
  import { add, remove, toggle } from ':scripts/remote_todos'
  let description = ''
  let update = Date.now()
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
      await add({ description })
      description = ''
      update = Date.now()
    }}
  >
    <span>+ Add</span>
  </div>
</div>
<div class="pt-4" />

{#key update}
  <FindAll let:using={{ todos }}>
    {#each todos.data as todo}
      <div class="grid gap-2" style="grid-template-columns: auto 1fr auto">
        <div class="grid">
          <input
            id={todo.id}
            type="checkbox"
            checked={todo.checked}
            class="checkbox mt-2 rounded-full"
            on:change={function run() {
              toggle({ id: todo.id })
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
            on:mouseup={async function run() {
              await remove({ id: todo.id })
              update = Date.now()
            }}
          >
            <span class="p-2">Remove</span>
          </div>
        </div>
      </div>
      <div class="pt-4"></div>
    {/each}
  </FindAll>
{/key}
