<!-- TODO: This component should be reworked to be way more flexible. -->

<script>

  // Svelte utility imports
  
// Export props
  let { data } = $props();

  // Reassign server data
  // TODO: Replace with a custom list from the database
  let owners = $derived(data?.settings?.main_site_owners);

</script>

<!-- If component is enabled in database, handle own visibility -->
{#if data?.settings?.main_site_enabled || true}
<!-- Component wrapper -->
<section class="preset-filled-primary-500! p-8 w-full text-center font-medium">
  <div class="space-y-2">
    <h2 class="h2 font-black text-pretty text-primary-950 leading-none">{data?.settings?.name}</h2>
    <p class="text-pretty text-primary-950 leading-none">is just one of the many great projects by</p>
    <h4 class="h4 text-secondary-950 leading-none">{#each owners as owner, i}{owner?.users_id?.displayname}{#if owners.length > 1 && i != owners.length}, {/if}{/each}!</h4>
  </div>

  <hr class="hr max-w-24 mx-auto my-2 mt-3">

  <div class="space-y-4">
    <p class="">Check out more at</p>
    <a href="{data?.settings?.main_site_url}" target="_blank" class="btn btn-lg preset-filled-tertiary-500 font-bold">{data?.settings?.main_site_label ? data?.settings?.main_site_label : data?.settings?.main_site_url}</a>
  </div>
</section>
{/if}
