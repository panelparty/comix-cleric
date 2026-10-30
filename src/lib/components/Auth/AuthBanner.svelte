<script>

	// Components
	import Login from "./Login.svelte";
	import Logout from "./Logout.svelte";


	// Props
	let {
		data
	} = $props();

</script>


<!-- If we have already have user data or users are allowed to register -->
{#if data?.user || data?.settings?.user_register === true}
<!-- User account card -->
<div class="auth-banner">
	<!-- If we have user data -->
	{#if data?.user}
		<!-- Card heading/title -->
		<!-- TODO: Make customizable. -->
		<h5 class="auth-banner-title h5">
			{data.isAdmin ? 'Welcome home, ' : 'Thanks for being here, '}<span class="{data?.isAdmin ? 'text-primary-500' : 'text-secondary-500'}">{data?.user?.displayname}</span>!
		</h5>

		<!-- Control panel -->
		<div class="auth-banner-controls">
			<!-- Logout button component -->
			<Logout />

			<!-- If user is an admin -->
			{#if data?.isAdmin}
				<!-- Display link to admin panel -->
				<a href="/_cc_admin" class="button preset-filled-primary-500">Admin Panel</a>

			{:else}
				<!-- User is not an admin, display profile options link -->
				<!-- TODO: Create profile options page (due with user registration update). -->
				<button class="button preset-filled-secondary-500">Profile Options</button>
			{/if}
		</div>

	{:else}
		<!-- If users can register and no user is logged-in -->
		<!-- Card heading / call to action -->
		<!-- TODO: Make customizable -->
		<h5 class="auth-banner-title h5">Wanna join the community?</h5>

		<!-- Login button component (alos handles registration, if enabled) -->
		<Login {data} register={data?.settings?.user_register === true} />
	{/if}
</div>
{/if}

<style>
	.auth-banner {
		margin: 0 auto;
		padding-inline: calc(var(--spacing) * 6);
		padding-block: calc(var(--spacing) * 4);
		gap: calc(var(--spacing) * 4);
		display: flex;
		flex-direction: column;
		align-items: center;
		background: var(--color-surface-100-900);
		border-radius: var(--radius-lg);
	}

	.auth-banner-title {
		line-height: 1;
		text-wrap: pretty;
		text-align: center;
	}

	.auth-banner-controls {
		display: flex;
		gap: calc(var(--spacing) * 4);
	}
</style>