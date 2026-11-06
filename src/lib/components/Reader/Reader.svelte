<script>
  // Svelte utilities
  import { afterNavigate } from "$app/navigation";

  // Utilities
  import { getDeviceType } from "$lib/utils/device";
  import { screen } from "$lib/utils/breakpoints";
  
  // Components
  import FullscreenContainer from "./FullscreenContainer.svelte";
  import ProseContainer from "../DataBlocks/ProseContainer.svelte";
  import VideoEmbed from "../Admin/Inputs/VideoEmbed.svelte";
  import Image from "../Media/Image.svelte";
  import ReaderNav from "./ReaderNav.svelte";
  import Section from "../DataBlocks/Section.svelte";
  import AudioPlayer from "../Admin/AudioPlayer.svelte";

  // Props
  let {
    data,
    media,
    nav,
    audioPlayer,
    class: className,
    children,
    firstUpdate,
    prevUpdate,
    currentUpdate,
    nextUpdate,
    lastUpdate,
    sticky = true,
    preview,
    format_strip,
    readerWidth = "100%",
    maxHeight = 'calc(var(--spacing) * 180)',
  } = $props();


  let mediaItems = $derived.by(()=>{
    if (typeof media === 'string') {
      return JSON.parse(media, null, 2);
    } else if (typeof media === 'object') {
      return media;
    } else {
      return [];
    }
  });

  // Reactively check current device type
  let device = $derived.by(()=>getDeviceType());

  // Setup default video aspect ratio
  let aspect = $state(16/9);

  // Get video aspect ratio from YouTube API
  async function videoAspect(url) {
    const res = await fetch(`https://www.youtube.com/oembed?url=${url}&format=json`);
    const json = await res.json();
    const w = json?.width;
    const h = json?.height;
    const ratio = w / h;
    return ratio;
  }

  // Keep aspect ratio in-sync
  $effect(async () => {
    if (data?.video_url && data?.video_url != '') {
      aspect = (await videoAspect(data?.video_url)).toString();
    }
  });

  // Setup for device state
  let isFullscreen = $state(false);
  let mobileScroll = $state();

  // When navigating to a new page
  afterNavigate(() => {
    if (mobileScroll) {
      // Reset scroll
      mobileScroll.scrollTo(0, 0);
    }
  });

  // Apply custom CSS styles
  let styles = $derived.by(()=>{
    let css = `<style>`

    for (let i = 0; i < mediaItems?.length; i++) {
      css += `.${mediaItems[i]?.id} {
        ${mediaItems[i]?.css}
      }`
    }

    css += `</style>`;

    return css;
  });
</script>

<!-- Inject custom CSS -->
<svelte:head>
  {@html styles}
</svelte:head>

<!-- Reader section container -->
<Section
  class="reader-section {className}"
  data-fullscreen={isFullscreen}
  data-layout={preview ? "preview" : "default"}
  data-format={format_strip ? 'strip' : 'default'}
  wrapperWidth={readerWidth}
  style="--reader-width: {readerWidth}; --max-height: {maxHeight}; --item-count: {mediaItems?.length ?? 1};"
