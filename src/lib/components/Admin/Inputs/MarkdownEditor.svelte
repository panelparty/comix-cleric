<script>
  // Utilities
  import { StateHistory } from "runed";
  import { createTextFormatter } from "$lib/utils/formatter";
  import { screen } from "$lib/utils/breakpoints";
  import { acceptedFileTypes } from "$lib/utils/validation/schema";
  import { consoleLog } from "$lib/utils/debug";
  import { use_html_img } from "$lib/utils/stores/adminPrefs";

  // Components
  import MobilePreview from "../MobilePreview.svelte";
  import FileSelector from "./FileSelector.svelte";
  import FileUploader from "./FileUploader.svelte";
  import ProseContainer from "$lib/components/DataBlocks/ProseContainer.svelte";
  import TooltipInfo from "$lib/components/Display/TooltipInfo.svelte";
  import Input from "./Input.svelte";

  // Skeleton UI components
  import { Popover } from "@skeletonlabs/skeleton-svelte";

  // Props
  let {
    id,
    data,
    value = $bindable(),
    name,
    label,
    rows = 2,
    maxHeight = "max-h-128!",
    tooltip,
    onChange = () => {},
    ...restProps
  } = $props();

  // Component states
  let element = $state(null);
  let openState = $state(false);
  let preview = $state(null);

  // Creates a custom Markdown formatter
  let formatter = $derived(createTextFormatter(element, value));

  // Create history states
  // TODO: Finish implementation (buttons)
  const history = new StateHistory(() => value, (v) => (value = v));

  // Closes the popover
  function popoverClose() {
    openState = false;
  }

  // Handle media attachments
  function handleAddMedia(e) {
    if (e?.type?.startsWith("image")) {
      if (use_html_img?.current) {
        value = formatter.imageHtml(`/api/media/${e?.filename_disk}`, e?.alt);
      } else {
        value = formatter.imageMd(`/api/media/${e?.filename_disk}`, e?.alt);
      }
    }
    // TODO: Add other media formatters.
  }
</script>

