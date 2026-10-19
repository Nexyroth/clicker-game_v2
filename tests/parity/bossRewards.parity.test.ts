import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { Engine } from '../../src/engine/api';
import { createInitialState } from '../../src/engine/state/initialState';

const legacyUiCoreCode = fs.readFileSync(
  path.resolve(process.cwd(), 'tests/fixtures/legacy/ui-core.js'),
  'utf8'
);

describe('T-BOSS-REWARDS Parity: Legacy handleCoreClick defeat vs Engine.bossDefeatRewards', () => {
  const FIXED_NOW = 1718000000000;
  const FIXED_DATE = new Date(FIXED_NOW);
  const todayStr = FIXED_DATE.toISOString().slice(0, 10);

  let sandbox: any;
  let currentState: any;
  let currentBoss: any;

  function setupLegacySandbox() {
    currentState = createInitialState(FIXED_NOW);
    currentBoss = null;

    sandbox = {
      GameState: {
        get: () => currentState,
        set: (s: any) => {
          currentState = s;
        },
        getBoss: () => currentBoss,
        setBoss: (b: any) => {
          currentBoss = b;
        },
      },
      Bonuses: {
        getAchievementBuffPercent: () => 0,
        getBossDamageMultiplier: () => 1.0,
        getItemDropChance: () => 0,
        getGemDropChance: () => 0,
      },
      Numeric: {
        format: (n: number) => String(Math.floor(n)),
      },
      Sound: {
        playClick: () => {},
        playCrit: () => {},
        playBossHit: () => {},
        playBossDefeat: () => {},
        playLevelUp: () => {},
      },
      Toast: {
        show: () => {},
      },
      CosmicEvents: {
        track: () => {},
      },
      I18n: {
        getLang: () => 'vi',
      },
      console: { log: () => {}, warn: () => {}, error: () => {} },
    };
    sandbox.window = sandbox;
    sandbox.global = sandbox;

    const runner = new Function('global', 'window', 'document', legacyUiCoreCode);
    runner(sandbox, sandbox, document);
  }

  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(FIXED_NOW);
    vi.spyOn(globalThis, 'Date').mockImplementation(function (...args: any[]) {
      if (args.length === 0) return FIXED_DATE;
      return new (Function.prototype.bind.apply(Date, [null, ...args] as any))();
    } as any);

    // Mock Math.random so it never crits and never drops items
    vi.spyOn(Math, 'random').mockReturnValue(0.999);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const TIERS = ['normal', 'rare', 'daily'] as const;

  for (const tier of TIERS) {
    for (let level = 1; level <= 40; level++) {
      const isMilestone = level % 10 === 0;

      it(`matches rewards for tier=${tier}, level=${level}, isMilestone=${isMilestone}`, () => {
        // 1. Run baseline without boss to isolate baseline click gains
        setupLegacySandbox();
        currentBoss = null;
        sandbox.UICore.handleCoreClick(null, true);
        const baselineGems = currentState.astralGems;
        const baselineShards = currentState.astralShards;
        const baselineExp = currentState.currentExp;
        const baselineBossesDefeated = currentState.bossesDefeated;
        const baselineDailyBossesDefeated = currentState.dailyBossesDefeated || 0;

        // 2. Run with boss active and tiny HP (0.001) so next click defeats boss
        setupLegacySandbox();
        const base = Engine.bossRewardBase(level);
        const label = Engine.bossLabel(level, tier, isMilestone);
        const maxHp = Engine.bossMaxHp(level, tier, isMilestone);
        const timeLimit = Engine.bossTimeLimit(level);

        currentBoss = {
          id: `boss_${level}_${FIXED_NOW}`,
          name: label.name,
          title: label.title,
          maxHp,
          currentHp: 0.0001, // Low HP to trigger defeat
          timeLimit,
          remainingTime: timeLimit,
          rewardGems: base.rewardGems,
          rewardShards: base.rewardShards,
          rewardExp: base.rewardExp,
          active: true,
          level,
          tier,
          isMilestone,
        };

        const bossCopy = { ...currentBoss };

        sandbox.UICore.handleCoreClick(null, true);

        // Calculate isolated delta from boss defeat
        const deltaGems = currentState.astralGems - baselineGems;
        const deltaShards = currentState.astralShards - baselineShards;
        const deltaExp = currentState.currentExp - baselineExp;
        const deltaBossesDefeated = currentState.bossesDefeated - baselineBossesDefeated;
        const deltaDailyBossesDefeated = (currentState.dailyBossesDefeated || 0) - baselineDailyBossesDefeated;

        // Pure calculation
        const expectedRewards = Engine.bossDefeatRewards(bossCopy);

        expect(deltaGems).toBe(expectedRewards.rewardGems);
        expect(deltaShards).toBe(expectedRewards.rewardShards);
        expect(deltaExp).toBe(expectedRewards.rewardExp);
        expect(deltaBossesDefeated).toBe(1);

        if (tier === 'daily') {
          expect(deltaDailyBossesDefeated).toBe(1);
          expect(currentState.lastDailyBossDate).toBe(todayStr);
          expect(expectedRewards.dailyDefeat).toBe(true);
        } else {
          expect(deltaDailyBossesDefeated).toBe(0);
          expect(expectedRewards.dailyDefeat).toBe(false);
        }
      });
    }
  }
});
