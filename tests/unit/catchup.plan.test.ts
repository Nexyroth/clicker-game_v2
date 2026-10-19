import { describe, it, expect } from 'vitest';
import {
  planCatchUp,
  TICK_MS,
  ACTIVE_CATCHUP_MAX_MS,
  PAUSE_BOSS_WHILE_HIDDEN,
  PAUSE_AUTOCLICK_POTION_WHILE_HIDDEN,
} from '../../src/engine/catchup';

describe('Unit Tests: Catch-Up Planning Engine (planCatchUp)', () => {
  it('exports expected policy constants', () => {
    expect(TICK_MS).toBe(100);
    expect(ACTIVE_CATCHUP_MAX_MS).toBe(120000);
    expect(PAUSE_BOSS_WHILE_HIDDEN).toBe(true);
    expect(PAUSE_AUTOCLICK_POTION_WHILE_HIDDEN).toBe(true);
  });

  it('allocates 1 step for a normal 100ms gap with 0 accumulator', () => {
    const plan = planCatchUp({ accumulatorMs: 0, gapMs: 100, hiddenMs: 0 });
    expect(plan).toEqual({
      mode: 'ticks',
      steps: 1,
      hiddenSteps: 0,
      visibleSteps: 1,
      accumulatorMs: 0,
      offlineSeconds: 0,
    });
  });

  it('correctly accumulates leftovers: gap 105ms then 95ms', () => {
    // Frame 1: gap 105ms -> 1 step, 5ms leftover
    const plan1 = planCatchUp({ accumulatorMs: 0, gapMs: 105, hiddenMs: 0 });
    expect(plan1.mode).toBe('ticks');
    expect(plan1.steps).toBe(1);
    expect(plan1.accumulatorMs).toBe(5);

    // Frame 2: gap 95ms + 5ms accumulated = 100ms -> 1 step, 0ms leftover
    const plan2 = planCatchUp({ accumulatorMs: plan1.accumulatorMs, gapMs: 95, hiddenMs: 0 });
    expect(plan2.mode).toBe('ticks');
    expect(plan2.steps).toBe(1);
    expect(plan2.accumulatorMs).toBe(0);
  });

  it('allocates exactly 100 steps for gap 10000ms', () => {
    const plan = planCatchUp({ accumulatorMs: 0, gapMs: 10000, hiddenMs: 0 });
    expect(plan).toEqual({
      mode: 'ticks',
      steps: 100,
      hiddenSteps: 0,
      visibleSteps: 100,
      accumulatorMs: 0,
      offlineSeconds: 0,
    });
  });

  it('treats gap = 120000ms as mode "ticks", but 120001ms as mode "offline"', () => {
    // Exactly at threshold: 120,000ms is mode 'ticks'
    const planAtLimit = planCatchUp({ accumulatorMs: 0, gapMs: 120000, hiddenMs: 0 });
    expect(planAtLimit.mode).toBe('ticks');
    expect(planAtLimit.steps).toBe(1200);
    expect(planAtLimit.accumulatorMs).toBe(0);
    expect(planAtLimit.offlineSeconds).toBe(0);

    // Exceeds threshold by 1ms: transitions to mode 'offline'
    const planExceeded = planCatchUp({ accumulatorMs: 0, gapMs: 120001, hiddenMs: 0 });
    expect(planExceeded.mode).toBe('offline');
    expect(planExceeded.steps).toBe(0);
    expect(planExceeded.hiddenSteps).toBe(0);
    expect(planExceeded.visibleSteps).toBe(0);
    expect(planExceeded.accumulatorMs).toBe(0);
    expect(planExceeded.offlineSeconds).toBe(120.001);
  });

  it('correctly splits hiddenSteps and visibleSteps based on hiddenMs', () => {
    // 1000ms gap = 10 steps. If 400ms hidden -> 4 hidden steps, 6 visible steps
    const plan = planCatchUp({ accumulatorMs: 0, gapMs: 1000, hiddenMs: 400 });
    expect(plan.mode).toBe('ticks');
    expect(plan.steps).toBe(10);
    expect(plan.hiddenSteps).toBe(4);
    expect(plan.visibleSteps).toBe(6);

    // If hiddenMs exceeds gapMs, hiddenSteps is capped at total steps
    const planOverHidden = planCatchUp({ accumulatorMs: 0, gapMs: 500, hiddenMs: 1200 });
    expect(planOverHidden.steps).toBe(5);
    expect(planOverHidden.hiddenSteps).toBe(5);
    expect(planOverHidden.visibleSteps).toBe(0);
  });

  it('safely sanitizes negative, NaN, and undefined inputs', () => {
    const planNeg = planCatchUp({ accumulatorMs: -50, gapMs: -100, hiddenMs: -20 });
    expect(planNeg.mode).toBe('ticks');
    expect(planNeg.steps).toBe(0);
    expect(planNeg.accumulatorMs).toBe(0);

    const planNaN = planCatchUp({ accumulatorMs: NaN, gapMs: NaN, hiddenMs: NaN });
    expect(planNaN.mode).toBe('ticks');
    expect(planNaN.steps).toBe(0);
    expect(planNaN.accumulatorMs).toBe(0);

    const planUndef = planCatchUp({} as any);
    expect(planUndef.mode).toBe('ticks');
    expect(planUndef.steps).toBe(0);
    expect(planUndef.accumulatorMs).toBe(0);
  });

  it('ensures accumulatorMs is strictly within [0, 100) across random inputs', () => {
    for (let i = 0; i < 500; i++) {
      const acc = Math.random() * 150;
      const gap = Math.random() * 100000;
      const hidden = Math.random() * gap;
      const plan = planCatchUp({ accumulatorMs: acc, gapMs: gap, hiddenMs: hidden });
      expect(plan.accumulatorMs).toBeGreaterThanOrEqual(0);
      expect(plan.accumulatorMs).toBeLessThan(100);
      expect(plan.hiddenSteps + plan.visibleSteps).toBe(plan.steps);
    }
  });
});
