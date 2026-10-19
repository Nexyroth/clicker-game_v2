/**
 * Helper: Deep 1-level merge to preserve any custom properties without overwriting new fields.
 * Exactly matches legacy deepMerge in js/state.js:836-845.
 *
 * Quirk Note: If target[key] is an object but source[key] is a non-object (e.g. a string),
 * Object.assign({}, target[key], source[key] || {}) is executed in the exact legacy manner.
 * DO NOT add defensive guards here; preserve bug-for-bug legacy parity.
 */
export function deepMerge<T extends object, S extends object>(target: T, source: S): T {
  if (!source || typeof source !== 'object') return target;
  const output = Object.assign({}, target, source) as Record<string, unknown>;
  const targetRecord = target as unknown as Record<string, unknown>;
  const sourceRecord = source as unknown as Record<string, unknown>;

  Object.keys(targetRecord).forEach((key) => {
    const targetVal = targetRecord[key];
    if (targetVal && typeof targetVal === 'object' && !Array.isArray(targetVal)) {
      output[key] = Object.assign(
        {},
        targetVal as object,
        (sourceRecord[key] as object) || {}
      );
    }
  });

  return output as unknown as T;
}
