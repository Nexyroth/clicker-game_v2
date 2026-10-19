import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { Engine } from '../../src/engine/api';
import { createInitialState } from '../../src/engine/state/initialState';

const LEGACY_CODE = fs.readFileSync(
  path.resolve(process.cwd(), 'tests/fixtures/legacy/ui-core.js'),
  'utf8'
);

function mulberry32(seed: number) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe('Combo Math Parity Tests: Legacy ui-core vs Engine.advanceCombo', () => {
  let sandbox: any;
  let currentState: any;

  beforeEach(() => {
    currentState = createInitialState(1710000000000);
    // ensure clean state with no active boosts or perks interfering
    currentState.activeBoosts = [];
    currentState.activePotions = {};
    currentState.gamePasses = {};
    currentState.relics.forEach((r: any) => { r.equipped = false; });
    currentState.skills.forEach((s: any) => { s.unlocked = false; });

    sandbox = {
      GameState: {
        get: () => currentState,
        getBoss: () => null,
      },
      Bonuses: {
        getAchievementBuffPercent: () => 0,
        getItemDropChance: () => 0,
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
        playLevelUp: () => {},
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

  it('matches exactly across 300 seeded click sequences with random delays and bursts', () => {
    vi.useFakeTimers();
    const rng = mulberry32(424242);

    for (let seq = 0; seq < 300; seq++) {
      const clickCount = Math.floor(rng() * 76) + 5; // 5 to 80 clicks

      // Engine simulation state
      let engineHits = 0;
      let engineLastClickTime = 0;
      const engineTimestamps: number[] = [];

      let simTime = 1718000000000 + seq * 100000;
      vi.advanceTimersByTime(10000);
      vi.setSystemTime(simTime);

      for (let c = 0; c < clickCount; c++) {
        const roll = rng();
        let delta = 0;
        if (roll < 0.6) {
          delta = Math.floor(rng() * 120) + 30; // rapid burst: 30-150ms
        } else if (roll < 0.85) {
          delta = Math.floor(rng() * 1500) + 150; // normal click: 150-1650ms
        } else {
          delta = Math.floor(rng() * 2500) + 3100; // pause exceeding 3000ms: decay reset!
        }
        simTime += delta;

        // Advance fake timers so legacy interval checkComboDecay runs
        vi.advanceTimersByTime(delta);

        // If delta >= COMBO_RESET_MS (3000ms), engine resets hits to 0
        if (engineLastClickTime > 0 && simTime - engineLastClickTime >= Engine.COMBO_RESET_MS) {
          engineHits = 0;
        }

        vi.spyOn(Math, 'random').mockReturnValue(0.99); // no crit, no drop

        currentState.essence = 0;
        sandbox.UICore.handleCoreClick(null, false);
        const legacyComboMult = currentState.essence;

        // Engine simulation
        const engineResult = Engine.advanceCombo({
          hits: engineHits,
          now: simTime,
          clickTimestamps: engineTimestamps,
        });

        engineHits = engineResult.hits;
        engineLastClickTime = simTime;
        engineTimestamps.push(simTime);
        while (engineTimestamps.length > 0 && engineTimestamps[0] < simTime - 10000) {
          engineTimestamps.shift();
        }

        const isExact = Object.is(engineResult.multiplier, legacyComboMult);
        if (!isExact) {
          throw new Error(
            `Sequence ${seq}, Click ${c}: engine=${engineResult.multiplier}, legacy=${legacyComboMult}, hits=${engineHits}`
          );
        }
        expect(isExact).toBe(true);

        vi.spyOn(Math, 'random').mockRestore();
      }
    }
    vi.useRealTimers();
  });
});
