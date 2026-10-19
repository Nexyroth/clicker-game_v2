import { describe, it, expect } from 'vitest';
import { comboDecayStatus, COMBO_RESET_MS } from '../../src/engine/combo';

describe('Combo Decay Status Unit Tests', () => {
  it('correctly calculates remaining time, activeCps, and expiration', () => {
    const baseTime = 10000;
    const timestamps = [baseTime - 1200, baseTime - 600, baseTime - 100];

    // 1. Just after click (1000ms elapsed) -> 2000ms remaining, active
    const active = comboDecayStatus({
      lastClickTime: baseTime,
      now: baseTime + 1000,
      clickTimestamps: timestamps,
    });
    expect(active.expired).toBe(false);
    expect(active.remainingMs).toBe(2000);
    // inside 1500ms of (baseTime + 1000) are timestamps >= baseTime - 500: only baseTime - 100 -> 1 click
    expect(active.activeCps).toBe(Number((1 / 1.5).toFixed(1)));

    // 2. Exactly at COMBO_RESET_MS (3000ms elapsed) -> expired
    const expiredExact = comboDecayStatus({
      lastClickTime: baseTime,
      now: baseTime + COMBO_RESET_MS,
      clickTimestamps: timestamps,
    });
    expect(expiredExact.expired).toBe(true);
    expect(expiredExact.remainingMs).toBe(0);
    expect(expiredExact.activeCps).toBe(0);

    // 3. Beyond COMBO_RESET_MS (4500ms elapsed) -> expired
    const expiredPast = comboDecayStatus({
      lastClickTime: baseTime,
      now: baseTime + 4500,
      clickTimestamps: timestamps,
    });
    expect(expiredPast.expired).toBe(true);
    expect(expiredPast.remainingMs).toBe(0);
    expect(expiredPast.activeCps).toBe(0);
  });
});
