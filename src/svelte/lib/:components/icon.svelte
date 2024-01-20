<script>
  import { createEventDispatcher } from 'svelte'

  /**
   * @type {string}
   */
  export let path
  export let size = '1.6rem'
  export let color_inner = 'currentColor'
  export let color_outer = 'none'
  export let seethrough = false
  /**
   * Hint the icon is interactive and enable the `activate` event.
   */
  export let interactive = false
  const emit = createEventDispatcher()
</script>

{#if interactive}
  <div class="grid items-center">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <span
      class="
      text-center
      cursor-pointer
      rounded-full
      hover:bg-base-300
      hover:bg-opacity-50
      transition-all
      p-4
      "
      on:mouseup={function run() {
        emit('activate')
      }}
    >
      <svg
        class:opacity-50={seethrough}
        xmlns="http://www.w3.org/2000/svg"
        style="width:{size};height:{size}"
        fill={color_inner}
        viewBox="0 0 24 24"
        stroke={color_outer}
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          d={path}
        /></svg
      >
    </span>
  </div>
{:else}
  <svg
    class:opacity-50={seethrough}
    xmlns="http://www.w3.org/2000/svg"
    style="width:{size};height:{size}"
    fill={color_inner}
    viewBox="0 0 24 24"
    stroke={color_outer}
    ><path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1"
      d={path}
    /></svg
  >
{/if}