<!-- Component wrapper -->
<div class="w-full grid grid-rows-1 grid-cols-1 overflow-hidden" {...restProps}>
  <!-- Side-by-side preview grid -->
  <div class="w-full h-full grid grid-rows-[min-content_auto] overflow-hidden">
    <!-- Header -->
    <div class="flex items-center gap-1">
      <!-- Input label (connected via {name}) -->
      <label for={name} class="text-sm ml-1 leading-tight!">{label}</label>
      <!-- Display child elements below the label -->
      {#if tooltip}
        <TooltipInfo>
          {@render tooltip?.()}
        </TooltipInfo>
      {/if}
    </div>

    <!-- Editor/Preview container -->
    <div class="w-full h-full grid grid-rows-1 grid-cols-1 lg:grid-cols-2 lg:gap-2">
      <div class="w-full h-full grid grid-rows-[max-content_auto] grid-cols-1">
        <!-- Controls (sticky) -->
        <div class="w-full h-full flex items-center input-group rounded-b-none">
          <!-- Format bold button -->
          <button
            type="button"
            aria-label="Make selection bold"
            title="Make selection bold"
            onclick={()=>{value = formatter.bold()}}
            class="ig-btn w-full preset-filled-surface-300-700 rounded-none!"
          >
            <i class="ph-bold ph-text-b"></i>
          </button>

          <!-- Format italic button -->
          <button
            type="button"
            aria-label="Make selection italic"
            title="Make selection italic"
            onclick={()=>{value = formatter.italic()}}
            class="ig-btn w-full preset-filled-surface-300-700 rounded-none!"
          >
            <i class="ph-bold ph-text-italic"></i>
          </button>

          <!-- Format underline button -->
          <button
            type="button"
            aria-label="Make selection underlined"
            title="Make selection underlined"
            onclick={()=>{value = formatter.underline()}}
            class="ig-btn w-full preset-filled-surface-300-700 rounded-none!"
          >
            <i class="ph-bold ph-text-underline"></i>
          </button>

          <!-- Add link button -->
          <button
            type="button"
            aria-label="Add link to selection"
            title="Add link to selection"
            onclick={()=>{value = formatter.link()}}
            class="ig-btn w-full preset-filled-surface-300-700 rounded-none!"
          >
            <i class="ph-bold ph-link"></i>
          </button>

          <!-- Format code button -->
          <button
            type="button"
            aria-label="Make selection inline code format"
            title="Make selection inline code format"
            onclick={()=>{value = formatter.code()}}
            class="ig-btn w-full preset-filled-surface-300-700 rounded-none!"
          >
            <i class="ph-bold ph-brackets-curly"></i>
          </button>

          <!-- Add codeblock button -->
          <button
            type="button"
            aria-label="Add codeblock to document"
            title="Add codeblock to document"
            onclick={()=>{value = formatter.codeBlock()}}
            class="ig-btn w-full preset-filled-surface-300-700 rounded-none!"
          >
            <i class="ph-bold ph-code"></i>
          </button>

          <!-- Attach image button -->
          <!-- Modal component (Skeleton UI) -->
          <Popover
            open={openState}
            onOpenChange={(e) => (openState = e.open)}
            positioning={{ placement: 'top-left' }}
            classes="w-full flex items-center"
            triggerBase="ig-btn w-full preset-filled-surface-300-700"
            contentBase="card bg-surface-100-900 p-4 flex flex-col gap-2 w-fit"
            zIndex={50}
            aria-label="Add image"
            title="Add image"
          >
            <!-- Modal trigger -->
            {#snippet trigger()}<i class="ph-bold ph-paperclip"></i>{/snippet}
            <!-- Modal contents -->
            {#snippet content()}
              <div class="flex flex-col gap-2">
                <FileSelector
                  fetchTypes={["image"]}
                  onAddFile={handleAddMedia}
                />
                <FileUploader {data}
                  accept={acceptedFileTypes.image}
                  subtext=""
                  onUploadComplete={handleAddMedia}
                />
                <Input type="checkbox" label="Use HTML image tag" bind:value={use_html_img.current}>
                  {#snippet tooltip()}
                    <p class="tooltip-text">Will change the output of the importer to use HTML instead of Markdown formatting.</p>
                  {/snippet}
                </Input>
              </div>
            {/snippet}
          </Popover>
        </div>
        <!-- Editor input -->
        <textarea
          name={name}
          id={name}
          rows="5"
          class="textarea font-mono resize-none min-h-32 {maxHeight} overflow-y-auto! rounded-t-none field-sizing-fixed!"
          placeholder="You can use markdown to style this!"
          bind:value
          bind:this={element}
        ></textarea>
      </div>
      <!-- If the screen is above the larger breakpoint -->
      {#if screen.lg.current}
      <!-- Preview container -->
      <div class="grid grid-rows-[min-content_auto]">
        <!-- Preview label -->
        <p class="label">{label} Preview</p>
        <!-- Prose container -->
        <div class="{maxHeight} preset-filled-surface-100-900 p-4 space-y-4 leading-tight! overflow-y-auto rounded-md {id}" bind:this={preview}>
          <!-- Safely render Markdown strings -->
          <ProseContainer data={value} />
        </div>
      </div>
      {:else}
      <!-- If screen is below large breakpoint -->
      <!-- Mobile preview component -->
      <MobilePreview
        title="{label} Preview"
      >
        <!-- Preview modal trigger -->
        {#snippet trigger()}
          {label} Preview
        {/snippet}
        <!-- Preview modal contents -->
        {#snippet children()}
          <!-- Prose container -->
          <div class="prose-override preset-filled-surface-100-900 p-4 space-y-4 leading-tight! rounded-md">
            <!-- Safely render Markdown strings -->
            <ProseContainer data={value} />
          </div>
        {/snippet}
      </MobilePreview>
      {/if}
    </div>
  </div>
</div>
