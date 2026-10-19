import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { loadLegacy } from '../helpers/loadLegacy';

describe('T8: Save & State Persistence Characterization Tests', () => {
  let GameState: any;

  beforeEach(() => {
    const legacy = loadLegacy();
    GameState = legacy.GameState;
    GameState.load();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('performs round-trip save and load maintaining all state properties', () => {
    const state = GameState.get();
    state.essence = 123456;
    state.totalEssence = 987654;
    state.level = 42;
    state.astralGems = 99;
    state.upgrades[0].level = 15;
    state.records.highestCps = 8888;

    GameState.save();

    // Reset local state in memory
    GameState.set({});

    // Load from localStorage
    GameState.load();
    const loaded = GameState.get();

    expect(loaded.essence).toBe(123456);
    expect(loaded.totalEssence).toBe(987654);
    expect(loaded.level).toBe(42);
    expect(loaded.astralGems).toBe(99);
    expect(loaded.upgrades[0].level).toBe(15);
    expect(loaded.records.highestCps).toBe(8888);
  });

  it('updates lastSaveTime whenever save() is called', () => {
    const state = GameState.get();
    const beforeTime = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(beforeTime + 5000);

    GameState.save();
    expect(state.lastSaveTime).toBe(beforeTime + 5000);
  });

  it('populates missing fields from defaults when loading an older partial save', () => {
    // Simulate legacy v4 save with only a few fields
    const partialSave = {
      essence: 500,
      totalEssence: 1000,
      level: 3,
      upgrades: [{ id: 'void_siphon', level: 8 }]
    };
    localStorage.setItem('nexyroth_save_v8', JSON.stringify(partialSave));

    GameState.load();
    const loaded = GameState.get();

    // Old data kept
    expect(loaded.essence).toBe(500);
    expect(loaded.level).toBe(3);
    const siphon = loaded.upgrades.find((u: any) => u.id === 'void_siphon');
    expect(siphon.level).toBe(8);

    // Missing upgrades appended from defaults (total 41)
    expect(loaded.upgrades.length).toBe(41);
    // Missing skills, relics, achievements filled
    expect(loaded.skills.length).toBe(16);
    expect(loaded.relics.length).toBe(27);
    expect(loaded.achievements.length).toBe(35);
    expect(loaded.records).toBeDefined();
    expect(loaded.gamePasses).toBeDefined();
  });

  it('loads fallback from "nexyroth_save_v4" key when "nexyroth_save_v8" is absent', () => {
    localStorage.removeItem('nexyroth_save_v8');
    const v4Data = {
      essence: 7777,
      totalEssence: 8888,
      level: 7,
      upgrades: []
    };
    localStorage.setItem('nexyroth_save_v4', JSON.stringify(v4Data));

    GameState.load();
    const loaded = GameState.get();

    expect(loaded.essence).toBe(7777);
    expect(loaded.level).toBe(7);
  });

  it('handles corrupted JSON in localStorage gracefully without crashing', () => {
    localStorage.setItem('nexyroth_save_v8', 'INVALID_NOT_A_JSON{}}{');

    expect(() => {
      GameState.load();
    }).not.toThrow();

    const loaded = GameState.get();
    expect(loaded).toBeDefined();
    expect(loaded.version).toBe('9.0');
  });

  describe('exportBase64 and importBase64', () => {
    it('successfully round-trips state through Base64 string', () => {
      const state = GameState.get();
      state.essence = 55555;
      state.level = 18;

      const b64 = GameState.exportBase64();
      expect(typeof b64).toBe('string');
      expect(b64.length).toBeGreaterThan(20);

      // Modify state
      state.essence = 0;
      state.level = 1;

      // Import back
      const result = GameState.importBase64(b64);
      expect(result.success).toBe(true);

      const restored = GameState.get();
      expect(restored.essence).toBe(55555);
      expect(restored.level).toBe(18);
    });

    it('returns failure object and does not throw when importing invalid or garbage string', () => {
      const resultGarbage = GameState.importBase64('%%%NOT_A_BASE64_STRING%%%');
      expect(resultGarbage.success).toBe(false);
      expect(resultGarbage.error).toBeDefined();

      // Valid base64 but invalid game JSON
      const invalidJsonB64 = btoa(JSON.stringify({ notAField: true }));
      const resultInvalid = GameState.importBase64(invalidJsonB64);
      expect(resultInvalid.success).toBe(false);
      expect(resultInvalid.error).toBeDefined();
    });
  });
});
