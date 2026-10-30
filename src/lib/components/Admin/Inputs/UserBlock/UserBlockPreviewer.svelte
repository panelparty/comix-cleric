<script>

  import UserProfile from "$lib/components/User/UserProfile.svelte";

  let { users = '[]' } = $props();

</script>

<div class="p-2 md:p-4 bg-surface-100-900 rounded-xl overflow-y-auto">
  {#each users as data}
    <UserProfile {data} />
  {/each}
</div>
