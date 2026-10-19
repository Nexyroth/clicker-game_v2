import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Architecture & Purity Boundary Enforcement', () => {
  const PURE_ENGINE_FILES = [
    'src/engine/stats.ts',
    'src/engine/bonusRules.ts',
    'src/engine/boss.ts',
    'src/engine/drops.ts',
    'src/engine/combo.ts',
    'src/engine/click.ts',
    'src/engine/tick.ts',
    'src/engine/catchup.ts',
    'src/engine/offline.ts',
    'src/engine/achievements.ts',
    'src/engine/prestige.ts',
  ];

  const FORBIDDEN_PATTERNS = [
    { pattern: /\bwindow\b/, name: 'window global reference' },
    { pattern: /\bdocument\b/, name: 'document DOM reference' },
    { pattern: /\blocalStorage\b/, name: 'localStorage reference' },
    { pattern: /Date\.now/, name: 'Date.now non-deterministic call' },
    { pattern: /Math\.random/, name: 'Math.random non-deterministic call' },
    { pattern: /from\s+['"][^'"]*bridge[^'"]*['"]/, name: 'import from bridge' },
  ];

  it.each(PURE_ENGINE_FILES)(
    'ensures pure engine file %s contains no DOM, side-effects, or impure globals',
    (relPath) => {
      const fullPath = path.resolve(process.cwd(), relPath);
      expect(fs.existsSync(fullPath)).toBe(true);

      const content = fs.readFileSync(fullPath, 'utf8');

      // Strip comments before checking to avoid false positives in documentation
      const strippedContent = content
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*$/gm, '');

      for (const { pattern, name } of FORBIDDEN_PATTERNS) {
        const match = pattern.test(strippedContent);
        if (match) {
          throw new Error(
            `Architectural violation in ${relPath}: found forbidden pattern "${name}" (${pattern})`
          );
        }
        expect(match).toBe(false);
      }
    }
  );
});
