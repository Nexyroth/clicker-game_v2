/**
 * NEXYROTH CLICKER - MAIN CORE & CLICK GAME FEEL (v8.0)
 * Pure JavaScript - 60 FPS DOM Object Pooling, Cosmic Ripples, Particle Sparks
 * Visual Juice (v8.2/v8.0):
 * - Crit animation bounce on button: animate-click-crit
 * - Expanding ripple wave ring on click (GPU CSS)
 * - Neon blinking glow on Core button when buffs are active (has-active-buffs)
 * - Floating crit numbers: higher flight, slight tilt, neon glow
 * - Spacebar to click Core (no page scroll, anti-double click)
 * - Number keys 1-4 shortcuts for Skills, Backpack, Shop, Events
 * - Personal Records (Kỷ Lục Cá Nhân) tracker
 * - Boss Tiers: Normal (85%), Rare (12%), Daily Boss (3%) + Milestone Overlords (every 10 levels)
 * - Item and Gem drops on click using Bonuses engine
 */
(function (global) {
  'use strict';

  const POOL_SIZE = 35;
  let poolElements = [];
  let poolIndex = 0;
  let floatingContainer = null;
  let coreSphereEl = null;

  // Active skill cooldowns in seconds
  const skillCooldowns = {
    overload: 0,
    surge: 0,
    warp: 0
  };

  // Rolling click timestamps for maxClicksIn10s personal record
  const clickTimestamps = [];

  // Combo Multiplier & Game Feel
  let comboHits = 0;
  let comboMultiplier = 1.0;
  let lastClickTime = 0;
  let comboDecayInterval = null;
  let milestoneTimeout = null;
  const COMBO_RESET_MS = 3000;

  // Drop internal cooldowns & anti-spam throttle (Anti-inflation)
  let lastPotionDropTime = 0;
  let lastGemDropTime = 0;
  let lastAutoSoundTime = 0;
  let lastAutoFloatTime = 0;
  let isAutoClickerPaused = false;
  const POTION_DROP_COOLDOWN_MS = 60000; // 60s ICD between random potion drops
  const GEM_DROP_COOLDOWN_MS = 90000;    // 90s ICD between core gem drops

  function initFloatingPool() {
    floatingContainer = document.getElementById('floatingNumbersLayer');
    if (!floatingContainer) return;

    floatingContainer.innerHTML = '';
    poolElements = [];

    for (let i = 0; i < POOL_SIZE; i++) {
      const el = document.createElement('div');
      el.className = 'floating-number';
      el.style.display = 'none';
      floatingContainer.appendChild(el);
      poolElements.push(el);
    }
  }

  function spawnFloatingNumber(x, y, text, isCrit) {
    if (!floatingContainer || poolElements.length === 0) return;
    const state = global.GameState.get();
    if (!state.settings.floatingNumbers) return;

    const el = poolElements[poolIndex];
    poolIndex = (poolIndex + 1) % POOL_SIZE;

    el.style.display = 'none';
    void el.offsetWidth; // Force reflow

    const scatterX = (Math.random() - 0.5) * 60;
    const rotation = isCrit ? ((Math.random() - 0.5) * 16) : 0;

    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.setProperty('--scatter-x', scatterX + 'px');
    el.style.setProperty('--crit-rot', rotation + 'deg');

    if (isCrit) {
      el.textContent = '★ ' + text + ' CRIT!';
      el.className = 'floating-number crit crit-enhanced';
    } else {
      el.textContent = '+' + text;
      el.className = 'floating-number';
    }

    el.style.display = 'block';

    setTimeout(function () {
      el.style.display = 'none';
    }, isCrit ? 1000 : 850);
  }

  function spawnRipple(x, y) {
    const container = document.getElementById('coreSphereContainer');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const relX = x - rect.left;
    const relY = y - rect.top;

    const ripple = document.createElement('div');
    ripple.className = 'ripple-wave';
    ripple.style.left = relX + 'px';
    ripple.style.top = relY + 'px';
    container.appendChild(ripple);

    setTimeout(function () {
      if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
    }, 600);
  }

  function calculateStats() {
    const state = global.GameState.get();

    let baseClick = 1;
    let baseCps = 0;

    // 1. Upgrades contribution (41 Upgrades)
    state.upgrades.forEach(function (u) {
      if (u.level > 0) {
        if (u.effectType === 'click') {
          baseClick += u.level * u.baseEffect;
        } else if (u.effectType === 'cps') {
          baseCps += u.level * u.baseEffect;
        }
      }
    });

    // 2. Relic bonuses (27 Relics, max 4 equipped)
    let relicClickMult = 1;
    let relicCpsMult = 1;
    let relicCritBonus = 0;

    state.relics.forEach(function (r) {
      if (r.equipped) {
        if (r.clickBonus) relicClickMult += r.clickBonus;
        if (r.cpsBonus) relicCpsMult += r.cpsBonus;
        if (r.critBonus) relicCritBonus += r.critBonus;
      }
    });

    // 3. Skills tree bonuses (4 Celestial branches + Core)
    let skillClickMult = 1;
    let skillCpsMult = 1;
    let skillCritBonus = 0;
    let skillCritDamageBonus = 0;

    state.skills.forEach(function (s) {
      if (s.unlocked) {
        const lvl = s.level || 1;
        if (s.id === 'chrono_pulse') skillCpsMult += lvl * 0.10;
        if (s.id === 'chrono_overclock') skillClickMult += lvl * 0.10;
        if (s.id === 'crit_focus') skillCritBonus += lvl * 0.05;
        if (s.id === 'crit_supernova') skillCritDamageBonus += lvl * 1.00;
        if (s.id === 'crit_chain') skillClickMult += lvl * 0.35;
        if (s.id === 'overdrive_synergy') skillCpsMult += lvl * 0.01 * (state.skillPoints || 0);
        if (s.id === 'overdrive_zenith') {
          skillClickMult += lvl * 0.05;
          skillCpsMult += lvl * 0.05;
          skillCritBonus += lvl * 0.02;
        }
        if (s.effectType === 'clickPower' && s.id !== 'crit_chain') skillClickMult += (s.effectPerLevel || 0.1) * lvl;
        if (s.effectType === 'cps' && s.id !== 'chrono_pulse') skillCpsMult += (s.effectPerLevel || 0.1) * lvl;
        if (s.effectType === 'critChance' && s.id !== 'crit_focus') skillCritBonus += (s.effectPerLevel || 0.05) * lvl;
      }
    });

    // 4. Achievement real buff (+0.5% per unlocked achievement)
    const achBuffPercent = global.Bonuses ? global.Bonuses.getAchievementBuffPercent() : 0;
    const achMultiplier = 1 + (achBuffPercent / 100);

    // 5. Prestige shards bonus (+1% all per shard)
    const shardMult = 1 + (state.astralShards * 0.01);

    // 6. Gem shop multipliers
    let gemMult = 1;
    state.gemShopItems.forEach(function (item) {
      if (item.purchased && item.id === 'gem_mult_1') gemMult *= item.value;
      if (item.purchased && item.id === 'gem_crit_overload') relicCritBonus += 0.10;
    });

    // 7. Active temporary boosts
    let frenzyMultiplier = 1;
    state.activeBoosts.forEach(function (b) {
      if (b.multiplier) frenzyMultiplier *= b.multiplier;
    });

    // 8. Timed Multiplier Potions (ADDITIVE: e.g. x2 + x50 = 52!)
    let potionMultiplierSum = 0;
    if (state.activePotions) {
      if (state.activePotions.x2 > 0) potionMultiplierSum += 2;
      if (state.activePotions.x5 > 0) potionMultiplierSum += 5;
      if (state.activePotions.x10 > 0) potionMultiplierSum += 10;
      if (state.activePotions.x20 > 0) potionMultiplierSum += 20;
      if (state.activePotions.x50 > 0) potionMultiplierSum += 50;
      if (state.activePotions.x100 > 0) potionMultiplierSum += 100;
    }
    const potionMult = potionMultiplierSum > 0 ? potionMultiplierSum : 1;

    // 9. Permanent VIP Game Passes
    let passEssenceMult = 1;
    let passCritChanceBonus = 0;
    let passCritDamageBonus = 0;
    if (state.gamePasses) {
      if (state.gamePasses.pass_double_essence || state.gamePasses.pass_ultimate_bundle) {
        passEssenceMult *= 2;
      }
      if (state.gamePasses.pass_crit_overdrive || state.gamePasses.pass_ultimate_bundle) {
        passCritChanceBonus += 0.10;
        passCritDamageBonus += 1.50;
      }
    }

    const finalClick = baseClick * relicClickMult * skillClickMult * shardMult * gemMult * potionMult * achMultiplier * passEssenceMult;
    const finalCps = baseCps * relicCpsMult * skillCpsMult * shardMult * gemMult * potionMult * achMultiplier * passEssenceMult;
    const critChance = Math.min(0.95, 0.05 + relicCritBonus + skillCritBonus + passCritChanceBonus);
    const critMult = 2.5 + skillCritDamageBonus + passCritDamageBonus;

    // Update Personal Record: Highest CPS
    if (state.records && finalCps > (state.records.highestCps || 0)) {
      state.records.highestCps = finalCps;
    }

    return {
      clickPower: finalClick,
      cps: finalCps,
      critChance: critChance,
      critMultiplier: critMult,
      frenzyMultiplier: frenzyMultiplier,
      potionMultiplierSum: potionMultiplierSum,
      potionMultiplier: potionMult,
      achMultiplier: achMultiplier,
      achBuffPercent: achBuffPercent
    };
  }

  function updateComboState(now) {
    comboHits++;
    lastClickTime = now;

    // Calculate rolling CPS from clicks in last 1.5s
    const recentClicks = clickTimestamps.filter(function (t) { return now - t <= 1500; }).length;
    const activeCps = Number((recentClicks / 1.5).toFixed(1));

    // Multiplier calculation (base grows per 10 hits + active CPS speed bonus)
    const tier = Math.floor(comboHits / 10);
    const progressInTier = comboHits % 10;
    const baseComboMult = 1.0 + tier * 0.2 + progressInTier * 0.015;
    const cpsBonus = Math.min(1.5, Math.max(0, (activeCps - 1) * 0.08));
    const rawMult = baseComboMult + cpsBonus;

    // INFINITE COMBO SCALING (Tăng vô hạn từ x10 trở lên nhưng cực kỳ chậm và lâu)
    let finalMult = 1.0;
    if (rawMult <= 10.0) {
      finalMult = Math.max(1.0, rawMult);
    } else {
      // Từ x10 trở lên: TĂNG VÔ HẠN nhưng tốc độ tăng giảm dần theo hàm logarithm sâu
      // Càng lên cao người chơi càng phải nỗ lực duy trì nhịp click liên tục để đạt từng 0.1x
      const excess = rawMult - 10.0;
      const slowScaling = Math.log10(1 + excess * 0.25) * 2.0;
      finalMult = 10.0 + slowScaling;
    }
    comboMultiplier = Number(finalMult.toFixed(2));

    // Check Milestone (every 10 hits)
    if (comboHits % 10 === 0) {
      showComboMilestone(comboHits, comboMultiplier);
    }

    updateComboDisplay(activeCps, 3.0);

    // Start decay checker if not running
    if (!comboDecayInterval) {
      comboDecayInterval = setInterval(checkComboDecay, 50);
    }
  }

  function checkComboDecay() {
    const now = Date.now();
    const elapsed = now - lastClickTime;
    const remainingMs = COMBO_RESET_MS - elapsed;

    if (remainingMs <= 0) {
      comboHits = 0;
      comboMultiplier = 1.0;
      if (comboDecayInterval) {
        clearInterval(comboDecayInterval);
        comboDecayInterval = null;
      }
      updateComboDisplay(0, 0);
    } else {
      const recentClicks = clickTimestamps.filter(function (t) { return now - t <= 1500; }).length;
      const activeCps = Number((recentClicks / 1.5).toFixed(1));
      updateComboDisplay(activeCps, remainingMs / 1000);
    }
  }

  function updateComboDisplay(activeCps, remainingSeconds) {
    const comboBar = document.getElementById('comboMultiplierBar');
    const badgeHits = document.getElementById('comboBadgeHits');
    const cpsText = document.getElementById('comboCpsText');
    const multText = document.getElementById('comboMultiplierText');
    const gaugeBar = document.getElementById('comboGaugeBar');
    const decayText = document.getElementById('comboDecayText');
    const label = document.getElementById('comboMilestoneLabel');
    const icon = document.getElementById('comboIcon');

    if (!comboBar) return;

    const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;

    if (comboHits > 0) {
      if (badgeHits) {
        badgeHits.style.display = 'inline-block';
        badgeHits.textContent = `${comboHits} ${isVi ? 'Đòn' : 'Hits'}`;
      }
      if (cpsText) {
        cpsText.style.display = 'inline-block';
        cpsText.textContent = `${activeCps} CPS`;
      }
      if (multText) {
        multText.textContent = `${comboMultiplier.toFixed(2)}x`;
        multText.style.color = comboHits >= 50 ? '#f43f5e' : (comboHits >= 20 ? '#fbbf24' : '#38bdf8');
        multText.style.boxShadow = comboHits >= 20 ? '0 0 12px rgba(251,191,36,0.4)' : 'none';
      }
      if (icon) {
        icon.style.color = comboHits >= 50 ? '#f43f5e' : (comboHits >= 20 ? '#fbbf24' : '#38bdf8');
      }
      if (gaugeBar) {
        const progress = ((comboHits % 10) / 10) * 100;
        gaugeBar.style.width = `${Math.max(10, progress === 0 ? 100 : progress)}%`;
        gaugeBar.style.background = comboHits >= 50
          ? 'linear-gradient(90deg, #f43f5e, #fbbf24)'
          : (comboHits >= 20 ? 'linear-gradient(90deg, #fbbf24, #f59e0b)' : 'linear-gradient(90deg, #38bdf8, #818cf8)');
      }
      if (decayText) {
        decayText.textContent = `${isVi ? 'Hồi phục' : 'Decay'}: ${remainingSeconds.toFixed(1)}s`;
        decayText.style.color = remainingSeconds < 1.0 ? '#f43f5e' : '#94a3b8';
      }
      if (label) {
        const nextMilestone = Math.ceil((comboHits + 0.1) / 10) * 10;
        label.textContent = isVi ? `Mốc tiếp theo: ${nextMilestone} đòn` : `Next milestone: ${nextMilestone} hits`;
      }
    } else {
      if (badgeHits) badgeHits.style.display = 'none';
      if (cpsText) cpsText.style.display = 'none';
      if (multText) {
        multText.textContent = '1.00x';
        multText.style.color = '#38bdf8';
        multText.style.boxShadow = 'none';
      }
      if (icon) icon.style.color = '#94a3b8';
      if (gaugeBar) gaugeBar.style.width = '0%';
      if (decayText) decayText.textContent = isVi ? 'Nghỉ: 3.0s' : 'Idle: 3.0s';
      if (label) label.textContent = isVi ? 'Nhấp để kích hoạt Combo' : 'Click to build combo';
    }
  }

  function showComboMilestone(hits, mult) {
    const tooltip = document.getElementById('comboMilestoneTooltip');
    if (!tooltip) return;

    const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;
    tooltip.innerHTML = `
      <div style="padding: 0.45rem 1rem; border-radius: 1rem; background: rgba(15,23,42,0.96); border: 2px solid #fbbf24; box-shadow: 0 0 30px rgba(251,191,36,0.7); display: flex; align-items: center; gap: 0.6rem; backdrop-filter: blur(12px);">
        <span style="font-size: 1.25rem;">🔥</span>
        <div>
          <div style="color: #fbbf24; font-weight: 900; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;">
            ${isVi ? `MỐC COMBO: ${hits} ĐÒN!` : `COMBO MILESTONE: ${hits} HITS!`}
          </div>
          <div style="color: #38bdf8; font-weight: 800; font-size: 0.8125rem; font-family: monospace;">
            ${isVi ? 'Hệ số tăng cường:' : 'Temporary Multiplier:'} <span style="color: #fff; font-weight: 900;">${mult.toFixed(2)}x</span>
          </div>
        </div>
      </div>
    `;
    tooltip.style.display = 'block';
    tooltip.classList.remove('combo-milestone-tooltip');
    void tooltip.offsetWidth;
    tooltip.classList.add('combo-milestone-tooltip');

    if (global.Sound) global.Sound.playAchievement();

    if (milestoneTimeout) clearTimeout(milestoneTimeout);
    milestoneTimeout = setTimeout(function () {
      if (tooltip) tooltip.style.display = 'none';
    }, 2200);
  }

  function handleCoreClick(e, isAuto) {
    const state = global.GameState.get();
    const stats = calculateStats();
    const now = Date.now();

    // Update Combo streak & multiplier
    updateComboState(now);
    const activeComboMult = comboMultiplier > 0 ? comboMultiplier : 1.0;

    // Check critical strike
    const isCrit = Math.random() < stats.critChance;
    let critCollapseMult = 1;
    if (isCrit && state.skills && state.skills.some(function (s) { return s.id === 'crit_collapse' && s.unlocked; })) {
      critCollapseMult = 2; // Singularity Collapse: all critical clicks double (x2) total Essence harvested
    }
    let clickGain = stats.clickPower * (isCrit ? stats.critMultiplier : 1) * critCollapseMult * stats.frenzyMultiplier * activeComboMult;

    // Chain Reaction extra hit: 20% chance on crit to strike with 50% extra dmg
    if (isCrit && state.skills && state.skills.some(function (s) { return s.id === 'crit_chain' && s.unlocked; })) {
      if (Math.random() < 0.20) {
        const chainGain = clickGain * 0.50;
        state.essence += chainGain;
        state.totalEssence += chainGain;
        setTimeout(function () {
          spawnFloatingNumber(clientX + 22, clientY - 18, `+${global.Numeric ? global.Numeric.format(chainGain) : Math.round(chainGain)} (Chain ⚡)`, true);
        }, 90);
      }
    }

    state.essence += clickGain;
    state.totalEssence += clickGain;
    state.totalClicks++;

    // Track rolling clicks for personal record (max clicks in 10s)
    clickTimestamps.push(now);
    while (clickTimestamps.length > 0 && clickTimestamps[0] < now - 10000) {
      clickTimestamps.shift();
    }
    if (state.records && clickTimestamps.length > (state.records.maxClicksIn10s || 0)) {
      state.records.maxClicksIn10s = clickTimestamps.length;
    }

    // Track highest single click
    if (state.records && clickGain > (state.records.highestClick || 0)) {
      state.records.highestClick = clickGain;
    }

    // Audio Feedback (throttled for automated clicks to prevent audio stutter)
    if (isAuto) {
      if (isCrit) {
        if (now - lastAutoSoundTime > 160) {
          if (global.Sound) global.Sound.playCrit();
          lastAutoSoundTime = now;
        }
      } else {
        if (now - lastAutoSoundTime > 320) {
          if (global.Sound) global.Sound.playClick();
          lastAutoSoundTime = now;
        }
      }
    } else {
      if (isCrit) {
        if (global.Sound) global.Sound.playCrit();
      } else {
        if (global.Sound) global.Sound.playClick();
      }
    }

    // Bright White Flash on Critical Hit
    if (isCrit) {
      const flash = document.getElementById('critFlashOverlay');
      if (flash) {
        flash.style.display = 'block';
        flash.classList.remove('crit-flash-overlay');
        void flash.offsetWidth;
        flash.classList.add('crit-flash-overlay');
        setTimeout(function () {
          if (flash) flash.style.display = 'none';
        }, 160);
      }
    }

    // EXP progression
    state.currentExp += Math.max(1, Math.floor(clickGain * 0.02));
    if (state.currentExp >= state.maxExp) {
      state.level++;
      state.currentExp = state.currentExp - state.maxExp;
      state.maxExp = Math.floor(state.maxExp * 1.35);
      state.skillPoints++;
      if (global.Sound) global.Sound.playLevelUp();
      if (global.Toast) {
        const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;
        global.Toast.show(isVi ? `🎉 THĂNG CẤP! Bạn đạt Cấp ${state.level} (+1 Điểm Kỹ Năng)` : `🎉 LEVEL UP! You reached Level ${state.level} (+1 SP)`, 'success');
      }
    }

    // BALANCED RANDOM ITEM DROP: Internal Cooldown 60s (Anti-flood)
    if (now - lastPotionDropTime >= POTION_DROP_COOLDOWN_MS) {
      const itemDropChance = global.Bonuses ? global.Bonuses.getItemDropChance() : 0.015;
      const shouldRoll = isAuto ? (Math.random() < 0.003) : (Math.random() < (itemDropChance * 0.3));
      if (shouldRoll) {
        lastPotionDropTime = now;
        rollRandomItemDrop();
      }
    }

    // BALANCED RANDOM GEM DROP: Internal Cooldown 90s (Precious currency, exactly 1 Gem)
    if (now - lastGemDropTime >= GEM_DROP_COOLDOWN_MS) {
      const gemDropChance = global.Bonuses ? global.Bonuses.getGemDropChance() : 0.005;
      const shouldRoll = isAuto ? (Math.random() < 0.001) : (Math.random() < (gemDropChance * 0.2));
      if (shouldRoll) {
        lastGemDropTime = now;
        const dropGems = 1; // Always 1 Gem to maintain scarcity
        state.astralGems += dropGems;
        if (global.Toast) {
          const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;
          global.Toast.show(isVi ? `💎 Nhặt được +1 Đá Quý hiếm từ Lõi!` : `💎 Rare find: +1 Astral Gem from Core!`, 'info');
        }
      }
    }

    // Boss damage if boss fight active (with Boss Damage Multiplier!)
    const boss = global.GameState.getBoss();
    if (boss && boss.active) {
      const bossMult = global.Bonuses ? global.Bonuses.getBossDamageMultiplier() : 1.0;
      const bossDamage = clickGain * bossMult;
      boss.currentHp = Math.max(0, boss.currentHp - bossDamage);

      if (boss.currentHp <= 0) {
        // Boss Defeated!
        boss.active = false;
        state.bossesDefeated++;

        // Tier reward multipliers
        let rewardMult = 1.0;
        if (boss.tier === 'rare') rewardMult = 2.0;
        if (boss.tier === 'daily') {
          rewardMult = 5.0;
          state.dailyBossesDefeated = (state.dailyBossesDefeated || 0) + 1;
          const today = new Date().toISOString().slice(0, 10);
          state.lastDailyBossDate = today;
        }
        if (boss.isMilestone) rewardMult *= 1.5;

        const earnedGems = Math.round(boss.rewardGems * rewardMult);
        const earnedShards = Math.round(boss.rewardShards * rewardMult);
        const earnedExp = Math.round(boss.rewardExp * rewardMult);

        state.astralGems += earnedGems;
        state.astralShards += earnedShards;
        state.totalAstralShards += earnedShards;
        state.currentExp += earnedExp;

        if (global.Sound) global.Sound.playBossDefeat();
        if (global.Toast) {
          const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;
          global.Toast.show(isVi ? `🏆 HẠ GỤC ${boss.name}! Nhận +${earnedGems} 💎, +${earnedShards} Shards` : `🏆 DEFEATED ${boss.name}! +${earnedGems} Gems, +${earnedShards} Shards`, 'success');
        }

        // Track in events
        if (global.CosmicEvents) global.CosmicEvents.track('bosses', 1);

        // Spawn next boss with level scaling and tier roll
        spawnNextBoss(boss.level + 1);
      } else {
        if (!isAuto && global.Sound) global.Sound.playBossHit();
      }
    }

    // Track in event quests
    if (global.CosmicEvents) {
      global.CosmicEvents.track('clicks', 1);
      if (isCrit) global.CosmicEvents.track('crits', 1);
      global.CosmicEvents.track('essence', clickGain);
    }

    // Visual feedback: coordinates
    let clientX = e ? e.clientX : null;
    let clientY = e ? e.clientY : null;
    if (e && e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    if (!clientX && coreSphereEl) {
      const rect = coreSphereEl.getBoundingClientRect();
      clientX = rect.left + rect.width / 2;
      clientY = rect.top + rect.height / 2;
    }

    // Visual feedback throttling for automated clicks
    const canSpawnVisual = !isAuto || isCrit || (now - lastAutoFloatTime > 200);
    if (clientX && clientY && canSpawnVisual) {
      if (isAuto) lastAutoFloatTime = now;
      const text = global.Numeric ? global.Numeric.format(clickGain) : Math.floor(clickGain);
      spawnFloatingNumber(clientX, clientY, text, isCrit);
      if (!isAuto) spawnRipple(clientX, clientY);
    }

    // Visual Juice: Press / Crit animation bounce
    if (coreSphereEl) {
      if (!isAuto) {
        coreSphereEl.classList.remove('is-pressing', 'animate-click-crit');
        void coreSphereEl.offsetWidth;
        if (isCrit) {
          coreSphereEl.classList.add('animate-click-crit');
          setTimeout(function () {
            if (coreSphereEl) coreSphereEl.classList.remove('animate-click-crit');
          }, 180);
        } else {
          coreSphereEl.classList.add('is-pressing');
          setTimeout(function () {
            if (coreSphereEl) coreSphereEl.classList.remove('is-pressing');
          }, 90);
        }
      }
    }

    updateStatsDisplay();
  }

  function rollRandomItemDrop() {
    const state = global.GameState.get();
    // Rebalanced drop rates: 85% x2, 12% x5, 3% x10 (Auto 50ms is NOT dropped freely)
    const roll = Math.random();
    let randomKey = 'potion_x2';
    if (roll < 0.85) {
      randomKey = 'potion_x2';
    } else if (roll < 0.97) {
      randomKey = 'potion_x5';
    } else {
      randomKey = 'potion_x10';
    }

    if (!state.potions) state.potions = {};
    state.potions[randomKey] = (state.potions[randomKey] || 0) + 1;
    if (global.Toast) {
      const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;
      const meta = (global.GameState.getPotionMetadata ? global.GameState.getPotionMetadata() : []).find(function (p) { return p.id === randomKey; });
      const name = meta ? (isVi ? meta.nameVi : meta.nameEn) : 'Thuốc Tinh Tú';
      global.Toast.show(isVi ? `🎁 Rơi vật phẩm ngẫu nhiên: +1 ${name} vào Balo!` : `🎁 Lucky drop: +1 ${name} added to Backpack!`, 'info');
    }
  }

  function spawnNextBoss(nextLevel) {
    const today = new Date().toISOString().slice(0, 10);
    const state = global.GameState.get();

    // Check Boss Tier roll: Normal (85%), Rare (12%), Daily Boss (3%)
    let tier = 'normal';
    const roll = Math.random();
    const canSpawnDaily = state.lastDailyBossDate !== today;

    if (canSpawnDaily && roll < 0.03) {
      tier = 'daily';
    } else if (roll < 0.15) {
      tier = 'rare';
    }

    const isMilestone = (nextLevel % 10 === 0);
    let bossName = '';
    let bossTitle = '';

    if (isMilestone) {
      if (nextLevel === 10) bossName = '🔱 Đại Chúa Tể Dữ Liệu';
      else if (nextLevel === 20) bossName = '🔱 Ác Ma Nexyroth Nguyên Thuỷ';
      else if (nextLevel === 30) bossName = '🔱 Tận Thế Click';
      else bossName = `🔱 Thần Vương Vô Tận Cấp ${nextLevel}`;
      bossTitle = 'Chúa Tể Tối Cường Từng Mốc 10 Cấp';
    } else {
      const names = [
        'Mal’Zakar the Void Titan',
        'Vor’Thex the Astral Devourer',
        'Nexyroth Primordial Spawn',
        'Chrono-Leviathan',
        'Singularity Dreadnought',
        'Cosmic Eclipse Overlord'
      ];
      bossName = names[(nextLevel - 1) % names.length] + ' (Lv.' + nextLevel + ')';
      bossTitle = tier === 'daily' ? '👑 Boss Ngày Vàng Kim (Chỉ 1 lần/ngày)' : (tier === 'rare' ? '✨ Boss Tinh Anh Hiếm' : 'Void Titan of the Abyss');
    }

    if (tier === 'daily') bossName = '👑 ' + bossName;
    else if (tier === 'rare') bossName = '✨ ' + bossName;

    // HP calculation
    let baseHp = Math.floor(25000 * Math.pow(1.8, nextLevel - 1));
    if (tier === 'rare') baseHp = Math.floor(baseHp * 1.5);
    if (tier === 'daily') baseHp = Math.floor(baseHp * 3.0);
    if (isMilestone) baseHp = Math.floor(baseHp * 1.5);

    const timeLimit = Math.min(60, 30 + nextLevel * 2);
    // Anti-inflation: Boss gems are strictly controlled (1 to 5 gems max)
    const rewardGems = Math.min(5, Math.floor(1 + nextLevel * 0.25));
    const rewardShards = Math.floor(25 * Math.pow(1.35, nextLevel - 1));
    const rewardExp = Math.floor(250 * Math.pow(1.4, nextLevel - 1));

    const nextBoss = {
      id: 'boss_' + nextLevel + '_' + Date.now(),
      name: bossName,
      title: bossTitle,
      maxHp: baseHp,
      currentHp: baseHp,
      timeLimit: timeLimit,
      remainingTime: timeLimit,
      rewardGems: rewardGems,
      rewardShards: rewardShards,
      rewardExp: rewardExp,
      active: false,
      level: nextLevel,
      tier: tier,
      isMilestone: isMilestone
    };

    global.GameState.setBoss(nextBoss);
    updateBossDisplay();
  }

  function updateStatsDisplay() {
    const state = global.GameState.get();
    const stats = calculateStats();
    const format = global.Numeric ? global.Numeric.format : function (n) { return Math.floor(n); };

    // Header balances
    const elEssence = document.getElementById('headerEssence');
    const elShards = document.getElementById('headerShards');
    const elGems = document.getElementById('headerGems');

    if (elEssence) elEssence.textContent = format(state.essence, state.settings.scientificNotation);
    if (elShards) elShards.textContent = format(state.astralShards);
    if (elGems) elGems.textContent = format(state.astralGems);

    // Left column stats
    const elPlayerLevel = document.getElementById('playerLevel') || document.getElementById('panelLevel');
    const elExpPercent = document.getElementById('expPercent');
    const elExpBar = document.getElementById('expBar') || document.getElementById('panelExpBar');
    const elExpText = document.getElementById('expText') || document.getElementById('panelExpText');
    const elClickStat = document.getElementById('statClickPower') || document.getElementById('panelClickPower');
    const elCpsStat = document.getElementById('statCps') || document.getElementById('panelCps');
    const elCritStat = document.getElementById('statCritChance');

    if (elPlayerLevel) elPlayerLevel.textContent = 'Level ' + state.level;
    const expPct = Math.min(100, Math.floor((state.currentExp / state.maxExp) * 100));
    if (elExpPercent) elExpPercent.textContent = expPct + '%';
    if (elExpBar) elExpBar.style.width = expPct + '%';
    if (elExpText) elExpText.textContent = format(state.currentExp) + ' / ' + format(state.maxExp) + ' (' + expPct + '%)';

    const formattedClick = format(stats.clickPower * stats.frenzyMultiplier);
    const formattedCps = format(stats.cps * stats.frenzyMultiplier);

    if (elClickStat) elClickStat.textContent = formattedClick;
    if (elCpsStat) elCpsStat.textContent = formattedCps + '/s';
    if (elCritStat) elCritStat.textContent = Math.round(stats.critChance * 100) + '%';

    // Center Core Eyebrow Rates
    const elCoreClickRate = document.getElementById('coreClickRate');
    const elCoreCritRate = document.getElementById('coreCritRate');
    if (elCoreClickRate) elCoreClickRate.textContent = '+' + formattedClick;
    if (elCoreCritRate) elCoreCritRate.textContent = (stats.critChance * 100).toFixed(1) + '% (' + stats.critMultiplier + 'x)';

    // Skill Points Banner
    const skillBanner = document.getElementById('skillPointsBanner');
    const skillCount = document.getElementById('skillPointsCount');
    if (skillBanner && skillCount) {
      if (state.skillPoints > 0) {
        skillBanner.style.display = 'flex';
        skillCount.textContent = '+' + state.skillPoints;
      } else {
        skillBanner.style.display = 'none';
      }
    }

    // Active boosts list
    const elBoosts = document.getElementById('activeBoostsList');
    if (elBoosts) {
      if (state.activeBoosts.length === 0) {
        elBoosts.innerHTML = '<span style="color: #64748b; font-size: 0.6875rem;">None active</span>';
      } else {
        elBoosts.innerHTML = state.activeBoosts.map(function (b) {
          return '<span class="nx-badge nx-badge-gold">' + b.name + ' (' + Math.ceil(b.remainingSeconds) + 's)</span>';
        }).join(' ');
      }
    }

    // Visual Juice: Pulsing glow when buffs are running
    const hasBuffsRunning = stats.potionMultiplierSum > 0 || (state.activePotions && state.activePotions.auto_50ms > 0) || state.activeBoosts.length > 0;
    if (coreSphereEl) {
      if (hasBuffsRunning) {
        coreSphereEl.classList.add('has-active-buffs');
      } else {
        coreSphereEl.classList.remove('has-active-buffs');
      }
    }

    // Boss area
    updateBossDisplay();

    // Active Potions & Buffs Bar
    updateActiveBuffs();
  }

  function updateBossDisplay() {
    const boss = global.GameState.getBoss();
    const bossPanel = document.getElementById('bossBattleArea');
    const summonBtn = document.getElementById('summonBossBtn');
    if (!bossPanel || !summonBtn) return;

    if (boss && boss.active) {
      bossPanel.style.display = 'block';
      summonBtn.style.display = 'none';

      const elHpText = document.getElementById('bossHpText');
      const elHpBar = document.getElementById('bossHpBar');
      const elTimer = document.getElementById('bossTimerText');
      const elName = document.getElementById('bossName');

      if (elName) elName.textContent = boss.name;
      if (elTimer) elTimer.textContent = boss.remainingTime.toFixed(1) + 's';

      const hpPct = Math.min(100, (boss.currentHp / boss.maxHp) * 100);
      if (elHpBar) {
        elHpBar.style.width = hpPct + '%';
        // Tier color for health bar
        if (boss.tier === 'daily') {
          elHpBar.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
          elHpBar.style.boxShadow = '0 0 10px rgba(251,191,36,0.6)';
        } else if (boss.tier === 'rare') {
          elHpBar.style.background = 'linear-gradient(90deg, #9333ea, #c084fc)';
          elHpBar.style.boxShadow = '0 0 10px rgba(168,85,247,0.6)';
        } else {
          elHpBar.style.background = 'linear-gradient(90deg, #e11d48, #f43f5e)';
          elHpBar.style.boxShadow = '0 0 10px rgba(244,63,94,0.4)';
        }
      }
      if (elHpText) elHpText.textContent = (global.Numeric ? global.Numeric.format(boss.currentHp) : Math.floor(boss.currentHp)) + ' / ' + (global.Numeric ? global.Numeric.format(boss.maxHp) : Math.floor(boss.maxHp));
    } else {
      bossPanel.style.display = 'none';
      summonBtn.style.display = 'flex';
      const elName = document.getElementById('bossSummonName');
      if (elName && boss) {
        elName.textContent = 'Thách Đấu: ' + boss.name;
      }
    }
  }

  function summonBoss() {
    const boss = global.GameState.getBoss();
    if (!boss) return;
    boss.active = true;
    boss.currentHp = boss.maxHp;
    boss.remainingTime = boss.timeLimit;
    if (global.Sound) global.Sound.playBossHit();
    updateBossDisplay();
  }

  function triggerSkill(skillKey) {
    if (skillCooldowns[skillKey] > 0) return;
    const state = global.GameState.get();
    const stats = calculateStats();

    if (skillKey === 'overload') {
      state.activeBoosts.push({
        id: 'skill_overload_' + Date.now(),
        name: 'Void Overload',
        multiplier: 2,
        remainingSeconds: 15
      });
      skillCooldowns.overload = 60;
      if (global.Sound) global.Sound.playUpgrade();
    } else if (skillKey === 'surge') {
      const gain = stats.cps * 30;
      state.essence += gain;
      state.totalEssence += gain;
      skillCooldowns.surge = 90;
      if (global.Sound) global.Sound.playAchievement();
    } else if (skillKey === 'warp') {
      spawnCosmicRift();
      skillCooldowns.warp = 120;
      if (global.Sound) global.Sound.playAchievement();
    }

    updateSkillsCooldownUI();
  }

  function updateCooldowns(dt) {
    Object.keys(skillCooldowns).forEach(function (k) {
      if (skillCooldowns[k] > 0) {
        skillCooldowns[k] = Math.max(0, skillCooldowns[k] - dt);
      }
    });
    updateSkillsCooldownUI();
  }

  function updateSkillsCooldownUI() {
    const overloadOverlay = document.getElementById('overloadCdOverlay');
    const surgeOverlay = document.getElementById('surgeCdOverlay');
    const warpOverlay = document.getElementById('warpCdOverlay');

    if (overloadOverlay) {
      overloadOverlay.style.display = skillCooldowns.overload > 0 ? 'flex' : 'none';
      overloadOverlay.textContent = Math.ceil(skillCooldowns.overload) + 's';
    }
    if (surgeOverlay) {
      surgeOverlay.style.display = skillCooldowns.surge > 0 ? 'flex' : 'none';
      surgeOverlay.textContent = Math.ceil(skillCooldowns.surge) + 's';
    }
    if (warpOverlay) {
      warpOverlay.style.display = skillCooldowns.warp > 0 ? 'flex' : 'none';
      warpOverlay.textContent = Math.ceil(skillCooldowns.warp) + 's';
    }
  }

  function updateActiveBuffs() {
    const bar = document.getElementById('activePotionsBar') || document.getElementById('activeBuffsBar');
    if (!bar) return;

    const state = global.GameState.get();
    const active = state.activePotions || {};
    const boosts = state.activeBoosts || [];

    const activeMults = [];
    let sumMult = 0;
    let maxMultTime = 0;

    [
      { key: 'x2', val: 2 },
      { key: 'x5', val: 5 },
      { key: 'x10', val: 10 },
      { key: 'x20', val: 20 },
      { key: 'x50', val: 50 },
      { key: 'x100', val: 100 }
    ].forEach(function (m) {
      if (active[m.key] > 0) {
        activeMults.push(m.val);
        sumMult += m.val;
        if (active[m.key] > maxMultTime) maxMultTime = active[m.key];
      }
    });

    const hasAny = active.auto_50ms > 0 || sumMult > 0 || boosts.length > 0 || (state.gamePasses && (state.gamePasses.pass_autoclick_perm || state.gamePasses.pass_ultimate_bundle));
    if (!hasAny) {
      bar.style.display = 'none';
      return;
    }

    bar.style.display = 'flex';
    let pills = '';

    const hasPermAuto = state.gamePasses && (state.gamePasses.pass_autoclick_perm || state.gamePasses.pass_ultimate_bundle);
    if (hasPermAuto) {
      pills += `
        <span class="nx-badge nx-badge-gold" style="font-size: 0.75rem; padding: 0.25rem 0.6rem; border-color: rgba(251,191,36,0.6); display: inline-flex; align-items: center; gap: 0.4rem;">
          <span>⚡ VIP Auto-Click Vĩnh Viễn</span>
          <button onclick="event.stopPropagation(); UI.toggleAutoClicker();" style="cursor: pointer; padding: 1px 6px; font-size: 0.6875rem; font-weight: 800; border-radius: 4px; background: rgba(0,0,0,0.5); color: #fbbf24; border: 1px solid rgba(251,191,36,0.6);">
            ${isAutoClickerPaused ? '▶️ Tiếp tục' : '⏸️ Tạm dừng'}
          </button>
        </span>
      `;
    }

    if (sumMult > 0) {
      const formula = activeMults.length > 1 ? activeMults.join('+') + '=' + sumMult : sumMult;
      pills += `
        <span class="nx-badge nx-badge-gold" style="font-size: 0.75rem; padding: 0.25rem 0.6rem; animation: pulse 2s infinite;">
          🧪 +${sumMult}x (${formula}) [${formatDuration(maxMultTime)}]
        </span>
      `;
    }

    if (active.auto_50ms > 0 && !hasPermAuto) {
      pills += `
        <span class="nx-badge nx-badge-cyan" style="font-size: 0.75rem; padding: 0.25rem 0.6rem; animation: pulse 2s infinite; display: inline-flex; align-items: center; gap: 0.4rem;">
          <span>⚡ Auto 50ms [${formatDuration(active.auto_50ms)}]</span>
          <button onclick="event.stopPropagation(); UI.toggleAutoClicker();" style="cursor: pointer; padding: 1px 6px; font-size: 0.6875rem; font-weight: 800; border-radius: 4px; background: rgba(0,0,0,0.5); color: #fff; border: 1px solid rgba(56,189,248,0.5);">
            ${isAutoClickerPaused ? '▶️ Tiếp tục' : '⏸️ Tạm dừng'}
          </button>
        </span>
      `;
    }

    boosts.forEach(function (b) {
      pills += `
        <span class="nx-badge nx-badge-violet" style="font-size: 0.75rem; padding: 0.25rem 0.6rem;">
          ✨ ${b.name} (${Math.ceil(b.remainingSeconds)}s)
        </span>
      `;
    });

    bar.innerHTML = pills;
  }

  function toggleAutoClicker() {
    isAutoClickerPaused = !isAutoClickerPaused;
    const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;
    if (global.Toast) {
      global.Toast.show(
        isAutoClickerPaused
          ? (isVi ? '⏸️ Đã tạm dừng Auto-Clicker!' : '⏸️ Auto-Clicker Paused!')
          : (isVi ? '▶️ Đã tiếp tục Auto-Clicker!' : '▶️ Auto-Clicker Resumed!'),
        'info'
      );
    }
    updateActiveBuffs();
  }

  function spawnGoldenMeteor() {
    const existing = document.getElementById('goldenMeteorEntity');
    if (existing) return;

    const meteor = document.createElement('div');
    meteor.id = 'goldenMeteorEntity';
    meteor.className = 'golden-meteor-entity';
    meteor.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.85rem; border-radius: 9999px; background: rgba(146,64,14,0.95); border: 2px solid #fbbf24; box-shadow: 0 0 25px #fbbf24; color: #fff; font-weight: 800; font-size: 0.8125rem;">
        <span style="font-size: 1.3rem;">☄️</span>
        <span style="color: #fef08a; text-shadow: 0 0 10px #fbbf24; letter-spacing: 0.3px;">Sao Băng Vũ Trụ!</span>
      </div>
    `;

    const startX = Math.random() < 0.5 ? -100 : (window.innerWidth + 20);
    const targetX = startX < 0 ? (window.innerWidth + 120) : -120;
    const startY = Math.floor(Math.random() * (window.innerHeight * 0.4)) + 70;
    const targetY = startY + Math.floor(Math.random() * 220) + 80;

    meteor.style.left = startX + 'px';
    meteor.style.top = startY + 'px';
    document.body.appendChild(meteor);

    // Game Pass Auto Loot collector
    const gameState = global.GameState.get();
    if (gameState.gamePasses && (gameState.gamePasses.pass_fortune_loot || gameState.gamePasses.pass_ultimate_bundle)) {
      setTimeout(function () {
        if (meteor && meteor.parentNode) meteor.click();
      }, 1500);
    }

    const startTime = Date.now();
    const duration = 12000;

    function moveMeteor() {
      const elapsed = Date.now() - startTime;
      const p = elapsed / duration;
      if (p >= 1 || !meteor.parentNode) {
        if (meteor.parentNode) meteor.parentNode.removeChild(meteor);
        return;
      }
      meteor.style.left = (startX + (targetX - startX) * p) + 'px';
      meteor.style.top = (startY + (targetY - startY) * p) + 'px';
      requestAnimationFrame(moveMeteor);
    }
    requestAnimationFrame(moveMeteor);

    meteor.onclick = function (e) {
      if (e && e.stopPropagation) e.stopPropagation();
      if (meteor.parentNode) meteor.parentNode.removeChild(meteor);

      const state = global.GameState.get();
      const stats = calculateStats();
      const roll = Math.random();
      const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;

      if (global.Sound) global.Sound.playAchievement();

      if (roll < 0.35) {
        // Supernova Frenzy: 7x for 25s
        state.activeBoosts.push({
          id: 'meteor_frenzy_' + Date.now(),
          name: isVi ? 'Siêu Tân Tinh (x7)' : 'Supernova Frenzy (x7)',
          multiplier: 7,
          remainingSeconds: 25
        });
        if (global.Toast) {
          global.Toast.show(isVi ? '🌟 BẮT ĐƯỢC SAO BĂNG: Kích hoạt Siêu Tân Tinh (x7 Năng Lượng trong 25s)!' : '🌟 CAUGHT GOLDEN COMET: Supernova Frenzy (x7 Essence for 25s)!', 'gold');
        }
      } else if (roll < 0.65) {
        // Gem shower: 1-2 gems max (anti-inflation)
        const gemsEarned = Math.floor(Math.random() * 2) + 1;
        state.astralGems += gemsEarned;
        if (global.Toast) {
          global.Toast.show(isVi ? `💎 BẮT ĐƯỢC SAO BĂNG: Nhận được +${gemsEarned} Đá Quý!` : `💎 CAUGHT GOLDEN COMET: +${gemsEarned} Astral Gems!`, 'gold');
        }
      } else if (roll < 0.85) {
        // Instant CPS burst: 60s
        const instantEssence = Math.max(500, stats.cps * 60);
        state.essence += instantEssence;
        state.totalEssence += instantEssence;
        if (global.Toast) {
          global.Toast.show(isVi ? `⚡ BẮT ĐƯỢC SAO BĂNG: Dịch chuyển thời gian +${global.Numeric.format(instantEssence)} Năng Lượng!` : `⚡ CAUGHT GOLDEN COMET: Time Warp +${global.Numeric.format(instantEssence)} Essence!`, 'gold');
        }
      } else {
        // Consumable potion
        const bonusPotion = 'potion_x2';
        if (!state.potions) state.potions = {};
        state.potions[bonusPotion] = (state.potions[bonusPotion] || 0) + 1;
        if (global.Toast) {
          global.Toast.show(isVi ? '🎁 BẮT ĐƯỢC SAO BĂNG: Nhận được +1 Thuốc Năng Lượng x2 vào Balo!' : '🎁 CAUGHT GOLDEN COMET: +1 Elixir x2 added to Backpack!', 'gold');
        }
      }

      updateStatsDisplay();
    };
  }

  function formatDuration(seconds) {
    const s = Math.ceil(seconds);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return m + ':' + (rem < 10 ? '0' : '') + rem;
  }

  function spawnCosmicRift() {
    const coreArea = document.querySelector('.col-center');
    if (!coreArea) return;

    const rift = document.createElement('div');
    rift.className = 'cosmic-rift';
    rift.style.position = 'absolute';
    rift.style.width = '48px';
    rift.style.height = '48px';
    rift.style.borderRadius = '50%';
    rift.style.background = 'radial-gradient(circle, #e879f9 0%, #a855f7 60%, transparent 100%)';
    rift.style.boxShadow = '0 0 25px #c084fc';
    rift.style.cursor = 'pointer';
    rift.style.zIndex = '50';
    rift.style.animation = 'pulse 1s infinite alternate';

    const maxX = coreArea.clientWidth - 60;
    const maxY = coreArea.clientHeight - 60;
    rift.style.left = Math.max(20, Math.floor(Math.random() * maxX)) + 'px';
    rift.style.top = Math.max(40, Math.floor(Math.random() * maxY)) + 'px';

    rift.onclick = function () {
      const state = global.GameState.get();
      const stats = calculateStats();
      const gain = Math.max(100, stats.cps * 60);
      state.essence += gain;
      state.totalEssence += gain;
      state.totalRifts++;

      if (global.Sound) global.Sound.playAchievement();
      if (global.CosmicEvents) global.CosmicEvents.track('rifts', 1);
      if (global.Toast) {
        const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;
        global.Toast.show(isVi ? `✨ Đã thu thập Khe Nứt! +${global.Numeric.format(gain)} Năng Lượng` : `✨ Cosmic Rift Claimed! +${global.Numeric.format(gain)} Essence`, 'info');
      }

      if (rift.parentNode) rift.parentNode.removeChild(rift);
      updateStatsDisplay();
    };

    coreArea.appendChild(rift);

    // Game Pass Auto Loot collector
    const gameState = global.GameState.get();
    if (gameState.gamePasses && (gameState.gamePasses.pass_fortune_loot || gameState.gamePasses.pass_ultimate_bundle)) {
      setTimeout(function () {
        if (rift && rift.parentNode) rift.click();
      }, 1200);
    }

    setTimeout(function () {
      if (rift.parentNode) rift.parentNode.removeChild(rift);
    }, 15000);
  }

  // Keyboard Shortcuts (UX from Patch v8.2):
  // - Space to click (blocks page scroll, prevents duplicate trigger when focused)
  // - 1-4 for Quick Navigation: 1=Skills, 2=Backpack, 3=Gem Shop, 4=Events
  function initKeyboardControls() {
    window.addEventListener('keydown', function (e) {
      // Ignore if typing in text inputs
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return;
      }

      // Spacebar to click Core
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        // Prevent duplicate trigger if activeElement is the button itself
        if (e.repeat) return;
        handleCoreClick(null);
        return;
      }

      // 1-4 Number shortcuts
      if (e.key === '1' || e.code === 'Digit1') {
        if (global.UIModals) global.UIModals.open('skillsModal');
      } else if (e.key === '2' || e.code === 'Digit2') {
        if (global.UIModals) global.UIModals.open('inventoryModal');
      } else if (e.key === '3' || e.code === 'Digit3') {
        if (global.UIModals) global.UIModals.open('gemShopModal');
      } else if (e.key === '4' || e.code === 'Digit4') {
        if (global.UIModals) global.UIModals.open('cosmicEventModal');
      }
    });
  }

  function init() {
    coreSphereEl = document.getElementById('coreSphere') || document.getElementById('coreSphereBtn');
    if (coreSphereEl) {
      coreSphereEl.addEventListener('click', function (e) {
        handleCoreClick(e, false);
      });
      coreSphereEl.addEventListener('touchstart', function (e) {
        handleCoreClick(e, false);
      }, { passive: true });
    }

    const summonBtn = document.getElementById('summonBossBtn');
    if (summonBtn) {
      summonBtn.addEventListener('click', summonBoss);
    }

    const btnOverload = document.getElementById('skillOverloadBtn');
    const btnSurge = document.getElementById('skillSurgeBtn');
    const btnWarp = document.getElementById('skillWarpBtn');

    if (btnOverload) btnOverload.addEventListener('click', function () { triggerSkill('overload'); });
    if (btnSurge) btnSurge.addEventListener('click', function () { triggerSkill('surge'); });
    if (btnWarp) btnWarp.addEventListener('click', function () { triggerSkill('warp'); });

    initFloatingPool();
    initKeyboardControls();

    // Auto Clicker loop (50ms hyper clicks when active or permanent Game Pass owned)
    setInterval(function () {
      const state = global.GameState.get();
      const hasPermAuto = state.gamePasses && (state.gamePasses.pass_autoclick_perm || state.gamePasses.pass_ultimate_bundle);
      const hasPotionAuto = state.activePotions && state.activePotions.auto_50ms > 0;
      if ((hasPermAuto || hasPotionAuto) && !isAutoClickerPaused) {
        handleCoreClick(null, true);
      }
    }, 50);

    // Occasional golden meteor spawn (every ~50s)
    setInterval(function () {
      if (Math.random() < 0.45) {
        spawnGoldenMeteor();
      }
    }, 50000);

    // Occasional cosmic rift spawn (every ~45s)
    setInterval(function () {
      if (Math.random() < 0.35) {
        spawnCosmicRift();
      }
    }, 45000);
  }

  global.UICore = {
    init: init,
    calculateStats: calculateStats,
    handleCoreClick: handleCoreClick,
    updateStatsDisplay: updateStatsDisplay,
    updateCooldowns: updateCooldowns,
    updateActiveBuffs: updateActiveBuffs,
    summonBoss: summonBoss,
    spawnNextBoss: spawnNextBoss,
    formatDuration: formatDuration,
    toggleAutoClicker: toggleAutoClicker,
    isAutoClickerPaused: function () { return isAutoClickerPaused; },
    spawnGoldenMeteor: spawnGoldenMeteor
  };

  global.UI = global.UICore;
})(typeof window !== 'undefined' ? window : this);
