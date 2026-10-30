<script>
  // Components
  import Author from './Author.svelte';
  
  // Skeleton UI component imports
  import { Popover } from '@skeletonlabs/skeleton-svelte';

  // Export props
  let { data, profileOptions } = $props();

  // Setup popover state
  let menuOpen = $state(false);
  function closeMenu() {
    menuOpen = false;
  }
</script>

<!-- Popover component (Skeleton UI) -->
<Popover
  open={menuOpen}
  onOpenChange={(e) => (menuOpen = e.open)}
  positioning={{ placement: 'bottom-right' }}
  triggerBase="profile-button"
  contentBase="rounded-lg shadow-xl bg-surface-50-950 md:ml-2 p-4 space-y-4 w-full md:w-screen md:max-w-[320px] border border-surface-300-700"
  zIndex={80}
>
  <!-- Trigger -->
  {#snippet trigger()}
    <Author data={data?.user} avatarSize="size-12" />
  {/snippet}

  <!-- Contents (Menu) -->
  {#snippet content()}
    <!-- Menu header -->
    <header class="flex justify-between">
      <!-- Label -->
      <p class="font-bold text-lg">Profile Menu</p>
      <!-- Close button -->
      <button aria-label="Close profile menu" class="btn-icon size-3 preset-filled-error-300-700 hover:preset-filled-error-500! hover:brightness-100!" onclick={closeMenu}><i class="ph-bold ph-x"></i></button>
    </header>

    <!-- Options -->
    <div>
      <!-- Render provided elements -->
      {@render profileOptions?.()}
    </div>
  {/snippet}
</Popover>

<style>

  :global(.profile-button) {
    width: 100%;
    padding: calc(var(--spacing) * 1);
    display: flex;
    align-items: center;
    gap: calc(var(--spacing) * 2);
    border-width: var(--default-border-width);
    border-color: var(--color-primary-500);
    border-radius: var(--radius-lg);

    &:hover {
      background: var(--color-primary-100-900);
    }
  }

  :global(.profile-button-popover) {
    border-radius: var(--radius-lg);
  }

</style>