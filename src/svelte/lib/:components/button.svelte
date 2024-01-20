<!--
  @component

  This is a button.

  It accepts a slot, which will be rendered **after** the button is activated.

  See slot property `let:using={{reset}}` for more details.
-->
<style>
  .btn-custom {
    @apply rounded-3xl;
    @apply w-full;
    transition: padding-left 200ms;
    display: grid;
    position: relative;
  }
  .btn-custom::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 0.5rem;
    scale: 0;
    transition: scale 200ms;
    @apply bg-base-content;
    @apply rounded-3xl;
  }
  .btn-custom:not(.disabled) {
    cursor: pointer;
  }
  .active {
    position: relative;
    padding-left: 1rem;
  }
  .active::after {
    scale: 1;
  }
  .disabled {
    @apply opacity-50;
    @apply cursor-not-allowed;
  }
  .at-least-this-wide {
    min-width: 100px;
  }
  .with-icon-left {
    grid-template-columns: auto 1fr;
  }
  .with-icon-right {
    grid-template-columns: auto 1fr;
  }
</style>

<script>
  import Icon from ':components/icon.svelte'
  import Invoke from ':components/invoke.svelte'
  import { createEventDispatcher, tick } from 'svelte'
  import { go } from ':scripts/go'
  export let href = ''
  export let label = ''
  export let small = false
  export let active = false
  export let stop_propagation = false
  /**
   * Use a transparent background and an outline when `type` is `button`.
   */
  export let outline = false
  /**
   * Use a transparent background when `type` is `button`.
   */
  export let transparent = true
  /**
   * @type {"left"|"right"}
   */
  export let icon_position = 'right'
  /**
   * Center the button's contents.
   */
  export let center = true
  /**
   * Svg path of the icon.
   *
   * This has effect only when `type` is `icon`.
   * @type {string}
   */
  export let icon_path = ''
  /**
   * @type {ButtonType}
   */
  export let type = 'button'

  export let disabled = false

  /**
   * @type {Variant}
   */
  export let variant = 'base'

  let slot_activated = false
  const emit = createEventDispatcher()

  function activate() {
    if (disabled) {
      return
    }
    slot_activated = true
    emit('activate')
  }

  function reset() {
    slot_activated = false
  }
</script>

{#if slot_activated}
  <slot
    using={{
      /**
       * When invoked, the button's slot will disappear, rendering instead the original contents of the button.
       *
       * > **Note**\
       * > This button can render custom contents (through its slot) **after** the button has been activated.\
       * > By calling this function these custom contents are ereased and the button will `reset` to its original state.
       */
      reset,
    }}
  >
    {#await tick() then _}
      <Invoke
        callback={function run() {
          slot_activated = false
        }}
      />
    {/await}
  </slot>
{:else}
  <span class="inline-grid rounded-3xl" class:justify-start={!center}>
    {#if href}
      <a
        class:text-xs={small}
        {href}
        class="btn-custom hover:underline justify-center self-center text-base-content"
        class:with-icon-left={icon_path && icon_position === 'left'}
        class:with-icon-right={icon_path && icon_position === 'right'}
        class:disabled
        class:active
        class:text-base-content={'base' === variant}
        class:text-info-content={'information' === variant}
        class:text-warning-content={'warning' === variant}
        class:text-error-content={'error' === variant}
        class:badge-success={'success' === variant}
        target="_blank"
        on:click={function run(e) {
          e.preventDefault()
        }}
        on:mouseup={function run(e) {
          if (stop_propagation) {
            e.stopPropagation()
          }
          if (disabled) {
            return
          }
          e.preventDefault()
          if (href.startsWith('http')) {
            window.open(href)
          } else {
            go(href)
          }
        }}
      >
        {#if icon_path && icon_position === 'left'}
          {#if icon_path}
            <Icon path={icon_path} />
          {/if}
          <span>{label}</span>
        {:else}
          <span>{label}</span>
          {#if icon_path}
            <Icon path={icon_path} />
          {/if}
        {/if}
      </a>
    {:else if 'button' === type}
      <button
        {disabled}
        class:active
        class="btn-custom btn btn-primary w-32 justify-center self-center with-icon at-least-this-wide"
        class:with-icon-left={icon_path && icon_position === 'left'}
        class:with-icon-right={icon_path && icon_position === 'right'}
        class:btn-outline={outline || transparent}
        class:text-xs={small}
        class:btn-base={'base' === variant}
        class:btn-info={'information' === variant}
        class:btn-warning={'warning' === variant}
        class:btn-error={'error' === variant}
        style={transparent && !outline ? 'border-width:0;' : ''}
        on:mouseup={function run(e) {
          if (stop_propagation) {
            e.stopPropagation()
          }
          activate()
        }}
      >
        {#if icon_path && icon_position === 'left'}
          {#if icon_path}
            <Icon path={icon_path} />
          {/if}
          <span class="justify-center self-center">{label}</span>
        {:else}
          <span class="justify-center self-center">{label}</span>
          {#if icon_path}
            <Icon path={icon_path} />
          {/if}
        {/if}
      </button>
    {:else if 'text' === type}
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <span
        class="btn-custom"
        class:active
        class:with-icon-left={icon_path && icon_position === 'left'}
        class:with-icon-right={icon_path && icon_position === 'right'}
        class:disabled
        class:text-xs={small}
        class:text-base-content={'base' === variant}
        class:text-info-content={'information' === variant}
        class:text-warning-content={'warning' === variant}
        class:text-error-content={'error' === variant}
        on:mouseup={function eun(e) {
          if (stop_propagation) {
            e.stopPropagation()
          }
          activate()
        }}
      >
        {#if icon_path && icon_position === 'left'}
          {#if icon_path}
            <Icon path={icon_path} />
          {/if}
          <span class="justify-center self-center">
            {label}
          </span>
        {:else}
          <span class="justify-center self-center">
            {label}
          </span>
          {#if icon_path}
            <Icon path={icon_path} />
          {/if}
        {/if}
      </span>
    {:else if 'link' === type}
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <span
        class="btn-custom hover:underline justify-center self-center text-base-content"
        class:with-icon-left={icon_path && icon_position === 'left'}
        class:with-icon-right={icon_path && icon_position === 'right'}
        class:disabled
        class:active
        class:with-icon={icon_path}
        class:text-xs={small}
        class:text-base-content={'base' === variant}
        class:text-info-content={'information' === variant}
        class:text-warning-content={'warning' === variant}
        class:text-error-content={'error' === variant}
        on:mouseup={function run(e) {
          if (stop_propagation) {
            e.stopPropagation()
          }
          activate()
        }}
      >
        {#if icon_path && icon_position === 'left'}
          {#if icon_path}
            <Icon path={icon_path} />
          {/if}
          <span>{label}</span>
        {:else}
          <span>{label}</span>
          {#if icon_path}
            <Icon path={icon_path} />
          {/if}
        {/if}
      </span>
    {/if}
  </span>
{/if}
