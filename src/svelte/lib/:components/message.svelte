<script>
  import { store_layout } from ':stores/store_layout'
  import { message } from ':stores/store_message'
  import { fly } from 'svelte/transition'
  import Badge from ':components/badge.svelte'
  import Button from ':components/button.svelte'
  import Center from ':components/center.svelte'
  $: smaller = 'smaller' === $store_layout
  function close() {
    $message = false
  }
</script>

{#if $message}
  <div
    class="fixed bg-base-100 rounded-3xl p-4 z-30 right-4 bottom-4 border-opacity-30"
    class:w-80={!smaller}
    class:left-4={smaller}
    class:border-base-content={'base' === $message.variant}
    class:border-error={'error' === $message.variant}
    class:border-warning={'warning' === $message.variant}
    class:border-info={'information' === $message.variant}
    class:text-base-content={'base' === $message.variant}
    class:text-error={'error' === $message.variant}
    class:text-warning={'warning' === $message.variant}
    class:text-info={'information' === $message.variant}
    style="border-width: 1px;"
    in:fly={{ y: 300, duration: 300 }}
    out:fly={{ y: 100, duration: 300 }}
  >
    <div class="absolute -top-3 left-0 right-0 font-bold">
      <Center>
        <Badge
          variant={$message.variant}
          text={$message.variant.toUpperCase()}
        />
      </Center>
    </div>
    <div class="pt-2" />
    <span>{$message.text}</span>
    {#if $message.buttons.length > 0}
      <div class="pt-8" />
    {/if}
    <div class="flex flex-wrap gap-2 justify-center relative w-full">
      {#each $message.buttons as button}
        <Button
          variant={$message.variant}
          label={button.label}
          icon_path={button.icon_path}
          icon_position={button.icon_position}
          type="button"
          on:activate={function run() {
            button.action({ close })
          }}
          transparent
        />
      {/each}
    </div>
  </div>
{/if}
