import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { Numeric as TsNumeric } from '../../src/core/numeric';

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function loadLegacyNumeric() {
  const filePath = path.resolve(process.cwd(), 'tests/fixtures/legacy/numeric.js');
  const code = fs.readFileSync(filePath, 'utf8');
  const scope: any = {};
  const fn = new Function('window', 'global', code);
  fn(scope, scope);
  return scope.Numeric;
}

describe('Differential Parity Tests: Numeric (Legacy vs TypeScript)', () => {
  const legacyNumeric = loadLegacyNumeric();

  it('matches exactly on special corner cases for format()', () => {
    const cornerCases = [
      0,
      -0,
      1,
      -1,
      0.001,
      0.5,
      -0.5,
      999,
      999.4,
      999.9,
      1000,
      1000.5,
      1001,
      1500,
      10500,
      999999,
      1000000,
      1e6,
      1e9,
      1e12,
      1e15,
      1e30,
      1e100,
      1e300,
      1e308,
      NaN,
      Infinity,
      -Infinity,
      null as any,
      undefined as any,
    ];

    cornerCases.forEach((val) => {
      // Test without scientific
      const legRes = legacyNumeric.format(val, false);
      const tsRes = TsNumeric.format(val, false);
      expect(tsRes, `Mismatch for format(${String(val)}, false)`).toBe(legRes);

      // Test with scientific
      const legResSci = legacyNumeric.format(val, true);
      const tsResSci = TsNumeric.format(val, true);
      expect(tsResSci, `Mismatch for format(${String(val)}, true)`).toBe(legResSci);
    });
  });

  it('matches exactly on >= 2500 seeded pseudo-random inputs for format()', () => {
    const rng = mulberry32(1337);
    const count = 2500;

    for (let i = 0; i < count; i++) {
      // Generate diverse ranges: small, normal, huge, negative, fraction
      const sign = rng() < 0.2 ? -1 : 1;
      const exp = Math.floor(rng() * 320) - 5; // 10^-5 to 10^315
      const mantissa = rng() * 10;
      const num = sign * mantissa * Math.pow(10, exp);
      const useSci = rng() < 0.3;

      const legacyVal = legacyNumeric.format(num, useSci);
      const tsVal = TsNumeric.format(num, useSci);

      expect(tsVal, `Random input iteration ${i} with val=${num}, useSci=${useSci}`).toBe(legacyVal);
    }
  });

  it('matches exactly on 500 seeded inputs for calculateBatchCost()', () => {
    const rng = mulberry32(4242);
    for (let i = 0; i < 500; i++) {
      const baseCost = Math.floor(rng() * 100000) + 1;
      const multiplier = 1.05 + rng() * 1.5;
      const currentLevel = Math.floor(rng() * 100);
      const count = Math.floor(rng() * 50) + 1;

      const leg = legacyNumeric.calculateBatchCost(baseCost, multiplier, currentLevel, count);
      const ts = TsNumeric.calculateBatchCost(baseCost, multiplier, currentLevel, count);
      expect(ts, `calculateBatchCost mismatch at i=${i}`).toBe(leg);
    }
  });

  it('matches exactly on 500 seeded inputs for calculateMaxPurchasable()', () => {
    const rng = mulberry32(7777);
    for (let i = 0; i < 500; i++) {
      const baseCost = Math.floor(rng() * 1000) + 1;
      const multiplier = 1.05 + rng() * 0.5;
      const currentLevel = Math.floor(rng() * 50);
      const availableEssence = Math.floor(rng() * 1000000000);

      const leg = legacyNumeric.calculateMaxPurchasable(baseCost, multiplier, currentLevel, availableEssence);
      const ts = TsNumeric.calculateMaxPurchasable(baseCost, multiplier, currentLevel, availableEssence);
      expect(ts, `calculateMaxPurchasable mismatch at i=${i}`).toEqual(leg);
    }
  });

  it('matches exactly on 500 seeded inputs for formatDuration()', () => {
    const rng = mulberry32(9999);
    // Special cases
    [-10, 0, 0.5, 59, 60, 61, 3599, 3600, 3661].forEach((sec) => {
      expect(TsNumeric.formatDuration(sec)).toBe(legacyNumeric.formatDuration(sec));
    });

    for (let i = 0; i < 500; i++) {
      const sec = rng() * 100000 - 100;
      const leg = legacyNumeric.formatDuration(sec);
      const ts = TsNumeric.formatDuration(sec);
      expect(ts, `formatDuration mismatch at sec=${sec}`).toBe(leg);
    }
  });
});
