<script>

	// Components 
	import Image from "$lib/components/Media/Image.svelte";


	// Props
	let {
		img
	} = $props();

</script>
<div class="flex gap-2">
	<Image src="/api/media/{img?.filename_disk}" alt="Favicon preview small" wrapperClasses="size-6! overflow-hidden flex items-center bg-surface-200-800 rounded-md pattern-checker border" class="max-h-full max-w-full object-cover" />
	<Image src="/api/media/{img?.filename_disk}" alt="Favicon preview medium" wrapperClasses="size-10! overflow-hidden flex items-center bg-surface-200-800 rounded-md pattern-checker border" class="max-h-full max-w-full object-cover" />
	<Image src="/api/media/{img?.filename_disk}" alt="Favicon preview large" wrapperClasses="size-16! overflow-hidden flex items-center bg-surface-200-800 rounded-md pattern-checker border" class="max-h-full max-w-full object-cover" />
</div>