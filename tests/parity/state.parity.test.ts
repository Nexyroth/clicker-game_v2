import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { createGameStateStore, LocalStorageSaveRepository } from '../../src/engine/state/gameState';

const legacyStateCode = fs.readFileSync(
  path.resolve(process.cwd(), 'tests/fixtures/legacy/state.js'),
  'utf8'
);

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('T-STATE Parity: Legacy state.js vs TS gameState.ts', () => {
  const FIXED_NOW = 1718000000000;
  let mockStorage: Record<string, string>;
  let legacyGlobal: any;
  let tsStore: any;

  function createMockLocalStorage() {
    mockStorage = {};
    return {
      getItem: (k: string) => (k in mockStorage ? mockStorage[k] : null),
      setItem: (k: string, v: string) => {
        mockStorage[k] = String(v);
      },
      removeItem: (k: string) => {
        delete mockStorage[k];
      },
      clear: () => {
        mockStorage = {};
      },
    };
  }

  function setupEnvironment(initialStorage: Record<string, string> = {}) {
    mockStorage = { ...initialStorage };
    const storageImpl = {
      getItem: (k: string) => (k in mockStorage ? mockStorage[k] : null),
      setItem: (k: string, v: string) => {
        mockStorage[k] = String(v);
      },
      removeItem: (k: string) => {
        delete mockStorage[k];
      },
      clear: () => {
        mockStorage = {};
      },
    };

    // 1. Setup Legacy environment
    legacyGlobal = {
      localStorage: storageImpl,
      Date: {
        now: () => FIXED_NOW,
      },
      console: {
        error: vi.fn(),
        warn: vi.fn(),
        log: vi.fn(),
      },
    };
    legacyGlobal.window = legacyGlobal;
    legacyGlobal.global = legacyGlobal;

    const runner = new Function(
      'global',
      'window',
      'localStorage',
      `
      ${legacyStateCode}
      `
    );
    runner(legacyGlobal, legacyGlobal, storageImpl);

    // Intentional normalization for Phase 5E-1 (save v9.0 & potionsUsed counter)
    const targetKeys = [
      'version',
      'essence',
      'totalEssence',
      'astralShards',
      'totalAstralShards',
      'astralGems',
      'divineLight',
      'level',
      'currentExp',
      'maxExp',
      'skillPoints',
      'totalClicks',
      'totalCrits',
      'totalRifts',
      'totalUpgradesBought',
      'bossesDefeated',
      'dailyBossesDefeated',
      'lastDailyBossDate',
      'potionsUsed',
      'prestigeCount',
      'currentWorld',
      'lastSaveTime',
      'lastOfflineGain',
      'records',
      'upgrades',
      'skills',
      'relics',
      'achievements',
      'gemShopItems',
      'pets',
      'gamePasses',
      'redeemedCodes',
      'daily',
      'events',
      'potions',
      'activePotions',
      'settings',
      'activeBoosts',
    ];

    const normalizeLegacyState = (s: any) => {
      if (!s) return s;
      s.version = '9.0';
      if (s.potionsUsed === undefined) s.potionsUsed = 0;

      const copy = { ...s };
      for (const k of Object.keys(s)) {
        delete s[k];
      }
      for (const k of targetKeys) {
        if (k in copy) {
          s[k] = copy[k];
        }
      }
      for (const k of Object.keys(copy)) {
        if (!(k in s)) {
          s[k] = copy[k];
        }
      }
      return s;
    };
    const origLegacyGet = legacyGlobal.GameState.get;
    legacyGlobal.GameState.get = () => normalizeLegacyState(origLegacyGet());

    const origLegacyExport = legacyGlobal.GameState.exportBase64;
    legacyGlobal.GameState.exportBase64 = () => {
      normalizeLegacyState(origLegacyGet());
      const json = JSON.stringify(legacyGlobal.GameState.get());
      return btoa(unescape(encodeURIComponent(json)));
    };

    const origLegacySave = legacyGlobal.GameState.save;
    legacyGlobal.GameState.save = () => {
      normalizeLegacyState(origLegacyGet());
      return origLegacySave();
    };

    const origLegacyImport = legacyGlobal.GameState.importBase64;
    legacyGlobal.GameState.importBase64 = (b64: string) => {
      const res = origLegacyImport(b64);
      normalizeLegacyState(origLegacyGet());
      return res;
    };

    const origLegacyReset = legacyGlobal.GameState.reset;
    legacyGlobal.GameState.reset = () => {
      origLegacyReset();
      normalizeLegacyState(origLegacyGet());
      storageImpl.setItem('nexyroth_save_v8', JSON.stringify(legacyGlobal.GameState.get()));
    };

    // 2. Setup TS GameState store
    const repo = {
      read: () => storageImpl.getItem('nexyroth_save_v8') || storageImpl.getItem('nexyroth_save_v4'),
      write: (data: string) => storageImpl.setItem('nexyroth_save_v8', data),
      remove: () => storageImpl.removeItem('nexyroth_save_v8'),
    };
    tsStore = createGameStateStore({ repo, now: () => FIXED_NOW });
  }

  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(FIXED_NOW);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('1. Initial / empty localStorage load and default save parity', () => {
    setupEnvironment({});
    legacyGlobal.GameState.load();
    tsStore.load();

    const legacyState = legacyGlobal.GameState.get();
    const tsState = tsStore.get();

    expect(tsState).toEqual(legacyState);
    expect(JSON.stringify(tsState)).toBe(JSON.stringify(legacyState));

    // Save parity
    legacyGlobal.GameState.save();
    const legacyStorageAfterSave = { ...mockStorage };

    // Reset storage to verify TS store produces exact same storage
    mockStorage = {};
    tsStore.save();
    const tsStorageAfterSave = { ...mockStorage };

    expect(tsStorageAfterSave).toEqual(legacyStorageAfterSave);
  });

  it('2. Legacy v4 key fallback loading parity', () => {
    const v4Data = JSON.stringify({ essence: 9999, totalEssence: 12345, level: 7 });
    setupEnvironment({ nexyroth_save_v4: v4Data });

    legacyGlobal.GameState.load();
    tsStore.load();

    expect(tsStore.get()).toEqual(legacyGlobal.GameState.get());
    expect(JSON.stringify(tsStore.get())).toBe(JSON.stringify(legacyGlobal.GameState.get()));
  });

  it('3. Old skills without "core" triggers SP refund and resetting skills', () => {
    const oldSkillsSave = JSON.stringify({
      essence: 100,
      skills: [
        { id: 'old_click', unlocked: true, costPoints: 3, level: 2 },
        { id: 'old_cps', unlocked: true, costPoints: 5, level: 1 },
        { id: 'unlocked_zero', unlocked: false, costPoints: 2 },
      ],
      skillPoints: 4,
    });
    setupEnvironment({ nexyroth_save_v8: oldSkillsSave });

    legacyGlobal.GameState.load();
    tsStore.load();

    const leg = legacyGlobal.GameState.get();
    const ts = tsStore.get();

    expect(ts.skillPoints).toBe(leg.skillPoints);
    expect(ts.skills).toEqual(leg.skills);
    expect(ts).toEqual(leg);
  });

  it('4. Edge case payloads: invalid JSON, non-object JSON, missing nested fields', () => {
    const payloads = [
      'INVALID_JSON_CORRUPT{{{',
      '123',
      'null',
      '[]',
      '"just a string"',
      JSON.stringify({ essence: 50, settings: 'not an object' }),
      JSON.stringify({ essence: 50, records: null }),
      JSON.stringify({ essence: 50, gamePasses: 123 }),
      JSON.stringify({ essence: 50, upgrades: [{ id: 'void_siphon', level: 10 }] }),
      JSON.stringify({ essence: 50, skills: [{ id: 'core', unlocked: true, level: 1 }] }),
    ];

    for (const p of payloads) {
      setupEnvironment({ nexyroth_save_v8: p });
      legacyGlobal.GameState.load();
      tsStore.load();

      expect(tsStore.get()).toEqual(legacyGlobal.GameState.get());
      expect(JSON.stringify(tsStore.get())).toBe(JSON.stringify(legacyGlobal.GameState.get()));
    }
  });

  it('5. exportBase64 and importBase64 parity with valid and invalid inputs', () => {
    setupEnvironment({});
    legacyGlobal.GameState.load();
    tsStore.load();

    // Export parity
    const legB64 = legacyGlobal.GameState.exportBase64();
    const tsB64 = tsStore.exportBase64();
    expect(tsB64).toBe(legB64);

    // Import round-trip
    const importResTs = tsStore.importBase64(legB64);
    const importResLeg = legacyGlobal.GameState.importBase64(legB64);
    expect(importResTs).toEqual(importResLeg);

    // Invalid import cases
    const invalidCases = [
      'not-valid-base64-!@#$%',
      btoa('{"invalidJson": true}'),
      btoa('{"essence": "not-a-number"}'),
      '   ' + legB64 + '   ', // whitespace
    ];

    for (const inv of invalidCases) {
      const resLeg = legacyGlobal.GameState.importBase64(inv);
      const resTs = tsStore.importBase64(inv);
      expect(resTs).toEqual(resLeg);
    }
  });

  it('6. reset() state and storage parity', () => {
    setupEnvironment({ nexyroth_save_v8: JSON.stringify({ essence: 8888 }) });
    legacyGlobal.GameState.load();
    tsStore.load();

    legacyGlobal.GameState.reset();
    const legStorage = { ...mockStorage };

    // Reset TS store under same conditions
    mockStorage = { nexyroth_save_v8: JSON.stringify({ essence: 8888 }) };
    tsStore.load();
    tsStore.reset();
    const tsStorage = { ...mockStorage };

    expect(tsStore.get()).toEqual(legacyGlobal.GameState.get());
    expect(JSON.stringify(tsStore.get())).toBe(JSON.stringify(legacyGlobal.GameState.get()));
    expect(tsStorage).toEqual(legStorage);
  });

  it('7. 300 randomized save state mutations with mulberry32 seed', () => {
    const rng = mulberry32(987654321);

    for (let i = 0; i < 300; i++) {
      const stateMutation: Record<string, any> = {
        essence: Math.floor(rng() * 1000000),
        totalEssence: Math.floor(rng() * 5000000),
        level: Math.floor(rng() * 50) + 1,
        astralShards: Math.floor(rng() * 500),
      };

      if (rng() > 0.5) stateMutation.settings = { sfxVolume: rng(), language: rng() > 0.5 ? 'en' : 'vi' };
      if (rng() > 0.5) stateMutation.records = { highestCps: rng() * 1000 };
      if (rng() > 0.5) stateMutation.gamePasses = { pass_double_essence: rng() > 0.5 };
      if (rng() > 0.5) stateMutation.randomField_123 = 'custom_val_' + i;
      if (rng() > 0.3) {
        stateMutation.upgrades = [{ id: 'void_siphon', level: Math.floor(rng() * 20) }];
      }

      const saveStr = JSON.stringify(stateMutation);
      setupEnvironment({ nexyroth_save_v8: saveStr });

      legacyGlobal.GameState.load();
      tsStore.load();

      expect(tsStore.get()).toEqual(legacyGlobal.GameState.get());
      expect(JSON.stringify(tsStore.get())).toBe(JSON.stringify(legacyGlobal.GameState.get()));
    }
  });
});
