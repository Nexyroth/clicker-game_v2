/**
 * NEXYROTH CLICKER - BONUSES & MULTIPLIERS BRIDGE (TypeScript)
 * Delegates to pure bonusRules while maintaining window.Bonuses API.
 */
import { getState } from '../bridge/legacyState';
import type { BonusesSnapshot } from './types';
import {
  bossDamageMultiplier,
  itemDropChance,
  gemDropChance,
  offlineEfficiency,
  achievementBuffPercent,
  allBonuses,
} from './bonusRules';

export function getBossDamageMultiplier(): number {
  return bossDamageMultiplier(getState());
}

export function getItemDropChance(): number {
  return itemDropChance(getState());
}

export function getGemDropChance(): number {
  return gemDropChance(getState());
}

export function getOfflineEfficiency(): number {
  return offlineEfficiency(getState());
}

export function getAchievementBuffPercent(): number {
  return achievementBuffPercent(getState());
}

export function getAllBonuses(): BonusesSnapshot {
  return allBonuses(getState());
}

export const Bonuses = {
  getBossDamageMultiplier: getBossDamageMultiplier,
  getItemDropChance: getItemDropChance,
  getGemDropChance: getGemDropChance,
  getOfflineEfficiency: getOfflineEfficiency,
  getAchievementBuffPercent: getAchievementBuffPercent,
  getAllBonuses: getAllBonuses,
};

if (typeof window !== 'undefined') {
  (window as unknown as { Bonuses: typeof Bonuses }).Bonuses = Bonuses;
}
