<script>
  // Props
  let {
    formElement,
    save
  } = $props();

  // Keyboard event handler
	function handleKeydown(event) {
    // Save
    if (save && (event.ctrlKey && event.key === 's')) {
      event.preventDefault();
      formElement.requestSubmit();
    }

    // TODO: More keyboard nav controls
    // Publish
    // Archive
    // Draft
    // etc.
  }
</script>

<!-- Creates a key-down (pressed) event listener to trigger `handleKeydown` -->
<svelte:window onkeydown={handleKeydown} />