/**
 * NEXYROTH CLICKER - PURE CATCH-UP PLANNING ENGINE
 * Calculates tick distribution or offline transition when time gaps occur.
 * Pure TypeScript, zero DOM/browser dependencies, deterministic.
 */

export const TICK_MS = 100;
export const ACTIVE_CATCHUP_MAX_MS = 120000; // 2 minutes (120,000 ms)
export const PAUSE_BOSS_WHILE_HIDDEN = true;
export const PAUSE_AUTOCLICK_POTION_WHILE_HIDDEN = true;

export interface PlanCatchUpInput {
  accumulatorMs: number;
  gapMs: number;
  hiddenMs: number;
}

export interface CatchUpPlan {
  mode: 'ticks' | 'offline';
  steps: number;
  hiddenSteps: number;
  visibleSteps: number;
  accumulatorMs: number;
  offlineSeconds: number;
}

/**
 * Plans catch-up step allocation based on time gap and hidden duration.
 *
 * Rules:
 * - gapMs invalid (NaN, <= 0): treated as 0.
 * - gapMs > ACTIVE_CATCHUP_MAX_MS: transitions to mode 'offline', steps = 0,
 *   offlineSeconds = gapMs / 1000, accumulatorMs = 0.
 * - Otherwise mode 'ticks':
 *   total = accumulatorMs + gapMs
 *   steps = Math.floor(total / TICK_MS)
 *   accumulatorMs = total - steps * TICK_MS
 *   hiddenSteps = Math.min(steps, Math.floor(hiddenMs / TICK_MS))
 *   visibleSteps = steps - hiddenSteps
 */
export function planCatchUp(input: PlanCatchUpInput): CatchUpPlan {
  const rawGap = input ? input.gapMs : 0;
  const gapMs = typeof rawGap === 'number' && Number.isFinite(rawGap) && rawGap > 0 ? rawGap : 0;

  if (gapMs > ACTIVE_CATCHUP_MAX_MS) {
    return {
      mode: 'offline',
      steps: 0,
      hiddenSteps: 0,
      visibleSteps: 0,
      accumulatorMs: 0,
      offlineSeconds: gapMs / 1000,
    };
  }

  const rawAcc = input ? input.accumulatorMs : 0;
  const accumulatorMs = typeof rawAcc === 'number' && Number.isFinite(rawAcc) && rawAcc > 0 ? rawAcc : 0;

  const rawHidden = input ? input.hiddenMs : 0;
  const hiddenMs = typeof rawHidden === 'number' && Number.isFinite(rawHidden) && rawHidden > 0 ? rawHidden : 0;

  const total = accumulatorMs + gapMs;
  const steps = Math.floor(total / TICK_MS);
  const nextAccMs = total - steps * TICK_MS;
  const rawHiddenSteps = Math.floor(hiddenMs / TICK_MS);
  const hiddenSteps = Math.min(steps, Math.max(0, rawHiddenSteps));
  const visibleSteps = steps - hiddenSteps;

  return {
    mode: 'ticks',
    steps,
    hiddenSteps,
    visibleSteps,
    accumulatorMs: nextAccMs,
    offlineSeconds: 0,
  };
}
