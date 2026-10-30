<script>

  let { loading = true } = $props();

</script>

{#if loading}
  <!-- Container (fills nearest relative parent) -->
  <div class="absolute inset-0 z-50 grid place-content-center bg-surface-50-950/40 backdrop-blur-xs">
    <!-- Centered container -->
    <div class="p-4 min-w-32 min-h-32">
      <!-- Animation -->
      <span data-loader='circle-pulse' class="loader"></span>
    </div>
  </div>
{/if}

<!-- Local CSS styles -->
<style>
  [data-loader='circle-pulse'] {
    &.loader {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      max-width: 6rem;
      margin-top: 3rem;
      margin-bottom: 3rem;
    }
    &.loader:before,
    &.loader:after {
      content: "";
      position: absolute;
      border-radius: 50%;
      animation: pulseOut 1.8s ease-in-out infinite;
      filter: drop-shadow(0 0 1rem color-mix(in oklch, var(--color-primary-500) 75%, transparent));
    }
    &.loader:before {
      width: 100%;
      padding-bottom: 100%;
      box-shadow: inset 0 0 0 1rem var(--color-primary-500);
      animation-name: pulseIn;
    }
    &.loader:after {
      width: calc(100% - 2rem);
      padding-bottom: calc(100% - 2rem);
      box-shadow: 0 0 0 0 var(--color-primary-500);
    }
  }

  @keyframes pulseIn {
    0% {
      box-shadow: inset 0 0 0 1rem var(--color-primary-500);
      opacity: 1;
    }
    50%, 100% {
      box-shadow: inset 0 0 0 0 var(--color-primary-500);
      opacity: 0;
    }
  }

  @keyframes pulseOut {
    0%, 50% {
      box-shadow: 0 0 0 0 var(--color-primary-500);
      opacity: 0;
    }
    100% {
      box-shadow: 0 0 0 1rem var(--color-primary-500);
      opacity: 1;
    }
  }

</style>
