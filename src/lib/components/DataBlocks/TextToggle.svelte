<script>
  // Utilities
  import { renderMarkdown } from "$lib/utils/sanitize/output";
  import ProseContainer from "./ProseContainer.svelte";

  // Props
  let {
    src = '',
    body = '',
    show = false,
    title = "Description",
    label = "Read",
    labelOpen = "Less",
    labelClosed = "More"
  } = $props();
</script>

<!-- TextToggle container -->
<div class="text-toggle-container">
  <p class="text-toggle-title">{title}</p>
  <ProseContainer data={src ?? body} class="text-toggle-body" data-show={show} />
  <button
    type="button"
    class="text-toggle-button"
    onclick={()=>{show = !show}}
  >
    {label} {show ? labelOpen : labelClosed}
    <i class="ph-bold ph-caret-{show ? 'up' : 'down'}"></i>
  </button>
</div>

<style>
  .text-toggle-container {
    height: fit-content;
    background-color: var(--color-surface-100-900);
    color: var(--color-surface-contrast-100-900);
    padding: calc(var(--spacing) * 4);
    border-radius: var(--radius-lg);
    transition: all var(--default-transition-duration) var(--default-transition-timing-function);
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 2);
  }
  
  .text-toggle-title {
    color: var(--color-surface-800-200);
    font-size: var(--text-sm);
    letter-spacing: var(--tracking-widest);
    font-weight: 500;
  }
  
  .text-toggle-button {
    display: inline-flex;
    align-items: center;
    gap: calc(var(--spacing) * 2);
    font-size: var(--text-sm);
    color: var(--color-secondary-500);
  }

  :global(.text-toggle-body[data-show="false"]) {
    overflow: hidden;
    line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
</style>