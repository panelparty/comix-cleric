// -- This file contains the necessary logic for tracking current page + query params. -- //

// Utilities
import { afterNavigate, goto, replaceState } from '$app/navigation';
import { tick } from 'svelte';

// Simple coersion of numbers and booleans
// TODO: CHeck if another library we have already covers this.
function coerce(raw, val) {
  if (typeof val === 'number') return Number(raw);
  if (typeof val === 'boolean') return raw === 'true';
  return raw;
}

// Saves and replaces URL for pagination and search
export function createPageState(url, schema) {
  // Get current params
  const searchParams = url.searchParams;

  // Create initial object
  const init = Object.fromEntries(
    Object.entries(schema).map(([key, val]) => {
      const raw = searchParams.get(key);
      return [key, raw != null ? coerce(raw, val) : val];
    })
  );

  // Create current page state
  let state = $state(init);

  // Generate a a new params string
  let paramsString = $derived.by(() => {
    const params = new URLSearchParams();

    for (const key of Object.keys(schema)) {
      params.set(key, String(state[key]));
    }

    return params.toString();
  });

  // Create state tracking
  const hasMissingParams = Object.keys(schema).some(key => searchParams.get(key) == null);
  let mounted = $state(false);
  let usedEffect = $state(false);

  // After navigation
  afterNavigate(() => {
    // Replace missing params
    if (hasMissingParams) {
      tick().then(() => replaceState(`?${paramsString}`, {}));
    }
  });

  // Sync current params with navigation
  $effect(() => {
    const str = paramsString;
    if (!usedEffect) { usedEffect = true; return; }
    goto(`?${str}`);
  });

  // Return current state and params
  return {
    get state() { return state; },
    get paramsString() { return paramsString; },
  };
}