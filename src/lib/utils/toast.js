// -- This file contains methods, utilities, and helpers related to the toast provider. -- //

// Utilities
import { toast } from "svelte-sonner";

// Creates a success toast instance
export function toastSuccess(title, msg) {
  toast.success(title, {
    description: msg,
  });
}

// Creates as error toast instance
export function toastError(title, msg) {
  toast.error(title, {
    description: msg,
    action: {
      label: "Copy",
      onClick: () => navigator.clipboard.writeText(msg),
    },
  });
}

// TODO: Create more toast variants.
