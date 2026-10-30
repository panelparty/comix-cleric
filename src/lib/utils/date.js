// -- This file contains date parsing methods, utilities, and helpers. -- //

// Utility imports
import {
  formatDistanceToNow,
  format,
  differenceInDays,
  parseISO,
} from "date-fns";
import { DateTime } from "luxon";

// Exported function that formats an ISO date string to something human-readable
export function formatDate(isoDate) {
  if (!isoDate) return null;

  let localDate;
  
  // Handle if isoDate is already a Date object (from MongoDB)
  if (isoDate instanceof Date) {
    localDate = isoDate;
  } else {
    // Parse UTC datetime and convert to local timezone
    localDate = DateTime.fromISO(isoDate, { zone: "utc" })
      .toLocal()
      .toJSDate();
  }

  // Check if the date is valid
  if (isNaN(localDate.getTime())) {
    return null;
  }

  const daysOld = differenceInDays(new Date(), localDate);

  if (daysOld < 7) {
    return formatDistanceToNow(localDate, { addSuffix: true });
  }

  return format(localDate, "MMM dd, yyyy");
}

// Returns a boolean based on if the provided date is beyond 7 days old.
export function isNew(isoDate) {
  if (!isoDate) return null;

  let date;
  
  // Handle if isoDate is already a Date object (from MongoDB)
  if (isoDate instanceof Date) {
    date = isoDate;
  } else {
    date = parseISO(isoDate);
  }

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return null;
  }

  const daysOld = differenceInDays(new Date(), date);

  if (daysOld < 7) {
    return true;
  }

  return false;
}

// Original version of `formatDate`.
// Remove this later or replace with code from `formatDateLonger` and rename to `formatDateTime`.
export function formatDateLong(isoDate) {
  if (!isoDate) return null;

  let date;
  
  // Handle if isoDate is already a Date object (from MongoDB)
  if (isoDate instanceof Date) {
    date = isoDate;
  } else {
    date = parseISO(isoDate);
  }

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return null;
  }

  const daysOld = differenceInDays(new Date(), date);

  if (daysOld < 7) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return format(date, "MMM dd, yyyy");
}

// Use this to replace the code in `formatDateLong` and update references.
export function formatDateLonger(isoDate) {
  if (!isoDate) return null;

  let date;
  
  // Handle if isoDate is already a Date object (from MongoDB)
  if (isoDate instanceof Date) {
    date = isoDate;
  } else {
    date = parseISO(isoDate);
  }

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return null;
  }

  return format(date, "MMM dd, yyyy @ KK:mm aaa");
}

// Returns a boolean based on if the provided date matches the current date, or has passed.
export const dateHasPassed = (dateString) => {
  if (!dateString) return false;
  
  let date;
  
  // Handle if dateString is already a Date object (from MongoDB)
  if (dateString instanceof Date) {
    date = dateString;
  } else {
    date = new Date(dateString);
  }
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return false;
  }
  
  return date.getTime() <= Date.now();
};

export const convertDateString = (date) => {
  return new Date(date)
};

export function getYear(isoDate) {
  if (!isoDate) return null;

  const date = isoDate instanceof Date ? isoDate : parseISO(isoDate);

  if (isNaN(date.getTime())) {
    return null;
  }

  return String(date.getFullYear());
}

export function publishSeconds(isoDate, now = new Date()) {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return null;
  date.setUTCSeconds(now.getUTCSeconds(), now.getUTCMilliseconds());
  return date.toISOString();
}

export function postWindow(a, b) {
  if (!a || !b) return false;
  const toMinute = (v) => {
    const d = new Date(v);
    if (isNaN(d.getTime())) return NaN;
    d.setUTCSeconds(0, 0);
    return d.getTime();
  };
  const minuteA = toMinute(a);
  return !isNaN(minuteA) && minuteA === toMinute(b);
}