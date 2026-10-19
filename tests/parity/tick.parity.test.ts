import { describe, it, expect, vi } from 'vitest';
import { Engine } from '../../src/engine/api';
import { buildLegacyMainScope } from '../helpers/extractLegacyFunction';
import type { ActiveBoost } from '../../src/engine/types';

// Seeded pseudo-random generator for 100% reproducible testing
function createRng(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('T-TICK Parity: stepTick vs Legacy gameTick Steps 1-3', () => {
  it('matches exactly across at least 500 sequences of 1 to 200 ticks', () => {
    const rng = createRng(0x5cb_71c);

    for (let seq = 0; seq < 500; seq++) {
      const numTicks = 1 + Math.floor(rng() * 200);

      const initialEssence = rng() < 0.1 ? 0 : rng() * 1e20;
      const initialTotalEssence = initialEssence + (rng() < 0.1 ? 0 : rng() * 1e20);
      const cps = rng() < 0.1 ? 0 : rng() * 1e22;
      const frenzyMultiplier = 1 + Math.floor(rng() * 8);

      // Boosts
      const boostCount = Math.floor(rng() * 4);
      const initialBoosts: ActiveBoost[] = [];
      for (let b = 0; b < boostCount; b++) {
        const remSec = parseFloat(((rng() * 3) + 0.1).toFixed(1));
        initialBoosts.push({
          id: `boost_${b}`,
          name: `Boost ${b}`,
          multiplier: 1 + Math.floor(rng() * 5),
          remainingSeconds: remSec,
        });
      }

      // Potions
      const hasPotions = rng() > 0.1;
      const potionTypes = ['x2', 'x5', 'x10', 'x100', 'auto_50ms', 'frenzy'];
      let initialPotions: Record<string, number> | undefined = undefined;
      if (hasPotions) {
        initialPotions = {};
        for (const p of potionTypes) {
          const sample = [0, 0.1, 0.2, 0.3, 1.0, 59.9, 60.0][Math.floor(rng() * 7)];
          initialPotions[p] = sample;
        }
      }

      // Boss
      const hasBoss = rng() > 0.2;
      const bossActive = hasBoss && rng() > 0.3;
      const maxHp = 50000;
      const timeLimit = 30;
      let initialLegacyBoss: any = null;
      let initialEngineBoss: any = null;
      if (hasBoss) {
        const remainingTime = parseFloat((rng() * 2 + 0.1).toFixed(1));
        const bossData = {
          name: 'Titan of Ruin',
          active: bossActive,
          maxHp,
          currentHp: 25000,
          timeLimit,
          remainingTime,
        };
        initialLegacyBoss = { ...bossData };
        initialEngineBoss = { ...bossData };
      }

      let autoClickerPaused = rng() > 0.5;

      // Setup legacy context
      const legacyState = {
        essence: initialEssence,
        totalEssence: initialTotalEssence,
        activeBoosts: initialBoosts.map((b) => ({ ...b })),
        activePotions: initialPotions ? { ...initialPotions } : undefined,
        achievements: [],
        totalClicks: 0,
        level: 1,
        bossesDefeated: 0,
        prestigeCount: 0,
      };

      let soundErrorCalls = 0;
      const mockGlobal: any = {
        GameState: {
          get: () => legacyState,
          getBoss: () => initialLegacyBoss,
        },
        UICore: {
          calculateStats: () => ({ cps, frenzyMultiplier }),
          isAutoClickerPaused: () => autoClickerPaused,
          updateCooldowns: vi.fn(),
          updateStatsDisplay: vi.fn(),
        },
        Sound: {
          playError: () => {
            soundErrorCalls++;
          },
        },
        DailyRewards: { updateBadge: vi.fn() },
        CosmicEvents: { updateBadge: vi.fn() },
      };

      const legacyScope = buildLegacyMainScope(mockGlobal);

      // Engine parallel state
      let engineEssence = initialEssence;
      let engineTotalEssence = initialTotalEssence;
      let engineBoosts: ActiveBoost[] = initialBoosts.map((b) => ({ ...b }));
      let enginePotions: Record<string, number> | undefined = initialPotions
        ? { ...initialPotions }
        : undefined;
      let enginePlayErrorCount = 0;

      // Run sequence
      for (let t = 0; t < numTicks; t++) {
        // Toggle pause occasionally mid-sequence
        if (rng() < 0.05) {
          autoClickerPaused = !autoClickerPaused;
        }

        // 1. Run legacy
        legacyScope.gameTick();

        // 2. Run engine stepTick
        const outcome = Engine.stepTick({
          essence: engineEssence,
          totalEssence: engineTotalEssence,
          cps,
          frenzyMultiplier,
          activeBoosts: engineBoosts,
          activePotions: enginePotions,
          boss: initialEngineBoss,
          autoClickerPaused,
        });

        // Apply engine outcome to engine state
        engineEssence = outcome.essence;
        engineTotalEssence = outcome.totalEssence;
        if (outcome.activeBoosts !== null) {
          engineBoosts = outcome.activeBoosts;
        }
        if (outcome.activePotions !== null) {
          enginePotions = outcome.activePotions;
        }
        if (outcome.boss !== null) {
          Object.assign(initialEngineBoss, outcome.boss);
        }
        if (outcome.bossExpired) {
          enginePlayErrorCount++;
        }

        // Parity checks
        expect(Object.is(engineEssence, legacyState.essence)).toBe(true);
        expect(Object.is(engineTotalEssence, legacyState.totalEssence)).toBe(true);
        expect(JSON.stringify(engineBoosts)).toBe(JSON.stringify(legacyState.activeBoosts));
        expect(JSON.stringify(enginePotions)).toBe(JSON.stringify(legacyState.activePotions));
        if (initialLegacyBoss) {
          expect(JSON.stringify(initialEngineBoss)).toBe(JSON.stringify(initialLegacyBoss));
        }
        expect(enginePlayErrorCount).toBe(soundErrorCalls);
      }
    }
  });
});
