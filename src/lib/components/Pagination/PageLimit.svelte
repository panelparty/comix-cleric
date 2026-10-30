<script>

  // Utilities
  import { findIndex } from "lodash-es";


  // Props
  let { data, customOptions, value = $bindable() } = $props();


  // Default options
  let options = $derived(customOptions ?? [
    { value: 1, label: "1" },
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 15, label: "15" },
    { value: 25, label: "25" },
    { value: 40, label: "40" },
    { value: 60, label: "60" },
    { value: 80, label: "80" },
    { value: 100, label: "100" },
    { value: 5000, label: "All" },
  ]);

  // Reactively sets the currently selected value (index)
  let selected = $derived.by(()=>{
    return findIndex(options, value, 0)
  });
  let isSelected = (i) => {selected === i};

</script>


<!-- Container -->
<div class="page-limit-container">
  <!-- Label -->
  <p class="page-limit-label">Items per page:</p>
  <!-- Select menu -->
  <select class="select md:text-sm leading-none min-w-18 w-fit h-full" bind:value>
    <!-- Options -->
    {#each options as item, i}
      <option value={item?.value} selected={isSelected(i)}>{item?.label}</option>
    {/each}
  </select>
</div>


<style>

  .page-limit-container {
    width: fit-content;
    display: flex;
    gap: calc(var(--spacing) * 2);
    align-items: center;
  }


  .page-limit-label {
    white-space: nowrap;
    display: none;

    @media (width >= 48rem) {
      display: inline;
    }
  }

</style>
