<script>
  // Utilities
	import { ATProtoAgent } from '$lib/utils/integrations/atproto';
	import { parseCustomTags } from '$lib/utils/data/customTags';
	import { renderMarkdown } from '$lib/utils/sanitize/output';

	// Components
  import Loader from '../Placeholders/Loader.svelte';
	import SectionHeading from '../DataBlocks/SectionHeading.svelte';
	import ProfileCompact from '../User/ProfileCompact.svelte';
	import NotFound from '../Placeholders/NotFound.svelte';

	// Props
	let {
		data,
		linkClasses,
		cardClasses,
		headerClasses,
		bodyClasses,
		mediaClasses,
		direction = "vertical"
	} = $props();

	// Destructure server data
	let show = $derived(data?.settings?.bsky_feed ?? false);
	let provider = $derived(data?.settings?.bsky_feed_provider ?? "");
	let handle = $derived(data?.settings?.bsky_handle ?? '');
	let feedLimit = $derived(data?.settings?.bsky_feed_limit ?? 6);
	let message = $derived(data?.settings?.bsky_feed_message ?? "");

	// Create a promise that will return the feed data
	const postsPromise = ATProtoAgent()
		// Get data from account
		.getAuthorFeed({
  		actor: handle,
			limit: feedLimit,
			filter: 'posts_with_media',
			includePins: true
		})
		// Transform data
		.then((result) => {
			return result.data.feed
		});
</script>

<!-- Container -->
{#if show}
<div class="bsky-feed-container">
	<!-- Heading -->
	<SectionHeading heading="Bluesky Feed" color="primary" />

	<div class="bsky-feed-list" data-direction={direction}>
	{#await postsPromise}
		<!-- While waiting for posts, display laoder component -->
		<Loader />
	{:then posts}
		<!-- Once posts have returned, dsiplay a list of posts -->
		{#each posts as item (item.post.cid)}
			<a href="https://bsky.app/profile/{item.post.author.handle}/post/{item.post.uri.split('/').at(-1)}" target="_blank" class="bsky-feed-post-link {linkClasses}">
				<div class="bsky-feed-post-container {cardClasses}">
					{#if item?.reason?.$type.includes("reasonRepost")}
						<p class="display-date"><i class="ph-bold ph-arrows-counter-clockwise"></i> Repost</p>
					{/if}

					<div class="bsky-feed-post-header {headerClasses}">
						<ProfileCompact user={item.post?.author} avatar={item.post.author.avatar} size="small" />

						<small class="display-date">{new Date(item.post.record.createdAt).toLocaleString()}</small>
					</div>
					<p class="{bodyClasses}">{item.post.record.text}</p>
					<div class="bsky-feed-media-container {mediaClasses}">
						{#if item.post.embed}
							{#if item.post.embed.$type.includes('external')}
								<div class="bsky-feed-embed-container">
									{#if item.post.embed.external.thumb}
										<img
											class="bsky-feed-media"
											src={item.post.embed.external.thumb}
											alt={item.post.embed.external.title}
										/>
									{:else}
										<div class="bsky-feed-embed-title">
											{item.post.embed.external.title}
										</div>
									{/if}
								</div>
							{:else if item.post.embed.$type.includes('images')}
								{#each item.post.embed.images as image}
									<img class="bsky-feed-media" src={image.thumb} alt={image.alt} />
								{/each}
							{:else if item.post.embed.$type.includes('video')}
								<p class="display-date">View video on Bluesky!</p>
							{/if}
						{/if}
					</div>
				</div>
			</a>
		{/each}

		<!-- Feed End Message -->
		<h4 class="button bsky-feed-end-message">{@html renderMarkdown(parseCustomTags(data, message ?? ""))?.html}</h4>
	{:catch error}
		<!-- If the request failed, display an error message -->
		<NotFound label={error?.message} />
	{/await}
	</div>
</div>
{/if}

<style>
	.bsky-feed-container {
		width: 100%;
		max-width: var(--container-3xl);
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: calc(var(--spacing) * 4);
	}

	.bsky-feed-list {
		position: relative;
		background: var(--color-surface-50-950);
		width: 100%;
		padding: calc(var(--spacing) * 2);
		margin: 0 auto;
		border-width: var(--default-border-width);
		border-color: var(--color-surface-200-800);
		border-radius: var(--radius-xl);
		display: flex;
		flex-direction: column;
		gap: calc(var(--spacing) * 2);
		overflow-y: auto;
		aspect-ratio: 4/5;
	}
	.bsky-feed-list[data-direction="x"] {
		overflow-y: hidden;
		overflow-x: auto;
		aspect-ratio: 5/4;
	}

	.bsky-feed-post-link {
		display: block;
		width: auto;
	}

	.bsky-feed-post-container {
		padding: calc(var(--spacing) * 4);
		display: flex;
		flex-direction: column;
		gap: calc(var(--spacing) * 4);
		border-width: var(--default-border-width);
		border-radius: var(--radius-lg);

		&:hover {
			background: var(--color-surface-100-900);
		}
	}

	.bsky-feed-post-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.bsky-feed-media-container {
		display: grid;
		grid-template-columns: repeat(1, minmax(0, 1fr));
		gap: calc(var(--spacing) * 2);
	}

	.bsky-feed-media {
		width: 100%;
		background: var(--color-surface-100-900);
		border-width: var(--default-border-width);
		border-radius: var(--radius-container);
		overflow: hidden;
	}

	.bsky-feed-embed-title {
		padding: calc(var(--spacing) * 4);
		color: var(--color-surface-800-200);
	}

	.bsky-feed-end-message {
		background: var(--color-surface-100-900);
		width: fit-content;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: calc(var(--spacing) * 4);
		font-weight: 700;
	}
</style>