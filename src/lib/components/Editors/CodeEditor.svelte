<!-- src/lib/components/CodeMirror.svelte -->
<script>
  import { onMount } from 'svelte';
  import { EditorView, basicSetup } from 'codemirror';
  import { EditorState } from '@codemirror/state';
  import { css } from '@codemirror/lang-css';

	
  let {
    value = '',
    language = 'javascript',
    readonly = false,
    onChange
  } = $props();


  let container;
  let view;


  onMount(() => {
    view = new EditorView({
      state: createState(value),
      parent: container,
    });

    return () => {
      view?.destroy();
    };
  });


  function createState(doc) {
    return EditorState.create({
      doc,
      extensions: [
        basicSetup,
        css(),
        EditorView.editable.of(!readonly),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange?.(update.state.doc.toString());
          }
        }),
      ],
    });
  }


  $effect(() => {
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
  });
</script>

<div bind:this={container} class="cm-container"></div>

<style>
  .cm-container {
    border: 1px solid var(--color-surface-100-900);
    border-radius: 4px;
    overflow: hidden;
    font-size: 14px;
  }

	:global(.cm-gutters) {
		background: var(--color-surface-200-800) !important;
		color: var(--color-surface-800-200) !important;

	}
	:global(.cm-activeLineGutter) {
		background: var(--color-surface-300-700) !important;
	}
</style>