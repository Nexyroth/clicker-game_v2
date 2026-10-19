/**
 * Pure Bonus and Multiplier calculation rules.
 * Pure functions: No DOM, no window, no global state access.
 */
import type { GameState, BonusesSnapshot } from './types';

export type BonusSkill = {
  id: string;
  unlocked?: boolean;
  level?: number;
};

export type BonusRelic = {
  equipped?: boolean;
  bossDamageBonus?: number;
  itemDropBonus?: number;
  gemDropBonus?: number;
  offlineBonus?: number;
};

export type BonusPets = {
  dragon?: { level?: number };
  night_owl?: { level?: number };
  [key: string]: unknown;
};

export type BonusAchievement = {
  unlocked?: boolean;
};

export type BonusGemShopItem = {
  id: string;
  purchased?: boolean;
};

export type BonusGamePasses = {
  pass_offline_24h?: boolean;
  pass_ultimate_bundle?: boolean;
  [key: string]: unknown;
};

export type BossDamageInput = {
  skills?: Array<BonusSkill> | null;
  relics?: Array<BonusRelic> | null;
  pets?: BonusPets | null;
};

export type ItemDropInput = {
  skills?: Array<BonusSkill> | null;
  relics?: Array<BonusRelic> | null;
};

export type GemDropInput = {
  skills?: Array<BonusSkill> | null;
  relics?: Array<BonusRelic> | null;
};

export type OfflineEfficiencyInput = {
  skills?: Array<BonusSkill> | null;
  pets?: BonusPets | null;
  gemShopItems?: Array<BonusGemShopItem> | null;
  relics?: Array<BonusRelic> | null;
  gamePasses?: BonusGamePasses | null;
};

export type AchievementBuffInput = {
  achievements?: Array<BonusAchievement> | null;
};

export type AllBonusesInput = BossDamageInput &
  ItemDropInput &
  GemDropInput &
  OfflineEfficiencyInput &
  AchievementBuffInput;

export function bossDamageMultiplier(state: BossDamageInput): number {
  let mult = 1.0;

  // 1. Skill Tree (Branch 5: 🍀 Vận May)
  if (state.skills) {
    state.skills.forEach(function (s) {
      if (s.unlocked) {
        if (s.id === 'luck_boss_1') mult += 0.25;
        if (s.id === 'luck_boss_2') mult += 0.4;
        if (s.id === 'luck_infinite' && s.level) mult += 0.05 * s.level;
      }
    });
  }

  // 2. Equipped Relics
  if (state.relics) {
    state.relics.forEach(function (r) {
      if (r.equipped && r.bossDamageBonus) {
        mult += r.bossDamageBonus;
      }
    });
  }

  // 3. Pets bonus
  if (state.pets && state.pets.dragon && state.pets.dragon.level) {
    mult += state.pets.dragon.level * 0.04;
  }

  return parseFloat(mult.toFixed(2));
}

export function itemDropChance(state: ItemDropInput): number {
  let chance = 0.05; // Base 5%

  // 1. Skill Tree (Branch 5: 🍀 Vận May)
  if (state.skills) {
    state.skills.forEach(function (s) {
      if (s.unlocked) {
        if (s.id === 'luck_item_1') chance += 0.15;
        if (s.id === 'luck_infinite' && s.level) chance += 0.02 * s.level;
      }
    });
  }

  // 2. Equipped Relics
  if (state.relics) {
    state.relics.forEach(function (r) {
      if (r.equipped && r.itemDropBonus) {
        chance += r.itemDropBonus;
      }
    });
  }

  return Math.min(0.5, parseFloat(chance.toFixed(3))); // Cap at 50%
}

export function gemDropChance(state: GemDropInput): number {
  let chance = 0.03; // Base 3%

  // 1. Skill Tree (Branch 5: 🍀 Vận May)
  if (state.skills) {
    state.skills.forEach(function (s) {
      if (s.unlocked) {
        if (s.id === 'luck_gem_1') chance += 0.12;
        if (s.id === 'luck_infinite' && s.level) chance += 0.02 * s.level;
      }
    });
  }

  // 2. Equipped Relics
  if (state.relics) {
    state.relics.forEach(function (r) {
      if (r.equipped && r.gemDropBonus) {
        chance += r.gemDropBonus;
      }
    });
  }

  return Math.min(0.4, parseFloat(chance.toFixed(3))); // Cap at 40%
}

export function offlineEfficiency(state: OfflineEfficiencyInput): number {
  let eff = 0.5; // Base 50% efficiency (v8.0)

  // 1. Skill Tree (Branch: Cosmic Fortune & Overdrive)
  if (state.skills) {
    state.skills.forEach(function (s) {
      if (s.unlocked) {
        if (s.id === 'fortune_idle') eff += 0.5 * (s.level || 1);
        if (s.id === 'overdrive_zenith') eff += 0.05 * (s.level || 1);
        if (s.id === 'luck_offline') eff += 0.2;
        if (s.id === 'luck_infinite' && s.level) eff += 0.03 * s.level;
      }
    });
  }

  // 2. Gacha Pet 5: Cú Đêm Vĩnh Cửu (+5% per level)
  if (state.pets && state.pets.night_owl && state.pets.night_owl.level) {
    eff += state.pets.night_owl.level * 0.05;
  }

  // 3. Gem Shop perk
  if (
    state.gemShopItems &&
    state.gemShopItems.some(function (i) {
      return i.id === 'gem_offline_boost' && i.purchased;
    })
  ) {
    eff += 0.35;
  }

  // 4. Relics
  if (state.relics) {
    state.relics.forEach(function (r) {
      if (r.equipped && r.offlineBonus) {
        eff += r.offlineBonus;
      }
    });
  }

  // 5. Game Pass: 24H Infinite Offline Chamber
  if (
    state.gamePasses &&
    (state.gamePasses.pass_offline_24h || state.gamePasses.pass_ultimate_bundle)
  ) {
    eff += 0.5;
  }

  return Math.min(1.0, parseFloat(eff.toFixed(2))); // Capped at 100%
}

export function achievementBuffPercent(state: AchievementBuffInput): number {
  if (!state.achievements) return 0;
  const unlockedCount = state.achievements.filter(function (a) {
    return a.unlocked;
  }).length;
  // Each unlocked achievement grants +0.5% Multiplier & CPS (35 * 0.5 = +17.5%)
  return parseFloat((unlockedCount * 0.5).toFixed(1));
}

export function allBonuses(state: AllBonusesInput): BonusesSnapshot {
  return {
    bossDamageMultiplier: bossDamageMultiplier(state),
    itemDropChance: itemDropChance(state),
    gemDropChance: gemDropChance(state),
    offlineEfficiency: offlineEfficiency(state),
    achievementBuffPercent: achievementBuffPercent(state),
  };
}
