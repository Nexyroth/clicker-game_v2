/**
 * NEXYROTH CLICKER - PUBLIC ENGINE API (TypeScript)
 * Exports pure calculation engines and mounts window.Engine.
 */
import { computeStats } from './stats';
import {
  spawnBoss,
  summonBoss,
  bossDefeatRewards,
  rollBossTier,
  bossMaxHp,
  bossTimeLimit,
  bossRewardBase,
  bossLabel,
} from './boss';
import {
  pickPotionDrop,
  POTION_DROP_COOLDOWN_MS,
  GEM_DROP_COOLDOWN_MS,
} from './drops';
import {
  advanceCombo,
  comboDecayStatus,
  COMBO_RESET_MS,
} from './combo';
import { stepTick } from './tick';
import { offlineGain } from './offline';
import { achievementCurrents } from './achievements';
import { prestigeShards, prestigeOutcome } from './prestige';
import {
  planCatchUp,
  TICK_MS,
  ACTIVE_CATCHUP_MAX_MS,
  PAUSE_BOSS_WHILE_HIDDEN,
  PAUSE_AUTOCLICK_POTION_WHILE_HIDDEN,
  type PlanCatchUpInput,
  type CatchUpPlan,
} from './catchup';

import { resolveClick, type ClickInput, type ClickOutcome, type Rng } from './click';

export const Engine = {
  // Stats
  computeStats,

  // Click & Core Combat (Phase 5C-A)
  resolveClick,

  // Boss
  spawnBoss,
  summonBoss,
  bossDefeatRewards,
  rollBossTier,
  bossMaxHp,
  bossTimeLimit,
  bossRewardBase,
  bossLabel,

  // Drops
  pickPotionDrop,
  POTION_DROP_COOLDOWN_MS,
  GEM_DROP_COOLDOWN_MS,

  // Combo
  advanceCombo,
  comboDecayStatus,
  COMBO_RESET_MS,

  // Game Loop & Progression (Phase 5C-B & 5D-1)
  stepTick,
  offlineGain,
  achievementCurrents,
  prestigeShards,
  prestigeOutcome,
  planCatchUp,
  TICK_MS,
  ACTIVE_CATCHUP_MAX_MS,
  PAUSE_BOSS_WHILE_HIDDEN,
  PAUSE_AUTOCLICK_POTION_WHILE_HIDDEN,
};

export type { ClickInput, ClickOutcome, Rng, PlanCatchUpInput, CatchUpPlan };


export type EngineApi = typeof Engine;

if (typeof window !== 'undefined') {
  (window as unknown as { Engine: EngineApi }).Engine = Engine;
}
if (typeof globalThis !== 'undefined') {
  (globalThis as unknown as { Engine: EngineApi }).Engine = Engine;
}
