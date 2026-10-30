<script>
  // Components
  import Loader from '$lib/components/Placeholders/Loader.svelte';
  import PostDescription from '$lib/components/DataBlocks/PostDescription.svelte';
  import StatusNotice from '$lib/components/Alerts/StatusNotice.svelte';
  import PageMeta from '$lib/components/Meta/PageMeta.svelte';
  import Carousel from '$lib/components/DataBlocks/Carousel.svelte';
  import Section from '$lib/components/DataBlocks/Section.svelte';
  import EditLink from '$lib/components/Admin/EditLink.svelte';
  import PostTitle from '$lib/components/DataBlocks/PostTitle.svelte';
  import PostDate from '$lib/components/DataBlocks/PostDate.svelte';
  import PostAttribution from '$lib/components/DataBlocks/PostAttribution.svelte';
  import PostShare from '$lib/components/DataBlocks/PostShare.svelte';
  import PostContributors from '$lib/components/DataBlocks/PostContributors.svelte';

  // Props
  let { data } = $props();

  // Destructure server data
  let gallery = $derived(data?.gallery);
  let contributors = $derived(data?.contributors);
  let featured_media = $derived(JSON.parse(gallery?.featured_media ?? "[]"))
</script>

<!-- Page meta data -->
<PageMeta {data} type="gallery" />

{#if gallery}
<!-- Gallery carousel -->
<Section wrapperWidth="var(--container-5xl)">
  <Carousel images={featured_media} />
</Section>

<!-- Page container -->
<Section wrapperWidth="var(--container-3xl)">
  <!-- Draft/Archived notice -->
  <StatusNotice
    {data}
    status={gallery?.status}
  />

  <!-- Admin edit link -->
  <EditLink {data} type="gallery" id={gallery?.id} />

  <!-- Post Share -->
  <PostShare data={gallery} />

  <!-- Post title -->
  <PostTitle data={gallery} collection="gallery" showType />

  <!-- Post Dates -->
  <PostDate data={gallery} updated />

  <!-- Contributor info -->
  <PostContributors {contributors} />

  <!-- Author info -->
  <PostAttribution data={gallery} />

  <!-- Post description -->
  <PostDescription data={gallery?.description ?? ''} />
</Section>
{:else}
<!-- Gallery item not found -->
<!-- Display loader component until redirect -->
<Loader />
{/if}