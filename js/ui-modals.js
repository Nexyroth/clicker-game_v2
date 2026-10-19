/**
 * NEXYROTH CLICKER - UNIVERSAL MODAL SYSTEM CONTROLLER (v8.0)
 * - Settings Modal: Audio SFX, Volume, Giftcodes, Language VI/EN, Base64 Export/Import Save
 * - Gem Shop Modal: Potion Purchases & Permanent Perks (Shortcut G, 3)
 * - Skills Modal: 5 Branches including 🍀 Vận May with vertical connectors & infinite node
 * - Inventory & Relics Modal: 27 Relics, max 4 equipped, ⚡ Tự Trang Bị (Auto-Equip)
 * - Achievements Modal: 35 Achievements with active +0.5% buffs (+17.5% max)
 * - Prestige & Worlds Modal: 4 Worlds (⛩️ Thiên Giới Vĩnh Hằng), 18 Pets & Cú Đêm Vĩnh Cửu
 * - Stats Modal: Personal Records (Kỷ Lục Cá Nhân) & 4 Multipliers
 */
(function (global) {
  'use strict';

  let activeModal = null;

  function openModal(modalId) {
    const el = document.getElementById(modalId);
    if (!el) return;

    if (activeModal && activeModal !== el) {
      activeModal.classList.remove('is-open');
    }

    el.classList.add('is-open');
    activeModal = el;

    if (global.Sound) global.Sound.playModalOpen();

    // Render contents
    if (modalId === 'gemShopModal') renderGemShopContent();
    if (modalId === 'settingsModal') renderSettingsContent();
    if (modalId === 'skillsModal') renderSkillsContent();
    if (modalId === 'inventoryModal') renderInventoryContent();
    if (modalId === 'prestigeModal') renderPrestigeContent();
    if (modalId === 'achievementsModal') renderAchievementsContent();
    if (modalId === 'statsModal') renderStatsContent();
    if (modalId === 'dailyRewardModal' && global.DailyRewards) global.DailyRewards.render();
    if (modalId === 'cosmicEventModal' && global.CosmicEvents) global.CosmicEvents.render();
  }

  function closeModal(modalId) {
    let el = null;
    if (modalId) {
      el = document.getElementById(modalId);
    } else {
      el = activeModal;
    }

    if (el) {
      el.classList.remove('is-open');
      if (activeModal === el) activeModal = null;
      if (global.Sound) global.Sound.playModalClose();
    }
  }

  function formatDuration(seconds) {
    const s = Math.ceil(seconds);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return m + ':' + (rem < 10 ? '0' : '') + rem;
  }

  function updateBackpackBadge() {
    const state = global.GameState.get();
    let totalPotions = 0;
    if (state.potions) {
      Object.keys(state.potions).forEach(function (k) {
        totalPotions += (state.potions[k] || 0);
      });
    }

    const badge = document.getElementById('backpackBadgeCount');
    if (badge) badge.textContent = totalPotions;

    const dot = document.getElementById('mobileBackpackDot');
    if (dot) dot.style.display = totalPotions > 0 ? 'block' : 'none';
  }

  function handleRedeemCode(code) {
    const state = global.GameState.get();
    const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;

    if (!state.redeemedCodes) state.redeemedCodes = [];
    if (state.redeemedCodes.includes(code)) {
      return {
        success: false,
        message: isVi ? 'Bạn đã đổi mã này rồi!' : 'Code already redeemed!'
      };
    }

    let rewardGems = 0;
    let rewardShards = 0;
    let rewardPotionKey = null;

    if (code === 'TANTHU') {
      rewardGems = 50;
      rewardPotionKey = 'potion_x2';
    } else if (code === 'NEXYROTH') {
      rewardGems = 100;
      rewardShards = 50;
    } else if (code === 'COSMIC2026') {
      rewardGems = 80;
      rewardPotionKey = 'potion_auto_50ms';
    } else if (code === 'VOIDPOWER') {
      rewardGems = 150;
      rewardPotionKey = 'potion_x50';
    } else if (code === 'VIP999') {
      rewardGems = 200;
      rewardShards = 100;
      rewardPotionKey = 'potion_x100';
    } else if (code === 'V8RELEASE') {
      rewardGems = 300;
      rewardShards = 150;
      rewardPotionKey = 'potion_x100';
    } else {
      return {
        success: false,
        message: isVi ? 'Mã quà tặng không hợp lệ hoặc đã hết hạn.' : 'Invalid or expired code.'
      };
    }

    state.redeemedCodes.push(code);
    state.astralGems += rewardGems;
    state.astralShards += rewardShards;
    state.totalAstralShards += rewardShards;

    if (rewardPotionKey) {
      if (!state.potions) state.potions = {};
      state.potions[rewardPotionKey] = (state.potions[rewardPotionKey] || 0) + 1;
    }

    if (global.Sound) global.Sound.playAchievement();
    global.GameState.save();
    if (global.UICore) global.UICore.updateStatsDisplay();
    updateBackpackBadge();

    const giftDesc = isVi
      ? `Nhận thành công: +${rewardGems} 💎, +${rewardShards} Shards${rewardPotionKey ? ' và +1 Thuốc' : ''}!`
      : `Success: +${rewardGems} 💎, +${rewardShards} Shards${rewardPotionKey ? ' & 1 Potion' : ''}!`;

    return { success: true, message: giftDesc };
  }

  // =========================================================================
  // 1. SETTINGS CONTENT (with Base64 Export/Import)
  // =========================================================================
  function renderSettingsContent() {
    const container = document.getElementById('settingsModalContent');
    if (!container) return;

    const state = global.GameState.get();
    const lang = global.I18n ? global.I18n.getLang() : 'vi';
    const isVi = lang === 'vi';
    const isMuted = !state.settings.sfxEnabled;

    container.innerHTML = `
      <!-- Header Version Badge -->
      <div style="text-align: center; padding: 0.6rem; border-radius: 0.75rem; background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.3); margin-bottom: 0.875rem;">
        <span style="font-weight: 900; font-size: 0.9375rem; color: #38bdf8;">⚔️ NEXYROTH CLICKER RPG v8.0</span>
        <span style="font-size: 0.6875rem; color: #94a3b8; margin-left: 6px;">(Build 8.0 Hybrid Web/Offline)</span>
      </div>

      <!-- 1. Language Switcher -->
      <div class="setting-row" style="background: rgba(56,189,248,0.08); border-color: rgba(56,189,248,0.3); border-radius: 0.875rem; padding: 0.875rem;">
        <div>
          <div style="font-weight: 800; font-size: 0.9375rem; color: #fff; display: flex; align-items: center; gap: 0.4rem;">
            <span>🌐</span>
            <span>${isVi ? 'Ngôn Ngữ / Language' : 'Language / Ngôn Ngữ'}</span>
          </div>
          <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.2rem;">
            ${isVi ? 'Chọn ngôn ngữ giao diện (Mặc định: Tiếng Việt)' : 'Select interface language (Default: Vietnamese)'}
          </div>
        </div>
        <div style="display: flex; gap: 0.35rem; background: rgba(15,23,42,0.9); padding: 4px; border-radius: 0.625rem; border: 1px solid var(--nx-surface-border);">
          <button id="langViBtn" class="nx-btn ${isVi ? 'nx-btn-primary' : 'nx-btn-secondary'}" style="padding: 0.35rem 0.75rem; font-size: 0.8125rem; font-weight: 800;">
            🇻🇳 Tiếng Việt
          </button>
          <button id="langEnBtn" class="nx-btn ${!isVi ? 'nx-btn-primary' : 'nx-btn-secondary'}" style="padding: 0.35rem 0.75rem; font-size: 0.8125rem; font-weight: 800;">
            🇬🇧 English
          </button>
        </div>
      </div>

      <!-- 2. Audio & Mute Controls -->
      <div style="border-radius: 0.875rem; background: rgba(18,24,38,0.85); border: 1px solid ${isMuted ? 'rgba(244,63,94,0.4)' : 'rgba(56,189,248,0.3)'}; padding: 1rem; display: flex; flex-direction: column; gap: 0.875rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <div style="font-weight: 800; font-size: 0.9375rem; color: #fff; display: flex; align-items: center; gap: 0.4rem;">
              <span>${isMuted ? '🔇' : '🔊'}</span>
              <span>${isVi ? 'Âm Thanh & Tắt Tiếng (SFX)' : 'Sound & Mute Controls'}</span>
            </div>
            <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.15rem;">
              ${isVi ? 'Tiếng hiệu ứng khi chạm Lõi, nâng cấp và thăng cấp' : 'Audio cues for clicks, upgrades, and level-ups'}
            </div>
          </div>
          <button id="quickMuteBtn" class="nx-btn ${isMuted ? 'nx-btn-danger' : 'nx-btn-emerald'}" style="padding: 0.5rem 1rem; font-size: 0.8125rem; font-weight: 800;">
            ${isMuted ? (isVi ? '🔇 ĐÃ TẮT TIẾNG' : '🔇 MUTED') : (isVi ? '🔊 ÂM THANH: BẬT' : '🔊 SOUND: ON')}
          </button>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding-top: 0.65rem; border-top: 1px solid rgba(255,255,255,0.08);">
          <span style="font-size: 0.8125rem; color: #cbd5e1; font-weight: 700;">
            ${isVi ? 'Âm lượng tổng:' : 'Master Volume:'} <strong id="volDisplay" style="color: #38bdf8;">${Math.round((state.settings.sfxVolume || 0.5) * 100)}%</strong>
          </span>
          <input id="volumeSlider" type="range" min="0" max="1" step="0.05" value="${state.settings.sfxVolume !== undefined ? state.settings.sfxVolume : 0.5}" style="flex: 1; max-width: 200px; accent-color: #38bdf8; cursor: pointer; height: 6px;">
        </div>
      </div>

      <!-- 3. Redeem Giftcode -->
      <div style="border-radius: 0.875rem; background: linear-gradient(135deg, rgba(251,191,36,0.12) 0%, rgba(168,85,247,0.12) 100%); border: 1.5px solid rgba(251,191,36,0.45); padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.35rem;">
          <div style="font-weight: 800; font-size: 0.9375rem; color: #fbbf24; display: flex; align-items: center; gap: 0.4rem;">
            <span>🎁</span>
            <span>${isVi ? 'Nhập Mã Quà Tặng (Giftcode)' : 'Redeem Giftcode'}</span>
          </div>
          <span style="font-size: 0.6875rem; color: #94a3b8;">
            ${isVi ? 'Bấm vào mã gợi ý để điền nhanh' : 'Tap a code chip below to auto-fill'}
          </span>
        </div>

        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
          <button class="nx-code-chip" data-code="TANTHU" style="background: rgba(251,191,36,0.15); border: 1px solid rgba(251,191,36,0.4); color: #fbbf24; border-radius: 0.375rem; padding: 0.25rem 0.5rem; font-size: 0.75rem; font-family: ui-monospace, monospace; font-weight: 700; cursor: pointer;">
            + TANTHU
          </button>
          <button class="nx-code-chip" data-code="NEXYROTH" style="background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.4); color: #38bdf8; border-radius: 0.375rem; padding: 0.25rem 0.5rem; font-size: 0.75rem; font-family: ui-monospace, monospace; font-weight: 700; cursor: pointer;">
            + NEXYROTH
          </button>
          <button class="nx-code-chip" data-code="V8RELEASE" style="background: rgba(168,85,247,0.15); border: 1px solid rgba(168,85,247,0.4); color: #c084fc; border-radius: 0.375rem; padding: 0.25rem 0.5rem; font-size: 0.75rem; font-family: ui-monospace, monospace; font-weight: 700; cursor: pointer;">
            + V8RELEASE
          </button>
          <button class="nx-code-chip" data-code="VIP999" style="background: rgba(52,211,153,0.15); border: 1px solid rgba(52,211,153,0.4); color: #34d399; border-radius: 0.375rem; padding: 0.25rem 0.5rem; font-size: 0.75rem; font-family: ui-monospace, monospace; font-weight: 700; cursor: pointer;">
            + VIP999
          </button>
        </div>

        <div style="display: flex; gap: 0.5rem;">
          <input id="settingsCodeInput" type="text" placeholder="${isVi ? 'Nhập mã tại đây (VD: V8RELEASE)' : 'Enter code here (e.g. V8RELEASE)'}" style="flex: 1; padding: 0.65rem 0.875rem; border-radius: 0.5rem; background: #0b1120; border: 1.5px solid rgba(251,191,36,0.35); color: #fff; font-size: 0.875rem; font-family: ui-monospace, monospace; text-transform: uppercase; font-weight: 700; outline: none;">
          <button id="settingsCodeBtn" class="nx-btn nx-btn-gold" style="padding: 0.65rem 1.25rem; font-weight: 900; font-size: 0.875rem; flex-shrink: 0;">
            🎁 ${isVi ? 'Đổi Quà' : 'Redeem'}
          </button>
        </div>
        <div id="settingsCodeFeedback" style="display: none; font-size: 0.8125rem; font-weight: 700; padding: 0.5rem 0.75rem; border-radius: 0.5rem;"></div>
      </div>

      <!-- 4. Save Management: Base64 String Export / Import (UX Feature from v8.2) -->
      <div style="border-radius: 0.875rem; background: rgba(18,24,38,0.85); border: 1px solid rgba(168,85,247,0.35); padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
        <div style="font-weight: 800; font-size: 0.9375rem; color: #c084fc; display: flex; align-items: center; justify-content: space-between;">
          <span style="display: flex; align-items: center; gap: 0.4rem;">
            <span>💾</span>
            <span>${isVi ? 'Xuất / Nhập Save Bằng Mã Base64' : 'Base64 Save Export / Import'}</span>
          </span>
          <span style="font-size: 0.6875rem; color: #94a3b8;">${isVi ? 'Đồng bộ tiến trình đa thiết bị' : 'Cross-device sync'}</span>
        </div>
        <p style="font-size: 0.75rem; color: #94a3b8; margin: 0; line-height: 1.35;">
          ${isVi ? 'Sao chép đoạn mã Base64 dưới đây để lưu trữ hoặc dán mã vào để khôi phục tiến trình chơi game của bạn.' : 'Copy this base64 string to backup or paste your save code to restore progress.'}
        </p>
        <div style="display: flex; gap: 0.5rem;">
          <button id="btnGenBase64" class="nx-btn nx-btn-violet" style="padding: 0.45rem 0.9rem; font-size: 0.8125rem;">
            📥 ${isVi ? 'Tạo Mã Xuất' : 'Generate Export'}
          </button>
          <button id="btnCopyBase64" class="nx-btn nx-btn-secondary" style="padding: 0.45rem 0.9rem; font-size: 0.8125rem;">
            📋 ${isVi ? 'Sao Chép' : 'Copy'}
          </button>
        </div>
        <textarea id="saveBase64Area" rows="3" placeholder="${isVi ? 'Mã lưu Base64 sẽ hiển thị ở đây, hoặc dán mã save của bạn vào đây...' : 'Base64 save string will appear here, or paste your save here...'}" style="width: 100%; border-radius: 0.5rem; background: #0b1120; border: 1px solid rgba(168,85,247,0.3); color: #e2e8f0; font-family: ui-monospace, monospace; font-size: 0.6875rem; padding: 0.5rem; outline: none;"></textarea>
        <button id="btnApplyBase64" class="nx-btn nx-btn-emerald" style="padding: 0.5rem; font-size: 0.8125rem; font-weight: 800;">
          ⚡ ${isVi ? 'NẠP DỮ LIỆU TỪ MÃ TRÊN (IMPORT SAVE)' : 'IMPORT SAVE DATA'}
        </button>
      </div>

      <!-- 5. Display Toggles -->
      <div class="setting-row">
        <div>
          <div style="font-weight: 800; font-size: 0.875rem; color: #fff;">
            ${isVi ? 'Ký Hiệu Khoa Học' : 'Scientific Notation'}
          </div>
          <div style="font-size: 0.75rem; color: #94a3b8;">
            ${isVi ? 'Hiển thị dạng 1.25e9 thay vì 1.25 B' : 'Display numbers like 1.25e9 instead of 1.25 B'}
          </div>
        </div>
        <button id="toggleScientific" class="toggle-switch ${state.settings.scientificNotation ? 'is-active' : ''}">
          <span class="toggle-handle"></span>
        </button>
      </div>

      <div class="setting-row">
        <div>
          <div style="font-weight: 800; font-size: 0.875rem; color: #fff;">
            ${isVi ? 'Chữ Số Bay Khi Bấm' : 'Floating Numbers'}
          </div>
          <div style="font-size: 0.75rem; color: #94a3b8;">
            ${isVi ? 'Hiển thị số sát thương nhảy lên khi chạm Lõi' : 'Show floating damage numbers on core click'}
          </div>
        </div>
        <button id="toggleFloating" class="toggle-switch ${state.settings.floatingNumbers ? 'is-active' : ''}">
          <span class="toggle-handle"></span>
        </button>
      </div>

      <!-- 6. Tải File Dự Án .ZIP / Download Full Source Code -->
      <div style="border-radius: 0.875rem; background: linear-gradient(135deg, rgba(8,47,73,0.9) 0%, rgba(15,23,42,0.95) 100%); border: 1.5px solid rgba(56,189,248,0.5); padding: 1rem; box-shadow: 0 4px 20px rgba(56,189,248,0.2); display: flex; flex-direction: column; gap: 0.75rem;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.4rem;">📦</span>
            <div>
              <div style="font-weight: 900; font-size: 0.9375rem; color: #38bdf8;">
                ${isVi ? 'Tải Mã Nguồn Dự Án (.ZIP)' : 'Download Project Source (.ZIP)'}
              </div>
              <div style="font-size: 0.75rem; color: #94a3b8;">
                ${isVi ? 'Tải toàn bộ file code (HTML, CSS, JS, Ảnh) để chơi offline hoặc chỉnh sửa' : 'Download complete source package to play offline or modify'}
              </div>
            </div>
          </div>
          <span style="font-size: 0.6875rem; font-weight: 800; background: rgba(56,189,248,0.2); color: #38bdf8; border: 1px solid rgba(56,189,248,0.4); padding: 2px 8px; border-radius: 9999px; font-family: monospace;">v8.0 ZIP</span>
        </div>

        <a id="btnSettingsExportZipDirect" href="./nexyroth-clicker-v8.zip" download="nexyroth-clicker-v8.zip" class="nx-btn nx-btn-primary" style="width: 100%; padding: 0.75rem 1rem; font-size: 0.875rem; font-weight: 800; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 0.5rem; box-shadow: 0 0 15px rgba(56,189,248,0.4); border-radius: 0.625rem; cursor: pointer;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span>${isVi ? 'TẢI FILE DỰ ÁN (.ZIP) VỀ MÁY' : 'DOWNLOAD PROJECT (.ZIP) NOW'}</span>
        </a>
      </div>

      <!-- 7. File Backup (.json) -->
      <div style="border-top: 1px solid var(--nx-surface-border); padding-top: 0.875rem; display: flex; flex-direction: column; gap: 0.625rem;">
        <div style="font-size: 0.8125rem; font-weight: 700; color: #cbd5e1; display: flex; align-items: center; gap: 0.4rem;">
          <span>💾</span>
          <span>${isVi ? 'Sao Lưu / Phục Hồi Bằng File .JSON' : 'Backup / Restore via .JSON File'}</span>
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button id="btnExportSaveJson" class="nx-btn nx-btn-secondary" style="flex: 1; padding: 0.5rem;">
            ${isVi ? '📥 Xuất File (.json)' : '📥 Export File (.json)'}
          </button>
          <button id="btnImportSaveJson" class="nx-btn nx-btn-secondary" style="flex: 1; padding: 0.5rem;">
            ${isVi ? '📤 Nhập File' : '📤 Import File'}
          </button>
        </div>
      </div>

      <!-- 8. Danger Zone -->
      <div style="border-top: 1px solid rgba(244,63,94,0.3); padding-top: 0.75rem;">
        <button id="btnHardReset" class="nx-btn nx-btn-danger" style="width: 100%; font-size: 0.8125rem;">
          ⚠️ ${isVi ? 'XÓA TOÀN BỘ DỮ LIỆU (CHƠI LẠI TỪ ĐẦU)' : 'HARD RESET (WIPE ALL PROGRESS)'}
        </button>
      </div>
    `;

    // Bind Language Switches
    const btnVi = document.getElementById('langViBtn');
    const btnEn = document.getElementById('langEnBtn');
    if (btnVi) btnVi.onclick = function () { global.I18n.setLang('vi'); renderSettingsContent(); };
    if (btnEn) btnEn.onclick = function () { global.I18n.setLang('en'); renderSettingsContent(); };

    // Bind Quick Mute Button
    const muteBtn = document.getElementById('quickMuteBtn');
    if (muteBtn) {
      muteBtn.onclick = function () {
        if (global.Sound && global.Sound.toggleMute) {
          global.Sound.toggleMute();
        } else {
          state.settings.sfxEnabled = !state.settings.sfxEnabled;
          global.GameState.save();
        }
        renderSettingsContent();
      };
    }

    // Bind Volume Slider
    const volSlider = document.getElementById('volumeSlider');
    const volDisplay = document.getElementById('volDisplay');
    if (volSlider) {
      volSlider.oninput = function () {
        const val = parseFloat(volSlider.value);
        if (global.Sound && global.Sound.setVolume) {
          global.Sound.setVolume(val);
        } else {
          state.settings.sfxVolume = val;
          global.GameState.save();
        }
        if (volDisplay) volDisplay.textContent = Math.round(val * 100) + '%';
      };
    }

    // Bind Display Toggles
    const toggleSci = document.getElementById('toggleScientific');
    if (toggleSci) {
      toggleSci.onclick = function () {
        state.settings.scientificNotation = !state.settings.scientificNotation;
        global.GameState.save();
        renderSettingsContent();
        if (global.UICore && global.UICore.updateStatsDisplay) global.UICore.updateStatsDisplay();
      };
    }

    const toggleFloat = document.getElementById('toggleFloating');
    if (toggleFloat) {
      toggleFloat.onclick = function () {
        state.settings.floatingNumbers = !state.settings.floatingNumbers;
        global.GameState.save();
        renderSettingsContent();
      };
    }

    // Bind Code Chips & Giftcode
    container.querySelectorAll('.nx-code-chip').forEach(function (chip) {
      chip.onclick = function () {
        const code = chip.getAttribute('data-code');
        const codeInput = document.getElementById('settingsCodeInput');
        if (codeInput && code) {
          codeInput.value = code;
          codeInput.focus();
        }
      };
    });

    const codeBtn = document.getElementById('settingsCodeBtn');
    const codeInput = document.getElementById('settingsCodeInput');
    const codeFeedback = document.getElementById('settingsCodeFeedback');
    if (codeBtn && codeInput) {
      codeBtn.onclick = function () {
        const code = codeInput.value.trim().toUpperCase();
        if (!code) return;
        const result = handleRedeemCode(code);
        if (codeFeedback) {
          codeFeedback.style.display = 'block';
          codeFeedback.style.background = result.success ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)';
          codeFeedback.style.color = result.success ? '#34d399' : '#f87171';
          codeFeedback.style.border = result.success ? '1px solid #10b981' : '1px solid #ef4444';
          codeFeedback.textContent = (result.success ? '✓ ' : '✗ ') + result.message;
          if (result.success) codeInput.value = '';
        }
      };
    }

    // Bind Base64 Export & Import
    const btnGenB64 = document.getElementById('btnGenBase64');
    const btnCopyB64 = document.getElementById('btnCopyBase64');
    const b64Area = document.getElementById('saveBase64Area');
    const btnApplyB64 = document.getElementById('btnApplyBase64');

    if (btnGenB64 && b64Area) {
      btnGenB64.onclick = function () {
        b64Area.value = global.GameState.exportBase64();
        if (global.Toast) global.Toast.show(isVi ? 'Đã tạo mã lưu thành công!' : 'Base64 code generated!', 'success');
      };
    }

    if (btnCopyB64 && b64Area) {
      btnCopyB64.onclick = function () {
        if (!b64Area.value) b64Area.value = global.GameState.exportBase64();
        navigator.clipboard.writeText(b64Area.value).then(function () {
          if (global.Toast) global.Toast.show(isVi ? 'Đã sao chép mã lưu vào clipboard!' : 'Copied save code to clipboard!', 'success');
        });
      };
    }

    if (btnApplyB64 && b64Area) {
      btnApplyB64.onclick = function () {
        const code = b64Area.value.trim();
        if (!code) {
          if (global.Toast) global.Toast.show(isVi ? 'Vui lòng dán mã lưu trước!' : 'Please paste a save code first!', 'warning');
          return;
        }
        const res = global.GameState.importBase64(code);
        if (res.success) {
          if (global.Toast) global.Toast.show(isVi ? '🎉 Nhập tiến trình thành công! Đang tải lại...' : '🎉 Save imported! Reloading...', 'success');
          setTimeout(function () { window.location.reload(); }, 600);
        } else {
          if (global.Toast) global.Toast.show(res.error, 'error');
        }
      };
    }

    // Bind File Export/Import
    const btnExpSave = document.getElementById('btnExportSaveJson');
    if (btnExpSave) {
      btnExpSave.onclick = function () {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute('href', dataStr);
        dlAnchor.setAttribute('download', 'nexyroth_save_v8_' + Date.now() + '.json');
        dlAnchor.click();
      };
    }

    const btnImpSave = document.getElementById('btnImportSaveJson');
    if (btnImpSave) {
      btnImpSave.onclick = function () {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = function (e) {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = function (evt) {
            try {
              const parsed = JSON.parse(evt.target.result);
              if (parsed && typeof parsed.essence === 'number') {
                global.GameState.set(parsed);
                global.GameState.save();
                window.location.reload();
              }
            } catch (err) {
              if (global.Toast) global.Toast.show(isVi ? 'Tệp sao lưu không hợp lệ.' : 'Invalid save file format.', 'error');
            }
          };
          reader.readAsText(file);
        };
        input.click();
      };
    }

    const btnExpZip = document.getElementById('btnSettingsExportZip');
    if (btnExpZip && global.ZipExport) {
      btnExpZip.onclick = function () { global.ZipExport.download(); };
    }

    const btnReset = document.getElementById('btnHardReset');
    if (btnReset) {
      btnReset.onclick = function () {
        const confirmMsg = isVi
          ? 'CẢNH BÁO: Thao tác này sẽ xoá toàn bộ tiến trình và chơi lại từ đầu. Bạn có chắc chắn không?'
          : 'WARNING: This will wipe all game progress and restart from zero. Are you sure?';
        if (confirm(confirmMsg)) {
          global.GameState.reset();
          window.location.reload();
        }
      };
    }
  }

  // =========================================================================
  // 2. COSMIC SHOP CONTENT (3 TABS: GEMS, SIMULATED TOP-UP, VIP GAME PASS)
  // =========================================================================
  let currentShopTab = 'gems'; // 'gems' | 'topup' | 'gamepass'
  let pendingCheckoutItem = null;

  function setShopTab(tab) {
    currentShopTab = tab;
    renderGemShopContent();
  }

  function renderGemShopContent() {
    const container = document.getElementById('gemShopModalContent');
    if (!container) return;

    const state = global.GameState.get();
    const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;
    const potionMetas = global.GameState.getPotionMetadata ? global.GameState.getPotionMetadata() : [];
    const topupPacks = global.GameState.getGemTopupPacks ? global.GameState.getGemTopupPacks() : [];
    const gamePasses = global.GameState.getGamePasses ? global.GameState.getGamePasses() : [];

    // Top Header: Currency & Quick Actions
    let headerHtml = `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; border-radius: 1rem; background: linear-gradient(135deg, rgba(251,191,36,0.18) 0%, rgba(56,189,248,0.12) 100%); border: 1.5px solid rgba(251,191,36,0.5); gap: 0.75rem; flex-wrap: wrap;">
        <div>
          <div style="font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; font-weight: 800; letter-spacing: 0.5px;">
            ${isVi ? 'Số Dư Đá Quý Của Bạn (Tiền tệ hiếm)' : 'Your Rare Astral Gems'}
          </div>
          <div style="font-size: 1.65rem; font-weight: 900; color: #fbbf24; font-family: ui-monospace, monospace; text-shadow: 0 0 12px rgba(251,191,36,0.5);">
            ${state.astralGems} 💎
          </div>
        </div>
        <div style="display: flex; gap: 0.45rem; flex-wrap: wrap;">
          <button class="nx-btn ${currentShopTab === 'topup' ? 'nx-btn-primary' : 'nx-btn-gold'}" style="font-size: 0.75rem; padding: 0.45rem 0.85rem;" onclick="UIModals.setShopTab('topup')">
            💳 ${isVi ? '+ Nạp Đá Quý (Mô Phỏng)' : '+ Top-Up (Sandbox)'}
          </button>
          <button class="nx-btn nx-btn-secondary" style="font-size: 0.75rem; padding: 0.45rem 0.85rem;" onclick="UIModals.open('inventoryModal')">
            🎒 ${isVi ? 'Mở Balo' : 'Backpack'}
          </button>
        </div>
      </div>
    `;

    // 3 Sub-tabs Navigation
    let tabsHtml = `
      <div class="shop-nav-tabs" style="margin-top: 0.875rem;">
        <button class="shop-tab-btn ${currentShopTab === 'gems' ? 'is-active' : ''}" onclick="UIModals.setShopTab('gems')">
          <span>💎</span>
          <span>${isVi ? 'Cửa Hàng Gem' : 'Gem Store'}</span>
        </button>
        <button class="shop-tab-btn ${currentShopTab === 'topup' ? 'is-active' : ''}" onclick="UIModals.setShopTab('topup')">
          <span>💳</span>
          <span>${isVi ? 'Nạp Đá Quý (Mô Phỏng)' : 'Top-Up Packs'}</span>
        </button>
        <button class="shop-tab-btn tab-gamepass ${currentShopTab === 'gamepass' ? 'is-active' : ''}" onclick="UIModals.setShopTab('gamepass')">
          <span>👑</span>
          <span>${isVi ? 'Game Pass Vĩnh Viễn' : 'VIP Game Passes'}</span>
        </button>
      </div>
    `;

    let bodyHtml = '';

    // ==========================================
    // TAB 1: GEMS STORE (POTIONS & PERKS)
    // ==========================================
    if (currentShopTab === 'gems') {
      let potionsHtml = '';
      potionMetas.forEach(function (p) {
        const owned = (state.potions && state.potions[p.id]) || 0;
        const activeDuration = (state.activePotions && state.activePotions[p.type]) || 0;
        const canAfford = state.astralGems >= p.costGems;
        const name = isVi ? p.nameVi : p.nameEn;
        const desc = isVi ? p.descVi : p.descEn;

        potionsHtml += `
          <div class="nx-card" style="padding: 0.875rem; border-color: ${activeDuration > 0 ? 'rgba(56,189,248,0.5)' : 'var(--nx-surface-border)'}; background: ${activeDuration > 0 ? 'rgba(8,47,73,0.35)' : 'rgba(18,24,38,0.85)'};">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div style="width: 2.75rem; height: 2.75rem; border-radius: 0.625rem; background: rgba(56,189,248,0.12); display: flex; align-items: center; justify-content: center; font-size: 1.35rem; flex-shrink: 0; border: 1.5px solid rgba(56,189,248,0.3);">
                  ${p.icon}
                </div>
                <div>
                  <div style="display: flex; align-items: center; gap: 0.45rem; flex-wrap: wrap;">
                    <span style="font-weight: 800; font-size: 0.875rem; color: #fff;">${name}</span>
                    <span class="nx-badge" style="background: rgba(56,189,248,0.15); color: #38bdf8; font-size: 0.6875rem; font-weight: 800;">
                      ${isVi ? 'Balo: ' + owned : 'Bag: ' + owned}
                    </span>
                    ${activeDuration > 0 ? `
                      <span class="nx-badge nx-badge-emerald" style="font-size: 0.6875rem; font-weight: 800; animation: pulse 2s infinite;">
                        ${isVi ? '⏳ Đang chạy: ' : '⏳ Active: '}${formatDuration(activeDuration)}
                      </span>
                    ` : ''}
                  </div>
                  <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.2rem; line-height: 1.35;">
                    ${desc}
                  </div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 0.4rem; margin-top: 0.25rem;">
                <button class="nx-btn ${canAfford ? 'nx-btn-gold' : 'nx-btn-disabled'}" style="padding: 0.4rem 0.75rem; font-size: 0.75rem;" onclick="UIModals.buyPotion('${p.id}', false)">
                  💎 ${p.costGems} Gems
                </button>
                <button class="nx-btn ${canAfford ? 'nx-btn-emerald' : 'nx-btn-disabled'}" style="padding: 0.4rem 0.75rem; font-size: 0.75rem;" onclick="UIModals.buyPotion('${p.id}', true)">
                  ⚡ ${isVi ? 'Dùng Ngay' : 'Use Now'}
                </button>
              </div>
            </div>
          </div>
        `;
      });

      let perksHtml = '';
      state.gemShopItems.forEach(function (item) {
        const canAfford = state.astralGems >= item.costGems;
        let desc = item.desc;
        if (isVi) {
          if (item.id === 'gem_auto_click') desc = 'Tự động bấm lõi liên tục 5 lần/giây.';
          if (item.id === 'gem_crit_overload') desc = 'Tăng vĩnh viễn +10% Tỉ lệ Chí Mạng và +200% (+2.0) Sát Thương Chí Mạng.';
        }
        perksHtml += `
          <div class="nx-card" style="padding: 0.875rem; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;">
            <div style="min-width: 0;">
              <div style="font-size: 0.875rem; font-weight: 800; color: #fff;">${item.name}</div>
              <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.15rem;">${desc}</div>
            </div>
            <div>
              ${item.purchased
                ? `<span class="nx-badge nx-badge-cyan" style="font-size: 0.75rem; font-weight: 800;">${isVi ? '✓ ĐÃ SỞ HỮU' : '✓ OWNED'}</span>`
                : `<button class="nx-btn ${canAfford ? 'nx-btn-gold' : 'nx-btn-disabled'}" style="padding: 0.4rem 0.8rem;" onclick="UIModals.buyGemItem('${item.id}')">
                     💎 ${item.costGems} Gems
                   </button>`
                }
            </div>
          </div>
        `;
      });

      bodyHtml = `
        <div style="margin-top: 1rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
            <div style="font-size: 0.8125rem; font-weight: 800; text-transform: uppercase; color: #38bdf8; display: flex; align-items: center; gap: 0.4rem;">
              <span>🧪</span>
              <span>${isVi ? 'Thuốc Năng Lượng & Tăng Cường (Dùng Gem)' : 'Timed Potions & Boosts'}</span>
            </div>
            <span style="font-size: 0.6875rem; color: #94a3b8;">${isVi ? '⏱️ Mỗi lọ 5 phút · Cộng dồn thời gian & hệ số' : '⏱️ 5 mins · Stacks duration & multipliers'}</span>
          </div>
          <div class="shop-items-container">
            ${potionsHtml}
          </div>
        </div>

        <div style="margin-top: 1.25rem; padding-bottom: 24px;">
          <div style="font-size: 0.8125rem; font-weight: 800; text-transform: uppercase; color: #fbbf24; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
            <span>💎</span>
            <span>${isVi ? 'Đặc Quyền Vĩnh Viễn Bằng Đá Quý' : 'Permanent Astral Perks'}</span>
          </div>
          <div class="shop-items-container">
            ${perksHtml}
          </div>
        </div>
      `;
    }

    // ==========================================
    // TAB 2: TOP-UP PACKS (SIMULATED IAP)
    // ==========================================
    else if (currentShopTab === 'topup') {
      let packsHtml = '';
      topupPacks.forEach(function (pack) {
        const totalGems = pack.gems + (pack.bonusGems || 0);
        packsHtml += `
          <div class="shop-topup-card">
            ${pack.badge ? `
              <div style="position: absolute; top: 0.6rem; right: 0.6rem; background: linear-gradient(135deg, #ef4444, #f97316); color: #fff; font-size: 0.625rem; font-weight: 900; padding: 2px 7px; border-radius: 9999px; letter-spacing: 0.3px; box-shadow: 0 0 10px rgba(239,68,68,0.5);">
                ${pack.badge}
              </div>
            ` : ''}

            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="width: 3.25rem; height: 3.25rem; border-radius: 0.75rem; background: rgba(251,191,36,0.15); border: 1.5px solid rgba(251,191,36,0.4); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; flex-shrink: 0; box-shadow: 0 0 15px rgba(251,191,36,0.2);">
                ${pack.icon}
              </div>
              <div>
                <div style="font-weight: 800; font-size: 0.875rem; color: #fff;">${isVi ? pack.nameVi : pack.nameEn}</div>
                <div style="font-size: 1.15rem; font-weight: 900; color: #fbbf24; font-family: ui-monospace, monospace; margin-top: 0.15rem;">
                  +${pack.gems} 💎
                  ${pack.bonusGems > 0 ? `<span style="font-size: 0.75rem; color: #34d399; font-weight: 800;">(+${pack.bonusGems} thưởng)</span>` : ''}
                </div>
              </div>
            </div>

            <div style="margin-top: 0.75rem; padding-top: 0.65rem; border-top: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
              <div>
                <div style="font-size: 0.95rem; font-weight: 900; color: #fff; font-family: ui-monospace, monospace;">${pack.priceVnd}</div>
                <div style="font-size: 0.6875rem; color: #94a3b8;">(${pack.priceUsd})</div>
              </div>
              <button class="nx-btn nx-btn-gold" style="font-size: 0.75rem; padding: 0.45rem 0.85rem; flex-shrink: 0;" onclick="UIModals.openPaymentModal('topup', '${pack.id}')">
                ⚡ ${isVi ? 'Nạp Ngay' : 'Top-Up'}
              </button>
            </div>
          </div>
        `;
      });

      bodyHtml = `
        <div style="margin-top: 1rem; padding-bottom: 24px;">
          <div style="padding: 0.85rem 1rem; border-radius: 0.75rem; background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.3); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.5rem;">ℹ️</span>
            <div style="font-size: 0.75rem; color: #bae6fd; line-height: 1.4;">
              <strong>${isVi ? 'CỔNG NẠP MÔ PHỎNG (SANDBOX):' : 'SIMULATED TOP-UP GATEWAY:'}</strong>
              ${isVi
                ? 'Đây là chức năng nạp thẻ thử nghiệm để game thủ trải nghiệm không giới hạn. Mọi thao tác nạp tiền là HOÀN TOÀN MIỄN PHÍ, KHÔNG TRỪ TIỀN THẬT!'
                : 'This is a simulated sandbox top-up interface. Everything is 100% FREE for testing, no real money will be charged!'}
            </div>
          </div>

          <div class="shop-topup-grid">
            ${packsHtml}
          </div>
        </div>
      `;
    }

    // ==========================================
    // TAB 3: PERMANENT VIP GAME PASSES
    // ==========================================
    else if (currentShopTab === 'gamepass') {
      let passesHtml = '';
      const ownedPasses = state.gamePasses || {};
      const hasUltimate = ownedPasses.pass_ultimate_bundle;

      gamePasses.forEach(function (pass) {
        const isOwned = ownedPasses[pass.id] || (pass.id !== 'pass_ultimate_bundle' && hasUltimate);
        const name = isVi ? pass.nameVi : pass.nameEn;
        const desc = isVi ? pass.descVi : pass.descEn;

        passesHtml += `
          <div class="nx-card" style="position: relative; padding: 1rem; border-color: ${isOwned ? 'rgba(168,85,247,0.6)' : 'var(--nx-surface-border)'}; background: ${isOwned ? 'rgba(88,28,135,0.25)' : 'rgba(18,24,38,0.85)'};">
            ${pass.badge ? `
              <div style="position: absolute; top: 0.75rem; right: 0.75rem; background: linear-gradient(135deg, #a855f7, #ec4899); color: #fff; font-size: 0.625rem; font-weight: 900; padding: 2px 8px; border-radius: 9999px; letter-spacing: 0.3px;">
                ${pass.badge}
              </div>
            ` : ''}

            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.75rem; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: 0.85rem; max-width: 500px;">
                <div style="width: 3.25rem; height: 3.25rem; border-radius: 0.75rem; background: rgba(168,85,247,0.15); border: 1.5px solid rgba(168,85,247,0.4); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; flex-shrink: 0; box-shadow: 0 0 15px rgba(168,85,247,0.25);">
                  ${pass.icon}
                </div>
                <div>
                  <div style="font-weight: 800; font-size: 0.95rem; color: #fff;">${name}</div>
                  <div style="font-size: 0.75rem; color: #cbd5e1; margin-top: 0.25rem; line-height: 1.4;">
                    ${desc}
                  </div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 0.75rem; margin-top: 0.25rem;">
                <div style="text-align: right;">
                  <div style="font-size: 0.95rem; font-weight: 900; color: #fbbf24; font-family: ui-monospace, monospace;">${pass.priceVnd}</div>
                  <div style="font-size: 0.6875rem; color: #94a3b8;">(${pass.priceUsd})</div>
                </div>
                ${isOwned ? `
                  <span class="nx-badge nx-badge-emerald" style="font-size: 0.75rem; font-weight: 900; padding: 0.45rem 0.85rem; border-color: rgba(52,211,153,0.6);">
                    ✓ ${isVi ? 'ĐÃ KÍCH HOẠT' : 'ACTIVATED'}
                  </span>
                ` : `
                  <button class="nx-btn nx-btn-primary" style="font-size: 0.75rem; padding: 0.45rem 0.85rem; background: linear-gradient(135deg, #a855f7, #6366f1); border-color: #c084fc;" onclick="UIModals.openPaymentModal('gamepass', '${pass.id}')">
                    👑 ${isVi ? 'Mua Vĩnh Viễn' : 'Unlock Pass'}
                  </button>
                `}
              </div>
            </div>
          </div>
        `;
      });

      bodyHtml = `
        <div style="margin-top: 1rem; padding-bottom: 24px;">
          <div style="padding: 0.85rem 1rem; border-radius: 0.75rem; background: rgba(168,85,247,0.12); border: 1px solid rgba(168,85,247,0.35); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.5rem;">👑</span>
            <div style="font-size: 0.75rem; color: #e9d5ff; line-height: 1.4;">
              <strong>${isVi ? 'ĐẶC QUYỀN VIP VĨNH VIỄN KHÔNG HẠN DÙNG:' : 'PERMANENT VIP PRIVILEGES:'}</strong>
              ${isVi
                ? 'Các gói Game Pass được lưu trữ vĩnh viễn trên tài khoản qua mọi lần Trùng Sinh và reset. Mua 1 lần sở hữu mãi mãi (Thanh toán thử nghiệm sandbox).'
                : 'Game Passes persist permanently across all Ascensions & resets. One-time purchase, forever yours (Simulated sandbox payment).'}
            </div>
          </div>

          <div class="shop-items-container">
            ${passesHtml}
          </div>
        </div>
      `;
    }

    container.innerHTML = headerHtml + tabsHtml + bodyHtml;
  }

  // =========================================================================
  // SIMULATED CHECKOUT MODAL (SANDBOX PAYMENT MODAL)
  // =========================================================================
  function openPaymentModal(type, itemId) {
    const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;
    let target = null;

    if (type === 'topup') {
      const packs = global.GameState.getGemTopupPacks ? global.GameState.getGemTopupPacks() : [];
      target = packs.find(function (p) { return p.id === itemId; });
    } else if (type === 'gamepass') {
      const passes = global.GameState.getGamePasses ? global.GameState.getGamePasses() : [];
      target = passes.find(function (p) { return p.id === itemId; });
    }

    if (!target) return;
    pendingCheckoutItem = { type: type, id: itemId, data: target };

    const modal = document.getElementById('simulatedPaymentModal');
    const container = document.getElementById('simulatedPaymentModalContent');
    if (!modal || !container) return;

    const name = isVi ? target.nameVi : target.nameEn;
    const desc = isVi ? (target.descVi || `Nhận ngay +${target.gems + (target.bonusGems || 0)} Đá Quý vào tài khoản!`) : (target.descEn || `Receive +${target.gems + (target.bonusGems || 0)} Astral Gems!`);

    container.innerHTML = `
      <div style="text-align: center; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.08);">
        <div style="width: 4rem; height: 4rem; border-radius: 1rem; background: rgba(56,189,248,0.15); border: 2px solid #38bdf8; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; margin: 0 auto 0.75rem auto; box-shadow: 0 0 20px rgba(56,189,248,0.3);">
          ${target.icon}
        </div>
        <div style="font-size: 1.1rem; font-weight: 800; color: #fff;">${name}</div>
        <div style="font-size: 0.8125rem; color: #94a3b8; margin-top: 0.25rem;">${desc}</div>
        <div style="margin-top: 0.75rem; font-size: 1.6rem; font-weight: 900; color: #fbbf24; font-family: ui-monospace, monospace;">
          ${target.priceVnd} <span style="font-size: 0.875rem; color: #94a3b8; font-weight: 500;">(${target.priceUsd})</span>
        </div>
      </div>

      <div style="margin-top: 1rem;">
        <div style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #38bdf8; margin-bottom: 0.5rem;">
          ${isVi ? 'Phương Thức Thanh Toán (Mô Phỏng Sandbox)' : 'Simulated Payment Method'}
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.45rem;">
          <label class="checkout-method-label">
            <input type="radio" name="payMethod" value="momo" checked style="accent-color: #d946ef;">
            <span class="method-inner" style="font-size: 0.8125rem; color: #e2e8f0; display: flex; align-items: center; gap: 0.4rem;">
              <span>📱</span> <span>Ví Điện Tử MoMo / ZaloPay (Sandbox)</span>
            </span>
          </label>
          <label class="checkout-method-label">
            <input type="radio" name="payMethod" value="bank" style="accent-color: #38bdf8;">
            <span class="method-inner" style="font-size: 0.8125rem; color: #e2e8f0; display: flex; align-items: center; gap: 0.4rem;">
              <span>🏦</span> <span>Chuyển Khoản Ngân Hàng QR Code (Sandbox)</span>
            </span>
          </label>
          <label class="checkout-method-label">
            <input type="radio" name="payMethod" value="visa" style="accent-color: #fbbf24;">
            <span class="method-inner" style="font-size: 0.8125rem; color: #e2e8f0; display: flex; align-items: center; gap: 0.4rem;">
              <span>💳</span> <span>Thẻ Quốc Tế Visa / Master / JCB (Sandbox)</span>
            </span>
          </label>
        </div>
      </div>

      <div style="margin-top: 1rem; padding: 0.65rem 0.85rem; border-radius: 0.6rem; background: rgba(30,41,59,0.5); border: 1px solid rgba(255,255,255,0.06); font-size: 0.6875rem; color: #94a3b8; line-height: 1.4; text-align: center;">
        🔒 ${isVi
          ? 'Môi trường Sandbox thử nghiệm tính năng. Khi bấm xác nhận, hệ thống sẽ kích hoạt vật phẩm ngay lập tức mà KHÔNG trừ tiền thật của bạn.'
          : 'Sandbox testing environment. Confirming will instantly grant the items without charging real money.'}
      </div>

      <div style="display: flex; gap: 0.5rem; margin-top: 1.25rem;">
        <button class="nx-btn nx-btn-secondary" style="flex: 1; padding: 0.65rem;" onclick="UIModals.closePaymentModal()">
          ${isVi ? '❌ Hủy Bỏ' : 'Cancel'}
        </button>
        <button class="nx-btn nx-btn-gold" style="flex: 2; padding: 0.65rem; font-weight: 800;" onclick="UIModals.confirmSandboxPayment()">
          ✅ ${isVi ? 'Xác Nhận Nạp (Mô Phỏng)' : 'Confirm (Sandbox)'}
        </button>
      </div>
    `;

    modal.classList.add('is-open');
  }

  function closePaymentModal() {
    const modal = document.getElementById('simulatedPaymentModal');
    if (modal) modal.classList.remove('is-open');
    pendingCheckoutItem = null;
  }

  function confirmSandboxPayment() {
    if (!pendingCheckoutItem) {
      closePaymentModal();
      return;
    }

    const state = global.GameState.get();
    const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;
    const type = pendingCheckoutItem.type;
    const id = pendingCheckoutItem.id;
    const data = pendingCheckoutItem.data;

    if (type === 'topup') {
      const addedGems = (data.gems || 0) + (data.bonusGems || 0);
      state.astralGems = (state.astralGems || 0) + addedGems;

      if (global.Sound) global.Sound.playAchievement();
      if (global.Toast) {
        const msg = isVi
          ? `🎉 Nạp mô phỏng thành công ${data.nameVi}! Bạn nhận được +${addedGems} 💎 Đá Quý vào số dư!`
          : `🎉 Simulated top-up successful for ${data.nameEn}! +${addedGems} Gems added!`;
        global.Toast.show(msg, 'success');
      }
    } else if (type === 'gamepass') {
      if (!state.gamePasses) state.gamePasses = {};
      state.gamePasses[id] = true;

      // If purchased the ultimate bundle, grant all passes!
      if (id === 'pass_ultimate_bundle') {
        state.gamePasses.pass_autoclick_perm = true;
        state.gamePasses.pass_double_essence = true;
        state.gamePasses.pass_fortune_loot = true;
        state.gamePasses.pass_offline_24h = true;
        state.gamePasses.pass_crit_overdrive = true;
      }

      if (global.Sound) global.Sound.playAchievement();
      if (global.Toast) {
        const msg = isVi
          ? `👑 Kích hoạt thành công Game Pass: ${data.nameVi} vĩnh viễn trên tài khoản!`
          : `👑 Game Pass Activated: ${data.nameEn} permanently unlocked!`;
        global.Toast.show(msg, 'success');
      }
    }

    global.GameState.save();
    if (global.UICore) {
      global.UICore.updateStatsDisplay();
      if (global.UICore.updateActiveBuffs) global.UICore.updateActiveBuffs();
    }

    closePaymentModal();
    renderGemShopContent();
  }

  function buyPotion(potionId, useImmediately) {
    const state = global.GameState.get();
    const metaList = global.GameState.getPotionMetadata ? global.GameState.getPotionMetadata() : [];
    const meta = metaList.find(function (m) { return m.id === potionId; });
    if (!meta) return;

    const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;
    if (state.astralGems < meta.costGems) {
      const msg = isVi ? `Bạn không đủ Đá Quý (Cần ${meta.costGems} 💎, hiện có ${state.astralGems} 💎)!` : `Not enough Gems!`;
      if (global.Toast) global.Toast.show(msg, 'warning');
      if (global.Sound) global.Sound.playError();
      return;
    }

    state.astralGems -= meta.costGems;
    if (!state.potions) state.potions = {};

    if (useImmediately) {
      if (!state.activePotions) state.activePotions = {};
      const cur = state.activePotions[meta.type] || 0;
      state.activePotions[meta.type] = cur + (meta.duration || 300);
      state.potionsUsed = (state.potionsUsed || 0) + 1;
      if (global.Toast) {
        const timeFormatted = formatDuration(state.activePotions[meta.type]);
        const msg = isVi ? `✨ Đã mua & kích hoạt ${meta.nameVi}! Thời gian hiệu lực: ${timeFormatted}` : `✨ Bought & activated ${meta.nameEn}! (${timeFormatted})`;
        global.Toast.show(msg, 'success');
      }
    } else {
      state.potions[potionId] = (state.potions[potionId] || 0) + 1;
      if (global.Toast) {
        const msg = isVi ? `🎒 Đã mua ${meta.nameVi} và cất vào Balo!` : `🎒 Purchased ${meta.nameEn} to Backpack!`;
        global.Toast.show(msg, 'info');
      }
    }

    if (global.Sound) global.Sound.playUpgrade();
    global.GameState.save();
    if (global.UICore) {
      global.UICore.updateStatsDisplay();
      if (global.UICore.updateActiveBuffs) global.UICore.updateActiveBuffs();
    }
    updateBackpackBadge();
    renderGemShopContent();
    renderInventoryContent();
  }

  function buyGemItem(itemId) {
    const state = global.GameState.get();
    const item = state.gemShopItems.find(function (i) { return i.id === itemId; });
    if (!item || item.purchased || state.astralGems < item.costGems) {
      if (global.Sound) global.Sound.playError();
      return;
    }

    state.astralGems -= item.costGems;
    item.purchased = true;

    if (global.Sound) global.Sound.playAchievement();
    global.GameState.save();
    if (global.UICore) global.UICore.updateStatsDisplay();
    renderGemShopContent();
    renderInventoryContent();
  }

  // =========================================================================
  // 3. SKILLS CONTENT (Astral Constellations - Interactive Celestial Node Graph)
  // =========================================================================
  let currentSkillBranch = 'all';
  let selectedSkillId = 'core';

  function setSkillBranch(branch) {
    currentSkillBranch = branch;
    if (branch !== 'all') {
      const state = global.GameState.get();
      const firstBranchSkill = state.skills.find(function (s) { return s.branch === branch; });
      if (firstBranchSkill) selectedSkillId = firstBranchSkill.id;
    }
    renderSkillsContent();
  }

  function selectSkillNode(skillId) {
    selectedSkillId = skillId;
    renderSkillsContent();
  }

  function respecSkills() {
    const state = global.GameState.get();
    const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;

    let refunded = 0;
    state.skills.forEach(function (s) {
      if (s.id === 'core') return; // Core node is permanent origin
      if (s.level && s.level > 0) {
        refunded += s.level * s.costPoints;
        s.level = 0;
        s.unlocked = false;
      } else if (s.unlocked) {
        refunded += s.costPoints;
        s.level = 0;
        s.unlocked = false;
      }
    });

    if (refunded <= 0) {
      if (global.Toast) {
        global.Toast.show(isVi ? 'Bạn chưa đầu tư điểm kỹ năng nào để tẩy.' : 'No skill points invested to reset.', 'info');
      }
      return;
    }

    state.skillPoints += refunded;
    selectedSkillId = 'core';
    if (global.Sound) global.Sound.playAchievement();
    if (global.Toast) {
      global.Toast.show(
        isVi ? `✨ Tẩy kỹ năng thành công! Hoàn trả lại +${refunded} Điểm Kỹ Năng (SP)!` : `✨ Skills reset! Refunded +${refunded} Skill Points!`,
        'success'
      );
    }

    global.GameState.save();
    if (global.UICore && global.UICore.updateStatsDisplay) global.UICore.updateStatsDisplay();
    renderSkillsContent();
  }

  function unlockOrUpgradeSkill(skillId) {
    const state = global.GameState.get();
    const skill = state.skills.find(function (s) { return s.id === skillId; });
    if (!skill || skill.id === 'core') return;

    if (!skill.isInfinite && (skill.level || 0) >= skill.maxLevel) return;

    // Check prerequisites
    if (skill.requires && skill.requires.length > 0) {
      const allMet = skill.requires.every(function (reqId) {
        const req = state.skills.find(function (s) { return s.id === reqId; });
        return req && req.unlocked;
      });
      if (!allMet) return;
    }

    if (state.skillPoints < skill.costPoints) {
      if (global.Toast) {
        const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;
        global.Toast.show(isVi ? `Thiếu Điểm Kỹ Năng (${state.skillPoints}/${skill.costPoints} SP)` : `Not enough SP`, 'warning');
      }
      return;
    }

    state.skillPoints -= skill.costPoints;
    skill.level = (skill.level || 0) + 1;
    skill.unlocked = true;
    selectedSkillId = skill.id;

    if (global.Sound) global.Sound.playUpgrade();
    if (global.Toast) {
      const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;
      const title = isVi ? (skill.nameVi || skill.name) : skill.name;
      global.Toast.show(
        isVi ? `⭐ Nâng cấp / Khai mở ${title} lên Cấp ${skill.level}!` : `⭐ Upgraded ${skill.name} to Lv ${skill.level}!`,
        'success'
      );
    }

    global.GameState.save();
    if (global.UICore && global.UICore.updateStatsDisplay) global.UICore.updateStatsDisplay();
    renderSkillsContent();
  }

  function unlockSkill(skillId) {
    unlockOrUpgradeSkill(skillId);
  }

  function upgradeInfiniteSkill(skillId) {
    unlockOrUpgradeSkill(skillId);
  }

  function renderSkillsContent() {
    const container = document.getElementById('skillsModalContent');
    if (!container) return;

    const state = global.GameState.get();
    const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;

    // Calculate total invested SP
    let totalInvestedSP = 0;
    state.skills.forEach(function (s) {
      if (s.id === 'core') return;
      if (s.level && s.level > 0) {
        totalInvestedSP += s.level * s.costPoints;
      } else if (s.unlocked) {
        totalInvestedSP += s.costPoints;
      }
    });

    const ptsBadge = document.getElementById('skillPointsBadge');
    if (ptsBadge) {
      ptsBadge.textContent = state.skillPoints + (isVi ? ' Điểm SP' : ' SP Available');
    }

    const branches = [
      { id: 'chrono', name: isVi ? 'Chrono (Tốc Độ)' : 'Chrono & Speed', icon: '🌌', color: '#38bdf8', glow: 'rgba(56,189,248,0.6)', bg: '#082f49' },
      { id: 'crit', name: isVi ? 'Crits (Bạo Kích)' : 'Crits & Damage', icon: '💥', color: '#f43f5e', glow: 'rgba(244,63,94,0.6)', bg: '#4c0519' },
      { id: 'fortune', name: isVi ? 'Fortune (May Mắn)' : 'Cosmic Fortune', icon: '💎', color: '#10b981', glow: 'rgba(16,185,129,0.6)', bg: '#064e3b' },
      { id: 'overdrive', name: isVi ? 'Overdrive (Tối Thượng)' : 'Cosmic Overdrive', icon: '🔥', color: '#a855f7', glow: 'rgba(168,85,247,0.6)', bg: '#2e1065' }
    ];

    // Branch filter bar
    let branchTabsHtml = `
      <button class="constellation-chip ${currentSkillBranch === 'all' ? 'is-active' : ''}" 
              style="--chip-bg: rgba(129,140,248,0.25); --chip-border: #818cf8; --chip-color: #c7d2fe; --chip-glow: rgba(129,140,248,0.4);" 
              onclick="UIModals.setSkillBranch('all')">
        <span>🌟</span>
        <span>${isVi ? 'Tất Cả Chòm Sao' : 'All Constellations'}</span>
      </button>
    `;

    branches.forEach(function (br) {
      const bSkills = state.skills.filter(function (s) { return s.branch === br.id; });
      const unlockedCount = bSkills.filter(function (s) { return s.unlocked; }).length;
      const isActive = currentSkillBranch === br.id;

      branchTabsHtml += `
        <button class="constellation-chip ${isActive ? 'is-active' : ''}" 
                style="--chip-bg: rgba(${br.color === '#38bdf8' ? '56,189,248' : br.color === '#f43f5e' ? '244,63,94' : br.color === '#10b981' ? '16,185,129' : '168,85,247'}, 0.22); --chip-border: ${br.color}; --chip-color: ${br.color}; --chip-glow: ${br.glow};" 
                onclick="UIModals.setSkillBranch('${br.id}')">
          <span>${br.icon}</span>
          <span>${br.name}</span>
          <span style="font-size: 0.65rem; opacity: 0.85; font-family: ui-monospace, monospace; background: rgba(0,0,0,0.35); padding: 1px 5px; border-radius: 9999px;">
            ${unlockedCount}/${bSkills.length}
          </span>
        </button>
      `;
    });

    // 1. Generate SVG Connection Lines
    let linesSvg = '';
    state.skills.forEach(function (s) {
      if (!s.requires || s.requires.length === 0) return;
      s.requires.forEach(function (reqId) {
        const parent = state.skills.find(function (p) { return p.id === reqId; });
        if (!parent) return;

        const isPrereqMet = s.requires.every(function (id) {
          const pNode = state.skills.find(function (x) { return x.id === id; });
          return pNode && pNode.unlocked;
        });
        const canAfford = state.skillPoints >= s.costPoints;
        const canUnlock = isPrereqMet && canAfford && (s.isInfinite || (s.level || 0) < s.maxLevel);

        const brInfo = branches.find(function (b) { return b.id === s.branch; }) || { color: '#fbbf24', glow: 'rgba(251,191,36,0.6)' };
        const color = brInfo.color;

        if (parent.unlocked && s.unlocked) {
          linesSvg += `
            <line x1="${parent.x}%" y1="${parent.y}%" x2="${s.x}%" y2="${s.y}%" stroke="${color}" stroke-width="2.5" stroke-linecap="round" opacity="0.95" filter="url(#line-neon-glow)" />
            <line x1="${parent.x}%" y1="${parent.y}%" x2="${s.x}%" y2="${s.y}%" stroke="#fff" stroke-width="0.8" stroke-linecap="round" opacity="0.85" />
          `;
        } else if (parent.unlocked && canUnlock) {
          linesSvg += `
            <line x1="${parent.x}%" y1="${parent.y}%" x2="${s.x}%" y2="${s.y}%" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-dasharray="4 3" class="constellation-svg-line-flow" opacity="0.85" />
          `;
        } else {
          linesSvg += `
            <line x1="${parent.x}%" y1="${parent.y}%" x2="${s.x}%" y2="${s.y}%" stroke="#334155" stroke-width="1.2" stroke-dasharray="2 3" opacity="0.45" />
          `;
        }
      });
    });

    // 2. Generate Interactive Node Badges
    let nodesHtml = '';
    state.skills.forEach(function (s) {
      const isCore = s.id === 'core';
      const isSelected = selectedSkillId === s.id;
      const isDimmed = currentSkillBranch !== 'all' && s.branch !== currentSkillBranch && !isCore;

      const isPrereqMet = !s.requires || s.requires.length === 0 || s.requires.every(function (id) {
        const pNode = state.skills.find(function (x) { return x.id === id; });
        return pNode && pNode.unlocked;
      });
      const canAfford = state.skillPoints >= s.costPoints;
      const canUnlock = isPrereqMet && canAfford && (s.isInfinite || (s.level || 0) < s.maxLevel);

      const brInfo = branches.find(function (b) { return b.id === s.branch; }) || { color: '#fbbf24', glow: 'rgba(251,191,36,0.6)', bg: '#451a03' };

      const svgIcon = (global.RelicArt && global.RelicArt.getSkillSvg)
        ? global.RelicArt.getSkillSvg(s.id, s.branch, s.unlocked, isCore ? 46 : 38)
        : `<span style="font-size: 1.25rem;">${isCore ? '⭐' : brInfo.icon}</span>`;

      nodesHtml += `
        <div class="constellation-node-badge ${isCore ? 'is-core' : ''} ${s.unlocked ? 'is-unlocked' : (canUnlock ? 'is-available' : 'is-locked')} ${isSelected ? 'is-selected' : ''}"
             style="left: ${s.x}%; top: ${s.y}%; --node-color: ${brInfo.color}; --node-glow: ${brInfo.glow}; --node-bg: ${brInfo.bg}; ${isDimmed ? 'opacity: 0.22;' : ''}"
             onclick="UIModals.selectSkillNode('${s.id}')"
             title="${s.nameVi || s.name}">
          ${svgIcon}
          ${s.level && s.level > 0 && !isCore ? `
            <span class="node-level-tag">${s.isInfinite ? '∞' + s.level : s.level + '/' + s.maxLevel}</span>
          ` : ''}
          ${!s.unlocked && !canUnlock && !isCore ? `
            <span class="node-lock-tag">🔒</span>
          ` : ''}
          ${canUnlock && !s.unlocked ? `
            <span style="position: absolute; top: -3px; right: -3px; width: 12px; height: 12px; border-radius: 50%; background: #fde047; box-shadow: 0 0 8px #fde047; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
          ` : ''}
        </div>
      `;
    });

    // 3. Inspect Selected Node Details
    const curr = state.skills.find(function (s) { return s.id === selectedSkillId; }) || state.skills[0];
    const currIsCore = curr.id === 'core';
    const currBr = branches.find(function (b) { return b.id === curr.branch; }) || { name: 'Astral Core', icon: '⭐', color: '#fbbf24', glow: 'rgba(251,191,36,0.6)' };

    const currPrereqMet = !curr.requires || curr.requires.length === 0 || curr.requires.every(function (id) {
      const pNode = state.skills.find(function (x) { return x.id === id; });
      return pNode && pNode.unlocked;
    });
    const currCanAfford = state.skillPoints >= curr.costPoints;
    const currCanUnlock = currPrereqMet && currCanAfford && (curr.isInfinite || (curr.level || 0) < curr.maxLevel);
    const currIsMax = !curr.isInfinite && (curr.level || 0) >= curr.maxLevel && !currIsCore;

    // Prereq names
    let prereqNames = '';
    if (curr.requires && curr.requires.length > 0) {
      prereqNames = curr.requires.map(function (reqId) {
        const p = state.skills.find(function (x) { return x.id === reqId; });
        return p ? (isVi ? (p.nameVi || p.name) : p.name) : reqId;
      }).join(', ');
    }

    // Current bonus & next level bonus text
    let currentBonusText = '';
    let nextBonusText = '';
    const curLvl = curr.level || 0;

    if (curr.id === 'chrono_pulse') {
      currentBonusText = curLvl > 0 ? `+${curLvl * 10}% CPS tự động` : '';
      nextBonusText = `+${(curLvl + 1) * 10}% CPS tự động`;
    } else if (curr.id === 'chrono_warp') {
      currentBonusText = curLvl > 0 ? `+${curLvl * 15}% tốc độ Auto-Click` : '';
      nextBonusText = `+${(curLvl + 1) * 15}% tốc độ Auto-Click`;
    } else if (curr.id === 'chrono_overclock') {
      currentBonusText = curLvl > 0 ? `+${curLvl * 25}% thời lượng bùa lợi` : '';
      nextBonusText = `+${(curLvl + 1) * 25}% thời lượng bùa lợi`;
    } else if (curr.id === 'chrono_infinity') {
      currentBonusText = curLvl > 0 ? `-50% hồi chiêu toàn bộ kỹ năng` : '';
      nextBonusText = `-50% hồi chiêu toàn bộ kỹ năng kích hoạt`;
    } else if (curr.id === 'crit_focus') {
      currentBonusText = curLvl > 0 ? `+${curLvl * 5}% Tỉ lệ Bạo Kích (Crit Chance)` : '';
      nextBonusText = `+${(curLvl + 1) * 5}% Tỉ lệ Bạo Kích`;
    } else if (curr.id === 'crit_supernova') {
      currentBonusText = curLvl > 0 ? `+${curLvl * 100}% Sát thương Bạo Kích (Crit Damage)` : '';
      nextBonusText = `+${(curLvl + 1) * 100}% Sát thương Bạo Kích`;
    } else if (curr.id === 'crit_chain') {
      currentBonusText = curLvl > 0 ? `+${curLvl * 35}% sát thương Click Bạo Kích & tăng combo` : '';
      nextBonusText = `+${(curLvl + 1) * 35}% sát thương Click Bạo Kích`;
    } else if (curr.id === 'crit_collapse') {
      currentBonusText = curLvl > 0 ? `Nhân x2 Năng lượng thu hoạch từ mọi cú Bạo Kích` : '';
      nextBonusText = `Nhân x2 Năng lượng thu hoạch từ toàn bộ cú Bạo Kích`;
    } else if (curr.id === 'fortune_dust') {
      currentBonusText = curLvl > 0 ? `+${curLvl * 20}% Astral Shards khi Thăng Thiên / Trùng Sinh` : '';
      nextBonusText = `+${(curLvl + 1) * 20}% Astral Shards khi Trùng Sinh`;
    } else if (curr.id === 'fortune_meteor') {
      currentBonusText = curLvl > 0 ? `+${curLvl * 30}% tần suất xuất hiện Thiên Thạch & Khe Nứt` : '';
      nextBonusText = `+${(curLvl + 1) * 30}% tần suất Thiên Thạch & Khe Nứt`;
    } else if (curr.id === 'fortune_idle') {
      currentBonusText = curLvl > 0 ? `+${curLvl * 50}% hiệu suất thu thập ngoại tuyến AFK` : '';
      nextBonusText = `+${(curLvl + 1) * 50}% hiệu suất AFK`;
    } else if (curr.id === 'fortune_market') {
      currentBonusText = curLvl > 0 ? `-15% giá mua tất cả nâng cấp trạm vũ trụ` : '';
      nextBonusText = `-15% chi phí mua công trình / upgrades`;
    } else if (curr.id === 'overdrive_synergy') {
      const spBuff = Math.round(curLvl * (state.skillPoints || 0));
      currentBonusText = curLvl > 0 ? `+${spBuff}% CPS (+${curLvl}% mỗi SP chưa dùng: ${state.skillPoints} SP)` : '';
      nextBonusText = `+${curLvl + 1}% CPS cho mỗi điểm SP chưa dùng`;
    } else if (curr.id === 'overdrive_horizon') {
      currentBonusText = curLvl > 0 ? `+50% toàn bộ sản lượng trong 30s khi dùng kỹ năng` : '';
      nextBonusText = `+50% toàn bộ sản lượng trong 30s khi dùng kỹ năng`;
    } else if (curr.id === 'overdrive_zenith') {
      currentBonusText = curLvl > 0 ? `+${curLvl * 5}% toàn bộ Click, CPS, Crit và May Mắn` : '';
      nextBonusText = `+${(curLvl + 1) * 5}% toàn bộ chỉ số nhân vật (Vô Hạn Cấp)`;
    }

    const currSvg = (global.RelicArt && global.RelicArt.getSkillSvg)
      ? global.RelicArt.getSkillSvg(curr.id, curr.branch, curr.unlocked, 64)
      : `<div style="font-size: 2.5rem;">${currBr.icon}</div>`;

    // Active summary perks
    let perkClick = 0;
    let perkCps = 0;
    let perkCrit = 0;
    let perkCritDmg = 0;
    let perkShards = 0;
    let perkOffline = 0;
    let perkCooldown = 0;

    state.skills.forEach(function (s) {
      if (!s.unlocked) return;
      const lvl = s.level || 1;
      if (s.id === 'chrono_pulse') perkCps += lvl * 0.10;
      if (s.id === 'chrono_overclock') perkClick += lvl * 0.10;
      if (s.id === 'chrono_infinity') perkCooldown += 0.50;
      if (s.id === 'crit_focus') perkCrit += lvl * 0.05;
      if (s.id === 'crit_supernova') perkCritDmg += lvl * 1.00;
      if (s.id === 'crit_chain') perkClick += lvl * 0.35;
      if (s.id === 'fortune_dust') perkShards += lvl * 0.20;
      if (s.id === 'fortune_idle') perkOffline += lvl * 0.50;
      if (s.id === 'overdrive_synergy') perkCps += lvl * 0.01 * (state.skillPoints || 0);
      if (s.id === 'overdrive_zenith') {
        perkClick += lvl * 0.05;
        perkCps += lvl * 0.05;
        perkCrit += lvl * 0.02;
        perkOffline += lvl * 0.05;
      }
    });

    container.innerHTML = `
      <!-- 1. Header Toolbar: SP Balance, Invested & Respec Button -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.65rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.08);">
        <div style="display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap;">
          <div style="background: rgba(15,23,42,0.85); padding: 0.4rem 0.85rem; border-radius: 0.65rem; border: 1.5px solid rgba(129,140,248,0.45); font-size: 0.8125rem; font-family: ui-monospace, monospace; display: flex; align-items: center; gap: 0.45rem;">
            <span style="color: #94a3b8;">${isVi ? 'SP Khả dụng:' : 'Available:'}</span>
            <strong style="color: #818cf8; font-size: 1.05rem;">${state.skillPoints} SP</strong>
          </div>

          <div style="background: rgba(15,23,42,0.85); padding: 0.4rem 0.85rem; border-radius: 0.65rem; border: 1px solid rgba(255,255,255,0.1); font-size: 0.8125rem; font-family: ui-monospace, monospace;">
            <span style="color: #94a3b8;">${isVi ? 'Đã đầu tư:' : 'Invested:'}</span>
            <strong style="color: #34d399; font-size: 0.95rem; margin-left: 3px;">${totalInvestedSP} SP</strong>
          </div>
        </div>

        <button class="nx-btn nx-btn-secondary" 
                style="padding: 0.4rem 0.85rem; font-size: 0.75rem; font-weight: 800; border-color: rgba(244,63,94,0.4); color: #fb7185;" 
                onclick="UIModals.respecSkills()" 
                title="${isVi ? 'Hoàn lại 100% điểm SP đã đầu tư' : 'Refund all invested skill points'}">
          🔄 ${isVi ? 'Tẩy Điểm (Free)' : 'Respec All SP'}
        </button>
      </div>

      <!-- 2. Branch Filter Bar -->
      <div class="constellation-filter-bar">
        ${branchTabsHtml}
      </div>

      <!-- 3. Dual-View: Constellation Map Viewport + Side Glassmorphism Inspector -->
      <div class="constellation-observatory">
        
        <!-- Interactive Viewport -->
        <div class="constellation-viewport">
          <div class="constellation-nebula-bg"></div>
          <div class="constellation-stars-bg"></div>

          <!-- Cardinal Direction Labels -->
          <div class="branch-cardinal-label" style="top: 3.5%; left: 45%; color: #c084fc;">
            <span>🔥</span>
            <span>OVERDRIVE (BẮC)</span>
          </div>
          <div class="branch-cardinal-label" style="top: 48%; left: 2.5%; color: #38bdf8;">
            <span>🌌</span>
            <span>CHRONO (TÂY)</span>
          </div>
          <div class="branch-cardinal-label" style="top: 48%; right: 2.5%; color: #fb7185;">
            <span>💥</span>
            <span>CRITS (ĐÔNG)</span>
          </div>
          <div class="branch-cardinal-label" style="bottom: 3.5%; left: 45%; color: #34d399;">
            <span>💎</span>
            <span>FORTUNE (NAM)</span>
          </div>

          <!-- Dynamic SVG Connection Lines -->
          <svg class="constellation-svg-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <filter id="line-neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            ${linesSvg}
          </svg>

          <!-- 16 Interactive Celestial Nodes -->
          ${nodesHtml}
        </div>

        <!-- Side Glassmorphism Inspector Panel -->
        <div class="constellation-inspector-panel">
          <div>
            <!-- Branch Tag -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
              <span class="nx-badge" style="background: rgba(${currBr.color === '#38bdf8' ? '56,189,248' : currBr.color === '#f43f5e' ? '244,63,94' : currBr.color === '#10b981' ? '16,185,129' : '168,85,247'}, 0.2); color: ${currBr.color}; font-weight: 800; font-size: 0.75rem;">
                ${currBr.icon} ${currIsCore ? (isVi ? 'Lõi Tinh Vân' : 'Astral Origin') : currBr.name}
              </span>
              ${currIsCore ? `
                <span class="nx-badge nx-badge-gold" style="font-size: 0.6875rem; font-weight: 800;">✦ CORE</span>
              ` : (currIsMax ? `
                <span class="nx-badge nx-badge-emerald" style="font-size: 0.6875rem; font-weight: 800;">✓ MAX LV</span>
              ` : (curr.unlocked ? `
                <span class="nx-badge nx-badge-cyan" style="font-size: 0.6875rem; font-weight: 800;">CẤP ${curr.level}/${curr.maxLevel}</span>
              ` : (currCanUnlock ? `
                <span class="nx-badge nx-badge-gold" style="font-size: 0.6875rem; font-weight: 800; animation: pulse 1.5s infinite;">⚡ KHẢ DỤNG</span>
              ` : `
                <span class="nx-badge nx-badge-rose" style="font-size: 0.6875rem; font-weight: 800;">🔒 CHƯA KHẢ DỤNG</span>
              `)))}
            </div>

            <!-- Header Info -->
            <div style="display: flex; align-items: center; gap: 0.85rem; margin-bottom: 0.85rem;">
              <div style="position: relative; width: 64px; height: 64px; border-radius: 50%; background: radial-gradient(circle, ${currBr.bg} 0%, #0f172a 90%); border: 2px solid ${currBr.color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px ${currBr.glow}; flex-shrink: 0;">
                ${currSvg}
              </div>
              <div style="min-width: 0;">
                <div style="font-size: 1.1rem; font-weight: 900; color: #fff; line-height: 1.25; letter-spacing: -0.01em;">
                  ${isVi ? (curr.nameVi || curr.name) : curr.name}
                </div>
                <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.15rem; font-family: ui-monospace, monospace;">
                  ${curr.name}
                </div>
              </div>
            </div>

            <!-- Lore Description -->
            <div style="font-size: 0.8125rem; color: #cbd5e1; line-height: 1.45; padding: 0.65rem 0.8rem; border-radius: 0.65rem; background: rgba(15,23,42,0.6); border: 1px solid rgba(255,255,255,0.06); margin-bottom: 0.85rem;">
              ${isVi ? (curr.descVi || curr.desc) : (curr.descEn || curr.desc)}
            </div>

            <!-- Dynamic Bonuses Breakdown -->
            <div style="display: flex; flex-direction: column; gap: 0.45rem; font-size: 0.75rem;">
              ${currentBonusText ? `
                <div style="padding: 0.5rem 0.75rem; border-radius: 0.5rem; background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.3); color: #34d399; font-weight: 800;">
                  ✦ ${isVi ? 'Đang kích hoạt: ' : 'Active: '} ${currentBonusText}
                </div>
              ` : ''}

              ${!currIsMax && !currIsCore && nextBonusText ? `
                <div style="padding: 0.5rem 0.75rem; border-radius: 0.5rem; background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.25); color: #7dd3fc;">
                  ✦ ${isVi ? 'Cấp tiếp theo: ' : 'Next Level: '} <strong>${nextBonusText}</strong>
                </div>
              ` : ''}

              ${!currPrereqMet && prereqNames ? `
                <div style="padding: 0.5rem 0.75rem; border-radius: 0.5rem; background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); color: #f87171; font-weight: 700;">
                  🔒 ${isVi ? 'Yêu cầu mở trước: ' : 'Prerequisites: '} <strong>${prereqNames}</strong>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Bottom Action Area -->
          <div style="margin-top: 1rem; padding-top: 0.85rem; border-top: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;">
            <div>
              <div style="font-size: 0.6875rem; text-transform: uppercase; color: #94a3b8; font-weight: 800;">
                ${isVi ? 'Chi Phí Khai Mở' : 'Skill Cost'}
              </div>
              <div style="font-size: 1.15rem; font-weight: 900; color: #fbbf24; font-family: ui-monospace, monospace;">
                ${currIsCore ? '0 SP' : curr.costPoints + ' SP'}
              </div>
            </div>

            <div>
              ${currIsCore ? `
                <button class="nx-btn nx-btn-secondary" style="font-size: 0.8125rem; padding: 0.5rem 1rem; opacity: 0.7; cursor: default;" disabled>
                  ✓ ${isVi ? 'Gốc Tinh Vân' : 'Origin Core'}
                </button>
              ` : (currIsMax ? `
                <button class="nx-btn nx-btn-secondary" style="font-size: 0.8125rem; padding: 0.5rem 1rem; opacity: 0.65; cursor: default;" disabled>
                  ✓ ${isVi ? 'Đã Tối Đa' : 'Max Level'}
                </button>
              ` : (currCanUnlock ? `
                <button class="nx-btn nx-btn-primary" 
                        style="font-size: 0.8125rem; padding: 0.55rem 1.15rem; font-weight: 900; background: linear-gradient(135deg, ${currBr.color}, #6366f1); border-color: ${currBr.color}; box-shadow: 0 0 15px ${currBr.glow};" 
                        onclick="UIModals.unlockOrUpgradeSkill('${curr.id}')">
                  ⚡ ${curr.level > 0 ? (isVi ? 'Nâng Cấp (+1 Cấp)' : 'Upgrade (+1 Lv)') : (isVi ? 'Khai Mở Kỹ Năng' : 'Unlock Skill')}
                </button>
              ` : `
                <button class="nx-btn nx-btn-disabled" style="font-size: 0.8125rem; padding: 0.5rem 1rem;" disabled>
                  🔒 ${!currPrereqMet ? (isVi ? 'Chưa Mở Tiên Quyết' : 'Locked') : (isVi ? 'Thiếu SP' : 'Need SP')}
                </button>
              `))}
            </div>
          </div>

        </div>

      </div>

      <!-- 4. Active Perks HUD Summary -->
      <div style="padding: 0.75rem 1rem; border-radius: 0.875rem; background: linear-gradient(135deg, rgba(30,27,75,0.7) 0%, rgba(15,23,42,0.85) 100%); border: 1px solid rgba(129,140,248,0.3); margin-top: 0.5rem;">
        <div style="font-size: 0.75rem; font-weight: 800; color: #a5b4fc; text-transform: uppercase; margin-bottom: 0.4rem; display: flex; align-items: center; justify-content: space-between;">
          <span style="display: flex; align-items: center; gap: 0.35rem;">
            <span>✨</span>
            <span>${isVi ? 'Sức Mạnh Chòm Sao Đang Kích Hoạt' : 'Active Constellation Blessings'}</span>
          </span>
          <span style="color: #94a3b8; font-size: 0.6875rem; text-transform: none;">
            ${isVi ? 'Tự động kích hoạt vĩnh viễn' : 'Permanently active'}
          </span>
        </div>
        <div style="display: flex; gap: 0.5rem 1.25rem; flex-wrap: wrap; font-size: 0.75rem; font-family: ui-monospace, monospace;">
          <div style="color: #cbd5e1;">Click Power: <strong style="color: #c084fc;">+${Math.round(perkClick * 100)}%</strong></div>
          <div style="color: #cbd5e1;">Tự Động CPS: <strong style="color: #38bdf8;">+${Math.round(perkCps * 100)}%</strong></div>
          <div style="color: #cbd5e1;">Tỉ Lệ Crit: <strong style="color: #f0abfc;">+${Math.round(perkCrit * 100)}%</strong></div>
          <div style="color: #cbd5e1;">Sát Thương Crit: <strong style="color: #f43f5e;">+${Math.round(perkCritDmg * 100)}%</strong></div>
          <div style="color: #cbd5e1;">Astral Shards: <strong style="color: #818cf8;">+${Math.round(perkShards * 100)}%</strong></div>
          <div style="color: #cbd5e1;">Hiệu Suất AFK: <strong style="color: #34d399;">+${Math.round(perkOffline * 100)}%</strong></div>
          ${perkCooldown > 0 ? `<div style="color: #cbd5e1;">Giảm Hồi Chiêu: <strong style="color: #fbbf24;">-${Math.round(perkCooldown * 100)}%</strong></div>` : ''}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 4. INVENTORY & RELICS (27 Relics with Miniature Vector Artwork, Pedestal, Filter)
  // =========================================================================
  let currentBackpackTab = 'relics';
  let currentRelicFilter = 'all';

  function setBackpackTab(tab) {
    currentBackpackTab = tab;
    renderInventoryContent();
  }

  function setRelicFilter(filter) {
    currentRelicFilter = filter;
    renderInventoryContent();
  }

  function usePotion(potionId) {
    const state = global.GameState.get();
    if (!state.potions || (state.potions[potionId] || 0) <= 0) return;

    const metaList = global.GameState.getPotionMetadata ? global.GameState.getPotionMetadata() : [];
    const meta = metaList.find(function (m) { return m.id === potionId; });
    if (!meta) return;

    state.potions[potionId] -= 1;
    if (!state.activePotions) state.activePotions = {};
    const curTime = state.activePotions[meta.type] || 0;
    state.activePotions[meta.type] = curTime + (meta.duration || 300);
    state.potionsUsed = (state.potionsUsed || 0) + 1;

    const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;
    const name = isVi ? meta.nameVi : meta.nameEn;
    const timeFormatted = formatDuration(state.activePotions[meta.type]);

    if (global.Sound) global.Sound.playUpgrade();
    if (global.Toast) {
      global.Toast.show(isVi ? `✨ Đã sử dụng ${name}! Thời gian hiệu lực: ${timeFormatted}` : `✨ Activated ${name}! (${timeFormatted})`, 'success');
    }

    global.GameState.save();
    if (global.UICore) {
      global.UICore.updateStatsDisplay();
      if (global.UICore.updateActiveBuffs) global.UICore.updateActiveBuffs();
    }
    updateBackpackBadge();
    renderInventoryContent();
  }

  // Auto-Equip best 4 relics with normalized score
  function autoEquipRelics() {
    const state = global.GameState.get();
    const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;

    // Reset equipped on all
    state.relics.forEach(function (r) { r.equipped = false; });

    // Calculate score
    const scoredRelics = state.relics.map(function (r) {
      const clickB = r.clickBonus || 0;
      const cpsB = r.cpsBonus || 0;
      const critB = r.critBonus || 0;
      const bossB = r.bossDamageBonus || 0;
      const gemB = r.gemDropBonus || 0;
      const itemB = r.itemDropBonus || 0;
      const offB = r.offlineBonus || 0;

      const score = (clickB * 100) + (cpsB * 100) + (critB * 200) + (bossB * 80) + (gemB * 80) + (itemB * 80) + (offB * 60);
      return { relic: r, score: score };
    });

    // Sort descending
    scoredRelics.sort(function (a, b) { return b.score - a.score; });

    // Equip top 4
    for (let i = 0; i < Math.min(4, scoredRelics.length); i++) {
      scoredRelics[i].relic.equipped = true;
    }

    if (global.Sound) global.Sound.playAchievement();
    if (global.Toast) {
      global.Toast.show(isVi ? '⚡ Đã tự động trang bị 4 Cổ Vật mạnh nhất!' : '⚡ Auto-equipped best 4 Relics!', 'success');
    }

    global.GameState.save();
    if (global.UICore && global.UICore.updateStatsDisplay) global.UICore.updateStatsDisplay();
    renderInventoryContent();
  }

  function toggleRelic(relicId) {
    const state = global.GameState.get();
    const relic = state.relics.find(function (r) { return r.id === relicId; });
    if (!relic) return;

    const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;

    if (!relic.equipped) {
      const currentEquipped = state.relics.filter(function (r) { return r.equipped; }).length;
      if (currentEquipped >= 4) {
        const limitMsg = isVi ? 'Bạn chỉ có thể trang bị tối đa 4 Cổ Vật cùng lúc. Hãy tháo bớt một món trước!' : 'You can only equip up to 4 Relics. Unequip one first!';
        if (global.Toast) global.Toast.show(limitMsg, 'warning');
        if (global.Sound) global.Sound.playError();
        return;
      }
      relic.equipped = true;
      if (global.Toast) global.Toast.show(isVi ? `⚔️ Đã trang bị: ${relic.name}!` : `⚔️ Equipped: ${relic.name}!`, 'success');
    } else {
      relic.equipped = false;
      if (global.Toast) global.Toast.show(isVi ? `Đã tháo: ${relic.name}` : `Unequipped: ${relic.name}`, 'info');
    }

    if (global.Sound) global.Sound.playClick();
    global.GameState.save();
    if (global.UICore && global.UICore.updateStatsDisplay) global.UICore.updateStatsDisplay();
    renderInventoryContent();
  }

  function unequipRelic(relicId) {
    const state = global.GameState.get();
    const relic = state.relics.find(function (r) { return r.id === relicId; });
    if (!relic || !relic.equipped) return;
    relic.equipped = false;
    if (global.Sound) global.Sound.playClick();
    global.GameState.save();
    if (global.UICore && global.UICore.updateStatsDisplay) global.UICore.updateStatsDisplay();
    renderInventoryContent();
  }

  function renderInventoryContent() {
    const container = document.getElementById('inventoryModalContent');
    if (!container) return;

    const state = global.GameState.get();
    const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;
    const potionMetas = global.GameState.getPotionMetadata ? global.GameState.getPotionMetadata() : [];

    let totalPotionsCount = 0;
    if (state.potions) {
      Object.keys(state.potions).forEach(function (k) { totalPotionsCount += (state.potions[k] || 0); });
    }

    const equippedRelics = state.relics.filter(function (r) { return r.equipped; });
    const equippedCount = equippedRelics.length;

    const badge = document.getElementById('relicsEquippedBadge');
    if (badge) {
      badge.textContent = currentBackpackTab === 'potions' 
        ? `${totalPotionsCount} ${isVi ? 'Thuốc trong Balo' : 'Potions in Bag'}` 
        : `${equippedCount} / 4 ${isVi ? 'Cổ Vật Đang Dùng' : 'Equipped'}`;
    }

    let tabBodyHtml = '';

    if (currentBackpackTab === 'potions') {
      let potionsListHtml = '';
      potionMetas.forEach(function (p) {
        const count = (state.potions && state.potions[p.id]) || 0;
        const activeTime = (state.activePotions && state.activePotions[p.type]) || 0;
        const name = isVi ? p.nameVi : p.nameEn;
        const desc = isVi ? p.descVi : p.descEn;

        potionsListHtml += `
          <div class="nx-card" style="padding: 0.875rem; border-color: ${activeTime > 0 ? 'rgba(56,189,248,0.5)' : (count > 0 ? 'rgba(56,189,248,0.3)' : 'var(--nx-surface-border)')}; background: ${activeTime > 0 ? 'rgba(8,47,73,0.3)' : 'rgba(18,24,38,0.85)'};">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div style="width: 3rem; height: 3rem; border-radius: 0.75rem; background: rgba(56,189,248,0.12); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; border: 1.5px solid rgba(56,189,248,0.3);">
                  ${p.icon}
                </div>
                <div>
                  <div style="display: flex; align-items: center; gap: 0.45rem; flex-wrap: wrap;">
                    <span style="font-weight: 800; font-size: 0.9375rem; color: #fff;">${name}</span>
                    <span class="nx-badge" style="background: ${count > 0 ? 'rgba(56,189,248,0.25)' : 'rgba(71,85,105,0.4)'}; color: ${count > 0 ? '#38bdf8' : '#94a3b8'}; font-weight: 800; font-size: 0.75rem;">
                      ${isVi ? 'Số lượng: ' : 'Owned: '}<strong>x${count}</strong>
                    </span>
                    ${activeTime > 0 ? `
                      <span class="nx-badge nx-badge-emerald" style="font-weight: 800; font-size: 0.6875rem; animation: pulse 2s infinite;">
                        ${isVi ? '⏳ Đang chạy: ' : '⏳ Active: '}${formatDuration(activeTime)}
                      </span>
                    ` : ''}
                  </div>
                  <div style="font-size: 0.75rem; color: #cbd5e1; margin-top: 0.25rem; line-height: 1.35;">
                    ${desc}
                  </div>
                </div>
              </div>

              <div>
                ${count > 0 ? `
                  <button class="nx-btn nx-btn-emerald" style="padding: 0.5rem 1.15rem; font-weight: 800; font-size: 0.8125rem;" onclick="UIModals.usePotion('${p.id}')">
                    ✨ ${isVi ? 'SỬ DỤNG (+5 PHÚT)' : 'USE (+5 MINS)'}
                  </button>
                ` : `
                  <button class="nx-btn nx-btn-gold" style="padding: 0.45rem 0.85rem; font-size: 0.75rem;" onclick="UIModals.buyPotion('${p.id}', false)">
                    💎 ${isVi ? 'Mua Tại Shop' : 'Buy in Shop'} (${p.costGems})
                  </button>
                `}
              </div>
            </div>
          </div>
        `;
      });

      tabBodyHtml = `
        <div style="display: flex; flex-direction: column; gap: 0.625rem;">
          ${potionsListHtml}
        </div>
      `;
    } else {
      // TAB 2: RELICS (27 Relics with Custom SVG Artwork & Pedestal)

      // Calculate total bonuses from equipped relics
      let totClick = 0;
      let totCps = 0;
      let totCrit = 0;
      let totBoss = 0;
      let totGem = 0;
      let totItem = 0;
      let totOff = 0;

      equippedRelics.forEach(function (r) {
        totClick += (r.clickBonus || 0);
        totCps += (r.cpsBonus || 0);
        totCrit += (r.critBonus || 0);
        totBoss += (r.bossDamageBonus || 0);
        totGem += (r.gemDropBonus || 0);
        totItem += (r.itemDropBonus || 0);
        totOff += (r.offlineBonus || 0);
      });

      // 4-Slot Pedestal HTML
      let pedestalSlotsHtml = '';
      for (let slotIdx = 0; slotIdx < 4; slotIdx++) {
        const rel = equippedRelics[slotIdx];
        if (rel) {
          const theme = (global.RelicArt && global.RelicArt.RARITY_THEMES && global.RelicArt.RARITY_THEMES[rel.rarity]) 
            ? global.RelicArt.RARITY_THEMES[rel.rarity] 
            : { border: '#38bdf8', glow: 'rgba(56,189,248,0.4)', badgeText: '#38bdf8' };

          const miniSvg = (global.RelicArt && global.RelicArt.getRelicSvg)
            ? global.RelicArt.getRelicSvg(rel.id, rel.rarity, 42)
            : '🔮';

          pedestalSlotsHtml += `
            <div class="relic-pedestal-slot is-filled" style="--slot-border: ${theme.border}; --slot-glow: ${theme.glow};">
              <div style="position: absolute; top: 4px; left: 6px; font-size: 0.625rem; font-weight: 800; color: #64748b;">
                #${slotIdx + 1}
              </div>
              <button onclick="UIModals.unequipRelic('${rel.id}')" 
                      style="position: absolute; top: 4px; right: 4px; background: rgba(239,68,68,0.2); border: 1px solid rgba(239,68,68,0.4); color: #f87171; border-radius: 4px; padding: 1px 4px; font-size: 0.625rem; cursor: pointer; font-weight: 800;" 
                      title="${isVi ? 'Tháo cổ vật này' : 'Unequip this relic'}">
                ✕
              </button>
              ${miniSvg}
              <div style="font-weight: 800; font-size: 0.75rem; color: #fff; margin-top: 3px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${rel.name}
              </div>
              <div style="font-size: 0.6875rem; color: ${theme.badgeText}; font-weight: 700; margin-top: 1px;">
                ${rel.rarity.toUpperCase()}
              </div>
            </div>
          `;
        } else {
          pedestalSlotsHtml += `
            <div class="relic-pedestal-slot" style="cursor: pointer;" onclick="UIModals.setRelicFilter('all')" title="${isVi ? 'Chọn một cổ vật bên dưới để trang bị' : 'Choose a relic below to equip'}">
              <div style="position: absolute; top: 4px; left: 6px; font-size: 0.625rem; font-weight: 800; color: #64748b;">
                #${slotIdx + 1}
              </div>
              <div style="font-size: 1.35rem; opacity: 0.3; margin-bottom: 2px;">⚡</div>
              <div style="font-size: 0.75rem; color: #64748b; font-weight: 700;">
                ${isVi ? 'Ô Trống' : 'Empty Slot'}
              </div>
              <div style="font-size: 0.65rem; color: #38bdf8; margin-top: 2px;">
                + ${isVi ? 'Trang Bị' : 'Equip'}
              </div>
            </div>
          `;
        }
      }

      // Filtered Relics list
      let filteredRelics = state.relics;
      if (currentRelicFilter === 'equipped') {
        filteredRelics = state.relics.filter(function (r) { return r.equipped; });
      } else if (currentRelicFilter !== 'all') {
        filteredRelics = state.relics.filter(function (r) { return r.rarity === currentRelicFilter; });
      }

      let relicsCardsHtml = '';
      filteredRelics.forEach(function (r) {
        const theme = (global.RelicArt && global.RelicArt.RARITY_THEMES && global.RelicArt.RARITY_THEMES[r.rarity]) 
          ? global.RelicArt.RARITY_THEMES[r.rarity] 
          : { border: '#38bdf8', glow: 'rgba(56,189,248,0.4)', badgeText: '#38bdf8', labelVi: 'Hiếm' };

        const relicSvg = (global.RelicArt && global.RelicArt.getRelicSvg)
          ? global.RelicArt.getRelicSvg(r.id, r.rarity, 50)
          : `<div style="width: 50px; height: 50px; border-radius: 8px; background: rgba(56,189,248,0.12); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">🔮</div>`;

        relicsCardsHtml += `
          <div class="relic-card ${r.equipped ? 'is-equipped' : ''}" style="--card-border: ${theme.border}; --card-glow: ${theme.glow};">
            <!-- Left: Miniature Vector Artwork -->
            ${relicSvg}

            <!-- Center: Details -->
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;">
                <span style="font-weight: 800; font-size: 0.875rem; color: #fff;">${r.name}</span>
                <span class="nx-badge" style="background: ${theme.badgeBg}; color: ${theme.badgeText}; font-size: 0.625rem; font-weight: 800;">
                  ${isVi ? theme.labelVi : theme.labelEn}
                </span>
                ${r.equipped ? `
                  <span class="nx-badge nx-badge-emerald" style="font-size: 0.625rem; font-weight: 800;">
                    ✓ ${isVi ? 'ĐANG DÙNG' : 'ACTIVE'}
                  </span>
                ` : ''}
              </div>
              <div style="font-size: 0.75rem; color: #38bdf8; margin-top: 0.2rem; line-height: 1.35; font-weight: 600;">
                ${r.effectDesc}
              </div>
            </div>

            <!-- Right: Action Button -->
            <div style="flex-shrink: 0;">
              <button class="nx-btn ${r.equipped ? 'nx-btn-danger' : (equippedCount >= 4 ? 'nx-btn-secondary' : 'nx-btn-primary')}" 
                      style="padding: 0.45rem 0.85rem; font-size: 0.75rem; font-weight: 800; white-space: nowrap;"
                      onclick="UIModals.toggleRelic('${r.id}')">
                ${r.equipped ? (isVi ? 'Tháo Ra' : 'Unequip') : (equippedCount >= 4 ? (isVi ? 'Trang Bị (4/4)' : 'Equip (4/4)') : (isVi ? 'Trang Bị' : 'Equip'))}
              </button>
            </div>
          </div>
        `;
      });

      tabBodyHtml = `
        <!-- 1. Pedestal: 4 Equipped Relics Display with Live Summary -->
        <div class="relics-pedestal-container">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.4rem;">
            <div>
              <div style="font-size: 0.6875rem; text-transform: uppercase; color: #38bdf8; font-weight: 800; letter-spacing: 0.08em;">
                🔮 ${isVi ? 'BỆ THỜ 4 CỔ VẬN KÍCH HOẠT' : '4 ACTIVE RELIC PEDESTALS'}
              </div>
              <div style="font-size: 0.875rem; font-weight: 800; color: #fff;">
                ${isVi ? 'Đang kích hoạt: ' : 'Active: '}
                <strong style="color: #38bdf8;">${equippedCount} / 4 ${isVi ? 'Cổ Vật' : 'Relics'}</strong>
              </div>
            </div>

            <button class="nx-btn nx-btn-emerald" style="padding: 0.4rem 0.85rem; font-size: 0.75rem; font-weight: 800;" onclick="UIModals.autoEquipRelics()">
              ⚡ ${isVi ? 'Tự Trang Bị 4 Món Mạnh Nhất' : 'Auto-Equip Top 4'}
            </button>
          </div>

          <!-- 4 Slots Grid -->
          <div class="relics-pedestal-grid">
            ${pedestalSlotsHtml}
          </div>

          <!-- Combined Equipped Relics Bonus HUD -->
          <div style="margin-top: 0.65rem; padding-top: 0.5rem; border-top: 1px solid rgba(255,255,255,0.08); display: flex; gap: 0.5rem 1rem; flex-wrap: wrap; font-size: 0.75rem; font-family: ui-monospace, monospace; color: #94a3b8;">
            <span>${isVi ? 'Tổng hiệu lực 4 món:' : 'Total 4-relic power:'}</span>
            ${totClick > 0 ? `<span style="color: #c084fc;">Click: +${Math.round(totClick * 100)}%</span>` : ''}
            ${totCps > 0 ? `<span style="color: #38bdf8;">CPS: +${Math.round(totCps * 100)}%</span>` : ''}
            ${totCrit > 0 ? `<span style="color: #f0abfc;">Crit: +${Math.round(totCrit * 100)}%</span>` : ''}
            ${totBoss > 0 ? `<span style="color: #f43f5e;">Boss: +${Math.round(totBoss * 100)}%</span>` : ''}
            ${totGem > 0 ? `<span style="color: #fbbf24;">Gems: +${Math.round(totGem * 100)}%</span>` : ''}
            ${totItem > 0 ? `<span style="color: #34d399;">Item: +${Math.round(totItem * 100)}%</span>` : ''}
            ${totOff > 0 ? `<span style="color: #38bdf8;">Offline: +${Math.round(totOff * 100)}%</span>` : ''}
            ${equippedCount === 0 ? `<span style="color: #64748b;">(${isVi ? 'Chưa trang bị cổ vật nào' : 'No relics equipped'})</span>` : ''}
          </div>
        </div>

        <!-- 2. Relic Filters Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
          <div class="relic-filter-bar">
            <button class="relic-filter-chip ${currentRelicFilter === 'all' ? 'is-active' : ''}" onclick="UIModals.setRelicFilter('all')">
              ${isVi ? 'Tất Cả (27)' : 'All (27)'}
            </button>
            <button class="relic-filter-chip ${currentRelicFilter === 'equipped' ? 'is-active' : ''}" onclick="UIModals.setRelicFilter('equipped')">
              ✓ ${isVi ? 'Đang Dùng (' + equippedCount + ')' : 'Equipped (' + equippedCount + ')'}
            </button>
            <button class="relic-filter-chip ${currentRelicFilter === 'rare' ? 'is-active' : ''}" style="color: #38bdf8;" onclick="UIModals.setRelicFilter('rare')">
              ✦ ${isVi ? 'Hiếm (Rare)' : 'Rare'}
            </button>
            <button class="relic-filter-chip ${currentRelicFilter === 'epic' ? 'is-active' : ''}" style="color: #c084fc;" onclick="UIModals.setRelicFilter('epic')">
              ✦ ${isVi ? 'Sử Thi (Epic)' : 'Epic'}
            </button>
            <button class="relic-filter-chip ${currentRelicFilter === 'legendary' ? 'is-active' : ''}" style="color: #fbbf24;" onclick="UIModals.setRelicFilter('legendary')">
              ★ ${isVi ? 'Huyền Thoại' : 'Legendary'}
            </button>
            <button class="relic-filter-chip ${currentRelicFilter === 'mythic' ? 'is-active' : ''}" style="color: #fb7185;" onclick="UIModals.setRelicFilter('mythic')">
              👑 ${isVi ? 'Thần Thoại' : 'Mythic'}
            </button>
          </div>
          <span style="font-size: 0.6875rem; color: #64748b; font-family: ui-monospace, monospace;">
            ${filteredRelics.length} / 27 ${isVi ? 'Cổ Vật' : 'Relics'}
          </span>
        </div>

        <!-- 3. Relics Catalog Grid (2 columns on Desktop, 1 on Mobile) -->
        <div class="relics-catalog-grid">
          ${relicsCardsHtml}
        </div>
      `;
    }

    container.innerHTML = `
      <div style="display: flex; gap: 0.5rem; margin-bottom: 0.875rem; border-bottom: 1px solid var(--nx-surface-border); padding-bottom: 0.65rem;">
        <button class="nx-btn ${currentBackpackTab === 'relics' ? 'nx-btn-primary' : 'nx-btn-secondary'}" 
                style="flex: 1; padding: 0.6rem; font-weight: 800; font-size: 0.8125rem;" 
                onclick="UIModals.setBackpackTab('relics')">
          🔮 ${isVi ? 'Hòm Cổ Vật Thần Bí' : 'Relic Vault'} (${equippedCount}/4)
        </button>
        <button class="nx-btn ${currentBackpackTab === 'potions' ? 'nx-btn-primary' : 'nx-btn-secondary'}" 
                style="flex: 1; padding: 0.6rem; font-weight: 800; font-size: 0.8125rem;" 
                onclick="UIModals.setBackpackTab('potions')">
          🎒 ${isVi ? 'Túi Thuốc & Shop Gems' : 'Potions & Shop'} (${totalPotionsCount})
        </button>
      </div>
      ${tabBodyHtml}
    `;
  }

  // =========================================================================
  // 5. ACHIEVEMENTS CONTENT (35 with Buffs)
  // =========================================================================
  function renderAchievementsContent() {
    const container = document.getElementById('achievementsModalContent');
    if (!container) return;

    const state = global.GameState.get();
    const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;
    const unlockedCount = state.achievements.filter(function (a) { return a.unlocked; }).length;
    const achBuffPercent = global.Bonuses ? global.Bonuses.getAchievementBuffPercent() : (unlockedCount * 0.5);

    const badge = document.getElementById('achievementsCountBadge');
    if (badge) badge.textContent = unlockedCount + ' / ' + state.achievements.length;

    let html = `
      <div style="padding: 0.75rem 1rem; border-radius: 0.75rem; background: linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(168,85,247,0.15) 100%); border: 1.5px solid rgba(251,191,36,0.4); margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          <div style="font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; font-weight: 800;">
            ${isVi ? 'Hiệu Ứng Buff Từ Thành Tựu' : 'Active Achievement Buff'}
          </div>
          <div style="font-size: 1.25rem; font-weight: 900; color: #fbbf24;">
            +${achBuffPercent}% ${isVi ? 'Toàn Bộ Sản Lượng & CPS' : 'All Production & CPS'}
          </div>
        </div>
        <span class="nx-badge nx-badge-gold" style="font-size: 0.8125rem; padding: 0.35rem 0.75rem;">
          ${unlockedCount} / ${state.achievements.length} ${isVi ? 'Đã Mở' : 'Unlocked'}
        </span>
      </div>
    `;

    state.achievements.forEach(function (ach) {
      const isComplete = ach.current >= ach.target;
      const pct = Math.min(100, Math.floor((ach.current / ach.target) * 100));

      html += `
        <div class="nx-card" style="padding: 0.875rem; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; margin-bottom: 0.5rem;">
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-weight: 800; font-size: 0.875rem; color: #fff;">${ach.name}</span>
              <span style="font-size: 0.6875rem; color: #fbbf24; font-family: ui-monospace, monospace;">+${ach.rewardGems} Gems · (+0.5% Buff)</span>
            </div>
            <div style="font-size: 0.75rem; color: #94a3b8; margin: 0.2rem 0 0.4rem;">${ach.desc}</div>
            <div class="quest-progress-bar">
              <div class="quest-progress-fill" style="width: ${pct}%;"></div>
            </div>
          </div>
          <div>
            ${ach.unlocked
              ? `<span class="nx-badge nx-badge-emerald">${isVi ? 'ĐÃ NHẬN' : 'CLAIMED'}</span>`
              : (isComplete
                ? `<button class="nx-btn nx-btn-gold" onclick="UIModals.claimAchievement('${ach.id}')">${isVi ? 'Nhận' : 'Claim'}</button>`
                : `<span style="font-size: 0.6875rem; font-family: ui-monospace, monospace; color: #64748b;">${pct}%</span>`
              )}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  function claimAchievement(achId) {
    const state = global.GameState.get();
    const ach = state.achievements.find(function (a) { return a.id === achId; });
    if (!ach || ach.unlocked || ach.current < ach.target) return;

    ach.unlocked = true;
    state.astralGems += ach.rewardGems;

    if (global.Sound) global.Sound.playAchievement();
    global.GameState.save();
    global.UI.updateStatsDisplay();
    renderAchievementsContent();
  }

  // =========================================================================
  // 6. PRESTIGE & WORLDS MODAL (4 Worlds, 18 Pets)
  // =========================================================================
  let prestigeTab = 'ascension';

  function renderPrestigeContent() {
    const container = document.getElementById('prestigeModalContent');
    if (!container) return;

    const state = global.GameState.get();
    const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;
    const potentialShards = global.Engine ? global.Engine.prestigeShards(state.totalEssence) : Math.floor(Math.sqrt(state.totalEssence / 1000000));
    const canPrestige = potentialShards > 0;
    const worlds = global.GameState.getWorlds ? global.GameState.getWorlds() : [];

    let tabContent = '';

    if (prestigeTab === 'ascension') {
      tabContent = `
        <div style="text-align: center; padding: 1rem 0.5rem;">
          <div style="width: 70px; height: 70px; border-radius: 50%; background: rgba(168,85,247,0.15); border: 2px solid rgba(168,85,247,0.5); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c084fc" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff;">
            ${isVi ? 'Tái Sinh Vũ Trụ (Ascension)' : 'Astral Rebirth (Ascension)'}
          </h3>
          <p style="font-size: 0.8125rem; color: #94a3b8; max-width: 420px; margin: 0.5rem auto 1.25rem;">
            ${isVi 
              ? 'Hiến tế Năng Lượng và Nâng Cấp hiện tại để phi thăng lên cõi giới cao hơn, nhận Mảnh Astral Shards vĩnh viễn (mỗi Mảnh tăng +1% toàn bộ sản lượng).'
              : 'Sacrifice current Essence and Upgrades to ascend into higher dimensions, gaining permanent Astral Shards.'}
          </p>

          <div style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 1.5rem;">
            <div style="padding: 0.75rem 1.25rem; border-radius: 0.75rem; background: rgba(18,24,38,0.8); border: 1px solid var(--nx-surface-border);">
              <div style="font-size: 0.6875rem; color: #94a3b8; text-transform: uppercase;">
                ${isVi ? 'Shards Hiện Có' : 'Current Shards'}
              </div>
              <div style="font-size: 1.25rem; font-weight: 900; color: #818cf8; font-family: ui-monospace, monospace;">${state.astralShards}</div>
            </div>
            <div style="padding: 0.75rem 1.25rem; border-radius: 0.75rem; background: rgba(168,85,247,0.12); border: 1px solid rgba(168,85,247,0.4);">
              <div style="font-size: 0.6875rem; color: #c084fc; text-transform: uppercase;">
                ${isVi ? 'Nhận Khi Tái Sinh' : 'Ascension Yield'}
              </div>
              <div style="font-size: 1.25rem; font-weight: 900; color: #c084fc; font-family: ui-monospace, monospace;">+${potentialShards} Shards</div>
            </div>
          </div>

          <button class="nx-btn ${canPrestige ? 'nx-btn-violet' : 'nx-btn-disabled'}" style="padding: 0.75rem 2rem; font-size: 0.875rem;" onclick="UIModals.executePrestige()">
            ${canPrestige 
              ? (isVi ? 'Phi Thăng & Nhận +' + potentialShards + ' Shards' : 'Ascend & Gain +' + potentialShards + ' Shards')
              : (isVi ? 'Cần tối thiểu 1,000,000 Tổng Năng Lượng' : 'Requires 1,000,000 Total Essence')}
          </button>
        </div>
      `;
    } else {
      // WORLDS & PETS TAB (4 Worlds, 18 Pets)
      let worldsHtml = '';
      worlds.forEach(function (w) {
        const isUnlocked = state.prestigeCount >= w.reqAscension;
        worldsHtml += `
          <div class="nx-card" style="padding: 0.875rem; border-color: ${isUnlocked ? 'rgba(56,189,248,0.4)' : 'var(--nx-surface-border)'}; background: ${isUnlocked ? 'rgba(15,23,42,0.8)' : 'rgba(15,23,42,0.4)'}; margin-bottom: 0.625rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 800; font-size: 0.9375rem; color: #fff;">${w.name}</div>
                <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.2rem;">${w.desc}</div>
                <div style="font-size: 0.6875rem; color: #fbbf24; margin-top: 0.2rem;">Tiền tệ riêng: ${w.currency}</div>
              </div>
              <div>
                ${isUnlocked 
                  ? `<span class="nx-badge nx-badge-emerald">ĐÃ MỞ KHÓA</span>`
                  : `<span class="nx-badge" style="background: rgba(244,63,94,0.2); color: #f43f5e;">Cần Thăng Thiên ${w.reqAscension} lần</span>`}
              </div>
            </div>
          </div>
        `;
      });

      // Pet Night Owl Showcase
      const owlLevel = (state.pets && state.pets.night_owl && state.pets.night_owl.level) || 0;
      worldsHtml += `
        <div style="margin-top: 1rem; padding: 0.875rem; border-radius: 0.75rem; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3);">
          <div style="font-weight: 800; font-size: 0.875rem; color: #34d399; display: flex; align-items: center; justify-content: space-between;">
            <span>🦉 Thần Thú Gacha 5: Cú Đêm Vĩnh Cửu</span>
            <span class="nx-badge nx-badge-emerald">Cấp ${owlLevel} (+${owlLevel * 5}% Offline)</span>
          </div>
          <div style="font-size: 0.75rem; color: #cbd5e1; margin-top: 0.25rem;">
            Tăng +5% Hiệu Suất Ngoại Tuyến mỗi cấp! Mở khóa và nhận trong Sự Kiện hoặc Gacha.
          </div>
        </div>
      `;

      tabContent = worldsHtml;
    }

    container.innerHTML = `
      <div style="display: flex; gap: 0.5rem; margin-bottom: 0.875rem; border-bottom: 1px solid var(--nx-surface-border); padding-bottom: 0.65rem;">
        <button class="nx-btn ${prestigeTab === 'ascension' ? 'nx-btn-violet' : 'nx-btn-secondary'}" style="flex: 1; padding: 0.55rem; font-weight: 800; font-size: 0.8125rem;" onclick="UIModals.setPrestigeTab('ascension')">
          🌌 ${isVi ? 'Tái Sinh Vũ Trụ' : 'Astral Rebirth'}
        </button>
        <button class="nx-btn ${prestigeTab === 'worlds' ? 'nx-btn-violet' : 'nx-btn-secondary'}" style="flex: 1; padding: 0.55rem; font-weight: 800; font-size: 0.8125rem;" onclick="UIModals.setPrestigeTab('worlds')">
          ⛩️ ${isVi ? '4 Thế Giới & Thú Cưng' : '4 Worlds & Pets'}
        </button>
      </div>
      ${tabContent}
    `;
  }

  function setPrestigeTab(tab) {
    prestigeTab = tab;
    renderPrestigeContent();
  }

  function executePrestige() {
    const state = global.GameState.get();
    const outcome = global.Engine
      ? global.Engine.prestigeOutcome(state)
      : null;
    if (!outcome) return;

    state.astralShards = outcome.astralShards;
    state.totalAstralShards = outcome.totalAstralShards;
    state.prestigeCount = outcome.prestigeCount;

    state.essence = outcome.reset.essence;
    state.totalEssence = outcome.reset.totalEssence;
    state.level = outcome.reset.level;
    state.currentExp = outcome.reset.currentExp;
    state.maxExp = outcome.reset.maxExp;
    state.upgrades.forEach(function (u) { u.level = 0; });

    if (global.Sound) global.Sound.playAchievement();
    global.GameState.save();
    closeModal('prestigeModal');
    global.UI.updateStatsDisplay();
    if (global.UIUpgrades) global.UIUpgrades.render();
  }

  // =========================================================================
  // 7. STATS & PERSONAL RECORDS CONTENT
  // =========================================================================
  function renderStatsContent() {
    const container = document.getElementById('statsModalContent');
    if (!container) return;

    const state = global.GameState.get();
    const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;
    const format = global.Numeric ? global.Numeric.format : function (n) { return Math.floor(n); };
    const bonuses = global.Bonuses ? global.Bonuses.getAllBonuses() : {};

    container.innerHTML = `
      <!-- 1. PERSONAL RECORDS (v8.0: KỶ LỤC CÁ NHÂN) -->
      <div style="border-radius: 0.875rem; background: linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(56,189,248,0.15) 100%); border: 1.5px solid rgba(251,191,36,0.4); padding: 1rem; margin-bottom: 1rem;">
        <div style="font-size: 0.8125rem; font-weight: 900; text-transform: uppercase; color: #fbbf24; margin-bottom: 0.65rem; display: flex; align-items: center; gap: 0.4rem;">
          <span>🏆</span>
          <span>${isVi ? 'KỶ LỤC CÁ NHÂN (PERSONAL RECORDS)' : 'PERSONAL RECORDS'}</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.45rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; color: #cbd5e1;">
            <span>${isVi ? 'Nexyroth/giây (CPS) cao nhất từng đạt:' : 'Highest CPS ever achieved:'}</span>
            <strong style="color: #38bdf8; font-family: ui-monospace, monospace;">${format(state.records.highestCps || 0)}/s</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; color: #cbd5e1;">
            <span>${isVi ? 'Cú click lớn nhất (kể cả Chí Mạng):' : 'Highest single click ever:'}</span>
            <strong style="color: #fbbf24; font-family: ui-monospace, monospace;">+${format(state.records.highestClick || 0)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; color: #cbd5e1;">
            <span>${isVi ? 'Số lần bấm nhiều nhất trong 10 giây:' : 'Max clicks in 10-second window:'}</span>
            <strong style="color: #c084fc; font-family: ui-monospace, monospace;">${state.records.maxClicksIn10s || 0} lần</strong>
          </div>
        </div>
      </div>

      <!-- 2. 4 NEW MULTIPLIERS (v8.1) -->
      <div style="border-radius: 0.875rem; background: rgba(18,24,38,0.85); border: 1px solid var(--nx-surface-border); padding: 1rem; margin-bottom: 1rem;">
        <div style="font-size: 0.8125rem; font-weight: 900; text-transform: uppercase; color: #38bdf8; margin-bottom: 0.65rem;">
          ⚡ ${isVi ? 'HỆ SỐ CHIẾN ĐẤU & KINH TẾ (BONUSES ENGINE)' : 'CORE BONUSES & ECONOMY'}
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.45rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; color: #cbd5e1;">
            <span>${isVi ? 'Sát Thương Boss (nhân dồn):' : 'Boss Damage Multiplier:'}</span>
            <strong style="color: #f43f5e; font-family: ui-monospace, monospace;">x${bonuses.bossDamageMultiplier || 1.0}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; color: #cbd5e1;">
            <span>${isVi ? 'Tỉ Lệ Rơi Item & Thuốc:' : 'Item Drop Rate:'}</span>
            <strong style="color: #38bdf8; font-family: ui-monospace, monospace;">${Math.round((bonuses.itemDropChance || 0.05) * 100)}%</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; color: #cbd5e1;">
            <span>${isVi ? 'Tỉ Lệ Rơi Kim Cương (Gems):' : 'Gem Drop Rate:'}</span>
            <strong style="color: #fbbf24; font-family: ui-monospace, monospace;">${Math.round((bonuses.gemDropChance || 0.03) * 100)}%</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; color: #cbd5e1;">
            <span>${isVi ? 'Hiệu Suất Ngoại Tuyến (Offline):' : 'Offline Earnings Efficiency:'}</span>
            <strong style="color: #10b981; font-family: ui-monospace, monospace;">${Math.round((bonuses.offlineEfficiency || 0.50) * 100)}% (tối đa 100%)</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; color: #cbd5e1;">
            <span>${isVi ? 'Buff từ Thành Tựu đã mở:' : 'Achievement Production Buff:'}</span>
            <strong style="color: #fbbf24; font-family: ui-monospace, monospace;">+${bonuses.achievementBuffPercent || 0}%</strong>
          </div>
        </div>
      </div>

      <!-- 3. LIFETIME RUNTIME STATS -->
      <div style="border-radius: 0.875rem; background: rgba(18,24,38,0.85); border: 1px solid var(--nx-surface-border); padding: 1rem;">
        <div style="font-size: 0.8125rem; font-weight: 900; text-transform: uppercase; color: #a855f7; margin-bottom: 0.65rem;">
          📊 ${isVi ? 'THỐNG KÊ TOÀN CÕI' : 'LIFETIME TOTALS'}
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.8125rem; color: #cbd5e1;">
          <div style="display: flex; justify-content: space-between;">
            <span>Tổng lần bấm Lõi:</span>
            <strong>${state.totalClicks}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Tổng cú đánh Chí Mạng:</span>
            <strong>${state.totalCrits || 0}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Tổng số Boss đã hạ:</span>
            <strong>${state.bossesDefeated}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Tổng số nâng cấp đã mua:</span>
            <strong>${state.totalUpgradesBought || 0}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Tổng số lần Thăng Thiên:</span>
            <strong>${state.prestigeCount}</strong>
          </div>
        </div>
      </div>
    `;
  }

  function init() {
    document.querySelectorAll('.nx-modal-backdrop').forEach(function (backdrop) {
      backdrop.addEventListener('click', function (e) {
        if (e.target === backdrop) {
          closeModal(backdrop.id);
        }
      });

      const closeBtns = backdrop.querySelectorAll('.nx-modal-close');
      closeBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          closeModal(backdrop.id);
        });
      });
    });

    window.addEventListener('keydown', function (e) {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.key === 'Escape' || e.code === 'Escape') {
        if (activeModal) closeModal(activeModal.id);
      } else if (e.key === 'g' || e.key === 'G' || e.code === 'KeyG') {
        const gemModal = document.getElementById('gemShopModal');
        if (gemModal && gemModal.classList.contains('is-open')) {
          closeModal('gemShopModal');
        } else {
          openModal('gemShopModal');
        }
      } else if (e.key === 'b' || e.key === 'B' || e.code === 'KeyB') {
        const invModal = document.getElementById('inventoryModal');
        if (invModal && invModal.classList.contains('is-open')) {
          closeModal('inventoryModal');
        } else {
          openModal('inventoryModal');
        }
      }
    });

    const gemShopBtn = document.getElementById('headerGemShopBtn');
    if (gemShopBtn) gemShopBtn.onclick = function () { openModal('gemShopModal'); };

    const invBtn = document.getElementById('headerInventoryBtn');
    if (invBtn) invBtn.onclick = function () { openModal('inventoryModal'); };

    const settingsBtn = document.getElementById('headerSettingsBtn');
    if (settingsBtn) settingsBtn.onclick = function () { openModal('settingsModal'); };

    const dailyBtn = document.getElementById('headerDailyBtn');
    if (dailyBtn) dailyBtn.onclick = function () { openModal('dailyRewardModal'); };

    const eventBtn = document.getElementById('headerEventBtn');
    if (eventBtn) eventBtn.onclick = function () { openModal('cosmicEventModal'); };

    const langBtn = document.getElementById('headerLangBtn');
    if (langBtn) {
      langBtn.onclick = function () {
        const nextLang = global.I18n.getLang() === 'vi' ? 'en' : 'vi';
        global.I18n.setLang(nextLang);
      };
    }

    const headerMuteBtn = document.getElementById('headerMuteBtn');
    if (headerMuteBtn) {
      headerMuteBtn.onclick = function () {
        if (global.Sound && global.Sound.toggleMute) {
          global.Sound.toggleMute();
        }
      };
    }

    updateBackpackBadge();
  }

  global.UIModals = {
    init: init,
    open: openModal,
    close: closeModal,
    buyPotion: buyPotion,
    usePotion: usePotion,
    setShopTab: setShopTab,
    openPaymentModal: openPaymentModal,
    closePaymentModal: closePaymentModal,
    confirmSandboxPayment: confirmSandboxPayment,
    setBackpackTab: setBackpackTab,
    setRelicFilter: setRelicFilter,
    updateBackpackBadge: updateBackpackBadge,
    buyGemItem: buyGemItem,
    selectSkillNode: selectSkillNode,
    unlockOrUpgradeSkill: unlockOrUpgradeSkill,
    unlockSkill: unlockSkill,
    upgradeInfiniteSkill: upgradeInfiniteSkill,
    respecSkills: respecSkills,
    setSkillBranch: setSkillBranch,
    toggleRelic: toggleRelic,
    unequipRelic: unequipRelic,
    autoEquipRelics: autoEquipRelics,
    executePrestige: executePrestige,
    setPrestigeTab: setPrestigeTab,
    claimAchievement: claimAchievement,
    redeemCode: handleRedeemCode,
    renderStatsContent: renderStatsContent
  };
})(typeof window !== 'undefined' ? window : this);
