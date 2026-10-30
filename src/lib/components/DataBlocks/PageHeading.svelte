<script>
  // Export props
  let {
    heading,
    subtitle,
    lead,
    class: className,
    containerClasses
  } = $props();
</script>

<!-- Section heading -->
<hgroup class="page-heading-container {containerClasses}">
  <!-- Optional slot above the title -->
  {@render lead?.()}

  <!-- Main heading/title -->
  <h1 class="page-header-heading {className}">
    {heading}
  </h1>

  <!-- Subtitle -->
  {#if subtitle}
    <p class="page-header-subtitle">{subtitle}</p>
  {/if}
</hgroup>


<style>
  .page-heading-container {
    width: 100%;
    padding: calc(var(--spacing) * 4);
  }

  .page-header-heading {
    position: relative;
    font-weight: 900;
    width: fit-content;
    margin: 0 auto;
    text-align: center;
    line-height: 1;
  }

  .page-header-subtitle {
    margin-top: calc(var(--spacing) * 4);
    font-size: var(--text-xl);
    text-align: center;
    letter-spacing: var(--tracking-wide);
  }
</style>