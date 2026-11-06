<script>

  import { invalidateAll } from "$app/navigation";

  import { screen } from "$lib/utils/breakpoints";

  import DeleteConfirm from "../Admin/DeleteConfirm.svelte";

  let {
    status,
    useStatus,
    canSchedule,
    canDelete,
    deleteAction,
    deleteUrl,
    name,
    value,
    id,
    title,
    handleDiscard = () => {invalidateAll()},
    ...restProps
  } = $props();

</script>

<div class="flex justify-end md:items-center gap-2">
{#if useStatus}
  {#if status === 'published'}
    <button type="submit" name="action" value="draft" class="button preset-filled-surface-300-700" {...restProps} >Unpublish</button>
    <button type="submit" name="action" value="archived" class="button preset-filled-warning-500" {...restProps} >Archive</button>
    <button type="submit" name="action" value="published" class="button preset-filled-success-500" {...restProps} >Save Changes</button>
  {:else if status === 'archived'}
    <button type="submit" name="action" value="draft" class="button preset-filled-surface-500" {...restProps} >Unpublish</button>
    <button type="submit" name="action" value="published" class="button preset-filled-primary-500" {...restProps} >Re-Publish</button>
    <button type="submit" name="action" value="archived" class="button preset-filled-success-500" {...restProps} >Save Changes</button>
  {:else if status === 'scheduled'}
    <button type="submit" name="action" value="draft" class="button preset-filled-surface-500" {...restProps} >Unschedule</button>
    <button type="submit" name="action" value="published" class="button preset-filled-primary-500" {...restProps} >Publish</button>
    <button type="submit" name="action" value="scheduled" class="button preset-filled-success-500" {...restProps} >Save Changes</button>
  {:else}
  {#if canSchedule === true}
    <button type="submit" name="action" value="scheduled" class="button preset-filled-success-500" {...restProps} >Schedule</button>
  {/if}
    <button type="submit" name="action" value="published" class="button preset-filled-primary-500" {...restProps} >Publish</button>
    <button type="submit" name="action" value="draft" class="button preset-filled-surface-500" {...restProps} >Save Draft</button>
  {/if}
{:else}
  <button type="submit" class="button preset-filled-success-500">Save Changes</button>
{/if}
</div>

<div class="w-full md:w-auto grid grid-cols-[min-content_auto] {canDelete ? 'gap-2' : ''}">
  {#if canDelete}
    <DeleteConfirm
      small={!screen.md.current}
      {id}
      {name}
      title="Delete {title}"
      formAction={deleteAction}
      href={deleteUrl}
    />
  {/if}
  <button
    type="button"
    onclick={handleDiscard}
    class="button preset-filled-surface-500"
    {...restProps}
  >
    Discard Changes
  </button>
</div>

<style>
  :global(.control-button) {
    width: 100%;

    @media (width >= 48rem) {
      width: auto;
    }
  }
</style>