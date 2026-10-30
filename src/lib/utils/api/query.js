// -- Configuration and utilities for ComixCleric -- //

// Helper function for creating filters (kept for compatibility)
export const addFilter = (
  target,
  key,
  value,
  filterConfig,
  operator = "_or",
) => {
  if (!value || value === "*") return;

  const conditions = Array.isArray(value)
    ? value.map((v) => ({ [key]: filterConfig(v) }))
    : [{ [key]: filterConfig }];

  if (conditions.length === 1) {
    target[key] = Array.isArray(value) ? filterConfig(value[0]) : filterConfig;
  } else {
    target[operator] = [...(target[operator] ?? []), ...conditions];
  }
};
