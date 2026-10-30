<script>

  // Utility imports
	import { sleep } from '$lib/utils/delay.js';
  import { Debounced } from "runed";

  // Skeleton UI component imports
  
// Export props
  let { collection, href } = $props();

  // Setup search states
  let isFocused = $state(false);
  let searchTerms = $state('');
  let results = $state([]);

  // Setup search options
  let title = $state(true);
  let slug = $state(true);
  let page_number = $state(true);
  let transcript = $state(true);
  let blurb = $state(true);
  let authors_note = $state(true);

  // Debound (delay) the search function to not overload the server
  const debouncedTerms = new Debounced(() => searchTerms, 500);

  // Fetches items based on provided parameters
  async function searchFetch() {
    // If a collection was provided, and the debounced search input exists
    if ((collection && collection != '') && (debouncedTerms.current && debouncedTerms.current != '' && debouncedTerms.current.length > 2)) {
      // Await search results from api search endpoint
      const response = await fetch(`/api/search?collection=${collection}&terms=${debouncedTerms.current}`);
      // Get the actual response data
      const result = await response?.json();

      // Pass the results
      results = result;
    } else {
      // Error (no results)
      results = [];
    }
  }

  // Keep search in-sync with new parameters
  $effect(async () => {
    searchFetch()
  });

  // Setup popover state
  let openState = $state(false);

  function popoverClose() {
    openState = false;
  }

</script>

<!-- Container -->
<div class="relative w-fit">
  <!-- Input group -->
  <div class="input-group grid grid-cols-[auto_min-content]">
    <!-- Search input -->
    <input
      type="text"
      name="search"
      id="search"
      class="ig-input w-full md:max-w-48"
      bind:value={searchTerms}
      onfocus={()=>{isFocused = true}}
      onblur={async ()=>{await sleep(250); isFocused = false}}
    >
    <!-- Clear search button -->
    <button aria-label="Clear search" class="ig-btn px-2 preset-filled-surface-500" onclick={searchTerms = ''} disabled={searchTerms === ''}><i class="ph-bold ph-x"></i></button>
    <!-- <Popover
      open={openState}
      onOpenChange={(e) => (openState = e.open)}
      positioning={{ placement: 'bottom' }}
      triggerBase="ig-btn w-full h-full px-2 preset-filled-surface-500"
      contentBase="card bg-surface-200-800 p-4 space-y-4 max-w-[320px]"
      arrow
      arrowBackground="!bg-surface-200 dark:!bg-surface-800"
    >
      {#snippet trigger()}<i class="ph-bold ph-gear-six"></i>{/snippet}
      {#snippet content()}
        <header class="flex justify-between">
          <p class="font-bold text-xl">Search Settings</p>
          <button class="btn-icon hover:preset-tonal" onclick={popoverClose} title="Close" aria-label="Close"><i class="ph-bold ph-x"></i></button>
        </header>
        <main class="space-y-2">
          <div class="flex items-center gap-2">
            <input type="checkbox" name="title" id="title" class="checkbox" bind:checked={title}>
            <label for="title" class="leading-none">Include Title</label>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" name="title" id="title" class="checkbox" bind:checked={slug}>
            <label for="title" class="leading-none">Include Slug</label>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" name="title" id="title" class="checkbox" bind:checked={page_number}>
            <label for="title" class="leading-none">Include Page Number</label>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" name="title" id="title" class="checkbox" bind:checked={transcript}>
            <label for="title" class="leading-none">Include Transcript</label>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" name="title" id="title" class="checkbox" bind:checked={blurb}>
            <label for="title" class="leading-none">Include Blurb</label>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" name="title" id="title" class="checkbox" bind:checked={authors_note}>
            <label for="title" class="leading-none">Include Creator's Note</label>
          </div>
        </main>
      {/snippet}
    </Popover> -->
  </div>
  <!-- Manual popover -->
  <!-- TODO: Use a proper popover. -->
  <div class="absolute z-50 left-0 w-full max-w-80 top-[calc(100%+1rem)] h-fit max-h-32 overflow-y-auto p-4 preset-filled-surface-500 {isFocused === true && results?.length > 0 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-all">
    <!-- Label -->
    <p>Search results ({results.length}):</p>
    <!-- Semantic HTML list -->
    <ul class="list-none!">
    {#each results as item, i}
      <li class="ml-0!">
        <!-- Link to search result -->
        <a href="{href}{item?.id}">{item?.page_number ? item?.page_number.toString().padStart(3, '0') : item?.page_type} - {item?.name}</a>
      </li>
    {/each}
    </ul>
  </div>
</div>
