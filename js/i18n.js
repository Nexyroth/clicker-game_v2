/**
 * NEXYROTH CLICKER - MULTILINGUAL (I18N) SYSTEM
 * Default: Tiếng Việt ('vi')
 * Supported: Tiếng Việt ('vi'), English ('en')
 */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'nexyroth_lang';

  const TRANSLATIONS = {
    vi: {
      brand_title: 'NEXYROTH',
      brand_subtitle: 'Bản Vũ Trụ · Phase 4',
      essence: 'Năng Lượng Tối',
      shards: 'Mảnh Astral',
      gems: 'Đá Quý',
      daily_btn: 'Quà Hàng Ngày',
      event_btn: 'Sự Kiện',
      gem_shop_btn: 'Cửa Hàng',
      backpack_btn: 'Balo',
      backpack_title: 'Balo Vật Phẩm & Cổ Vật',
      export_zip_btn: 'Tải ZIP',
      settings_btn: 'Cài Đặt',
      click_power: 'Sức Mạnh Bấm',
      passive_cps: 'Tự Động/Giây',
      level: 'Cấp Độ',
      exp: 'Kinh Nghiệm',
      crit_rate: 'Chí Mạng',
      active_boosts: 'Hiệu Ứng Kích Hoạt',
      none_active: 'Không có hiệu ứng',
      
      // Left Nav
      nav_daily_title: 'Quà Đăng Nhập 7 Ngày',
      nav_daily_desc: 'Nhận Đá Quý, Shards & Cổ Vật',
      nav_event_title: 'Sự Kiện: Void Incursion',
      nav_event_desc: 'Làm nhiệm vụ nhận Tokens',
      nav_boss_title: 'Boss Hư Không',
      nav_boss_desc: 'Đánh bại Boss nhận Đá Quý',
      nav_skills_title: 'Chòm Sao Astral',
      nav_skills_desc: 'Cây kỹ năng nội tại',
      nav_gem_shop_title: 'Cửa Hàng Đá Quý (Shop Gems)',
      nav_gem_shop_desc: 'Thuốc nhân x2..x100, Auto 50ms & Đặc quyền',
      nav_inventory_title: 'Balo & Túi Đồ Vũ Trụ',
      nav_inventory_desc: 'Dùng thuốc x2..x100, auto 50ms & Cổ vật',
      nav_achievements_title: 'Thành Tựu Vũ Trụ',
      nav_achievements_desc: 'Nhận thưởng Đá Quý theo mốc',
      nav_prestige_title: 'Tái Sinh Vũ Trụ (Ascension)',
      nav_prestige_desc: 'Tẩy tủy nhận Mảnh Shards vĩnh viễn',

      // Core
      conduit_title: 'Dẫn Truyền Chiều Không Gian',
      core_title: 'Lõi Nexyroth',
      click_label: 'Bấm',
      crit_label: 'Chí mạng',
      skill_overload: 'Quá Tải',
      skill_surge: 'Xung Kích',
      skill_warp: 'Bẻ Cong',
      boss_challenge: '⚔️ Khiêu Chiến Boss Hư Không',

      // Upgrades
      upgrades_title: 'Nâng Cấp',
      buy_label: 'Mua',
      locked: 'Khóa',
      unlocks_at: 'Mở khóa ở Cấp',

      // Mobile Tabs
      tab_core: 'Lõi Bấm',
      tab_upgrades: 'Nâng Cấp',
      tab_stats: 'Nhân Vật',
      tab_events: 'Sự Kiện & Quà',

      // Daily Modal
      daily_modal_title: 'Phần Thưởng Đăng Nhập 7 Ngày',
      daily_banner_title: 'Phước Lành Tinh Tú Mỗi Ngày',
      daily_banner_desc: 'Đăng nhập mỗi ngày để nhận Đá Quý, Mảnh Shards và Cổ Vật Huyền Thoại Sovereign!',
      daily_streak: 'Chuỗi:',
      daily_days: 'ngày',
      daily_status: 'Trạng thái:',
      daily_ready: 'SẴN SÀNG NHẬN QUÀ!',
      daily_claimed_today: 'Đã nhận hôm nay (Quay lại sau)',
      daily_claim_now_btn: '🎁 NHẬN THƯỞNG NGÀY',
      daily_test_skip: '⚡ Bỏ Qua 24h (Thử Nghiệm)',
      claimed_tag: 'ĐÃ NHẬN',

      // Event Modal
      event_modal_title: 'Sự Kiện: Cosmic Void Incursion',
      event_banner_title: 'Đại Chiến Hư Không',
      event_banner_desc: 'Hoàn thành các nhiệm vụ thám hiểm để tích lũy Tokens và nhận cổ vật độc quyền!',
      event_ends_in: 'Kết thúc sau:',
      event_tokens: 'Tokens Tích Lũy:',
      event_milestones: 'Mốc Phần Thưởng Tokens',
      event_missions: 'Nhiệm Vụ Sự Kiện',
      progress: 'Tiến độ',
      done: 'HOÀN THÀNH',
      in_progress: 'Đang Làm',

      // Settings Modal
      settings_modal_title: 'Cài Đặt & Điều Khiển',
      settings_audio: 'Âm Thanh & Hiệu Ứng (SFX)',
      settings_audio_desc: 'Âm thanh tiếng bấm, nâng cấp và nhận quà',
      settings_mute: 'Tắt Tiếng (Mute All)',
      settings_volume: 'Âm Lượng',
      settings_language: 'Ngôn Ngữ (Language)',
      settings_scientific: 'Ký Hiệu Khoa Học (1.0e9)',
      settings_scientific_desc: 'Hiển thị số lớn dạng khoa học thay vì K, M, B',
      settings_floating: 'Chữ Số Bay Khi Bấm',
      settings_floating_desc: 'Hiển thị số sát thương nhảy lên khi bấm',
      settings_giftcode: 'Nhập Mã Quà Tặng (Giftcode)',
      settings_giftcode_placeholder: 'Nhập mã (VD: TANTHU, NEXYROTH, VIP999)',
      settings_giftcode_btn: 'Nhận Quà',
      settings_save_title: 'Lưu Trữ & Xuất File',
      settings_export_save: '📥 Xuất Lưu (.json)',
      settings_import_save: '📤 Nhập Lưu',
      settings_export_zip: '📦 Tải Toàn Bộ Mã Nguồn (.ZIP)',
      settings_hard_reset: '⚠️ Xóa Toàn Bộ Dữ Liệu (Chơi Lại Từ Đầu)',
      settings_hard_reset_confirm: 'Bạn có chắc chắn muốn xóa toàn bộ tiến trình không? Thao tác này không thể hoàn tác!',

      // Gem Shop Modal
      gem_shop_title: 'Kho Tàng Đá Quý',
      gem_balance: 'Số dư Đá Quý',
      purchased: 'ĐÃ MUA'
    },
    en: {
      brand_title: 'NEXYROTH',
      brand_subtitle: 'Phase 4 · Cosmic Edition',
      essence: 'Cosmic Essence',
      shards: 'Astral Shards',
      gems: 'Astral Gems',
      daily_btn: 'Daily Gift',
      event_btn: 'Event',
      gem_shop_btn: 'Gem Shop',
      backpack_btn: 'Backpack',
      backpack_title: 'Backpack & Relic Vault',
      export_zip_btn: 'Export ZIP',
      settings_btn: 'Settings',
      click_power: 'Click Power',
      passive_cps: 'Passive CPS',
      level: 'Level',
      exp: 'EXP',
      crit_rate: 'Crit Rate',
      active_boosts: 'Active Boosts',
      none_active: 'None active',

      // Left Nav
      nav_daily_title: '7-Day Login Rewards',
      nav_daily_desc: 'Claim Gems, Shards & Relics',
      nav_event_title: 'Event: Void Incursion',
      nav_event_desc: 'Complete quests for Tokens',
      nav_boss_title: 'Void Titan Encounters',
      nav_boss_desc: 'Defeat bosses for Gems',
      nav_skills_title: 'Astral Constellations',
      nav_skills_desc: 'Branching passive skill tree',
      nav_gem_shop_title: 'Celestial Gem Vault (Shop)',
      nav_gem_shop_desc: 'Timed x2..x100 potions, 50ms Auto & Perks',
      nav_inventory_title: 'Backpack & Item Bag',
      nav_inventory_desc: 'Use x2..x100 potions, auto 50ms & relics',
      nav_achievements_title: 'Cosmic Achievements',
      nav_achievements_desc: 'Claim milestone Gem rewards',
      nav_prestige_title: 'Astral Rebirth (Ascension)',
      nav_prestige_desc: 'Reset for permanent Shards',

      // Core
      conduit_title: 'Dimensional Conduit',
      core_title: 'Nexyroth Core',
      click_label: 'Click',
      crit_label: 'Crit',
      skill_overload: 'Overload',
      skill_surge: 'Surge',
      skill_warp: 'Warp',
      boss_challenge: '⚔️ Challenge Void Titan',

      // Upgrades
      upgrades_title: 'Upgrades',
      buy_label: 'Buy',
      locked: 'Locked',
      unlocks_at: 'Unlocks at Level',

      // Mobile Tabs
      tab_core: 'Core Clicker',
      tab_upgrades: 'Upgrades',
      tab_stats: 'Profile',
      tab_events: 'Events & Gifts',

      // Daily Modal
      daily_modal_title: '7-Day Login Rewards',
      daily_banner_title: 'Daily Astral Blessings',
      daily_banner_desc: 'Log in daily to claim Gems, Shards, and the mythical Sovereign Relic!',
      daily_streak: 'Streak:',
      daily_days: 'days',
      daily_status: 'Status:',
      daily_ready: 'READY TO CLAIM!',
      daily_claimed_today: 'Claimed today (Check back tomorrow)',
      daily_claim_now_btn: '🎁 CLAIM DAY',
      daily_test_skip: '⚡ Fast-Forward 24h (Test)',
      claimed_tag: 'CLAIMED',

      // Event Modal
      event_modal_title: 'Event: Cosmic Void Incursion',
      event_banner_title: 'Void Expedition Incursion',
      event_banner_desc: 'Complete expedition missions to earn Tokens and unlock mythic artifacts!',
      event_ends_in: 'Ends in:',
      event_tokens: 'Earned Tokens:',
      event_milestones: 'Token Milestone Track',
      event_missions: 'Expedition Missions',
      progress: 'Progress',
      done: 'DONE',
      in_progress: 'In Progress',

      // Settings Modal
      settings_modal_title: 'Settings & Controls',
      settings_audio: 'Sound & Audio Effects (SFX)',
      settings_audio_desc: 'Sound for clicks, upgrades, and rewards',
      settings_mute: 'Mute Sound Effects',
      settings_volume: 'Audio Volume',
      settings_language: 'Language (Ngôn Ngữ)',
      settings_scientific: 'Scientific Notation (1.0e9)',
      settings_scientific_desc: 'Use exponential format instead of K, M, B',
      settings_floating: 'Floating Combat Numbers',
      settings_floating_desc: 'Show floating damage numbers on click',
      settings_giftcode: 'Redeem Giftcode',
      settings_giftcode_placeholder: 'Enter code (e.g. TANTHU, NEXYROTH, VIP999)',
      settings_giftcode_btn: 'Redeem',
      settings_save_title: 'Save Data & Backup',
      settings_export_save: '📥 Export Save (.json)',
      settings_import_save: '📤 Import Save',
      settings_export_zip: '📦 Download Full Source (.ZIP)',
      settings_hard_reset: '⚠️ Hard Reset Progress (Wipe All)',
      settings_hard_reset_confirm: 'Are you sure you want to wipe all progress? This action cannot be undone!',

      // Gem Shop Modal
      gem_shop_title: 'Celestial Gem Vault',
      gem_balance: 'Astral Gems',
      purchased: 'PURCHASED'
    }
  };

  let currentLang = 'vi'; // Default Vietnamese

  function initLang() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'vi') {
        currentLang = saved;
      } else {
        currentLang = 'vi'; // Default is Vietnamese
      }
    } catch (e) {
      currentLang = 'vi';
    }
    applyLanguageToDOM();
  }

  function setLanguage(lang) {
    if (lang !== 'vi' && lang !== 'en') return;
    currentLang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}

    const state = global.GameState ? global.GameState.get() : null;
    if (state && state.settings) {
      state.settings.language = lang;
      if (global.GameState.save) global.GameState.save();
    }

    applyLanguageToDOM();
    
    // Re-render open modals to update their language
    if (global.DailyRewards && global.DailyRewards.render) global.DailyRewards.render();
    if (global.CosmicEvents && global.CosmicEvents.render) global.CosmicEvents.render();
    if (global.UIUpgrades && global.UIUpgrades.render) global.UIUpgrades.render();
    if (global.UI && global.UI.updateStatsDisplay) global.UI.updateStatsDisplay();
  }

  function getLang() {
    return currentLang;
  }

  function t(key) {
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS['vi'];
    return dict[key] || TRANSLATIONS['en'][key] || key;
  }

  function applyLanguageToDOM() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = t(key);
      }
    });

    // Update Language Toggle Button on Header if exists
    const langBtn = document.getElementById('headerLangBtn');
    if (langBtn) {
      langBtn.innerHTML = currentLang === 'vi' 
        ? '<span>🇻🇳</span> <span style="font-weight: 800; font-size: 0.75rem;">VI</span>' 
        : '<span>🇬🇧</span> <span style="font-weight: 800; font-size: 0.75rem;">EN</span>';
      langBtn.title = currentLang === 'vi' ? 'Chuyển sang Tiếng Anh' : 'Switch to Vietnamese';
    }
  }

  global.I18n = {
    init: initLang,
    setLang: setLanguage,
    getLang: getLang,
    t: t,
    apply: applyLanguageToDOM
  };
})(typeof window !== 'undefined' ? window : this);
