<script>
  // Svelte utilities
  import { invalidateAll } from "$app/navigation";
  import { page } from "$app/state";

  // Utilities
  import { acceptedFileTypes } from "$lib/utils/validation/schema.js";
  import { createPageState } from "$lib/utils/page/pageState.svelte.js";

  // Components
  import FileUploader from "$lib/components/Admin/Inputs/FileUploader.svelte";
  import Pagination from "$lib/components/Pagination/Pagination.svelte";
  import DeleteConfirm from "$lib/components/Admin/DeleteConfirm.svelte";
  import Image from "$lib/components/Media/Image.svelte";
  import CopyButton from "$lib/components/Functional/CopyButton.svelte";
  import Input from "$lib/components/Admin/Inputs/Input.svelte";
  
  // Export props
  let { data } = $props()

  // Destructure data
  let files = $derived(data?.files);
  let fileCount = $derived(data?.fileCount);

  // Setup pagination options
  let searchParams = createPageState(page.url,
    {
      sort: '-uploaded_on',
      page: 1,
      type: '*',
      limit: data?.settings?.page_limit ?? 25,
    }
  );

  // Sorting
  let sortDir = $derived(searchParams.state.sort.startsWith('-') ? '-' : '');
  let sortField = $derived(searchParams.state.sort.replace(/^-/, ''));

  function setSort(field, dir) {
    searchParams.state.sort = `${dir}${field}`;
  }

  function handleUploadedFiles (uploadResponse) {
    invalidateAll();
  };

  let selectedFiles = $state([]);
</script>

<!-- Page container -->
<section class="w-full h-full max-w-5xl mx-auto space-y-2 sm:space-y-4 grid grid-cols-1 grid-rows-[min-content_1fr]">
  <div class="space-y-2">
    <!-- Page heading -->
    <h3 class="h3">Media Library</h3>
    <!-- Sort menu -->
    <div class="flex gap-2 items-center">
      <p class="label">Sort:</p>
      <div class="input-group grid grid-cols-[auto_auto_auto] ">
        <select class="ig-select text-sm h-8 px-2 py-1 min-w-36 rounded-l-md" value={sortField} onchange={(e) => setSort(e.currentTarget.value, sortDir)}>
          <option value="uploaded_on">Date Uploaded</option>
          <option value="title">Title</option>
          <option value="filename_disk">Filename disk</option>
          <option value="filename_download">Filename download</option>
        </select>
        <button class="ig-btn text-xs p-1 size-8 grid place-content-center {sortDir === '' ? 'bg-primary-500 text-surface-950' : ''}" onclick={() => setSort(sortField, '')}><i class="ph-bold ph-plus"></i></button>
        <button class="ig-btn text-xs p-1 size-8 grid place-content-center {sortDir === '-' ? 'bg-primary-500 text-surface-950' : ''}" onclick={() => setSort(sortField, '-')}><i class="ph-bold ph-minus"></i></button>
      </div>
    </div>
    <!-- Filter menu -->
    <div class="flex gap-2 items-center">
      <p class="label">Type:</p>
      <div class="input-group grid grid-cols-[auto_auto_auto]">
        <button type="button" class="btn leading-tight preset-filled-surface-100-900 {searchParams.state.type === "*" ? "preset-filled-primary-500!" : ""}" onclick={()=>{searchParams.state.type = "*"}}>All</button>
        <button type="button" class="btn leading-tight preset-filled-surface-100-900 {searchParams.state.type === "image" ? "preset-filled-primary-500!" : ""}" onclick={()=>{searchParams.state.type = "image"}}>Image/GIF</button>
        <button type="button" class="btn leading-tight preset-filled-surface-100-900 {searchParams.state.type === "audio" ? "preset-filled-primary-500!" : ""}" onclick={()=>{searchParams.state.type = "audio"}}>Audio</button>
      </div>
    </div>
    <!-- Upload new files -->
    <div class="grid grid-cols-1 gap-2">
      <!-- <p class="">Global Actions</p> -->
      <FileUploader triggerClasses="md:max-w-[50%]" accept={[...acceptedFileTypes?.image, ...acceptedFileTypes?.audio]} maxFiles={999} {data} onUploadComplete={handleUploadedFiles} />
      <p class="text-xs text-surface-700-300">Up to 999 files, total size must not exceed 256MB. Max image size is 10,000 x 10,000 pixels.</p>
    </div>
  </div>

  <!-- Media list with previews -->
  <div class="w-full h-full min-h-0 grid grid-cols-1 grid-rows-[minmax(0,1fr)_min-content]">
    <ul class="relative h-full list-none! p-2 border border-surface-300-700 card grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 overflow-y-auto">
      {#each data?.files as file, i}
      <li class="">
        <a href="media/edit/{file?.id}" class="flex border border-surface-300-700 btn p-0! cursor-pointer">
          <div class="w-full">
            <div class="relative aspect-square w-full grid place-items-center overflow-hidden rounded-t-md border-b border-surface-300-700 pattern-checker">
              {#if file?.type?.startsWith('image/')}
                <Image src="/api/media/{file?.filename_disk}" alt="" wrapperClasses="h-full w-full" class="max-h-full max-w-full object-contain" />
              {:else if file?.type?.startsWith('video/')}
                <video src="/api/media/{file?.filename_disk}" controls class="max-h-full w-auto object-contain"></video>
              {:else if file?.type?.startsWith('audio/')}
              <div class="w-full h-full grid place-items-center">
                <audio src="/api/media/{file?.filename_disk}" controls class="w-full"></audio>
              </div>
              {:else}
              <div class="w-full h-full grid place-items-center">
                <p class="text-surface-700-300">File type not supported... yet!</p>
              </div>
              {/if}
              <!-- Overlays -->
              <!-- TODO: Add multi-edit system -->
              <!-- <div class="absolute inset-0">
                <Input type="checkbox" class="relative top-2 left-2" inputClasses="size-5!" />
              </div> -->
              <p class="absolute top-2 right-2 text-xs font-semibold uppercase tracking-wide p-1 leading-none bg-primary-500 text-surface-950 ">
                {file?.type}
              </p>
            </div>
            <div class="p-2 grid grid-cols-[auto_min-content] items-center gap-2">
              <p class="-my-1 truncate text-sm font-bold" title={file?.title}>{file?.title}</p>
              <div class="flex items-center gap-2">
                <CopyButton
                  value={file?.filename_disk}
                  aria-label="Copy file reference"
                  class="button bg-surface-200-800"
                  label=""
                  title="Copy filename (on disk)"
                >
                  <i class="ph-bold ph-copy"></i>
                </CopyButton>
                <DeleteConfirm id={file?.id} title="Delete {file?.title}" name={file?.title} formAction="/api/actions/media?/delete" small />
              </div>
            </div>
          </div>
        </a>
      </li>
      {/each}
    </ul>
    {#if fileCount > 25}
    <!-- Pagination -->
    <div class="sticky w-full col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 -left-4 -right-4 -bottom-8 mt-2 border-t border-surface-300-700 bg-surface-50-950 p-4 z-10">
      <!-- Pagination component -->
      <Pagination
        data={files}
        count={fileCount}
        onPageChange={(e) => searchParams.state.page = e.page}
        page={searchParams.state.page}
        bind:pageSize={searchParams.state.limit}
      />
    </div>
    {/if}
  </div>
</section>
