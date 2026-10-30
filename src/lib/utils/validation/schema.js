// Zod validation schemas and helpers for form inputs and file uploads.

// Utilities
import { z } from "zod";

// Attaches a Zod schema to an input element and shows browser-native validation messages.
// Client form input validator
export function createZodValidator(schema) {
  return (event) => {
    const input = event.target;

    try {
      schema.parse(input.value);
      input.setCustomValidity("");
    } catch (err) {
      const flattened = z.flattenError(err);
      input.setCustomValidity(flattened?.formErrors?.[0]);
    }

    input.reportValidity();
  };
}

// Server-side input validator
// Accepts an array of [<schema>, <data>] arrays
export function serverValidate(...checks) {
	for (const [schema, data] of checks) {
		const result = schema.safeParse(data);
		if (!result.success) {
			return { success: false, error: result.error.issues[0]?.message ?? 'Invalid input.' };
		}
	}
	return null;
}

// -- Input schemas -- //
// Email schema
export const emailSchema = z
  .string({ required_error: "Email is required." })
  .min(5)
  .max(64)
  .email()
  .trim();

// Username schema
export const usernameSchema = z
  .string({ required_error: "Username is required." })
  .min(1, "Username is required")
  .max(24, "Username cannot exceed 24 characters")
  .regex(
    /^[A-Za-z0-9._-]+$/,
    "Username can only contain letters, numbers, periods, underscores, and hyphens",
  )
  .regex(
    /^[A-Za-z0-9].*[A-Za-z0-9]$/,
    "Username can only start and end with a letter or number",
  )
  .regex(
    /^(?!.*[._-]{2})/,
    "Username cannot contain consecutive special characters",
  )
  .trim();

// Display name schema
export const displaynameSchema = z
  .string({ required_error: "Displayname is required." })
  .min(1, "Display Name is required")
  .max(32, "Display name cannot exceed 32 characters")
  .trim();

// Password schema
export const passSchema = z
  .string({ required_error: "Password is required." })
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password cannot exceed 64 characters")
  .regex(/[A-Z]/, "Password must contain upper and lower case letters")
  .regex(/[a-z]/, "Password must contain upper and lower case letters")
  .regex(/[0-9]/, "Password must contain a number")
  .regex(/[!@#$%^&*]/, "Password must contain a special character !@#$%^&*");

// Boolean schema (for checkboxes, etc.)
export const toggleSchema = z.boolean();

// Token RegEx
// TODO: Check if still needed
const tokenRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

// Token schema
export const tokenSchema = z
  .string()
  .regex(tokenRegex, "Invalid auth token format");

// Slug schema
export const slugSchema = z
	.string()
	.regex(/^[a-z0-9-]+$/, 'Slugs can only contain lowercase letters, numbers, and hyphens. Special characters and spaces are not allowed.');

// -- Form schemas (combined) -- //
// Login object schema
export const loginSchema = z.object({
  email: emailSchema,
  password: passSchema,
});

// Registration object schema
export const registerSchema = z.object({
  username: usernameSchema,
  displayname: displaynameSchema,
  email: emailSchema,
  password: passSchema,
  passwordConfirm: passSchema,
});

// -- File validation constants -- //
// Max file size
export const MAX_BYTES = 5 * 1024 * 1024; // 5MB

// Allowed file types
export const ALLOWED_TYPES = ["image", "audio"];

// Allowed file extensions
export const ALLOWED_EXT = {
  image: ["png", "jpg", "jpeg", "tiff", "svg+xml", "gif", "webp", "avif"],
  audio: ["wav", "mpeg", "ogg"],
};

// Magic bytes (typically used in executibles)
export const EXECUTABLE_CHECKS = [
  [0x4d, 0x5a],
  [0x7f, 0x45, 0x4c, 0x46],
  [0xca, 0xfe, 0xba, 0xbe],
  [0x23, 0x21],
];

// Builds a grouped object of accepted MIME types from ALLOWED_EXT.
function buildAcceptedList() {
  const mimeTypes = { image: [], audio: [] };

  // Image mime type array
  for (let i = 0; i < ALLOWED_EXT?.image?.length; i++) {
    mimeTypes.image.push("image/" + ALLOWED_EXT.image[i]);
  }
  
  // Audio mime type array
  for (let i = 0; i < ALLOWED_EXT?.audio?.length; i++) {
    mimeTypes.audio.push("audio/" + ALLOWED_EXT.audio[i]);
  }

  // Return object
  return mimeTypes;
}

// Export accepted file types
export const acceptedFileTypes = buildAcceptedList();
