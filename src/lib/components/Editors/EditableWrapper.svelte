<script>

  // Export required props
  let {
    children,
    editMode = false,
    visible = true,
    onToggleVisibility = () => {},
    onRemove = () => {}
  } = $props();

</script>

<!-- Section container -->
<div class="editable-section" class:edit-mode={editMode} class:hidden={!visible}>
  {#if editMode}
    <div class="edit-controls">
      <!-- Drag handle -->
      <button
        class="drag-handle"
        aria-label="Drag to reorder"
        style="cursor: grab;"
      >
        ⠿
      </button>

      <!-- Visibility toggle -->
      <button
        onclick={onToggleVisibility}
        aria-label={visible ? 'Hide component' : 'Show component'}
      >
        <i class="ph-bold ph-{visible ? 'eye' : 'eye-slash'}"></i>
      </button>

      <!-- Remove button -->
      <!-- TODO: Make inoperable on default components -->
      <button
        onclick={onRemove}
        aria-label="Remove component"
        class="remove-btn"
      >
        <i class="ph-bold ph-trash"></i>
      </button>
    </div>
  {/if}

  <!-- Contents wrapper (renders component from registry) -->
  <div class="component-content" class:dimmed={editMode && !visible}>
    {@render children()}
  </div>
</div>

<!-- Local styles -->
<style>
  .editable-section {
    position: relative;
    transition: opacity 0.2s;
  }

  .edit-mode {
    outline: 2px dashed #ccc;
    margin: 1rem 0;
    padding: 1rem;
    border-radius: 4px;
  }

  .edit-controls {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    display: flex;
    gap: 0.5rem;
    background: white;
    padding: 0.25rem;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    z-index: 10;
  }

  .edit-controls button {
    padding: 0.5rem;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
    border-radius: 3px;
    font-size: 1rem;
    transition: all 0.2s;
  }

  .edit-controls button:hover {
    background: #f5f5f5;
    border-color: #999;
  }

  .drag-handle {
    font-size: 1.2rem;
    line-height: 1;
  }

  .drag-handle:active {
    cursor: grabbing !important;
  }

  .remove-btn:hover {
    background: #fee;
    border-color: #fcc;
  }

  .dimmed {
    opacity: 0.5;
  }

  .hidden:not(.edit-mode) {
    display: none;
  }
</style>
