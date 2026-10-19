import type { Boss, BossTier } from './types';
import { spawnBoss } from './boss';
import { pickPotionDrop, type PotionDropKey, POTION_DROP_COOLDOWN_MS, GEM_DROP_COOLDOWN_MS } from './drops';

export type Rng = () => number;

export type BossView = Boss;

export interface ClickInput {
  state: Readonly<{
    essence: number;
    totalEssence: number;
    totalClicks: number;
    currentExp: number;
    maxExp: number;
    level: number;
    skillPoints: number;
    astralGems: number;
    astralShards: number;
    totalAstralShards: number;
    bossesDefeated: number;
    dailyBossesDefeated?: number;
    lastDailyBossDate?: string;
    totalCrits?: number;
    skills?: readonly { id: string; unlocked?: boolean }[];
    records?: Readonly<{
      maxClicksIn10s?: number;
      highestClick?: number;
      highestCps?: number;
    }>;
  }>;
  stats: Readonly<{
    clickPower: number;
    critChance: number;
    critMultiplier: number;
    frenzyMultiplier: number;
  }>;
  comboMultiplier: number;
  boss: Readonly<BossView> | null;
  bonuses: Readonly<{
    itemDropChance: number;
    gemDropChance: number;
    bossDamageMultiplier: number;
  }>;
  now: number;
  isAuto: boolean;
  rng: Rng;
  lastPotionDropTime: number;
  lastGemDropTime: number;
  clickTimestamps: readonly number[];
  today: string;
}

export interface ClickOutcome {
  isCrit: boolean;
  clickGain: number;
  chainGain: number | null;
  patch: {
    essence: number;
    totalEssence: number;
    totalClicks: number;
    totalCrits: number;
    currentExp: number;
    maxExp: number;
    level: number;
    skillPoints: number;
    astralGems: number;
    astralShards: number;
    totalAstralShards: number;
    bossesDefeated: number;
    dailyBossesDefeated?: number;
    lastDailyBossDate?: string;
  };
  recordsPatch: { maxClicksIn10s?: number; highestClick?: number } | null;
  clickTimestamps: number[];
  leveledUp: boolean;
  potionDrop: PotionDropKey | null;
  gemDrop: boolean;
  boss:
    | { kind: 'inactive' }
    | { kind: 'hit'; currentHp: number }
    | {
        kind: 'defeated';
        rewards: { gems: number; shards: number; exp: number };
        dailyDefeat: boolean;
        nextBoss: Boss;
      };
  lastPotionDropTime: number;
  lastGemDropTime: number;
}

