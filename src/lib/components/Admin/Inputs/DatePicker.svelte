<script>

  // Utilities
  import { getLocalTimeZone, today, CalendarDate } from "@internationalized/date";
  import { DateTime } from "luxon";
  

// Bits UI components
  import { DatePicker } from "bits-ui";
  import { onMount } from "svelte";
  import TooltipInfo from "../../Display/TooltipInfo.svelte";
  import Input from "./Input.svelte";


  // Get current date/time (MUST COME BEFORE VARIABLES)
  const currentDate = () => {
    return today(getLocalTimeZone())
  };

  const currentTime = () => {
    return new Date().toLocaleTimeString('default', { hour12: false, hour: '2-digit', minute: '2-digit' });
  };


  // Props
  let {
    label = "Date Published",
    name,
    value = undefined,
    onValueChange,
    tooltip
  } = $props();


  // Variables
  let initialValue = value;
  let dateValue = $derived(currentDate());
  let selectedMonth = $state();
  let selectedYear = $state();
  let timeInput = $state("00:00");


  // Update combined value when date or time changes - convert local to UTC
  let combinedValue = $derived.by(() => {
    if (!dateValue || !/^\d{2}:\d{2}$/.test(timeInput)) return '';
    const local = DateTime.fromISO(`${dateValue.toString()}T${timeInput}:00`);
    return local.isValid ? local.toUTC().toISO() : '';
  });


  // Notify parent whenever the value changes
  $effect(() => { onValueChange?.(combinedValue); });


  // Fully resets the date picker to the current date and time of the client device
  function setCurrentDate() {
    dateValue = currentDate();
  }
  
  function setCurrentTime() {
    timeInput = currentTime();
  }

  function setCurrentDateTime() {
    setCurrentDate();
    setCurrentTime();
  }


  // Reference to months
  // TODO: Move this to custom date helper file.
  const customMonths = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" }
  ];


  // Reference to the current year of the client device
  const currentYear = currentDate().year;


  // Reference to years +-50 years from the current year
  // TODO: Move this to custom date helper file.
  const years = Array.from({ length: 101 }, (_, i) => ({
    value: currentYear - 50 + i,
    label: (currentYear - 50 + i).toString()
  }));

  
  //
  function updateCalendar() {
    // Attempt to??
    try {
      // Create a new calendar date from our selected options
      const newDate = new CalendarDate(selectedYear, selectedMonth, dateValue.day);
      // Set the main date value to the new date
      dateValue = newDate;
    } catch (e) {
      // ...
    }
  }

  onMount(() => {
    if (typeof initialValue === 'string' && initialValue) {
      const dt = DateTime.fromISO(initialValue, { zone: 'utc' }).toLocal();
      if (dt.isValid) {
        dateValue = new CalendarDate(dt.year, dt.month, dt.day);
        if (initialValue.includes('T')) timeInput = dt.toFormat('HH:mm');
        return;
      }
    }
    setCurrentDateTime();
  });

  // Keeps months and year selections in-sync
  $effect(() => {
    // If there is a main value
    if (dateValue) {
      // Set the active month
      selectedMonth = dateValue.month;
      // Set the active year
      selectedYear = dateValue.year;
    }
  });

  // Date picker optional presets for setting dates quickly
  const presets = [
    {
      label: "Today",
      onclick: () => {
        dateValue = currentDate();
      }
    },
    {
      label: "Tomorrow",
      onclick: () => {
        dateValue = currentDate().add({ days: 1 });
      }
    },
    {
      label: "In 3 days",
      onclick: () => {
        dateValue = currentDate().add({ days: 3 });
      }
    },
    {
      label: "In a week",
      onclick: () => {
        dateValue = currentDate().add({ days: 7 });
      }
    },
    {
      label: "In a month",
      onclick: () => {
        dateValue = currentDate().add({ months: 1 });
      }
    },
    {
      label: "In a year",
      onclick: () => {
        dateValue = currentDate().add({ years: 1 });
      }
    },
    // TODO: Add options for current schedule when those features are added.
  ];

