<!--
  @component

  Invoke `callback`.

  > **Note**\
  > Result of `callback` will be available in `let:using={{result}}`.
-->

<script>
  import Loading from ':components/loading.svelte'

  /**
   * @type {function():any}
   */
  export let callback
  const possible_promise = callback()
</script>

{#await possible_promise}
  <Loading />
{:then result}
  <slot using={{ result }} />
{/await}
