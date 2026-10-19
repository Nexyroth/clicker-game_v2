import type { ActiveBoost, Boss } from './types';

export interface StepTickInput {
  essence: number;
  totalEssence: number;
  cps: number;
  frenzyMultiplier: number;
  activeBoosts: ActiveBoost[] | null | undefined;
  activePotions: Record<string, number> | null | undefined;
  boss: Boss | null | undefined;
  autoClickerPaused?: boolean;
}

export interface StepTickOutput {
  essence: number;
  totalEssence: number;
  activeBoosts: ActiveBoost[] | null;
  activePotions: Record<string, number> | null;
  boss: Partial<Boss> | null;
  bossExpired: boolean;
}

export function stepTick(input: StepTickInput): StepTickOutput {
  let essence = input.essence;
  let totalEssence = input.totalEssence;

  // 1. Passive CPS generation (dt = 0.1s)
  const tickGain = (input.cps * input.frenzyMultiplier) / 10;
  if (tickGain > 0) {
    essence += tickGain;
    totalEssence += tickGain;
  }

  // 2. Countdown active boosts
  let nextBoosts: ActiveBoost[] | null = null;
  if (input.activeBoosts && input.activeBoosts.length > 0) {
    nextBoosts = input.activeBoosts
      .map((b) => ({ ...b, remainingSeconds: b.remainingSeconds - 0.1 }))
      .filter((b) => b.remainingSeconds > 0);
  } else if (input.activeBoosts) {
    nextBoosts = [];
  }

  // 2b. Countdown active potions
  let nextPotions: Record<string, number> | null = null;
  if (input.activePotions) {
    nextPotions = { ...input.activePotions };
    for (const type of Object.keys(nextPotions)) {
      if (nextPotions[type] > 0) {
        if (type === 'auto_50ms' && input.autoClickerPaused) {
          continue;
        }
        nextPotions[type] = Math.max(0, parseFloat((nextPotions[type] - 0.1).toFixed(1)));
      }
    }
  }

  // 3. Countdown Boss battle timer if active
  let bossPatch: Partial<Boss> | null = null;
  let bossExpired = false;
  if (input.boss && input.boss.active) {
    const remTime = Math.max(0, parseFloat((input.boss.remainingTime - 0.1).toFixed(1)));
    if (remTime <= 0) {
      bossExpired = true;
      bossPatch = {
        active: false,
        currentHp: input.boss.maxHp,
        remainingTime: input.boss.timeLimit,
      };
    } else {
      bossPatch = {
        remainingTime: remTime,
      };
    }
  }

  return {
    essence,
    totalEssence,
    activeBoosts: nextBoosts,
    activePotions: nextPotions,
    boss: bossPatch,
    bossExpired,
  };
}
