<script>
  // Component imports
  import SocialLink from "$lib/components/DataBlocks/SocialLink.svelte";

  // Export props
  let { data } = $props();
</script>

{#if data?.length > 0}
<!-- Container -->
<div class="social-cta-container">
  <!-- Title -->
  <h6 class="title">Give us a follow!</h6>
  <!-- Link list -->
  <ul class="social-cta-list">
    {#each data as item}
      <!-- Sementic list item element -->
      <li>
        <!-- Button component -->
        <SocialLink href={item?.href} icon={item?.icon} label={item?.label} slug={item?.slug} />
      </li>
    {/each}
  </ul>
</div>
{/if}

<style>
  .social-cta-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: calc(var(--spacing) * 1);
  }
  
  .social-cta-list {
    width: 100%;
    margin: 0 auto;
    padding: 0 calc(var(--spacing) * 4);
    display: flex;
    justify-items: center;
    align-items: center;
    gap: calc(var(--spacing) * 2);
    
    @media (width >= 48rem) {
      width: fit-content;
      gap: calc(var(--spacing) * 4);
    }
  }
</style>