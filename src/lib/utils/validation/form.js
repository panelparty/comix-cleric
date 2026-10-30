// Browser-safe form validation helpers.
// These run on the client do not add server-only imports here.

// Returns an error array if the file exceeds the size limit, or null if it's fine.
export function validateFileSize(file, sizeMB = 50) {
  if (file.size > 1024 * 1024 * sizeMB) {
    return ["FILE_TOO_LARGE"];
  }

  return null;
}
