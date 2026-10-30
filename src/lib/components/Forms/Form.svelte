<script>

  import { enhance } from "$app/forms";

  let {
    onSubmit = () => {},
    element = $bindable(),
    class: className,
    children,
    controls,
    ...restProps
  } = $props();

</script>

<form
  use:enhance={onSubmit}
  bind:this={element}
  class="relative w-full h-full grid grid-rows-[auto_min-content] overflow-y-auto"
  {...restProps}
>

  <div class="w-full max-w-5xl p-4 border border-surface-200-800 space-y-4 card rounded-xl {className}">
    {@render children?.()}
  </div>

  {#if controls}
  <div class="bg-inherit md:items-center md:justify-between pt-2 sm:pt-4 gap-2 xl:gap-4 grid grid-rows-[auto_auto] md:flex md:flex-row-reverse">
    {@render controls?.()}
  </div>
  {/if}

</form>
