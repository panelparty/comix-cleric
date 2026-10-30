<script>
  // Utilities
  import ProseContainer from "../DataBlocks/ProseContainer.svelte";

  // Components
  import Modal from "../Floating/Modal.svelte";

  // Props
  let {
    data,
    ...restProps
  } = $props();

  // Modal state
  let openModal = $state(false);
  function closeModal() {
    openModal = false;
  }
</script>

<!-- Modal component -->
<Modal
  bind:open={openModal}
  {...restProps}
>
  <!-- Contents -->
  {#snippet content()}
    <div class="">
      <!-- Policy body -->
      <ProseContainer {data} />

      <!-- Close modal -->
      <button class="button" onclick={()=>{closeModal()}}>Dismiss</button>
    </div>
  {/snippet}
</Modal>
