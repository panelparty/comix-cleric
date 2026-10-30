<script>

	import ThemeForm from '$lib/components/Admin/Forms/ThemeForm.svelte';

	let { data } = $props();

</script>

<section class="w-[100cqi] h-[100cqb] max-w-5xl mx-auto space-y-2 sm:space-y-4 grid grid-rows-1 overflow-hidden">
	<ThemeForm {data} />
</section>