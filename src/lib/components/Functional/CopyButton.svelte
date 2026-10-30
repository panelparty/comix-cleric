<script>
  // Utilities
  import { sleep } from "$lib/utils/delay";
  import { toastError, toastSuccess } from "$lib/utils/toast";

  // Props
  let {
    label = "Copied!",
    children,
    class: className,
    value,
    ariaLabel,
    ...restProps
  } = $props();

  // Component state
  let copied = $state(false);

  // Copy functionality
  function copyFromInput(text) {
    navigator.clipboard.writeText(text)
      .then(async () => {
        copied = true
        toastSuccess("Copied!")
        await sleep(1000)
        copied = false
      })
      .catch(err => toastError('Failed to copy:', err));
  }
</script>

<!-- Copy button -->
<button
  class={className}
  onclick={(e)=>{e.preventDefault(); copyFromInput(value)}} aria-label={copied ? "Copied!" : ariaLabel}
  {...restProps}
>
  {#if copied}
    <i class="ph-bold ph-check"></i> {label}
  {:else}
    {@render children()}
  {/if}
</button>