export function resolveClick(input: ClickInput): ClickOutcome {
  const { state, stats, comboMultiplier, rng, now, isAuto } = input;

  // 1. Critical strike roll (always called first)
  const isCrit = rng() < stats.critChance;
  const currentTotalCrits = state.totalCrits || 0;
  const newTotalCrits = isCrit ? currentTotalCrits + 1 : currentTotalCrits;

  let critCollapseMult = 1;
  if (isCrit && state.skills && state.skills.some((s) => s.id === 'crit_collapse' && s.unlocked)) {
    critCollapseMult = 2;
  }

  // Left-to-right multiplication matching legacy:
  // stats.clickPower * (isCrit ? stats.critMultiplier : 1) * critCollapseMult * stats.frenzyMultiplier * comboMultiplier
  const clickGain =
    stats.clickPower *
    (isCrit ? stats.critMultiplier : 1) *
    critCollapseMult *
    stats.frenzyMultiplier *
    comboMultiplier;

  // 2. Chain reaction: 20% chance on crit if skill crit_chain unlocked
  let chainGain: number | null = null;
  if (isCrit && state.skills && state.skills.some((s) => s.id === 'crit_chain' && s.unlocked)) {
    if (rng() < 0.20) {
      chainGain = clickGain * 0.50;
    }
  }

  // Sequential additions: chainGain added before clickGain
  let newEssence = state.essence;
  let newTotalEssence = state.totalEssence;
  if (chainGain !== null) {
    newEssence += chainGain;
    newTotalEssence += chainGain;
  }
  newEssence += clickGain;
  newTotalEssence += clickGain;
  const newTotalClicks = state.totalClicks + 1;

  // 3. Track rolling click timestamps & records patch
  const newTimestamps = [...input.clickTimestamps, now];
  while (newTimestamps.length > 0 && newTimestamps[0] < now - 10000) {
    newTimestamps.shift();
  }

  let recordsPatch: { maxClicksIn10s?: number; highestClick?: number } | null = null;
  if (state.records) {
    const rec: { maxClicksIn10s?: number; highestClick?: number } = {};
    let hasRecordUpdate = false;
    if (newTimestamps.length > (state.records.maxClicksIn10s || 0)) {
      rec.maxClicksIn10s = newTimestamps.length;
      hasRecordUpdate = true;
    }
    if (clickGain > (state.records.highestClick || 0)) {
      rec.highestClick = clickGain;
      hasRecordUpdate = true;
    }
    recordsPatch = hasRecordUpdate ? rec : {};
  }

  // 4. Base EXP progression (level-up while loop evaluated after boss combat reward)
  let newCurrentExp = state.currentExp + Math.max(1, Math.floor(clickGain * 0.02));
  let newMaxExp = state.maxExp;
  let newLevel = state.level;
  let newSkillPoints = state.skillPoints;
  let leveledUp = false;

  // 5. Potion drop roll (cooldown 60s)
  let newLastPotionDropTime = input.lastPotionDropTime;
  let potionDrop: PotionDropKey | null = null;
  if (now - input.lastPotionDropTime >= POTION_DROP_COOLDOWN_MS) {
    const itemDropChance = input.bonuses.itemDropChance;
    const shouldRoll = isAuto ? rng() < 0.003 : rng() < itemDropChance * 0.3;
    if (shouldRoll) {
      newLastPotionDropTime = now;
      potionDrop = pickPotionDrop(rng());
    }
  }

  // 6. Gem drop roll (cooldown 90s, always 1 gem)
  let newLastGemDropTime = input.lastGemDropTime;
  let gemDrop = false;
  let newAstralGems = state.astralGems;
  if (now - input.lastGemDropTime >= GEM_DROP_COOLDOWN_MS) {
    const gemDropChance = input.bonuses.gemDropChance;
    const shouldRoll = isAuto ? rng() < 0.001 : rng() < gemDropChance * 0.2;
    if (shouldRoll) {
      newLastGemDropTime = now;
      gemDrop = true;
      newAstralGems += 1;
    }
  }

  // 7. Boss combat resolution
  let bossOutcome: ClickOutcome['boss'] = { kind: 'inactive' };
  let newBossesDefeated = state.bossesDefeated;
  let newDailyBossesDefeated = state.dailyBossesDefeated;
  let newLastDailyBossDate = state.lastDailyBossDate;
  let newAstralShards = state.astralShards;
  let newTotalAstralShards = state.totalAstralShards;

  const boss = input.boss;
  if (boss && boss.active) {
    const bossMult = input.bonuses.bossDamageMultiplier;
    const bossDamage = clickGain * bossMult;
    const hpAfterHit = Math.max(0, boss.currentHp - bossDamage);

    if (hpAfterHit <= 0) {
      // Boss defeated
      newBossesDefeated++;

      let rewardMult = 1.0;
      if (boss.tier === 'rare') rewardMult = 2.0;
      let dailyDefeat = false;
      if (boss.tier === 'daily') {
        rewardMult = 5.0;
        dailyDefeat = true;
        newDailyBossesDefeated = (newDailyBossesDefeated || 0) + 1;
        newLastDailyBossDate = input.today;
      }
      if (boss.isMilestone) rewardMult *= 1.5;

      const earnedGems = Math.round((boss.rewardGems || 0) * rewardMult);
      const earnedShards = Math.round((boss.rewardShards || 0) * rewardMult);
      const earnedExp = Math.round((boss.rewardExp || 0) * rewardMult);

      // Rewarded currency additions
      newAstralGems += earnedGems;
      newAstralShards += earnedShards;
      newTotalAstralShards += earnedShards;
      // Boss exp added to currentExp
      newCurrentExp += earnedExp;

      // Spawn next boss with level scaling and tier roll
      const nextBossRoll = rng();
      const nextLevel = (boss.level || 1) + 1;
      const nextBoss = spawnBoss({
        nextLevel,
        roll: nextBossRoll,
        today: input.today,
        lastDailyBossDate: newLastDailyBossDate,
        nowMs: now,
      });

      bossOutcome = {
        kind: 'defeated',
        rewards: {
          gems: earnedGems,
          shards: earnedShards,
          exp: earnedExp,
        },
        dailyDefeat,
        nextBoss,
      };
    } else {
      bossOutcome = {
        kind: 'hit',
        currentHp: hpAfterHit,
      };
    }
  }

  // F2 & F3: Multi-level up while loop executed after click EXP and boss reward EXP
  let levelLoops = 0;
  while (newCurrentExp >= newMaxExp && levelLoops < 1000) {
    newLevel++;
    newCurrentExp = newCurrentExp - newMaxExp;
    newMaxExp = Math.floor(newMaxExp * 1.35);
    newSkillPoints++;
    leveledUp = true;
    levelLoops++;
  }

  const patch: ClickOutcome['patch'] = {
    essence: newEssence,
    totalEssence: newTotalEssence,
    totalClicks: newTotalClicks,
    totalCrits: newTotalCrits,
    currentExp: newCurrentExp,
    maxExp: newMaxExp,
    level: newLevel,
    skillPoints: newSkillPoints,
    astralGems: newAstralGems,
    astralShards: newAstralShards,
    totalAstralShards: newTotalAstralShards,
    bossesDefeated: newBossesDefeated,
    ...(bossOutcome.kind === 'defeated' && bossOutcome.dailyDefeat
      ? {
          dailyBossesDefeated: newDailyBossesDefeated,
          lastDailyBossDate: newLastDailyBossDate,
        }
      : {}),
  };

  return {
    isCrit,
    clickGain,
    chainGain,
    patch,
    recordsPatch,
    clickTimestamps: newTimestamps,
    leveledUp,
    potionDrop,
    gemDrop,
    boss: bossOutcome,
    lastPotionDropTime: newLastPotionDropTime,
    lastGemDropTime: newLastGemDropTime,
  };
}
