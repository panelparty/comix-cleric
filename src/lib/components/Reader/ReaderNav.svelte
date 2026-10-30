<script>

  // Svelte utilities
  import { invalidateAll } from "$app/navigation";

  // Utilities
  import { screen } from "$lib/utils/breakpoints";
  import { getDeviceType } from "$lib/utils/device";
  import { fallback } from "$lib/utils/utils";

  // Node imports
  import { filter, size } from "lodash-es";

  // Components
  import KbdNavReader from "$lib/components/Accessibility/KeyboardControls/KbdNavReader.svelte";

  // Props
  let {
    data,
    firstUpdate,
    prevUpdate,
    currentUpdate,
    nextUpdate,
    lastUpdate,
    sticky,
    thin,
    count
  } = $props();

  // Reactively get the current device
  let device = $derived(getDeviceType());

</script>

<!-- Keyboard controls -->
<KbdNavReader
  data={{firstUpdate, prevUpdate, nextUpdate, lastUpdate}}
  archive
  random
/>

<!-- Reader navigation container -->
<nav
  class="{sticky ? 'sticky! bottom-0 left-0' : ''} w-full h-fit p-1 gap-1 {thin ? '' : 'py-1 md:gap-2'} bg-surface-100-900 grid lg:flex lg:items-center"
  style="grid-template-columns: repeat({filter(data?.pages, {show_reader: true})?.length + 4}, auto);"
>
  <!-- Navigation links -->
  <!-- TODO: Make customizable. Also, make sure the URL endpoints are dynamic! -->
  <a href={`/comic/${firstUpdate?.slug}`} onclick={()=>invalidateAll()} aria-label="First page" class="btn preset-filled-primary-500 text-surface-950! w-full py-2 {thin ? 'text-xl py-1!' : 'text-2xl'} {size(firstUpdate) === 0 || firstUpdate?.id === currentUpdate?.id ? 'disabled pointer-events-none' : ''}"><i class="ph-bold ph-caret-double-left"></i></a>
  <a href={`/comic/${prevUpdate?.slug}`} onclick={()=>invalidateAll()} aria-label="Previous page" class="btn preset-filled-primary-500 text-surface-950! w-full py-2 {thin ? 'text-xl py-1!' : 'text-2xl'} {size(prevUpdate) === 0 ? 'disabled pointer-events-none' : ''}"><i class="ph-bold ph-caret-left"></i></a>
  {#each data?.pages as item}
    {#if item?.show_reader}
      <a href={item?.url} aria-label={item?.label} class="btn preset-filled-primary-500 text-surface-950! py-2 {thin ? 'text-xl py-1!' : 'text-2xl'}"><i class='ph-bold ph-{item?.icon}'></i>{#if screen.md.current}<span class="text-sm font-semibold">{fallback([item?.label, item?.name, item?.slug])}</span>{/if}</a>
    {/if}
  {/each}
  <a href={`/comic/${nextUpdate?.slug}`} onclick={()=>invalidateAll()} aria-label="Next page" class="btn preset-filled-primary-500 text-surface-950! w-full py-2 {thin ? 'text-xl py-1!' : 'text-2xl'} {size(nextUpdate) === 0 ? 'disabled pointer-events-none' : ''}"><i class="ph-bold ph-caret-right"></i></a>
  <a href={`/comic/${lastUpdate?.slug}`} onclick={()=>invalidateAll()} aria-label="Last page" class="btn preset-filled-primary-500 text-surface-950! w-full py-2 {thin ? 'text-xl py-1!' : 'text-2xl'} {size(lastUpdate) === 0 || lastUpdate?.id === currentUpdate?.id ? 'disabled pointer-events-none' : ''}"><i class="ph-bold ph-caret-double-right"></i></a>
</nav>
