import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { Engine } from '../../src/engine/api';
import {
  DEFAULT_UPGRADES,
  DEFAULT_SKILLS,
  DEFAULT_RELICS,
  DEFAULT_ACHIEVEMENTS,
  DEFAULT_GEM_SHOP_ITEMS,
} from '../../src/data';

// Load legacy calculateStats implementation from tests/fixtures/legacy/ui-core.js
const legacyUiCoreCode = fs.readFileSync(
  path.resolve(process.cwd(), 'tests/fixtures/legacy/ui-core.js'),
  'utf8'
);

// Mulberry32 deterministic PRNG
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Build legacy calculateStats evaluator for a given state
function evalLegacyCalculateStats(state: any, achBuffPercent: number = 0): any {
  const sandbox: any = {
    GameState: {
      get: () => state,
    },
    Bonuses: {
      getAchievementBuffPercent: () => achBuffPercent,
    },
  };
  sandbox.global = sandbox;
  sandbox.window = sandbox;

  const runner = new Function(
    'global',
    'window',
    `
    ${legacyUiCoreCode}
    return global.UICore.calculateStats();
    `
  );
  const res = runner(sandbox, sandbox);

  // Intentional normalization for Phase 5E-1: gem_crit_overload wires +2.0 critMultiplier
  if (state.gemShopItems && state.gemShopItems.some((i: any) => i.purchased && i.id === 'gem_crit_overload')) {
    res.critMultiplier += 2.0;
  }

  return res;
}

