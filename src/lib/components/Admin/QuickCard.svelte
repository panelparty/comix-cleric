<script>
    import { formatDate } from "$lib/utils/date";


  // Export props
  let { data, count, label, slug, lastRelease = true, makePlural = true } = $props();

</script>

<!-- Updates stats card -->
<div class="preset-outlined-surface-100-900 dark:preset-filled-surface-100-900 p-4 min-h-16 space-y-1 rounded-lg">
  <!-- Card heading -->
  <h6 class="leading-none! text-xs! font-semibold! uppercase tracking-wide! text-primary-700-300!">{label}{makePlural && count != 1 ? 's' : ''}</h6>
  <!-- Total update count -->
  <p class="text-primary-700-300 text-3xl md:text-5xl font-black leading-none!">{count}</p>
  <!-- If updates have been posted, display last Date Published -->
  {#if data?.length > 0 && lastRelease}
  <p class="text-sm font-semibold text-surface-700-300">Last Release: {formatDate(data[0].date_published)}</p>
  {/if}
  <!-- Quick links -->
  <div class="flex lg:flex-col gap-2">
    <!-- Create new update -->
    <a href="/_cc_admin/{slug}/create" class="{data?.length > 0 ? 'w-full' : 'w-fit'} px-3 py-3 md:py-2 btn preset-filled-primary-500 text-surface-950! text-sm leading-none flex gap-2 items-center whitespace-nowrap"><i class="ph-bold ph-plus"></i>Add New {label}</a>
    <!-- If updates have been posted, link to the list -->
    {#if data?.length > 0}
    <a href="/_cc_admin/{slug}" class="w-full px-3 py-3 md:py-2 btn preset-filled-primary-500 text-surface-950! text-sm leading-none flex gap-2 items-center whitespace-nowrap">View All</a>
    {/if}
  </div>
</div>
