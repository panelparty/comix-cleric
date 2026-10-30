<script>
  // Utilities
  import { renderMarkdown } from "$lib/utils/sanitize/output.js";
  import { fallback } from "$lib/utils/utils.js";

  // Components
  import Tag from "$lib/components/DataBlocks/Tag.svelte";
  import Loader from "$lib/components/Placeholders/Loader.svelte";
  import StatusNotice from "$lib/components/Alerts/StatusNotice.svelte";
  import Image from "$lib/components/Media/Image.svelte";
  import Section from "$lib/components/DataBlocks/Section.svelte";
  import EditLink from "$lib/components/Admin/EditLink.svelte";
  import PostTitle from "$lib/components/DataBlocks/PostTitle.svelte";
  import PostDate from "$lib/components/DataBlocks/PostDate.svelte";
  import PostAttribution from "$lib/components/DataBlocks/PostAttribution.svelte";
  import PostDescription from "$lib/components/DataBlocks/PostDescription.svelte";
  import PostShare from "$lib/components/DataBlocks/PostShare.svelte";
  import PostTags from "$lib/components/DataBlocks/PostTags.svelte";
  import ProseContainer from "$lib/components/DataBlocks/ProseContainer.svelte";
  import PostContributors from "$lib/components/DataBlocks/PostContributors.svelte";

  // Props
  let { data } = $props();

  // Destructure data
  let cast = $derived(data?.cast);
  let contributors = $derived(data?.contributors);

  // Spoiler toggle state
  let showSpoilers = $state(false);
  function toggleSpoilers() {
    showSpoilers = !showSpoilers
  };

  // Tags
  let tags = [];
</script>

