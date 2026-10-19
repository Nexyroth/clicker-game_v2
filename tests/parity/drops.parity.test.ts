import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { Engine } from '../../src/engine/api';
import { createInitialState } from '../../src/engine/state/initialState';

const LEGACY_CODE = fs.readFileSync(
  path.resolve(process.cwd(), 'tests/fixtures/legacy/ui-core.js'),
  'utf8'
);

describe('Potion Drops Parity Tests: Legacy ui-core vs Engine.pickPotionDrop', () => {
  let sandbox: any;
  let currentState: any;

  beforeEach(() => {
    currentState = createInitialState(1710000000000);
    currentState.potions = {
      potion_x2: 0,
      potion_x5: 0,
      potion_x10: 0,
    };

    sandbox = {
      GameState: {
        get: () => currentState,
        getBoss: () => null,
      },
      Bonuses: {
        getAchievementBuffPercent: () => 0,
        getItemDropChance: () => 1.0, // Force 100% item drop chance
        getGemDropChance: () => 0,
        getBossDamageMultiplier: () => 1.0,
      },
      Numeric: {
        format: (n: number) => String(Math.floor(n)),
      },
      Toast: {
        show: () => {},
      },
      Sound: {
        playClick: () => {},
      },
      CosmicEvents: {
        track: () => {},
      },
      console: { log: () => {}, warn: () => {}, error: () => {} },
    };
    sandbox.window = sandbox;
    sandbox.global = sandbox;

    const runner = new Function('global', 'window', 'document', LEGACY_CODE);
    runner(sandbox, sandbox, document);
  });

  const KEY_ROLLS = [
    0,
    0.8499999,
    0.85,
    0.9699999,
    0.97,
    0.999999,
  ];

  it('matches exactly each threshold of pickPotionDrop through handleCoreClick', () => {
    let now = 1718000000000;

    for (const keyRoll of KEY_ROLLS) {
      // Advance time by 65s each iteration to satisfy POTION_DROP_COOLDOWN_MS (60000)
      now += 65000;
      vi.spyOn(Date, 'now').mockReturnValue(now);

      const countsBefore = { ...currentState.potions };

      // Sequence of Math.random rolls:
      // 1. crit check -> 0.99 (false)
      // 2. item drop trigger -> 0.01 (true, since itemDropChance = 1.0)
      // 3. rollRandomItemDrop potion selection -> keyRoll
      // 4. gem drop trigger -> 0.99 (false)
      let callCount = 0;
      vi.spyOn(Math, 'random').mockImplementation(() => {
        callCount++;
        if (callCount === 1) return 0.99; // crit
        if (callCount === 2) return 0.01; // item drop trigger
        if (callCount === 3) return keyRoll; // potion key roll
        return 0.99; // gem drop
      });

      sandbox.UICore.handleCoreClick(null, false);

      const expectedKey = Engine.pickPotionDrop(keyRoll);

      expect(currentState.potions[expectedKey]).toBe(countsBefore[expectedKey] + 1);

      vi.restoreAllMocks();
    }
  });
});
