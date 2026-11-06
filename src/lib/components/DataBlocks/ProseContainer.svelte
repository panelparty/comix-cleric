<script>
  // Svelte utilities
  import { afterNavigate } from "$app/navigation";

  // Utilities
  import { renderMarkdown } from "$lib/utils/sanitize/output";

  // Props
  let {
    data,
    class: className,
    ...restProps
  } = $props();

  // Spoiler tag logic
  function setSpoilers() {
    if (document) {
      let spoilerTags = document.querySelectorAll(".blog-spoiler");
      spoilerTags.forEach((el)=>{
        const spoilerMsg = "Click to show spoiler text.";
        const hoverMsg = (state) => { return `Click to ${state} spoiler text.`};
        el.setAttribute("aria-label", spoilerMsg);
        el.setAttribute("title", hoverMsg("show"));

        el.addEventListener("click", (e) => {
          const attr = "data-spoiler-toggled"
          const toggled = el.getAttribute(attr);
          if (!toggled) {
            el.setAttribute(attr, "true");
            el.setAttribute("title", hoverMsg("hide"));
            el.removeAttribute("aria-label");
          } else {
            el.removeAttribute(attr);
            el.setAttribute("title", hoverMsg("show"));
            el.setAttribute("aria-label", spoilerMsg);
          }
        });
      });
    }
  }

  // Refresh logic on each page load
  afterNavigate(()=>{
    setSpoilers();
  });
</script>

<!-- Component container -->
<div class="prose-override {className}" {...restProps}>
  <!-- Safely renders Markdown to HTML -->
  {@html renderMarkdown(data ?? '')?.html}
</div>
