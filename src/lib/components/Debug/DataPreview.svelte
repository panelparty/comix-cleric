<script>

  // Export props
  let { src, class: className } = $props();

  let open = $state(true);

</script>

<!-- Floating window -->
<div class="max-w-[35vw] p-2 text-sm absolute bottom-8 right-8 z-99 bg-surface-500 text-surface-950 grid grid-rows-[min-content_auto] {className}">
  <!-- Label -->
  <div class="flex items-center justify-between gap-2">
    <p class="font-bold leading-none">Data Preview:</p>
    <button type="button" class="btn-sm preset-filled-surface-300-700" onclick={()=>{open = !open}}>{open ? 'Close' : 'Open'}</button>
  </div>
  <!-- Data container -->
  <div class="{open ? 'max-h-[25dvh]' : 'h-0'} overflow-y-auto">
    <!-- Display input JSON/strings as formatted text -->
    <pre>{JSON.stringify(src, null, 2)}</pre>
  </div>
</div>
