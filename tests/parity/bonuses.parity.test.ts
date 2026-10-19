import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { Bonuses as TsBonuses } from '../../src/engine/bonuses';

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function loadLegacyBonuses(scope: any) {
  const filePath = path.resolve(process.cwd(), 'tests/fixtures/legacy/bonuses.js');
  const code = fs.readFileSync(filePath, 'utf8');
  const fn = new Function('window', 'global', code);
  fn(scope, scope);
  return scope.Bonuses;
}

describe('Differential Parity Tests: Bonuses (Legacy vs TypeScript)', () => {
  let legacyBonuses: any;
  let mockState: any;

  beforeEach(() => {
    mockState = {};
    (window as any).GameState = {
      get: () => mockState,
    };
    legacyBonuses = loadLegacyBonuses(window);
  });

  afterEach(() => {
    delete (window as any).GameState;
  });

  it('matches exactly on empty and edge-case partial states', () => {
    const edgeStates = [
      {},
      { skills: [] },
      { relics: [] },
      { achievements: [] },
      { pets: {} },
      { gemShopItems: [] },
      { gamePasses: {} },
      {
        skills: [{ id: 'luck_infinite', unlocked: true, level: 0 }],
        pets: { dragon: { level: 0 }, night_owl: { level: 0 } },
      },
    ];

    edgeStates.forEach((st, idx) => {
      mockState = st;
      expect(TsBonuses.getBossDamageMultiplier(), `Edge state ${idx} BossDamage`).toBe(legacyBonuses.getBossDamageMultiplier());
      expect(TsBonuses.getItemDropChance(), `Edge state ${idx} ItemDrop`).toBe(legacyBonuses.getItemDropChance());
      expect(TsBonuses.getGemDropChance(), `Edge state ${idx} GemDrop`).toBe(legacyBonuses.getGemDropChance());
      expect(TsBonuses.getOfflineEfficiency(), `Edge state ${idx} OfflineEff`).toBe(legacyBonuses.getOfflineEfficiency());
      expect(TsBonuses.getAchievementBuffPercent(), `Edge state ${idx} AchBuff`).toBe(legacyBonuses.getAchievementBuffPercent());
      expect(TsBonuses.getAllBonuses(), `Edge state ${idx} AllBonuses`).toEqual(legacyBonuses.getAllBonuses());
    });
  });

  it('matches exactly across >= 350 seeded pseudo-random states', () => {
    const rng = mulberry32(88888);
    const candidateSkillIds = [
      'luck_boss_1',
      'luck_boss_2',
      'luck_infinite',
      'luck_item_1',
      'luck_gem_1',
      'luck_offline',
      'fortune_idle',
      'overdrive_zenith',
      'core_click_1',
      'chrono_pulse',
    ];

    for (let i = 0; i < 350; i++) {
      // 1. Generate random skills
      const hasSkills = rng() > 0.05;
      const skills = hasSkills
        ? candidateSkillIds.map((id) => ({
            id,
            unlocked: rng() < 0.4,
            level: Math.floor(rng() * 30),
          }))
        : undefined;

      // 2. Generate random relics
      const hasRelics = rng() > 0.05;
      const relicsCount = Math.floor(rng() * 10);
      const relics = hasRelics
        ? Array.from({ length: relicsCount }, (_, rIdx) => ({
            id: `relic_${rIdx}`,
            equipped: rng() < 0.5,
            bossDamageBonus: rng() < 0.3 ? parseFloat((rng() * 0.5).toFixed(2)) : undefined,
            itemDropBonus: rng() < 0.3 ? parseFloat((rng() * 0.2).toFixed(3)) : undefined,
            gemDropBonus: rng() < 0.3 ? parseFloat((rng() * 0.15).toFixed(3)) : undefined,
            offlineBonus: rng() < 0.3 ? parseFloat((rng() * 0.4).toFixed(2)) : undefined,
          }))
        : undefined;

      // 3. Generate random pets
      const hasPets = rng() > 0.05;
      const pets = hasPets
        ? {
            dragon: rng() < 0.5 ? { level: Math.floor(rng() * 20) } : undefined,
            night_owl: rng() < 0.5 ? { level: Math.floor(rng() * 20) } : undefined,
          }
        : undefined;

      // 4. Generate random gem shop items
      const hasGemShop = rng() > 0.05;
      const gemShopItems = hasGemShop
        ? [{ id: 'gem_offline_boost', purchased: rng() < 0.4 }]
        : undefined;

      // 5. Generate random game passes
      const hasPasses = rng() > 0.05;
      const gamePasses = hasPasses
        ? {
            pass_offline_24h: rng() < 0.3,
            pass_ultimate_bundle: rng() < 0.3,
          }
        : undefined;

      // 6. Generate random achievements
      const hasAchievements = rng() > 0.05;
      const achCount = Math.floor(rng() * 40);
      const achievements = hasAchievements
        ? Array.from({ length: achCount }, (_, aIdx) => ({
            id: `ach_${aIdx}`,
            unlocked: rng() < 0.5,
          }))
        : undefined;

      mockState = {
        skills,
        relics,
        pets,
        gemShopItems,
        gamePasses,
        achievements,
      };

      const legBoss = legacyBonuses.getBossDamageMultiplier();
      const tsBoss = TsBonuses.getBossDamageMultiplier();
      expect(tsBoss, `Iteration ${i} BossDamage`).toBe(legBoss);

      const legItem = legacyBonuses.getItemDropChance();
      const tsItem = TsBonuses.getItemDropChance();
      expect(tsItem, `Iteration ${i} ItemDrop`).toBe(legItem);

      const legGem = legacyBonuses.getGemDropChance();
      const tsGem = TsBonuses.getGemDropChance();
      expect(tsGem, `Iteration ${i} GemDrop`).toBe(legGem);

      const legOff = legacyBonuses.getOfflineEfficiency();
      const tsOff = TsBonuses.getOfflineEfficiency();
      expect(tsOff, `Iteration ${i} OfflineEff`).toBe(legOff);

      const legAch = legacyBonuses.getAchievementBuffPercent();
      const tsAch = TsBonuses.getAchievementBuffPercent();
      expect(tsAch, `Iteration ${i} AchBuff`).toBe(legAch);

      const legAll = legacyBonuses.getAllBonuses();
      const tsAll = TsBonuses.getAllBonuses();
      expect(tsAll, `Iteration ${i} AllBonuses`).toEqual(legAll);
    }
  });
});
