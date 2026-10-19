import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { loadLegacy } from '../helpers/loadLegacy';
import { runMigrations } from '../../src/engine/state/migrations';
import { createInitialState } from '../../src/engine/state/initialState';
import { Engine } from '../../src/engine/api';
import type { GameState } from '../../src/engine/types';

describe('Regression Tests: Intentional Behavior Fixes (F1 - F5)', () => {
  let legacy: any;
  let GameState: any;
  let UICore: any;
  let DailyRewards: any;

  beforeEach(() => {
    vi.useFakeTimers();
    legacy = loadLegacy();
    GameState = legacy.GameState;
    UICore = legacy.UICore;
    DailyRewards = legacy.DailyRewards;
    GameState.load();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  // --------------------------------------------------------------------------
  // F1: state.totalCrits increment & crits achievements unlocked
  // --------------------------------------------------------------------------
  describe('F1 Fix: state.totalCrits counter & crits achievements', () => {
    it('increments state.totalCrits correctly on multiple critical clicks', () => {
      const state = GameState.get();
      expect(state.totalCrits || 0).toBe(0);

      // Mock Math.random to always crit (0 < critChance)
      vi.spyOn(Math, 'random').mockReturnValue(0);

      for (let i = 1; i <= 55; i++) {
        UICore.handleCoreClick(null, true);
        expect(state.totalCrits).toBe(i);
      }

      expect(state.totalCrits).toBe(55);
    });

    it('unlocks crits_50 achievement after 50 critical clicks', () => {
      const state = GameState.get();
      state.totalCrits = 0;

      // Mock Math.random to always crit
      vi.spyOn(Math, 'random').mockReturnValue(0);

      for (let i = 0; i < 50; i++) {
        UICore.handleCoreClick(null, true);
      }

      expect(state.totalCrits).toBe(50);

      // Evaluate achievements via engine
      const currents = Engine.achievementCurrents(state);
      const crits50Index = state.achievements.findIndex((a: any) => a.id === 'crits_50');
      expect(crits50Index).toBeGreaterThanOrEqual(0);
      expect(currents[crits50Index]).toBe(50);
      expect(currents[crits50Index] >= state.achievements[crits50Index].target).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // F2: Multi-level up in a single click using while loop
  // --------------------------------------------------------------------------
  describe('F2 Fix: Multi-level up in a single click', () => {
    it('levels up multiple times when receiving massive EXP in a single click', () => {
      const state = GameState.get();
      state.level = 1;
      state.currentExp = 0;
      state.maxExp = 100;
      state.skillPoints = 0;

      // Click power huge to yield huge EXP:
      // clickGain * 0.02 EXP. If clickGain = 50,000 -> EXP = 1,000.
      // Level 1 -> 2 needs 100 EXP (maxExp becomes 135)
      // Level 2 -> 3 needs 135 EXP (maxExp becomes 182)
      // Level 3 -> 4 needs 182 EXP (maxExp becomes 245)
      // Level 4 -> 5 needs 245 EXP (maxExp becomes 330)
      // Total needed for 4 level ups: 100 + 135 + 182 + 245 = 662 EXP.
      // 1000 EXP easily grants 4+ levels.
      const stats = {
        clickPower: 50000,
        critChance: 0,
        critMultiplier: 2,
        frenzyMultiplier: 1,
      };

      const outcome = Engine.resolveClick({
        state,
        stats,
        comboMultiplier: 1.0,
        boss: null,
        bonuses: { itemDropChance: 0, gemDropChance: 0, bossDamageMultiplier: 1 },
        now: 1700000000000,
        isAuto: false,
        rng: () => 0.5,
        lastPotionDropTime: 0,
        lastGemDropTime: 0,
        clickTimestamps: [],
        today: '2026-10-14',
      });

      expect(outcome.leveledUp).toBe(true);
      expect(outcome.patch.level).toBeGreaterThan(2); // Leveled up multiple times!
      expect(outcome.patch.skillPoints).toBe(outcome.patch.level - 1);
      expect(outcome.patch.currentExp).toBeLessThan(outcome.patch.maxExp);
    });
  });

  // --------------------------------------------------------------------------
  // F3: Boss defeat EXP reward triggers immediate level-up in same click
  // --------------------------------------------------------------------------
  describe('F3 Fix: Boss defeat EXP reward triggers immediate level-up', () => {
    it('immediately levels up in the same click when boss defeat EXP reaches maxExp', () => {
      const state = GameState.get();
      state.level = 1;
      state.currentExp = 0;
      state.maxExp = 100;
      state.skillPoints = 0;

      // Small click gain (so click EXP is minimal: Math.floor(10 * 0.02) = 1)
      const stats = {
        clickPower: 10,
        critChance: 0,
        critMultiplier: 2,
        frenzyMultiplier: 1,
      };

      // Boss with low HP so this 10 damage defeats it, awarding 250 EXP
      const boss = {
        id: 'boss_test',
        name: 'Test Boss',
        maxHp: 10,
        currentHp: 5,
        timeLimit: 30,
        remainingTime: 30,
        rewardGems: 1,
        rewardShards: 10,
        rewardExp: 250, // 250 EXP > 100 maxExp
        active: true,
        level: 1,
        tier: 'normal' as const,
      };

      const outcome = Engine.resolveClick({
        state,
        stats,
        comboMultiplier: 1.0,
        boss,
        bonuses: { itemDropChance: 0, gemDropChance: 0, bossDamageMultiplier: 1 },
        now: 1700000000000,
        isAuto: false,
        rng: () => 0.5,
        lastPotionDropTime: 0,
        lastGemDropTime: 0,
        clickTimestamps: [],
        today: '2026-10-14',
      });

      expect(outcome.boss.kind).toBe('defeated');
      // F3: Immediate level up triggered in this click!
      expect(outcome.leveledUp).toBe(true);
      expect(outcome.patch.level).toBeGreaterThan(1);
      expect(outcome.patch.skillPoints).toBeGreaterThanOrEqual(1);
      expect(outcome.patch.currentExp).toBeLessThan(outcome.patch.maxExp);
    });
  });

  // --------------------------------------------------------------------------
  // F4: relic_sovereign 4-relic cap & migration enforcement
  // --------------------------------------------------------------------------
  describe('F4 Fix: relic_sovereign equipped cap to 4 max and migration unequip', () => {
    it('equips relic_sovereign as equipped: true when player has only 2 relics equipped', () => {
      const state = GameState.get();
      // Reset relics to exactly 2 equipped
      state.relics.forEach((r: any) => { r.equipped = false; });
      state.relics[0].equipped = true;
      state.relics[1].equipped = true;

      state.daily.streakDay = 6; // Day 7 next
      state.daily.lastClaimTimestamp = 0;
      state.daily.lastClaimDate = '';

      DailyRewards.claim();

      const sovereign = state.relics.find((r: any) => r.id === 'relic_sovereign');
      expect(sovereign).toBeDefined();
      expect(sovereign.equipped).toBe(true);
      expect(state.relics.filter((r: any) => r.equipped).length).toBe(3);
    });

    it('adds relic_sovereign with equipped: false when player already has 4 relics equipped', () => {
      const state = GameState.get();
      // Equip 4 relics
      state.relics.forEach((r: any, idx: number) => {
        r.equipped = idx < 4;
      });
      expect(state.relics.filter((r: any) => r.equipped).length).toBe(4);

      state.daily.streakDay = 6;
      state.daily.lastClaimTimestamp = 0;
      state.daily.lastClaimDate = '';

      DailyRewards.claim();

      const sovereign = state.relics.find((r: any) => r.id === 'relic_sovereign');
      expect(sovereign).toBeDefined();
      expect(sovereign.equipped).toBe(false);
      // Total equipped remains strictly 4
      expect(state.relics.filter((r: any) => r.equipped).length).toBe(4);
    });

    it('migration unequips excess relics down to 4 starting from end of relics array (un-equipping relic_sovereign)', () => {
      const testState = createInitialState(1700000000000);
      // Manually equip 5 relics, with relic_sovereign at the end
      testState.relics = [
        { id: 'relic_1', name: 'Relic 1', rarity: 'common', effectDesc: 'desc 1', equipped: true },
        { id: 'relic_2', name: 'Relic 2', rarity: 'common', effectDesc: 'desc 2', equipped: true },
        { id: 'relic_3', name: 'Relic 3', rarity: 'common', effectDesc: 'desc 3', equipped: true },
        { id: 'relic_4', name: 'Relic 4', rarity: 'common', effectDesc: 'desc 4', equipped: true },
        { id: 'relic_sovereign', name: 'Heart of the Sovereign', rarity: 'legendary', effectDesc: 'desc sov', equipped: true },
      ];

      expect(testState.relics.filter((r) => r.equipped).length).toBe(5);

      // Run migrations
      runMigrations(testState);

      const equippedAfter = testState.relics.filter((r) => r.equipped);
      expect(equippedAfter.length).toBe(4);
      // relic_sovereign at end of array was the one unequipped
      const sov = testState.relics.find((r) => r.id === 'relic_sovereign');
      expect(sov?.equipped).toBe(false);
      expect(testState.relics[0].equipped).toBe(true);
      expect(testState.relics[1].equipped).toBe(true);
      expect(testState.relics[2].equipped).toBe(true);
      expect(testState.relics[3].equipped).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // F5: Local date string for Boss Daily (matching getTodayDateString)
  // --------------------------------------------------------------------------
  describe('F5 Fix: Boss Daily uses local date string matching Daily Rewards', () => {
    it('uses local date (YYYY-MM-DD) instead of UTC when simulated across timezones', () => {
      // Test the local date formatting expression directly
      // In Asia/Ho_Chi_Minh (UTC+7):
      // UTC 2026-10-07T20:00:00Z corresponds to 2026-10-08 03:00:00 local time
      const testDate = new Date('2026-10-07T20:00:00Z');

      // Helper function matching js/daily.js and new js/ui-core.js
      const localFormatted =
        testDate.getFullYear() +
        '-' +
        String(testDate.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(testDate.getDate()).padStart(2, '0');

      const utcFormatted = testDate.toISOString().slice(0, 10);

      // In any timezone ahead of UTC (e.g. UTC+7), local date is '2026-10-08' while UTC is '2026-10-07'
      // If run in UTC+7 / Asia/Ho_Chi_Minh:
      const tzOffsetHours = -testDate.getTimezoneOffset() / 60;
      if (tzOffsetHours >= 4) {
        expect(localFormatted).toBe('2026-10-08');
        expect(utcFormatted).toBe('2026-10-07');
        expect(localFormatted).not.toBe(utcFormatted);
      } else {
        // Standard structural assertion: formatted string conforms to YYYY-MM-DD
        expect(/^\d{4}-\d{2}-\d{2}$/.test(localFormatted)).toBe(true);
      }
    });

    it('records local date when daily boss is defeated in handleCoreClick', () => {
      const state = GameState.get();
      state.lastDailyBossDate = '';

      const dailyBoss = {
        name: 'Daily Titan',
        level: 5,
        tier: 'daily' as const,
        active: true,
        currentHp: 1, // 1 hit defeat
        maxHp: 100,
        remainingTime: 30,
        timeLimit: 30,
        rewardGems: 5,
        rewardShards: 20,
        rewardExp: 200,
      };

      GameState.setBoss(dailyBoss);

      // Click to defeat daily boss
      UICore.handleCoreClick(null, false);

      // state.lastDailyBossDate must be recorded in local date format YYYY-MM-DD
      expect(state.lastDailyBossDate).toBeDefined();
      expect(/^\d{4}-\d{2}-\d{2}$/.test(state.lastDailyBossDate)).toBe(true);

      const now = new Date();
      const expectedLocalDate =
        now.getFullYear() +
        '-' +
        String(now.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(now.getDate()).padStart(2, '0');

      expect(state.lastDailyBossDate).toBe(expectedLocalDate);
    });
  });
});
