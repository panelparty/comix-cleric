<script>
  import DnDContainer from "$lib/components/DnD/DnDContainer.svelte";
  import DnDItem from "$lib/components/DnD/DnDItem.svelte";
    import { Accordion } from "@skeletonlabs/skeleton-svelte";

  let { value = $bindable() } = $props();

  const child_key = "child";

  function withIds(arr) {
    return (arr ?? []).map((b) => {
      const copy = { ...b, id: b.id ?? crypto.randomUUID() };
      if (Array.isArray(copy[child_key])) copy[child_key] = withIds(copy[child_key]);
      return copy;
    });
  }

  const wasString = typeof value === "string";
  const parse = (v) => (typeof v === "string" ? JSON.parse(v || "[]") : (v ?? []));

  // Working tree. IDs are filled in once; existing ones are preserved.
  let blocks = $state(withIds(parse(value)));

  // Sync back to the form no cleaning, IDs ride along and get saved.
  $effect(() => {
    const out = $state.snapshot(blocks);
    value = wasString ? JSON.stringify(out) : out;
  });

  const newBlock = () => ({ id: crypto.randomUUID(), component: "", props: {} });

  function addBlock() {
    blocks = [...blocks, newBlock()];
  }

  function addChild(block) {
    block[child_key] = [...(block[child_key] ?? []), newBlock()];
  }

  function removeBlock(id) {
    const strip = (arr) =>
      arr.filter((item) => item.id !== id).map((item) =>
          Array.isArray(item[child_key]) ? { ...item, [child_key]: strip(item[child_key]) } : item
        );
    blocks = strip(blocks);
  }

  function addProp(block) {
    if (!block.props) block.props = {};
    let i = 1, k = "key";
    while (k in block.props) k = `key${i++}`;
    block.props = { ...block.props, [k]: "" };
  }

  function renameProp(block, oldKey, newKey) {
    if (!newKey || newKey === oldKey || newKey in block.props) return;
    block.props = Object.fromEntries(
      Object.entries(block.props).map(([k, v]) => [k === oldKey ? newKey : k, v])
    );
  }

  function deleteProp(block, key) {
    const { [key]: _, ...rest } = block.props;
    block.props = rest;
  }
</script>

{#snippet blockItem(block)}
  <DnDItem handleClasses="drag-handle" class="w-full">
    <div class="w-full preset-filled-surface-200-800 rounded-md p-3 flex flex-col gap-3">
      <!-- Component and actions -->
      <div class="flex items-center gap-2">
        <input
          class="input grow"
          placeholder="component"
          value={block.component ?? ""}
          oninput={(e) => (block.component = e.currentTarget.value)}
        />
        <button type="button" class="btn-icon preset-tonal" title="Add child" onclick={() => addChild(block)}><i class="ph-bold ph-plus"></i></button>
        <button type="button" class="btn-icon preset-tonal" title="Remove" onclick={() => removeBlock(block.id)}><i class="ph-bold ph-x"></i></button>
      </div>

      <!-- Props -->
      <Accordion collapsible>
				<Accordion.Item
					controlClasses="px-2! py-1!"
					controlHover="hover:preset-tonal"
				>
					{#snippet control()}Props{/snippet}
					{#snippet panel()}
						<div class="flex flex-col gap-2 pl-2 border-l border-surface-500/30">
							{#each Object.keys(block.props ?? {}) as key (key)}
								<div class="flex items-center gap-2">
									<input
										class="input input-sm w-40"
										value={key}
										onchange={(e) => renameProp(block, key, e.currentTarget.value)}
									/>
									<span class="opacity-50">:</span>
									<input
										class="input input-sm grow"
										value={block.props[key]}
										oninput={(e) => (block.props[key] = e.currentTarget.value)}
									/>
									<button type="button" class="btn-icon btn-icon-sm preset-tonal" onclick={() => deleteProp(block, key)}>✕</button>
								</div>
							{/each}
							<button type="button" class="btn btn-sm preset-tonal w-fit" onclick={() => addProp(block)}>+ prop</button>
						</div>
					{/snippet}
				</Accordion.Item>
			</Accordion>

      <!-- Nested blocks -->
      {#if Array.isArray(block[child_key])}
        <div class="pl-4">
          <DnDContainer
            bind:value={block[child_key]}
            handle=".drag-handle"
            itemSnippet={blockItem}
            class="gap-2"
          />
        </div>
      {/if}
    </div>
  </DnDItem>
{/snippet}

<section class="p-4 preset-filled-surface-100-900 rounded-lg flex flex-col gap-3">
  <div class="flex items-center gap-4">
		<h5 class="h5">Page Blocks</h5>
  	<button type="button" class="btn preset-tonal w-fit" onclick={addBlock}>Add Block</button>
	</div>

  <DnDContainer bind:value={blocks} handle=".drag-handle" itemSnippet={blockItem} class="gap-2" />

</section>