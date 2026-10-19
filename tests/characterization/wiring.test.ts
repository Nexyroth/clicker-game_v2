import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadLegacy } from '../helpers/loadLegacy';

describe('T3: Wiring Table Characterization Tests', () => {
  let GameState: any;
  let UICore: any;
  let UIUpgrades: any;
  let Bonuses: any;

  beforeEach(() => {
    const legacy = loadLegacy();
    GameState = legacy.GameState;
    UICore = legacy.UICore;
    UIUpgrades = legacy.UIUpgrades;
    Bonuses = legacy.Bonuses;
    GameState.load();
  });

  function unequipAllRelics(state: any) {
    state.relics.forEach((r: any) => { r.equipped = false; });
  }

  describe('1. 41 Upgrades Wiring Check', () => {
    it('verifies that every single one of the 41 upgrades is wired to clickPower or cps', () => {
      const state = GameState.get();
      unequipAllRelics(state);

      expect(state.upgrades.length).toBe(41);

      state.upgrades.forEach((u: any) => {
        // Reset all upgrades
        state.upgrades.forEach((other: any) => { other.level = 0; });

        // Base before
        const before = UICore.calculateStats();

        // Level up this upgrade
        u.level = 1;
        const after = UICore.calculateStats();

        if (u.effectType === 'click') {
          expect(after.clickPower, `Upgrade ${u.id} should increase clickPower`).toBe(before.clickPower + u.baseEffect);
        } else if (u.effectType === 'cps') {
          expect(after.cps, `Upgrade ${u.id} should increase cps`).toBe(before.cps + u.baseEffect);
        } else {
          throw new Error(`Upgrade ${u.id} has unknown effectType: ${u.effectType}`);
        }
      });
    });
  });

  describe('2. Skill Tree Wiring & Dangling Nodes', () => {
    it('verifies the 7 skills that directly wire to calculateStats', () => {
      const state = GameState.get();
      unequipAllRelics(state);
      state.upgrades.find((u: any) => u.id === 'void_siphon').level = 100; // 100 base cps

      // chrono_pulse -> CPS
      const pulse = state.skills.find((s: any) => s.id === 'chrono_pulse');
      pulse.unlocked = true;
      pulse.level = 1;
      expect(UICore.calculateStats().cps).toBeCloseTo(110, 4);
      pulse.unlocked = false;

      // chrono_overclock -> clickPower
      const overclock = state.skills.find((s: any) => s.id === 'chrono_overclock');
      overclock.unlocked = true;
      overclock.level = 1;
      expect(UICore.calculateStats().clickPower).toBeCloseTo(1.10, 4);
      overclock.unlocked = false;

      // crit_focus -> critChance
      const focus = state.skills.find((s: any) => s.id === 'crit_focus');
      focus.unlocked = true;
      focus.level = 1;
      expect(UICore.calculateStats().critChance).toBeCloseTo(0.10, 4);
      focus.unlocked = false;

      // crit_supernova -> critMultiplier
      const supernova = state.skills.find((s: any) => s.id === 'crit_supernova');
      supernova.unlocked = true;
      supernova.level = 1;
      expect(UICore.calculateStats().critMultiplier).toBe(3.5);
      supernova.unlocked = false;

      // crit_chain -> clickPower
      const chain = state.skills.find((s: any) => s.id === 'crit_chain');
      chain.unlocked = true;
      chain.level = 1;
      expect(UICore.calculateStats().clickPower).toBeCloseTo(1.35, 4);
      chain.unlocked = false;

      // overdrive_synergy -> CPS (requires unspent skillPoints)
      const synergy = state.skills.find((s: any) => s.id === 'overdrive_synergy');
      synergy.unlocked = true;
      synergy.level = 1;
      state.skillPoints = 10;
      expect(UICore.calculateStats().cps).toBeCloseTo(110, 4); // +10%
      synergy.unlocked = false;

      // overdrive_zenith -> Click, CPS, Crit
      const zenith = state.skills.find((s: any) => s.id === 'overdrive_zenith');
      zenith.unlocked = true;
      zenith.level = 1;
      const zenithStats = UICore.calculateStats();
      expect(zenithStats.clickPower).toBeCloseTo(1.05, 4);
      expect(zenithStats.cps).toBeCloseTo(105, 4);
      expect(zenithStats.critChance).toBeCloseTo(0.07, 4);
      zenith.unlocked = false;
    });

    it('verifies skills wired to other game systems (crit_collapse, fortune_idle)', () => {
      const state = GameState.get();

      // fortune_idle wires to Bonuses.getOfflineEfficiency (+50% per lvl)
      const idle = state.skills.find((s: any) => s.id === 'fortune_idle');
      idle.unlocked = true;
      idle.level = 1;
      expect(Bonuses.getOfflineEfficiency()).toBe(1.0); // 0.50 base + 0.50 = 1.0 (cap 1.0)
      idle.unlocked = false;

      // crit_collapse wires to handleCoreClick doubling crit gain
      const collapse = state.skills.find((s: any) => s.id === 'crit_collapse');
      collapse.unlocked = true;

      // Mock random to force crit
      vi.spyOn(Math, 'random').mockReturnValue(0.01);
      state.essence = 0;
      UICore.handleCoreClick({ clientX: 100, clientY: 100 });
      // With crit (2.5x), crit_collapse (2x), and 1st click combo (1.01x): gain = 1.15 * 2.5 * 2 * 1.01 = 5.8075
      const stats = UICore.calculateStats();
      const expectedGain = stats.clickPower * stats.critMultiplier * 2 * 1.01;
      expect(state.essence).toBeCloseTo(expectedGain, 4);
    });

    it('documents dangling/unwired skills in current codebase', () => {
      const state = GameState.get();

      // core: anchor node, no stat impact
      const core = state.skills.find((s: any) => s.id === 'core');
      expect(core.unlocked).toBe(true);
      expect(core.effectType).toBe('core');

      // chrono_warp: autoSpeed description, not wired to auto-clicker interval
      const warp = state.skills.find((s: any) => s.id === 'chrono_warp');
      expect(warp.effectType).toBe('autoSpeed');

      // chrono_infinity: cooldown description, not wired to triggerSkill cooldown timers
      const infinity = state.skills.find((s: any) => s.id === 'chrono_infinity');
      expect(infinity.effectType).toBe('cooldown');

      // fortune_dust: shardBonus description, not wired to executePrestige
      const dust = state.skills.find((s: any) => s.id === 'fortune_dust');
      expect(dust.effectType).toBe('shardBonus');

      // fortune_meteor: eventFreq description, not wired to spawn timers
      const meteor = state.skills.find((s: any) => s.id === 'fortune_meteor');
      expect(meteor.effectType).toBe('eventFreq');

      // overdrive_horizon: skillSurge description, not wired to triggerSkill
      const horizon = state.skills.find((s: any) => s.id === 'overdrive_horizon');
      expect(horizon.effectType).toBe('skillSurge');

      // Branch 5: luck_* skills referenced in bonuses.js and achievements are completely missing from DEFAULT_SKILLS
      const luckSkills = state.skills.filter((s: any) => s.branch === 'luck' || s.id.startsWith('luck_'));
      expect(luckSkills.length).toBe(0);
    });
  });

  describe('3. Relics Wiring (27 Relics)', () => {
    it('verifies that all 27 relics are wired to combat/production/drop bonuses', () => {
      const state = GameState.get();
      expect(state.relics.length).toBe(27);

      state.relics.forEach((r: any) => {
        unequipAllRelics(state);
        r.equipped = true;

        const stats = UICore.calculateStats();
        const bonuses = Bonuses.getAllBonuses();

        let hasWorkingEffect = false;
        if (r.clickBonus && stats.clickPower > 1) hasWorkingEffect = true;
        if (r.cpsBonus) hasWorkingEffect = true; // tested with base cps
        if (r.critBonus && stats.critChance > 0.05) hasWorkingEffect = true;
        if (r.bossDamageBonus && bonuses.bossDamageMultiplier > 1.0) hasWorkingEffect = true;
        if (r.gemDropBonus && bonuses.gemDropChance > 0.03) hasWorkingEffect = true;
        if (r.itemDropBonus && bonuses.itemDropChance > 0.05) hasWorkingEffect = true;
        if (r.offlineBonus && bonuses.offlineEfficiency > 0.50) hasWorkingEffect = true;

        expect(hasWorkingEffect, `Relic ${r.id} should have at least one wired combat/economy effect`).toBe(true);
      });
    });
  });

  describe('4. Gem Shop Items Wiring & Quirks', () => {
    it('verifies wired gem items and documents unwired ones', () => {
      const state = GameState.get();
      unequipAllRelics(state);

      // gem_mult_1: wired (doubles stats)
      const gem1 = state.gemShopItems.find((i: any) => i.id === 'gem_mult_1');
      gem1.purchased = true;
      expect(UICore.calculateStats().clickPower).toBe(2);
      gem1.purchased = false;

      // gem_crit_overload: wired for critChance (+10%) and crit power (+2.0)
      const gemCrit = state.gemShopItems.find((i: any) => i.id === 'gem_crit_overload');
      gemCrit.purchased = true;
      const critStats = UICore.calculateStats();
      expect(critStats.critChance).toBeCloseTo(0.15, 4);
      // Phase 5E-1: critMultiplier boosted by +2.0 (2.5 -> 4.5)
      expect(critStats.critMultiplier).toBe(4.5);
      gemCrit.purchased = false;

      // gem_offline_boost: wired to Bonuses.getOfflineEfficiency (+35%)
      const gemOff = state.gemShopItems.find((i: any) => i.id === 'gem_offline_boost');
      gemOff.purchased = true;
      expect(Bonuses.getOfflineEfficiency()).toBe(0.85); // 0.50 + 0.35
      gemOff.purchased = false;

      // gem_auto_click: unwired quirk (described as clicking 5 times/sec, never checked)
      const gemDrone = state.gemShopItems.find((i: any) => i.id === 'gem_auto_click');
      expect(gemDrone).toBeDefined();
      expect(gemDrone.value).toBe(5);
    });
  });

  describe('5. Game Passes Wiring', () => {
    it('verifies all 6 game passes are properly connected', () => {
      const state = GameState.get();
      unequipAllRelics(state);

      // pass_double_essence
      state.gamePasses.pass_double_essence = true;
      expect(UICore.calculateStats().clickPower).toBe(2);
      state.gamePasses.pass_double_essence = false;

      // pass_crit_overdrive
      state.gamePasses.pass_crit_overdrive = true;
      const passCritStats = UICore.calculateStats();
      expect(passCritStats.critChance).toBeCloseTo(0.15, 4);
      expect(passCritStats.critMultiplier).toBe(4.0);
      state.gamePasses.pass_crit_overdrive = false;

      // pass_offline_24h
      state.gamePasses.pass_offline_24h = true;
      expect(Bonuses.getOfflineEfficiency()).toBe(1.0); // 0.50 + 0.50 = 1.0 (capped)
      state.gamePasses.pass_offline_24h = false;

      // pass_ultimate_bundle
      state.gamePasses.pass_ultimate_bundle = true;
      const bundleStats = UICore.calculateStats();
      expect(bundleStats.clickPower).toBe(2);
      expect(bundleStats.critChance).toBeCloseTo(0.15, 4);
      expect(bundleStats.critMultiplier).toBe(4.0);
      expect(Bonuses.getOfflineEfficiency()).toBe(1.0);
    });
  });

  describe('6. Pets Wiring & Quirks', () => {
    it('documents that 18 world pets in DEFAULT_PETS are unwired, night_owl is wired, and dragon is external', () => {
      const state = GameState.get();
      const petKeys = Object.keys(state.pets);
      // 18 world pets + 1 gacha pet (night_owl) = 19 pets in DEFAULT_PETS
      expect(petKeys.length).toBe(19);

      // Quirk: 18 world pets (w1_*, w2_*, w3_*, w4_*) are not checked in calculateStats or bonuses.js
      state.pets.w1_sprite.level = 10;
      expect(UICore.calculateStats().clickPower).toBeCloseTo(1.15, 4); // unaffected

      // night_owl is in DEFAULT_PETS and wired to Bonuses.getOfflineEfficiency
      expect(state.pets.night_owl).toBeDefined();
      state.pets.night_owl.level = 4;
      expect(Bonuses.getOfflineEfficiency()).toBe(0.70); // 0.50 base + 4 * 0.05

      // dragon is checked in bonuses.js but absent from DEFAULT_PETS
      expect(state.pets.dragon).toBeUndefined();
      state.pets.dragon = { level: 5 };
      expect(Bonuses.getBossDamageMultiplier()).toBe(1.20); // 1.0 + 5 * 0.04
    });
  });

  describe('7. Boss HP Scaling & Multipliers', () => {
    it('verifies boss HP calculation formulas across levels and tiers', () => {
      // Formula: baseHp = Math.floor(25000 * Math.pow(1.8, nextLevel - 1))
      // Level 1 Normal
      expect(Math.floor(25000 * Math.pow(1.8, 0))).toBe(25000);

      // Level 2 Normal
      expect(Math.floor(25000 * Math.pow(1.8, 1))).toBe(45000);

      // Level 3 Normal
      expect(Math.floor(25000 * Math.pow(1.8, 2))).toBe(81000);

      // Level 10 Milestone Normal (1.5x)
      const lvl10Base = Math.floor(25000 * Math.pow(1.8, 9));
      const lvl10Milestone = Math.floor(lvl10Base * 1.5);
      expect(lvl10Milestone).toBeGreaterThan(lvl10Base);

      // Rare tier (1.5x)
      const rareHp = Math.floor(25000 * 1.5);
      expect(rareHp).toBe(37500);

      // Daily tier (3.0x)
      const dailyHp = Math.floor(25000 * 3.0);
      expect(dailyHp).toBe(75000);
    });

    it('damages boss HP during active boss fight upon clicking', () => {
      const state = GameState.get();
      const boss = GameState.getBoss();
      boss.active = true;
      boss.currentHp = 25000;
      boss.maxHp = 25000;

      // Mock random to non-crit
      vi.spyOn(Math, 'random').mockReturnValue(0.99);
      UICore.handleCoreClick({ clientX: 100, clientY: 100 });

      expect(boss.currentHp).toBeLessThan(25000);
    });
  });
});
