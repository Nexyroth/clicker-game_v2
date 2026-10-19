/**
 * NEXYROTH CLICKER - BONUSES & MULTIPLIERS ENGINE (v8.0)
 * Centralizes all 4 new core combat/economy multipliers:
 * 1. Boss Damage Multiplier (Sát Thương Boss)
 * 2. Item Drop Chance (Tỉ Lệ Rơi Item)
 * 3. Gem Drop Chance (Tỉ Lệ Rơi Kim Cương)
 * 4. Offline Efficiency (Hiệu Suất Ngoại Tuyến: base 50%, capped at 100%)
 * Plus Achievement multiplier (+0.5% per unlocked achievement)
 */
(function (global) {
  'use strict';

  function getBossDamageMultiplier() {
    const state = global.GameState.get();
    let mult = 1.0;

    // 1. Skill Tree (Branch 5: 🍀 Vận May)
    if (state.skills) {
      state.skills.forEach(function (s) {
        if (s.unlocked) {
          if (s.id === 'luck_boss_1') mult += 0.25;
          if (s.id === 'luck_boss_2') mult += 0.40;
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

  function getItemDropChance() {
    const state = global.GameState.get();
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

    return Math.min(0.50, parseFloat(chance.toFixed(3))); // Cap at 50%
  }

  function getGemDropChance() {
    const state = global.GameState.get();
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

    return Math.min(0.40, parseFloat(chance.toFixed(3))); // Cap at 40%
  }

  function getOfflineEfficiency() {
    const state = global.GameState.get();
    let eff = 0.50; // Base 50% efficiency (v8.0)

    // 1. Skill Tree (Branch: Cosmic Fortune & Overdrive)
    if (state.skills) {
      state.skills.forEach(function (s) {
        if (s.unlocked) {
          if (s.id === 'fortune_idle') eff += 0.50 * (s.level || 1);
          if (s.id === 'overdrive_zenith') eff += 0.05 * (s.level || 1);
          if (s.id === 'luck_offline') eff += 0.20;
          if (s.id === 'luck_infinite' && s.level) eff += 0.03 * s.level;
        }
      });
    }

    // 2. Gacha Pet 5: Cú Đêm Vĩnh Cửu (+5% per level)
    if (state.pets && state.pets.night_owl && state.pets.night_owl.level) {
      eff += state.pets.night_owl.level * 0.05;
    }

    // 3. Gem Shop perk
    if (state.gemShopItems && state.gemShopItems.some(function (i) { return i.id === 'gem_offline_boost' && i.purchased; })) {
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
    if (state.gamePasses && (state.gamePasses.pass_offline_24h || state.gamePasses.pass_ultimate_bundle)) {
      eff += 0.50;
    }

    return Math.min(1.0, parseFloat(eff.toFixed(2))); // Capped at 100%
  }

  function getAchievementBuffPercent() {
    const state = global.GameState.get();
    if (!state.achievements) return 0;
    const unlockedCount = state.achievements.filter(function (a) { return a.unlocked; }).length;
    // Each unlocked achievement grants +0.5% Multiplier & CPS (35 * 0.5 = +17.5%)
    return parseFloat((unlockedCount * 0.5).toFixed(1));
  }

  function getAllBonuses() {
    return {
      bossDamageMultiplier: getBossDamageMultiplier(),
      itemDropChance: getItemDropChance(),
      gemDropChance: getGemDropChance(),
      offlineEfficiency: getOfflineEfficiency(),
      achievementBuffPercent: getAchievementBuffPercent()
    };
  }

  global.Bonuses = {
    getBossDamageMultiplier: getBossDamageMultiplier,
    getItemDropChance: getItemDropChance,
    getGemDropChance: getGemDropChance,
    getOfflineEfficiency: getOfflineEfficiency,
    getAchievementBuffPercent: getAchievementBuffPercent,
    getAllBonuses: getAllBonuses
  };
})(typeof window !== 'undefined' ? window : this);
