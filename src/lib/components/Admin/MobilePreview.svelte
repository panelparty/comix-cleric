<script>

  // Svelte utility imports
  
// Utility imports
  
// Skeleton UI componet imports
  import { Modal } from "@skeletonlabs/skeleton-svelte";

  // Export props
  let {
    title,
    trigger,
    children,
    open,
    class: className
  } = $props()

  // Setup component states
  let loading = $state(false);

  // Closes component
  function closeModal() {
    open = false;
  };

</script>


<!-- Modal component (Skeleton UI) -->
<Modal
  {open}
  onOpenChange={(e) => (open = e.open)}
  triggerClasses="btn w-full preset-filled-surface-500 {className}"
  contentClasses="max-h-[calc(100dvh-2rem)] border border-surface-300-700 w-full shadow-xl shadow-surface-950/10 max-w-[calc(100vw-2rem)] bg-surface-50-950 p-4 rounded-lg"
  {trigger}
>
  <!-- Modal contents -->
  {#snippet content()}
    <!-- Wrapper -->
    <div class="w-full relative h-full max-h-[calc(100dvh-4rem)] grid grid-rows-[min-content_1fr]">
      <!-- Header -->
      <div class="mb-4 grid grid-cols-[auto_min-content]">
        <h5 class="h5 leading-none! text-center text-pretty">{title}</h5>
        <button type="button" class="btn btn-sm preset-filled-surface-500 text-base" onclick={()=>{closeModal()}}>Close</button>
      </div>
      <!-- Preview contents container -->
      <div class="h-full overflow-y-auto">
        <!-- Render any provided child elements -->
        {@render children?.()}
      </div>
    </div>
  {/snippet}
</Modal>


<!--
@component
## MobilePreview
Displays a pre-styled modal that will display its contents when triggered.

### Prop Definitions
- `title` - The title presented on the modal header. (String)
- `trigger` - A custom trigger element. (HTML element)
- `children` - Contents of the modal. (HTML elements)
- `open` - The current modal state. (Boolean)
- `class` - Custom classes passed to the modal trigger. (String)

@example
``` html
<MobilePreview
  title="Image Preview"
>
    <img src="/some/image.png" alt="Some image" class="block m-0">
</MobilePreview>
```
-->
