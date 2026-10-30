<script lang="ts">
	// State
	import { globals } from '$lib/ThemeGenerator/state/generator.svelte';
	// Constants
	// Utilities
	import { find } from 'lodash-es';


	// Data
	export const palette = [
		{
			name: 'primary',
			ramp: [
				{ value: 50, base: 'bg-primary-50', contrast: 'text-primary-contrast-50', filled: 'preset-filled-primary-50-950', outlined: 'preset-outlined-primary-50-950' },
				{ value: 100, base: 'bg-primary-100', contrast: 'text-primary-contrast-100', filled: 'preset-filled-primary-100-900', outlined: 'preset-outlined-primary-100-900' },
				{ value: 200, base: 'bg-primary-200', contrast: 'text-primary-contrast-200', filled: 'preset-filled-primary-200-800', outlined: 'preset-outlined-primary-200-800' },
				{ value: 300, base: 'bg-primary-300', contrast: 'text-primary-contrast-300', filled: 'preset-filled-primary-300-700', outlined: 'preset-outlined-primary-300-700' },
				{ value: 400, base: 'bg-primary-400', contrast: 'text-primary-contrast-400', filled: 'preset-filled-primary-400-600', outlined: 'preset-outlined-primary-400-600' },
				{ value: 500, base: 'bg-primary-500', contrast: 'text-primary-contrast-500', filled: 'preset-filled-primary-500', outlined: 'preset-outlined-primary-500' },
				{ value: 600, base: 'bg-primary-600', contrast: 'text-primary-contrast-600', filled: 'preset-filled-primary-600-400', outlined: 'preset-outlined-primary-600-400' },
				{ value: 700, base: 'bg-primary-700', contrast: 'text-primary-contrast-700', filled: 'preset-filled-primary-700-300', outlined: 'preset-outlined-primary-700-300' },
				{ value: 800, base: 'bg-primary-800', contrast: 'text-primary-contrast-800', filled: 'preset-filled-primary-800-200', outlined: 'preset-outlined-primary-800-200' },
				{ value: 900, base: 'bg-primary-900', contrast: 'text-primary-contrast-900', filled: 'preset-filled-primary-900-100', outlined: 'preset-outlined-primary-900-100' },
				{ value: 950, base: 'bg-primary-950', contrast: 'text-primary-contrast-950', filled: 'preset-filled-primary-950-50', outlined: 'preset-outlined-primary-950-50' }
			]
		},
		{
			name: 'secondary',
			ramp: [
				{ value: 50, base: 'bg-secondary-50', contrast: 'text-secondary-contrast-50', filled: 'preset-filled-secondary-50-950', outlined: 'preset-outlined-secondary-50-950' },
				{ value: 100, base: 'bg-secondary-100', contrast: 'text-secondary-contrast-100', filled: 'preset-filled-secondary-100-900', outlined: 'preset-outlined-secondary-100-900' },
				{ value: 200, base: 'bg-secondary-200', contrast: 'text-secondary-contrast-200', filled: 'preset-filled-secondary-200-800', outlined: 'preset-outlined-secondary-200-800' },
				{ value: 300, base: 'bg-secondary-300', contrast: 'text-secondary-contrast-300', filled: 'preset-filled-secondary-300-700', outlined: 'preset-outlined-secondary-300-700' },
				{ value: 400, base: 'bg-secondary-400', contrast: 'text-secondary-contrast-400', filled: 'preset-filled-secondary-400-600', outlined: 'preset-outlined-secondary-400-600' },
				{ value: 500, base: 'bg-secondary-500', contrast: 'text-secondary-contrast-500', filled: 'preset-filled-secondary-500', outlined: 'preset-outlined-secondary-500' },
				{ value: 600, base: 'bg-secondary-600', contrast: 'text-secondary-contrast-600', filled: 'preset-filled-secondary-600-400', outlined: 'preset-outlined-secondary-600-400' },
				{ value: 700, base: 'bg-secondary-700', contrast: 'text-secondary-contrast-700', filled: 'preset-filled-secondary-700-300', outlined: 'preset-outlined-secondary-700-300' },
				{ value: 800, base: 'bg-secondary-800', contrast: 'text-secondary-contrast-800', filled: 'preset-filled-secondary-800-200', outlined: 'preset-outlined-secondary-800-200' },
				{ value: 900, base: 'bg-secondary-900', contrast: 'text-secondary-contrast-900', filled: 'preset-filled-secondary-900-100', outlined: 'preset-outlined-secondary-900-100' },
				{ value: 950, base: 'bg-secondary-950', contrast: 'text-secondary-contrast-950', filled: 'preset-filled-secondary-950-50', outlined: 'preset-outlined-secondary-950-50' }
			]
		},
		{
			name: 'tertiary',
			ramp: [
				{ value: 50, base: 'bg-tertiary-50', contrast: 'text-tertiary-contrast-50', filled: 'preset-filled-tertiary-50-950', outlined: 'preset-outlined-tertiary-50-950' },
				{ value: 100, base: 'bg-tertiary-100', contrast: 'text-tertiary-contrast-100', filled: 'preset-filled-tertiary-100-900', outlined: 'preset-outlined-tertiary-100-900' },
				{ value: 200, base: 'bg-tertiary-200', contrast: 'text-tertiary-contrast-200', filled: 'preset-filled-tertiary-200-800', outlined: 'preset-outlined-tertiary-200-800' },
				{ value: 300, base: 'bg-tertiary-300', contrast: 'text-tertiary-contrast-300', filled: 'preset-filled-tertiary-300-700', outlined: 'preset-outlined-tertiary-300-700' },
				{ value: 400, base: 'bg-tertiary-400', contrast: 'text-tertiary-contrast-400', filled: 'preset-filled-tertiary-400-600', outlined: 'preset-outlined-tertiary-400-600' },
				{ value: 500, base: 'bg-tertiary-500', contrast: 'text-tertiary-contrast-500', filled: 'preset-filled-tertiary-500', outlined: 'preset-outlined-tertiary-500' },
				{ value: 600, base: 'bg-tertiary-600', contrast: 'text-tertiary-contrast-600', filled: 'preset-filled-tertiary-600-400', outlined: 'preset-outlined-tertiary-600-400' },
				{ value: 700, base: 'bg-tertiary-700', contrast: 'text-tertiary-contrast-700', filled: 'preset-filled-tertiary-700-300', outlined: 'preset-outlined-tertiary-700-300' },
				{ value: 800, base: 'bg-tertiary-800', contrast: 'text-tertiary-contrast-800', filled: 'preset-filled-tertiary-800-200', outlined: 'preset-outlined-tertiary-800-200' },
				{ value: 900, base: 'bg-tertiary-900', contrast: 'text-tertiary-contrast-900', filled: 'preset-filled-tertiary-900-100', outlined: 'preset-outlined-tertiary-900-100' },
				{ value: 950, base: 'bg-tertiary-950', contrast: 'text-tertiary-contrast-950', filled: 'preset-filled-tertiary-950-50', outlined: 'preset-outlined-tertiary-950-50' }
			]
		},
		{
			name: 'success',
			ramp: [
				{ value: 50, base: 'bg-success-50', contrast: 'text-success-contrast-50', filled: 'preset-filled-success-50-950', outlined: 'preset-outlined-success-50-950' },
				{ value: 100, base: 'bg-success-100', contrast: 'text-success-contrast-100', filled: 'preset-filled-success-100-900', outlined: 'preset-outlined-success-100-900' },
				{ value: 200, base: 'bg-success-200', contrast: 'text-success-contrast-200', filled: 'preset-filled-success-200-800', outlined: 'preset-outlined-success-200-800' },
				{ value: 300, base: 'bg-success-300', contrast: 'text-success-contrast-300', filled: 'preset-filled-success-300-700', outlined: 'preset-outlined-success-300-700' },
				{ value: 400, base: 'bg-success-400', contrast: 'text-success-contrast-400', filled: 'preset-filled-success-400-600', outlined: 'preset-outlined-success-400-600' },
				{ value: 500, base: 'bg-success-500', contrast: 'text-success-contrast-500', filled: 'preset-filled-success-500', outlined: 'preset-outlined-success-500' },
				{ value: 600, base: 'bg-success-600', contrast: 'text-success-contrast-600', filled: 'preset-filled-success-600-400', outlined: 'preset-outlined-success-600-400' },
				{ value: 700, base: 'bg-success-700', contrast: 'text-success-contrast-700', filled: 'preset-filled-success-700-300', outlined: 'preset-outlined-success-700-300' },
				{ value: 800, base: 'bg-success-800', contrast: 'text-success-contrast-800', filled: 'preset-filled-success-800-200', outlined: 'preset-outlined-success-800-200' },
				{ value: 900, base: 'bg-success-900', contrast: 'text-success-contrast-900', filled: 'preset-filled-success-900-100', outlined: 'preset-outlined-success-900-100' },
				{ value: 950, base: 'bg-success-950', contrast: 'text-success-contrast-950', filled: 'preset-filled-success-950-50', outlined: 'preset-outlined-success-950-50' }
			]
		},
		{
			name: 'warning',
			ramp: [
				{ value: 50, base: 'bg-warning-50', contrast: 'text-warning-contrast-50', filled: 'preset-filled-warning-50-950', outlined: 'preset-outlined-warning-50-950' },
				{ value: 100, base: 'bg-warning-100', contrast: 'text-warning-contrast-100', filled: 'preset-filled-warning-100-900', outlined: 'preset-outlined-warning-100-900' },
				{ value: 200, base: 'bg-warning-200', contrast: 'text-warning-contrast-200', filled: 'preset-filled-warning-200-800', outlined: 'preset-outlined-warning-200-800' },
				{ value: 300, base: 'bg-warning-300', contrast: 'text-warning-contrast-300', filled: 'preset-filled-warning-300-700', outlined: 'preset-outlined-warning-300-700' },
				{ value: 400, base: 'bg-warning-400', contrast: 'text-warning-contrast-400', filled: 'preset-filled-warning-400-600', outlined: 'preset-outlined-warning-400-600' },
				{ value: 500, base: 'bg-warning-500', contrast: 'text-warning-contrast-500', filled: 'preset-filled-warning-500', outlined: 'preset-outlined-warning-500' },
				{ value: 600, base: 'bg-warning-600', contrast: 'text-warning-contrast-600', filled: 'preset-filled-warning-600-400', outlined: 'preset-outlined-warning-600-400' },
				{ value: 700, base: 'bg-warning-700', contrast: 'text-warning-contrast-700', filled: 'preset-filled-warning-700-300', outlined: 'preset-outlined-warning-700-300' },
				{ value: 800, base: 'bg-warning-800', contrast: 'text-warning-contrast-800', filled: 'preset-filled-warning-800-200', outlined: 'preset-outlined-warning-800-200' },
				{ value: 900, base: 'bg-warning-900', contrast: 'text-warning-contrast-900', filled: 'preset-filled-warning-900-100', outlined: 'preset-outlined-warning-900-100' },
				{ value: 950, base: 'bg-warning-950', contrast: 'text-warning-contrast-950', filled: 'preset-filled-warning-950-50', outlined: 'preset-outlined-warning-950-50' }
			]
		},
		{
			name: 'error',
			ramp: [
				{ value: 50, base: 'bg-error-50', contrast: 'text-error-contrast-50', filled: 'preset-filled-error-50-950', outlined: 'preset-outlined-error-50-950' },
				{ value: 100, base: 'bg-error-100', contrast: 'text-error-contrast-100', filled: 'preset-filled-error-100-900', outlined: 'preset-outlined-error-100-900' },
				{ value: 200, base: 'bg-error-200', contrast: 'text-error-contrast-200', filled: 'preset-filled-error-200-800', outlined: 'preset-outlined-error-200-800' },
				{ value: 300, base: 'bg-error-300', contrast: 'text-error-contrast-300', filled: 'preset-filled-error-300-700', outlined: 'preset-outlined-error-300-700' },
				{ value: 400, base: 'bg-error-400', contrast: 'text-error-contrast-400', filled: 'preset-filled-error-400-600', outlined: 'preset-outlined-error-400-600' },
				{ value: 500, base: 'bg-error-500', contrast: 'text-error-contrast-500', filled: 'preset-filled-error-500', outlined: 'preset-outlined-error-500' },
				{ value: 600, base: 'bg-error-600', contrast: 'text-error-contrast-600', filled: 'preset-filled-error-600-400', outlined: 'preset-outlined-error-600-400' },
				{ value: 700, base: 'bg-error-700', contrast: 'text-error-contrast-700', filled: 'preset-filled-error-700-300', outlined: 'preset-outlined-error-700-300' },
				{ value: 800, base: 'bg-error-800', contrast: 'text-error-contrast-800', filled: 'preset-filled-error-800-200', outlined: 'preset-outlined-error-800-200' },
				{ value: 900, base: 'bg-error-900', contrast: 'text-error-contrast-900', filled: 'preset-filled-error-900-100', outlined: 'preset-outlined-error-900-100' },
				{ value: 950, base: 'bg-error-950', contrast: 'text-error-contrast-950', filled: 'preset-filled-error-950-50', outlined: 'preset-outlined-error-950-50' }
			]
		},
		{
			name: 'surface',
			ramp: [
				{ value: 50, base: 'bg-surface-50', contrast: 'text-surface-contrast-50', filled: 'preset-filled-surface-50-950', outlined: 'preset-outlined-surface-50-950' },
				{ value: 100, base: 'bg-surface-100', contrast: 'text-surface-contrast-100', filled: 'preset-filled-surface-100-900', outlined: 'preset-outlined-surface-100-900' },
				{ value: 200, base: 'bg-surface-200', contrast: 'text-surface-contrast-200', filled: 'preset-filled-surface-200-800', outlined: 'preset-outlined-surface-200-800' },
				{ value: 300, base: 'bg-surface-300', contrast: 'text-surface-contrast-300', filled: 'preset-filled-surface-300-700', outlined: 'preset-outlined-surface-300-700' },
				{ value: 400, base: 'bg-surface-400', contrast: 'text-surface-contrast-400', filled: 'preset-filled-surface-400-600', outlined: 'preset-outlined-surface-400-600' },
				{ value: 500, base: 'bg-surface-500', contrast: 'text-surface-contrast-500', filled: 'preset-filled-surface-500', outlined: 'preset-outlined-surface-500' },
				{ value: 600, base: 'bg-surface-600', contrast: 'text-surface-contrast-600', filled: 'preset-filled-surface-600-400', outlined: 'preset-outlined-surface-600-400' },
				{ value: 700, base: 'bg-surface-700', contrast: 'text-surface-contrast-700', filled: 'preset-filled-surface-700-300', outlined: 'preset-outlined-surface-700-300' },
				{ value: 800, base: 'bg-surface-800', contrast: 'text-surface-contrast-800', filled: 'preset-filled-surface-800-200', outlined: 'preset-outlined-surface-800-200' },
				{ value: 900, base: 'bg-surface-900', contrast: 'text-surface-contrast-900', filled: 'preset-filled-surface-900-100', outlined: 'preset-outlined-surface-900-100' },
				{ value: 950, base: 'bg-surface-950', contrast: 'text-surface-contrast-950', filled: 'preset-filled-surface-950-50', outlined: 'preset-outlined-surface-950-50' }
			]
		}
	];

	
	let currentColor = $derived.by(()=>{
		return find(palette, {name: globals.activeColor});
	});