<!-- If we have cast -->
{#if cast}
<Section class="cast-section" wrapperWidth="var(--container-3xl)">
  <!-- Draft/Archived notice -->
  <StatusNotice
    {data}
    status={cast?.status}
  />

  <!-- Admin-only edit button -->
  <EditLink {data} type="cast" id={cast?.id} />

  <!-- Post title -->
  <PostTitle data={cast} collection="update" showType />

  <!-- Cast page details -->
  <div class="cast-details">
    <!-- Character profile image -->
    <Image
      src="/api/media/{cast?.cover?.filename_disk}"
      alt={fallback(cast?.cover?.description, "No description provided.")}
      wrapperClasses="cast-image-container"
      class="cast-image"
    />

    <!-- Character details -->
    <!-- TODO: Make this list editable with drag-n-drop groups and visibility toggles. -->
    <ul class="cast-attribute-list">
      <!-- Nickname (if provided) -->
      {#if cast?.nickname}
      <li class="cast-attribute-item">
        <h6 class="label cast-attribute-label">Nickname:</h6>
        <p class="cast-attribute-body">{cast?.nickname}</p>
      </li>
      {/if}
      <!-- Pronouns (if provided) -->
      {#if cast?.pronouns}
      <li class="cast-attribute-item">
        <h6 class="label cast-attribute-label">Pronouns:</h6>
        <p class="cast-attribute-body">{cast?.pronouns}</p>
      </li>
      {/if}
      <!-- Age (if provided) -->
      {#if cast?.age}
      <li class="cast-attribute-item">
        <h6 class="label cast-attribute-label">Age:</h6>
        <p class="cast-attribute-body">{cast?.age}</p>
      </li>
      {/if}
      <!-- Height (if provided) -->
      {#if cast?.height}
      <li class="cast-attribute-item">
        <h6 class="label cast-attribute-label">Height:</h6>
        <p class="cast-attribute-body">{cast?.height}</p>
      </li>
      {/if}
      <!-- Weight (if provided) -->
      {#if cast?.weight}
      <li class="cast-attribute-item">
        <h6 class="label cast-attribute-label">Weight:</h6>
        <p class="cast-attribute-body">{cast?.weight}</p>
      </li>
      {/if}
      <!-- Quotes (if provided) -->
      <!-- TODO: Allow a list of quotes to display or cycle through -->
      {#if cast?.quote}
      <li class="cast-attribute-item">
        <h6 class="label cast-attribute-label">Quote:</h6>
        <p class="cast-attribute-body">{cast?.quote}</p>
      </li>
      {/if}
    </ul>
  </div>

  <!-- TODO: Include these in the drag-n-drop group and visibility toggles. -->
  <!-- Physical Description (if provided) -->
  {#if cast?.appearance}
  <aside class="w-full px-4 py-2 flex flex-col gap-1 border border-surface-100-900 rounded-md">
    <h6 class="label">Appearance:</h6>
    <div clas="prose-override">
      {@html renderMarkdown(cast?.appearance)?.html}
    </div>
  </aside>
  {/if}

  <!-- Bio (if provided) -->
  {#if cast?.bio}
  <aside class="w-full px-4 py-2 flex flex-col gap-1 preset-filled-surface-100-900 rounded-md">
    <h6 class="label">Bio:</h6>
    <ProseContainer data={cast?.bio} />
  </aside>
  {/if}

  <!-- Post Share -->
  <PostShare data={cast} />

  <!-- Contributor info -->
  <PostContributors {contributors} />

  <!-- Author info -->
  <PostAttribution data={cast} />

  <!-- Post Dates -->
  <PostDate data={cast} updated />

  <!-- Post description -->
  <PostDescription data={cast?.description} />

  <!-- If this post has tags, display them -->
  {#if cast?.tags}
    <!-- Post Tags -->
    <PostTags data={tags} />
  {/if}
</Section>

{#if cast?.sheet?.filename_disk}
<Section title="Reference Sheet" class="cast-reference-container" wrapperWidth="var(--container-5xl)">
  <Image
    src="/api/media/{cast?.sheet?.filename_disk}"
    alt={cast?.sheet?.description ?? "No description provided."}
    wrapperClasses="preset-filled-surface-100-900 rounded-lg overflow-hidden flex items-center"
    class="min-w-full min-h-full object-cover"
  />
</Section>
{/if}
{:else}
<!-- Cast not found -->
<!-- Display loader until redirect -->
<Loader />
{/if}

<style>
  :global(.cast-section) {
    width: 100%;
    max-width: var(--container-5xl);
    margin: 0 auto;
    padding: calc(var(--spacing) * 4);
    background: var(--color-surface-50-950);
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: calc(var(--spacing) * 4);
  }

  .cast-header {
    display: flex;
    flex-direction: column;
  }

  .cast-type {
    width: 100%;
    line-height: 1;
    text-transform: uppercase;
    font-weight: 500;
    color: var(--color-primary-700-300);
  }

  .cast-heading {
    width: 100%;
    font-weight: 900;
    line-height: var(--leading-tight);
    text-align: left;
    text-wrap: pretty;
  }

  .cast-details {
    display: grid;
    grid-template-rows: auto max-content;
    gap: calc(var(--spacing) * 4);

    @media (width >= 48rem) {
      grid-template-rows: repeat(1, minmax(0, 1fr));
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: calc(var(--spacing) * 4);
    }
  }

  :global(.cast-image-container) {
    background: var(--color-surface-100-900);
    color: var(--color-surface-contrast-100-900);
    border-radius: var(--radius-lg);
    aspect-ratio: 1;
    overflow: hidden;
    display: flex;
    align-items: center;
  }

  :global(.cast-image) {
    min-width: 100%;
    min-height: 100%;
    object-fit: cover;
  }

  .cast-attribute-list {
    padding-inline: calc(var(--spacing) * 4);
    border-left-width: var(--default-border-width);
    border-color: var(--color-surface-200-800);
  }
  
  .cast-attribute-item {
    padding-bottom: calc(var(--spacing) * 2);
    margin-bottom: calc(var(--spacing) * 2);
    border-bottom-width: var(--default-border-width);
    border-color: var(--color-surface-200-800);
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 2);

    & * {
      line-height: 1;
    }
  }

  .cast-attribute-label {
    font-size: var(--text-sm);
  }

  .cast-attribute-body {
    font-size: var(--text-lg);
    font-weight: 700;
    color: var(--color-primary-500);
  }


  :global(.cast-reference-container) {
    max-width: var(--container-5xl);
  }
</style>