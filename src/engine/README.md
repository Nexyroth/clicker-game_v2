# Nexyroth Clicker Engine Architecture

This directory contains the core game logic, calculation engines, and state management for Nexyroth Clicker.

## Pure Engine Principles

1. **No DOM / Browser APIs**: Pure engine modules must never reference `document`, `window`, `localStorage`, DOM elements, or browser events.
2. **Determinism**: Time (`now`) and random rolls (`random`) must be passed explicitly as arguments or dependency-injected functions; never call `Date.now()` or `Math.random()` directly inside pure engine calculations.
3. **Immutability**: Pure engine functions must never mutate their input parameters. The same input must always produce the exact same output.
4. **Architectural Enforcement**: Automated test `tests/architecture/engine-purity.test.ts` scans pure engine files and fails if any forbidden globals, side-effects, or bridge imports are detected.

---

## File Classification

### 1. Pure Engine Modules
- `src/engine/stats.ts`: Calculates `clickPower`, `cps`, `critChance`, `critMultiplier`, and all active multipliers from an immutable state snapshot.
- `src/engine/bonusRules.ts`: Pure formulas for combat/economy bonuses (`bossDamageMultiplier`, `itemDropChance`, `gemDropChance`, `offlineEfficiency`, `achievementBuffPercent`, `allBonuses`).
- `src/engine/boss.ts`: Pure formulas and generation for boss encounters (`spawnBoss`, `summonBoss`, `bossDefeatRewards`, `bossMaxHp`, `bossTimeLimit`, `bossRewardBase`, `bossLabel`, `rollBossTier`).
- `src/engine/drops.ts`: Pure item/potion drop selection (`pickPotionDrop`) and drop cooldown constants.
- `src/engine/combo.ts`: Pure combo advancement math (`advanceCombo`) and decay status (`comboDecayStatus`).
- `src/engine/click.ts`: Pure click combat and drop resolution (`resolveClick`).
- `src/engine/tick.ts`: Pure 100ms game tick step math (`stepTick`).
- `src/engine/catchup.ts`: Pure catch-up planning engine (`planCatchUp`) for background tab throttling and offline transition.
- `src/engine/offline.ts`: Pure offline progress formula (`offlineGain`).
- `src/engine/achievements.ts`: Pure achievements progression evaluation (`achievementCurrents`).
- `src/engine/prestige.ts`: Pure ascension shards calculation and reset outcome (`prestigeShards`, `prestigeOutcome`).
- `src/engine/state/deepMerge.ts`: Pure single-level deep merge utility matching legacy persistence semantics.
- `src/engine/state/initialState.ts`: Pure initial state factory `createInitialState(now)`.

### 2. State Store & Persistence
- `src/engine/state/saveRepository.ts`: `SaveRepository` interface and `LocalStorageSaveRepository` implementation with v8 and v4 fallback keys.
- `src/engine/state/migrations.ts`: Deterministic sequential migration functions (`MIGRATION_STEPS`) for legacy saves.
- `src/engine/state/gameState.ts`: Store factory `createGameStateStore` and singleton instance managing in-memory state and current boss closure.

### 3. Window & Legacy Bridges
- `src/engine/api.ts`: Public engine API exporting `Engine = { computeStats }` and mounting `window.Engine`.
- `src/engine/bonuses.ts`: Legacy adapter mounting parameterless `window.Bonuses` that query `getState()` and delegate to `bonusRules`.