</script>

<!-- Date picker component wrapper -->
<div class="md:w-fit flex flex-col gap-2">
  <div class="flex flex-row gap-2">
    <!-- Hidden input that holds the combined datetime value -->
    <input type="hidden" {name} value={combinedValue} />

    <!-- DatePicker component (Bits UI) -->
    <DatePicker.Root
      weekdayFormat="short"
      fixedWeeks={true}
      value={dateValue}
      onValueChange={(newValue) => {
        if (newValue) {
          dateValue = newValue;
        }
      }}
    >
      <!-- DatePicker contents container -->
      <div class="flex w-full md:max-w-[232px] flex-col gap-1">
        <!-- DatePicker label component (Bits UI) -->
        <DatePicker.Label class="flex items-center gap-1 select-none text-sm leading-tight font-medium">
          {label}
          {#if tooltip}
            <TooltipInfo aria-label="Hover (tap on mobile) for more information.">
              {@render tooltip?.()}
            </TooltipInfo>
          {/if}
        </DatePicker.Label>
        <!-- DatePicker inputs component (Bits UI) -->
        <DatePicker.Input
          class="input flex w-full select-none items-center"
        >
          <!-- Segmented date text inputs -->
          {#snippet children({ segments })}
            {#each segments as { part, value }, i (part + i)}
              <div class="inline-block select-none">
                {#if part === "literal"}
                  <DatePicker.Segment {part} class="text-surface-300-700 p-1">
                    {value}
                  </DatePicker.Segment>
                {:else}
                  <DatePicker.Segment
                    {part}
                    class=" hover:bg-surface-100-900 focus:bg-surface-100-900 focus:text-primary-500 aria-[valuetext=Empty]:text-surface-300-700 focus-visible:ring-0! focus-visible:ring-offset-0! px-1 py-1"
                  >
                    {value}
                  </DatePicker.Segment>
                {/if}
              </div>
            {/each}
            <!-- Button to open the calendar picker -->
            <DatePicker.Trigger
              class="text-surface-950-50/60 hover:bg-surface-100-900 active:bg-surface-700-300 ml-auto inline-flex size-6 items-center justify-center rounded-[5px] transition-all"
            >
              <i class="ph-bold ph-calendar-blank"></i>
            </DatePicker.Trigger>
          {/snippet}
        </DatePicker.Input>
        <!-- Calendar popover -->
        <DatePicker.Content sideOffset={6} class="w-screen md:w-auto p-3 border border-surface-300-700 bg-surface-50-950 shadow-lg z-10 rounded-lg">
          <DatePicker.Calendar>
            {#snippet children({ months, weekdays })}
              <!-- DatePicker header component (Bits UI) -->
              <DatePicker.Header class="flex items-center justify-between">
                <!-- Select group -->
                <div class="flex items-center justify-between gap-2 mb-3 w-full">
                  <!-- Month select menu -->
                  <select
                    bind:value={selectedMonth}
                    onchange={updateCalendar}
                    class="flex-1 px-2 py-1 text-sm rounded border border-surface-300-700 bg-surface-50-950 hover:bg-surface-100-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {#each customMonths as month (month.value)}
                      <option value={month.value}>{String(month.value).padStart(2, '0')} - {month.label}</option>
                    {/each}
                  </select>
                  <!-- Year select menu -->
                  <select
                    bind:value={selectedYear}
                    onchange={updateCalendar}
                    class="flex-1 px-2 py-1 text-sm rounded border border-surface-300-700 bg-surface-50-950 hover:bg-surface-100-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {#each years as year (year.value)}
                      <option value={year.value}>{year.label}</option>
                    {/each}
                  </select>
                </div>
              </DatePicker.Header>
              <!-- Calendar grid -->
              <!-- TODO: Hold onto your ass. -->
              <div
                class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
              >
                {#each months as month (month.value)}
                  <DatePicker.Grid
                    class="w-full border-collapse select-none space-y-1"
                  >
                    <DatePicker.GridHead>
                      <DatePicker.GridRow class="mb-1 flex w-full justify-between">
                        {#each weekdays as day (day)}
                          <DatePicker.HeadCell
                            class="text-surface-700-300 font-normal! w-10 text-xs"
                          >
                            <div>{day.slice(0, 2)}</div>
                          </DatePicker.HeadCell>
                        {/each}
                      </DatePicker.GridRow>
                    </DatePicker.GridHead>
                    <DatePicker.GridBody>
                      {#each month.weeks as weekDates (weekDates)}
                        <DatePicker.GridRow class="flex w-full justify-between">
                          {#each weekDates as date (date)}
                            <DatePicker.Cell
                              {date}
                              month={month.value}
                              class="p-0! relative size-10 text-center text-sm"
                            >
                              <DatePicker.Day
                                class=" text-surface-950-50 hover:border-surface-300-700 data-selected:bg-primary-500 data-selected:text-primary-950 data-disabled:text-surface-950-50/60 data-unavailable:text-surface-700-300 data-disabled:pointer-events-none data-outside-month:pointer-events-none data-selected:font-medium data-unavailable:line-through group relative inline-flex size-10 items-center justify-center whitespace-nowrap border border-transparent bg-transparent p-0 text-sm font-normal transition-all"
                              >
                                <div
                                  class="bg-surface-950-50 group-data-selected:bg-primary-950 group-data-today:block absolute top-1 hidden size-1 rounded-full transition-all"
                                ></div>
                                {date.day}
                              </DatePicker.Day>
                            </DatePicker.Cell>
                          {/each}
                        </DatePicker.GridRow>
                      {/each}
                    </DatePicker.GridBody>
                  </DatePicker.Grid>
                {/each}
              </div>
            {/snippet}
          </DatePicker.Calendar>
          <hr class="hr my-3">
          <!-- Preset button grid -->
          <div class="w-full grid grid-cols-3 gap-2">
            {#each presets as preset (preset.label)}
              <button
                type="button"
                class="btn-sm preset-tonal  hover:dark:brightness-75"
                onclick={preset.onclick}
              >
                <span class="sr-only"> Set date to </span>
                {preset.label}
              </button>
            {/each}
          </div>
        </DatePicker.Content>
      </div>
    </DatePicker.Root>

    <!-- Time input -->
    <div class="flex flex-col w-full h-full gap-1">
      <Input
        type="text"
        label="Time"
        name="time"
        bind:value={timeInput}
        placeholder="HH:MM"
        maxlength="5"
        inputClasses=""
      >
        {#snippet tooltip()}
          <p class="">Please ensure the time value matches `HH:MM` formating. Even if it is something like `8:00` please use `08:00` instead, otherwise you will get errors.</p>
        {/snippet} 
      </Input>
    </div>
  </div>
  <div class="grid grid-cols-2 gap-2">
    <button type="button" onclick={setCurrentDate} class="ig-btn preset-filled-surface-300-700 rounded-md">Current Date</button>
    <button type="button" onclick={setCurrentTime} class="ig-btn preset-filled-surface-300-700 rounded-md">Current Time</button>
  </div>
</div>

<!--
@component
## DatePicker
Displays a custom date picker to ease the process of selecting specific dates for cataloging. Comes with many presets for even easier selection.

### Prop Definitions
- `name` - The name assigned to the field for forms.
- `value` - The current value of the input; can be supplied. *Default: `currentDate`*
- `onValueChange` - Passes the `onValueChange` event so the parent component can react to updates with their own scripts.

@example
<DatePicker
  name="release_date"
  bind:value={releaseDate}
  onValueChange={handleChangeDate}
/>
-->
