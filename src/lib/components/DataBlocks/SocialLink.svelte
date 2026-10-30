<script>
  // Props
  let {
    href,
    icon,
    label,
    slug,
    bg = 'preset-filled-primary-200-800',
    class: className,
    showLabel
  } = $props();
</script>

<!-- Formatted link -->
<a
  href={href}
  aria-label={label}
  target="_blank"
  class="button size-8 text-xl {bg} {className}"
  title={label}
>
  <!-- Icon (Phosphor icons) -->
  <i class="ph-bold ph-{icon}"></i>
  
  <!-- Optional label -->
  {#if showLabel}
    <span class="text-sm font-medium uppercase tracking-wide">{label}</span>
  {/if}
</a>
