import { deepClone } from '../core/clone';

export const DEFAULT_EVENT_QUESTS = [
  { id: 'q_click', name: 'Core Resonance', desc: 'Click the Nexyroth Core 150 times.', target: 150, current: 0, rewardTokens: 50, rewardGems: 1, type: 'clicks', claimed: false },
  { id: 'q_boss', name: 'Titan Executioner', desc: 'Defeat 2 Void Titans in the Arena.', target: 2, current: 0, rewardTokens: 80, rewardShards: 30, type: 'bosses', claimed: false },
  { id: 'q_rifts', name: 'Anomaly Catcher', desc: 'Collect 3 Cosmic Rifts.', target: 3, current: 0, rewardTokens: 60, rewardGems: 1, type: 'rifts', claimed: false },
  { id: 'q_upgrades', name: 'Ancient Engineering', desc: 'Purchase 25 total upgrades.', target: 25, current: 0, rewardTokens: 75, rewardGems: 2, type: 'upgrades', claimed: false },
  { id: 'q_essence', name: 'Essence Overflow', desc: 'Gather 100,000 Cosmic Essence.', target: 100000, current: 0, rewardTokens: 100, rewardGems: 2, type: 'essence', claimed: false },
  { id: 'q_crits', name: 'Precision Strikes', desc: 'Score 50 Critical Strikes on the Core.', target: 50, current: 0, rewardTokens: 70, rewardShards: 20, type: 'crits', claimed: false },
] as const;

export type EventQuestDef = (typeof DEFAULT_EVENT_QUESTS)[number];

export function createDefaultEventState(now: number = Date.now()) {
  return {
    eventId: 'cosmic_incursion_v8',
    eventTitle: 'Cosmic Void Incursion (v8.0)',
    endTime: now + 7 * 24 * 60 * 60 * 1000,
    eventTokens: 0,
    claimedMilestones: [] as string[],
    quests: deepClone(DEFAULT_EVENT_QUESTS),
  };
}

export const DEFAULT_EVENT_STATE = createDefaultEventState(0);


