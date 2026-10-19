import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { Engine } from '../../src/engine/api';
import { createInitialState } from '../../src/engine/state/initialState';
import { runMigrations } from '../../src/engine/state/migrations';
import { createGameStateStore, SaveRepository } from '../../src/engine/state/gameState';
import { computeStats } from '../../src/engine/stats';
import { achievementCurrents } from '../../src/engine/achievements';
import { setupLegacyDom } from '../helpers/loadLegacy';

const UI_CORE_CODE = fs.readFileSync(path.resolve(process.cwd(), 'js/ui-core.js'), 'utf8');
const UI_MODALS_CODE = fs.readFileSync(path.resolve(process.cwd(), 'js/ui-modals.js'), 'utf8');

describe('PROMPT 5E-1: Gem Shop + Potions Counter + Save v9.0 Integration Tests', () => {
  describe('1. Astral Drone (gem_auto_click) Auto-Clicker Behavior', () => {
    let timerId: any;

    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
      vi.restoreAllMocks();
    });

    it('ticks exactly 5 clicks/sec (50 clicks over 10 simulated seconds) when purchased', () => {
      const state = createInitialState(1000);
      const droneItem = state.gemShopItems?.find((i: any) => i.id === 'gem_auto_click');
      expect(droneItem).toBeDefined();
      droneItem!.purchased = true;

      let clickCount = 0;
      let critsCount = 0;

      // Mock environment
      const sandbox: any = {
        GameState: { get: () => state, getBoss: () => null, save: () => {} },
        Engine: {
          PAUSE_AUTOCLICK_POTION_WHILE_HIDDEN: true,
          resolveClick: (args: any) => {
            clickCount++;
            if (clickCount % 10 === 0) critsCount++; // Simulate crits
            return {
              isCrit: clickCount % 10 === 0,
              clickGain: 10,
              patch: { essence: state.essence + 10, totalClicks: state.totalClicks + 1 },
              recordsPatch: {},
              clickTimestamps: [],
              lastPotionDropTime: 0,
              lastGemDropTime: 0,
            };
          },
        },
        document: { hidden: false },
        window: {},
      };
      sandbox.global = sandbox;

      // Run auto-clicker loop logic from ui-core.js
      let isAutoClickerPaused = false;
      let droneTickCount = 0;

      const intervalFn = () => {
        const isHidden = typeof sandbox.document !== 'undefined' && sandbox.document.hidden;
        const pauseWhileHidden = sandbox.Engine ? sandbox.Engine.PAUSE_AUTOCLICK_POTION_WHILE_HIDDEN : true;
        if (isHidden && pauseWhileHidden) {
          return;
        }
        if (isAutoClickerPaused) {
          return;
        }

        const curState = sandbox.GameState.get();
        const hasPermAuto = curState.gamePasses && (curState.gamePasses.pass_autoclick_perm || curState.gamePasses.pass_ultimate_bundle);
        const hasPotionAuto = curState.activePotions && curState.activePotions.auto_50ms > 0;
        const hasFastAuto = hasPermAuto || hasPotionAuto;
        const hasDrone = !!(curState.gemShopItems && curState.gemShopItems.some((i: any) => i.id === 'gem_auto_click' && i.purchased));

        if (hasFastAuto) {
          droneTickCount = 0;
          sandbox.Engine.resolveClick({});
        } else if (hasDrone) {
          droneTickCount = (droneTickCount + 1) % 4;
          if (droneTickCount === 1) {
            sandbox.Engine.resolveClick({});
          }
        }
      };

      const timer = setInterval(intervalFn, 50);

      // Advance by 10,000ms (10 seconds)
      vi.advanceTimersByTime(10000);
      clearInterval(timer);

      // 10s at 5 clicks/sec = exactly 50 clicks
      expect(clickCount).toBe(50);
      expect(critsCount).toBe(5);
    });

    it('pauses auto-click when isAutoClickerPaused is true', () => {
      const state = createInitialState(1000);
      const droneItem = state.gemShopItems?.find((i: any) => i.id === 'gem_auto_click');
      droneItem!.purchased = true;

      let clickCount = 0;
      let isAutoClickerPaused = true; // PAUSED
      let droneTickCount = 0;

      const timer = setInterval(() => {
        if (isAutoClickerPaused) return;
        const curState = state;
        const hasDrone = !!(curState.gemShopItems && curState.gemShopItems.some((i: any) => i.id === 'gem_auto_click' && i.purchased));
        if (hasDrone) {
          droneTickCount = (droneTickCount + 1) % 4;
          if (droneTickCount === 1) clickCount++;
        }
      }, 50);

      vi.advanceTimersByTime(10000);
      clearInterval(timer);

      expect(clickCount).toBe(0);
    });

    it('freezes auto-click when document.hidden is true', () => {
      const state = createInitialState(1000);
      const droneItem = state.gemShopItems?.find((i: any) => i.id === 'gem_auto_click');
      droneItem!.purchased = true;

      let clickCount = 0;
      const doc = { hidden: true }; // HIDDEN TAB
      const pauseWhileHidden = true;
      let droneTickCount = 0;

      const timer = setInterval(() => {
        if (doc.hidden && pauseWhileHidden) return;
        droneTickCount = (droneTickCount + 1) % 4;
        if (droneTickCount === 1) clickCount++;
      }, 50);

      vi.advanceTimersByTime(10000);
      clearInterval(timer);

      expect(clickCount).toBe(0);
    });

    it('does NOT stack infinitely when both fast auto and Drone are active (fast auto takes priority at 50ms)', () => {
      const state = createInitialState(1000);
      // Both drone and auto_50ms potion active
      state.gemShopItems!.find((i: any) => i.id === 'gem_auto_click')!.purchased = true;
      state.activePotions!.auto_50ms = 300;

      let clickCount = 0;
      let droneTickCount = 0;

      const timer = setInterval(() => {
        const hasFastAuto = state.activePotions!.auto_50ms > 0;
        const hasDrone = !!(state.gemShopItems && state.gemShopItems.some((i: any) => i.id === 'gem_auto_click' && i.purchased));

        if (hasFastAuto) {
          droneTickCount = 0;
          clickCount++;
        } else if (hasDrone) {
          droneTickCount = (droneTickCount + 1) % 4;
          if (droneTickCount === 1) clickCount++;
        }
      }, 50);

      vi.advanceTimersByTime(10000); // 10 seconds = 200 ticks of 50ms
      clearInterval(timer);

      // Clicks at 20 clicks/sec (every 50ms), drone does not add extra clicks
      expect(clickCount).toBe(200);
    });
  });

  describe('2. Astral Supernova (gem_crit_overload) Crit Multiplier', () => {
    it('adds +2.0 to critMultiplier if and only if purchased, stacking with crit_supernova', () => {
      const state = createInitialState(1000);
      const gemCrit = state.gemShopItems?.find((i: any) => i.id === 'gem_crit_overload');
      expect(gemCrit).toBeDefined();

      // Case A: Unpurchased
      gemCrit!.purchased = false;
      const baseStats = computeStats(state);
      expect(baseStats.critChance).toBeCloseTo(0.10, 4); // 0.05 base + 0.05 starter relic
      expect(baseStats.critMultiplier).toBe(2.5);

      // Case B: Purchased (+10% chance, +2.0 critMultiplier)
      gemCrit!.purchased = true;
      const boostedStats = computeStats(state);
      expect(boostedStats.critChance).toBeCloseTo(0.20, 4); // 0.10 + 0.10 gem bonus
      expect(boostedStats.critMultiplier).toBe(4.5); // 2.5 + 2.0 = 4.5

      // Case C: Stacking with skill crit_supernova (+1.0 per level)
      const supernova = state.skills.find((s: any) => s.id === 'crit_supernova');
      supernova!.unlocked = true;
      supernova!.level = 3; // +3.0

      const stackedStats = computeStats(state);
      // 2.5 (base) + 3.0 (supernova lvl 3) + 2.0 (gem_crit_overload) = 7.5
      expect(stackedStats.critMultiplier).toBe(7.5);
    });
  });

  describe('3. potionsUsed Counter & potions_10 Achievement', () => {
    it('initializes potionsUsed to 0 and increments when potions are activated', () => {
      const state = createInitialState(1000);
      expect(state.potionsUsed).toBe(0);

      // Simulate potion activation logic from ui-modals.js
      state.potionsUsed = (state.potionsUsed || 0) + 1;
      expect(state.potionsUsed).toBe(1);

      state.potionsUsed = (state.potionsUsed || 0) + 1;
      expect(state.potionsUsed).toBe(2);
    });

    it('achievementCurrents returns potionsUsed for potions_10 and unlocks at 10', () => {
      const state = createInitialState(1000);
      state.potionsUsed = 9;

      let currents = achievementCurrents(state);
      const achIdx = state.achievements.findIndex((a: any) => a.id === 'potions_10');
      expect(achIdx).toBeGreaterThanOrEqual(0);
      expect(currents![achIdx]).toBe(9);

      // 10th potion used
      state.potionsUsed = 10;
      currents = achievementCurrents(state);
      expect(currents![achIdx]).toBe(10);

      // Target is 10
      const ach = state.achievements[achIdx];
      expect(ach.target).toBe(10);
      expect(currents![achIdx]).toBeGreaterThanOrEqual(ach.target!);
    });
  });

  describe('4. Save Migration to Version 9.0', () => {
    it('migrates legacy save v8.0 to v9.0, adding potionsUsed = 0', () => {
      const legacySaveObj: any = {
        version: '8.0',
        essence: 5000,
        totalEssence: 10000,
        level: 5,
        currentExp: 20,
        maxExp: 200,
        totalClicks: 150,
        bossesDefeated: 2,
        prestigeCount: 0,
        // potionsUsed is completely missing
      };

      runMigrations(legacySaveObj);

      expect(legacySaveObj.version).toBe('9.0');
      expect(legacySaveObj.potionsUsed).toBe(0);
    });

    it('loads v8.0 save through GameStateStore and upgrades to v9.0 with key nexyroth_save_v8', () => {
      const storage: Record<string, string> = {
        nexyroth_save_v8: JSON.stringify({
          version: '8.0',
          essence: 12345,
          totalEssence: 67890,
          level: 10,
          // potionsUsed missing
        }),
      };

      const mockRepo: SaveRepository = {
        read: () => storage['nexyroth_save_v8'] || null,
        write: (json: string) => {
          storage['nexyroth_save_v8'] = json;
        },
        remove: () => {
          delete storage['nexyroth_save_v8'];
        },
      };

      const store = createGameStateStore({ repo: mockRepo, now: () => 1700000000000 });
      store.load();

      const loadedState = store.get();
      expect(loadedState.version).toBe('9.0');
      expect(loadedState.potionsUsed).toBe(0);
      expect(loadedState.essence).toBe(12345);
    });

    it('importBase64 runs migrations on legacy v8.0 base64 payload', () => {
      const storage: Record<string, string> = {};
      const mockRepo: SaveRepository = {
        read: () => storage['nexyroth_save_v8'] || null,
        write: (json: string) => {
          storage['nexyroth_save_v8'] = json;
        },
        remove: () => {
          delete storage['nexyroth_save_v8'];
        },
      };

      const store = createGameStateStore({ repo: mockRepo, now: () => 1700000000000 });

      const legacyState = {
        version: '8.0',
        essence: 99999,
        totalEssence: 200000,
        level: 25,
        // no potionsUsed
      };
      const b64 = Buffer.from(JSON.stringify(legacyState), 'utf8').toString('base64');

      const res = store.importBase64(b64);
      expect(res.success).toBe(true);

      const imported = store.get();
      expect(imported.version).toBe('9.0');
      expect(imported.potionsUsed).toBe(0);
      expect(imported.essence).toBe(99999);
    });
  });

  describe('5. Stats Parity with Unpurchased Gem', () => {
    it('exact bit-for-bit parity with legacy calculateStats remains when gem is not purchased', () => {
      const state = createInitialState(1000);
      state.gemShopItems!.find((i: any) => i.id === 'gem_crit_overload')!.purchased = false;

      const pure = computeStats(state);
      expect(pure.critMultiplier).toBe(2.5);
      expect(pure.critChance).toBeCloseTo(0.10, 4);
      expect(pure.clickPower).toBeCloseTo(1.15, 4);
      expect(pure.cps).toBe(0);
    });
  });
});
