<script>
	// Components
	import { renderMarkdown } from "$lib/utils/sanitize/output";
	import Author from "../User/Author.svelte";
	import Tooltip from "./Tooltip.svelte";

	let {
		data
	} = $props();
</script>

{#if data && data?.length > 0}
<div class="post-contributors w-full p-2">
	<p class="label">Created by:</p>
	<div class="gap-container" style="--gap: 0;">
		{#each data as user, i}
			<Tooltip triggerClasses="text-secondary-500 hover:text-secondary-700-300 font-bold" contentClasses="p-2!">
				{#snippet trigger()}
					{user?.user_id?.displayname ?? user?.guest_id?.displayname}
				{/snippet}
				{#snippet content()}
					<!-- Author info component -->
					<Author avatarSize='size-16' class="max-w-full" role data={user?.user_id ?? user?.guest_id} />
					<!-- If the contributor has written a bio -->
					{#if user?.user_id?.description ?? user?.guest_id?.description}
						<aside class="text-surface-50 bg-surface-800 p-2 leading-tight w-full rounded-lg">
							<!-- Safely render description -->
							<div class="prose-override text-sm">
								{@html renderMarkdown(user?.user_id?.description ?? user?.guest_id?.description ?? '')?.html}
							</div>
						</aside>
					{/if}
				{/snippet}
			</Tooltip>
		{/each}
	</div>
</div>
{/if}