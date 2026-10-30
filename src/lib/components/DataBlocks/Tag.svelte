<script>
  // Export props
  let {
    label,
    href
  } = $props();

  // Check for tag formatting
  let formattedLabel = $derived.by(()=>{
    if (label?.match('--')) {
      return label?.split('--').reverse();
    } else {
      return [label];
    }
  });
</script>

<!-- List item container -->
{#if label}
  {#if href}
    <a
      class="tag"
      data-type={formattedLabel?.[1]}
      {href}
      title={formattedLabel?.[0]}
    >
      #{formattedLabel?.[0]}
    </a>
  {:else}
    <p
      class="tag"
      data-type={formattedLabel?.[1]}
      {href}
      title={formattedLabel?.[0]}
    >
      #{formattedLabel?.[0]}
    </p>
  {/if}
{/if}

<style>
  .tag {
    background-color: var(--color-primary-200-800);
    color: var(--color-primary-contrast-200-800);
    font-weight: 500;
    font-size: var(--text-sm);
    line-height: 1;
    padding: calc(var(--spacing) * 1) calc(var(--spacing) * 2);
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    border-radius: var(--radius-md);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tag[data-type="warning"] {
    background: var(--color-warning-200-800);
    color: var(--color-warning-contrast-200-800);
  }
  .tag[data-type="caution"] {
    background: var(--color-error-200-800);
    color: var(--color-error-contrast-200-800);
  }
</style>