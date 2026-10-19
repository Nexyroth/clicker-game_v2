import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { extractFunctionSource, buildLegacyMainScope } from '../helpers/extractLegacyFunction';
import { Engine } from '../../src/engine/api';
import { createInitialState } from '../../src/engine/state/initialState';
import type { GameState } from '../../src/engine/types';

// Mulberry32 seeded PRNG
function mulberry32(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildCurrentMainScope(mockGlobal: any, mockDocument?: any) {
  const filePath = path.resolve(process.cwd(), 'js/main.js');
  const code = fs.readFileSync(filePath, 'utf8');

  const fnReset = extractFunctionSource(code, 'resetCatchUp');
  const fnTick = extractFunctionSource(code, 'gameTick');
  const fnAch = extractFunctionSource(code, 'updateAchievementsProgress');
  const fnOffline = extractFunctionSource(code, 'calculateOfflineProgress');

  const wrapperCode = `
    return (function(global, document, setTimeout) {
      let lastFrameAt = 0;
      let accumulatorMs = 0;
      let hiddenSince = (typeof document !== 'undefined' && document.hidden) ? Date.now() : null;
      let hiddenAccumMs = 0;

      if (typeof document !== 'undefined' && document.addEventListener) {
        document.addEventListener('visibilitychange', function () {
          if (document.hidden) {
            if (hiddenSince === null) {
              hiddenSince = Date.now();
            }
          } else {
            if (hiddenSince !== null) {
              hiddenAccumMs += Math.max(0, Date.now() - hiddenSince);
              hiddenSince = null;
            }
          }
        });
      }

      ${fnReset}
      ${fnTick}
      ${fnAch}
      ${fnOffline}

      return {
        resetCatchUp: resetCatchUp,
        gameTick: gameTick,
        updateAchievementsProgress: updateAchievementsProgress,
        calculateOfflineProgress: calculateOfflineProgress,
      };
    })(global, document, setTimeout);
  `;

  const factory = new Function('global', 'document', 'setTimeout', wrapperCode);
  return factory(mockGlobal, mockDocument, (fn: Function, ms: number) => setTimeout(fn, ms));
}

function createMockEnvironment(state: GameState, boss: any) {
  let cooldowns: Record<string, number> = { strike: 15, meteor: 25 };
  const soundCalls: string[] = [];

  const mockGlobal: any = {
    GameState: {
      get: () => state,
      getBoss: () => boss,
      setBoss: (b: any) => {
        boss = b;
      },
      save: () => {},
    },
    UICore: {
      calculateStats: () => Engine.computeStats(state),
      isAutoClickerPaused: () => false,
      updateCooldowns: (dt: number) => {
        for (const k of Object.keys(cooldowns)) {
          cooldowns[k] = Math.max(0, cooldowns[k] - dt);
        }
      },
      updateStatsDisplay: () => {},
    },
    Bonuses: {
      getOfflineEfficiency: () => 0.50,
    },
    Engine: Engine,
    Sound: {
      playError: () => soundCalls.push('playError'),
    },
    Toast: {
      show: () => {},
    },
    DailyRewards: {
      updateBadge: () => {},
    },
    CosmicEvents: {
      updateBadge: () => {},
    },
    Numeric: {
      format: (n: number) => String(Math.floor(n)),
    },
    I18n: {
      getLang: () => 'vi',
    },
  };

  return { mockGlobal, cooldowns, soundCalls };
}

describe('Integration Tests: Catch-Up Shell (js/main.js gameTick vs Legacy)', () => {
  it('(i) Foreground equivalence: 250 seeded randomized states produce bit-for-bit identical results for gap=10000ms vs 100 legacy ticks', () => {
    const rng = mulberry32(133742);

    for (let i = 0; i < 250; i++) {
      const baseNow = 1700000000000 + i * 50000;
      const baseState = createInitialState(baseNow);

      // Randomize upgrades
      baseState.upgrades[0].level = Math.floor(rng() * 30);
      baseState.upgrades[1].level = Math.floor(rng() * 20);
      baseState.upgrades[2].level = Math.floor(rng() * 10);

      // Randomize active boosts
      if (rng() < 0.6) {
        baseState.activeBoosts = [
          {
            id: 'boost_frenzy',
            name: 'Frenzy',
            multiplier: 2,
            remainingSeconds: parseFloat((rng() * 12 + 0.5).toFixed(1)), // some will expire within 10s
          },
        ];
      }

      // Randomize active potions
      baseState.activePotions = {
        potion_x2: parseFloat((rng() * 15 + 1.0).toFixed(1)),
        auto_50ms: parseFloat((rng() * 15 + 1.0).toFixed(1)),
      };

      // Randomize active boss
      let initialBoss: any = null;
      if (rng() < 0.7) {
        initialBoss = {
          name: 'Void Titan',
          level: Math.floor(rng() * 5) + 1,
          tier: 'normal',
          active: true,
          currentHp: 100000,
          maxHp: 100000,
          remainingTime: parseFloat((rng() * 15 + 2.0).toFixed(1)), // some will expire within 10s
          timeLimit: 30,
        };
      }

      const legacyState: GameState = JSON.parse(JSON.stringify(baseState));
      const legacyBoss = initialBoss ? JSON.parse(JSON.stringify(initialBoss)) : null;
      const { mockGlobal: legGlobal, cooldowns: legCooldowns } = createMockEnvironment(legacyState, legacyBoss);
      const legScope = buildLegacyMainScope(legGlobal);

      const currentState: GameState = JSON.parse(JSON.stringify(baseState));
      const currentBoss = initialBoss ? JSON.parse(JSON.stringify(initialBoss)) : null;
      const { mockGlobal: curGlobal, cooldowns: curCooldowns } = createMockEnvironment(currentState, currentBoss);
      const curDocument = { hidden: false, addEventListener: vi.fn() };
      const curScope = buildCurrentMainScope(curGlobal, curDocument);

      // 1. Run Legacy: 100 consecutive 100ms gameTick calls
      for (let t = 0; t < 100; t++) {
        legScope.gameTick();
      }

      // 2. Run Current: initial baseline frame anchor at baseNow, then jump 10,000ms
      let simNow = baseNow;
      const dateSpy = vi.spyOn(Date, 'now').mockImplementation(() => simNow);

      try {
        curScope.resetCatchUp(baseNow);

        // Advance 10,000ms
        simNow += 10000;
        curScope.gameTick(); // triggers exactly 100-step catchup
      } finally {
        dateSpy.mockRestore();
      }

      // 3. Bit-for-bit exact parity assertions
      expect(Object.is(currentState.essence, legacyState.essence)).toBe(true);
      expect(Object.is(currentState.totalEssence, legacyState.totalEssence)).toBe(true);
      expect(currentState.activeBoosts).toEqual(legacyState.activeBoosts);
      expect(currentState.activePotions).toEqual(legacyState.activePotions);

      if (legacyBoss) {
        expect(currentBoss).not.toBeNull();
        expect(Object.is(currentBoss.remainingTime, legacyBoss.remainingTime)).toBe(true);
        expect(currentBoss.active).toBe(legacyBoss.active);
      }

      for (const k of Object.keys(legCooldowns)) {
        expect(curCooldowns[k]).toBeCloseTo(legCooldowns[k], 4);
      }
    }
  });

  it('(ii) Partially hidden: boss and auto_50ms pause during hidden portion, boosts countdown, essence gains 100%', () => {
    const baseNow = 1700000000000;
    const baseState = createInitialState(baseNow);
    baseState.upgrades[0].level = 10;
    baseState.upgrades[1].level = 10;

    baseState.activeBoosts = [
      { id: 'frenzy', name: 'Frenzy', multiplier: 2, remainingSeconds: 20 },
    ];
    baseState.activePotions = {
      potion_x2: 20,
      auto_50ms: 20,
    };

    const boss = {
      name: 'Chronos',
      level: 2,
      tier: 'normal',
      active: true,
      currentHp: 50000,
      maxHp: 50000,
      remainingTime: 25.0,
      timeLimit: 30,
    };

    const { mockGlobal } = createMockEnvironment(baseState, boss);
    let isHidden = false;
    let visibilityCallback: Function | null = null;
    const mockDocument = {
      get hidden() {
        return isHidden;
      },
      addEventListener: vi.fn((event, cb) => {
        if (event === 'visibilitychange') visibilityCallback = cb;
      }),
    };

    const scope = buildCurrentMainScope(mockGlobal, mockDocument);

    let simNow = baseNow;
    const dateSpy = vi.spyOn(Date, 'now').mockImplementation(() => simNow);

    try {
      scope.resetCatchUp(baseNow);

      // Tab goes hidden at t=0
      isHidden = true;
      if (visibilityCallback) visibilityCallback();

      // Tab remains hidden for 4,000ms
      simNow += 4000;

      // Tab becomes visible again at t=4000
      isHidden = false;
      if (visibilityCallback) visibilityCallback();

      // Frame runs at t=10,000ms (so gap = 10000ms: 4000ms hidden, 6000ms visible)
      simNow += 6000;
      scope.gameTick();

      // Assertions:
      // Total 100 steps (10.0s). 40 steps hidden, 60 steps visible.
      // 1. Boss timer should ONLY decrease during visible portion: 25.0 - 6.0 = 19.0s
      expect(boss.remainingTime).toBeCloseTo(19.0, 4);

      // 2. auto_50ms should ONLY decrease during visible portion: 20.0 - 6.0 = 14.0s
      expect(baseState.activePotions.auto_50ms).toBeCloseTo(14.0, 4);

      // 3. potion_x2 and activeBoosts countdown continuously across all 10s: 20.0 - 10.0 = 10.0s
      expect(baseState.activePotions.potion_x2).toBeCloseTo(10.0, 4);
      expect(baseState.activeBoosts[0].remainingSeconds).toBeCloseTo(10.0, 4);

      // 4. Essence gain was generated for all 100 steps
      expect(baseState.essence).toBeGreaterThan(0);
    } finally {
      dateSpy.mockRestore();
    }
  });

  it('(iii) Mode offline: gap 300,000ms (> 120s) awards offlineGain; buffs and boss are not decremented', () => {
    const baseNow = 1700000000000;
    const baseState = createInitialState(baseNow);
    baseState.upgrades[0].level = 10; // active CPS (void_siphon)

    baseState.activeBoosts = [
      { id: 'frenzy', name: 'Frenzy', multiplier: 2, remainingSeconds: 20 },
    ];
    baseState.activePotions = {
      potion_x2: 20,
      auto_50ms: 20,
    };

    const boss = {
      name: 'Chronos',
      level: 2,
      tier: 'normal',
      active: true,
      currentHp: 50000,
      maxHp: 50000,
      remainingTime: 25.0,
      timeLimit: 30,
    };

    const { mockGlobal } = createMockEnvironment(baseState, boss);
    const mockDocument = { hidden: false, addEventListener: vi.fn() };
    const scope = buildCurrentMainScope(mockGlobal, mockDocument);

    let simNow = baseNow;
    const dateSpy = vi.spyOn(Date, 'now').mockImplementation(() => simNow);

    try {
      scope.resetCatchUp(baseNow);

      const initialEssence = baseState.essence;
      const stats = Engine.computeStats(baseState);
      const expectedOffline = Engine.offlineGain({
        lastSaveTime: baseNow,
        now: baseNow + 300000,
        cps: stats.cps,
        efficiency: 0.50,
      });

      // Jump 300,000ms (5 minutes)
      simNow += 300000;
      scope.gameTick();

      // Essence increased exactly by offlineGain
      expect(expectedOffline).not.toBeNull();
      expect(baseState.essence - initialEssence).toBeCloseTo(expectedOffline!.gain, 4);
      expect(baseState.lastOfflineGain).toBeCloseTo(expectedOffline!.gain, 4);

      // Active buffs and potions NOT decremented in offline mode
      expect(baseState.activeBoosts[0].remainingSeconds).toBe(20);
      expect(baseState.activePotions.potion_x2).toBe(20);
      expect(baseState.activePotions.auto_50ms).toBe(20);

      // Boss timer NOT decremented in offline mode
      expect(boss.remainingTime).toBe(25.0);
    } finally {
      dateSpy.mockRestore();
    }
  });
});
