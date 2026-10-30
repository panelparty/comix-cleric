<script>
  // Components
  import Loader from "$lib/components/Placeholders/Loader.svelte";
  import StatusNotice from "$lib/components/Alerts/StatusNotice.svelte";
  import EditLink from "$lib/components/Admin/EditLink.svelte";
  import PageMeta from "$lib/components/Meta/PageMeta.svelte";
  import Section from "$lib/components/DataBlocks/Section.svelte";
  import DisplayDate from "$lib/components/Display/DisplayDate.svelte";
  import PostDate from "$lib/components/DataBlocks/PostDate.svelte";
  import PostAttribution from "$lib/components/DataBlocks/PostAttribution.svelte";
  import PostTitle from "$lib/components/DataBlocks/PostTitle.svelte";
  import ProseContainer from "$lib/components/DataBlocks/ProseContainer.svelte";
  import PostShare from "$lib/components/DataBlocks/PostShare.svelte";
    
  // Props
  let { data } = $props();

  // Destructure server data
  let blog = $derived(data?.blog);
  let blog_prev = $derived(data?.blog_prev);
  let blog_next = $derived(data?.blog_next);
</script>

<!-- Injected into page <head> tag -->
<PageMeta {data} type="blog" />

<!-- If we got a blog back from the server -->
{#if blog}
<!-- Draft/Archived notice -->
<StatusNotice
  {data}
  status={blog?.status}
/>

<!-- Page container -->
<Section wrapperWidth="var(--container-3xl)">
  <!-- Edit post -->
  <EditLink {data} type="blogs" id={blog?.id} />

  <!-- Post title -->
  <PostTitle data={blog} collection="blog" showType />

  <!-- Post dates -->
  <PostDate data={blog} updated />

  <!-- Author info -->
  <PostAttribution data={blog} />

  <!-- Post Share -->
  <PostShare data={blog} />

  <hr class="hr">
</Section>

<!-- Blog post body -->
<Section wrapperWidth="var(--container-2xl)">
  <ProseContainer data={blog?.body} class="blog-prose" />
</Section>

<!-- Blog prev/next links -->
<Section wrapperWidth="var(--container-3xl)">
  <!-- Wrapper -->
  <div class="gap-container" style="--dir: row; --gap: 2;">
    <!-- Blog Link Previous -->
    {#if blog_prev}
    <a href="/blog/{blog_prev?.slug}" class="blog-nav-button button post-card gap-container">
      <!-- Label -->
      <p class="label"><i class="ph-bold ph-arrow-left"></i> Older</p>
      
      <div class="gap-container" style="--gap: 0; align-items: center;">
        <!-- Type -->
        <p class="display-type" title={blog_prev?.type?.name}>{blog_prev?.type?.name}</p>

        <!-- Post title -->
        <h5 class="title" title={blog_prev?.name}>{blog_prev?.name}</h5>
      </div>

      <!-- Post date -->
      <DisplayDate date={blog_prev?.date_published} />
    </a>
    {/if}

    <!-- Blog Link Next -->
    {#if blog_next}
    <a href="/blog/{blog_next?.slug}" class="blog-nav-button button post-card gap-container">
      <!-- Label -->
      <p class="label">Newer <i class="ph-bold ph-arrow-right"></i></p>

      <div class="gap-container" style="--gap: 0; align-items: center;">
        <!-- Type -->
        <p class="display-type" title={blog_next?.type?.name}>{blog_next?.type?.name}</p>

        <!-- Post title -->
        <h5 class="title" title={blog_next?.name}>{blog_next?.name}</h5>
      </div>

      <!-- Post date -->
      <DisplayDate date={blog_next?.date_published} />
    </a>
    {/if}
  </div>
</Section>

<!-- Blog post not found -->
{:else}
<!-- Display loader until redirect -->
<Loader />
{/if}

<style>
  :global(.blog-prose) {
    padding: calc(var(--spacing) * 8) 0;
  }

  .blog-nav-button {
    --gap: 2;

    width: 100%;
    align-items: center;
    padding: calc(var(--spacing) * 4);
  }
  .blog-nav-button .title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>