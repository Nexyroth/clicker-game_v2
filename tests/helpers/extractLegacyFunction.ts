import fs from 'fs';
import path from 'path';

/**
 * Extracts the exact text of a named function declaration from source code
 * using brace matching with string and comment awareness.
 */
export function extractFunctionSource(code: string, functionName: string): string {
  const pattern = new RegExp(`\\bfunction\\s+${functionName}\\s*\\(`, 'g');
  const match = pattern.exec(code);
  if (!match) {
    throw new Error(`Function "${functionName}" not found in source code.`);
  }

  const startIdx = match.index;
  const openBraceIdx = code.indexOf('{', startIdx);
  if (openBraceIdx === -1) {
    throw new Error(`Opening brace for function "${functionName}" not found.`);
  }

  let depth = 0;
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inTemplate = false;
  let inLineComment = false;
  let inBlockComment = false;
  let endIdx = -1;

  for (let i = openBraceIdx; i < code.length; i++) {
    const char = code[i];
    const prev = i > 0 ? code[i - 1] : '';
    const next = i + 1 < code.length ? code[i + 1] : '';

    if (inLineComment) {
      if (char === '\n') {
        inLineComment = false;
      }
      continue;
    }

    if (inBlockComment) {
      if (char === '*' && next === '/') {
        inBlockComment = false;
        i++; // skip /
      }
      continue;
    }

    if (inSingleQuote) {
      if (char === "'" && prev !== '\\') {
        inSingleQuote = false;
      }
      continue;
    }

    if (inDoubleQuote) {
      if (char === '"' && prev !== '\\') {
        inDoubleQuote = false;
      }
      continue;
    }

    if (inTemplate) {
      if (char === '`' && prev !== '\\') {
        inTemplate = false;
      }
      continue;
    }

    // Check comment starts
    if (char === '/' && next === '/') {
      inLineComment = true;
      i++;
      continue;
    }
    if (char === '/' && next === '*') {
      inBlockComment = true;
      i++;
      continue;
    }

    // Check string starts
    if (char === "'") {
      inSingleQuote = true;
      continue;
    }
    if (char === '"') {
      inDoubleQuote = true;
      continue;
    }
    if (char === '`') {
      inTemplate = true;
      continue;
    }

    // Count braces
    if (char === '{') {
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth === 0) {
        endIdx = i + 1;
        break;
      }
    }
  }

  if (endIdx === -1) {
    throw new Error(`Could not find matching closing brace for function "${functionName}".`);
  }

  return code.slice(startIdx, endIdx);
}

export interface LegacyMainScope {
  gameTick: () => void;
  calculateOfflineProgress: () => void;
  updateAchievementsProgress: () => void;
}

export interface LegacyPrestigeScope {
  executePrestige: () => void;
}

/**
 * Builds an isolated execution scope from _legacy/js-v8-snapshot/main.js
 * containing gameTick, calculateOfflineProgress, and updateAchievementsProgress.
 */
export function buildLegacyMainScope(mockGlobal: any): LegacyMainScope {
  const filePath = path.resolve(process.cwd(), '_legacy/js-v8-snapshot/main.js');
  const code = fs.readFileSync(filePath, 'utf8');

  const fnOffline = extractFunctionSource(code, 'calculateOfflineProgress');
  const fnTick = extractFunctionSource(code, 'gameTick');
  const fnAch = extractFunctionSource(code, 'updateAchievementsProgress');

  const wrapperCode = `
    return (function(global, setTimeout) {
      ${fnOffline}
      ${fnTick}
      ${fnAch}
      return {
        calculateOfflineProgress: calculateOfflineProgress,
        gameTick: gameTick,
        updateAchievementsProgress: updateAchievementsProgress
      };
    })(global, setTimeout);
  `;

  const factory = new Function('global', 'setTimeout', wrapperCode);
  return factory(mockGlobal, (fn: Function, ms: number) => setTimeout(fn, ms));
}

/**
 * Builds an isolated execution scope from _legacy/js-v8-snapshot/ui-modals.js
 * containing executePrestige.
 */
export function buildLegacyPrestigeScope(mockGlobal: any, closeModalMock?: (id: string) => void): LegacyPrestigeScope {
  const filePath = path.resolve(process.cwd(), '_legacy/js-v8-snapshot/ui-modals.js');
  const code = fs.readFileSync(filePath, 'utf8');

  const fnPrestige = extractFunctionSource(code, 'executePrestige');

  const wrapperCode = `
    return (function(global, closeModal) {
      ${fnPrestige}
      return {
        executePrestige: executePrestige
      };
    })(global, closeModal);
  `;

  const factory = new Function('global', 'closeModal', wrapperCode);
  return factory(mockGlobal, closeModalMock || (() => {}));
}
