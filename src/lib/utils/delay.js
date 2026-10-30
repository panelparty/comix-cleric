// -- This file contains delay methods, utilities, and helpers. -- //

// Creates an empty promise that will resolve after a set amount of time, creating a simple delay.
// Useful in rate limiting and debouncing
export const sleep = (delay) =>
  new Promise((resolve) => setTimeout(resolve, delay));
