<script>
  // Components
  import ProfileCompact from "../User/ProfileCompact.svelte";

  // Props
  let {
    contributors,
    heading = "Made by:",
  } = $props();
</script>

{#if contributors && contributors?.length > 0}
<div class="contributors-container gap-container" style="--gap: 2;">
  <h6 class="contributors-heading title">{heading}</h6>

  <!-- If series has contributors listed -->
  <ul class="contributors-list">
    {#each contributors as author, i}
      <li class="">
        <!-- Author info component -->
        <ProfileCompact role user={author?.user_id ?? author?.guest_id} />
      </li>
    {/each}
  </ul>
</div>
{/if}

<style>

  .contributors-list {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    place-items: start;
    gap: calc(var(--spacing) * 8);

    @media (width >= 40rem) {
      gap: calc(var(--spacing) * 4);
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    @media (width >= 48rem) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

</style>