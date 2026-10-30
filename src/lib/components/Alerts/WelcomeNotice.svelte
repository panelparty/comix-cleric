<script>

  // Svelte imports
  import { browser } from '$app/environment';
  import { writable } from 'svelte/store';

	// Skeleton UI component imports
  import { Modal } from "@skeletonlabs/skeleton-svelte";
  import { renderMarkdown } from '$lib/utils/sanitize/output';

  // Export props
  let {
    title = "Heads up!",
    content,
    dismissLabel = "Got it!"
  } = $props();

  // Setup localStorage to remember choices
  const initialValue = browser ? localStorage.getItem('warningAccepted') === 'true' : false;
  const warningAccepted = writable(initialValue);

  // Toggles the notice off and remembers to not bring it back
  function dismissNotice() {
    warningAccepted.set(true);
    localStorage.setItem('warningAccepted', 'true');
  }

  // If the terms store is false or missing, show the notice.
  let openModal = $derived(!$warningAccepted);

</script>

<!-- If we are in a browser environment (page has loaded/DOM is available) -->
{#if browser}
  <!-- If the terms are not accepted, display this modal -->
  {#if !$warningAccepted}
  <!-- Modal component (Skeleton UI) -->
  <Modal
    bind:open={openModal}
    contentBase="p-4 bg-surface-100-900 rounded-2xl max-w-lg"
    backdropClasses="backdrop-blur-sm bg-surface-dark/40"
    closeOnInteractOutside={false}
    closeOnEscape={false}
  >
    <!-- No trigger -->
    <!-- Modal contents -->
    {#snippet content()}
    <div class="prose-override w-full max-w-prose overflow-y-hidden! grid grid-rows-[auto_min-content] place-content-center">
      <article class="max-h-[calc(100dvh-9rem)] overflow-y-auto! text-left!">
        <!-- Notice heading/title -->
        <h3 class="text-3xl font-black text-primary py-4 w-fit text-center text-pretty mx-auto">{title}</h3>
        <!-- Notice contents -->
        <p class="font-semibold text-lg px-4">{@html renderMarkdown(content ?? "This is a disclaimer message! Edit this in your admin panel!")?.html}</p>
        <!-- Dismiss button -->
        <div class="flex gap-2">
          <button class="btn preset-outlined-surface-500 w-full py-4! leading-none text-base md:text-lg font-medium mt-4 md:mt-8" onclick={()=>history.back()}>Back to Safety</button>
          <button class="btn preset-filled-primary-500 w-full py-4! leading-none text-base md:text-lg font-medium mt-4 md:mt-8" onclick={()=>{dismissNotice()}}>{dismissLabel}</button>
        </div>
      </article>
    </div>
    {/snippet}
  </Modal>
  {/if}
{/if}


<!--
@component
## WelcomeNotice
Displays a notice that must be accepted by the user before they can proceed to browse the site.

@example
<WelcomeNotice />
-->
