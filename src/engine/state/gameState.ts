import { deepClone } from '../../core/clone';
import {
  BOSS_PRESETS,
  POTION_METADATA,
  DEFAULT_GAME_PASSES,
  GEM_TOPUP_PACKS,
  WORLDS,
} from '../../data';
import type { GameState as IGameState, Boss } from '../types';
import { createInitialState } from './initialState';
import { deepMerge } from './deepMerge';
import { runMigrations } from './migrations';
import { type SaveRepository, LocalStorageSaveRepository } from './saveRepository';
export type { SaveRepository };
export { LocalStorageSaveRepository };

export interface GameStateStoreOptions {
  repo: SaveRepository;
  now?: () => number;
}

export function createGameStateStore(options: GameStateStoreOptions) {
  const repo = options.repo;
  const now = options.now ?? (() => Date.now());

  let state: IGameState = createInitialState(now());
  let currentBoss: Boss = deepClone(BOSS_PRESETS[0]) as unknown as Boss;

  function loadState(): void {
    try {
      const raw = repo.read();
      if (raw) {
        const parsed = JSON.parse(raw);
        state = deepMerge(createInitialState(now()), parsed) as IGameState;
        state.version = '9.0';
        runMigrations(state);
      }
    } catch (e) {
      console.error('Failed to load state:', e);
    }
  }

  function saveState(): void {
    state.lastSaveTime = now();
    try {
      repo.write(JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }

  function resetState(): void {
    repo.remove();
    state = createInitialState(now());
    currentBoss = deepClone(BOSS_PRESETS[0]) as unknown as Boss;
    saveState();
  }

  function exportSaveBase64(): string {
    state.lastSaveTime = now();
    const json = JSON.stringify(state);
    return btoa(unescape(encodeURIComponent(json)));
  }

  function importSaveBase64(b64String: string): { success: boolean; error?: string } {
    try {
      const json = decodeURIComponent(escape(atob(b64String.trim())));
      const parsed = JSON.parse(json);
      if (parsed && typeof parsed.essence === 'number') {
        state = deepMerge(createInitialState(now()), parsed) as IGameState;
        state.version = '9.0';
        runMigrations(state);
        saveState();
        return { success: true };
      }
      return { success: false, error: 'Dữ liệu lưu không hợp lệ.' };
    } catch {
      return { success: false, error: 'Chuỗi Base64 không đúng định dạng.' };
    }
  }

  return {
    get: function (): IGameState {
      return state;
    },
    set: function (newState: IGameState): void {
      state = newState;
    },
    getBoss: function (): Boss {
      return currentBoss;
    },
    setBoss: function (b: Boss): void {
      currentBoss = b;
    },
    getBossPresets: function (): typeof BOSS_PRESETS {
      return BOSS_PRESETS;
    },
    getPotionMetadata: function (): typeof POTION_METADATA {
      return POTION_METADATA;
    },
    getGamePasses: function (): typeof DEFAULT_GAME_PASSES {
      return DEFAULT_GAME_PASSES;
    },
    getGemTopupPacks: function (): typeof GEM_TOPUP_PACKS {
      return GEM_TOPUP_PACKS;
    },
    getWorlds: function (): typeof WORLDS {
      return WORLDS;
    },
    load: loadState,
    save: saveState,
    reset: resetState,
    exportBase64: exportSaveBase64,
    importBase64: importSaveBase64,
  };
}

export type GameStateStore = ReturnType<typeof createGameStateStore>;

export const GameState: GameStateStore = createGameStateStore({
  repo: new LocalStorageSaveRepository(),
});

if (typeof window !== 'undefined') {
  (window as unknown as { GameState: GameStateStore }).GameState = GameState;
}
if (typeof globalThis !== 'undefined') {
  (globalThis as unknown as { GameState: GameStateStore }).GameState = GameState;
}