</script>

<div class="space-y-6">
	<!-- Palette -->
	<section class="grid grid-cols-1 xl:grid-cols-7">
		{#each palette as color}
			<div class="space-y-4">
				<strong class="block text-center opacity-60 capitalize">{color.name}</strong>
				<div class="grid grid-rows-11">
					<!-- Color Ramp -->
					{#each color.ramp as shade}
						<div class={`${shade.base} `}>
							<span class="flex items-center justify-center py-2 font-bold text-xs {shade.contrast}" class:underline={shade.value === 500}>
								{shade.value}
							</span>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</section>
	<!-- Presets: Filled -->
	<section class="space-y-2">
		<h5>Filled</h5>
		<div class="w-full grid grid-cols-11 gap-4">
			{#each currentColor?.ramp as shade}
			<div class="aspect-square rounded-full flex justify-center items-center {shade?.filled}">
				<i class="ph-bold ph-swatches text-xl"></i>
			</div>
			{/each}
		</div>
	</section>
	<!-- Presets: Outlined -->
	<section class="space-y-2">
		<h5>Outlined</h5>
		<div class="w-full grid grid-cols-11 gap-4">
			{#each currentColor?.ramp as shade}
			<div class="aspect-square rounded-full flex justify-center items-center {shade?.outlined}">
				<i class="ph-bold ph-swatches text-xl"></i>
			</div>
			{/each}
		</div>
	</section>
	<!-- Presets: Tonal -->
	<section class="space-y-2">
		<h5>Tonal</h5>
		<div class="w-full grid grid-cols-11 gap-4">
			<div class="aspect-square rounded-full flex justify-center items-center preset-tonal-primary"><i class="ph-bold ph-swatches text-xl"></i></div>
			<div class="aspect-square rounded-full flex justify-center items-center preset-tonal-secondary"><i class="ph-bold ph-swatches text-xl"></i></div>
			<div class="aspect-square rounded-full flex justify-center items-center preset-tonal-tertiary"><i class="ph-bold ph-swatches text-xl"></i></div>
			<div class="aspect-square rounded-full flex justify-center items-center preset-tonal-success"><i class="ph-bold ph-swatches text-xl"></i></div>
			<div class="aspect-square rounded-full flex justify-center items-center preset-tonal-warning"><i class="ph-bold ph-swatches text-xl"></i></div>
			<div class="aspect-square rounded-full flex justify-center items-center preset-tonal-error"><i class="ph-bold ph-swatches text-xl"></i></div>
			<div class="aspect-square rounded-full flex justify-center items-center preset-tonal"><i class="ph-bold ph-swatches text-xl"></i></div>
		</div>
	</section>
</div>
