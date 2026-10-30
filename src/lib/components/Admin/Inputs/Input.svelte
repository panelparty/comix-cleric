<script>
  // Utilities
  import { isArray } from "lodash-es";
  import { censor } from "$lib/utils/generate/string";
  
  // Components
  import SimpleMediaSelect from "./SimpleMediaSelect.svelte";
  import TooltipInfo from "../../Display/TooltipInfo.svelte";

  // Export props
  let {
    label,
    desc,
    name,
    id,
    type = "text",
    value = $bindable(),
    onValueChange = () => {},
    class: className,
    labelClasses,
    inputClasses,
    wrapperClasses,
    children,
    before,
    tooltip,
    after,
    accept,
    fetchTypes,
    options,
    optionValues = null,
    selected,
    validation = (e) => {},
    allowNull = true,
    required,
    show = $bindable(false),
    canHide = false,
    ...restProps
  } = $props();

  // Toggle password visibility
  function toggleVisibility() {
    show = !show;
  }

  $effect(()=>{
    if (!canHide && type === "readonly") {
      show = true;
    }
  });

  // FOR SELECT MENUS
  // Parses the `optionValues` value for custom value selection.
  function resolveValue(item) {
    if (typeof item !== 'object' || item === null) return item;
    if (optionValues) return item[optionValues];
    // auto-detect fallback
    return item?.slug ?? item?.value ?? item?.id ?? item?.label ?? item;
  }

  function updateValue(e) {
    let item;
    if (isArray(e)) {
      item = e?.[0];
    } else {
      item = e;
    }
    value = item;
  }
</script>

