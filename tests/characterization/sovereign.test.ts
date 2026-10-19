import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { loadLegacy } from '../helpers/loadLegacy';

describe('T10: Daily Rewards Day 7 Sovereign Relic Characterization Tests', () => {
  let GameState: any;
  let UICore: any;
  let DailyRewards: any;

  beforeEach(() => {
    vi.useFakeTimers();
    const legacy = loadLegacy();
    GameState = legacy.GameState;
    UICore = legacy.UICore;
    DailyRewards = legacy.DailyRewards;
    GameState.reset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('(i) Claiming Day 7 reward with 2 equipped relics adds relic_sovereign with equipped: true', () => {
    const state = GameState.get();
    const initiallyEquipped = state.relics.filter((r: any) => r.equipped);
    expect(initiallyEquipped.length).toBe(2);

    // Set up day 7 readiness (streakDay 6 means Day 7 reward at index 6)
    state.daily.streakDay = 6;
    state.daily.lastClaimTimestamp = 0;
    state.daily.lastClaimDate = '';

    expect(DailyRewards.isReady()).toBe(true);
    const result = DailyRewards.claim();
    expect(result).not.toEqual({ success: false });

    // Check relic_sovereign presence
    const sovereign = state.relics.find((r: any) => r.id === 'relic_sovereign');
    expect(sovereign).toBeDefined();
    expect(sovereign.equipped).toBe(true);
    expect(sovereign.rarity).toBe('legendary');
    expect(sovereign.clickBonus).toBe(0.5);
    expect(sovereign.cpsBonus).toBe(0.5);
    expect(sovereign.critBonus).toBe(0.1);
    expect(sovereign.icon).toBe('sun');

    const equippedAfter = state.relics.filter((r: any) => r.equipped);
    expect(equippedAfter.length).toBe(3);
  });

  it('(ii) Claiming Day 7 reward when 4 relics are already equipped respects 4-relic limit (adds relic_sovereign with equipped: false)', () => {
    const state = GameState.get();

    // Give some base upgrades so both clickPower and cps are non-zero
    state.upgrades[0].level = 10;
    state.upgrades[1].level = 10;

    // Explicitly equip 4 standard relics
    state.relics.forEach((r: any) => { r.equipped = false; });
    const targetIds = ['relic_eye', 'relic_hourglass', 'relic_heart', 'relic_giant_hammer'];
    state.relics.forEach((r: any) => {
      if (targetIds.includes(r.id)) {
        r.equipped = true;
      }
    });

    const countBefore = state.relics.filter((r: any) => r.equipped).length;
    expect(countBefore).toBe(4);

    const statsBefore = UICore.calculateStats();

    // Prepare day 7 claim
    state.daily.streakDay = 6;
    state.daily.lastClaimTimestamp = 0;
    state.daily.lastClaimDate = '';

    DailyRewards.claim();

    const countAfter = state.relics.filter((r: any) => r.equipped).length;
    // F4 FIX: Cap at 4 relics enforced; relic_sovereign added with equipped: false
    expect(countAfter).toBe(4);

    const sovereign = state.relics.find((r: any) => r.id === 'relic_sovereign');
    expect(sovereign).toBeDefined();
    expect(sovereign.equipped).toBe(false);

    const statsAfter = UICore.calculateStats();

    // Stats reflect +20 shards (+20% click and cps), but relic_sovereign bonuses (+50% click, +50% cps, +10% crit) are NOT applied because it is unequipped
    expect(statsAfter.clickPower).toBeCloseTo(statsBefore.clickPower * 1.20, 2);
    expect(statsAfter.cps).toBeCloseTo(statsBefore.cps * 1.20, 2);
    expect(statsAfter.critChance).toBe(statsBefore.critChance);
  });

  it('(iii) Claiming Day 7 reward a second time does not duplicate relic_sovereign', () => {
    const state = GameState.get();

    // First cycle Day 7 claim
    state.daily.streakDay = 6;
    state.daily.lastClaimTimestamp = 0;
    state.daily.lastClaimDate = '';
    DailyRewards.claim();

    const matches1 = state.relics.filter((r: any) => r.id === 'relic_sovereign');
    expect(matches1.length).toBe(1);

    // Second cycle Day 7 claim
    state.daily.streakDay = 6;
    state.daily.lastClaimTimestamp = 0;
    state.daily.lastClaimDate = '';
    DailyRewards.claim();

    const matches2 = state.relics.filter((r: any) => r.id === 'relic_sovereign');
    expect(matches2.length).toBe(1);
  });
});
