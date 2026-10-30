<script>
  // Svelte utilities
  import { goto } from "$app/navigation";
  
  // Utilities
  import { kbdCommand } from "$lib/utils/kbdNav";
  
  // Props
  let {
    data,
    random,
    archive
  } = $props();

  // Handles keydown (key press) events
	function handleKeydown(event) {
    // Base path
    // TODO: Use a value from the server.
    let comicBasePath = "/comic/";

    // First update
    if (data?.firstUpdate?.slug != null) kbdCommand(event, 'ArrowLeft', () => {
      goto(comicBasePath + data?.firstUpdate?.slug);
    },
    {
      modifier: 'ctrl'
    });

    // Previous update
    if (data?.prevUpdate?.slug != null) kbdCommand(event, 'ArrowLeft', () => {
      goto(comicBasePath + data?.prevUpdate?.slug);
    });

    // Last update
    if (data?.lastUpdate?.slug != null) kbdCommand(event, 'ArrowRight', () => {
      goto(comicBasePath + data?.lastUpdate?.slug);
    },
    {
      modifier: 'ctrl'
    });

    // Next update
    if (data?.nextUpdate?.slug != null) kbdCommand(event, 'ArrowRight', () => {
      goto(comicBasePath + data?.nextUpdate?.slug);
    });

    // Archive
    if (archive) kbdCommand(event, 'r', () => {
      goto('/archive');
    },
    {
      modifier: 'ctrl'
    });

    // Random
    if (random) kbdCommand(event, 'r', () => {
      goto('/api/random');
    });
  }
</script>

<!-- Creates a keydown (pressed) event listener to trigger the `handleKeydown` function -->
<svelte:window onkeydown={handleKeydown} />