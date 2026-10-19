import type { BonusesState } from '../engine/types';

/**
 * Bridge for GameState.
 * Accesses state via window.GameState with strongly-typed API.
 */
export function getState(): BonusesState {
  if (typeof window !== 'undefined' && window.GameState?.get) {
    return window.GameState.get();
  }
  return {};
}

