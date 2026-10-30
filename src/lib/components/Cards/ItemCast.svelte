<script>

  // Utility imports
  import { renderMarkdown } from "$lib/utils/sanitize/output";

  // Export props
  let { data } = $props()

  let nicknames = $derived(data?.nickname?.split(', '));

</script>

<!-- Cast item container -->
<div class="grid grid-cols-1 overflow-hidden">
  <!-- Cast type -->
  <small class="truncate -mb-1">{data?.story_role?.type}</small>
  <!-- Cast nickname/name -->
  <h5
    class="h5 font-black truncate w-full"
    title="{data?.name} {nicknames?.[0] ? `a.k.a. ${nicknames[0]}` : ''}"
  >{data?.name}</h5>
  <!-- If the cast member has pronouns provided -->
  <!-- TODO: Make optional/customizable -->
  {#if data?.pronouns && data?.pronouns != ''}
    <!-- Display cast pronous -->
    <p class="text-xs font-semibold truncate leading-tight">({data?.pronouns})</p>
  {/if}
  <!-- If the cast member has a blurb (short description) -->
  {#if data?.blurb && data?.blurb != ''}
    <!-- Display a truncated version of the blurb -->
    <div class="line-clamp-2 leading-tight">
      {@html renderMarkdown(data?.blurb ?? '')?.html}
    </div>
  {/if}
</div>
