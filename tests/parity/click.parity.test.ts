import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { Engine } from '../../src/engine/api';
import { computeStats } from '../../src/engine/stats';
import { advanceCombo } from '../../src/engine/combo';
import { pickPotionDrop } from '../../src/engine/drops';
import { spawnBoss, bossMaxHp } from '../../src/engine/boss';
import {
  achievementBuffPercent,
  itemDropChance,
  gemDropChance,
  bossDamageMultiplier,
} from '../../src/engine/bonusRules';
import { createInitialState } from '../../src/engine/state/initialState';
import { setupLegacyDom } from '../helpers/loadLegacy';

const LEGACY_UI_CORE = fs.readFileSync(
  path.resolve(process.cwd(), 'tests/fixtures/legacy/ui-core.js'),
  'utf8'
);

// Mulberry32 deterministic seeded PRNG
function createRng(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface SandboxEnvironment {
  state: any;
  boss: any;
  UICore: any;
  toastCalls: { msg: string; type: string }[];
  soundCalls: string[];
  cosmicEventsCalls: { event: string; val: number }[];
}

function createSandbox(code: string, initialState: any, initialBoss: any): SandboxEnvironment {
  const toastCalls: { msg: string; type: string }[] = [];
  const soundCalls: string[] = [];
  const cosmicEventsCalls: { event: string; val: number }[] = [];

  const stateClone = JSON.parse(JSON.stringify(initialState));
  let currentBoss = initialBoss ? JSON.parse(JSON.stringify(initialBoss)) : null;

  const sandbox: any = {
    GameState: {
      get: () => stateClone,
      getBoss: () => currentBoss,
      setBoss: (b: any) => {
        currentBoss = b;
      },
      getPotionMetadata: () => [
        { id: 'potion_x2', nameVi: 'Thuốc Năng Lượng x2', nameEn: 'Essence Potion x2' },
        { id: 'potion_x5', nameVi: 'Thuốc Năng Lượng x5', nameEn: 'Essence Potion x5' },
        { id: 'potion_x10', nameVi: 'Thuốc Năng Lượng x10', nameEn: 'Essence Potion x10' },
      ],
    },
    Bonuses: {
      getItemDropChance: () => itemDropChance(stateClone),
      getGemDropChance: () => gemDropChance(stateClone),
      getBossDamageMultiplier: () => bossDamageMultiplier(stateClone),
      getAchievementBuffPercent: () => achievementBuffPercent(stateClone),
    },
    Numeric: {
      format: (n: number) => String(Math.floor(n)),
    },
    Toast: {
      show: (msg: string, type: string) => {
        toastCalls.push({ msg, type });
      },
    },
    Sound: {
      playClick: () => soundCalls.push('playClick'),
      playCrit: () => soundCalls.push('playCrit'),
      playLevelUp: () => soundCalls.push('playLevelUp'),
      playBossHit: () => soundCalls.push('playBossHit'),
      playBossDefeat: () => soundCalls.push('playBossDefeat'),
      playAchievement: () => soundCalls.push('playAchievement'),
      playError: () => soundCalls.push('playError'),
      playCoin: () => soundCalls.push('playCoin'),
      playWarp: () => soundCalls.push('playWarp'),
      playSkill: () => soundCalls.push('playSkill'),
    },
    CosmicEvents: {
      track: (event: string, val: number) => {
        cosmicEventsCalls.push({ event, val });
      },
    },
    Engine: {
      computeStats,
      advanceCombo,
      pickPotionDrop,
      spawnBoss,
      resolveClick: Engine.resolveClick,
    },
    I18n: {
      getLang: () => 'vi',
    },
    Date: Date,
    setTimeout: (fn: any) => 0,
    clearTimeout: () => {},
    setInterval: () => 0,
    clearInterval: () => {},
    console: { log: () => {}, warn: () => {}, error: () => {} },
  };
  sandbox.window = sandbox;
  sandbox.global = sandbox;

  const runner = new Function('global', 'window', 'document', code);
  runner(sandbox, sandbox, document);

  return {
    get state() {
      return stateClone;
    },
    get boss() {
      return currentBoss;
    },
    get UICore() {
      return sandbox.UICore;
    },
    toastCalls,
    soundCalls,
    cosmicEventsCalls,
  };
}

describe('T-CLICK Parity: Legacy ui-core vs Wired UICore (Engine.resolveClick) across 400 Seeded Sequences', () => {
  it(
    'matches exactly across at least 400 seeded click sequences (1 to 60 clicks each)',
    () => {
      setupLegacyDom();
      // Freshly read CURRENT_UI_CORE to ensure latest wired code is tested
      const currentUiCoreCode = fs.readFileSync(
        path.resolve(process.cwd(), 'js/ui-core.js'),
        'utf8'
      );

      const rng = createRng(0x5ca_11c);
      const today = new Date().toISOString().slice(0, 10);

      const boundaryPool = [
        0.0,
        0.0009,
        0.001,
        0.0011,
        0.0029,
        0.003,
        0.0031,
        0.0499,
        0.05,
        0.0501,
        0.199,
        0.2,
        0.201,
        0.8499,
        0.85,
        0.9699,
        0.97,
        0.9999,
      ];

      let currentSimNow = 0;
      let mockRandomHandler: () => number = () => 0.5;

      const dateSpy = vi.spyOn(Date, 'now').mockImplementation(() => currentSimNow);
      const mathSpy = vi.spyOn(Math, 'random').mockImplementation(() => mockRandomHandler());

      try {
        for (let seq = 0; seq < 400; seq++) {
          const numClicks = 1 + Math.floor(rng() * 60);
          const baseNow = 1718000000000 + seq * 100000;

          // 1. Initial State Generation
          const baseState: any = createInitialState(baseNow);
          baseState.essence = rng() < 0.2 ? 0 : Math.floor(rng() * 1e8);
          baseState.totalEssence = baseState.essence + (rng() < 0.2 ? 0 : Math.floor(rng() * 1e8));
          baseState.totalClicks = Math.floor(rng() * 1000);
          baseState.currentExp = Math.floor(rng() * 50);
          baseState.maxExp = 100 + Math.floor(rng() * 300);
          baseState.level = 1 + Math.floor(rng() * 20);
          baseState.skillPoints = Math.floor(rng() * 5);
          baseState.astralGems = Math.floor(rng() * 50);
          baseState.astralShards = Math.floor(rng() * 100);
          baseState.totalAstralShards = baseState.astralShards + Math.floor(rng() * 200);
          baseState.bossesDefeated = Math.floor(rng() * 30);
          baseState.dailyBossesDefeated = Math.floor(rng() * 3);
          baseState.lastDailyBossDate = rng() < 0.5 ? today : '2026-10-10';

          // Skills toggle (crit_collapse & crit_chain)
          const collapseSkill = baseState.skills.find((s: any) => s.id === 'crit_collapse');
          if (collapseSkill) collapseSkill.unlocked = rng() < 0.5;
          const chainSkill = baseState.skills.find((s: any) => s.id === 'crit_chain');
          if (chainSkill) chainSkill.unlocked = rng() < 0.5;

          // Records toggle (present vs undefined)
          if (rng() < 0.15) {
            delete baseState.records;
          } else {
            baseState.records = {
              maxClicksIn10s: Math.floor(rng() * 15),
              highestClick: Math.floor(rng() * 500),
              highestCps: Math.floor(rng() * 200),
            };
          }

          // Potions inventory
          baseState.potions = {
            potion_x2: Math.floor(rng() * 5),
            potion_x5: Math.floor(rng() * 5),
            potion_x10: Math.floor(rng() * 5),
          };

          // 2. Boss Generation
          let initialBoss: any = null;
          if (rng() > 0.2) {
            const bossLvl = 1 + Math.floor(rng() * 25);
            const tiers = ['normal', 'rare', 'daily'];
            const bossTier = tiers[Math.floor(rng() * 3)];
            const isMilestone = bossLvl % 10 === 0;
            const maxHp = bossMaxHp(bossLvl, bossTier, isMilestone);
            const currentHp = rng() < 0.4 ? 1 : Math.floor(rng() * maxHp);
            initialBoss = {
              id: `boss_${bossLvl}_${baseNow}`,
              name: `Titan Lv.${bossLvl}`,
              title: 'Conqueror',
              maxHp,
              currentHp,
              timeLimit: 30,
              remainingTime: 30,
              rewardGems: 2,
              rewardShards: 25,
              rewardExp: 250,
              active: rng() < 0.75,
              level: bossLvl,
              tier: bossTier,
              isMilestone,
            };
          }

          // 3. Pre-generate deterministic random stream and timestamps
          const rollsPerClick = 10;
          const totalRollsNeeded = numClicks * rollsPerClick;
          const randomStream: number[] = [];
          for (let r = 0; r < totalRollsNeeded; r++) {
            if (rng() < 0.25) {
              randomStream.push(boundaryPool[Math.floor(rng() * boundaryPool.length)]);
            } else {
              randomStream.push(rng());
            }
          }

          // Create two clean sandbox environments
          const legacyEnv = createSandbox(LEGACY_UI_CORE, baseState, initialBoss);
          const currentEnv = createSandbox(currentUiCoreCode, baseState, initialBoss);

          currentSimNow = baseNow;

          for (let c = 0; c < numClicks; c++) {
            const timeRoll = rng();
            let dt = Math.floor(rng() * 500);
            if (timeRoll < 0.1) dt = 65000; // Trigger potion drop cooldown (60s)
            else if (timeRoll < 0.2) dt = 95000; // Trigger gem drop cooldown (90s)
            else if (timeRoll < 0.25) dt = 0; // Rapid burst

            currentSimNow += dt;
            const isAuto = rng() < 0.35;

            // Shared random pool for this specific click
            const clickRandomConsumedLegacy: number[] = [];
            const clickRandomConsumedCurrent: number[] = [];
            let rollCursor = 0;

            // 1. Run Legacy handleCoreClick
            mockRandomHandler = () => {
              const val = randomStream[rollCursor++] ?? 0.5;
              clickRandomConsumedLegacy.push(val);
              return val;
            };

            legacyEnv.UICore.handleCoreClick(null, isAuto);

            // 2. Run Current handleCoreClick with identical random stream consumed
            let replayCursor = 0;
            mockRandomHandler = () => {
              const val = clickRandomConsumedLegacy[replayCursor++] ?? 0.5;
              clickRandomConsumedCurrent.push(val);
              return val;
            };

            currentEnv.UICore.handleCoreClick(null, isAuto);

            // 4. Assert Exact Parity After Every Single Click

            // A. RNG calls count & consumed values
            expect(clickRandomConsumedCurrent.length).toBe(clickRandomConsumedLegacy.length);
            expect(clickRandomConsumedCurrent).toEqual(clickRandomConsumedLegacy);

            // B. Numeric fields (exact bitwise Object.is matching)
            expect(Object.is(currentEnv.state.essence, legacyEnv.state.essence)).toBe(true);
            expect(Object.is(currentEnv.state.totalEssence, legacyEnv.state.totalEssence)).toBe(true);
            expect(Object.is(currentEnv.state.totalClicks, legacyEnv.state.totalClicks)).toBe(true);

            // Intentional adjustment for F1 (totalCrits counter fix):
            // current tracks totalCrits, legacy kept it permanently at 0.
            if (currentEnv.state.totalCrits !== undefined) {
              expect(currentEnv.state.totalCrits).toBeGreaterThanOrEqual(0);
            }

            // Intentional adjustment for F2 (multi-level up) & F3 (boss exp level up):
            // Normalize legacyEnv EXP progression to reflect intentional while loop and boss reward EXP
            let legLoops = 0;
            while (legacyEnv.state.currentExp >= legacyEnv.state.maxExp && legLoops < 1000) {
              legacyEnv.state.level++;
              legacyEnv.state.currentExp = legacyEnv.state.currentExp - legacyEnv.state.maxExp;
              legacyEnv.state.maxExp = Math.floor(legacyEnv.state.maxExp * 1.35);
              legacyEnv.state.skillPoints++;
              legLoops++;
            }

            expect(Object.is(currentEnv.state.currentExp, legacyEnv.state.currentExp)).toBe(true);
            expect(Object.is(currentEnv.state.maxExp, legacyEnv.state.maxExp)).toBe(true);
            expect(Object.is(currentEnv.state.level, legacyEnv.state.level)).toBe(true);
            expect(Object.is(currentEnv.state.skillPoints, legacyEnv.state.skillPoints)).toBe(true);
            expect(Object.is(currentEnv.state.astralGems, legacyEnv.state.astralGems)).toBe(true);
            expect(Object.is(currentEnv.state.astralShards, legacyEnv.state.astralShards)).toBe(true);
            expect(Object.is(currentEnv.state.totalAstralShards, legacyEnv.state.totalAstralShards)).toBe(true);
            expect(Object.is(currentEnv.state.bossesDefeated, legacyEnv.state.bossesDefeated)).toBe(true);

            if (legacyEnv.state.dailyBossesDefeated !== undefined) {
              expect(currentEnv.state.dailyBossesDefeated).toBe(legacyEnv.state.dailyBossesDefeated);
            }
            if (legacyEnv.state.lastDailyBossDate !== undefined) {
              expect(typeof currentEnv.state.lastDailyBossDate).toBe('string');
            }

            // C. Records parity
            if (legacyEnv.state.records) {
              expect(currentEnv.state.records).toBeDefined();
              expect(currentEnv.state.records.maxClicksIn10s).toBe(legacyEnv.state.records.maxClicksIn10s);
              expect(Object.is(currentEnv.state.records.highestClick, legacyEnv.state.records.highestClick)).toBe(true);
            }

            // D. Potions inventory parity
            expect(currentEnv.state.potions).toEqual(legacyEnv.state.potions);

            // E. Boss combat state parity
            if (legacyEnv.boss) {
              expect(currentEnv.boss).toBeDefined();
              expect(currentEnv.boss.active).toBe(legacyEnv.boss.active);
              expect(Object.is(currentEnv.boss.currentHp, legacyEnv.boss.currentHp)).toBe(true);
              expect(currentEnv.boss.level).toBe(legacyEnv.boss.level);
              expect(currentEnv.boss.tier).toBe(legacyEnv.boss.tier);
            }

            // F. Effect logs parity (sound & toast calls allow level up notifications from F3 boss exp level up)
            expect(
              currentEnv.toastCalls.filter((t: any) => !t.msg.includes('THĂNG CẤP'))
            ).toEqual(
              legacyEnv.toastCalls.filter((t: any) => !t.msg.includes('THĂNG CẤP'))
            );
            expect(currentEnv.soundCalls.filter((s: string) => s !== 'playLevelUp')).toEqual(
              legacyEnv.soundCalls.filter((s: string) => s !== 'playLevelUp')
            );
            expect(currentEnv.cosmicEventsCalls).toEqual(legacyEnv.cosmicEventsCalls);
          }
        }
      } finally {
        dateSpy.mockRestore();
        mathSpy.mockRestore();
      }
    },
    60000
  );
});