<!-- Input container -->
<div class="flex flex-col gap-1 {type === 'checkbox' ? 'w-full! gap-0 flex-row-reverse items-center leading-none justify-end' : ''} {className}">
  <!-- Before input slot -->
  {@render before?.()}

  <!-- If a label was provided -->
  {#if label}
  <div class="flex items-center gap-1">
    <!-- Input label -->
    <label for={id ?? name} class="text-sm ml-1 leading-tight font-medium {restProps?.disabled ? 'opacity-60' : ''} {labelClasses}">{label}</label>
    
    {#if required}
      <span class="text-sm leading-tight text-required font-bold" title="This field is required.">*</span>
    {/if}
    
    {#if tooltip}
      <TooltipInfo aria-label="Hover (tap on mobile) for more information.">
        {@render tooltip?.()}
      </TooltipInfo>
    {/if}
  </div>
  {/if}

  <!-- Input wrapper (helps with layout) -->
  <div class={wrapperClasses}>
    <!-- Match input type -->
    <!-- Text input -->
    {#if type === 'text'}
      <input type="text" {name} id={id ?? name} {required} onsubmit={validation} class="input w-full {inputClasses}" bind:value={value} {...restProps} >

    <!-- Textarea input -->
    {:else if type === 'password'}
      <!-- Input group -->
      <div class="input-group grid grid-cols-[auto_max-content] w-full {inputClasses}">
        <!-- Password input -->
        <input
          class="ig-input"
          type="{show ? 'text' : 'password'}"
          {name}
          id={id ?? name}
          placeholder="Password"
          bind:value={value}
          onsubmit={validation}
          {...restProps}
        />

        <!-- Password visibility toggle -->
        <button
          type="button"
          class="ig-btn"
          onclick={() => toggleVisibility()}
          aria-label="{show ? 'hide' : 'show'} password"
        ><i class="ph-bold ph-{show ? 'eye-slash' : 'eye'}"></i></button>
      </div>

    <!-- Textarea input -->
    {:else if type === 'textarea'}
      <textarea {name} id={id ?? name} {required} onsubmit={validation} class="input textarea w-full {inputClasses}" bind:value={value} {...restProps} ></textarea>

    <!-- Number input -->
    {:else if type === 'number'}
      <input type="number" {name} id={id ?? name} {required} onsubmit={validation} class="input w-full min-w-fit max-w-32 {inputClasses}" bind:value={value} {...restProps} >

    <!-- Simple media input -->
    {:else if type === 'media-import-simple'}
      <!-- Use a hidden field to output the relation ID as formData -->
      <input type="text" {name} id={id ?? name} {required} onsubmit={validation} class="hidden" value={value?.id} {...restProps} >
      <SimpleMediaSelect bind:value={value} onChange={updateValue} inputClasses="w-full sm:w-fit {inputClasses}" {fetchTypes} {accept} {...restProps} />

    <!-- Checkbox input -->
    {:else if type === 'checkbox'}
      <input type="checkbox" {name} id={id ?? name} {required} onsubmit={validation} class="checkbox size-6 {inputClasses}" bind:checked={value} {...restProps} >


    <!-- Radio button input -->
    {:else if type === 'radio'}
      <input type="radio" {name} id={id ?? name} {required} onsubmit={validation} class="input w-full {inputClasses}" bind:value={value} {...restProps} >


    <!-- Color picker input -->
    {:else if type === 'color'}
      <input type="color" {name} id={id ?? name} {required} onsubmit={validation} class="input w-full {inputClasses}" bind:value={value} {...restProps} >


    <!-- DateTime input -->
    {:else if type === 'date'}
      <input type="date" {name} id={id ?? name} {required} onsubmit={validation} class="input w-full {inputClasses}" bind:value={value} {...restProps} >


    <!-- Email input -->
    {:else if type === 'email'}
      <input type="email" {name} id={id ?? name} {required} onsubmit={validation} class="input w-full {inputClasses}" bind:value={value} {...restProps} >


    <!-- Select menu -->
    {:else if type === 'select'}
      <select {name} id={id ?? name} {required} onsubmit={validation} class="input select w-full {inputClasses}" bind:value={value} {...restProps}>
        {#if allowNull}
          <option value={null} class="*:opacity-60" selected>No selection</option>
        {/if}
        {#each options as item, i}
          <option value={resolveValue(item)} selected={i === selected ?? 0}>{item?.label ?? item?.pascal_name ?? item?.name ?? item?.slug ?? item}</option>
        {/each}
      </select>


    <!-- Read-only value -->
    {:else if type === 'readonly'}
    <div class="input-group grid grid-cols-[auto_max-content] w-full {inputClasses}">
      <p class="ig-input w-full font-mono {inputClasses}">
        {censor(value, !show)}
      </p>

      
      {#if canHide}
      <button
        type="button"
        class="ig-btn preset-filled-surface-100-900"
        onclick={toggleVisibility}
        aria-label="{show ? 'Hide' : 'Show'} {label}"
      >
        <i class="ph-bold ph-{show ? 'eye-slash' : 'eye'}"></i>
      </button>
      {/if}
    </div>


    <!-- If no input is found, fallback -->
    {:else}
      <p class="font-semibold text-warning-700-300">Warning! Input type not supported!</p>
    {/if}


    <!-- Additional elements from parent -->
    {@render children?.()}
  </div>


  <!-- TODO: Complete validation messages -->
  <!-- {#if validation === false}
    <p class="text-error-500">Error.</p>
  {/if} -->


  <!-- Input description -->
  {#if desc}
    <p class="text-xs text-surface-950-50/80 leading-tight">{desc}</p>
  {/if}


  <!-- After input slot -->
  {@render after?.()}
</div>


<!-- Component definitions for IDE intellisense pop-ups -->
<!--
@component
## Input
Chooses an input type that will include default styles and form/accessibility settings with fewer keystrokes (marginally).
It is intended to help you more quickly create a valid input without typing the same values over and over.

It basically just creates a semantic HTML input of your choosing with a label already attached for accessibility.

> You ***must*** `name` this form element if you want it to work in SvelteKit form submissions.


### Prop Definitions
- `label` - The form element label (String)
- `name` - The name of the form value when submitting (String)
- `id` - The HTML ID of the element (defaults to `name` value) (String)
- `type` - The type of element to use (String/Enum)
- `value` - The actual value of the input element (Any)
- `class` - Arbitrary CSS classes for the container element (String)
- `labelClasses` - Arbitrary CSS classes for the label element (String)
- `inputClasses` - Arbitrary CSS classes for the input element (String)
- `before` - Child elements that should appear before anything else (HTML Elements)
- `after` - Child elements that should appear after everything else (HTML Elements)
- `placeholder` - The placeholder value of the input element (String)
- `checked` - Default value for `checkbox` input (Boolean)
- `disabled` - If the element should be disabled by default (Boolean)
- `max` - The maximum value of a `number` input (Number)
- `min` - The minimum value of a `number` input (Number)
- `maxLength` - The maximum length of a `text` input (String)
- `step` - The gap between numbers for `range` and `number` inputs (Number)
- `pattern` - Regular Expression to match values against (String/RegEx Pattern)
- `readonly` - Displays a value, but disables editing (Boolean)
- `required` - Tells the form to not submit if the input is blank/empty (Boolean)


@example
``` html
<Input
    type="textarea"
    label="Physical Description"
    name="desc"
    placeholder="You can use markdown to style this!"
    bind:value={desc}
/>
```
-->
