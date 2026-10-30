<script>

	import { formatDate } from "$lib/utils/date";


	import Image from "../Media/Image.svelte";


	let {
		data,
		href,
		showDate = false
	} = $props();

</script>


<li class="item-card">
	<a {href} class="item-card-link">
		<Image
			src="api/media/{data?.cover?.filename_disk}"
			alt=""
			wrapperClasses="item-card-image-container"
			class="item-card-image"
		/>
		<div class="item-card-info-container p-2 border-t border-surface-300-700 **:leading-none space-y-2">
			<div class="w-full flex flex-col gap-2">
				{#if data?.type}
					<p class="w-fit px-1 py-0.5 text-sm leading-none font-semibold preset-filled-primary-500 rounded-sm">{data?.type?.name}</p>
				{/if}
				<p class="font-bold text-lg truncate">{data?.name}</p>
			</div>
			{#if showDate}
				<p class="text-sm">Posted: {formatDate(data?.date_published)}</p>
			{/if}
		</div>
	</a>
</li>


<style>

	.item-card-link {
		overflow: hidden;
		display: grid;
		grid-template-rows: auto min-content;
		border-style: var(--tw-border-style);
  	border-width: 1px;
		border-color: var(--color-surface-200-800);
		border-radius: var(--radius-lg);

		&[href]:hover {
			opacity: .6;
		}
	}


	.item-card-image-container {
		aspect-ratio: 1;
		overflow: hidden;
		display: flex;
		align-items: center;
		background-color: var(--color-primary-100-900);
  	color: var(--color-primary-contrast-100-900);
	}


	.item-card-image {
		min-height: 100%;
		min-width: 100%;
		object-fit: cover;
	}




</style>