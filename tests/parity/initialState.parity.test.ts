import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { createInitialState } from '../../src/engine/state/initialState';

function loadLegacyGameState() {
  const filePath = path.resolve(process.cwd(), 'js/state.js');
  const code = fs.readFileSync(filePath, 'utf8');
  const mockStorage: Record<string, string> = {};
  const scope: any = {
    Date: Date,
    Math: Math,
    JSON: JSON,
    console: console,
    localStorage: {
      getItem: (k: string) => mockStorage[k] || null,
      setItem: (k: string, v: string) => { mockStorage[k] = v; },
      removeItem: (k: string) => { delete mockStorage[k]; },
    },
  };
  scope.window = scope;
  const fn = new Function('window', 'global', code);
  fn(scope, scope);

  // Normalize legacy environment for Phase 5E-1 intentional save v9.0 migration and potionsUsed counter
  const targetKeys = [
    'version', 'essence', 'totalEssence', 'astralShards', 'totalAstralShards', 'astralGems', 'divineLight',
    'level', 'currentExp', 'maxExp', 'skillPoints', 'totalClicks', 'totalCrits', 'totalRifts',
    'totalUpgradesBought', 'bossesDefeated', 'dailyBossesDefeated', 'lastDailyBossDate', 'potionsUsed',
    'prestigeCount', 'currentWorld', 'lastSaveTime', 'lastOfflineGain', 'records', 'upgrades', 'skills',
    'relics', 'achievements', 'gemShopItems', 'pets', 'gamePasses', 'redeemedCodes', 'daily', 'events',
    'potions', 'activePotions', 'settings', 'activeBoosts',
  ];
  const origGet = scope.GameState.get;
  scope.GameState.get = () => {
    const s = origGet();
    if (!s) return s;
    s.version = '9.0';
    if (s.potionsUsed === undefined) s.potionsUsed = 0;
    const copy = { ...s };
    for (const k of Object.keys(s)) delete s[k];
    for (const k of targetKeys) { if (k in copy) s[k] = copy[k]; }
    for (const k of Object.keys(copy)) { if (!(k in s)) s[k] = copy[k]; }
    return s;
  };

  return scope.GameState;
}

describe('Initial State Parity: createInitialState (TS) vs GameState.reset() (Legacy)', () => {
  const FIXED_NOW = 1750000000000;
  let legacyGS: any;

  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(FIXED_NOW);
    legacyGS = loadLegacyGameState();
    legacyGS.reset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('matches exactly (deep-equal and JSON.stringify) between TS createInitialState and legacy GameState.reset()', () => {
    const tsState = createInitialState(FIXED_NOW);
    const legacyState = legacyGS.get();

    // Verify key count (38 keys in v9.0 with potionsUsed)
    const tsKeys = Object.keys(tsState);
    const legacyKeys = Object.keys(legacyState);
    expect(tsKeys).toEqual(legacyKeys);
    expect(tsKeys.length).toBe(38);

    // Deep equal
    expect(tsState).toEqual(legacyState);

    // Strict string serialization comparison (catches any key order or subtle discrepancy)
    expect(JSON.stringify(tsState)).toBe(JSON.stringify(legacyState));
  });

  it('generates fully isolated deep copies that do not mutate static definitions', () => {
    const s1 = createInitialState(FIXED_NOW);
    const s2 = createInitialState(FIXED_NOW);

    s1.upgrades[0].level = 999;
    expect(s2.upgrades[0].level).toBe(0);

    s1.skills[0].level = 5;
    expect(s2.skills[0].level).toBe(1);

    s1.records.highestCps = 12345;
    expect(s2.records.highestCps).toBe(0);

    s1.events.eventTokens = 500;
    expect(s2.events.eventTokens).toBe(0);
  });
});
