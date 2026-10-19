import type { Boss, BossTier } from './types';

export function rollBossTier(roll: number, canSpawnDaily: boolean): BossTier {
  if (canSpawnDaily && roll < 0.03) {
    return 'daily';
  } else if (roll < 0.15) {
    return 'rare';
  }
  return 'normal';
}

export function bossMaxHp(nextLevel: number, tier: BossTier | string, isMilestone: boolean): number {
  let baseHp = Math.floor(25000 * Math.pow(1.8, nextLevel - 1));
  if (tier === 'rare') baseHp = Math.floor(baseHp * 1.5);
  if (tier === 'daily') baseHp = Math.floor(baseHp * 3.0);
  if (isMilestone) baseHp = Math.floor(baseHp * 1.5);
  return baseHp;
}

export function bossTimeLimit(nextLevel: number): number {
  return Math.min(60, 30 + nextLevel * 2);
}

export function bossRewardBase(nextLevel: number) {
  const rewardGems = Math.min(5, Math.floor(1 + nextLevel * 0.25));
  const rewardShards = Math.floor(25 * Math.pow(1.35, nextLevel - 1));
  const rewardExp = Math.floor(250 * Math.pow(1.4, nextLevel - 1));
  return { rewardGems, rewardShards, rewardExp };
}

export function bossLabel(nextLevel: number, tier: BossTier | string, isMilestone: boolean) {
  let bossName = '';
  let bossTitle = '';

  if (isMilestone) {
    if (nextLevel === 10) bossName = '🔱 Đại Chúa Tể Dữ Liệu';
    else if (nextLevel === 20) bossName = '🔱 Ác Ma Nexyroth Nguyên Thuỷ';
    else if (nextLevel === 30) bossName = '🔱 Tận Thế Click';
    else bossName = `🔱 Thần Vương Vô Tận Cấp ${nextLevel}`;
    bossTitle = 'Chúa Tể Tối Cường Từng Mốc 10 Cấp';
  } else {
    const names = [
      'Mal’Zakar the Void Titan',
      'Vor’Thex the Astral Devourer',
      'Nexyroth Primordial Spawn',
      'Chrono-Leviathan',
      'Singularity Dreadnought',
      'Cosmic Eclipse Overlord',
    ];
    bossName = names[(nextLevel - 1) % names.length] + ' (Lv.' + nextLevel + ')';
    bossTitle =
      tier === 'daily'
        ? '👑 Boss Ngày Vàng Kim (Chỉ 1 lần/ngày)'
        : tier === 'rare'
        ? '✨ Boss Tinh Anh Hiếm'
        : 'Void Titan of the Abyss';
  }

  if (tier === 'daily') bossName = '👑 ' + bossName;
  else if (tier === 'rare') bossName = '✨ ' + bossName;

  return { name: bossName, title: bossTitle };
}

export interface SpawnBossInput {
  nextLevel: number;
  roll: number;
  today: string;
  lastDailyBossDate?: string;
  nowMs: number;
}

export function spawnBoss(input: SpawnBossInput): Boss {
  const nextLevel = input.nextLevel;
  const canSpawnDaily = input.lastDailyBossDate !== input.today;
  const tier = rollBossTier(input.roll, canSpawnDaily);
  const isMilestone = nextLevel % 10 === 0;

  const { name, title } = bossLabel(nextLevel, tier, isMilestone);
  const maxHp = bossMaxHp(nextLevel, tier, isMilestone);
  const timeLimit = bossTimeLimit(nextLevel);
  const { rewardGems, rewardShards, rewardExp } = bossRewardBase(nextLevel);

  return {
    id: 'boss_' + nextLevel + '_' + input.nowMs,
    name,
    title,
    maxHp,
    currentHp: maxHp,
    timeLimit,
    remainingTime: timeLimit,
    rewardGems,
    rewardShards,
    rewardExp,
    active: false,
    level: nextLevel,
    tier,
    isMilestone,
  };
}

export function summonBoss(boss: Boss) {
  return {
    active: true,
    currentHp: boss.maxHp,
    remainingTime: boss.timeLimit,
  };
}

export function bossDefeatRewards(boss: Boss) {
  let rewardMult = 1.0;
  if (boss.tier === 'rare') rewardMult = 2.0;
  if (boss.tier === 'daily') rewardMult = 5.0;
  if (boss.isMilestone) rewardMult *= 1.5;

  const earnedGems = Math.round((boss.rewardGems || 0) * rewardMult);
  const earnedShards = Math.round((boss.rewardShards || 0) * rewardMult);
  const earnedExp = Math.round((boss.rewardExp || 0) * rewardMult);

  return {
    rewardGems: earnedGems,
    rewardShards: earnedShards,
    rewardExp: earnedExp,
    dailyDefeat: boss.tier === 'daily',
  };
}
