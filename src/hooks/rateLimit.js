// -- Rate-limiting logic -- //

// Timespan
const WINDOW_MS = 60000; // 1 minute

// Memory
const buckets = new Map();

// Strictness
const TIERS = [
  {
    name: "strict",
    paths: [
      "/api/check-username",
      "/api/search",
      "/api/random",
      "/api/latest",
      "/api/guests",
      "/api/users",
      "/api/preview",
    ],
    windowMs: WINDOW_MS,
    max: 60, // Max requests (default: 60) per timespan (default: 1 minute / 60000ms)
  },
  {
    name: "loose",
    paths: [
      "/api/rss",
      "/api/media",
    ],
    windowMs: WINDOW_MS,
    max: 240, // Max requests (default: 240) per timespan (default: 1 minute / 60000ms)
  },
];

// Helper to set strictness
function matchTier(path) {
  // For each strictness level
  for (const tier of TIERS) {
    // If the request route is restricted, return it.
    if (tier.paths.some((p) => path.startsWith(p))) return tier;
  }
  // Otherwise, return nothing.
  return null;
}

// Main function
export function rateLimit({ event, isAdmin }) {
  // Admin are unrestricted
	if (isAdmin) return null;

  // Find a matching strictness level
  const tier = matchTier(event.url.pathname);

  // If match was not found, return early.
  if (!tier) return null;

  // Capture client IP
  const ip = event.getClientAddress();

  // Create a key for quota tracking
  const key = `${tier.name}:${ip}`;
  
  // Track the client IP's current quota
  const now = Date.now();

  // Find an existing key
  let b = buckets.get(key);

  // If the timespan has passed, reset the counter
  if (!b || now > b.resetAt) b = { count: 0, resetAt: now + tier.windowMs };

  // Add one to the current quota
  b.count++;

  // Set the current key quota value
  buckets.set(key, b);

  // Return the current quota status
  return b.count > tier.max ? Math.ceil((b.resetAt - now) / 1000) : null;
}
