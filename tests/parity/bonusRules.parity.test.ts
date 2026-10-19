import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

import {
  bossDamageMultiplier,
  itemDropChance,
  gemDropChance,
  offlineEfficiency,
  achievementBuffPercent,
  allBonuses,
} from '../../src/engine/bonusRules';

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

describe('Differential Parity Tests: Pure bonusRules vs Legacy Bonuses fixture', () => {
  const sandbox: any = {};
  sandbox.window = sandbox;
  sandbox.global = sandbox;
  let currentState: any = {};
  sandbox.GameState = { get: () => currentState };
  const legacyBonuses = loadLegacyBonuses(sandbox);

  it('matches exactly on edge-case states', () => {
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
      currentState = st;
      expect(bossDamageMultiplier(st), `Edge state ${idx} BossDamage`).toBe(legacyBonuses.getBossDamageMultiplier());
      expect(itemDropChance(st), `Edge state ${idx} ItemDrop`).toBe(legacyBonuses.getItemDropChance());
      expect(gemDropChance(st), `Edge state ${idx} GemDrop`).toBe(legacyBonuses.getGemDropChance());
      expect(offlineEfficiency(st), `Edge state ${idx} OfflineEff`).toBe(legacyBonuses.getOfflineEfficiency());
      expect(achievementBuffPercent(st), `Edge state ${idx} AchBuff`).toBe(legacyBonuses.getAchievementBuffPercent());
      expect(allBonuses(st), `Edge state ${idx} AllBonuses`).toEqual(legacyBonuses.getAllBonuses());
    });
  });

  it('matches exactly across >= 350 seeded randomized states', () => {
    const rng = mulberry32(99999);
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
      const hasSkills = rng() > 0.05;
      const skills = hasSkills
        ? candidateSkillIds.map((id) => ({
            id,
            unlocked: rng() < 0.4,
            level: Math.floor(rng() * 30),
          }))
        : undefined;

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

      const hasPets = rng() > 0.05;
      const pets = hasPets
        ? {
            dragon: rng() < 0.5 ? { level: Math.floor(rng() * 20) } : undefined,
            night_owl: rng() < 0.5 ? { level: Math.floor(rng() * 20) } : undefined,
          }
        : undefined;

      const hasGemShop = rng() > 0.05;
      const gemShopItems = hasGemShop
        ? [{ id: 'gem_offline_boost', purchased: rng() < 0.4 }]
        : undefined;

      const hasPasses = rng() > 0.05;
      const gamePasses = hasPasses
        ? {
            pass_offline_24h: rng() < 0.3,
            pass_ultimate_bundle: rng() < 0.3,
          }
        : undefined;

      const hasAchievements = rng() > 0.05;
      const achCount = Math.floor(rng() * 40);
      const achievements = hasAchievements
        ? Array.from({ length: achCount }, (_, aIdx) => ({
            id: `ach_${aIdx}`,
            unlocked: rng() < 0.5,
          }))
        : undefined;

      const state = {
        skills,
        relics,
        pets,
        gemShopItems,
        gamePasses,
        achievements,
      };

      currentState = state;

      const legBoss = legacyBonuses.getBossDamageMultiplier();
      const pureBoss = bossDamageMultiplier(state);
      expect(pureBoss, `Iteration ${i} BossDamage`).toBe(legBoss);

      const legItem = legacyBonuses.getItemDropChance();
      const pureItem = itemDropChance(state);
      expect(pureItem, `Iteration ${i} ItemDrop`).toBe(legItem);

      const legGem = legacyBonuses.getGemDropChance();
      const pureGem = gemDropChance(state);
      expect(pureGem, `Iteration ${i} GemDrop`).toBe(legGem);

      const legOff = legacyBonuses.getOfflineEfficiency();
      const pureOff = offlineEfficiency(state);
      expect(pureOff, `Iteration ${i} OfflineEff`).toBe(legOff);

      const legAch = legacyBonuses.getAchievementBuffPercent();
      const pureAch = achievementBuffPercent(state);
      expect(pureAch, `Iteration ${i} AchBuff`).toBe(legAch);

      const legAll = legacyBonuses.getAllBonuses();
      const pureAll = allBonuses(state);
      expect(pureAll, `Iteration ${i} AllBonuses`).toEqual(legAll);
    }
  });
});
