import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { loadLegacy } from '../helpers/loadLegacy';

describe('T6: Click & Core Combat Characterization Tests', () => {
  let GameState: any;
  let UICore: any;

  beforeEach(() => {
    vi.useFakeTimers();
    const legacy = loadLegacy();
    GameState = legacy.GameState;
    UICore = legacy.UICore;
    GameState.load();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  function unequipAllRelics(state: any) {
    state.relics.forEach((r: any) => { r.equipped = false; });
  }

  describe('Core Click Gain & Critical Hit Scenarios', () => {
    it('(a) Non-critical click: clickGain = clickPower * 1 * comboMult', () => {
      const state = GameState.get();
      unequipAllRelics(state);
      state.essence = 0;
      state.totalEssence = 0;
      state.totalClicks = 0;

      // Force non-crit (roll 0.99 > 0.05)
      vi.spyOn(Math, 'random').mockReturnValue(0.99);
      UICore.handleCoreClick(null, true);

      // 1st click comboMult is 1.01
      const stats = UICore.calculateStats();
      const expectedGain = stats.clickPower * 1.01;

      expect(state.essence).toBeCloseTo(expectedGain, 4);
      expect(state.totalEssence).toBeCloseTo(expectedGain, 4);
      expect(state.totalClicks).toBe(1);
      expect(state.records.highestClick).toBeCloseTo(expectedGain, 4);
    });

    it('(b) Critical click: clickGain = clickPower * critMultiplier * comboMult', () => {
      const state = GameState.get();
      unequipAllRelics(state);
      state.essence = 0;

      // Force crit (roll 0.01 < 0.05)
      vi.spyOn(Math, 'random').mockReturnValue(0.01);
      UICore.handleCoreClick(null, true);

      const stats = UICore.calculateStats();
      const expectedGain = stats.clickPower * stats.critMultiplier * 1.01; // 1 * 2.5 * 1.01 = 2.525
      expect(state.essence).toBeCloseTo(expectedGain, 4);
      expect(state.records.highestClick).toBeCloseTo(expectedGain, 4);
    });

    it('(c) Critical click with crit_collapse unlocked: doubles total click gain (2x)', () => {
      const state = GameState.get();
      unequipAllRelics(state);
      state.essence = 0;

      const collapse = state.skills.find((s: any) => s.id === 'crit_collapse');
      collapse.unlocked = true;

      // Force crit
      vi.spyOn(Math, 'random').mockReturnValue(0.01);
      UICore.handleCoreClick(null, true);

      const stats = UICore.calculateStats();
      // clickGain = clickPower * critMultiplier * 2 * comboMult = 1 * 2.5 * 2 * 1.01 = 5.05
      const expectedGain = stats.clickPower * stats.critMultiplier * 2 * 1.01;
      expect(state.essence).toBeCloseTo(expectedGain, 4);
    });

    it('(d) Critical click with crit_chain unlocked: triggers 50% extra chain strike', () => {
      const state = GameState.get();
      unequipAllRelics(state);
      state.essence = 0;

      const chain = state.skills.find((s: any) => s.id === 'crit_chain');
      chain.unlocked = true;

      // Chain roll < 0.20 triggers chainGain = clickGain * 0.50
      // Mock random: 0.01 for crit check, 0.05 for chain reaction check (< 0.20)
      let callCount = 0;
      vi.spyOn(Math, 'random').mockImplementation(() => {
        callCount++;
        if (callCount === 1) return 0.01; // isCrit check
        if (callCount === 2) return 0.05; // crit_chain roll
        return 0.99; // drops/other
      });

      UICore.handleCoreClick(null, true);

      const stats = UICore.calculateStats();
      const baseGain = stats.clickPower * stats.critMultiplier * 1.01;
      const chainGain = baseGain * 0.50;
      const totalExpected = baseGain + chainGain;

      expect(state.essence).toBeCloseTo(totalExpected, 4);
    });
  });

  describe('EXP Progression & Leveling Up', () => {
    it('awards floor(clickGain * 0.02) minimum 1 EXP per click', () => {
      const state = GameState.get();
      state.currentExp = 0;

      vi.spyOn(Math, 'random').mockReturnValue(0.99); // non-crit
      UICore.handleCoreClick(null, true);

      // clickGain is ~1.16, floor(1.16 * 0.02) = 0, Math.max(1, 0) = 1
      expect(state.currentExp).toBe(1);
    });

    it('levels up, increases skillPoints, and scales maxExp by 1.35x when reaching maxExp', () => {
      const state = GameState.get();
      state.level = 1;
      state.currentExp = 99;
      state.maxExp = 100;
      state.skillPoints = 0;

      vi.spyOn(Math, 'random').mockReturnValue(0.99);
      UICore.handleCoreClick(null, true);

      // currentExp became 100 >= 100
      expect(state.level).toBe(2);
      expect(state.currentExp).toBe(0); // 100 - 100
      expect(state.maxExp).toBe(Math.floor(100 * 1.35)); // 135
      expect(state.skillPoints).toBe(1);
    });
  });

  describe('Combo Multiplier and 3-second Reset', () => {
    it('builds combo with consecutive clicks and resets to 1.00 after 3000ms idle', () => {
      const state = GameState.get();
      unequipAllRelics(state);

      vi.spyOn(Math, 'random').mockReturnValue(0.99);

      // Click 5 times in quick succession (100ms apart)
      for (let i = 0; i < 5; i++) {
        UICore.handleCoreClick(null, true);
        vi.advanceTimersByTime(100);
      }

      // Essence accumulated should reflect growing combo
      expect(state.totalClicks).toBe(5);

      // Advance time by 3500ms (exceeding COMBO_RESET_MS = 3000ms)
      vi.advanceTimersByTime(3500);

      // Next click starts from clean combo tier 0 (1st hit)
      state.essence = 0;
      UICore.handleCoreClick(null, true);
      // Combo reset back to initial 1.01x on first hit
      const stats = UICore.calculateStats();
      expect(state.essence).toBeCloseTo(stats.clickPower * 1.01, 4);
    });
  });

  describe('Internal Drop Cooldowns (Anti-spam ICD)', () => {
    it('enforces 60s cooldown on potion drops and 90s cooldown on gem drops', () => {
      const state = GameState.get();
      state.astralGems = 0;
      const initialPotionsCount = Object.values(state.potions || {}).reduce((a: any, b: any) => a + b, 0);

      // Mock Math.random to 0 to trigger 100% drops when off cooldown
      vi.spyOn(Math, 'random').mockReturnValue(0.00001);

      // Click 1: off cooldown, drops 1 gem and 1 potion
      UICore.handleCoreClick(null, false);
      expect(state.astralGems).toBe(1);

      const potionsAfter1 = Object.values(state.potions || {}).reduce((a: any, b: any) => a + b, 0);
      expect(potionsAfter1).toBe(Number(initialPotionsCount) + 1);

      // Click 2 immediately (10ms later): blocked by 60s/90s ICD
      vi.advanceTimersByTime(10);
      UICore.handleCoreClick(null, false);
      expect(state.astralGems).toBe(1); // no extra gem
      const potionsAfter2 = Object.values(state.potions || {}).reduce((a: any, b: any) => a + b, 0);
      expect(potionsAfter2).toBe(potionsAfter1); // no extra potion

      // Advance by 65s (65000ms): potion cooldown elapsed, but gem still on 90s cooldown
      vi.advanceTimersByTime(65000);
      UICore.handleCoreClick(null, false);
      const potionsAfter3 = Object.values(state.potions || {}).reduce((a: any, b: any) => a + b, 0);
      expect(potionsAfter3).toBe(Number(potionsAfter1) + 1); // got another potion!
      expect(state.astralGems).toBe(1); // gem still blocked!

      // Advance by another 30s (total 95s since first click): gem cooldown now elapsed
      vi.advanceTimersByTime(30000);
      UICore.handleCoreClick(null, false);
      expect(state.astralGems).toBe(2); // got second gem!
    });
  });
});
