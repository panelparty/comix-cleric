<script>
	import { goto } from '$app/navigation';
	// Themes
	import { themes, customThemes } from '$lib/ThemeGenerator/utils/importer/skeleton-common';
	// Utilities
	import { importThemeV3 } from '$lib/ThemeGenerator/utils/importer/import-theme-v3';
	// import { importThemeV3Rc1 } from '$lib/utils/importer/import-theme-v3-rc1';
	// Components (skeleton)
	import { FileUpload } from '@skeletonlabs/skeleton-svelte';
	import { page } from '$app/stores';
    import ComingSoon from '$lib/components/Placeholders/ComingSoon.svelte';

	let {
		data
	} = $props();

	let userThemes = $derived.by(()=>{
		if (data?.themes?.length > 0) {
			return data?.themes.map((item)=>{
				return {
					label: item?.name,
					name: item?.slug,
					css: item?.code
				}
			});
		}
	});

	const defaultThemeName = 'cerberus';

	function resetToDefaults() {
		const defaultTheme = themes.find((t) => t.name === defaultThemeName);
		importThemeV3(defaultTheme.css, defaultThemeName);
	}

	function onSelectTemplate(fileCss, fileName, id) {
		// Reset to default theme
		if (fileName !== defaultThemeName) resetToDefaults(); page
		// Run template import
		importThemeV3(fileCss, fileName);
		// Redirect to Generator page
		goto(`/_cc_admin/settings/themes/generator/build`);
	}


	// @ts-expect-error type
	async function onFileUpload(event) {
		if (event.acceptedFiles.length <= 0) return;
		// Reset to default theme
		resetToDefaults();
		// Gather Theme Data
		const fileName = event.acceptedFiles[0].name;
		const file = event.acceptedFiles[0];
		const fileText = await file.text();
		const isCssFormat = fileName.includes('.css');

		// Run Importer
		importThemeV3(fileText, fileName);

		// Redirect to Generator page
		goto('/_cc_admin/settings/themes/generator/build');
	}
</script>

<div class="space-y-10">
	<div class="space-y-4">
		<h3 class="h3">Upload</h3>
		<!-- Upload -->
		<FileUpload
			name="file"
			accept=".css, .ts, .js"
			maxFiles={1}
			onFileChange={onFileUpload}
			label="Drag and Drop Theme"
			subtext="Accepts .css, .ts, or .js file formats."
			interfacePadding="py-8"
			classes="w-full"
		>
			{#snippet iconInterface()}<i class="ph-bold ph-upload text-xl"></i>{/snippet}
			{#snippet iconFile()}<i class="ph-bold ph-file"></i>{/snippet}
			{#snippet iconFileRemove()}<i class="ph-bold ph-trash"></i>{/snippet}
		</FileUpload>
	</div>
	<!-- Text -->
	<div class="flex flex-col gap-4">
		<h3 class="h3">My Themes</h3>
		<ComingSoon />
		<!-- Templates -->
		<!-- <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
			{#each userThemes as theme}
				<button
					data-theme={theme.name}
					class="w-full bg-surface-50-950 border border-surface-200-800 hover:border-surface-500 rounded-md overflow-hidden grid grid-cols-[1fr_auto] gap-4"
					onclick={() => onSelectTemplate(theme.css, theme.name)}
				>
					<h6 class="h6 px-2 text-left">{theme.label}</h6>
					<div class="grid grid-cols-7">
						<div class="aspect-[1/2] h-full bg-primary-500 border-[1px] border-black/10 transition-all"></div>
						<div class="aspect-[1/2] h-full bg-secondary-500 border-[1px] border-black/10 transition-all"></div>
						<div class="aspect-[1/2] h-full bg-tertiary-500 border-[1px] border-black/10 transition-all"></div>
						<div class="aspect-[1/2] h-full bg-success-500 border-[1px] border-black/10 transition-all"></div>
						<div class="aspect-[1/2] h-full bg-warning-500 border-[1px] border-black/10 transition-all"></div>
						<div class="aspect-[1/2] h-full bg-error-500 border-[1px] border-black/10 transition-all"></div>
						<div class="aspect-[1/2] h-full bg-surface-500 border-[1px] border-black/10 transition-all"></div>
					</div>
				</button>
			{/each}
		</div> -->
		<h3 class="h3">Templates</h3>
		<!-- Templates -->
		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
			{#each themes as theme}
				<button
					data-theme={theme.name}
					class="w-full bg-surface-50-950 border border-surface-200-800 hover:border-surface-500 rounded-md overflow-hidden grid grid-cols-[1fr_auto] gap-4"
					onclick={() => onSelectTemplate(theme.css, theme.name)}
				>
					<h6 class="h6 px-2 text-left">{theme.label}</h6>
					<div class="grid grid-cols-7">
						<div class="aspect-[1/2] h-full bg-primary-500 border-[1px] border-black/10 transition-all"></div>
						<div class="aspect-[1/2] h-full bg-secondary-500 border-[1px] border-black/10 transition-all"></div>
						<div class="aspect-[1/2] h-full bg-tertiary-500 border-[1px] border-black/10 transition-all"></div>
						<div class="aspect-[1/2] h-full bg-success-500 border-[1px] border-black/10 transition-all"></div>
						<div class="aspect-[1/2] h-full bg-warning-500 border-[1px] border-black/10 transition-all"></div>
						<div class="aspect-[1/2] h-full bg-error-500 border-[1px] border-black/10 transition-all"></div>
						<div class="aspect-[1/2] h-full bg-surface-500 border-[1px] border-black/10 transition-all"></div>
					</div>
				</button>
			{/each}
		</div>
		<h3 class="h3">Custom Templates</h3>
		<!-- Templates -->
		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
			{#each customThemes as theme}
				<button
					data-theme={theme.name}
					class="w-full bg-surface-50-950 border border-surface-200-800 hover:border-surface-500 rounded-md overflow-hidden grid grid-cols-[1fr_auto] gap-4"
					onclick={() => onSelectTemplate(theme.css, theme.name)}
				>
					<h6 class="h6 px-2 text-left">{theme.label}</h6>
					<div class="grid grid-cols-7">
						<div class="aspect-[1/2] h-full bg-primary-500 border-[1px] border-black/10 transition-all"></div>
						<div class="aspect-[1/2] h-full bg-secondary-500 border-[1px] border-black/10 transition-all"></div>
						<div class="aspect-[1/2] h-full bg-tertiary-500 border-[1px] border-black/10 transition-all"></div>
						<div class="aspect-[1/2] h-full bg-success-500 border-[1px] border-black/10 transition-all"></div>
						<div class="aspect-[1/2] h-full bg-warning-500 border-[1px] border-black/10 transition-all"></div>
						<div class="aspect-[1/2] h-full bg-error-500 border-[1px] border-black/10 transition-all"></div>
						<div class="aspect-[1/2] h-full bg-surface-500 border-[1px] border-black/10 transition-all"></div>
					</div>
				</button>
			{/each}
		</div>
	</div>
</div>
