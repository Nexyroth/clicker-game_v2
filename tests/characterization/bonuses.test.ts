import { describe, it, expect, beforeEach } from 'vitest';
import { loadLegacy } from '../helpers/loadLegacy';

describe('T4: Bonuses Characterization Tests', () => {
  let GameState: any;
  let Bonuses: any;

  beforeEach(() => {
    const legacy = loadLegacy();
    GameState = legacy.GameState;
    Bonuses = legacy.Bonuses;
    GameState.load();
  });

  function unequipAllRelics(state: any) {
    state.relics.forEach((r: any) => { r.equipped = false; });
  }

  describe('Bonuses.getBossDamageMultiplier', () => {
    it('returns base 1.0 with no bonuses', () => {
      const state = GameState.get();
      unequipAllRelics(state);
      expect(Bonuses.getBossDamageMultiplier()).toBe(1.0);
    });

    it('adds bossDamageBonus from equipped relics', () => {
      const state = GameState.get();
      unequipAllRelics(state);

      // relic_giant_hammer has bossDamageBonus: 0.50
      const hammer = state.relics.find((r: any) => r.id === 'relic_giant_hammer');
      hammer.equipped = true;
      expect(Bonuses.getBossDamageMultiplier()).toBe(1.50);

      // relic_void_crown has bossDamageBonus: 0.10
      const crown = state.relics.find((r: any) => r.id === 'relic_void_crown');
      crown.equipped = true;
      expect(Bonuses.getBossDamageMultiplier()).toBe(1.60);
    });

    it('adds pet dragon bonus if present', () => {
      const state = GameState.get();
      unequipAllRelics(state);

      state.pets.dragon = { level: 5 };
      expect(Bonuses.getBossDamageMultiplier()).toBe(1.20); // 1.0 + 5 * 0.04
    });

    it('adds luck branch skills when present in state', () => {
      const state = GameState.get();
      unequipAllRelics(state);

      state.skills.push({ id: 'luck_boss_1', unlocked: true });
      state.skills.push({ id: 'luck_boss_2', unlocked: true });
      state.skills.push({ id: 'luck_infinite', unlocked: true, level: 3 });

      // 1.0 + 0.25 + 0.40 + (0.05 * 3) = 1.80
      expect(Bonuses.getBossDamageMultiplier()).toBe(1.80);
    });
  });

  describe('Bonuses.getItemDropChance', () => {
    it('returns base 0.05 (5%) with zero bonuses', () => {
      const state = GameState.get();
      unequipAllRelics(state);
      expect(Bonuses.getItemDropChance()).toBe(0.05);
    });

    it('adds itemDropBonus from equipped relics', () => {
      const state = GameState.get();
      unequipAllRelics(state);

      // relic_treasure_radar has itemDropBonus: 0.30
      const radar = state.relics.find((r: any) => r.id === 'relic_treasure_radar');
      radar.equipped = true;
      expect(Bonuses.getItemDropChance()).toBe(0.35); // 0.05 + 0.30
    });

    it('adds luck_item_1 and luck_infinite skills when present', () => {
      const state = GameState.get();
      unequipAllRelics(state);

      state.skills.push({ id: 'luck_item_1', unlocked: true });
      state.skills.push({ id: 'luck_infinite', unlocked: true, level: 2 });
      // 0.05 + 0.15 + (0.02 * 2) = 0.24
      expect(Bonuses.getItemDropChance()).toBe(0.24);
    });

    it('strictly caps at 0.50 (50%) when bonuses stack beyond the ceiling', () => {
      const state = GameState.get();
      unequipAllRelics(state);

      const radar = state.relics.find((r: any) => r.id === 'relic_treasure_radar');
      radar.equipped = true; // +0.30
      state.skills.push({ id: 'luck_item_1', unlocked: true }); // +0.15
      state.skills.push({ id: 'luck_infinite', unlocked: true, level: 10 }); // +0.20
      // Sum would be 0.70, but capped at 0.50
      expect(Bonuses.getItemDropChance()).toBe(0.50);
    });
  });

  describe('Bonuses.getGemDropChance', () => {
    it('returns base 0.03 (3%) with zero bonuses', () => {
      const state = GameState.get();
      unequipAllRelics(state);
      expect(Bonuses.getGemDropChance()).toBe(0.03);
    });

    it('adds gemDropBonus from equipped relics', () => {
      const state = GameState.get();
      unequipAllRelics(state);

      // relic_lucky_coin has gemDropBonus: 0.25
      const coin = state.relics.find((r: any) => r.id === 'relic_lucky_coin');
      coin.equipped = true;
      expect(Bonuses.getGemDropChance()).toBe(0.28); // 0.03 + 0.25
    });

    it('adds luck_gem_1 and luck_infinite skills when present', () => {
      const state = GameState.get();
      unequipAllRelics(state);

      state.skills.push({ id: 'luck_gem_1', unlocked: true });
      state.skills.push({ id: 'luck_infinite', unlocked: true, level: 4 });
      // 0.03 + 0.12 + (0.02 * 4) = 0.23
      expect(Bonuses.getGemDropChance()).toBe(0.23);
    });

    it('strictly caps at 0.40 (40%) when bonuses stack beyond the ceiling', () => {
      const state = GameState.get();
      unequipAllRelics(state);

      const coin = state.relics.find((r: any) => r.id === 'relic_lucky_coin');
      coin.equipped = true; // +0.25
      state.skills.push({ id: 'luck_gem_1', unlocked: true }); // +0.12
      state.skills.push({ id: 'luck_infinite', unlocked: true, level: 10 }); // +0.20
      // Sum would be 0.60, but capped at 0.40
      expect(Bonuses.getGemDropChance()).toBe(0.40);
    });
  });

  describe('Bonuses.getOfflineEfficiency', () => {
    it('returns base 0.50 (50%) with zero bonuses', () => {
      const state = GameState.get();
      unequipAllRelics(state);
      expect(Bonuses.getOfflineEfficiency()).toBe(0.50);
    });

    it('adds skill bonuses (fortune_idle and overdrive_zenith)', () => {
      const state = GameState.get();
      unequipAllRelics(state);

      const zenith = state.skills.find((s: any) => s.id === 'overdrive_zenith');
      zenith.unlocked = true;
      zenith.level = 2; // +0.10
      expect(Bonuses.getOfflineEfficiency()).toBe(0.60); // 0.50 + 0.10
    });

    it('adds pet night_owl bonus (+5% per level)', () => {
      const state = GameState.get();
      unequipAllRelics(state);

      state.pets.night_owl.level = 3; // +0.15
      expect(Bonuses.getOfflineEfficiency()).toBe(0.65); // 0.50 + 0.15
    });

    it('adds gem_offline_boost perk (+35%)', () => {
      const state = GameState.get();
      unequipAllRelics(state);

      const item = state.gemShopItems.find((i: any) => i.id === 'gem_offline_boost');
      item.purchased = true;
      expect(Bonuses.getOfflineEfficiency()).toBe(0.85); // 0.50 + 0.35
    });

    it('adds relic offlineBonus (e.g. relic_starlight_boots +10%)', () => {
      const state = GameState.get();
      unequipAllRelics(state);

      const boots = state.relics.find((r: any) => r.id === 'relic_starlight_boots');
      boots.equipped = true;
      expect(Bonuses.getOfflineEfficiency()).toBe(0.60); // 0.50 + 0.10
    });

    it('adds pass_offline_24h (+50%)', () => {
      const state = GameState.get();
      unequipAllRelics(state);

      state.gamePasses.pass_offline_24h = true;
      expect(Bonuses.getOfflineEfficiency()).toBe(1.0); // 0.50 + 0.50 = 1.0 (capped)
    });

    it('strictly caps at 1.0 (100%) when stacked beyond 100%', () => {
      const state = GameState.get();
      unequipAllRelics(state);

      const idle = state.skills.find((s: any) => s.id === 'fortune_idle');
      idle.unlocked = true;
      idle.level = 2; // +1.00
      state.gamePasses.pass_offline_24h = true; // +0.50
      state.pets.night_owl.level = 10; // +0.50
      // Sum = 2.50, capped at 1.0
      expect(Bonuses.getOfflineEfficiency()).toBe(1.0);
    });
  });

  describe('Bonuses.getAchievementBuffPercent & getAllBonuses', () => {
    it('evaluates achievement buff percentage accurately', () => {
      const state = GameState.get();
      state.achievements.forEach((a: any) => { a.unlocked = false; });
      expect(Bonuses.getAchievementBuffPercent()).toBe(0);

      for (let i = 0; i < 10; i++) state.achievements[i].unlocked = true;
      expect(Bonuses.getAchievementBuffPercent()).toBe(5.0);

      state.achievements.forEach((a: any) => { a.unlocked = true; });
      expect(Bonuses.getAchievementBuffPercent()).toBe(17.5);
    });

    it('returns complete snapshot from getAllBonuses()', () => {
      const all = Bonuses.getAllBonuses();
      expect(all).toHaveProperty('bossDamageMultiplier');
      expect(all).toHaveProperty('itemDropChance');
      expect(all).toHaveProperty('gemDropChance');
      expect(all).toHaveProperty('offlineEfficiency');
      expect(all).toHaveProperty('achievementBuffPercent');
    });
  });
});
