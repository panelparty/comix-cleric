<!-- App layout and page settings -->
<script>
  // Utilities 
  import { invalidateAll } from '$app/navigation';
  import { toastError, toastSuccess } from '$lib/utils/toast.js';
  import { isEqual } from 'lodash-es';

  // Components
  import DnDContainer from '$lib/components/DnD/DnDContainer.svelte';
  import DnDItem from '$lib/components/DnD/DnDItem.svelte';
  import Form from '$lib/components/Forms/Form.svelte';
  import KeyboardControls from '$lib/components/Accessibility/KeyboardControls/KeyboardControls.svelte';
  import FormPageHeader from '$lib/components/Admin/Forms/FormPageHeader.svelte';
  
  // Props
  let { data } = $props();

  // Reactive Variables
  let pages = $derived(data?.pages);
  let formElement = $state();

  // Form submit handler
  const handleSubmit = ({ formData }) => {
    formData.append("pages", JSON.stringify(pages));

    return async ({ result }) => {
      if (result?.data?.success) {
        invalidateAll();
        toastSuccess("Page order updated!");
      } else {
        toastError("Failed to update page order!", result?.data?.error);
      }
    };
  };

  // Check if sav
  const canUpdate = $derived.by(() => {
    if (
      !isEqual(pages, data?.pages)
    ) return true;
    return false;
  });

</script>

<KeyboardControls {formElement} save />

<section class="w-[100cqi] h-[100cqb] max-w-5xl mx-auto space-y-2 sm:space-y-4 grid grid-rows-[min-content_1fr] overflow-hidden">
  <FormPageHeader
    title="App Pages"
  >
    <!-- {#snippet titleButton()}
      <a href="layout/create" class="btn preset-filled-primary-500 border flex items-center gap-4">
        Add new Page
      </a>
      <AddDefaultPage />
    {/snippet} -->
  </FormPageHeader>
  
  <Form
    class="space-y-8 overflow-y-auto"
    action="/api/actions/pages?/batchUpdate"
    method="POST"
    enctype="multipart/form-data"
    onSubmit={handleSubmit}
    bind:element={formElement}
  >
    <DnDContainer bind:value={pages} group="pages" class="max-h-full overflow-y-auto gap-2">
      {#snippet itemSnippet(item, i)}
      <DnDItem
        containerClasses="bg-surface-200-800 hover:bg-surface-300-700 rounded-md p-2 flex items-center"
        class="w-full grid grid-cols-[auto_max-content] items-center justify-between"
      >
        <a href="pages/edit/{item?.id}" class="flex items-center gap-4">
          <i class="text-xl ph-bold ph-{item?.icon}"></i>
          <h5 class="h5 w-fit inline-flex items-center gap-1 leading-tight truncate">{item?.name} {#if item?.premium}<i class="ph-fill ph-star text-lg text-warning-500"></i>{/if}</h5>
        </a>
        <a href="pages/edit/{item?.id}" class="btn preset-filled-surface-300-700 border flex items-center gap-4">
          <i class="ph-bold ph-pencil-line"></i>
          <p class="w-fit inline-flex items-center gap-1 leading-tight"> Manage</p>
        </a>
      </DnDItem>
      {/snippet}
    </DnDContainer>

    {#snippet controls()}
      <button type="submit" class="btn preset-filled-success-500" disabled={!canUpdate}>Save Page Order</button>
    {/snippet}
  </Form>
</section>