>
  <!-- Main reader media container -->
  <!-- TODO: Finialize adding custom background color. -->
  <article
    class="reader-container"
  >
    <!-- Display a reader navigation bar here -->
    {#if !preview}
    <ReaderNav
      {data}
      count={data?.numberedUpdates}
      firstUpdate={firstUpdate}
      prevUpdate={prevUpdate}
      currentUpdate={currentUpdate}
      nextUpdate={nextUpdate}
      lastUpdate={lastUpdate}
      thin={!screen.md.current}
    />
    {/if}
    {#if mediaItems?.length > 0}
      <!-- Display reader modal component -->
      <FullscreenContainer
        class="reader-fullscreen-container"
        {maxHeight}
        data-format={format_strip ? 'strip' : 'default'}
        bind:isFullscreen
        style="--reader-width: {readerWidth}; --max-height: {maxHeight}; --item-count: {mediaItems?.length ?? 1};"
      >
        <!-- Controls -->
        {#snippet controls()}
          <!-- Audio preview -->
          {#if !preview}
          <AudioPlayer
            class="overlay-button"
            src={data?.audio}
            loop={data?.audio_loop}
            autoplay={data?.audio_autoplay}
            volume={data?.audio_volume}
            slim
          />
          {/if}
        {/snippet}

        <div class="reader-media-container">
          <!-- Render any provided elements -->
          {@render children?.()}

          <!-- Media list -->
          <div
            class="reader-media-list"
            bind:this={mobileScroll}
          >
          <!-- Reader nav slot -->
          {#each mediaItems as item, i}
            <!-- Full-width image -->
            {#if item.type === 'media'}
              <Image
                src="/api/media/{item?.media?.filename_disk}"
                alt={item?.media?.alt}
                title={item?.hoverText}
                wrapperClasses="reader-media-item-wrapper {item?.id}"
                class="reader-media-item"
              />
            {:else if item.type === 'text'}
              <ProseContainer
                data={item?.media?.body}
                class={item?.id}
              />
            {:else if item.type === 'video-embed'}
              <VideoEmbed
                src={item?.media?.url}
                class={item?.id}
                autoplay={item?.media?.autoplay}
              />
            {/if}
          {/each}
          </div>

          <!-- Bottom nav (fullscreen) -->
          {#if isFullscreen && !preview}
            <ReaderNav
              {data}
              count={data?.numberedUpdates}
              firstUpdate={firstUpdate}
              prevUpdate={prevUpdate}
              currentUpdate={currentUpdate}
              nextUpdate={nextUpdate}
              lastUpdate={lastUpdate}
              thin={!screen.md.current}
            />
          {/if}
        </div>
      </FullscreenContainer>

      <!-- Bottom nav -->
      {#if !isFullscreen && !preview}
        <ReaderNav
          {data}
          count={data?.numberedUpdates}
          firstUpdate={firstUpdate}
          prevUpdate={prevUpdate}
          currentUpdate={currentUpdate}
          nextUpdate={nextUpdate}
          lastUpdate={lastUpdate}
          thin={!screen.md.current}
          sticky
        />
      {/if}
    {/if}
  </article>
</Section>

<style>
  :global {
    .reader-section {
      display: flex;
      flex-direction: column;
      gap: calc(var(--spacing) * 2);

      @media (width >= 64rem) {
        gap: calc(var(--spacing) * 4);
      }
    }

    .reader-container {
      position: relative;
      height: 100%;
      width: 100%;
      max-width: min(100%, var(--reader-width));
      margin: 0 auto;
    }
    
    .reader-fullscreen-container {
      max-width: min(100%, var(--reader-width));
    }

    .reader-media-container {
      width: 100%;
      height: fit-content;
      display: grid;
      grid-template-columns: repeat(1, minmax(0, 1fr));
      grid-template-rows: repeat(1, minmax(0, 1fr));
    }
    
    .reader-media-list {
      height: fit-content;
      display: grid;
      grid-template-columns: repeat(1, minmax(0, 1fr));
      grid-template-rows: repeat(var(--item-count), auto);
      align-items: center;
      overflow: hidden;
    }

    .reader-media-item-wrapper {
      max-height: 100%;
      width: 100%;
      max-width: min(100%, var(--reader-width));
      margin: 0 auto;
    }

    .reader-media-item {
      max-height: 100%;
      width: 100%;
      max-width: min(100%, var(--reader-width));
    }

    [data-format="strip"] {
      .reader-container {
        max-width: fit-content;
      }

      .reader-fullscreen-container {
        height: 100%;
      }
  
      .reader-media-list {
        height: var(--max-height);
        width: 100%;
        max-height: var(--max-height);
        grid-template-columns: repeat(var(--item-count), max-content);
        grid-template-rows: repeat(1, minmax(0, 1fr));
        overflow-x: auto;
        overflow-y: hidden;
      }

      .reader-media-item-wrapper {
        height: 100%;
        width: fit-content;
        max-width: fit-content;
        display: grid;
        grid-template-rows: repeat(1, minmax(0, 1fr));
      }

      .reader-media-item {
        width: auto;
        height: 100%;
        max-height: var(--max-height);
        max-width: unset;
      }
    }

    [data-fullscreen="true"] {
      .reader-media-container {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: 1fr min-content;
      }
  
      .reader-media-list {
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
      }
      
      .reader-media-item {
        width: 100%;
        height: auto;
      }
    }
    
    [data-format="strip"][data-fullscreen="true"] {
      .reader-media-list {
        max-height: 100%;
        overflow-x: auto;
        overflow-y: hidden;
      }

      .reader-media-item-wrapper {
        width: auto;
        max-width: max-content;
        height: min(100%, var(--max-height));
        max-height: min(100%, var(--max-height));
        margin: 0 auto;
      }
      
      .reader-media-item {
        width: auto;
        max-width: max-content;
        height: min(100%, var(--max-height));
        max-height: min(100%, var(--max-height));
      }
    }

    [data-layout="preview"] {
      &.reader-section,
      &.reader-section .section-wrapper {
        height: 100%;
        overflow: hidden;
        display: grid;
        grid-template-columns: repeat(1, minmax(0, 1fr));
        grid-template-rows: repeat(1, minmax(0, 1fr));
      }

      .reader-media-container,
      .reader-fullscreen-container {
        height: 100%;
        overflow: hidden;
      }

      .reader-media-list {
        max-height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
      }
    }
    [data-layout="preview"][data-format="strip"] {
      &.reader-section,
      &.reader-section .section-wrapper {
        height: 100%;
        overflow: hidden;
        display: grid;
        grid-template-columns: repeat(1, minmax(0, 1fr));
        grid-template-rows: repeat(1, minmax(0, 1fr));
      }

      .reader-media-container,
      .reader-fullscreen-container {
        height: 100%;
        overflow: hidden;
      }

      .reader-media-list {
        max-height: 100%;
        overflow-x: auto;
        overflow-y: hidden;
      }
    }
  }
</style>