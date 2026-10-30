<script>
  // Utilities
	import { screen } from "$lib/utils/breakpoints";

  // Components
	import { Toaster } from "svelte-sonner";

  // Props
  let {
    position = "top-right",
    expand = true,
  } = $props();
</script>

<!-- Toaster component (Svelte Sonner) -->
<!-- This component contains all setup for toast messages -->
<Toaster
  {position}
	{expand}
  toastOptions={{
    unstyled: true,
    classes: {
      toast: 'toast-container',
      title: 'toast-title',
      description: 'toast-description',
      default: 'toast-default',
      info: 'toast-info',
      success: 'toast-success',
      warning: 'toast-warning',
      error: 'toast-error',
      actionButton: 'button toast-button-action',
      cancelButton: 'button toast-button-cancel',
      closeButton: 'button toast-button-close',
    }
  }}
>
  <!-- Icons -->
  <i class="ph-bold ph-check-circle" slot="success-icon"></i>
  <i class="ph-bold ph-warning-circle" slot="warning-icon"></i>
  <i class="ph-bold ph-warning" slot="error-icon"></i>
</Toaster>

<style>
  /* Base styles */
  :global(.toast-container) {
    background: var(--color-surface-50-950);
    width: 100%;
    padding: calc(var(--spacing) * 3) calc(var(--spacing) * 4);
    color: var(--color-surface-contrast-50-950);
    display: flex;
    align-items: center;
    gap: calc(var(--spacing) * 2);
    border-width: var(--default-border-width);
    border-color: currentColor;
    border-radius: var(--radius-md);
  }

  /* Typography */
  :global(.toast-title) {
    line-height: 1;
  }
  
  :global(.toast-description) {
    font-size: var(--text-xs);
    line-height: 1;
  }

  /* Color variants */
  :global(.toast-default) {
    background: var(--color-surface-50-950);
    color: var(--color-surface-contrast-50-950);
  }
  :global(.toast-info) {
    background: var(--color-surface-100-900);
    color: var(--color-surface-700-300);
  }
  :global(.toast-success) {
    background: var(--color-success-100-900);
    color: var(--color-success-700-300);
  }
  :global(.toast-warning) {
    background: var(--color-warning-100-900);
    color: var(--color-warning-700-300);
  }
  :global(.toast-error) {
    background: var(--color-error-100-900);
    color: var(--color-error-700-300);
  }

  /* Button styles */
  :global(.toast-button-action) {
    background: var(--color-surface-300-700);
    color: var(--color-surface-contrast-300-700);
  }
  :global(.toast-button-cancel) {
    background: var(--color-error-300-700);
    color: var(--color-error-contrast-300-700);
  }
  :global(.toast-button-close) {
    background: var(--color-surface-300-700);
    color: var(--color-surface-contrast-300-700);
  }
</style>