<script>

  // Utility imports
  import { renderMarkdown } from "$lib/utils/sanitize/output";

  // Skeleton UI component imports
  import { Accordion } from "@skeletonlabs/skeleton-svelte";

  // Export props
  let { data, class: className, controlClasses, panelClasses, ...restProps } = $props();

  // Setup accordion state
  let openPanels = $state([]);

</script>

<!-- Component container -->
<section class="max-w-prose mx-auto px-4 {className}">
  <!-- Accordion component (Skeleton UI) -->
  <Accordion {openPanels} onValueChange={(e) => (openPanels = e.value)} collapsible>
    <Accordion.Item
      controlClasses="py-1! text-base font-normal preset-filled-surface-200-800 hover:preset-filled-surface-100-900! {openPanels[0] === 'transcript' ? 'rounded-t-md rounded-b-none!' : ''}"
      panelClasses="preset-filled-surface-100-900 rounded-b-md border-t border-surface-200-800"
      value="transcript"
    >
      <!-- Trigger -->
      {#snippet control()}Transcript{/snippet}
      <!-- Contents -->
      {#snippet panel()}
        <!-- Prose formatting wrapper -->
        <div class="prose-override">
          <!-- Safely render markdown -->
          {@html renderMarkdown(data?.transcript)?.html}
        </div>
      {/snippet}
    </Accordion.Item>
  </Accordion>
</section>
