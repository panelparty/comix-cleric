<script>
  // Props
  let {
    user,
    role,
    avatar,
    size,
    class: className,
    ...restProps
  } = $props();
</script>

<!-- Container -->
<div class="post-profile-container {className}" data-size={size} {...restProps}>
  <!-- Avatar -->
  <img
    class="post-profile-avatar"
    src={avatar ?? "/api/media/" + user?.avatar?.filename_disk}
    alt="{user?.username ?? user?.handle ?? "username"}'s avatar"
  />

  <!-- Details -->
  <div class="post-profile-details">
    <!-- Role -->
    {#if role}
      <p class="post-profile-role">{user?.project_role ?? "role"}</p>
    {/if}

    <!-- Displayname -->
    <h6 class="post-profile-displayname">{user?.displayname ?? user?.displayName ?? "Display Name"}</h6>

    <!-- Username -->
    <p class="post-profile-username">@{user?.username ?? user?.handle ?? "username"}</p>
  </div>
</div>

<style>
  .post-profile-container {
    display: flex;
    align-items: center;
    gap: calc(var(--spacing) * 1);
  }

  .post-profile-avatar {
    --size: 12;

    background: var(--color-primary);
    width: calc(var(--spacing) * var(--size));
    height: var(--size);
    border-radius: var(--radius-md);
  }

  .post-profile-details {
    display: flex;
    flex-direction: column;
    align-items: start;
    overflow: hidden;
  }

  .post-profile-role {
    font-weight: 700;
    font-size: var(--text-xs);
    color: var(--color-primary-500);
    line-height: 1;
  }
  
  .post-profile-displayname,
  .post-profile-username {
    line-height: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .post-profile-username {
    font-weight: 500;
    font-size: var(--text-sm);
    color: var(--color-surface-800-200);
  }

  [data-size="small"] {
    .post-profile-avatar {
      --size: 10;
      border-radius: var(--radius-sm);
    }

    .post-profile-role {
      font-size: var(--text-2xs);
    }

    .post-profile-displayname {
      font-size: var(--text-base);
    }

    .post-profile-username {
      font-size: var(--text-xs);
    }
  }

  [data-size="large"] {
    .post-profile-avatar {
      --size: 16;
      border-radius: var(--radius-lg);
    }

    .post-profile-role {
      font-size: var(--text-sm);
    }

    .post-profile-displayname {
      font-size: var(--text-xl);
    }

    .post-profile-username {
      font-size: var(--text-base);
    }
  }
</style>