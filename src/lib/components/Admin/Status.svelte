<script>
  // Utilities
  import { statusOptions } from "$lib/utils/validation/options";

	// Export props
  let { status } = $props()

  // Setup component state
  let currentStatus = $state(statusOptions[0])

  // Match value in object
  // TODO: Check if this already exists in utilities or move it there.
  function matchProps(arr, val) {
    const res = arr.filter(item => item?.value === val)

    if (res.length > 0) {
      return res[0]
    } else {
      return arr[0]
    }
  }

  // Keeps current status in-sync with the status style options
  $effect(()=>{
    currentStatus = matchProps(statusOptions, status)
  });

</script>

<!-- Container -->
<div class="w-fit px-3 py-2 leading-none rounded-full {currentStatus?.bg} {currentStatus?.color} flex items-center justify-center gap-2">
  <!-- Dot indicator (decoration) -->
  <div class="rounded-full size-2 {currentStatus?.indicator}"></div>
  <!-- Fill status label -->
  <p>{currentStatus?.label}</p>
</div>
