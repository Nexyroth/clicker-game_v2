import { describe, it, expect } from 'vitest';
import { Engine } from '../../src/engine/api';
import { buildLegacyMainScope } from '../helpers/extractLegacyFunction';

function createRng(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('T-ACHIEVEMENTS Parity: achievementCurrents vs Legacy updateAchievementsProgress', () => {
  it('matches exactly across at least 300 randomized states covering all achievement types', () => {
    const rng = createRng(0x5cb_ac4);

    const ALL_TYPES = [
      'clicks',
      'essence',
      'level',
      'bosses',
      'boss_daily',
      'crits',
      'upgrades',
      'prestige',
      'skills_unlocked',
      'luck_branch',
      'relics_equipped',
      'achievements_count',
      'potion_x100',
      'potions_used', // Unhandled in legacy
      'unknown_custom_type',
    ];

    for (let i = 0; i < 300; i++) {
      const hasAchievements = rng() > 0.05;
      const count = hasAchievements ? Math.floor(rng() * 16) : 0;

      const legacyAchievements = hasAchievements
        ? Array.from({ length: count }, (_, idx) => {
            const type = ALL_TYPES[Math.floor(rng() * ALL_TYPES.length)];
            return {
              id: `ach_${idx}`,
              name: `Achievement ${idx}`,
              type,
              current: Math.floor(rng() * 50),
              unlocked: rng() > 0.5,
            };
          })
        : undefined;

      const engineAchievements = legacyAchievements
        ? legacyAchievements.map((a) => ({ ...a }))
        : undefined;

      // Relics
      const relicCount = Math.floor(rng() * 8);
      const relics = Array.from({ length: relicCount }, (_, idx) => ({
        id: `relic_${idx}`,
        equipped: rng() > 0.5,
      }));

      // Skills
      const skillCount = Math.floor(rng() * 15);
      const skills = Array.from({ length: skillCount }, (_, idx) => ({
        id: `skill_${idx}`,
        branch: rng() > 0.7 ? 'luck' : 'core',
        unlocked: rng() > 0.5,
      }));

      // Potions
      const hasPotions = rng() > 0.3;
      const activePotions = hasPotions
        ? {
            x100: rng() > 0.5 ? Math.floor(rng() * 60) : 0,
            x2: 30,
          }
        : undefined;

      const totalClicks = Math.floor(rng() * 1000000);
      const totalEssence = rng() * 1e15;
      const level = 1 + Math.floor(rng() * 120);
      const bossesDefeated = Math.floor(rng() * 500);
      const dailyBossesDefeated = rng() > 0.2 ? Math.floor(rng() * 30) : undefined;
      const totalCrits = rng() > 0.2 ? Math.floor(rng() * 5000) : undefined;
      const totalUpgradesBought = rng() > 0.2 ? Math.floor(rng() * 2000) : undefined;
      const prestigeCount = Math.floor(rng() * 10);

      const legacyState: any = {
        achievements: legacyAchievements,
        relics: relics.map((r) => ({ ...r })),
        skills: skills.map((s) => ({ ...s })),
        totalClicks,
        totalEssence,
        level,
        bossesDefeated,
        dailyBossesDefeated,
        totalCrits,
        totalUpgradesBought,
        prestigeCount,
        activePotions: activePotions ? { ...activePotions } : undefined,
      };

      const mockGlobal: any = {
        GameState: { get: () => legacyState },
      };

      const legacyScope = buildLegacyMainScope(mockGlobal);
      legacyScope.updateAchievementsProgress();

      // Intentional normalization for Phase 5E-1: potions_used wired to state.potionsUsed || 0
      if (legacyAchievements) {
        legacyAchievements.forEach((ach: any) => {
          if (ach.type === 'potions_used') {
            ach.current = legacyState.potionsUsed || 0;
          }
        });
      }

      // 2. Run Engine achievementCurrents
      const engineInput: any = {
        achievements: engineAchievements,
        relics,
        skills,
        totalClicks,
        totalEssence,
        level,
        bossesDefeated,
        dailyBossesDefeated,
        totalCrits,
        totalUpgradesBought,
        prestigeCount,
        activePotions,
      };

      const currents = Engine.achievementCurrents(engineInput);

      if (currents !== null && engineAchievements) {
        engineAchievements.forEach((ach, idx) => {
          if (currents[idx] !== undefined) {
            ach.current = currents[idx];
          }
        });
      }

      // Parity assertion
      if (!legacyAchievements) {
        expect(currents).toBeNull();
        expect(engineAchievements).toBeUndefined();
      } else {
        expect(currents).not.toBeNull();
        expect(engineAchievements!.map((a) => a.current)).toEqual(
          legacyAchievements.map((a) => a.current)
        );
      }
    }
  });
});