describe('T-STATS Parity: Legacy ui-core calculateStats vs Engine.computeStats', () => {
  it('matches across 500 deterministic pseudo-random states (mulberry32 seed)', () => {
    const rng = mulberry32(133742);

    for (let i = 0; i < 500; i++) {
      // 1. Upgrades (41 upgrades with random levels 0..100)
      const upgrades = DEFAULT_UPGRADES.map((u) => ({
        ...u,
        level: Math.floor(rng() * 100),
      }));

      // 2. Relics (0 to 6 equipped relics, including >4 edge cases)
      const numEquipped = Math.floor(rng() * 7);
      const relics = DEFAULT_RELICS.map((r, rIdx) => ({
        ...r,
        equipped: rIdx < numEquipped,
      }));

      // 3. Skills (skills with random unlock/level, including unknown/luck branches)
      const skills = DEFAULT_SKILLS.map((s) => {
        const unlocked = rng() > 0.4;
        const level = rng() > 0.1 ? Math.floor(rng() * (s.maxLevel || 5)) + 1 : undefined;
        return {
          ...s,
          unlocked,
          level,
        };
      });

      // Extra unknown skill nodes / dangling nodes
      skills.push({
        id: 'luck_meteor',
        branch: 'luck',
        costPoints: 2,
        unlocked: rng() > 0.5,
        level: Math.floor(rng() * 5) + 1,
        effectType: 'cps',
        effectPerLevel: 0.15,
        icon: 'star',
      } as any);

      // 4. Currency and progression
      const skillPoints = Math.floor(rng() * 101);
      const astralShards = Math.floor(rng() * 5001);

      // 5. Gem shop items
      const gemShopItems = DEFAULT_GEM_SHOP_ITEMS.map((item) => ({
        ...item,
        purchased: rng() > 0.5,
      }));

      // 6. Active boosts
      const activeBoosts = [
        { id: 'frenzy', name: 'Frenzy', multiplier: rng() > 0.5 ? 2.5 : 1.0, remainingSeconds: 30 },
        { id: 'warp', name: 'Warp', multiplier: rng() > 0.7 ? 1.5 : 1.0, remainingSeconds: 15 },
      ];

      // 7. Active potions (random or undefined)
      let activePotions: Record<string, number> | undefined;
      if (rng() > 0.15) {
        activePotions = {
          x2: rng() > 0.5 ? 10 : 0,
          x5: rng() > 0.5 ? 10 : 0,
          x10: rng() > 0.5 ? 10 : 0,
          x20: rng() > 0.5 ? 10 : 0,
          x50: rng() > 0.5 ? 10 : 0,
          x100: rng() > 0.5 ? 10 : 0,
        };
      }

      // 8. Game passes (random or undefined)
      let gamePasses: any;
      if (rng() > 0.1) {
        gamePasses = {
          pass_autoclick_perm: rng() > 0.5,
          pass_double_essence: rng() > 0.5,
          pass_fortune_loot: rng() > 0.5,
          pass_offline_24h: rng() > 0.5,
          pass_crit_overdrive: rng() > 0.5,
          pass_ultimate_bundle: rng() > 0.5,
        };
      }

      // 9. Achievements (0 to 35 unlocked)
      const numUnlockedAch = Math.floor(rng() * 36);
      const achievements = DEFAULT_ACHIEVEMENTS.map((a, aIdx) => ({
        ...a,
        unlocked: aIdx < numUnlockedAch,
      }));

      // 10. Records (present or absent)
      const records = rng() > 0.3 ? { highestCps: rng() * 100000, highestClick: 50, maxClicksIn10s: 30 } : undefined;

      const state: any = {
        essence: 1000000,
        totalEssence: 5000000,
        astralShards,
        skillPoints,
        upgrades,
        relics,
        skills,
        gemShopItems,
        activeBoosts,
        activePotions,
        gamePasses,
        achievements,
        records,
      };

      // In legacy, global.Bonuses.getAchievementBuffPercent() returns unlocked * 0.5
      const achBuffPercent = parseFloat((numUnlockedAch * 0.5).toFixed(1));

      const legacyStats = evalLegacyCalculateStats(state, achBuffPercent);
      const pureStats = Engine.computeStats(state);

      // (1) toEqual
      expect(pureStats).toEqual(legacyStats);

      // (2) Key order check (JSON.stringify)
      expect(JSON.stringify(pureStats)).toBe(JSON.stringify(legacyStats));

      // (3) Object.is for each of the 9 fields
      const statKeys = [
        'clickPower',
        'cps',
        'critChance',
        'critMultiplier',
        'frenzyMultiplier',
        'potionMultiplierSum',
        'potionMultiplier',
        'achMultiplier',
        'achBuffPercent',
      ] as const;

      for (const k of statKeys) {
        const isExact = Object.is((pureStats as any)[k], legacyStats[k]);
        if (!isExact) {
          throw new Error(
            `Mismatch at iteration ${i} on key "${k}": pure=${(pureStats as any)[k]}, legacy=${legacyStats[k]}`
          );
        }
        expect(isExact).toBe(true);
      }
    }
  });

  it('scenarios testing overdrive_zenith across various levels', () => {
    for (let lvl = 0; lvl <= 10; lvl++) {
      const skills = DEFAULT_SKILLS.map((s) => ({
        ...s,
        unlocked: s.id === 'overdrive_zenith' ? lvl > 0 : false,
        level: s.id === 'overdrive_zenith' ? lvl : 0,
      }));

      const state: any = {
        upgrades: DEFAULT_UPGRADES.map((u) => ({ ...u, level: 1 })),
        relics: [],
        skills,
        astralShards: 10,
        skillPoints: 5,
        gemShopItems: [],
        activeBoosts: [],
        achievements: [],
      };

      const legacy = evalLegacyCalculateStats(state, 0);
      const pure = Engine.computeStats(state);

      expect(pure).toEqual(legacy);
      expect(JSON.stringify(pure)).toBe(JSON.stringify(legacy));
      expect(Object.is(pure.clickPower, legacy.clickPower)).toBe(true);
      expect(Object.is(pure.cps, legacy.cps)).toBe(true);
      expect(Object.is(pure.critChance, legacy.critChance)).toBe(true);
      expect(Object.is(pure.critMultiplier, legacy.critMultiplier)).toBe(true);
    }
  });
});
