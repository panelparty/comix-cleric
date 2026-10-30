<script>
  // Component imports
  import QuickCard from "$lib/components/Admin/QuickCard.svelte";
  import Table from "$lib/components/Admin/Table.svelte";

  // Props
  let { data } = $props();

  // Destructure server data
  let updates = $derived(data?.updates);
  let updateCount = $derived(data?.update_count);
  let chapters = $derived(data?.chapters);
  let chapterCount = $derived(data?.chapter_count);
  let volumes = $derived(data?.volumes);
  let volumeCount = $derived(data?.volume_count);
  let cast = $derived(data?.cast);
  let castCount = $derived(data?.cast_count);
  let gallery = $derived(data?.gallery);
  let galleryCount = $derived(data?.gallery_count);
  let blogs = $derived(data?.blogs);
  let blogsCount = $derived(data?.blogs_count);

  // Setup tab state
  let quickTab = $derived.by(()=>{
    if (updateCount > 0) return 'updates'
    else if (volumeCount > 0) return 'volumes'
    else if (chapterCount > 0) return 'chapters'
    else if (castCount > 0) return 'cast'
    else if (galleryCount > 0) return 'gallery'
    else if (blogsCount > 0) return 'blogs'
  })
</script>

<!-- TODO: This file is a mess. We need to abstract many of these containers and data panels. -->
<!-- Page container -->
<section class="w-full max-w-5xl mx-auto h-fit space-y-4">
  <!-- Page heading -->
  <h3 class="h3 leading-none! w-full">Series: {data?.settings?.name}</h3>

  <!-- Comic stats component -->
  <!-- TODO: Move into separate component -->
  <div class="w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
    <!-- Updates stats card -->
    <QuickCard
      data={updates}
      count={updateCount}
      label="Update"
      slug="updates"
    />

    <!-- Chapters stats card -->
    <QuickCard
      data={chapters}
      count={chapterCount}
      label="Chapter"
      slug="chapters"
    />

    <!-- Volumes stats card -->
    <QuickCard
      data={volumes}
      count={volumeCount}
      label="Volume"
      slug="volumes"
    />
  </div>

  <!-- Quick Access -->
  {#if
    updateCount > 0 ||
    volumeCount > 0 ||
    chapterCount > 0 ||
    castCount > 0 ||
    galleryCount > 0 ||
    blogsCount > 0
  }
  <div class="border rounded-xl p-2 md:p-4 min-h-16 space-y-2">
    <!-- Panel heading -->
    <h6 class="leading-none! text-xs font-semibold tracking-wide">Quick Access</h6>

    <!-- Tab group buttons -->
    <div class="grid grid-cols-2 md:flex md:flex-nowrap gap-1 md:**:rounded-none md:**:first:rounded-l-md md:**:last:rounded-r-md">
      {#if updateCount > 0}<button onclick={()=>{quickTab = 'updates'}} class="w-full flex justify-center preset-filled-surface-100-900 text-primary-500 font-semibold text-xs md:text-sm leading-none px-4 p-2 rounded-md {quickTab === 'updates' ? 'preset-filled-primary-500!' : ''}">Updates</button>{/if}
      {#if volumeCount > 0}<button onclick={()=>{quickTab = 'volumes'}} class="w-full flex justify-center preset-filled-surface-100-900 text-primary-500 font-semibold text-xs md:text-sm leading-none px-4 p-2 rounded-md {quickTab === 'volumes' ? 'preset-filled-primary-500!' : ''}">Volumes</button>{/if}
      {#if chapterCount > 0}<button onclick={()=>{quickTab = 'chapters'}} class="w-full flex justify-center preset-filled-surface-100-900 text-primary-500 font-semibold text-xs md:text-sm leading-none px-4 p-2 rounded-md {quickTab === 'chapters' ? 'preset-filled-primary-500!' : ''}">Chapters</button>{/if}
      {#if castCount > 0}<button onclick={()=>{quickTab = 'cast'}} class="w-full flex justify-center preset-filled-surface-100-900 text-primary-500 font-semibold text-xs md:text-sm leading-none px-4 p-2 rounded-md {quickTab === 'cast' ? 'preset-filled-primary-500!' : ''}">Cast</button>{/if}
      {#if galleryCount > 0}<button onclick={()=>{quickTab = 'gallery'}} class="w-full flex justify-center preset-filled-surface-100-900 text-primary-500 font-semibold text-xs md:text-sm leading-none px-4 p-2 rounded-md {quickTab === 'gallery' ? 'preset-filled-primary-500!' : ''}">Gallery</button>{/if}
      {#if blogsCount > 0}<button onclick={()=>{quickTab = 'blogs'}} class="w-full flex justify-center preset-filled-surface-100-900 text-primary-500 font-semibold text-xs md:text-sm leading-none px-4 p-2 rounded-md {quickTab === 'blogs' ? 'preset-filled-primary-500!' : ''}">Blogs</button>{/if}
    </div>

    <!-- Tab contents -->
    <!-- Replace with generic flexible table component -->
    <div class="border p-2 md:px-4 rounded-lg">
      <!-- Updates tab -->
      <Table data={data} dataType={quickTab} canView canEdit canShare canDelete deleteAction="/api/actions/{quickTab}?/delete" />
    </div>
  </div>
  {/if}
</section>
