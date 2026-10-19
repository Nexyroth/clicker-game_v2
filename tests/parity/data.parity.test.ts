import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';

import {
  DEFAULT_UPGRADES,
  DEFAULT_SKILLS,
  DEFAULT_RELICS,
  DEFAULT_ACHIEVEMENTS,
  DEFAULT_GEM_SHOP_ITEMS,
  DEFAULT_PETS,
  DEFAULT_POTIONS,
  DEFAULT_ACTIVE_POTIONS,
  POTION_METADATA,
  DEFAULT_GAME_PASSES,
  DEFAULT_GAME_PASS_KEYS,
  GEM_TOPUP_PACKS,
  WORLDS,
  BOSS_PRESETS,
  DEFAULT_DAILY_STREAK,
  DEFAULT_EVENT_QUESTS,
  createDefaultEventState,
} from '../../src/data';

function loadLegacyGameState() {
  const filePath = path.resolve(process.cwd(), 'js/state.js');
  const code = fs.readFileSync(filePath, 'utf8');
  const scope: any = {
    Date: Date,
    Math: Math,
    JSON: JSON,
    console: console,
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    },
  };
  scope.window = scope;
  const fn = new Function('window', 'global', code);
  fn(scope, scope);
  return scope.GameState;
}

describe('Data Parity: Static Game Data (Legacy js/state.js vs TS src/data)', () => {
  const FIXED_TIME = 1700000000000;
  let legacyGS: any;
  let legacyState: any;

  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(FIXED_TIME);
    legacyGS = loadLegacyGameState();
    legacyState = legacyGS.get();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('1. Upgrades table: exact deep-equal, key order and count of 41', () => {
    expect(DEFAULT_UPGRADES).toHaveLength(41);
    expect(DEFAULT_UPGRADES).toEqual(legacyState.upgrades);
    expect(JSON.stringify(DEFAULT_UPGRADES)).toBe(JSON.stringify(legacyState.upgrades));
  });

  it('2. Skills table: exact deep-equal, key order and count of 16', () => {
    expect(DEFAULT_SKILLS).toHaveLength(16);
    expect(DEFAULT_SKILLS).toEqual(legacyState.skills);
    expect(JSON.stringify(DEFAULT_SKILLS)).toBe(JSON.stringify(legacyState.skills));
  });

  it('3. Relics table: exact deep-equal, key order and count of 27', () => {
    expect(DEFAULT_RELICS).toHaveLength(27);
    expect(DEFAULT_RELICS).toEqual(legacyState.relics);
    expect(JSON.stringify(DEFAULT_RELICS)).toBe(JSON.stringify(legacyState.relics));
  });

  it('4. Achievements table: exact deep-equal, key order and count of 35', () => {
    expect(DEFAULT_ACHIEVEMENTS).toHaveLength(35);
    expect(DEFAULT_ACHIEVEMENTS).toEqual(legacyState.achievements);
    expect(JSON.stringify(DEFAULT_ACHIEVEMENTS)).toBe(JSON.stringify(legacyState.achievements));
  });

  it('5. Gem shop items table: exact deep-equal, key order and count of 4', () => {
    expect(DEFAULT_GEM_SHOP_ITEMS).toHaveLength(4);
    expect(DEFAULT_GEM_SHOP_ITEMS).toEqual(legacyState.gemShopItems);
    expect(JSON.stringify(DEFAULT_GEM_SHOP_ITEMS)).toBe(JSON.stringify(legacyState.gemShopItems));
  });

  it('6. Pets table: exact deep-equal, key order and count of 19', () => {
    const keys = Object.keys(DEFAULT_PETS);
    expect(keys).toHaveLength(19);
    expect(DEFAULT_PETS).toEqual(legacyState.pets);
    expect(JSON.stringify(DEFAULT_PETS)).toBe(JSON.stringify(legacyState.pets));
  });

  it('7. Potions default state: exact deep-equal, key order and count of 7', () => {
    expect(Object.keys(DEFAULT_POTIONS)).toHaveLength(7);
    expect(DEFAULT_POTIONS).toEqual(legacyState.potions);
    expect(JSON.stringify(DEFAULT_POTIONS)).toBe(JSON.stringify(legacyState.potions));
  });

  it('8. Active potions default state: exact deep-equal, key order and count of 7', () => {
    expect(Object.keys(DEFAULT_ACTIVE_POTIONS)).toHaveLength(7);
    expect(DEFAULT_ACTIVE_POTIONS).toEqual(legacyState.activePotions);
    expect(JSON.stringify(DEFAULT_ACTIVE_POTIONS)).toBe(JSON.stringify(legacyState.activePotions));
  });

  it('9. Potion metadata: exact deep-equal, key order and count of 7', () => {
    const legacyMeta = legacyGS.getPotionMetadata();
    expect(POTION_METADATA).toHaveLength(7);
    expect(POTION_METADATA).toEqual(legacyMeta);
    expect(JSON.stringify(POTION_METADATA)).toBe(JSON.stringify(legacyMeta));
  });

  it('10. Game passes definition table: exact deep-equal, key order and count of 6', () => {
    const legacyPasses = legacyGS.getGamePasses();
    expect(DEFAULT_GAME_PASSES).toHaveLength(6);
    expect(DEFAULT_GAME_PASSES).toEqual(legacyPasses);
    expect(JSON.stringify(DEFAULT_GAME_PASSES)).toBe(JSON.stringify(legacyPasses));
  });

  it('11. Game passes default state keys: exact deep-equal and key order', () => {
    expect(DEFAULT_GAME_PASS_KEYS).toEqual(legacyState.gamePasses);
    expect(JSON.stringify(DEFAULT_GAME_PASS_KEYS)).toBe(JSON.stringify(legacyState.gamePasses));
  });

  it('12. Gem topup packs table: exact deep-equal, key order and count of 5', () => {
    const legacyPacks = legacyGS.getGemTopupPacks();
    expect(GEM_TOPUP_PACKS).toHaveLength(5);
    expect(GEM_TOPUP_PACKS).toEqual(legacyPacks);
    expect(JSON.stringify(GEM_TOPUP_PACKS)).toBe(JSON.stringify(legacyPacks));
  });

  it('13. Worlds table: exact deep-equal, key order and count of 4', () => {
    const legacyWorlds = legacyGS.getWorlds();
    expect(WORLDS).toHaveLength(4);
    expect(WORLDS).toEqual(legacyWorlds);
    expect(JSON.stringify(WORLDS)).toBe(JSON.stringify(legacyWorlds));
  });

  it('14. Boss presets table: exact deep-equal, key order and count of 5', () => {
    const legacyPresets = legacyGS.getBossPresets();
    expect(BOSS_PRESETS).toHaveLength(5);
    expect(BOSS_PRESETS).toEqual(legacyPresets);
    expect(JSON.stringify(BOSS_PRESETS)).toBe(JSON.stringify(legacyPresets));
  });

  it('15. Daily streak default: exact deep-equal and key order', () => {
    expect(DEFAULT_DAILY_STREAK).toEqual(legacyState.daily);
    expect(JSON.stringify(DEFAULT_DAILY_STREAK)).toBe(JSON.stringify(legacyState.daily));
  });

  it('16. Event quests table: exact deep-equal and count of 6', () => {
    expect(DEFAULT_EVENT_QUESTS).toHaveLength(6);
    expect(DEFAULT_EVENT_QUESTS).toEqual(legacyState.events.quests);
    expect(JSON.stringify(DEFAULT_EVENT_QUESTS)).toBe(JSON.stringify(legacyState.events.quests));
  });

  it('17. createDefaultEventState: exact deep-equal and key order with legacy events state', () => {
    const eventState = createDefaultEventState(FIXED_TIME);
    expect(eventState).toEqual(legacyState.events);
    expect(JSON.stringify(eventState)).toBe(JSON.stringify(legacyState.events));
  });
});
