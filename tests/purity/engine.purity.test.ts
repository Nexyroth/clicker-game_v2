import { describe, it, expect } from 'vitest';
import { Engine } from '../../src/engine/api';
import { computeStats } from '../../src/engine/stats';
import {
  bossDamageMultiplier,
  itemDropChance,
  gemDropChance,
  offlineEfficiency,
  achievementBuffPercent,
  allBonuses,
} from '../../src/engine/bonusRules';
import { createInitialState } from '../../src/engine/state/initialState';

function deepFreeze<T>(obj: T): Readonly<T> {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const val = (obj as any)[prop];
    if (val !== null && typeof val === 'object' && !Object.isFrozen(val)) {
      deepFreeze(val);
    }
  });
  return obj;
}

describe('Engine Purity & Immutability Tests', () => {
  it('pure functions execute safely on deepFrozen states without throwing or mutating', () => {
    const state: any = createInitialState(1710000000000);

    // Provide progress so arrays and nested structures have active items
    state.upgrades[0].level = 50;
    state.upgrades[1].level = 25;
    state.skills[0].level = 5;
    state.skills[0].unlocked = true;
    state.relics[0].equipped = true;
    state.relics[1].equipped = true;
    state.relics[2].equipped = true;
    state.relics[2].bossDamageBonus = 0.25;
    state.relics[2].itemDropBonus = 0.1;
    state.relics[2].gemDropBonus = 0.05;
    state.relics[2].offlineBonus = 0.15;
    state.achievements[0].unlocked = true;
    state.achievements[1].unlocked = true;
    state.gemShopItems[0].purchased = true;
    state.activeBoosts = [{ id: 'frenzy', multiplier: 5, remainingSeconds: 20 }];
    state.activePotions = { x2: 60, x10: 30 };
    state.gamePasses = {
      pass_double_essence: true,
      pass_crit_overdrive: true,
      pass_offline_24h: true,
      pass_ultimate_bundle: false,
      pass_autoclick_perm: true,
      pass_fortune_loot: false,
    };
    state.records = { highestCps: 1000, highestClick: 50, maxClicksIn10s: 20 };

    deepFreeze(state);

    const snapshotBefore = JSON.stringify(state);

    // 1. First execution
    const stats1 = computeStats(state);
    const bossMult1 = bossDamageMultiplier(state);
    const itemDrop1 = itemDropChance(state);
    const gemDrop1 = gemDropChance(state);
    const offlineEff1 = offlineEfficiency(state);
    const achBuff1 = achievementBuffPercent(state);
    const all1 = allBonuses(state);

    // Assert that state was NOT mutated
    const snapshotAfter1 = JSON.stringify(state);
    expect(snapshotAfter1).toBe(snapshotBefore);

    // 2. Second execution (idempotency and purity)
    const stats2 = computeStats(state);
    const bossMult2 = bossDamageMultiplier(state);
    const itemDrop2 = itemDropChance(state);
    const gemDrop2 = gemDropChance(state);
    const offlineEff2 = offlineEfficiency(state);
    const achBuff2 = achievementBuffPercent(state);
    const all2 = allBonuses(state);

    const snapshotAfter2 = JSON.stringify(state);
    expect(snapshotAfter2).toBe(snapshotBefore);

    expect(stats2).toEqual(stats1);
    expect(bossMult2).toBe(bossMult1);
    expect(itemDrop2).toBe(itemDrop1);
    expect(gemDrop2).toBe(gemDrop1);
    expect(offlineEff2).toBe(offlineEff1);
    expect(achBuff2).toBe(achBuff1);
    expect(all2).toEqual(all1);
  });

  it('boss, drops, and combo functions execute safely on deepFrozen inputs without mutating', () => {
    // 1. spawnBoss & summonBoss & bossDefeatRewards
    const spawnInput = deepFreeze({
      nextLevel: 20,
      roll: 0.05,
      today: '2026-10-06',
      lastDailyBossDate: '2026-10-05',
      nowMs: 1718000000000,
    });
    const spawnBefore = JSON.stringify(spawnInput);
    const boss1 = Engine.spawnBoss(spawnInput);
    expect(JSON.stringify(spawnInput)).toBe(spawnBefore);

    const frozenBoss = deepFreeze(boss1);
    const bossSnapBefore = JSON.stringify(frozenBoss);

    const patch1 = Engine.summonBoss(frozenBoss);
    expect(JSON.stringify(frozenBoss)).toBe(bossSnapBefore);
    expect(patch1).toEqual(Engine.summonBoss(frozenBoss));

    const rewards1 = Engine.bossDefeatRewards(frozenBoss);
    expect(JSON.stringify(frozenBoss)).toBe(bossSnapBefore);
    expect(rewards1).toEqual(Engine.bossDefeatRewards(frozenBoss));

    // 2. pickPotionDrop
    expect(Engine.pickPotionDrop(0.5)).toBe('potion_x2');
    expect(Engine.pickPotionDrop(0.9)).toBe('potion_x5');
    expect(Engine.pickPotionDrop(0.99)).toBe('potion_x10');

    // 3. advanceCombo
    const comboInput = deepFreeze({
      hits: 25,
      now: 1718000005000,
      clickTimestamps: [1718000004000, 1718000004500, 1718000004800],
    });
    const comboBefore = JSON.stringify(comboInput);
    const comboRes1 = Engine.advanceCombo(comboInput);
    expect(JSON.stringify(comboInput)).toBe(comboBefore);
    const comboRes2 = Engine.advanceCombo(comboInput);
    expect(comboRes2).toEqual(comboRes1);

    // 4. comboDecayStatus
    const decayInput = deepFreeze({
      lastClickTime: 1718000005000,
      now: 1718000006500,
      clickTimestamps: [1718000004000, 1718000004500, 1718000004800],
    });
    const decayBefore = JSON.stringify(decayInput);
    const decayRes1 = Engine.comboDecayStatus(decayInput);
    expect(JSON.stringify(decayInput)).toBe(decayBefore);
    const decayRes2 = Engine.comboDecayStatus(decayInput);
    expect(decayRes2).toEqual(decayRes1);
  });

  it('stepTick, offlineGain, achievementCurrents, prestigeShards, prestigeOutcome execute safely on deepFrozen inputs without mutating', () => {
    // 1. stepTick
    const tickInput = deepFreeze({
      essence: 1000,
      totalEssence: 5000,
      cps: 50,
      frenzyMultiplier: 2,
      activeBoosts: [
        { id: 'b1', name: 'Boost 1', multiplier: 2, remainingSeconds: 5.5 },
        { id: 'b2', name: 'Boost 2', multiplier: 3, remainingSeconds: 0.1 },
      ],
      activePotions: {
        auto_50ms: 10.0,
        x2: 30.5,
        x10: 0,
      },
      boss: {
        active: true,
        remainingTime: 12.4,
        maxHp: 100000,
        timeLimit: 30,
        currentHp: 80000,
      },
      autoClickerPaused: false,
    });
    const tickBefore = JSON.stringify(tickInput);
    const tickOutcome1 = Engine.stepTick(tickInput);
    expect(JSON.stringify(tickInput)).toBe(tickBefore);
    const tickOutcome2 = Engine.stepTick(tickInput);
    expect(tickOutcome2).toEqual(tickOutcome1);

    // 2. offlineGain
    const offlineInput = deepFreeze({
      lastSaveTime: 1718000000000,
      now: 1718000060000,
      cps: 120,
      efficiency: 0.75,
    });
    const offlineBefore = JSON.stringify(offlineInput);
    const offlineRes1 = Engine.offlineGain(offlineInput);
    expect(JSON.stringify(offlineInput)).toBe(offlineBefore);
    const offlineRes2 = Engine.offlineGain(offlineInput);
    expect(offlineRes2).toEqual(offlineRes1);

    // 3. achievementCurrents
    const achInput = deepFreeze({
      achievements: [
        { id: 'c1', type: 'clicks', current: 0 },
        { id: 'e1', type: 'essence', current: 0 },
        { id: 'l1', type: 'level', current: 0 },
        { id: 'p_used', type: 'potions_used', current: 5 },
      ],
      relics: [{ id: 'r1', equipped: true }, { id: 'r2', equipped: false }],
      skills: [{ id: 's1', unlocked: true, branch: 'luck' }],
      totalClicks: 250,
      totalEssence: 1234567.89,
      level: 15,
      bossesDefeated: 4,
      dailyBossesDefeated: 2,
      totalCrits: 45,
      totalUpgradesBought: 80,
      prestigeCount: 3,
      activePotions: { x100: 25 },
    });
    const achBefore = JSON.stringify(achInput);
    const achRes1 = Engine.achievementCurrents(achInput);
    expect(JSON.stringify(achInput)).toBe(achBefore);
    const achRes2 = Engine.achievementCurrents(achInput);
    expect(achRes2).toEqual(achRes1);
    expect(achRes1![3]).toBe(0); // Phase 5E-1: potions_used wired to state.potionsUsed || 0

    // 4. prestigeShards & prestigeOutcome
    const totalEssence = 4000000;
    expect(Engine.prestigeShards(totalEssence)).toBe(2);

    const prestigeInput = deepFreeze({
      totalEssence: 9000000,
      astralShards: 10,
      totalAstralShards: 20,
      prestigeCount: 1,
    });
    const prestigeBefore = JSON.stringify(prestigeInput);
    const prestigeRes1 = Engine.prestigeOutcome(prestigeInput);
    expect(JSON.stringify(prestigeInput)).toBe(prestigeBefore);
    const prestigeRes2 = Engine.prestigeOutcome(prestigeInput);
    expect(prestigeRes2).toEqual(prestigeRes1);
    expect(prestigeRes1!.shards).toBe(3);
    expect(prestigeRes1!.astralShards).toBe(13);

    // 5. resolveClick (Phase 5C-A)
    const clickInput = deepFreeze({
      state: {
        essence: 500,
        totalEssence: 1200,
        totalClicks: 25,
        currentExp: 40,
        maxExp: 100,
        level: 2,
        skillPoints: 1,
        astralGems: 10,
        astralShards: 5,
        totalAstralShards: 15,
        bossesDefeated: 1,
        dailyBossesDefeated: 0,
        lastDailyBossDate: '2026-10-12',
        skills: [{ id: 'crit_collapse', unlocked: true }, { id: 'crit_chain', unlocked: true }],
        records: { maxClicksIn10s: 5, highestClick: 50, highestCps: 10 },
      },
      stats: {
        clickPower: 10,
        critChance: 0.5,
        critMultiplier: 2.0,
        frenzyMultiplier: 1.0,
      },
      comboMultiplier: 1.2,
      boss: {
        id: 'boss_test',
        name: 'Test Boss',
        title: 'Tester',
        maxHp: 1000,
        currentHp: 500,
        timeLimit: 30,
        remainingTime: 30,
        rewardGems: 2,
        rewardShards: 10,
        rewardExp: 50,
        active: true,
        level: 2,
        tier: 'normal',
        isMilestone: false,
      },
      bonuses: {
        itemDropChance: 0.05,
        gemDropChance: 0.02,
        bossDamageMultiplier: 1.5,
      },
      now: 1718000000000,
      isAuto: false,
      rng: () => 0.1,
      lastPotionDropTime: 1718000000000 - 70000,
      lastGemDropTime: 1718000000000 - 100000,
      clickTimestamps: [1718000000000 - 5000, 1718000000000 - 2000],
      today: '2026-10-13',
    });

    const clickBefore = JSON.stringify(clickInput);
    const clickRes1 = Engine.resolveClick(clickInput);
    expect(JSON.stringify(clickInput)).toBe(clickBefore);
    const clickRes2 = Engine.resolveClick(clickInput);
    expect(clickRes2).toEqual(clickRes1);
  });
});
