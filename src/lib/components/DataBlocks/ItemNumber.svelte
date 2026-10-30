<script>
  // Utilities
  import { isNumber } from "lodash-es";

  // Props
  let {
    class: className,
    number,
    pad,
    padSize = -1,
    itemCount,
    padString = "0",
    prefix = '#',
    prefixClasses,
    numberClasses,
    ...restProps
  } = $props();

  // Formatted number
  let formattedNumber = $derived.by(()=>{
    // "number" must be a string for padStart() to work.
    let numStr = isNumber(number) ? String(number) : number;

    // Auto-pad based on array size
    if (pad && padSize === -1 && itemCount) {
      let size = String(itemCount)?.length ?? 1;
      numStr = numStr.padStart(size, padString);
    }

    // Manual padding
    if (pad && padSize > 0) {
      numStr = numStr.padStart(padSize, padString);
    }

    // Return padded or unpadded number
    return numStr;
  });
</script>

<!-- Item number element -->
<h6 class="title post-number {className}" {...restProps}>
  <!-- Prefix span -->
  {#if prefix}<span class={prefixClasses}>{prefix}</span>{/if}

  <!-- Number (with optional padding) -->
  <span class={numberClasses}>{formattedNumber}</span>
</h6>

<style>
  .post-number {
    width: 5ch;
  }
</style>
