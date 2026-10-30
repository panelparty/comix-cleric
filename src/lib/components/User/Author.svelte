<script>
  // Skeleton UI component imports
  import { Avatar } from '@skeletonlabs/skeleton-svelte';

  // Props
  let {
    data,
    rounded = "rounded-lg",
    avatarSize = "size-20",
    icon = "palette",
    role,
    textColor,
    class: classname,
    displaynameClasses
  } = $props();
</script>

<!-- Container -->
<div class="author-container {textColor} {classname}">
  <!-- Avatar component -->
  {#if data?.avatar?.filename_disk && data?.avatar?.filename_disk != ''}
  <Avatar name="icon" size={avatarSize} src="/api/media/{data?.avatar?.filename_disk}" imageClasses="author-avatar" background="author-avatar" {rounded}>
    <!-- Placeholder icon when no image is present -->
    <i class="author-avatar-fallback ph-fill ph-palette"></i>
  </Avatar>
  {/if}

  <!-- Author information -->
  <hgroup class="author-details">
    <!-- Author Role -->
    {#if role}<p class="author-role" title={data?.project_role}>{data?.project_role}</p>{/if}
    <!-- Author Name -->
    <h5 class="author-displayname {displaynameClasses}" title={data?.displayname ?? data?.name}>{data?.displayname ?? data?.name}</h5>
    <!-- Author social media handle, consider changing to a link to your main social account. -->
    <p class="author-username" title={data?.name}>@{data?.name}</p>
  </hgroup>
</div>

<!-- Local CSS styles -->
<style>
  :global(.author-container) {
    width: auto;
    max-width: var(--container-3xs);
    font-size: var(--text-sm);
    display: grid;
    grid-template-columns: max-content auto;
    align-items: center;
    gap: calc(var(--spacing) * 2);
  }

  :global(.author) {
    display: flex;
    gap: .5rem;
    align-items: center;
  }

  :global(.author-avatar) {
    min-width: 100%;
    min-height: 100%;
    object-fit: cover;
    background: var(--color-primary-400-600);
  }

  :global(.author-avatar-fallback) {
    font-size: var(--text-4xl);
    color: color-mix(in oklab, inherit 40%, transparent);
  }

  :global(.author-details) {
    display: grid;
    grid-template-columns: 1fr;
    line-height: 1;

    & * {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  :global(.author-role) {
    font-size: var(--text-xs);
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    color: var(--color-primary-500);
  }

  :global(.author-displayname) {
    line-height: var(--leading-tight);
  }

  :global(.author-username) {
    font-weight: var(--font-weight-normal);
    color: color-mix(in oklab, inherit 40%, transparent);
    text-align: left;
    line-height: var(--leading-tight);
  }
</style>
