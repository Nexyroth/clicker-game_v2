export interface OfflineGainInput {
  lastSaveTime?: number | null;
  now: number;
  cps: number;
  efficiency: number;
}

export interface OfflineGainOutput {
  gain: number;
  elapsedSeconds: number;
}

export function offlineGain(input: OfflineGainInput): OfflineGainOutput | null {
  if (!input.lastSaveTime) return null;

  const elapsedSeconds = Math.max(0, (input.now - input.lastSaveTime) / 1000);
  if (elapsedSeconds < 10) return null;

  const gain = input.cps * elapsedSeconds * input.efficiency;
  if (gain <= 0) return null;

  return {
    gain,
    elapsedSeconds,
  };
}
