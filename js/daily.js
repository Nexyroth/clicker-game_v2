/**
 * NEXYROTH CLICKER - DAILY LOGIN REWARDS CONTROLLER
 * 7-Day Streak Calendar with Prominent, Guaranteed Claim Buttons on Mobile & Desktop
 * Bilingual support (Tiếng Việt default, English)
 * Pure JavaScript - 100% Offline, Zero Dependencies
 */
(function (global) {
  'use strict';

  const DAILY_REWARDS = [
    { day: 1, titleVi: 'Tia Sáng Hư Không', titleEn: 'Spark of the Abyss', gems: 1, essence: 500, shards: 0, icon: '💎', descVi: '1 Đá Quý + 500 Năng Lượng', descEn: '1 Gem + 500 Essence' },
    { day: 2, titleVi: 'Rương Tinh Vân', titleEn: 'Astral Cache', gems: 1, essence: 1500, shards: 2, icon: '✨', descVi: '1 Đá Quý + 1,500 Năng Lượng + 2 Shards', descEn: '1 Gem + 1,500 Essence + 2 Shards' },
    { day: 3, titleVi: 'Mảnh Vỡ Hư Vô', titleEn: 'Shards of the Void', gems: 2, essence: 0, shards: 5, icon: '🔮', descVi: '2 Đá Quý + 5 Mảnh Shards', descEn: '2 Gems + 5 Shards' },
    { day: 4, titleVi: 'Thuốc Tăng Lực', titleEn: 'Elixir of Power', gems: 2, essence: 0, shards: 0, potionKey: 'potion_x2', icon: '🧪', descVi: '2 Đá Quý + 1 Thuốc Năng Lượng x2 (Balo)', descEn: '2 Gems + 1 Cosmic Elixir x2 (Backpack)' },
    { day: 5, titleVi: 'Kho Báu Chiều Không Gian', titleEn: 'Dimensional Stash', gems: 3, essence: 0, shards: 10, icon: '💠', descVi: '3 Đá Quý + 10 Mảnh Shards', descEn: '3 Gems + 10 Shards' },
    { day: 6, titleVi: 'Kho Báu Tinh Cầu', titleEn: 'Cosmic Treasury', gems: 3, essence: 10000, shards: 0, icon: '👑', descVi: '3 Đá Quý + 10,000 Năng Lượng', descEn: '3 Gems + 10,000 Essence' },
    { day: 7, titleVi: 'Trái Tim Chúa Tể Vũ Trụ', titleEn: 'Heart of the Sovereign', gems: 5, essence: 0, shards: 20, relic: true, icon: '🪐', descVi: '5 Đá Quý + 20 Shards + CỔ VẬT HUYỀN THOẠI!', descEn: '5 Gems + 20 Shards + LEGENDARY RELIC!' }
  ];

  const DAY_MS = 20 * 60 * 60 * 1000; // 20 hours leeway for daily resets

  function getTodayDateString() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function isReadyToClaim() {
    const state = global.GameState ? global.GameState.get() : null;
    if (!state) return true;
    if (!state.daily) return true;
    
    // If no claim ever made or streakDay is 0
    if (!state.daily.lastClaimTimestamp || state.daily.lastClaimTimestamp === 0 || state.daily.streakDay === 0) {
      return true;
    }

    // Check calendar date comparison: if today's date string is different from last claim date, ready!
    const todayStr = getTodayDateString();
    if (state.daily.lastClaimDate && state.daily.lastClaimDate !== todayStr) {
      return true;
    }

    // Fallback to elapsed time (20 hours)
    const now = Date.now();
    return (now - state.daily.lastClaimTimestamp) >= DAY_MS;
  }

  function getNextClaimTime() {
    const state = global.GameState ? global.GameState.get() : null;
    if (!state || !state.daily || !state.daily.lastClaimTimestamp) return 0;
    return state.daily.lastClaimTimestamp + (24 * 60 * 60 * 1000);
  }

  function claimDailyReward() {
    const state = global.GameState ? global.GameState.get() : null;
    if (!state) return { success: false };

    if (!state.daily) {
      state.daily = { streakDay: 0, lastClaimTimestamp: 0, lastClaimDate: '', claimedDays: [] };
    }

    const lang = global.I18n ? global.I18n.getLang() : 'vi';

    if (!isReadyToClaim()) {
      if (global.Sound) global.Sound.playError();
      const msg = lang === 'vi' 
        ? '⏳ Bạn đã nhận quà hôm nay rồi! Hãy nhấn nút "⚡ Bỏ qua 24h" bên dưới nếu bạn muốn thử nhận tiếp ngay lập tức.' 
        : '⏳ You have already claimed today’s reward! Click "⚡ Skip 24h" below to test claiming the next reward right now.';
      if (global.Toast) {
        global.Toast.show(msg, 'warning');
      }
      return { success: false };
    }

    // Determine target day index (0 to 6)
    let nextDayIndex = state.daily.streakDay || 0;
    if (nextDayIndex >= 7) {
      nextDayIndex = 0; // Loop streak back after day 7
      state.daily.claimedDays = [];
    }

    const reward = DAILY_REWARDS[nextDayIndex];

    // Grant rewards
    if (reward.gems) state.astralGems = (state.astralGems || 0) + reward.gems;
    if (reward.essence) {
      state.essence = (state.essence || 0) + reward.essence;
      state.totalEssence = (state.totalEssence || 0) + reward.essence;
    }
    if (reward.shards) {
      state.astralShards = (state.astralShards || 0) + reward.shards;
      state.totalAstralShards = (state.totalAstralShards || 0) + reward.shards;
    }
    if (reward.potionKey) {
      if (!state.potions) state.potions = {};
      state.potions[reward.potionKey] = (state.potions[reward.potionKey] || 0) + 1;
    }
    if (reward.elixir) {
      state.activeBoosts.push({
        id: 'daily_frenzy_' + Date.now(),
        name: lang === 'vi' ? 'Cuồng Nộ Hư Không (x5)' : 'Void Frenzy (x5)',
        multiplier: 5,
        remainingSeconds: 60
      });
    }
    if (reward.relic) {
      const sovereignRelicId = 'relic_sovereign';
      if (!state.relics.some(function (r) { return r.id === sovereignRelicId; })) {
        const equippedCount = (state.relics || []).filter(function (r) { return r.equipped; }).length;
        const shouldEquip = equippedCount < 4;
        state.relics.push({
          id: sovereignRelicId,
          name: lang === 'vi' ? 'Trái Tim Chúa Tể Vũ Trụ' : 'Heart of the Sovereign',
          rarity: 'legendary',
          effectDesc: '+50% Direct Click, +50% Passive CPS, +10% Crit Chance',
          equipped: shouldEquip,
          clickBonus: 0.50,
          cpsBonus: 0.50,
          critBonus: 0.10,
          icon: 'sun'
        });
      }
    }

    // Update state
    state.daily.streakDay = nextDayIndex + 1;
    state.daily.lastClaimTimestamp = Date.now();
    state.daily.lastClaimDate = getTodayDateString();
    if (!state.daily.claimedDays) state.daily.claimedDays = [];
    if (!state.daily.claimedDays.includes(nextDayIndex + 1)) {
      state.daily.claimedDays.push(nextDayIndex + 1);
    }

    global.GameState.save();

    if (global.Sound) global.Sound.playDailyClaim();
    if (global.UICore && global.UICore.updateStatsDisplay) global.UICore.updateStatsDisplay();

    updateDailyBadge();
    renderDailyModalContent();

    // Show celebration Toast feedback
    const rewardDesc = lang === 'vi' ? reward.descVi : reward.descEn;
    const msg = lang === 'vi' 
      ? `🎉 NHẬN THÀNH CÔNG NGÀY ${nextDayIndex + 1}: ${rewardDesc}`
      : `🎉 CLAIMED DAY ${nextDayIndex + 1}: ${rewardDesc}`;
    
    if (global.Toast) {
      global.Toast.show(msg, 'success');
    }

    return { success: true, reward: reward };
  }

  function simulateNextDay() {
    const state = global.GameState ? global.GameState.get() : null;
    if (!state) return;
    if (!state.daily) state.daily = { streakDay: 0, lastClaimTimestamp: 0, lastClaimDate: '', claimedDays: [] };
    
    // Reset timestamp and date to allow instant claim of next day
    state.daily.lastClaimTimestamp = 0;
    state.daily.lastClaimDate = '2000-01-01'; // Force date mismatch
    
    global.GameState.save();
    updateDailyBadge();
    renderDailyModalContent();

    if (global.Sound) global.Sound.playUpgrade();
    const lang = global.I18n ? global.I18n.getLang() : 'vi';
    const msg = lang === 'vi'
      ? '⚡ Đã mở khóa quà tiếp theo! Hãy nhấn nút "NHẬN THƯỞNG" ngay bây giờ.'
      : '⚡ Next day unlocked! You can now click "CLAIM REWARD".';
    if (global.Toast) global.Toast.show(msg, 'info');
  }

  function updateDailyBadge() {
    const badges = document.querySelectorAll('.daily-badge-dot, #dailyBadgeDot, [data-badge="daily"]');
    const ready = isReadyToClaim();
    badges.forEach(function (badge) {
      badge.style.display = ready ? 'block' : 'none';
    });
  }

  function renderDailyModalContent() {
    const container = document.getElementById('dailyModalContent');
    if (!container) return;

    const state = global.GameState ? global.GameState.get() : null;
    if (!state) return;

    if (!state.daily) {
      state.daily = { streakDay: 0, lastClaimTimestamp: 0, lastClaimDate: '', claimedDays: [] };
    }

    const lang = global.I18n ? global.I18n.getLang() : 'vi';
    const isVi = lang === 'vi';
    const ready = isReadyToClaim();

    const currentStreak = state.daily.streakDay || 0;
    const targetDayIndex = currentStreak >= 7 ? 0 : currentStreak;
    const targetDayNum = targetDayIndex + 1;
    const targetReward = DAILY_REWARDS[targetDayIndex];

    const nextClaimTime = getNextClaimTime();
    const timeLeftMs = Math.max(0, nextClaimTime - Date.now());

    let countdownText = isVi ? 'SẴN SÀNG NHẬN QUÀ!' : 'READY TO CLAIM!';
    if (!ready && timeLeftMs > 0) {
      const hours = Math.floor(timeLeftMs / (1000 * 60 * 60));
      const mins = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((timeLeftMs % (1000 * 60)) / 1000);
      countdownText = isVi 
        ? `Quà tiếp theo sau ${hours}h ${mins}m ${secs}s` 
        : `Next reward in ${hours}h ${mins}m ${secs}s`;
    }

    // Render 7-day grid
    let gridHtml = '';
    DAILY_REWARDS.forEach(function (rew, idx) {
      const dayNum = idx + 1;
      const isClaimed = state.daily.claimedDays && state.daily.claimedDays.includes(dayNum);
      const isTargetDay = (dayNum === targetDayNum);
      const isSpecial = (dayNum === 7);

      let cardClass = 'daily-day-card';
      if (isSpecial) cardClass += ' day-7-special';
      if (isClaimed) cardClass += ' claimed';
      if (isTargetDay && ready) cardClass += ' ready-to-claim';

      const title = isVi ? rew.titleVi : rew.titleEn;
      const desc = isVi ? rew.descVi : rew.descEn;

      gridHtml += `
        <div class="${cardClass}" style="position: relative; transition: all 0.2s ease;">
          <div class="daily-day-number" style="display: flex; justify-content: space-between; align-items: center;">
            <span>${isVi ? 'Ngày ' + dayNum : 'Day ' + dayNum}</span>
            ${isClaimed ? '<span style="color: #34d399; font-size: 0.75rem;">✓ ' + (isVi ? 'Đã Nhận' : 'Claimed') + '</span>' : ''}
          </div>
          <div class="daily-reward-icon" style="font-size: 2rem; margin: 0.35rem 0;">${rew.icon}</div>
          <div class="daily-reward-name" style="font-weight: 800; font-size: 0.8125rem; color: #fff;">${title}</div>
          <div class="daily-reward-qty" style="font-size: 0.75rem; color: #cbd5e1; margin-top: 0.2rem;">${desc}</div>
          
          <div style="margin-top: 0.625rem; width: 100%;">
            ${isClaimed ? `
              <div style="background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.4); color: #34d399; border-radius: 0.5rem; padding: 0.4rem; font-size: 0.75rem; font-weight: 800; text-align: center;">
                ✓ ${isVi ? 'ĐÃ NHẬN' : 'CLAIMED'}
              </div>
            ` : (isTargetDay && ready ? `
              <button class="nx-btn nx-btn-gold" style="width: 100%; font-size: 0.8125rem; padding: 0.5rem 0.65rem; font-weight: 900; animation: pulse-ready 1.5s infinite; box-shadow: 0 0 15px rgba(251,191,36,0.6);" onclick="DailyRewards.claim();">
                🎁 ${isVi ? 'NHẬN NGAY' : 'CLAIM NOW'}
              </button>
            ` : `
              <div style="background: rgba(30,41,59,0.6); border: 1px solid rgba(51,65,85,0.5); color: #64748b; border-radius: 0.5rem; padding: 0.4rem; font-size: 0.75rem; font-weight: 700; text-align: center;">
                🔒 ${isVi ? 'Chưa Mở' : 'Locked'}
              </div>
            `)}
          </div>
        </div>
      `;
    });

    const targetDesc = isVi ? targetReward.descVi : targetReward.descEn;

    container.innerHTML = `
      <!-- Banner Box -->
      <div class="daily-banner-box" style="margin-bottom: 0.875rem;">
        <img src="./assets/images/nexyroth_daily_chest_1790490760301.jpg" alt="Daily Chest" onerror="this.style.display='none'">
        <div class="daily-banner-overlay"></div>
        <div class="daily-banner-content">
          <div class="daily-streak-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            ${isVi ? 'Chuỗi Điểm Danh:' : 'Streak:'} ${currentStreak} / 7 ${isVi ? 'ngày' : 'days'}
          </div>
          <h2 style="font-size: 1.15rem; font-weight: 800; color: #fff; margin-top: 0.35rem;">
            ${isVi ? 'Phước Lành Tinh Tú Mỗi Ngày' : 'Daily Astral Blessings'}
          </h2>
          <p style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.2rem;">
            ${isVi ? 'Điểm danh mỗi ngày để nhận Đá Quý, Shards và Cổ Vật Huyền Thoại Sovereign!' : 'Log in every day to claim rare gems, astral shards, and the mythical Sovereign Relic!'}
          </p>
        </div>
      </div>

      <!-- MAIN PROMINENT CLAIM ACTION BAR -->
      <div style="margin-bottom: 1rem; border-radius: 0.875rem; padding: 0.875rem 1rem; ${ready ? 'background: linear-gradient(135deg, rgba(251,191,36,0.2) 0%, rgba(245,158,11,0.25) 100%); border: 2px solid #fbbf24; box-shadow: 0 0 25px rgba(251,191,36,0.35);' : 'background: rgba(18,24,38,0.8); border: 1px solid var(--nx-surface-border);'}">
        <div style="display: flex; flex-direction: column; gap: 0.65rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <div style="font-size: 0.6875rem; color: #fbbf24; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">
                ${isVi ? '★ PHẦN THƯỞNG HÔM NAY (NGÀY ' + targetDayNum + ')' : '★ TODAY\'S REWARD (DAY ' + targetDayNum + ')'}
              </div>
              <div style="font-size: 1rem; font-weight: 900; color: #fff; margin-top: 2px;">
                ${targetDesc}
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 0.75rem; color: ${ready ? '#34d399' : '#fbbf24'}; font-family: ui-monospace, monospace; font-weight: 800;">
                ● ${countdownText}
              </span>
            </div>
          </div>

          <!-- The Unmistakable Big Claim Button -->
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            ${ready ? `
              <button id="dailyTopClaimBtn" class="nx-btn nx-btn-gold" style="flex: 2; min-width: 200px; padding: 0.75rem 1.25rem; font-size: 0.9375rem; font-weight: 900; box-shadow: 0 0 20px rgba(251,191,36,0.5); text-transform: uppercase;" onclick="DailyRewards.claim();">
                🎁 ${isVi ? 'NHẬN PHẦN THƯỞNG NGÀY ' + targetDayNum : 'CLAIM REWARD DAY ' + targetDayNum}
              </button>
            ` : `
              <button class="nx-btn nx-btn-secondary" style="flex: 2; min-width: 200px; padding: 0.75rem; font-size: 0.875rem; opacity: 0.85; cursor: default;" disabled>
                ✓ ${isVi ? 'ĐÃ NHẬN HÔM NAY (QUAY LẠI SAU)' : 'CLAIMED FOR TODAY (CHECK BACK LATER)'}
              </button>
            `}

            <!-- Test / Fast-forward Skip Button to always allow instant testing -->
            <button id="dailyFastSkipBtn" class="nx-btn nx-btn-secondary" style="flex: 1; min-width: 140px; padding: 0.75rem; font-size: 0.75rem; font-weight: 800; border-color: rgba(56,189,248,0.4);" onclick="DailyRewards.simulateDay();" title="${isVi ? 'Bỏ qua thời gian chờ 24h để nhận tiếp ngày sau' : 'Skip 24h cooldown to test next day'}">
              ⚡ ${isVi ? 'Bỏ Qua 24h (Nhận Tiếp)' : 'Skip 24h (Test Next)'}
            </button>
          </div>
        </div>
      </div>

      <!-- 7 Days Grid -->
      <div class="daily-days-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.65rem; margin-bottom: 1rem;">
        ${gridHtml}
      </div>

      <!-- Action Footer with Secondary Claim Button -->
      <div style="padding-top: 0.75rem; border-top: 1px solid var(--nx-surface-border); display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap;">
        <div style="font-size: 0.75rem; color: #94a3b8;">
          ${isVi ? 'Chuỗi sẽ tự động làm mới sau khi hoàn thành Ngày 7.' : 'Streak loops back to Day 1 upon completing Day 7.'}
        </div>
        ${ready ? `
          <button class="nx-btn nx-btn-gold" style="padding: 0.5rem 1rem; font-weight: 800; font-size: 0.8125rem;" onclick="DailyRewards.claim();">
            🎁 ${isVi ? 'Nhận Quà' : 'Claim'}
          </button>
        ` : ''}
      </div>
    `;
  }

  global.DailyRewards = {
    isReady: isReadyToClaim,
    claim: claimDailyReward,
    simulateDay: simulateNextDay,
    updateBadge: updateDailyBadge,
    render: renderDailyModalContent
  };
})(typeof window !== 'undefined' ? window : this);
