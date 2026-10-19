/**
 * NEXYROTH CLICKER - COSMIC RELIC & SKILL VECTOR ARTWORK ENGINE
 * 100% Offline, Zero-Latency, Scalable SVG Miniature Art for all 27 Relics & 18 Skills.
 * Renders crisp, retina-ready fantasy illustrations with rarity-themed glowing frames.
 */
(function (global) {
  'use strict';

  const RARITY_THEMES = {
    rare: {
      border: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.45)',
      bgGrad1: '#082f49',
      bgGrad2: '#0c192c',
      accent: '#7dd3fc',
      badgeBg: 'rgba(56, 189, 248, 0.15)',
      badgeText: '#38bdf8',
      labelVi: 'Hiếm',
      labelEn: 'Rare'
    },
    epic: {
      border: '#c084fc',
      glow: 'rgba(192, 132, 252, 0.45)',
      bgGrad1: '#3b0764',
      bgGrad2: '#150d2a',
      accent: '#e9d5ff',
      badgeBg: 'rgba(168, 85, 247, 0.18)',
      badgeText: '#c084fc',
      labelVi: 'Sử Thi',
      labelEn: 'Epic'
    },
    legendary: {
      border: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.5)',
      bgGrad1: '#451a03',
      bgGrad2: '#1f1308',
      accent: '#fde68a',
      badgeBg: 'rgba(245, 158, 11, 0.18)',
      badgeText: '#fbbf24',
      labelVi: 'Huyền Thoại',
      labelEn: 'Legendary'
    },
    mythic: {
      border: '#f43f5e',
      glow: 'rgba(244, 63, 94, 0.55)',
      bgGrad1: '#4c0519',
      bgGrad2: '#200713',
      accent: '#fecdd3',
      badgeBg: 'rgba(244, 63, 94, 0.2)',
      badgeText: '#fb7185',
      labelVi: 'Thần Thoại',
      labelEn: 'Mythic'
    }
  };

  /**
   * Generates custom SVG for a relic by ID
   */
  function getRelicSvg(relicId, rarity, size) {
    const s = size || 52;
    const r = (rarity || 'rare').toLowerCase();
    const theme = RARITY_THEMES[r] || RARITY_THEMES.rare;
    const gradId = 'rel_grad_' + relicId + '_' + Math.floor(Math.random() * 10000);

    let innerGraphic = '';

    switch (relicId) {
      case 'relic_eye':
        // Eye of the Astral Seer
        innerGraphic = `
          <ellipse cx="26" cy="26" rx="16" ry="10" fill="none" stroke="${theme.accent}" stroke-width="2"/>
          <circle cx="26" cy="26" r="6" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>
          <circle cx="26" cy="26" r="2.5" fill="#ffffff"/>
          <path d="M12 26 L8 26 M44 26 L40 26 M26 12 L26 8 M26 44 L26 40" stroke="${theme.border}" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="19" cy="22" r="1" fill="#fff" opacity="0.8"/>
        `;
        break;

      case 'relic_hourglass':
        // Hourglass of Infinity
        innerGraphic = `
          <path d="M17 12 L35 12 L28 25 L35 38 L17 38 L24 25 Z" fill="none" stroke="${theme.accent}" stroke-width="2" stroke-linejoin="round"/>
          <path d="M21 16 L31 16 L26 24 Z" fill="#c084fc" opacity="0.6"/>
          <path d="M24 28 L28 28 L32 35 L20 35 Z" fill="#a855f7" opacity="0.85"/>
          <line x1="26" y1="24" x2="26" y2="28" stroke="#fff" stroke-width="1.5" stroke-dasharray="1 1"/>
          <line x1="15" y1="12" x2="37" y2="12" stroke="${theme.border}" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="15" y1="38" x2="37" y2="38" stroke="${theme.border}" stroke-width="2.5" stroke-linecap="round"/>
        `;
        break;

      case 'relic_heart':
        // Heart of Nexyroth
        innerGraphic = `
          <path d="M26 39 C26 39 13 30 13 20 C13 14 17 11 22 13 C24 14 25.5 16 26 17 C26.5 16 28 14 30 13 C35 11 39 14 39 20 C39 30 26 39 26 39 Z" 
                fill="url(#${gradId}_heart)" stroke="${theme.accent}" stroke-width="1.8"/>
          <path d="M26 19 L26 33 M20 23 L32 23" stroke="rgba(255,255,255,0.7)" stroke-width="1.2" stroke-linecap="round"/>
          <circle cx="26" cy="23" r="3" fill="#fff" opacity="0.9"/>
          <defs>
            <radialGradient id="${gradId}_heart" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#fb7185"/>
              <stop offset="70%" stop-color="#e11d48"/>
              <stop offset="100%" stop-color="#881337"/>
            </radialGradient>
          </defs>
        `;
        break;

      case 'relic_giant_hammer':
        // Búa Chiến Người Khổng Lồ
        innerGraphic = `
          <line x1="15" y1="37" x2="33" y2="19" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
          <rect x="25" y="11" width="16" height="11" rx="2" transform="rotate(-45 33 16)" fill="#475569" stroke="${theme.border}" stroke-width="1.8"/>
          <path d="M30 13 L36 19 M32 11 L38 17" stroke="${theme.accent}" stroke-width="1"/>
          <polygon points="13,39 17,35 15,33 11,37" fill="${theme.border}"/>
          <circle cx="33" cy="16" r="2" fill="#fbbf24"/>
        `;
        break;

      case 'relic_lucky_coin':
        // Đồng Xu May Mắn
        innerGraphic = `
          <circle cx="26" cy="26" r="14" fill="#0f172a" stroke="${theme.border}" stroke-width="2"/>
          <circle cx="26" cy="26" r="11" fill="none" stroke="${theme.accent}" stroke-width="1" stroke-dasharray="2 1.5"/>
          <path d="M26 18 C28 21 31 24 34 26 C31 28 28 31 26 34 C24 31 21 28 18 26 C21 24 24 21 26 18 Z" fill="${theme.border}"/>
          <circle cx="26" cy="26" r="2.5" fill="#fff"/>
        `;
        break;

      case 'relic_treasure_radar':
        // Radar Dò Kho Báu
        innerGraphic = `
          <circle cx="26" cy="26" r="15" fill="none" stroke="${theme.border}" stroke-width="1.5"/>
          <circle cx="26" cy="26" r="9" fill="none" stroke="${theme.border}" stroke-width="1" opacity="0.6"/>
          <circle cx="26" cy="26" r="3" fill="${theme.accent}"/>
          <line x1="26" y1="11" x2="26" y2="41" stroke="${theme.border}" stroke-width="1" opacity="0.4"/>
          <line x1="11" y1="26" x2="41" y2="26" stroke="${theme.border}" stroke-width="1" opacity="0.4"/>
          <path d="M26 26 L36 16" stroke="#34d399" stroke-width="2" stroke-linecap="round"/>
          <circle cx="32" cy="20" r="1.8" fill="#34d399"/>
        `;
        break;

      case 'relic_void_crown':
        // Vương Miện Hư Không
        innerGraphic = `
          <path d="M14 34 L14 24 L20 28 L26 16 L32 28 L38 24 L38 34 Z" fill="#3b0764" stroke="${theme.border}" stroke-width="1.8" stroke-linejoin="round"/>
          <circle cx="26" cy="15" r="2.5" fill="#c084fc"/>
          <circle cx="14" cy="23" r="2" fill="#a855f7"/>
          <circle cx="38" cy="23" r="2" fill="#a855f7"/>
          <rect x="14" y="32" width="24" height="4" rx="1" fill="${theme.border}"/>
          <circle cx="26" cy="34" r="1.5" fill="#fff"/>
        `;
        break;

      case 'relic_starlight_boots':
        // Hài Tinh Tú
        innerGraphic = `
          <path d="M16 16 L23 16 L23 28 L33 28 C35 28 37 30 37 32 L37 34 L16 34 Z" fill="#0369a1" stroke="${theme.border}" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M20 18 L27 13 L24 20 L30 16" stroke="${theme.accent}" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="33" cy="32" r="1.5" fill="#fff"/>
          <line x1="14" y1="36" x2="38" y2="36" stroke="${theme.border}" stroke-width="1" stroke-dasharray="2 2"/>
        `;
        break;

      case 'relic_eclipse_amulet':
        // Bùa Nhật Thực
        innerGraphic = `
          <circle cx="26" cy="26" r="12" fill="#0f172a" stroke="${theme.accent}" stroke-width="1.5"/>
          <path d="M22 15 C28 17 32 21 32 27 C32 33 28 37 22 39 C31 38 37 32 37 26 C37 19 31 15 22 15 Z" fill="${theme.border}"/>
          <circle cx="21" cy="26" r="5" fill="#c084fc" opacity="0.8"/>
          <circle cx="21" cy="26" r="2" fill="#fff"/>
        `;
        break;

      case 'relic_singularity_ring':
        // Nhẫn Điểm Kỳ Dị
        innerGraphic = `
          <ellipse cx="26" cy="31" rx="14" ry="7" fill="none" stroke="${theme.border}" stroke-width="2.5"/>
          <circle cx="26" cy="20" r="8" fill="#000" stroke="${theme.accent}" stroke-width="2"/>
          <circle cx="26" cy="20" r="4" fill="#f43f5e" opacity="0.85"/>
          <ellipse cx="26" cy="20" rx="12" ry="3" fill="none" stroke="#fb7185" stroke-width="1" stroke-dasharray="3 1.5"/>
          <circle cx="26" cy="20" r="1.5" fill="#fff"/>
        `;
        break;

      case 'relic_nebula_cloak':
        // Áo Choàng Tinh Vân
        innerGraphic = `
          <path d="M18 15 C22 13 30 13 34 15 L38 37 C34 35 28 38 26 36 C24 38 18 35 14 37 Z" fill="#1e1b4b" stroke="${theme.border}" stroke-width="1.8" stroke-linejoin="round"/>
          <circle cx="26" cy="16" r="3" fill="${theme.accent}" stroke="#fff" stroke-width="1"/>
          <path d="M22 22 Q26 26 30 22" stroke="${theme.border}" stroke-width="1.2" fill="none"/>
          <circle cx="22" cy="29" r="1" fill="#38bdf8"/>
          <circle cx="30" cy="28" r="1" fill="#c084fc"/>
        `;
        break;

      case 'relic_ancient_tome':
        // Sách Cổ Khe Nứt
        innerGraphic = `
          <rect x="15" y="14" width="22" height="25" rx="2" fill="#1e1b4b" stroke="${theme.border}" stroke-width="2"/>
          <path d="M15 17 L26 17 L37 17" stroke="${theme.accent}" stroke-width="1.2"/>
          <circle cx="26" cy="27" r="5" fill="none" stroke="${theme.accent}" stroke-width="1.5"/>
          <polygon points="26,24 28,29 23,26 29,26 24,29" fill="${theme.border}"/>
          <line x1="26" y1="14" x2="26" y2="39" stroke="${theme.accent}" stroke-width="1"/>
        `;
        break;

      case 'relic_divine_orb':
        // Quả Cầu Ánh Sáng Thần
        innerGraphic = `
          <circle cx="26" cy="26" r="9" fill="url(#${gradId}_sun)" stroke="#fff" stroke-width="1.5"/>
          <ellipse cx="26" cy="26" rx="16" ry="6" fill="none" stroke="${theme.border}" stroke-width="1.5" transform="rotate(30 26 26)"/>
          <ellipse cx="26" cy="26" rx="16" ry="6" fill="none" stroke="${theme.accent}" stroke-width="1" transform="rotate(-30 26 26)"/>
          <circle cx="26" cy="26" r="3" fill="#ffffff"/>
          <defs>
            <radialGradient id="${gradId}_sun">
              <stop offset="0%" stop-color="#fff"/>
              <stop offset="60%" stop-color="#fbbf24"/>
              <stop offset="100%" stop-color="#b45309"/>
            </radialGradient>
          </defs>
        `;
        break;

      case 'relic_shadow_blade':
        // Hắc Ma Đao
        innerGraphic = `
          <path d="M37 12 C30 18 25 24 19 32 L15 30 L22 23 C27 17 32 13 37 12 Z" fill="#475569" stroke="${theme.border}" stroke-width="1.5"/>
          <line x1="16" y1="31" x2="11" y2="38" stroke="${theme.accent}" stroke-width="3" stroke-linecap="round"/>
          <circle cx="11" cy="38" r="1.8" fill="${theme.border}"/>
          <path d="M28 17 C26 21 23 25 20 28" stroke="#c084fc" stroke-width="1.2" stroke-linecap="round"/>
        `;
        break;

      case 'relic_celestial_compass':
        // La Bàn Thiên Hà
        innerGraphic = `
          <circle cx="26" cy="26" r="14" fill="#0f172a" stroke="${theme.border}" stroke-width="2"/>
          <polygon points="26,14 29,26 26,24 23,26" fill="#38bdf8"/>
          <polygon points="26,38 29,26 26,28 23,26" fill="#64748b"/>
          <circle cx="26" cy="26" r="2.5" fill="#fff"/>
          <circle cx="26" cy="14" r="1.2" fill="#fff"/>
        `;
        break;

      case 'relic_phoenix_feather':
        // Lông Phượng Hoàng Tinh Tú
        innerGraphic = `
          <path d="M38 12 C28 15 20 22 14 36 C18 34 22 33 26 31 C25 28 24 25 27 22 C30 20 33 19 35 15 Z" 
                fill="url(#${gradId}_fire)" stroke="${theme.border}" stroke-width="1.5"/>
          <path d="M38 12 Q26 24 13 38" stroke="#fff" stroke-width="1.2" fill="none"/>
          <defs>
            <linearGradient id="${gradId}_fire" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#fef08a"/>
              <stop offset="50%" stop-color="#f59e0b"/>
              <stop offset="100%" stop-color="#b91c1c"/>
            </linearGradient>
          </defs>
        `;
        break;

      case 'relic_dragon_scale':
        // Vảy Rồng Hư Không
        innerGraphic = `
          <path d="M26 12 C34 16 38 24 38 31 C38 38 26 41 26 41 C26 41 14 38 14 31 C14 24 18 16 26 12 Z" 
                fill="#1e1b4b" stroke="${theme.border}" stroke-width="2" stroke-linejoin="round"/>
          <path d="M26 17 C31 20 34 26 33 31 M26 23 C29 26 30 29 30 33" stroke="${theme.accent}" stroke-width="1.2" fill="none"/>
          <circle cx="26" cy="26" r="2.5" fill="${theme.border}"/>
        `;
        break;

      case 'relic_chrono_crystal':
        // Pha Lê Thời Gian
        innerGraphic = `
          <polygon points="26,11 36,19 36,33 26,41 16,33 16,19" fill="#082f49" stroke="${theme.border}" stroke-width="2"/>
          <circle cx="26" cy="26" r="7" fill="none" stroke="${theme.accent}" stroke-width="1" stroke-dasharray="2 1.5"/>
          <polyline points="26,22 26,26 29,26" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="26" cy="26" r="1.5" fill="#38bdf8"/>
        `;
        break;

      case 'relic_abyssal_mirror':
        // Gương Phản Chiếu Vực Thẳm
        innerGraphic = `
          <ellipse cx="26" cy="24" rx="11" ry="14" fill="#0f172a" stroke="${theme.border}" stroke-width="2"/>
          <ellipse cx="26" cy="24" rx="8" ry="11" fill="none" stroke="${theme.accent}" stroke-width="1"/>
          <path d="M26 38 L26 43 M23 43 L29 43" stroke="${theme.border}" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M22 18 Q26 23 24 29" stroke="rgba(255,255,255,0.6)" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        `;
        break;

      case 'relic_cosmic_dice':
        // Xúc Xắc Vận Mệnh
        innerGraphic = `
          <polygon points="26,13 38,20 38,32 26,39 14,32 14,20" fill="#1e1b4b" stroke="${theme.border}" stroke-width="2"/>
          <line x1="26" y1="13" x2="26" y2="26" stroke="${theme.accent}" stroke-width="1.2"/>
          <line x1="14" y1="20" x2="26" y2="26" stroke="${theme.accent}" stroke-width="1.2"/>
          <line x1="38" y1="20" x2="26" y2="26" stroke="${theme.accent}" stroke-width="1.2"/>
          <line x1="26" y1="26" x2="26" y2="39" stroke="${theme.accent}" stroke-width="1.2"/>
          <circle cx="22" cy="18" r="1.5" fill="#fff"/>
          <circle cx="31" cy="27" r="1.5" fill="#c084fc"/>
          <circle cx="21" cy="33" r="1.5" fill="#c084fc"/>
        `;
        break;

      case 'relic_primordial_bell':
        // Chuông Ngân Nguyên Thuỷ
        innerGraphic = `
          <path d="M20 16 C20 12 32 12 32 16 L35 32 C37 34 38 36 38 37 L14 37 C14 36 15 34 17 32 Z" fill="#451a03" stroke="${theme.border}" stroke-width="2"/>
          <line x1="26" y1="10" x2="26" y2="13" stroke="${theme.border}" stroke-width="2" stroke-linecap="round"/>
          <circle cx="26" cy="38" r="2.5" fill="#fbbf24"/>
          <path d="M12 30 Q8 33 12 36 M40 30 Q44 33 40 36" stroke="${theme.accent}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        `;
        break;

      case 'relic_eternity_chain':
        // Xích Vĩnh Cửu
        innerGraphic = `
          <rect x="14" y="16" width="13" height="9" rx="4.5" transform="rotate(-30 20 20)" fill="none" stroke="${theme.border}" stroke-width="2.2"/>
          <rect x="25" y="27" width="13" height="9" rx="4.5" transform="rotate(-30 31 31)" fill="none" stroke="${theme.border}" stroke-width="2.2"/>
          <circle cx="26" cy="26" r="2" fill="${theme.accent}"/>
        `;
        break;

      case 'relic_quasar_core':
        // Lõi Quasar
        innerGraphic = `
          <circle cx="26" cy="26" r="8" fill="url(#${gradId}_qcore)" stroke="#fff" stroke-width="1.5"/>
          <line x1="26" y1="6" x2="26" y2="46" stroke="#fb7185" stroke-width="2.5" stroke-linecap="round"/>
          <ellipse cx="26" cy="26" rx="17" ry="5" fill="none" stroke="${theme.border}" stroke-width="1.5" transform="rotate(25 26 26)"/>
          <circle cx="26" cy="26" r="3" fill="#ffffff"/>
          <defs>
            <radialGradient id="${gradId}_qcore">
              <stop offset="0%" stop-color="#fff"/>
              <stop offset="50%" stop-color="#f43f5e"/>
              <stop offset="100%" stop-color="#4c0519"/>
            </radialGradient>
          </defs>
        `;
        break;

      case 'relic_spirit_flute':
        // Sáo Tinh Linh
        innerGraphic = `
          <line x1="14" y1="38" x2="38" y2="14" stroke="${theme.border}" stroke-width="3" stroke-linecap="round"/>
          <circle cx="23" cy="29" r="1.2" fill="#0f172a"/>
          <circle cx="26" cy="26" r="1.2" fill="#0f172a"/>
          <circle cx="29" cy="23" r="1.2" fill="#0f172a"/>
          <circle cx="32" cy="20" r="1.2" fill="#0f172a"/>
          <path d="M37 11 Q41 9 40 14" stroke="${theme.accent}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <circle cx="39" cy="8" r="1" fill="#fff"/>
        `;
        break;

      case 'relic_nirvana_lotus':
        // Hoa Sen Niết Bàn
        innerGraphic = `
          <path d="M26 12 C29 18 30 26 26 34 C22 26 23 18 26 12 Z" fill="#f43f5e" opacity="0.9"/>
          <path d="M26 34 C21 31 15 28 14 21 C19 19 24 25 26 34 Z" fill="#e11d48" opacity="0.8"/>
          <path d="M26 34 C31 31 37 28 38 21 C33 19 28 25 26 34 Z" fill="#e11d48" opacity="0.8"/>
          <ellipse cx="26" cy="34" rx="14" ry="4" fill="#881337" stroke="${theme.border}" stroke-width="1"/>
          <circle cx="26" cy="24" r="2.5" fill="#fbbf24"/>
        `;
        break;

      case 'relic_astral_monolith':
        // Bản Đồ Thiên Cương
        innerGraphic = `
          <polygon points="18,12 34,12 36,38 16,38" fill="#1e293b" stroke="${theme.border}" stroke-width="2"/>
          <line x1="20" y1="20" x2="32" y2="20" stroke="${theme.accent}" stroke-width="1"/>
          <line x1="22" y1="27" x2="30" y2="27" stroke="${theme.accent}" stroke-width="1"/>
          <circle cx="23" cy="20" r="1.5" fill="#38bdf8"/>
          <circle cx="29" cy="20" r="1.5" fill="#c084fc"/>
          <circle cx="26" cy="33" r="2" fill="#fbbf24"/>
        `;
        break;

      case 'relic_sovereign_ring':
        // Nhẫn Chúa Tể Nexyroth
        innerGraphic = `
          <ellipse cx="26" cy="31" rx="13" ry="6" fill="none" stroke="${theme.border}" stroke-width="3"/>
          <path d="M20 18 L26 11 L32 18 L29 23 L23 23 Z" fill="url(#${gradId}_sov)" stroke="#fff" stroke-width="1.5"/>
          <circle cx="26" cy="18" r="2" fill="#fff"/>
          <line x1="26" y1="8" x2="26" y2="10" stroke="#fbbf24" stroke-width="1.5"/>
          <defs>
            <linearGradient id="${gradId}_sov" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fb7185"/>
              <stop offset="50%" stop-color="#c084fc"/>
              <stop offset="100%" stop-color="#38bdf8"/>
            </linearGradient>
          </defs>
        `;
        break;

      default:
        // Universal Cosmic Relic
        innerGraphic = `
          <polygon points="26,12 38,26 26,40 14,26" fill="none" stroke="${theme.border}" stroke-width="2"/>
          <circle cx="26" cy="26" r="6" fill="${theme.accent}"/>
          <circle cx="26" cy="26" r="2" fill="#fff"/>
        `;
        break;
    }

    return `
      <svg width="${s}" height="${s}" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" class="relic-svg-artwork" style="filter: drop-shadow(0 0 8px ${theme.glow}); flex-shrink: 0;">
        <defs>
          <linearGradient id="${gradId}_bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${theme.bgGrad1}"/>
            <stop offset="100%" stop-color="${theme.bgGrad2}"/>
          </linearGradient>
        </defs>
        <!-- Background Frame -->
        <rect x="2" y="2" width="48" height="48" rx="10" fill="url(#${gradId}_bg)" stroke="${theme.border}" stroke-width="1.8"/>
        <!-- Inner Rarity Glow Rim -->
        <rect x="4" y="4" width="44" height="44" rx="8" fill="none" stroke="${theme.border}" stroke-width="0.8" opacity="0.4"/>
        <!-- Graphic -->
        ${innerGraphic}
        <!-- Corner Sparkle -->
        <circle cx="8" cy="8" r="1" fill="#fff" opacity="0.8"/>
        <circle cx="44" cy="44" r="1" fill="${theme.accent}" opacity="0.6"/>
      </svg>
    `;
  }

  /**
   * Generates custom SVG icon for a skill node
   */
  function getSkillSvg(skillId, branch, isUnlocked, size) {
    const s = size || 44;
    const colors = {
      core: { main: '#fbbf24', bg: '#451a03', border: '#fde047', glow: 'rgba(251,191,36,0.7)' },
      chrono: { main: '#38bdf8', bg: '#082f49', border: '#7dd3fc', glow: 'rgba(56,189,248,0.6)' },
      crit: { main: '#f43f5e', bg: '#4c0519', border: '#fb7185', glow: 'rgba(244,63,94,0.6)' },
      fortune: { main: '#10b981', bg: '#064e3b', border: '#34d399', glow: 'rgba(16,185,129,0.6)' },
      overdrive: { main: '#a855f7', bg: '#2e1065', border: '#c084fc', glow: 'rgba(168,85,247,0.6)' }
    };

    const b = colors[branch] || colors.core;
    const strokeCol = isUnlocked ? b.border : '#64748b';
    const fillCol = isUnlocked ? b.main : '#334155';
    const bgCol = isUnlocked ? b.bg : '#0f172a';

    let iconGraphic = '';

    if (skillId === 'core') {
      iconGraphic = `
        <circle cx="22" cy="22" r="9" fill="url(#core_grad)" stroke="${strokeCol}" stroke-width="1.8"/>
        <path d="M22 6 L25 15 L34 18 L26 23 L28 32 L22 26 L16 32 L18 23 L10 18 L19 15 Z" fill="${fillCol}" opacity="0.6"/>
        <circle cx="22" cy="22" r="3.5" fill="#fff"/>
      `;
    } else if (skillId === 'chrono_pulse') {
      iconGraphic = `
        <circle cx="22" cy="22" r="12" fill="none" stroke="${strokeCol}" stroke-width="1.5" stroke-dasharray="3 2"/>
        <path d="M12 22 L17 22 L19 16 L22 28 L25 18 L27 22 L32 22" fill="none" stroke="${strokeCol}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="22" cy="22" r="2" fill="${fillCol}"/>
      `;
    } else if (skillId === 'chrono_warp') {
      iconGraphic = `
        <circle cx="22" cy="22" r="12" fill="none" stroke="${strokeCol}" stroke-width="1.6"/>
        <polyline points="22 13 22 22 28 22" stroke="${strokeCol}" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M14 16 L12 11 L17 11" fill="none" stroke="${fillCol}" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M30 28 L32 33 L27 33" fill="none" stroke="${fillCol}" stroke-width="1.5" stroke-linecap="round"/>
      `;
    } else if (skillId === 'chrono_overclock') {
      iconGraphic = `
        <path d="M13 29 A12 12 0 1 1 31 29" fill="none" stroke="${strokeCol}" stroke-width="2" stroke-linecap="round"/>
        <line x1="22" y1="22" x2="29" y2="15" stroke="${fillCol}" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="22" cy="22" r="3" fill="#fff"/>
        <circle cx="29" cy="15" r="1.5" fill="#f43f5e"/>
      `;
    } else if (skillId === 'chrono_infinity') {
      iconGraphic = `
        <path d="M16 19 C13 16 13 28 16 25 C19 22 25 22 28 25 C31 28 31 16 28 19 C25 22 19 22 16 19 Z" fill="none" stroke="${strokeCol}" stroke-width="2"/>
        <circle cx="16" cy="22" r="2.5" fill="${fillCol}"/>
        <circle cx="28" cy="22" r="2.5" fill="${fillCol}"/>
      `;
    } else if (skillId === 'crit_focus') {
      iconGraphic = `
        <circle cx="22" cy="22" r="12" fill="none" stroke="${strokeCol}" stroke-width="1.5"/>
        <circle cx="22" cy="22" r="6" fill="none" stroke="${strokeCol}" stroke-width="1.2"/>
        <line x1="22" y1="6" x2="22" y2="12" stroke="${strokeCol}" stroke-width="2" stroke-linecap="round"/>
        <line x1="22" y1="32" x2="22" y2="38" stroke="${strokeCol}" stroke-width="2" stroke-linecap="round"/>
        <line x1="6" y1="22" x2="12" y2="22" stroke="${strokeCol}" stroke-width="2" stroke-linecap="round"/>
        <line x1="32" y1="22" x2="38" y2="22" stroke="${strokeCol}" stroke-width="2" stroke-linecap="round"/>
        <circle cx="22" cy="22" r="2" fill="#fff"/>
      `;
    } else if (skillId === 'crit_supernova') {
      iconGraphic = `
        <polygon points="22,7 24,17 34,17 26,23 29,33 22,27 15,33 18,23 10,17 20,17" fill="${fillCol}" stroke="${strokeCol}" stroke-width="1.2"/>
        <circle cx="22" cy="22" r="4" fill="#fff"/>
      `;
    } else if (skillId === 'crit_chain') {
      iconGraphic = `
        <polygon points="23,9 15,22 22,22 21,35 29,22 22,22" fill="${fillCol}" stroke="${strokeCol}" stroke-width="1.4" stroke-linejoin="round"/>
        <circle cx="13" cy="14" r="1.5" fill="#fff"/>
        <circle cx="31" cy="30" r="1.5" fill="#fff"/>
      `;
    } else if (skillId === 'crit_collapse') {
      iconGraphic = `
        <circle cx="22" cy="22" r="6" fill="#000" stroke="${strokeCol}" stroke-width="2"/>
        <ellipse cx="22" cy="22" rx="14" ry="4" fill="none" stroke="${strokeCol}" stroke-width="1.5" transform="rotate(-25 22 22)"/>
        <ellipse cx="22" cy="22" rx="14" ry="4" fill="none" stroke="${fillCol}" stroke-width="1.2" transform="rotate(35 22 22)"/>
        <circle cx="22" cy="22" r="2.5" fill="#fff"/>
      `;
    } else if (skillId === 'fortune_dust') {
      iconGraphic = `
        <path d="M22 8 L24 18 L34 20 L24 22 L22 32 L20 22 L10 20 L20 18 Z" fill="${fillCol}" stroke="${strokeCol}" stroke-width="1.2"/>
        <circle cx="13" cy="12" r="2" fill="#fff"/>
        <circle cx="31" cy="30" r="2" fill="#fff"/>
        <circle cx="30" cy="12" r="1.5" fill="${fillCol}"/>
      `;
    } else if (skillId === 'fortune_meteor') {
      iconGraphic = `
        <line x1="33" y1="11" x2="16" y2="28" stroke="${strokeCol}" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="33" y1="16" x2="22" y2="27" stroke="${fillCol}" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
        <circle cx="15" cy="29" r="4.5" fill="${fillCol}" stroke="#fff" stroke-width="1.5"/>
      `;
    } else if (skillId === 'fortune_idle') {
      iconGraphic = `
        <path d="M25 12 A10 10 0 1 0 31 27 A8 8 0 1 1 25 12 Z" fill="${fillCol}" stroke="${strokeCol}" stroke-width="1.4"/>
        <circle cx="15" cy="15" r="1.5" fill="#fff"/>
        <circle cx="19" cy="11" r="1" fill="#fff"/>
      `;
    } else if (skillId === 'fortune_market') {
      iconGraphic = `
        <polygon points="22,9 31,16 27,33 17,33 13,16" fill="none" stroke="${strokeCol}" stroke-width="1.8"/>
        <line x1="13" y1="16" x2="31" y2="16" stroke="${strokeCol}" stroke-width="1.2"/>
        <line x1="22" y1="9" x2="22" y2="33" stroke="${strokeCol}" stroke-width="1.2"/>
        <circle cx="22" cy="21" r="2.5" fill="#fbbf24"/>
      `;
    } else if (skillId === 'overdrive_synergy') {
      iconGraphic = `
        <ellipse cx="22" cy="22" rx="13" ry="5" fill="none" stroke="${strokeCol}" stroke-width="1.5" transform="rotate(-30 22 22)"/>
        <ellipse cx="22" cy="22" rx="13" ry="5" fill="none" stroke="${strokeCol}" stroke-width="1.5" transform="rotate(30 22 22)"/>
        <ellipse cx="22" cy="22" rx="13" ry="5" fill="none" stroke="${strokeCol}" stroke-width="1.5" transform="rotate(90 22 22)"/>
        <circle cx="22" cy="22" r="4" fill="${fillCol}"/>
      `;
    } else if (skillId === 'overdrive_horizon') {
      iconGraphic = `
        <circle cx="22" cy="22" r="13" fill="none" stroke="${strokeCol}" stroke-width="2" stroke-dasharray="4 2"/>
        <circle cx="22" cy="22" r="7" fill="${fillCol}" stroke="#fff" stroke-width="1.2"/>
        <circle cx="22" cy="22" r="2.5" fill="#000"/>
      `;
    } else if (skillId === 'overdrive_zenith') {
      iconGraphic = `
        <path d="M12 28 L15 14 L22 21 L29 14 L32 28 Z" fill="${fillCol}" stroke="${strokeCol}" stroke-width="1.8" stroke-linejoin="round"/>
        <circle cx="15" cy="14" r="2" fill="#fff"/>
        <circle cx="22" cy="21" r="2" fill="#fff"/>
        <circle cx="29" cy="14" r="2" fill="#fff"/>
        <rect x="12" y="28" width="20" height="3" rx="1" fill="${strokeCol}"/>
      `;
    } else {
      iconGraphic = `
        <polygon points="22,10 32,22 22,34 12,22" fill="none" stroke="${strokeCol}" stroke-width="2"/>
        <circle cx="22" cy="22" r="4" fill="${fillCol}"/>
      `;
    }

    return `
      <svg width="${s}" height="${s}" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" class="skill-node-svg" style="filter: drop-shadow(0 0 ${isUnlocked ? '8px ' + b.glow : '2px rgba(0,0,0,0.5)'}); flex-shrink: 0;">
        <defs>
          <radialGradient id="core_grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#fde047"/>
            <stop offset="100%" stop-color="#b45309"/>
          </radialGradient>
        </defs>
        <circle cx="22" cy="22" r="19" fill="${bgCol}" stroke="${strokeCol}" stroke-width="${isUnlocked ? '2' : '1.2'}"/>
        ${iconGraphic}
      </svg>
    `;
  }

  // Export to global
  global.RelicArt = {
    getRelicSvg: getRelicSvg,
    getSkillSvg: getSkillSvg,
    RARITY_THEMES: RARITY_THEMES
  };
})(typeof window !== 'undefined' ? window : this);
