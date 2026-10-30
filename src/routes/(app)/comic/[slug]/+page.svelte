<script>
  // Utility imports
  import { getYear } from '$lib/utils/date.js'

  // Component imports
  import Reader from "$lib/components/Reader/Reader.svelte";
  import Tag from "$lib/components/DataBlocks/Tag.svelte";
  import PostDescription from "$lib/components/DataBlocks/PostDescription.svelte";
  import Transcript from '$lib/components/DataBlocks/Transcript.svelte';
  import Section from "$lib/components/DataBlocks/Section.svelte";
  import PageMeta from "$lib/components/Meta/PageMeta.svelte";
  import StatusNotice from "$lib/components/Alerts/StatusNotice.svelte";
  import EditLink from "$lib/components/Admin/EditLink.svelte";
  import NotFound from '$lib/components/Placeholders/NotFound.svelte';
  import RatingNotice from '$lib/components/Alerts/RatingNotice.svelte';
  import PostTitle from '$lib/components/DataBlocks/PostTitle.svelte';
  import PostDate from '$lib/components/DataBlocks/PostDate.svelte';
  import PostAttribution from '$lib/components/DataBlocks/PostAttribution.svelte';
  import PostShare from '$lib/components/DataBlocks/PostShare.svelte';
  import PostTags from '$lib/components/DataBlocks/PostTags.svelte';
  import PostContributors from '$lib/components/DataBlocks/PostContributors.svelte';

  // Props
  let { data } = $props()

  // Destructure data
  let update = $derived(data?.update ?? {});
  let firstUpdate = $derived(data?.firstUpdate ?? {});
  let prevUpdate = $derived(data?.prevUpdate ?? {});
  let nextUpdate = $derived(data?.nextUpdate ?? {});
  let lastUpdate = $derived(data?.lastUpdate ?? {});
  let contributors = $derived(data?.contributors);

  let tags = [
    {
      label: update?.volume?.name,
      href: `/archive/volumes/${update?.volume?.slug}`,
    },
    {
      label: update?.chapter?.name,
      href: `/archive/volumes/${update?.chapter?.slug}`,
    },
    {
      label: getYear(update?.date_published),
      href: `/archive/years/${getYear(update?.date_published)}`,
    },
  ];
</script>

<!-- If the page content actually exists -->
{#if update}
<!-- Injected into page <head> element -->
<PageMeta {data} type="update" />

<!-- Media rating -->
{#if update?.warning_popup}
<RatingNotice title="Warning!" content={update?.warning_message} />
{/if}

<!-- Draft/Archived notice for admin -->
{#if update?.status != "published"}
<Section width="var(--container-3xl)">
  <StatusNotice
    {data}
    status={update?.status}
  />
</Section>
{/if}

<!-- Reader component -->
<Reader
  data={update}
  media={update?.featured_media}
  {firstUpdate}
  {prevUpdate}
  currentUpdate={update}
  {nextUpdate}
  {lastUpdate}
  format_strip={update?.format_strip ?? data?.settings?.format_strip ?? false}
  readerWidth={data?.settings?.reader_width ?? "var(--container-5xl)"}
  maxHeight={data?.settings?.reader_height ?? "var(--container-5xl)"}
/>

<!-- Update details -->
<Section width="var(--container-3xl)">
  <!-- Transcript (if provided) -->
  {#if update?.transcript && update?.transcript != ''}
    <!-- Transcript component -->
    <Transcript data={update} />
  {/if}
  
  <!-- If user is an admin, show edit link -->
  <EditLink {data} type="updates" id={update?.id} />

  <!-- Post Share -->
  <PostShare data={update} origin={data?.origin} />

  <!-- Post title -->
  <PostTitle data={update} collection="update" showType />

  <!-- Post Dates -->
  <PostDate data={update} updated />

  <!-- Contributor info -->
  <PostContributors {contributors} />

  <!-- Author info -->
  <PostAttribution data={update} />

  <!-- Post description -->
  <PostDescription data={update?.description ?? ''} />

  <!-- Post Tags -->
  <PostTags data={tags} />
</Section>

<!-- Page not found -->
{:else}
<NotFound />
{/if}

