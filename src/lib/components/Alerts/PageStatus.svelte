<script>
  // Utilities
  import { adminRoute } from "../Admin/Layout/navigation";

  // Components
  import Alert from "./Alert.svelte";

  // Props
  let {
    data,
    preset
  } = $props();

  // Destructure server data
  let currentPage = $derived(data?.currentPage);
</script>

<!-- Alert -->
{#if data?.isAdmin}
<Alert preset="surface" class="page-status-alert">
  <!-- Title -->
  <p class="page-status-heading">You can disable this page in the <a href="{adminRoute}/settings/pages/edit/{currentPage?.id}" class="anchor">page settings</a> by clicking "Unpublish."</p>
  
  <!-- Message -->
  <p class="label-dim page-status-message">(Only admin can see this message)</p>
</Alert>  
{/if}

<style>
  :global(.alert-container.page-status-alert) {
    max-width: var(--container-xl);
    padding: calc(var(--spacing) * 2);
    align-items: center;
    text-align: center;
  }
  
  .page-status-heading {
    font-weight: 700;
    line-height: var(--leading-tight);
    text-wrap: pretty;
  }
</style>