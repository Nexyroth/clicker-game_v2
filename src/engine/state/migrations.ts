import {
  DEFAULT_UPGRADES,
  DEFAULT_SKILLS,
  DEFAULT_RELICS,
  DEFAULT_ACHIEVEMENTS,
  DEFAULT_PETS,
  DEFAULT_POTIONS,
  DEFAULT_ACTIVE_POTIONS,
  DEFAULT_DAILY_STREAK,
  DEFAULT_EVENT_STATE,
} from '../../data';
import type { GameState } from '../types';

export function runMigrations(state: GameState): void {
  // 1. Merge Upgrades: keep existing levels, append missing ones
  if (!state.upgrades) state.upgrades = [];
  DEFAULT_UPGRADES.forEach((defU) => {
    const existing = state.upgrades.find((u) => u.id === defU.id);
    if (!existing) {
      state.upgrades.push(JSON.parse(JSON.stringify(defU)));
    } else {
      existing.name = defU.name;
      existing.desc = defU.desc;
      existing.baseCost = defU.baseCost;
      existing.baseEffect = defU.baseEffect;
      existing.unlockedAtLevel = defU.unlockedAtLevel;
      existing.costMultiplier = defU.costMultiplier;
    }
  });

  // 2. Merge Skills: Constellation Map migration & safe SP refund
  const hasCore = state.skills && state.skills.some((s) => s.id === 'core');
  if (!hasCore) {
    let refundedSp = 0;
    if (Array.isArray(state.skills)) {
      state.skills.forEach((oldS: any) => {
        if (oldS.unlocked && oldS.costPoints) {
          refundedSp += oldS.costPoints;
          if (oldS.level && oldS.level > 1) {
            refundedSp += (oldS.level - 1) * oldS.costPoints;
          }
        }
      });
    }
    state.skillPoints = (state.skillPoints || 0) + refundedSp;
    state.skills = JSON.parse(JSON.stringify(DEFAULT_SKILLS));
  } else {
    DEFAULT_SKILLS.forEach((defS) => {
      const existing = state.skills.find((s) => s.id === defS.id);
      if (!existing) {
        state.skills.push(JSON.parse(JSON.stringify(defS)));
      } else {
        existing.name = defS.name;
        existing.nameVi = defS.nameVi;
        existing.branch = defS.branch;
        existing.branchNameVi = defS.branchNameVi;
        existing.x = defS.x;
        existing.y = defS.y;
        existing.requires = defS.requires;
        existing.maxLevel = defS.maxLevel;
        existing.costPoints = defS.costPoints;
        existing.icon = defS.icon;
        existing.descVi = defS.descVi;
        existing.descEn = defS.descEn;
        existing.effectType = defS.effectType;
        existing.effectPerLevel = defS.effectPerLevel;
      }
    });
  }

  // 3. Merge Relics: ensure all relics exist
  if (!state.relics) state.relics = [];
  DEFAULT_RELICS.forEach((defR) => {
    const existing = state.relics.find((r) => r.id === defR.id);
    if (!existing) {
      state.relics.push(JSON.parse(JSON.stringify(defR)));
    } else {
      existing.name = defR.name;
      existing.rarity = defR.rarity;
      existing.effectDesc = defR.effectDesc;
      existing.clickBonus = defR.clickBonus || 0;
      existing.cpsBonus = defR.cpsBonus || 0;
      existing.critBonus = defR.critBonus || 0;
      const rAny = defR as {
        bossDamageBonus?: number;
        itemDropBonus?: number;
        gemDropBonus?: number;
        offlineBonus?: number;
      };
      if (rAny.bossDamageBonus) existing.bossDamageBonus = rAny.bossDamageBonus;
      if (rAny.itemDropBonus) existing.itemDropBonus = rAny.itemDropBonus;
      if (rAny.gemDropBonus) existing.gemDropBonus = rAny.gemDropBonus;
      if (rAny.offlineBonus) existing.offlineBonus = rAny.offlineBonus;
    }
  });

  // 4. Merge Achievements: ensure achievements exist
  if (!state.achievements) state.achievements = [];
  DEFAULT_ACHIEVEMENTS.forEach((defA) => {
    const existing = state.achievements.find((a) => a.id === defA.id);
    if (!existing) {
      state.achievements.push(JSON.parse(JSON.stringify(defA)));
    } else {
      existing.name = defA.name;
      existing.desc = defA.desc;
      existing.rewardGems = defA.rewardGems;
      existing.target = defA.target;
      existing.type = defA.type;
    }
  });

  // 5. Merge Pets
  if (!state.pets) state.pets = JSON.parse(JSON.stringify(DEFAULT_PETS));
  const pets = state.pets!;
  Object.keys(DEFAULT_PETS).forEach((k) => {
    if (!pets[k]) pets[k] = JSON.parse(JSON.stringify((DEFAULT_PETS as any)[k]));
  });

  // 6. Merge Records
  if (!state.records) {
    state.records = { highestCps: 0, highestClick: 0, maxClicksIn10s: 0 };
  }

  // 7. Merge Potions
  if (!state.potions) state.potions = JSON.parse(JSON.stringify(DEFAULT_POTIONS));
  Object.keys(DEFAULT_POTIONS).forEach((k) => {
    if ((state.potions as any)[k] === undefined) (state.potions as any)[k] = (DEFAULT_POTIONS as any)[k];
  });
  if (!state.activePotions) state.activePotions = JSON.parse(JSON.stringify(DEFAULT_ACTIVE_POTIONS));
  Object.keys(DEFAULT_ACTIVE_POTIONS).forEach((k) => {
    if ((state.activePotions as any)[k] === undefined) (state.activePotions as any)[k] = 0;
  });

  // 8. Daily & Events
  if (!state.daily) state.daily = JSON.parse(JSON.stringify(DEFAULT_DAILY_STREAK));
  if (!state.events || !state.events.quests) state.events = JSON.parse(JSON.stringify(DEFAULT_EVENT_STATE));

  // 9. Game Passes
  if (!state.gamePasses) {
    state.gamePasses = {
      pass_autoclick_perm: false,
      pass_double_essence: false,
      pass_fortune_loot: false,
      pass_offline_24h: false,
      pass_crit_overdrive: false,
      pass_ultimate_bundle: false,
    };
  }

  // 10. Enforce maximum 4 equipped relics (unequip surplus from end of array)
  if (state.relics && Array.isArray(state.relics)) {
    let equippedCount = 0;
    for (const r of state.relics) {
      if (r.equipped) equippedCount++;
    }
    if (equippedCount > 4) {
      let excess = equippedCount - 4;
      for (let i = state.relics.length - 1; i >= 0 && excess > 0; i--) {
        if (state.relics[i].equipped) {
          state.relics[i].equipped = false;
          excess--;
        }
      }
    }
  }

  // 11. Potions Used counter & Save v9.0 migration
  if (typeof state.potionsUsed !== 'number' || isNaN(state.potionsUsed) || state.potionsUsed < 0) {
    state.potionsUsed = 0;
  }
  state.version = '9.0';
}
