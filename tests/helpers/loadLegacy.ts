import fs from 'fs';
import path from 'path';
import { vi } from 'vitest';
import { Toast } from '../../src/ui/toast';
import { Numeric } from '../../src/core/numeric';
import { Bonuses } from '../../src/engine/bonuses';
import { Engine } from '../../src/engine/api';
import { createGameStateStore, LocalStorageSaveRepository } from '../../src/engine/state/gameState';

const LEGACY_FILES = [
  'js/i18n.js',
  'js/daily.js',
  'js/events.js',
  'js/ui-core.js',
  'js/ui-upgrades.js',
  'js/ui-modals.js',
];

export function setupLegacyDom(): void {
  document.body.innerHTML = `
    <div id="headerEssence"></div>
    <div id="headerShards"></div>
    <div id="headerGems"></div>
    <div id="panelLevel"></div>
    <div id="panelExpText"></div>
    <div id="panelExpBar" style="width: 0%;"></div>
    <div id="skillPointsBanner" style="display: none;"></div>
    <div id="skillPointsCount"></div>
    <div id="panelClickPower"></div>
    <div id="panelCps"></div>
    <div id="coreClickRate"></div>
    <div id="coreCritRate"></div>
    <div id="activePotionsBar"></div>
    <div id="comboMultiplierBar"></div>
    <div id="comboIcon"></div>
    <div id="comboBadgeHits"></div>
    <div id="comboCpsText"></div>
    <div id="comboMultiplierText"></div>
    <div id="comboGaugeBar" style="width: 0%;"></div>
    <div id="comboMilestoneLabel"></div>
    <div id="comboDecayText"></div>
    <div id="comboMilestoneTooltip"></div>
    <div id="coreSphereContainer"></div>
    <div id="coreSphere"></div>
    <div id="critFlashOverlay"></div>
    <div id="floatingNumbersLayer"></div>
    <div id="bossBattleArea" style="display: none;"></div>
    <div id="bossName"></div>
    <div id="bossTimerText"></div>
    <div id="bossHpBar" style="width: 100%;"></div>
    <div id="bossHpText"></div>
    <div id="summonBossBtn" style="display: none;"></div>
    <div id="bossSummonName"></div>
    <div id="skillOverloadBtn"></div>
    <div id="skillSurgeBtn"></div>
    <div id="skillWarpBtn"></div>
    <div id="overloadCdOverlay"></div>
    <div id="surgeCdOverlay"></div>
    <div id="warpCdOverlay"></div>
    <div id="upgradesList"></div>
    <div id="dailyBadgeDot"></div>
    <div id="eventBadgeDot"></div>
    <div id="backpackBadgeCount"></div>
    <div id="mobileBackpackDot"></div>
    <div id="mobileDailyDot"></div>
    <div id="skillPointsBadge"></div>
    <div id="relicsEquippedBadge"></div>
    <div id="achievementsCountBadge"></div>
    <div id="dailyRewardModal" class="nx-modal-backdrop"><div id="dailyModalContent"></div></div>
    <div id="cosmicEventModal" class="nx-modal-backdrop"><div id="cosmicEventModalContent"></div></div>
    <div id="settingsModal" class="nx-modal-backdrop"><div id="settingsModalContent"></div></div>
    <div id="gemShopModal" class="nx-modal-backdrop"><div id="gemShopModalContent"></div></div>
    <div id="simulatedPaymentModal" class="nx-modal-backdrop"><div id="simulatedPaymentModalContent"></div></div>
    <div id="bossModal" class="nx-modal-backdrop"></div>
    <div id="skillsModal" class="nx-modal-backdrop"><div id="skillsModalContent"></div></div>
    <div id="inventoryModal" class="nx-modal-backdrop"><div id="inventoryModalContent"></div></div>
    <div id="prestigeModal" class="nx-modal-backdrop"><div id="prestigeModalContent"></div></div>
    <div id="achievementsModal" class="nx-modal-backdrop"><div id="achievementsModalContent"></div></div>
    <div id="statsModal" class="nx-modal-backdrop"><div id="statsModalContent"></div></div>
    <div class="game-layout" data-mobile-tab="core"></div>
  `;
}

export function loadLegacy(): {
  GameState: any;
  UICore: any;
  UIModals: any;
  UIUpgrades: any;
  Bonuses: any;
  Numeric: any;
  Engine: any;
  I18n: any;
  DailyRewards: any;
  CosmicEvents: any;
  Toast: any;
} {
  vi.resetModules();
  localStorage.clear();

  const gameWindow = window as any;
  delete gameWindow.GameState;
  delete gameWindow.UICore;
  delete gameWindow.UI;
  delete gameWindow.UIModals;
  delete gameWindow.UIUpgrades;
  delete gameWindow.Bonuses;
  delete gameWindow.Numeric;
  delete gameWindow.I18n;
  delete gameWindow.Sound;
  delete gameWindow.DailyRewards;
  delete gameWindow.CosmicEvents;
  delete gameWindow.Toast;

  setupLegacyDom();

  vi.spyOn(Math, 'random').mockReturnValue(0.5);

  gameWindow.Toast = Toast;
  gameWindow.Numeric = Numeric;
  gameWindow.Bonuses = Bonuses;

  gameWindow.Sound = new Proxy(
    {
      playClick: vi.fn(),
      playCrit: vi.fn(),
      playLevelUp: vi.fn(),
      playBossHit: vi.fn(),
      playBossDefeat: vi.fn(),
      playUpgrade: vi.fn(),
      playAchievement: vi.fn(),
      playError: vi.fn(),
      playCoin: vi.fn(),
      playWarp: vi.fn(),
      playSkill: vi.fn(),
      playModalClose: vi.fn(),
      playModalOpen: vi.fn(),
      updateIcons: vi.fn(),
    } as any,
    {
      get(target, prop) {
        if (!(prop in target)) {
          target[prop] = vi.fn();
        }
        return target[prop];
      },
    }
  );

  gameWindow.window = gameWindow;
  gameWindow.global = gameWindow;

  const gs = createGameStateStore({ repo: new LocalStorageSaveRepository() });
  gameWindow.GameState = gs;
  gameWindow.Engine = Engine;
  if (typeof window !== 'undefined') {
    (window as any).GameState = gs;
    (window as any).Engine = Engine;
  }

  for (const relPath of LEGACY_FILES) {
    const fullPath = path.resolve(process.cwd(), relPath);
    const code = fs.readFileSync(fullPath, 'utf8');
    const runner = new Function('window', 'document', 'localStorage', 'globalThis', code);
    runner(gameWindow, document, localStorage, gameWindow);
  }

  return {
    GameState: gameWindow.GameState,
    UICore: gameWindow.UICore,
    UIModals: gameWindow.UIModals,
    UIUpgrades: gameWindow.UIUpgrades,
    Bonuses: gameWindow.Bonuses,
    Numeric: gameWindow.Numeric,
    Engine: gameWindow.Engine,
    I18n: gameWindow.I18n,
    DailyRewards: gameWindow.DailyRewards,
    CosmicEvents: gameWindow.CosmicEvents,
    Toast: gameWindow.Toast,
  };
}
