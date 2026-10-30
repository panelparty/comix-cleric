<script>
	// Svelte utilities
	
	// Utilities
	import { consoleError } from "$lib/utils/debug";
	import { checkNull } from "$lib/utils/detectTypes";
	import { isArray } from "lodash-es";
	import { untrack } from "svelte";

	// Props
	let {
		src,
		class: className,
		volume = $bindable(0.5),
		autoplay = false,
		loop = false,
		autoforward,
		fadeIn,
		fadeOut,
		crossfade,
		fadeDuration = 500,
		slim
	} = $props();

	// Component state
	let playlist = $derived.by(()=>{
		if (isArray(src)) {
			return src
		}
		return [src]
	});
	let state = $state('stopped');
	let volumeOpen = $state(false);
	let currentIndex = $state(0);
	let currentProgress = $state(0);
	let audioPlayer = $state(null);
	let currentTrack = $derived(checkNull(playlist?.[currentIndex]?.filename_disk));

	// Sync volume
	$effect(() => {
		if (audioPlayer) audioPlayer.volume = volume;
	});

	// TODO: Check if this is required.
	function setState() {
	  // There are 3 available states: 'playing', 'paused', 'stopped'
		state != 'playing' ? play() : pause();
	}

	$effect(() => {
		if (autoplay === true && audioPlayer) {
			untrack(() => play());
			state = 'playing';
		}
	});

	// Start playback
	function play() {
		audioPlayer?.play().catch((e) => {
			consoleError('Audio playback failed:', e);
			state = 'paused';
		});
	}

	// Set current track and start playback
	// TODO: Finish multi-track support
	function playSelectedtrack(event) {
		const trackIndex = +event.target.dataset.index;

		if (trackIndex === currentIndex) {
			return setState();
		}

		// Set current track
		currentIndex = trackIndex;
	}

	// Stop playback and keep progress
	function pause() {
		// Native pause action
		audioPlayer?.pause();

		// Set state
		state = 'paused';
	}

	// Stop playback and reset progress
	function stop() {
		// Pause playback
		pause();

		// Reset the track
		audioPlayer.currentTime = 0;

		// Set state
		state = 'stopped';
	}

	// Previous track
	function previous() {
		if (currentIndex <= 0) return;
		currentIndex -= 1;
	}

	// Next track
	function next() {
		if (currentIndex >= src.length - 1) return;
		currentIndex += 1;
	}
</script>

<!-- Native HTML audio element (hidden) -->
<audio
	bind:this={audioPlayer}
	src="/api/media/{currentTrack}"
	{loop}
	onplay={() => (state = 'playing')}
	onpause={() => (state = 'paused')}
	onended={() => (state = 'stopped')}
></audio>

<!-- Custom player UI -->
{#if src}
<div class="player {className}">
	<div class="src">
		{#each playlist as track, i}
  		<div class:playing={i === currentIndex} class="track">
				<i class="ph-bold ph-music-notes"></i>

    		<div class="player-controls">
					<!-- Play/pause button -->
					<button type="button" class="btn size-8 preset-filled-primary-500" data-index={i} onclick={setState} title="{state != 'playing' ? 'Play' : 'Pause'} track" aria-label="{state != 'playing' ? 'play' : 'pause'} track">
						<i class="ph-fill ph-{state != 'playing' ? 'play' : 'pause'}"></i>
					</button>

					<!-- Stop button -->
					<button type="button" class="btn size-8 preset-filled-primary-500" data-index={i} onclick={stop} title="Reset track" aria-label="Reset track" disabled={state === 'stopped'}>
						<i class="ph-fill ph-square"></i>
					</button>

					<!-- Volume button -->
					<div class="flex items-center gap-2">
						<!-- Mute/unmute button -->
						<button type="button" class="btn size-8 preset-filled-primary-500" onclick={()=>volumeOpen = !volumeOpen} title="{volumeOpen ? 'Close' : 'Open'} volume control" aria-label="{volumeOpen ? 'Close' : 'Open'} volume control">
							<i class="ph-fill ph-speaker-high"></i>
						</button>

						<!-- Volume slider wrapper -->
						<div class="volume-slider-wrapper" data-open={volumeOpen} role="button">
							<!-- Volume slider -->
							<input type="range" min="0" max="1.0" step="0.025" class="input" bind:value={volume}>
						</div>
					</div>
				</div>

				{#if !slim}
				<span class="track-title">{track?.filename_download}</span>
				{/if}
  		</div>
		{/each}
	</div>
</div>
{/if}

<style>
	.player-controls {
		display: flex;
		align-items: center;
		gap: calc(var(--spacing) * 2);
	}

	.track {
		display: flex;
		align-items: center;
		gap: calc(var(--spacing) * 2);
	}

	.track-title {
		font-weight: 500;
	}

	.volume-slider-wrapper {
		overflow: hidden;
		display: flex;
		align-items: center;
		transition: all 150ms ease;
	}
	.volume-slider-wrapper[data-open="false"] {
		width: 0;
	}
	.volume-slider-wrapper[data-open="true"] {
		width: fit-content;
	}
</style>