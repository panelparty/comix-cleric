<script>
  // Components
  import NotFound from '$lib/components/Placeholders/NotFound.svelte';
  import Table from '$lib/components/Admin/Table.svelte';
  
  // Props
  let { data } = $props();

  // Data reassignment
  let admin = $derived(data?.admin);
  let adminCount = $derived(data?.adminCount);
  let users = $derived(data?.users);
  let userCount = $derived(data?.userCount);
  let guests = $derived(data?.guests);
  let guestCount = $derived(data?.guestCount);
</script>

<!-- Section container -->
<section class="w-full max-w-5xl mx-auto h-fit space-y-4">
{#if adminCount > 0}
  <!-- Page header -->
  <div class="flex gap-4">
    <!-- Page heading/title -->
    <h3 class="h3 leading-none! w-full flex items-center gap-2">Staff</h3>
    <!-- Add staff/admin button -->
    <a href="/_cc_admin/users/create-staff" class="btn px-3 py-2 bg-primary-500 text-surface-950! leading-none flex gap-2 items-center whitespace-nowrap"><i class="ph-bold ph-plus"></i>Add Staff</a>
  </div>
  <hr class="hr my-4">
  <!-- Staff user data table -->
  <!-- TODO: Replace with generic flexible table component -->
  <div class="bg-surface-50-950 px-4 pt-2 pb-4 min-h-16 space-y-2">
    <Table data={data} dataType="admin" canView canEdit canDelete deleteAction="/api/actions/staff?/delete" />
  </div>
{:else}
  <NotFound label="No staff found" />
  <a href="/_cc_admin/users/create-staff" class="w-fit mx-auto btn px-3 py-2 bg-primary-500 text-surface-950 leading-none flex gap-2 items-center whitespace-nowrap"><i class="ph-bold ph-plus"></i>Add Staff</a>
{/if}

<!-- Section header -->
<div class="flex gap-4 mt-8">
  <!-- Section heading/title -->
  <h3 class="h3 leading-none! w-full flex items-center gap-2">Guests</h3>
  <!-- Create user button -->
  <a href="/_cc_admin/users/create-guest" class="btn px-3 py-2 bg-primary-500 text-surface-950! leading-none flex gap-2 items-center whitespace-nowrap"><i class="ph-bold ph-plus"></i>Add Guest</a>
</div>
<hr class="hr my-4">
{#if guestCount > 0}
<!-- User data table -->
<!-- TODO: Replace this with generic flexible table component -->
<div class="bg-surface-50-950  px-4 pt-2 pb-4 min-h-16 space-y-2">
  <Table data={data} dataType="guests" canView canEdit canDelete deleteAction="/api/actions/guests?/delete" />
</div>
{:else}
<NotFound label="No guests found" />
<a href="/_cc_admin/users/create-guest" class="w-fit mx-auto btn px-3 py-2 bg-primary-500 text-surface-950 leading-none flex gap-2 items-center whitespace-nowrap"><i class="ph-bold ph-plus"></i>Add Guest</a>
{/if}
</section>