<script>
  // Svelte utilities
  import { goto } from "$app/navigation";

  // Props
  let {
    data,
    class: className,
    btnClasses
  } = $props();

  // Setup number input
  let pageNum = $state(null);

  // Keypress handler
  function handleKey(e) {
    // If the key pressed was "Enter" and the input has a value
    if (e.key === "Enter" && pageNum != null) {
      // Go to the redirect link with the value
      goto(`/rd/${pageNum}`);
      // Set the value back to null
      pageNum = null;
    }
  }

  // Click handler
  function handleClick() {
    // If the input has a value
    if (pageNum != null) {
      // Go to the redirect link with the value
      goto(`/${data?.settings?.locator_url ?? 'rd'}/${pageNum}`);
      // Set the value back to null
      pageNum = null;
    }
  }
</script>

<!-- Input group -->
<div class="jump-to-page-container input-group {className}">
  <!-- Input (number) -->
  <input
    type="number"
    name="page"
    id=""
    class="ig-input jump-to-page-input"
    placeholder="0"
    bind:value={pageNum}
    onkeydown={(e)=>{handleKey(e)}}
  >
  <!-- Submit button -->
  <button
    class="button jump-to-page-button {btnClasses}"
    onclick={()=>{handleClick()}}
  >Jump to page</button>
</div>

<style>
  .jump-to-page-container {
    display: grid;
    grid-template-columns: auto min-content;
  }

  .jump-to-page-input {
    max-width: calc(var(--spacing) * 24);
  }

  .jump-to-page-button {
    background: var(--color-surface-500);
    color: var(--color-surface-contrast-500);
    font-size: var(--text-sm);
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;

    &:hover {
      background: var(--color-surface-300-700);
      color: var(--color-surface-contrast-300-700);
    }
  }
</style>