export function prestigeShards(totalEssence: number): number {
  return Math.floor(Math.sqrt(totalEssence / 1000000));
}

export interface PrestigeOutcomeInput {
  totalEssence: number;
  astralShards: number;
  totalAstralShards: number;
  prestigeCount: number;
}

export interface PrestigeOutcomeResult {
  shards: number;
  astralShards: number;
  totalAstralShards: number;
  prestigeCount: number;
  reset: {
    essence: number;
    totalEssence: number;
    level: number;
    currentExp: number;
    maxExp: number;
  };
}

export function prestigeOutcome(state: any): PrestigeOutcomeResult | null {
  const shards = prestigeShards(state.totalEssence || 0);
  if (shards <= 0 || (state.totalEssence || 0) < 1000000) {
    return null;
  }

  const astralShards = (state.astralShards || 0) + shards;
  const totalAstralShards = (state.totalAstralShards || 0) + shards;
  const prestigeCount = (state.prestigeCount || 0) + 1;

  return {
    shards,
    astralShards,
    totalAstralShards,
    prestigeCount,
    reset: {
      essence: 0,
      totalEssence: 0,
      level: 1,
      currentExp: 0,
      maxExp: 100,
    },
  };
}
