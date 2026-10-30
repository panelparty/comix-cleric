// -- This file contains page breakpoint methods, utilities, and helpers. -- //

// Svelte utility imports
import { MediaQuery } from "svelte/reactivity";

// Exported screen object that returns a boolean for each size
// NOTE: Size based on Tailwind defaults
// TODO: Make easier to modify via the server/database
export let screen = {
  "2xs": new MediaQuery("min-width: 320px"),
  xs: new MediaQuery("min-width: 480px"),
  sm: new MediaQuery("min-width: 640px"),
  md: new MediaQuery("min-width: 768px"),
  lg: new MediaQuery("min-width: 1024px"),
  xl: new MediaQuery("min-width: 1280px"),
  "2xl": new MediaQuery("min-width: 1536px"),
  // Define more breakpoints here...
};
