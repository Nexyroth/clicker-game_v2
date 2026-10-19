import { deepClone } from '../../core/clone';
import {
  DEFAULT_UPGRADES,
  DEFAULT_SKILLS,
  DEFAULT_RELICS,
  DEFAULT_ACHIEVEMENTS,
  DEFAULT_GEM_SHOP_ITEMS,
  DEFAULT_PETS,
  DEFAULT_GAME_PASS_KEYS,
  DEFAULT_DAILY_STREAK,
  DEFAULT_POTIONS,
  DEFAULT_ACTIVE_POTIONS,
  createDefaultEventState,
} from '../../data';
import type { GameState } from '../types';

/**
 * Pure function to construct a fresh initial GameState.
 * Exactly matches createInitialState() in js/state.js without side effects.
 *
 * @param now Timestamp to set for lastSaveTime (defaults to Date.now())
 */
export function createInitialState(now: number = Date.now()): GameState {
  return {
    version: '9.0',
    essence: 0,
    totalEssence: 0,
    astralShards: 0,
    totalAstralShards: 0,
    astralGems: 5,
    divineLight: 0,

    level: 1,
    currentExp: 0,
    maxExp: 100,
    skillPoints: 0,

    totalClicks: 0,
    totalCrits: 0,
    totalRifts: 0,
    totalUpgradesBought: 0,
    bossesDefeated: 0,
    dailyBossesDefeated: 0,
    lastDailyBossDate: '',
    potionsUsed: 0,
    prestigeCount: 0,
    currentWorld: 'w1',

    lastSaveTime: now,
    lastOfflineGain: 0,

    records: {
      highestCps: 0,
      highestClick: 0,
      maxClicksIn10s: 0,
    },

    upgrades: deepClone(DEFAULT_UPGRADES) as unknown as GameState['upgrades'],
    skills: deepClone(DEFAULT_SKILLS) as unknown as GameState['skills'],
    relics: deepClone(DEFAULT_RELICS) as unknown as GameState['relics'],
    achievements: deepClone(DEFAULT_ACHIEVEMENTS) as unknown as GameState['achievements'],
    gemShopItems: deepClone(DEFAULT_GEM_SHOP_ITEMS) as unknown as GameState['gemShopItems'],
    pets: deepClone(DEFAULT_PETS) as unknown as GameState['pets'],
    gamePasses: deepClone(DEFAULT_GAME_PASS_KEYS) as unknown as GameState['gamePasses'],
    redeemedCodes: [],

    daily: deepClone(DEFAULT_DAILY_STREAK) as unknown as GameState['daily'],
    events: createDefaultEventState(now) as unknown as GameState['events'],

    potions: deepClone(DEFAULT_POTIONS) as unknown as GameState['potions'],
    activePotions: deepClone(DEFAULT_ACTIVE_POTIONS) as unknown as GameState['activePotions'],

    settings: {
      language: 'vi',
      sfxEnabled: true,
      sfxVolume: 0.5,
      scientificNotation: false,
      floatingNumbers: true,
      particles: true,
    },
    activeBoosts: [],
  };
}
