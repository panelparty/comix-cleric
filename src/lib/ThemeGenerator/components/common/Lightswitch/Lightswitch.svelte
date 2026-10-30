<script lang="ts">
	let darkMode = $state(true);

	function toggleDarkMode() {
		darkMode = !darkMode;
		if (darkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}
</script>

<button class="btn-icon hover:preset-tonal" onclick={toggleDarkMode} title="Toggle dark mode." aria-label="Toggle dark mode.">
	<i class="ph-bold ph-{darkMode ? 'sun' : 'moon'} text-lg"></i>
</button>
