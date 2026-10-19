export interface SaveRepository {
  read(): string | null;
  write(json: string): void;
  remove(): void;
}

export const SAVE_KEY_V8 = 'nexyroth_save_v8';
export const SAVE_KEY_V4 = 'nexyroth_save_v4';

export class LocalStorageSaveRepository implements SaveRepository {
  read(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(SAVE_KEY_V8) || localStorage.getItem(SAVE_KEY_V4);
  }

  write(json: string): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(SAVE_KEY_V8, json);
  }

  remove(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(SAVE_KEY_V8);
  }
}
