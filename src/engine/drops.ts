/**
 * NEXYROTH CLICKER - PURE DROPS ENGINE (TypeScript)
 * Pure functions: No DOM, no window, no global state.
 */

export const POTION_DROP_COOLDOWN_MS = 60000;
export const GEM_DROP_COOLDOWN_MS = 90000;

export type PotionDropKey = 'potion_x2' | 'potion_x5' | 'potion_x10';

export function pickPotionDrop(roll: number): PotionDropKey {
  if (roll < 0.85) {
    return 'potion_x2';
  } else if (roll < 0.97) {
    return 'potion_x5';
  }
  return 'potion_x10';
}
