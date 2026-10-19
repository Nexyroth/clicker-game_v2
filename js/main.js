/**
 * NEXYROTH CLICKER - MAIN GAME LOOP CONTROLLER (v8.0 / v9.0)
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

    // 4. Offline progress calculation with 50% base efficiency
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
    const stats = global.UICore ? global.UICore.calculateStats() : { cps: 0 };
    const efficiency = global.Bonuses ? global.Bonuses.getOfflineEfficiency() : 0.50;

    let offlineGain = 0;
    let elapsedSeconds = 0;

    if (global.Engine && global.Engine.offlineGain) {
      const outcome = global.Engine.offlineGain({
        lastSaveTime: state.lastSaveTime,
        now: now,
        cps: stats.cps,
        efficiency: efficiency
      });
      if (!outcome) return;
      offlineGain = outcome.gain;
      elapsedSeconds = outcome.elapsedSeconds;
    } else {
      elapsedSeconds = Math.max(0, (now - state.lastSaveTime) / 1000);
      if (elapsedSeconds < 10 || !global.UICore) return;
      offlineGain = stats.cps * elapsedSeconds * efficiency;
      if (offlineGain <= 0) return;
    }

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

  // Frame timing & catch-up state
  let lastFrameAt = 0;
  let accumulatorMs = 0;
  let hiddenSince = (typeof document !== 'undefined' && document.hidden) ? Date.now() : null;
  let hiddenAccumMs = 0;

  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (hiddenSince === null) {
          hiddenSince = Date.now();
        }
      } else {
        if (hiddenSince !== null) {
          hiddenAccumMs += Math.max(0, Date.now() - hiddenSince);
          hiddenSince = null;
        }
      }
    });
  }

  function resetCatchUp(initialLastFrameAt) {
    lastFrameAt = typeof initialLastFrameAt === 'number' ? initialLastFrameAt : 0;
    accumulatorMs = 0;
    hiddenSince = (typeof document !== 'undefined' && document.hidden) ? Date.now() : null;
    hiddenAccumMs = 0;
  }

  function gameTick() {
    const now = Date.now();
    const gapMs = lastFrameAt > 0 ? Math.max(0, now - lastFrameAt) : 100;
    lastFrameAt = now;

    let hiddenMs = hiddenAccumMs;
    hiddenAccumMs = 0;
    if (typeof document !== 'undefined' && document.hidden && hiddenSince !== null) {
      hiddenMs += Math.max(0, now - hiddenSince);
      hiddenSince = now;
    }
    hiddenMs = Math.min(gapMs, Math.max(0, hiddenMs));

    const plan = (global.Engine && global.Engine.planCatchUp)
      ? global.Engine.planCatchUp({ accumulatorMs: accumulatorMs, gapMs: gapMs, hiddenMs: hiddenMs })
      : {
          mode: 'ticks',
          steps: Math.min(1200, Math.floor((accumulatorMs + gapMs) / 100)),
          hiddenSteps: 0,
          visibleSteps: Math.min(1200, Math.floor((accumulatorMs + gapMs) / 100)),
          accumulatorMs: (accumulatorMs + gapMs) % 100,
          offlineSeconds: 0
        };

    accumulatorMs = plan.accumulatorMs;

    const state = global.GameState.get();

    if (plan.mode === 'offline') {
      const currentStats = global.UICore ? global.UICore.calculateStats() : { cps: 0 };
      const efficiency = global.Bonuses ? global.Bonuses.getOfflineEfficiency() : 0.50;
      if (global.Engine && global.Engine.offlineGain) {
        const outcome = global.Engine.offlineGain({
          lastSaveTime: now - gapMs,
          now: now,
          cps: currentStats.cps,
          efficiency: efficiency
        });
        if (outcome && outcome.gain > 0) {
          state.essence += outcome.gain;
          state.totalEssence += outcome.gain;
          state.lastOfflineGain = outcome.gain;

          if (global.Toast) {
            const formatted = global.Numeric ? global.Numeric.format(outcome.gain) : Math.floor(outcome.gain);
            const mins = Math.max(1, Math.floor(outcome.elapsedSeconds / 60));
            const effPct = Math.round(efficiency * 100);
            const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;
            const msg = isVi 
              ? `💤 Chào mừng trở lại! Vắng mặt ${mins} phút thu thập +${formatted} Năng Lượng (Hiệu suất ngoại tuyến: ${effPct}%)` 
              : `💤 Welcome back! Offline for ${mins} mins: +${formatted} Essence (Efficiency: ${effPct}%)`;
            global.Toast.show(msg, 'info');
          }
        }
      }
    } else {
      const maxSteps = 1200; // ACTIVE_CATCHUP_MAX_MS / TICK_MS
      const stepsToRun = Math.min(plan.steps, maxSteps);
      let bossExpiredTriggered = false;

      for (let i = 0; i < stepsToRun; i++) {
        const isHiddenStep = i < plan.hiddenSteps;
        const stats = (global.Engine && global.Engine.computeStats)
          ? global.Engine.computeStats(state)
          : (global.UICore ? global.UICore.calculateStats() : { cps: 0, frenzyMultiplier: 1 });

        const realBoss = global.GameState.getBoss ? global.GameState.getBoss() : null;
        const realAutoClickerPaused = !!(global.UICore && global.UICore.isAutoClickerPaused && global.UICore.isAutoClickerPaused());

        const stepBoss = (isHiddenStep && (global.Engine ? global.Engine.PAUSE_BOSS_WHILE_HIDDEN : true))
          ? null
          : realBoss;
        const stepAutoClickerPaused = (isHiddenStep && (global.Engine ? global.Engine.PAUSE_AUTOCLICK_POTION_WHILE_HIDDEN : true))
          ? true
          : realAutoClickerPaused;

        if (global.Engine && global.Engine.stepTick) {
          const outcome = global.Engine.stepTick({
            essence: state.essence,
            totalEssence: state.totalEssence,
            cps: stats.cps,
            frenzyMultiplier: stats.frenzyMultiplier,
            activeBoosts: state.activeBoosts,
            activePotions: state.activePotions,
            boss: stepBoss,
            autoClickerPaused: stepAutoClickerPaused
          });

          state.essence = outcome.essence;
          state.totalEssence = outcome.totalEssence;
          if (outcome.activeBoosts !== null) {
            state.activeBoosts = outcome.activeBoosts;
          }
          if (outcome.activePotions !== null && state.activePotions) {
            Object.assign(state.activePotions, outcome.activePotions);
          }
          if (realBoss && outcome.boss !== null) {
            realBoss.remainingTime = outcome.boss.remainingTime;
            if (outcome.boss.active !== undefined) {
              realBoss.active = outcome.boss.active;
            }
            if (outcome.boss.currentHp !== undefined) {
              realBoss.currentHp = outcome.boss.currentHp;
            }
          }
          if (outcome.bossExpired) {
            bossExpiredTriggered = true;
          }
        }
      }

      if (bossExpiredTriggered && global.Sound && global.Sound.playError) {
        global.Sound.playError();
      }
    }

    // 4. Update Skill Cooldowns (linear dt across all steps)
    if (plan.steps > 0 && global.UICore && global.UICore.updateCooldowns) {
      global.UICore.updateCooldowns(plan.steps * 0.1);
    }

    // 5. Update highestCps & UI stats display
    if (global.UICore && global.UICore.calculateStats) {
      global.UICore.calculateStats();
    }
    if (global.UICore && global.UICore.updateStatsDisplay) {
      global.UICore.updateStatsDisplay();
    }

    // 6. Update achievements progress
    updateAchievementsProgress();

    // 7. Update Daily & Event badges
    if (global.DailyRewards && global.DailyRewards.updateBadge) global.DailyRewards.updateBadge();
    if (global.CosmicEvents && global.CosmicEvents.updateBadge) global.CosmicEvents.updateBadge();
  }

  function updateAchievementsProgress() {
    const state = global.GameState.get();
    if (!state.achievements) return;

    if (global.Engine && global.Engine.achievementCurrents) {
      const currents = global.Engine.achievementCurrents(state);
      if (currents && currents.length === state.achievements.length) {
        for (let i = 0; i < state.achievements.length; i++) {
          const val = currents[i];
          if (val !== undefined) {
            state.achievements[i].current = val;
          }
        }
        return;
      }
    }

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
      if (ach.type === 'potions_used') ach.current = state.potionsUsed || 0;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
  } else {
    initGame();
  }

  global.Main = {
    init: initGame,
    gameTick: gameTick,
    resetCatchUp: resetCatchUp,
  };
})(typeof window !== 'undefined' ? window : this);
