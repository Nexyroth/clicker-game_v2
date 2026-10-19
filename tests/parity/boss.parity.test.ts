import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { Engine } from '../../src/engine/api';
import { createInitialState } from '../../src/engine/state/initialState';

const LEGACY_CODE = fs.readFileSync(
  path.resolve(process.cwd(), 'tests/fixtures/legacy/ui-core.js'),
  'utf8'
);

describe('Boss Parity Tests: Legacy ui-core vs Engine.spawnBoss', () => {
  let sandbox: any;
  let currentState: any;
  let currentBoss: any;

  beforeEach(() => {
    currentState = createInitialState(1710000000000);
    currentBoss = null;

    sandbox = {
      GameState: {
        get: () => currentState,
        getBoss: () => currentBoss,
        setBoss: (b: any) => {
          currentBoss = b;
        },
      },
      Bonuses: {
        getAchievementBuffPercent: () => 0,
        getBossDamageMultiplier: () => 1.0,
      },
      Numeric: {
        format: (n: number) => String(Math.floor(n)),
      },
      console: { log: () => {}, warn: () => {}, error: () => {} },
    };
    sandbox.window = sandbox;
    sandbox.global = sandbox;

    const runner = new Function('global', 'window', 'document', LEGACY_CODE);
    runner(sandbox, sandbox, document);
  });

  const TEST_LEVELS = [
    1, 2, 3, 5, 9, 10, 11, 19, 20, 21, 29, 30, 31, 40, 50, 99, 100, 150, 200, 300,
    500, 1000, 1500, 2000, 5000,
  ];
  const TEST_ROLLS = [
    0,
    0.0299999,
    0.03,
    0.1499999,
    0.15,
    0.5,
    0.999999,
  ];

  it('matches exactly across grid of levels, rolls, and lastDailyBossDate matches', () => {
    const FIXED_NOW = 1718000000000;
    const FIXED_DATE = new Date(FIXED_NOW);
    const today = FIXED_DATE.toISOString().slice(0, 10);
    const yesterday = '2024-06-09';

    for (const level of TEST_LEVELS) {
      for (const roll of TEST_ROLLS) {
        for (const lastDate of [today, yesterday, undefined]) {
          currentState.lastDailyBossDate = lastDate;

          // Mock Date and Math.random for legacy call
          vi.spyOn(Date, 'now').mockReturnValue(FIXED_NOW);
          vi.spyOn(globalThis, 'Date').mockImplementation(function (...args: any[]) {
            if (args.length === 0) return FIXED_DATE;
            return new (Function.prototype.bind.apply(Date, [null, ...args] as any))();
          } as any);
          vi.spyOn(Math, 'random').mockReturnValue(roll);

          sandbox.UICore.spawnNextBoss(level);
          const legacyBoss = currentBoss;

          const pureBoss = Engine.spawnBoss({
            nextLevel: level,
            roll,
            today,
            lastDailyBossDate: lastDate,
            nowMs: FIXED_NOW,
          });

          // 1. toEqual
          expect(pureBoss).toEqual(legacyBoss);

          // 2. Exact key order via JSON.stringify
          expect(JSON.stringify(pureBoss)).toBe(JSON.stringify(legacyBoss));

          // 3. Object.is bit-exact float equality on each field
          for (const key of Object.keys(legacyBoss)) {
            const isIdentical = Object.is((pureBoss as any)[key], legacyBoss[key]);
            if (!isIdentical) {
              throw new Error(
                `Mismatch on key ${key} at level ${level}, roll ${roll}: pure=${(pureBoss as any)[key]}, legacy=${legacyBoss[key]}`
              );
            }
            expect(isIdentical).toBe(true);
          }

          vi.restoreAllMocks();
        }
      }
    }
  });

  it('matches summonBoss patch', () => {
    const boss = Engine.spawnBoss({
      nextLevel: 10,
      roll: 0.5,
      today: '2026-10-06',
      nowMs: 1718000000000,
    });

    const patch = Engine.summonBoss(boss);
    expect(patch).toEqual({
      active: true,
      currentHp: boss.maxHp,
      remainingTime: boss.timeLimit,
    });
  });
});
