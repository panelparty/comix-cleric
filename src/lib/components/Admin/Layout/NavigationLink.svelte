<script>

  // Export props
  let { label, url, icon, external, active } = $props();

</script>

<!-- Semantic HTML list item element -->
<li class="">
  <!-- Link to route -->
  <a href={url} target={external ? '_blank' : '_self'} class="items-center px-4 py-2 flex gap-2 rounded-md leading-none font-medium bg-transparent hover:bg-primary-500/20  {active ? 'bg-primary-500! text-primary-contrast-500!' : ''}">
		<!-- Icon -->
    <i class="ph-fill ph-{icon}"></i>
		<!-- Link label -->
    <span class="">{label}</span>
 	</a>
</li>
