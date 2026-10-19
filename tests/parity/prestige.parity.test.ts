import { describe, it, expect, vi } from 'vitest';
import { Engine } from '../../src/engine/api';
import { buildLegacyPrestigeScope } from '../helpers/extractLegacyFunction';

describe('T-PRESTIGE Parity: prestigeOutcome & prestigeShards vs Legacy UIModals.executePrestige', () => {
  const ESSENCE_THRESHOLDS = [0, 999999, 1e6, 3999999, 4e6, 1e12, 1e30];

  it.each(ESSENCE_THRESHOLDS)(
    'matches exact shard math and reset state at totalEssence = %d',
    (totalEssence) => {
      // 1. Prepare initial state
      const initialAstralShards = 15;
      const initialTotalAstralShards = 25;
      const initialPrestigeCount = 2;

      const legacyState = {
        essence: totalEssence * 0.8,
        totalEssence,
        astralShards: initialAstralShards,
        totalAstralShards: initialTotalAstralShards,
        prestigeCount: initialPrestigeCount,
        level: 85,
        currentExp: 4500,
        maxExp: 10000,
        upgrades: [
          { id: 'upg_1', level: 120 },
          { id: 'upg_2', level: 55 },
          { id: 'upg_3', level: 10 },
        ],
      };

      const soundCalls: string[] = [];
      let saveCalled = false;
      let closedModalName = '';
      let updateStatsCalled = false;
      let renderUpgradesCalled = false;

      const mockGlobal: any = {
        GameState: {
          get: () => legacyState,
          save: () => {
            saveCalled = true;
          },
        },
        Sound: {
          playAchievement: () => {
            soundCalls.push('playAchievement');
          },
        },
        UI: {
          updateStatsDisplay: () => {
            updateStatsCalled = true;
          },
        },
        UIUpgrades: {
          render: () => {
            renderUpgradesCalled = true;
          },
        },
      };

      const closeModalMock = (id: string) => {
        closedModalName = id;
      };

      const legacyScope = buildLegacyPrestigeScope(mockGlobal, closeModalMock);
      legacyScope.executePrestige();

      // 2. Pure engine calculations
      const calculatedShards = Engine.prestigeShards(totalEssence);
      const outcome = Engine.prestigeOutcome({
        totalEssence,
        astralShards: initialAstralShards,
        totalAstralShards: initialTotalAstralShards,
        prestigeCount: initialPrestigeCount,
      });

      // 3. Parity assertions
      if (totalEssence < 1e6) {
        // Below 1M essence: prestige cannot be executed
        expect(calculatedShards).toBe(0);
        expect(outcome).toBeNull();

        // Legacy state remains completely unmutated
        expect(legacyState.astralShards).toBe(initialAstralShards);
        expect(legacyState.totalAstralShards).toBe(initialTotalAstralShards);
        expect(legacyState.prestigeCount).toBe(initialPrestigeCount);
        expect(legacyState.totalEssence).toBe(totalEssence);
        expect(legacyState.level).toBe(85);
        expect(legacyState.upgrades[0].level).toBe(120);

        // No side effects triggered
        expect(saveCalled).toBe(false);
        expect(closedModalName).toBe('');
        expect(soundCalls).toHaveLength(0);
        expect(updateStatsCalled).toBe(false);
        expect(renderUpgradesCalled).toBe(false);
      } else {
        // At or above 1M essence: prestige succeeds
        expect(outcome).not.toBeNull();
        expect(outcome!.shards).toBe(calculatedShards);
        expect(outcome!.shards).toBeGreaterThan(0);

        // Engine outcome matches legacy mutated state
        expect(legacyState.astralShards).toBe(outcome!.astralShards);
        expect(legacyState.totalAstralShards).toBe(outcome!.totalAstralShards);
        expect(legacyState.prestigeCount).toBe(outcome!.prestigeCount);

        // Reset state matches
        expect(legacyState.essence).toBe(outcome!.reset.essence);
        expect(legacyState.totalEssence).toBe(outcome!.reset.totalEssence);
        expect(legacyState.level).toBe(outcome!.reset.level);
        expect(legacyState.currentExp).toBe(outcome!.reset.currentExp);
        expect(legacyState.maxExp).toBe(outcome!.reset.maxExp);

        // Upgrades reset to 0
        legacyState.upgrades.forEach((u) => {
          expect(u.level).toBe(0);
        });

        // Side-effects
        expect(saveCalled).toBe(true);
        expect(closedModalName).toBe('prestigeModal');
        expect(soundCalls).toContain('playAchievement');
        expect(updateStatsCalled).toBe(true);
        expect(renderUpgradesCalled).toBe(true);
      }
    }
  );
});
