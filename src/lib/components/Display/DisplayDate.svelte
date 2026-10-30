<script>
	// Utilities
	import { formatDate, formatDateLonger } from "$lib/utils/date";
	
	// Props
	let {
		date,
		label,
		class: className,
		fallback = "Unknown",
		title = date ? formatDateLonger(date) : fallback,
		locale = "en-US",
		...restProps
	} = $props();
</script>

<!-- Text wrapper -->
<p class="display-date {className}" {title} {...restProps}>
	<!-- Date label -->
	<span class="display-date-label">
		{label}
	</span>

	<!-- Formatted Date -->
	<span class="display-date-date">
		{date ? formatDate(date) : fallback}
	</span>
</p>