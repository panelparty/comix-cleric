<script>

  // Svelte imports
  import { browser } from '$app/environment';
  import { writable } from 'svelte/store';

  // Setup localStorage to remember choices
  const initialValue = browser ? localStorage.getItem('cookieAccepted') === 'true' : 'false';
  const cookieAccepted = writable(initialValue);

   // Toggles the notice off and remembers to not bring it back
  function dismissNotice() {
    cookieAccepted.set(true);
    localStorage.setItem('cookieAccepted', 'true');
  }

</script>


<!-- If we are in a browser environment (page has loaded/DOM is available) -->
{#if browser}
  <!-- If the terms are not accepted, display this modal -->
  {#if !$cookieAccepted}
  <!-- Banner container -->
  <!-- TODO: Replace with a proper component -->
  <div class="cookie-notice">
    <div class="cookie-content">
      <!-- Disclaimer message -->
      <p class="m-0 leading-tight font-medium text-center md:text-left max-w-prose text-pretty">
        We use cookies only for maintaining your login session. These are essential
        for keeping you signed in while you use our site. We don't use any tracking
        or analytics cookies. Read our ToS & Privacy Policy for details.
      </p>
      <!-- Dismiss button -->
      <button class="btn  primary-btn w-full md:!w-max p-4 md:!px-4 md:!py-2 text-nowrap" onclick={dismissNotice}>Got it</button>
    </div>
  </div>
  {/if}
{/if}


<style>
  .cookie-notice {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    padding: calc(var(--spacing) * 4);
    z-index: 999;
  }

  .cookie-content {
    max-width: var(--container-7xl);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: calc(var(--spacing) * 4);

    @media (width >= 48rem /* 768px */) {
      flex-direction: row;
    }
  }
</style>
