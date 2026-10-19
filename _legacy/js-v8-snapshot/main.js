/**
 * NEXYROTH CLICKER - MAIN GAME LOOP CONTROLLER (v8.0)
 * Pure JavaScript - 100% Offline, Zero Server Dependency
 * - Offline Earnings with 50% base efficiency + Bonuses engine (+100% max)
 * - Achievements auto-progress evaluation
 * - Mobile bottom navigation & quick modals
 */
(function (global) {
  'use strict';

  function initGame() {
    // 1. Load persisted game state
    global.GameState.load();

    // 2. Initialize multilingual i18n
    if (global.I18n) global.I18n.init();

    // 3. Sync Audio mute state to UI
    if (global.Sound && global.Sound.updateIcons) global.Sound.updateIcons();

    // 4. Offline progress calculation with 50% base efficiency (v8.0)
    calculateOfflineProgress();

    // 5. Initialize modules
    if (global.UIModals) global.UIModals.init();
    if (global.UICore) global.UICore.init();
    if (global.UIUpgrades) global.UIUpgrades.init();
    if (global.DailyRewards) global.DailyRewards.updateBadge();
    if (global.CosmicEvents) global.CosmicEvents.updateBadge();
    if (global.UIModals && global.UIModals.updateBackpackBadge) global.UIModals.updateBackpackBadge();

    // 6. Setup Mobile Bottom Navigation
    initMobileNav();

    // 7. Bind export zip button on header
    const exportZipBtn = document.getElementById('headerExportZipBtn');
    if (exportZipBtn && global.ZipExport) {
      exportZipBtn.onclick = function () {
        global.ZipExport.download();
      };
    }

    // 8. Start 100ms core game tick loop
    setInterval(gameTick, 100);

    // 9. Auto-save every 5 seconds
    setInterval(function () {
      global.GameState.save();
    }, 5000);
  }

  function initMobileNav() {
    const layout = document.querySelector('.game-layout');
    if (!layout) return;

    if (!layout.hasAttribute('data-mobile-tab')) {
      layout.setAttribute('data-mobile-tab', 'core');
    }

    const navItems = document.querySelectorAll('.mobile-nav-item');
    navItems.forEach(function (item) {
      item.addEventListener('click', function () {
        const tab = item.getAttribute('data-tab');
        if (!tab) return;

        if (tab === 'daily') {
          if (global.UIModals) global.UIModals.open('dailyRewardModal');
          if (global.Sound) global.Sound.playClick();
          return;
        }

        if (tab === 'inventory') {
          if (global.UIModals) global.UIModals.open('inventoryModal');
          if (global.Sound) global.Sound.playClick();
          return;
        }

        if (tab === 'shop' || tab === 'gemShop') {
          if (global.UIModals) global.UIModals.open('gemShopModal');
          if (global.Sound) global.Sound.playClick();
          return;
        }

        if (tab === 'event') {
          if (global.UIModals) global.UIModals.open('cosmicEventModal');
          if (global.Sound) global.Sound.playClick();
          return;
        }

        if (tab === 'settings') {
          if (global.UIModals) global.UIModals.open('settingsModal');
          if (global.Sound) global.Sound.playClick();
          return;
        }

        if (tab === 'stats') {
          if (global.UIModals) global.UIModals.open('statsModal');
          if (global.Sound) global.Sound.playClick();
          return;
        }

        layout.setAttribute('data-mobile-tab', tab);

        navItems.forEach(function (nav) {
          const navTab = nav.getAttribute('data-tab');
          if (navTab === tab) {
            nav.classList.add('is-active');
          } else if (navTab !== 'daily' && navTab !== 'event' && navTab !== 'settings') {
            nav.classList.remove('is-active');
          }
        });

        if (global.Sound) global.Sound.playClick();
      });
    });
  }

  function calculateOfflineProgress() {
    const state = global.GameState.get();
    if (!state.lastSaveTime) return;

    const now = Date.now();
    const elapsedSeconds = Math.max(0, (now - state.lastSaveTime) / 1000);

    // Only compute if offline for at least 10 seconds
    if (elapsedSeconds >= 10 && global.UICore) {
      const stats = global.UICore.calculateStats();
      const efficiency = global.Bonuses ? global.Bonuses.getOfflineEfficiency() : 0.50;
      const offlineGain = stats.cps * elapsedSeconds * efficiency;

      if (offlineGain > 0) {
        state.essence += offlineGain;
        state.totalEssence += offlineGain;
        state.lastOfflineGain = offlineGain;

        setTimeout(function () {
          const formatted = global.Numeric ? global.Numeric.format(offlineGain) : Math.floor(offlineGain);
          const mins = Math.max(1, Math.floor(elapsedSeconds / 60));
          const effPct = Math.round(efficiency * 100);
          const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;

          if (global.Toast) {
            const msg = isVi 
              ? `💤 Chào mừng trở lại! Vắng mặt ${mins} phút thu thập +${formatted} Năng Lượng (Hiệu suất ngoại tuyến: ${effPct}%)` 
              : `💤 Welcome back! Offline for ${mins} mins: +${formatted} Essence (Efficiency: ${effPct}%)`;
            global.Toast.show(msg, 'info');
          }
        }, 600);
      }
    }
  }

  function gameTick() {
    const state = global.GameState.get();
    const stats = global.UICore ? global.UICore.calculateStats() : { cps: 0, frenzyMultiplier: 1 };

    // 1. Passive CPS generation (dt = 0.1s)
    const tickGain = (stats.cps * stats.frenzyMultiplier) / 10;
    if (tickGain > 0) {
      state.essence += tickGain;
      state.totalEssence += tickGain;
    }

    // 2. Countdown active boosts
    if (state.activeBoosts.length > 0) {
      state.activeBoosts = state.activeBoosts.map(function (b) {
        return Object.assign({}, b, { remainingSeconds: b.remainingSeconds - 0.1 });
      }).filter(function (b) {
        return b.remainingSeconds > 0;
      });
    }

    // 2b. Countdown active potions
    if (state.activePotions) {
      Object.keys(state.activePotions).forEach(function (type) {
        if (state.activePotions[type] > 0) {
          if (type === 'auto_50ms' && global.UICore && global.UICore.isAutoClickerPaused && global.UICore.isAutoClickerPaused()) {
            return; // Pause timer countdown while auto-clicker is paused
          }
          state.activePotions[type] = Math.max(0, parseFloat((state.activePotions[type] - 0.1).toFixed(1)));
        }
      });
    }

    // 3. Countdown Boss battle timer if active
    const boss = global.GameState.getBoss();
    if (boss && boss.active) {
      boss.remainingTime = Math.max(0, parseFloat((boss.remainingTime - 0.1).toFixed(1)));
      if (boss.remainingTime <= 0) {
        boss.active = false;
        boss.currentHp = boss.maxHp;
        boss.remainingTime = boss.timeLimit;
        if (global.Sound) global.Sound.playError();
      }
    }

    // 4. Update Skill Cooldowns
    if (global.UICore) global.UICore.updateCooldowns(0.1);

    // 5. Update UI stats display
    if (global.UICore) global.UICore.updateStatsDisplay();

    // 6. Update achievements progress
    updateAchievementsProgress();

    // 7. Update Daily & Event badges
    if (global.DailyRewards) global.DailyRewards.updateBadge();
    if (global.CosmicEvents) global.CosmicEvents.updateBadge();
  }

  function updateAchievementsProgress() {
    const state = global.GameState.get();
    if (!state.achievements) return;

    const equippedRelicsCount = (state.relics || []).filter(function (r) { return r.equipped; }).length;
    const unlockedSkillsCount = (state.skills || []).filter(function (s) { return s.unlocked; }).length;
    const luckSkillUnlocked = (state.skills || []).some(function (s) { return s.branch === 'luck' && s.unlocked; });
    const unlockedAchievementsCount = state.achievements.filter(function (a) { return a.unlocked; }).length;

    state.achievements.forEach(function (ach) {
      if (ach.type === 'clicks') ach.current = state.totalClicks;
      if (ach.type === 'essence') ach.current = Math.floor(state.totalEssence);
      if (ach.type === 'level') ach.current = state.level;
      if (ach.type === 'bosses') ach.current = state.bossesDefeated;
      if (ach.type === 'boss_daily') ach.current = state.dailyBossesDefeated || 0;
      if (ach.type === 'crits') ach.current = state.totalCrits || 0;
      if (ach.type === 'upgrades') ach.current = state.totalUpgradesBought || 0;
      if (ach.type === 'prestige') ach.current = state.prestigeCount;
      if (ach.type === 'skills_unlocked') ach.current = unlockedSkillsCount;
      if (ach.type === 'luck_branch') ach.current = luckSkillUnlocked ? 1 : 0;
      if (ach.type === 'relics_equipped') ach.current = equippedRelicsCount;
      if (ach.type === 'achievements_count') ach.current = unlockedAchievementsCount;
      if (ach.type === 'potion_x100') ach.current = (state.activePotions && state.activePotions.x100 > 0) ? 1 : 0;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
  } else {
    initGame();
  }

  global.Main = {
    init: initGame
  };
})(typeof window !== 'undefined' ? window : this);
