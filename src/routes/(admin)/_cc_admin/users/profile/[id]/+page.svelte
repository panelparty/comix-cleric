<!-- This page displays user account details (readonly) -->
<script>

  // Utility imports
  import { formatDateLong } from '$lib/utils/date';
  import { renderMarkdown } from '$lib/utils/sanitize/output.js';

  // Component imports
  
// Export props
  let { data } = $props();

  // Reassign server data
  let user = $derived(data?.userData);

</script>

<!-- Section container -->
<section class="w-full max-w-5xl mx-auto h-fit space-y-4">
  <div class="p-2 md:p-4 border border-surface-100-900 rounded-xl md:rounded-2xl">
    <!-- Inner container -->
    <div class="w-full grid grid-rows-[max-content_auto] sm:grid-cols-[max-content_auto] items-center gap-4">
      <!-- User avatar preview -->
      <div class="aspect-square w-full sm:w-32 grid place-content-center rounded-lg overflow-hidden">
        <img src="/api/media/{user?.avatar?.filename_disk}" alt="" class="block min-w-full min-h-full object-cover">
      </div>

      <!-- Basic user account info -->
      <div class="grid auto-rows-auto">
        <p class="-mb-3 text-lg truncate text-primary-500 tracking-wide font-medium">{user?.project_role}</p>
        <h1 class="-mb-3 h1 truncate leading-tight">{user?.displayname}</h1>
        <p class="text-2xl opacity-60 truncate">@{user?.name}</p>
      </div>
    </div>
    
    <hr class="hr my-4">
    
    <!-- TODO: Expand this section to include more information in a customizable way. -->
    <div class="flex items-center gap-2">
      <p class="uppercase text-xs tracking-wide font-medium text-surface-700-300">Permissions: <span class="capitalize tracking-wide font-bold {user?.role === "admin" ? "text-success-500" : "text-surface-700-300"}">{user?.role}</span></p>
      <hr class="vr min-h-4">
      <p class="uppercase text-xs tracking-wide font-medium text-surface-700-300">Joined: <span class="capitalize tracking-wide font-bold text-surface-950-50">{formatDateLong(user?.date_created)}</span></p>
    </div>

    {#if user?.description}
    <hr class="hr my-4">
    
    <div class="p-4 preset-filled-surface-50-950 border rounded-lg">
      <p class="uppercase text-xs tracking-wide font-medium text-surface-700-300">Bio:</p>
      <p class="">{@html renderMarkdown(user?.description ?? "")?.html}</p>
    </div>
    {/if}
  </div>
</section>
