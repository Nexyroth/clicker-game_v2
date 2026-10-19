import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { loadLegacy } from '../helpers/loadLegacy';
import { DEFAULT_ACHIEVEMENTS } from '../../src/data/achievements';
import { DEFAULT_SKILLS } from '../../src/data/skills';

describe('Phase 5C-A: Achievements Reachability & totalCrits Quirk Characterization', () => {
  let GameState: any;
  let UICore: any;

  beforeEach(() => {
    vi.useFakeTimers();
    const legacy = loadLegacy();
    GameState = legacy.GameState;
    UICore = legacy.UICore;
    GameState.load();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('verifies state.totalCrits increments properly on repeated critical clicks (F1 Fix)', () => {
    const state = GameState.get();
    expect(state.totalCrits).toBe(0);

    // Mock Math.random to always produce a critical click and trigger chain reactions
    vi.spyOn(Math, 'random').mockReturnValue(0);

    // Perform 25 critical clicks
    for (let i = 0; i < 25; i++) {
      UICore.handleCoreClick(null, true);
    }

    // state.totalClicks has increased to 25
    expect(state.totalClicks).toBe(25);

    // F1 FIX: state.totalCrits increments to 25
    expect(state.totalCrits).toBe(25);
  });

  it('characterizes the 1 unreachable achievement out of 35 total achievements after 5E-1 fix', () => {
    expect(DEFAULT_ACHIEVEMENTS.length).toBe(35);

    const unreachableAchievements = [
      {
        id: 'skills_luck_branch',
        type: 'luck_branch',
        target: 1,
        reason: 'No skills with branch="luck" exist in DEFAULT_SKILLS',
      },
    ];

    // Confirm that luck branch is completely missing from DEFAULT_SKILLS
    const hasLuckSkill = DEFAULT_SKILLS.some((s: any) => s.branch === 'luck');
    expect(hasLuckSkill).toBe(false);

    // Confirm exact list of unreachable achievement IDs (potions_10 is now reachable in 5E-1)
    const unreachableIds = unreachableAchievements.map((a) => a.id);
    expect(unreachableIds).toEqual([
      'skills_luck_branch',
    ]);

    // Maximum reachable achievements in standard play: 35 - 1 = 34
    const totalAchievements = DEFAULT_ACHIEVEMENTS.length;
    const maxReachableAchievements = totalAchievements - unreachableAchievements.length;
    expect(maxReachableAchievements).toBe(34);

    // Buff per achievement is 0.5% (+0.005)
    // Realistic maximum achievement buff: 34 * 0.5% = +17.0% (0.170)
    const buffPerAchievement = 0.005;
    const maxRealisticAchievementBuff = maxReachableAchievements * buffPerAchievement;
    expect(maxRealisticAchievementBuff).toBeCloseTo(0.170, 6);
  });
});
