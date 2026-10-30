<script>


  // Component imports
  import { Avatar } from '@skeletonlabs/skeleton-svelte';

  // Export props
  let { data, avatarSize = 'size-12', role, textColor } = $props();

</script>

<!-- Component wrapper -->
<div class="author {textColor}">

  <!-- Avatar component -->
  <Avatar name="icon" size={avatarSize} src="/api/media/{data?.avatar}.png" background="preset-filled-primary-400-600" rounded="">
    <!-- Placeholder icon when no image is present -->
    <i class='text-3xl text-primary-50/40 ph-bold ph-{data?.icon}'></i>
  </Avatar>
  <Avatar size={avatarSize} background="preset-filled-primary-500" rounded="rounded-md">
		<Avatar.Image src="/api/media/{data?.avatar?.filename_disk}.png" alt="{data?.displayname ?? data?.username}'s avatar" />
		<Avatar.Fallback><i class="ph-fill ph-palette"></i></Avatar.Fallback>
	</Avatar>

  <!-- Author information -->
  <div class="profile-data py-1 lg:py-2">
    <!-- Author Role -->
    {#if role}<p class="text-xs fontmedium uppercase tracking-wide leading-none">{data?.project_role}</p>{/if}
    <!-- Author Name -->
    <h5 class="h5 leading-none">{data?.displayname}</h5>
    <!-- Author social media handle, consider changing to a link to your main social account. -->
    <p class="leading-none">@{data?.username}</p>
  </div>

</div>

<!-- Local CSS styles -->
<style>
  .author {
    display: flex;
    gap: .5rem;
    align-items: center;
  }
</style>
