<script>

  import { sleep } from "$lib/utils/delay";

  let {
    value,
    label,
    ...restProps
  } = $props();

  let notify = $state(false);

  async function copyToClipboard(val) {
    notify = true;
    navigator.clipboard.writeText(val);
    await sleep(3000);
    notify = false;
  };

</script>

<a
  aria-label="Share {label}"
  onclick={() => copyToClipboard(value)}
  class="size-8 flex items-center justify-center bg-surface-200-800 hover:bg-surface-300-700 rounded-md {notify ? 'preset-filled-success-200-800' : ''}"
  {...restProps}
>
  <i class="ph-bold ph-{notify ? 'check' : 'share'}"></i>
</a>
