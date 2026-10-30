<script>
  // Utilities
  import { formatDate } from '$lib/utils/date.js';
  import { fallback } from '$lib/utils/utils.js';

  // Components
  import Image from '$lib/components/Media/Image.svelte';
  import ProseContainer from '$lib/components/DataBlocks/ProseContainer.svelte';

  // Export props
  let { data } = $props();

  // Reassign server data
  let series = $derived(data?.series);
  let allSeries = $derived(data?.allSeries);
  let updateCount = $derived(data?.updateCount);
  let chapterCount = $derived(data?.chapterCount);
  let volumeCount = $derived(data?.volumeCount);
  let contributors = $derived(data?.contributors);
</script>

<section class="w-full max-w-5xl mx-auto h-fit space-y-4">
  <!-- Page heading -->
  <h2 class="h2 w-full max-w-prose inline-flex items-center gap-2">Series <a href="series/edit/{series?.id}" class="ml-1 leading-none! text-base font-medium btn gap-1 py-2 preset-filled-primary-500!"><i class="ph-bold ph-pencil-simple-line"></i>Edit</a></h2>

  <!-- Active series details -->
  <div class="w-full flex flex-col gap-4">
    <div class="w-full h-fit! grid md:grid-cols-[2fr_3fr] gap-4">
      <!-- Active series logo -->
      <!-- TODO: Show cover and favicon as well -->
      <div class="w-full h-full flex items-center justify-center">
        <Image
          src="/api/media/{series?.logo?.filename_disk}"
          alt=""
          wrapperClasses="w-full aspect-video overflow-hidden grid place-items-center border pattern-checker rounded-md"
          class="min-w-0! min-h-0! max-w-full max-h-full object-contain"
        />
      </div>
      <div class="flex flex-col gap-4">
        <div class="">
          <!-- Active series title -->
          <h3 class="h3 leading-none!">{series?.name}</h3>
          
          <!-- Active series subtitle -->
          {#if series?.subtitle != ''}
          <p class="leading-none font-semibold text-lg text-secondary-500!">{series?.subtitle}</p>
          {/if}
        </div>
        
        <!-- If contributors are listed -->
        {#if contributors?.length > 0}
        <div class="">
          <p class="inline-flex flex-wrap gap-2 leading-none">
            Created by:
            {#each contributors as author, i}
            <span class="text-primary-500 font-medium">{fallback([author?.user_id?.displayname, author?.guest_id?.displayname])}{#if contributors?.length > 1 && i != contributors?.length - 1}, {/if}</span>
            {/each}
          </p>
        </div>
        {/if}
        
        <!-- Active series Date Published -->
        <p class="text-sm font-bold text-primary-500">Date Published: {formatDate(series?.date_published)}</p>
        
        <!-- Active series blurb (short description) -->
        {#if series?.blurb}
        <div class="px-3 py-2 space-y-1 preset-filled-surface-100-900 rounded-md">
          <p class="text-sm text-primary-500">Blurb</p>
          <ProseContainer data={series?.blurb} />
        </div>
        {/if}

        <!-- Active series stats -->
        <div class="preset-filled-surface-100-900 px-3 py-2 flex gap-8 w-fit rounded-md">
          <p class="text-sm">Updates: <span class="text-primary-500 font-bold">{updateCount}</span></p>
          <p class="text-sm">Chapters: <span class="text-primary-500 font-bold">{chapterCount}</span></p>
          <p class="text-sm">Volumes: <span class="text-primary-500 font-bold">{volumeCount}</span></p>
        </div>
      </div>
    </div>
    <!-- Active series full description -->
    <div class="p-4 space-y-2 preset-filled-surface-100-900 rounded-md mt-0!">
      <p class="text-sm text-primary-500">Full Description</p>
      <ProseContainer data={series?.description} />
    </div>
  </div>

  <!-- TODO: Create table/list for all series -->
</section>
