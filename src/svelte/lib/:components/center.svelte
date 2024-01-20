<!--
  @component
  This component will take the shape of its parent container.\
  In order for this component to work properly and center its children, you should wrap it in another element or component like `<Fill></Fill>`.

-->
<style>
  .center {
    @apply relative;
    @apply grid;
    @apply w-full;
    @apply h-full;
  }
  .expand {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>

<script>
  export let expand = false
  /**
   * @type {"top"|"bottom"|"left"|"right"|"center"|"top-left"|"top-right"|"bottom-left"|"bottom-right"}
   */
  export let pull = 'center'
</script>

{#if 'center' === pull}
  <div class="center self-center content-center justify-center">
    <div class:expand class="wrapper self-center justify-self-center">
      <slot />
    </div>
  </div>
{:else if 'bottom' === pull}
  <div class="center content-end justify-center">
    <div class:expand class="wrapper self-end justify-self-center">
      <slot />
    </div>
  </div>
{:else if 'top' === pull}
  <div class="center content-start justify-center">
    <div class:expand class="wrapper self-start justify-self-center">
      <slot />
    </div>
  </div>
{:else if 'left' === pull}
  <div class="center content-center justify-start">
    <div class:expand class="wrapper self-center justify-self-start">
      <slot />
    </div>
  </div>
{:else if 'right' === pull}
  <div class="center content-center justify-end">
    <div class:expand class="wrapper self-center justify-self-end">
      <slot />
    </div>
  </div>
{:else if 'top-left' === pull}
  <div class="center content-start justify-start">
    <div class:expand class="wrapper self-start justify-self-start">
      <slot />
    </div>
  </div>
{:else if 'top-right' === pull}
  <div class="center content-start justify-end">
    <div class:expand class="wrapper self-start justify-self-end">
      <slot />
    </div>
  </div>
{:else if 'bottom-left' === pull}
  <div class="center content-end justify-start">
    <div class:expand class="wrapper self-ebd justify-self-start">
      <slot />
    </div>
  </div>
{:else if 'bottom-right' === pull}
  <div class="center content-end justify-end">
    <div class:expand class="wrapper self-ebd justify-self-end">
      <slot />
    </div>
  </div>
{/if}
