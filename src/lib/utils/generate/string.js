// -- Various string transform and generation helpers and utilities -- //

// Very basic string capitalization function
export function capitalizeString(string) {
  // If the string contains characters
  if (string?.length > 0) {
    // Return modified string
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

// Random string generator
// TODO: Update name to generateRandomString
export function generateString(prefix, length = 6) {
  // Possible characters for string generation (can be any valid character)
  const tokens = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  // Initialize result to string prefix
  let result = prefix;
  // Find total length of available tokens
  const tokenLength = tokens.length;
  // For the `length` of string to generate
  for (let i = 0; i < length; i++) {
    // Take the result string and add a new character/token
    result += tokens.charAt(Math.floor(Math.random() * tokenLength));
  }
  // Return the result (prefix + token string)
  return result;
}

// Replaces provided text with a string of dots of equal length (censor string can be anything)
// This does not detect anything, it is for manually hiding text
export function censor(str, bool) {
  // If enabled
  if (bool) {
    // Return only dots equal to the original string length
    return Array.from(str, () => '•').join('');
  }
  // Otherwise, return the string unchanged
  return str;
};

// Parses text to generate links from hashtags
export const generateHashtags = (string, url = "https://bsky.app/hashtag/") => {
  // Replace hashtag string with a normal HTML link tag.
  const res = string.replace(
    /#(\w+)/g,
    `<a href="${url}$1" target="_blank" class="link">#$1</a>`,
  );
  // Return the new text
  return res;
};
