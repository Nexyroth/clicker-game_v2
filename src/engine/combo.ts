/**
 * NEXYROTH CLICKER - PURE COMBO ENGINE (TypeScript)
 * Pure functions: No DOM, no window, no global state.
 */

export const COMBO_RESET_MS = 3000;

export interface AdvanceComboInput {
  hits: number;
  now: number;
  clickTimestamps: readonly number[];
}

export interface AdvanceComboResult {
  hits: number;
  multiplier: number;
  activeCps: number;
  milestone: boolean;
}

export function advanceCombo(input: AdvanceComboInput): AdvanceComboResult {
  const nextHits = input.hits + 1;

  // Calculate rolling CPS from clicks in last 1.5s (before current click is recorded, exactly as in legacy)
  const recentClicks = input.clickTimestamps.filter(function (t) {
    return input.now - t <= 1500;
  }).length;
  const activeCps = Number((recentClicks / 1.5).toFixed(1));

  // Multiplier calculation (base grows per 10 hits + active CPS speed bonus)
  const tier = Math.floor(nextHits / 10);
  const progressInTier = nextHits % 10;
  const baseComboMult = 1.0 + tier * 0.2 + progressInTier * 0.015;
  const cpsBonus = Math.min(1.5, Math.max(0, (activeCps - 1) * 0.08));
  const rawMult = baseComboMult + cpsBonus;

  // INFINITE COMBO SCALING (Tăng vô hạn từ x10 trở lên nhưng cực kỳ chậm và lâu)
  let finalMult = 1.0;
  if (rawMult <= 10.0) {
    finalMult = Math.max(1.0, rawMult);
  } else {
    const excess = rawMult - 10.0;
    const slowScaling = Math.log10(1 + excess * 0.25) * 2.0;
    finalMult = 10.0 + slowScaling;
  }
  const multiplier = Number(finalMult.toFixed(2));
  const milestone = nextHits % 10 === 0;

  return {
    hits: nextHits,
    multiplier,
    activeCps,
    milestone,
  };
}

export interface ComboDecayStatusInput {
  lastClickTime: number;
  now: number;
  clickTimestamps: readonly number[];
}

export interface ComboDecayStatusResult {
  expired: boolean;
  remainingMs: number;
  activeCps: number;
}

export function comboDecayStatus(
  input: ComboDecayStatusInput
): ComboDecayStatusResult {
  const elapsed = input.now - input.lastClickTime;
  const remainingMs = COMBO_RESET_MS - elapsed;

  if (remainingMs <= 0) {
    return {
      expired: true,
      remainingMs: 0,
      activeCps: 0,
    };
  }

  const recentClicks = input.clickTimestamps.filter(function (t) {
    return input.now - t <= 1500;
  }).length;
  const activeCps = Number((recentClicks / 1.5).toFixed(1));

  return {
    expired: false,
    remainingMs,
    activeCps,
  };
}
