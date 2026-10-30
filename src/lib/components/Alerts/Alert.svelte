<script>
  // Props
  let {
    data,
    heading,
    message,
    children,
    class: className,
    headingClasses,
    messageClasses,
    preset,
    ...restProps
  } = $props();
</script>

<!-- Alert Container -->  
<div class="alert-container {className}" data-preset={preset} {...restProps}>
  <!-- Alert Heading -->
  {#if heading}
    <h6 class="alert-heading {headingClasses}">{heading}</h6>
  {/if}
  
  <!-- Alert Body -->
  {#if message}
    <p class="alert-message {messageClasses}">{message}</p>
  {/if}

  <!-- Other elements -->
  {@render children?.()}
</div>

<style>
  .alert-container {
    background: var(--color-surface-100-900);
    color: var(--color-surface-contrast-100-900);
    width: 100%;
    max-width: var(--container-sm);
    margin: 0 auto;
    padding: calc(var(--spacing) * 2);
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 2);
    border-width: var(--default-border-width);
    border-radius: var(--radius-md);
    line-height: 1;

    &[data-preset="surface"] {
      background: var(--color-surface-100-900);
      color: var(--color-surface-contrast-100-900);
      border-color: var(--color-surface-200-800);
    }
    &[data-preset="primary"] {
      background: var(--color-primary-100-900);
      color: var(--color-primary-contrast-100-900);
      border-color: var(--color-primary-200-800);
    }
    &[data-preset="secondary"] {
      background: var(--color-secondary-100-900);
      color: var(--color-secondary-contrast-100-900);
      border-color: var(--color-secondary-200-800);
    }
    &[data-preset="tertiary"] {
      background: var(--color-tertiary-100-900);
      color: var(--color-tertiary-contrast-100-900);
      border-color: var(--color-tertiary-200-800);
    }
    &[data-preset="success"] {
      background: var(--color-success-100-900);
      color: var(--color-success-contrast-100-900);
      border-color: var(--color-success-200-800);
    }
    &[data-preset="warning"] {
      background: var(--color-warning-100-900);
      color: var(--color-warning-contrast-100-900);
      border-color: var(--color-warning-200-800);
    }
    &[data-preset="error"] {
      background: var(--color-error-100-900);
      color: var(--color-error-contrast-100-900);
      border-color: var(--color-error-200-800);
    }
  }
</style>