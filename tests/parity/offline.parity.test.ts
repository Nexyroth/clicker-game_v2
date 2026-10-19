import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Engine } from '../../src/engine/api';
import { buildLegacyMainScope } from '../helpers/extractLegacyFunction';
import { Numeric } from '../../src/core/numeric';

describe('T-OFFLINE Parity: offlineGain vs Legacy calculateOfflineProgress', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('matches exactly across all elapsed times, cps, efficiency, and toast messages', () => {
    const fixedNow = 1718000000000;
    vi.setSystemTime(fixedNow);

    const testCases: Array<{
      desc: string;
      lastSaveTime: number | undefined;
      cps: number;
      efficiency: number;
      lang: 'vi' | 'en';
    }> = [
      { desc: 'undefined lastSaveTime', lastSaveTime: undefined, cps: 1000, efficiency: 0.5, lang: 'vi' },
      { desc: '0 lastSaveTime', lastSaveTime: 0, cps: 1000, efficiency: 0.5, lang: 'vi' },
      { desc: 'negative timestamp', lastSaveTime: -5000, cps: 1000, efficiency: 0.5, lang: 'vi' },
      { desc: 'future timestamp (negative elapsed clamped to 0)', lastSaveTime: fixedNow + 5000, cps: 1000, efficiency: 0.5, lang: 'vi' },
      { desc: 'elapsed 9.99s (<10s threshold)', lastSaveTime: fixedNow - 9990, cps: 5000, efficiency: 0.5, lang: 'vi' },
      { desc: 'elapsed exactly 10.0s', lastSaveTime: fixedNow - 10000, cps: 5000, efficiency: 0.5, lang: 'vi' },
      { desc: 'elapsed 10.001s', lastSaveTime: fixedNow - 10001, cps: 5000, efficiency: 0.5, lang: 'en' },
      { desc: 'cps = 0 (gain <= 0)', lastSaveTime: fixedNow - 100000, cps: 0, efficiency: 0.5, lang: 'vi' },
      { desc: 'efficiency = 0 (gain <= 0)', lastSaveTime: fixedNow - 100000, cps: 500, efficiency: 0, lang: 'en' },
      { desc: '1 hour offline (vi)', lastSaveTime: fixedNow - 3600 * 1000, cps: 12500, efficiency: 0.5, lang: 'vi' },
      { desc: '1 hour offline with 100% pass (en)', lastSaveTime: fixedNow - 3600 * 1000, cps: 12500, efficiency: 1.0, lang: 'en' },
      { desc: '1 day offline (vi)', lastSaveTime: fixedNow - 86400 * 1000, cps: 999999, efficiency: 0.75, lang: 'vi' },
      { desc: '1 year offline (en, huge cps)', lastSaveTime: fixedNow - 365 * 86400 * 1000, cps: 1e15, efficiency: 0.5, lang: 'en' },
    ];

    for (const tc of testCases) {
      vi.setSystemTime(fixedNow);

      // 1. Run legacy
      const legacyState = {
        lastSaveTime: tc.lastSaveTime,
        essence: 1000,
        totalEssence: 1000,
        lastOfflineGain: 0,
      };

      let legacyToastMsg = '';
      let legacyToastType = '';

      const legacyGlobal: any = {
        GameState: { get: () => legacyState },
        UICore: { calculateStats: () => ({ cps: tc.cps }) },
        Bonuses: { getOfflineEfficiency: () => tc.efficiency },
        Numeric: Numeric,
        I18n: { getLang: () => tc.lang },
        Toast: {
          show: (msg: string, type: string) => {
            legacyToastMsg = msg;
            legacyToastType = type;
          },
        },
      };

      const legacyScope = buildLegacyMainScope(legacyGlobal);
      legacyScope.calculateOfflineProgress();

      // 2. Run engine offlineGain directly
      const outcome = Engine.offlineGain({
        lastSaveTime: tc.lastSaveTime,
        now: Date.now(),
        cps: tc.cps,
        efficiency: tc.efficiency,
      });

      const engineState = {
        lastSaveTime: tc.lastSaveTime,
        essence: 1000,
        totalEssence: 1000,
        lastOfflineGain: 0,
      };

      let engineToastMsg = '';
      let engineToastType = '';

      if (outcome && outcome.gain > 0) {
        engineState.essence += outcome.gain;
        engineState.totalEssence += outcome.gain;
        engineState.lastOfflineGain = outcome.gain;

        setTimeout(() => {
          const formatted = Numeric.format(outcome.gain);
          const mins = Math.max(1, Math.floor(outcome.elapsedSeconds / 60));
          const effPct = Math.round(tc.efficiency * 100);
          const isVi = tc.lang === 'vi';
          const msg = isVi
            ? `💤 Chào mừng trở lại! Vắng mặt ${mins} phút thu thập +${formatted} Năng Lượng (Hiệu suất ngoại tuyến: ${effPct}%)`
            : `💤 Welcome back! Offline for ${mins} mins: +${formatted} Essence (Efficiency: ${effPct}%)`;
          engineToastMsg = msg;
          engineToastType = 'info';
        }, 600);
      }

      // Fast-forward fake timers by 600ms
      vi.advanceTimersByTime(600);

      // Compare states & outputs
      expect(engineState.essence, `essence mismatch in "${tc.desc}"`).toBe(legacyState.essence);
      expect(engineState.totalEssence, `totalEssence mismatch in "${tc.desc}"`).toBe(legacyState.totalEssence);
      expect(engineState.lastOfflineGain, `lastOfflineGain mismatch in "${tc.desc}"`).toBe(legacyState.lastOfflineGain);
      expect(engineToastMsg, `toast message mismatch in "${tc.desc}"`).toBe(legacyToastMsg);
      expect(engineToastType, `toast type mismatch in "${tc.desc}"`).toBe(legacyToastType);
    }
  });
});
