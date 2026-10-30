<script>
  // Svelte utilities
  import { afterNavigate } from '$app/navigation';
  import { browser } from '$app/env';
  import { onMount, onDestroy } from 'svelte';
  import { consoleWarn } from '$lib/utils/debug';

  // Props
  let {
    children,
    class: className,
    backgroundColor,
    controls,
    showControls = true,
    exitOnEscape = true,
    isFullscreen = $bindable(false),
    maxHeight = 'calc(var(--spacing) * 128)',
    ...restProps
  } = $props();

  // Component state
  let isSupported = $state(false);
  let container = $state(null);
  let wakeLock = $state(null);
  
  // iOS fullscreen fallbacks
  let useCssFallback = $state(false);
  let scrollY = 0;
  let scrollX = 0;

  // Detect iOS devices
  function isIOS() {
    return /iP(hone|od|ad)/.test(navigator.platform) ||
      (navigator.userAgent.includes("Mac") && "ontouchend" in document);
  }

  // Disable normal page scroll
  function lockBodyScroll() {
    scrollY = window.scrollY;
    if (!browser || !document) return;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = `-${scrollY}px`;
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
  }

  // Enable normal page scroll
  function unlockBodyScroll() {
    if (!browser || !document || !window) return;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.overflow = '';
    window.scrollTo(0, scrollY);
  }

  // Check if fullscreen and orientation APIs are supported
  onMount(() => {
    isSupported = !!(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    );

    if (!isSupported && isIOS()) {
      useCssFallback = true;
      isSupported = true;
    }

    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );

      if (!isFullscreen) {
        // unlockOrientation();
        unlockBodyScroll();
        releaseWakeLock();
      }
    };

    // Add event listeners to check for updates to the fullscreen state
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    // Handle escape key
    const handleKeyDown = (event) => {
      if (exitOnEscape && event.key === 'Escape' && isFullscreen) {
        exitFullscreen();
      }
    };
    if (exitOnEscape) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      if (exitOnEscape) {
        document.removeEventListener('keydown', handleKeyDown);
      }
      releaseWakeLock();
    };
  });
  
  // Exit fullscreen when unloading component
  onDestroy(() => {
    if (isFullscreen) {
      exitFullscreen();
    }
    releaseWakeLock();
    unlockBodyScroll();
  });

  // Fullscreen functions
  async function enterFullscreen() {
    if (!container || !isSupported) return;

    if (useCssFallback) {
      isFullscreen = true;
      await requestWakeLock();
      lockBodyScroll();
      return;
    }

    try {
      if (container.requestFullscreen) {
        await container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        await container.webkitRequestFullscreen();
      } else if (container.mozRequestFullScreen) {
        await container.mozRequestFullScreen();
      } else if (container.msRequestFullscreen) {
        await container.msRequestFullscreen();
      }

      // await lockOrientation();
      await requestWakeLock();
      lockBodyScroll();
    } catch (e) {
      consoleWarn('Failed to enter fullscreen:', e);
    }
  }

  // Exit fullscreen mode
  async function exitFullscreen() {
    if (useCssFallback) {
      isFullscreen = false;
      releaseWakeLock();
      unlockBodyScroll();
      return;
    }

    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
    } catch (e) {
      consoleWarn('Failed to exit fullscreen:', e);
    }
  }

  // Disable screen rotation
  async function lockOrientation() {
    if (screen.orientation && screen.orientation.lock) {
      try {
        await screen.orientation.lock('landscape');
      } catch (e) {
        consoleWarn('Failed to lock orientation:', e);
      }
    }
  }

  // Enable screen rotation
  function unlockOrientation() {
    if (screen.orientation && screen.orientation.unlock) {
      try {
        screen.orientation.unlock();
      } catch (e) {
        consoleWarn('Failed to unlock orientation:', e);
      }
    }
  }

  // Disable screen sleeping
  async function requestWakeLock() {
    if ('wakeLock' in navigator) {
      try {
        wakeLock = await navigator.wakeLock.request('screen');
      } catch (e) {
        consoleWarn('Failed to request wake lock:', e);
      }
    }
  }

  // Enable screen sleeping
  function releaseWakeLock() {
    if (wakeLock) {
      wakeLock.release();
      wakeLock = null;
    }
  }

  // Toggle fullscreen state
  function toggleFullscreen() {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }

  // Scroll to top
  afterNavigate(()=>{
		window.scrollTo(0, 0);
	});

  // Handle value changes
  function updateValue() {
    onUpdate(isFullscreen);
  }
</script>

<!-- Mobile reader component container -->
<div
  bind:this={container}
  class="fullscreen-container {className}"
  style="var(--reader-bg: {backgroundColor};)"
  data-fullscreen={isFullscreen}
  data-ios={isIOS()}
  {...restProps}
>
  <!-- Fullscreen contents -->
  {@render children?.()}

  <!-- Controls -->
  {#if showControls}
    <div
      class="fullscreen-controls"
      data-fullscreen={isFullscreen}
    >
      <!-- Fullscreen toggle -->
      <!-- (Controls will appear in reverse order) -->
      <button
        type="button"
        onclick={toggleFullscreen}
        disabled={!isSupported}
        class="overlay-button square"
        title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      >
        {#if isFullscreen}
          <i class="ph-bold ph-corners-in"></i>
        {:else}
          <i class="ph-bold ph-corners-out"></i>
        {/if}
      </button>

      <!-- Audio player -->
      {#if controls}
      <div class="">
        {@render controls?.()}
      </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  :root {
    --max-height: auto;
    --reader-bg: black;
  }

  .fullscreen-container {
    background: var(--reader-bg);
    position: relative;
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    grid-template-rows: repeat(1, minmax(0, 1fr));
    width: 100%;
    height: fit-content;
    max-height: auto;
  }
  .fullscreen-container[data-format="strip"][data-fullscreen="false"] {
    max-height: var(--max-height);
  }
  .fullscreen-container[data-fullscreen="true"] {
    inset: 0;
    width: 100vw;
    height: 100%;
    max-height: 100dvh;
    z-index: 50;
  }

  /* iOS fixes */
  .fullscreen-container[data-fullscreen][data-ios] {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }

  .fullscreen-controls {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: calc(var(--spacing) * 2);
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    z-index: 999;

    &.fullscreen {
      padding: calc(var(--spacing) * 4);
    }
  }
  .fullscreen-container:hover .fullscreen-controls {
    opacity: 1;
  }
</style>
