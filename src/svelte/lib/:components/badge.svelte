<style>
  .badge-super {
    padding: 0.7rem;
    grid-template-columns: auto 1fr;
    gap: 0.5rem;
  }

  .small {
    font-size: 0.7rem;
  }
  .smaller {
    font-size: 0.5rem;
  }
</style>

<script>
  import { mdiBug, mdiExclamation, mdiInformation } from '@mdi/js'
  import Icon from ':components/icon.svelte'

  /**
   * @type {string}
   */
  export let text

  /**
   * @type {string}
   */
  export let icon_path = ''

  /**
   * Make the badge small.
   *
   * > **Note**\
   * > `small` has priority over this.
   */
  export let small = false
  /**
   * Make the badge smaller.
   *
   * > **Note**\
   * > Has priority over `small`.
   */
  export let smaller = false

  /**
   * @type {Variant}
   */
  export let variant = 'base'

  let icon_size = '1.2rem'

  $: if (!smaller && small) {
    icon_size = `0.7rem`
  }

  $: if (smaller) {
    icon_size = `0.5rem`
  }
</script>

<div
  class="badge badge-super badge-outline bg-base-100"
  class:small
  class:smaller
  class:badge-base={'base' === variant}
  class:badge-error={'error' === variant}
  class:badge-warning={'warning' === variant}
  class:badge-info={'information' === variant}
  class:badge-success={'success' === variant}
>
  {#if icon_path}
    <Icon path={icon_path} size={icon_size} />
  {:else if 'base' === variant}
    <Icon path={mdiInformation} size={icon_size} />
  {:else if 'information' === variant}
    <Icon path={mdiInformation} size={icon_size} />
  {:else if 'warning' === variant}
    <Icon path={mdiExclamation} size={icon_size} />
  {:else if 'error' === variant}
    <Icon path={mdiBug} size={icon_size} />
  {/if}
  <span
    class:small
    class:smaller
    class:text-base={'base' === variant}
    class:text-error={'error' === variant}
    class:text-warning={'warning' === variant}
    class:text-info={'information' === variant}>{text}</span
  >
</div>
