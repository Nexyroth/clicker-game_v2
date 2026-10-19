/**
 * NEXYROTH CLICKER - STATE MANAGEMENT & PERSISTENCE (v8.0)
 * Pure JavaScript - 100% Offline, Zero Server Dependency
 * Complete v8.0 Game Data:
 * - 41 Cosmic Upgrades
 * - 5 Skill Constellation Branches (including 🍀 Vận May with infinite node)
 * - 27 Relics (equipped max 4)
 * - 35 Unlocked Achievements with real +0.5% buffs
 * - 4 Worlds (including ⛩️ Thiên Giới Vĩnh Hằng) & 18 Pets (plus Cú Đêm Vĩnh Cửu)
 * - Personal Records (Kỷ Lục Cá Nhân)
 * - Two-Way Deep Merge State Loader & Base64 Export/Import
 */
(function (global) {
  'use strict';

  const SAVE_KEY = 'nexyroth_save_v8';

  // 41 Upgrades spanning Level 1 to Level 100+
  const DEFAULT_UPGRADES = [
    { id: 'void_siphon', name: 'Void Siphon', desc: 'Trích xuất vật chất tối xung quanh khe nứt không gian.', baseCost: 15, costMultiplier: 1.15, level: 0, baseEffect: 1, effectType: 'cps', unlockedAtLevel: 1, icon: 'zap' },
    { id: 'astral_prism', name: 'Astral Prism', desc: 'Hội tụ các tia vũ trụ để khuếch đại lực click trực tiếp.', baseCost: 50, costMultiplier: 1.18, level: 0, baseEffect: 2, effectType: 'click', unlockedAtLevel: 1, icon: 'sparkles' },
    { id: 'nebula_harvester', name: 'Nebula Harvester', desc: 'Thu gom bụi sao từ các tinh vân lân cận.', baseCost: 250, costMultiplier: 1.15, level: 0, baseEffect: 8, effectType: 'cps', unlockedAtLevel: 2, icon: 'cloud-lightning' },
    { id: 'starlight_forge', name: 'Starlight Forge', desc: 'Tổng hợp tinh thể astral bằng nhiệt độ siêu sao.', baseCost: 1200, costMultiplier: 1.14, level: 0, baseEffect: 35, effectType: 'cps', unlockedAtLevel: 3, icon: 'flame' },
    { id: 'dimensional_drill', name: 'Dimensional Drill', desc: 'Khoan thủng không thời gian để rút cạn bản chất vực thẳm.', baseCost: 7500, costMultiplier: 1.14, level: 0, baseEffect: 25, effectType: 'click', unlockedAtLevel: 4, icon: 'disc' },
    { id: 'quantum_reactor', name: 'Quantum Reactor', desc: 'Phân hạch đồng vị hư không giải phóng năng lượng liên tục.', baseCost: 45000, costMultiplier: 1.13, level: 0, baseEffect: 260, effectType: 'cps', unlockedAtLevel: 5, icon: 'atom' },
    { id: 'celestial_dynamo', name: 'Celestial Dynamo', desc: 'Khai thác sóng hấp dẫn quỹ đạo để sản sinh năng lượng vô tận.', baseCost: 320000, costMultiplier: 1.13, level: 0, baseEffect: 1800, effectType: 'cps', unlockedAtLevel: 7, icon: 'orbit' },
    { id: 'singularity_core', name: 'Singularity Core', desc: 'Một lỗ đen thu nhỏ tạo ra nguồn năng lượng kinh hoàng.', baseCost: 2500000, costMultiplier: 1.12, level: 0, baseEffect: 12000, effectType: 'cps', unlockedAtLevel: 10, icon: 'sun' },
    { id: 'chrono_accelerator', name: 'Chrono Accelerator', desc: 'Uốn cong thời gian địa phương để tăng tốc mọi cú chạm.', baseCost: 20000000, costMultiplier: 1.12, level: 0, baseEffect: 350, effectType: 'click', unlockedAtLevel: 12, icon: 'clock' },
    { id: 'nexyroth_obelisk', name: 'Nexyroth Obelisk', desc: 'Đài tưởng niệm cổ xưa truyền dẫn vực thẳm nguyên thuỷ.', baseCost: 150000000, costMultiplier: 1.11, level: 0, baseEffect: 110000, effectType: 'cps', unlockedAtLevel: 15, icon: 'shield' },
    // 16 Upgrades from v7.10 (Upgrades 11 to 26)
    { id: 'pulsar_array', name: 'Pulsar Array', desc: 'Mạng lưới sao xung phát xạ xung nhịp năng lượng cao.', baseCost: 1200000000, costMultiplier: 1.11, level: 0, baseEffect: 850000, effectType: 'cps', unlockedAtLevel: 18, icon: 'radio' },
    { id: 'dark_matter_collider', name: 'Dark Matter Collider', desc: 'Máy gia tốc va chạm các hạt vật chất đen bí ẩn.', baseCost: 9500000000, costMultiplier: 1.11, level: 0, baseEffect: 2500, effectType: 'click', unlockedAtLevel: 20, icon: 'crosshair' },
    { id: 'event_horizon_gate', name: 'Event Horizon Gate', desc: 'Cổng chân trời sự kiện hút năng lượng từ đa vũ trụ.', baseCost: 75000000000, costMultiplier: 1.10, level: 0, baseEffect: 6200000, effectType: 'cps', unlockedAtLevel: 22, icon: 'portal' },
    { id: 'astral_warp_engine', name: 'Astral Warp Engine', desc: 'Động cơ bẻ cong thực tại, gia tăng uy lực tối hậu.', baseCost: 600000000000, costMultiplier: 1.10, level: 0, baseEffect: 18000, effectType: 'click', unlockedAtLevel: 25, icon: 'fast-forward' },
    { id: 'supernova_chamber', name: 'Supernova Chamber', desc: 'Buồng giam giữ vụ nổ siêu tân tinh giải phóng vô lượng quang.', baseCost: 5000000000000, costMultiplier: 1.10, level: 0, baseEffect: 48000000, effectType: 'cps', unlockedAtLevel: 28, icon: 'star' },
    { id: 'antimatter_forge', name: 'Antimatter Forge', desc: 'Lò rèn phản vật chất chuyển hóa 100% khối lượng thành năng lượng.', baseCost: 42000000000000, costMultiplier: 1.09, level: 0, baseEffect: 390000000, effectType: 'cps', unlockedAtLevel: 32, icon: 'zap' },
    { id: 'tachyon_condenser', name: 'Tachyon Condenser', desc: 'Ngưng tụ các hạt nhanh hơn ánh sáng để rút ngắn khoảng cách thu thập.', baseCost: 360000000000000, costMultiplier: 1.09, level: 0, baseEffect: 120000, effectType: 'click', unlockedAtLevel: 36, icon: 'feather' },
    { id: 'gamma_ray_funnel', name: 'Gamma Ray Funnel', desc: 'Phễu hội tụ các chớp tia gamma huỷ diệt từ hố đen trung tâm.', baseCost: 3100000000000000, costMultiplier: 1.09, level: 0, baseEffect: 3200000000, effectType: 'cps', unlockedAtLevel: 40, icon: 'target' },
    { id: 'hypercube_matrix', name: 'Hypercube Matrix', desc: 'Ma trận siêu lập phương 4 chiều lưu trữ dung lượng vô hạn.', baseCost: 28000000000000000, costMultiplier: 1.08, level: 0, baseEffect: 28000000000, effectType: 'cps', unlockedAtLevel: 45, icon: 'box' },
    { id: 'void_monolith', name: 'Void Monolith', desc: 'Cột đá hư không khắc cổ ngữ ma pháp cổ xưa nhất.', baseCost: 250000000000000000, costMultiplier: 1.08, level: 0, baseEffect: 850000, effectType: 'click', unlockedAtLevel: 50, icon: 'award' },
    { id: 'cosmic_string_weaver', name: 'Cosmic String Weaver', desc: 'Dệt các sợi dây vũ trụ để rung động toàn thể thực tại.', baseCost: 2200000000000000000, costMultiplier: 1.08, level: 0, baseEffect: 250000000000, effectType: 'cps', unlockedAtLevel: 55, icon: 'activity' },
    { id: 'multiverse_gateway', name: 'Multiverse Gateway', desc: 'Cổng đa vũ trụ nối liền 100 thực tại song song cùng khai thác.', baseCost: 20000000000000000000, costMultiplier: 1.08, level: 0, baseEffect: 2200000000000, effectType: 'cps', unlockedAtLevel: 60, icon: 'share-2' },
    { id: 'infinity_prism', name: 'Infinity Prism', desc: 'Lăng kính vô cực khúc xạ ánh sáng nguyên sơ thành thực tại thuần khiết.', baseCost: 180000000000000000000, costMultiplier: 1.07, level: 0, baseEffect: 6500000, effectType: 'click', unlockedAtLevel: 65, icon: 'triangle' },
    { id: 'entropy_nullifier', name: 'Entropy Nullifier', desc: 'Bộ triệt tiêu nhiệt dịch entropy đảo ngược quy luật tàn lụi vũ trụ.', baseCost: 1600000000000000000000, costMultiplier: 1.07, level: 0, baseEffect: 21000000000000, effectType: 'cps', unlockedAtLevel: 70, icon: 'anchor' },
    { id: 'primordial_crucible', name: 'Primordial Crucible', desc: 'Vạc nung nguyên thuỷ nấu chảy các vì sao tạo thành bản chất Nexyroth.', baseCost: 15000000000000000000000, costMultiplier: 1.07, level: 0, baseEffect: 195000000000000, effectType: 'cps', unlockedAtLevel: 75, icon: 'coffee' },
    { id: 'genesis_conduit', name: 'Genesis Conduit', desc: 'Đường dẫn sáng thế truyền sức mạnh từ thời khắc Big Bang.', baseCost: 140000000000000000000000, costMultiplier: 1.07, level: 0, baseEffect: 50000000, effectType: 'click', unlockedAtLevel: 80, icon: 'cpu' },
    // 15 Additional Upgrades (total 41)
    { id: 'celestial_foundry', name: 'Celestial Foundry', desc: 'Lò đúc thiên thần tạo tác các khối tinh thể thần thánh.', baseCost: 1300000000000000000000000, costMultiplier: 1.07, level: 0, baseEffect: 1800000000000000, effectType: 'cps', unlockedAtLevel: 82, icon: 'layers' },
    { id: 'omniversal_tether', name: 'Omniversal Tether', desc: 'Dây thừng toàn năng liên kết mọi chiều không gian.', baseCost: 12000000000000000000000000, costMultiplier: 1.07, level: 0, baseEffect: 170000000, effectType: 'click', unlockedAtLevel: 84, icon: 'link' },
    { id: 'eternity_furnace', name: 'Eternity Furnace', desc: 'Lò thiêu vĩnh cửu đốt cháy thời gian để tạo năng lượng bất tận.', baseCost: 110000000000000000000000000, costMultiplier: 1.06, level: 0, baseEffect: 16500000000000000, effectType: 'cps', unlockedAtLevel: 86, icon: 'zap' },
    { id: 'astral_monarch_throne', name: 'Throne of the Void King', desc: 'Ngai vàng chúa tể hư không tập trung quyền năng thống trị muôn loài.', baseCost: 1000000000000000000000000000, costMultiplier: 1.06, level: 0, baseEffect: 1500000000, effectType: 'click', unlockedAtLevel: 88, icon: 'shield' },
    { id: 'void_god_temple', name: 'Void Deity Temple', desc: 'Đền thờ thần hư không nơi các tín đồ dâng hiến linh hồn.', baseCost: 90000000000000000000000000000, costMultiplier: 1.06, level: 0, baseEffect: 155000000000000000, effectType: 'cps', unlockedAtLevel: 90, icon: 'home' },
    { id: 'astral_hyperdrive', name: 'Astral Hyperdrive', desc: 'Bộ siêu dẫn truyền tải tức thời qua các cõi hư vô.', baseCost: 850000000000000000000000000000, costMultiplier: 1.06, level: 0, baseEffect: 1400000000000000000, effectType: 'cps', unlockedAtLevel: 92, icon: 'wind' },
    { id: 'chrono_collapse_device', name: 'Chrono Collapse Device', desc: 'Thiết bị sụp đổ thời gian nén 1 triệu năm vào 1 giây.', baseCost: 8000000000000000000000000000000, costMultiplier: 1.06, level: 0, baseEffect: 12000000000, effectType: 'click', unlockedAtLevel: 94, icon: 'clock' },
    { id: 'divine_light_beacon', name: 'Divine Light Beacon', desc: 'Ngọn hải đăng ánh sáng thần thánh xua tan bóng tối muôn đời.', baseCost: 75000000000000000000000000000000, costMultiplier: 1.05, level: 0, baseEffect: 13000000000000000000, effectType: 'cps', unlockedAtLevel: 96, icon: 'sun' },
    { id: 'seraphim_sanctuary', name: 'Seraphim Sanctuary', desc: 'Thánh địa hộ vệ lục dực đại thiên thần ban phước lành.', baseCost: 700000000000000000000000000000000, costMultiplier: 1.05, level: 0, baseEffect: 120000000000000000000, effectType: 'cps', unlockedAtLevel: 98, icon: 'heart' },
    { id: 'celestial_zenith', name: 'Celestial Zenith', desc: 'Đỉnh cao thiên giới hội tụ muôn vàn quy luật vũ trụ.', baseCost: 6500000000000000000000000000000000, costMultiplier: 1.05, level: 0, baseEffect: 95000000000, effectType: 'click', unlockedAtLevel: 100, icon: 'star' },
    { id: 'nirvana_spire', name: 'Nirvana Spire', desc: 'Ngọn tháp Niết Bàn siêu việt mọi khổ đau và giới hạn tồn tại.', baseCost: 60000000000000000000000000000000000, costMultiplier: 1.05, level: 0, baseEffect: 1100000000000000000000, effectType: 'cps', unlockedAtLevel: 102, icon: 'compass' },
    { id: 'endless_dominion', name: 'Endless Dominion', desc: 'Lãnh thổ vô tận của bậc chí tôn toàn tri toàn năng.', baseCost: 550000000000000000000000000000000000, costMultiplier: 1.05, level: 0, baseEffect: 10000000000000000000000, effectType: 'cps', unlockedAtLevel: 105, icon: 'map' },
    { id: 'primordial_click_core', name: 'Click of Creation', desc: 'Cú chạm tạo tác mở ra toàn thể đa thực tại mới.', baseCost: 5000000000000000000000000000000000000, costMultiplier: 1.05, level: 0, baseEffect: 850000000000, effectType: 'click', unlockedAtLevel: 108, icon: 'zap' },
    { id: 'omega_singularity', name: 'Omega Singularity', desc: 'Điểm kỳ dị Omega hợp nhất mọi nguồn năng lượng vào hư vô tuyệt đối.', baseCost: 45000000000000000000000000000000000000, costMultiplier: 1.05, level: 0, baseEffect: 95000000000000000000000, effectType: 'cps', unlockedAtLevel: 110, icon: 'radio' },
    { id: 'nexyroth_sovereign', name: 'Nexyroth Sovereign God', desc: 'Sự thức tỉnh hoàn toàn của Nexyroth - Đấng Tối Thượng Vũ Trụ!', baseCost: 400000000000000000000000000000000000000, costMultiplier: 1.04, level: 0, baseEffect: 900000000000000000000000, effectType: 'cps', unlockedAtLevel: 115, icon: 'crown' }
  ];

  // 4 Constellation Branches Radiating from Central Astral Core (16 Nodes Total)
  const DEFAULT_SKILLS = [
    // 0. Core Node (Gốc Khởi Nguyên)
    {
      id: 'core',
      name: 'Astral Core',
      nameVi: 'Trái Tim Tinh Vân',
      branch: 'core',
      branchNameVi: 'Lõi Tinh Vân',
      x: 50, y: 50,
      requires: [],
      maxLevel: 1,
      costPoints: 0,
      unlocked: true,
      level: 1,
      icon: 'core',
      descVi: 'Trái tim của hệ thống Tinh Vân. Cội nguồn liên kết mọi chòm sao vũ trụ.',
      descEn: 'The Astral Core. Center and origin of all cosmic constellations.',
      effectType: 'core',
      effectPerLevel: 0
    },

    // 1. Nhánh 1: Chrono & Automation (Thời Gian & Tốc Độ - West / Trái)
    {
      id: 'chrono_pulse',
      name: 'Astral Pulse',
      nameVi: 'Xung Nhịp Astral',
      branch: 'chrono',
      branchNameVi: 'Chrono & Tốc Độ',
      x: 35, y: 50,
      requires: ['core'],
      maxLevel: 5,
      costPoints: 1,
      unlocked: false,
      level: 0,
      icon: 'zap',
      descVi: 'Tăng +10% sản lượng CPS tự động mỗi cấp.',
      descEn: '+10% passive CPS per level.',
      effectType: 'cps',
      effectPerLevel: 0.10
    },
    {
      id: 'chrono_warp',
      name: 'Time Warp',
      nameVi: 'Gia Tốc Thời Gian',
      branch: 'chrono',
      branchNameVi: 'Chrono & Tốc Độ',
      x: 23, y: 38,
      requires: ['chrono_pulse'],
      maxLevel: 3,
      costPoints: 2,
      unlocked: false,
      level: 0,
      icon: 'clock',
      descVi: 'Tăng tốc độ bấm tự động thêm +15% mỗi cấp.',
      descEn: '+15% auto-click speed per level.',
      effectType: 'autoSpeed',
      effectPerLevel: 0.15
    },
    {
      id: 'chrono_overclock',
      name: 'Overclock Engine',
      nameVi: 'Động Cơ Quá Tải',
      branch: 'chrono',
      branchNameVi: 'Chrono & Tốc Độ',
      x: 23, y: 62,
      requires: ['chrono_pulse'],
      maxLevel: 2,
      costPoints: 3,
      unlocked: false,
      level: 0,
      icon: 'activity',
      descVi: 'Tăng +25% thời lượng duy trì các bùa lợi và tăng tốc Lõi.',
      descEn: '+25% buff duration and core overclock.',
      effectType: 'buffDuration',
      effectPerLevel: 0.25
    },
    {
      id: 'chrono_infinity',
      name: 'Chronos Infinity',
      nameVi: 'Vô Hạn Thời Gian (Capstone)',
      branch: 'chrono',
      branchNameVi: 'Chrono & Tốc Độ',
      x: 10, y: 50,
      requires: ['chrono_warp', 'chrono_overclock'],
      maxLevel: 1,
      costPoints: 5,
      unlocked: false,
      level: 0,
      icon: 'hourglass',
      descVi: 'Giảm 50% thời gian hồi chiêu của toàn bộ kỹ năng kích hoạt (Overload, Surge, Warp).',
      descEn: 'Reduce cooldowns of all active abilities by 50%.',
      effectType: 'cooldown',
      effectPerLevel: 0.50
    },

    // 2. Nhánh 2: Dimensional Crits (Bạo Kích & Sát Thương - East / Phải)
    {
      id: 'crit_focus',
      name: 'Starlight Focus',
      nameVi: 'Tiêu Điểm Tinh Tú',
      branch: 'crit',
      branchNameVi: 'Dimensional Crits',
      x: 65, y: 50,
      requires: ['core'],
      maxLevel: 3,
      costPoints: 1,
      unlocked: false,
      level: 0,
      icon: 'crosshair',
      descVi: 'Tăng +5% Tỉ lệ Bạo Kích (Crit Chance) mỗi cấp.',
      descEn: '+5% Critical Strike Chance per level.',
      effectType: 'critChance',
      effectPerLevel: 0.05
    },
    {
      id: 'crit_supernova',
      name: 'Supernova Burst',
      nameVi: 'Bùng Nổ Siêu Tân Tinh',
      branch: 'crit',
      branchNameVi: 'Dimensional Crits',
      x: 77, y: 38,
      requires: ['crit_focus'],
      maxLevel: 3,
      costPoints: 2,
      unlocked: false,
      level: 0,
      icon: 'flame',
      descVi: 'Tăng +100% Sát thương Bạo Kích (Crit Damage) mỗi cấp.',
      descEn: '+100% Critical Damage per level.',
      effectType: 'critDamage',
      effectPerLevel: 1.00
    },
    {
      id: 'crit_chain',
      name: 'Chain Reaction',
      nameVi: 'Phản Ứng Dây Chuyền',
      branch: 'crit',
      branchNameVi: 'Dimensional Crits',
      x: 77, y: 62,
      requires: ['crit_focus'],
      maxLevel: 2,
      costPoints: 3,
      unlocked: false,
      level: 0,
      icon: 'disc',
      descVi: 'Mỗi cú Click Bạo Kích gây thêm +35% sát thương và tăng tiến trình combo.',
      descEn: 'Critical clicks deal +35% bonus damage and build combo.',
      effectType: 'clickPower',
      effectPerLevel: 0.35
    },
    {
      id: 'crit_collapse',
      name: 'Singularity Collapse',
      nameVi: 'Sụp Đổ Kỳ Dị (Capstone)',
      branch: 'crit',
      branchNameVi: 'Dimensional Crits',
      x: 90, y: 50,
      requires: ['crit_supernova', 'crit_chain'],
      maxLevel: 1,
      costPoints: 5,
      unlocked: false,
      level: 0,
      icon: 'sun',
      descVi: 'Mọi cú Click Bạo Kích đều nhân x2 lượng tài nguyên Năng Lượng thu được từ toàn bộ nguồn.',
      descEn: 'All Critical Clicks double (x2) total Essence harvested.',
      effectType: 'critMultiplier',
      effectPerLevel: 2.00
    },

    // 3. Nhánh 3: Cosmic Fortune (Tài Nguyên & May Mắn - South / Dưới)
    {
      id: 'fortune_dust',
      name: 'Star Dust Collector',
      nameVi: 'Máy Gom Bụi Sao',
      branch: 'fortune',
      branchNameVi: 'Cosmic Fortune',
      x: 50, y: 65,
      requires: ['core'],
      maxLevel: 3,
      costPoints: 1,
      unlocked: false,
      level: 0,
      icon: 'cloud-lightning',
      descVi: 'Tăng +20% lượng Astral Shards nhận được khi Thăng Thiên / Trùng Sinh mỗi cấp.',
      descEn: '+20% Astral Shards from Ascension per level.',
      effectType: 'shardBonus',
      effectPerLevel: 0.20
    },
    {
      id: 'fortune_meteor',
      name: 'Meteor Shower',
      nameVi: 'Mưa Sao Băng',
      branch: 'fortune',
      branchNameVi: 'Cosmic Fortune',
      x: 39, y: 77,
      requires: ['fortune_dust'],
      maxLevel: 3,
      costPoints: 2,
      unlocked: false,
      level: 0,
      icon: 'sparkles',
      descVi: 'Tăng tần suất xuất hiện của Sao Băng và Khe Nứt Vũ Trụ thêm +30% mỗi cấp.',
      descEn: '+30% Meteor & Cosmic Rift spawn rate per level.',
      effectType: 'eventFreq',
      effectPerLevel: 0.30
    },
    {
      id: 'fortune_idle',
      name: 'Deep Space Idle',
      nameVi: 'Treo Máy Không Gian',
      branch: 'fortune',
      branchNameVi: 'Cosmic Fortune',
      x: 61, y: 77,
      requires: ['fortune_dust'],
      maxLevel: 2,
      costPoints: 3,
      unlocked: false,
      level: 0,
      icon: 'moon',
      descVi: 'Tăng sản lượng thu thập ngoại tuyến / AFK thêm +50% mỗi cấp.',
      descEn: '+50% Offline/AFK collection efficiency per level.',
      effectType: 'offlineEff',
      effectPerLevel: 0.50
    },
    {
      id: 'fortune_market',
      name: 'Galaxy Black Market',
      nameVi: 'Chợ Đen Thiên Hà (Capstone)',
      branch: 'fortune',
      branchNameVi: 'Cosmic Fortune',
      x: 50, y: 89,
      requires: ['fortune_meteor', 'fortune_idle'],
      maxLevel: 1,
      costPoints: 5,
      unlocked: false,
      level: 0,
      icon: 'coins',
      descVi: 'Giảm 15% giá mua tất cả các công trình nâng cấp trong trạm vũ trụ.',
      descEn: 'Reduces cost of all core Upgrades by 15%.',
      effectType: 'costDiscount',
      effectPerLevel: 0.15
    },

    // 4. Nhánh 4: Cosmic Overdrive (Nhánh Tối Thượng - North / Trên)
    {
      id: 'overdrive_synergy',
      name: 'Dark Matter Synergy',
      nameVi: 'Hợp Lực Vật Chất Tối',
      branch: 'overdrive',
      branchNameVi: 'Cosmic Overdrive',
      x: 41, y: 35,
      requires: ['core'],
      maxLevel: 5,
      costPoints: 2,
      unlocked: false,
      level: 0,
      icon: 'atom',
      descVi: 'Mỗi điểm SP chưa sử dụng sẽ tự động tăng +1% tổng sản lượng CPS mỗi cấp.',
      descEn: 'Each unspent SP automatically boosts total CPS by +1% per level.',
      effectType: 'spSynergy',
      effectPerLevel: 0.01
    },
    {
      id: 'overdrive_horizon',
      name: 'Event Horizon',
      nameVi: 'Chân Trời Sự Kiện',
      branch: 'overdrive',
      branchNameVi: 'Cosmic Overdrive',
      x: 59, y: 35,
      requires: ['core'],
      maxLevel: 1,
      costPoints: 4,
      unlocked: false,
      level: 0,
      icon: 'portal',
      descVi: 'Mỗi khi kích hoạt kỹ năng, tăng thêm +50% sản lượng toàn diện trong 30 giây.',
      descEn: 'Triggering skills boosts all production by +50% for 30s.',
      effectType: 'skillSurge',
      effectPerLevel: 0.50
    },
    {
      id: 'overdrive_zenith',
      name: 'Cosmic Zenith',
      nameVi: 'Thiên Đỉnh Vô Hạn',
      branch: 'overdrive',
      branchNameVi: 'Cosmic Overdrive',
      x: 50, y: 17,
      requires: ['overdrive_synergy', 'overdrive_horizon'],
      maxLevel: 999, // Infinite
      costPoints: 3,
      unlocked: false,
      level: 0,
      isInfinite: true,
      icon: 'crown',
      descVi: 'Mỗi cấp tăng thêm +5% cho toàn bộ Click Power, CPS, Crit và May Mắn. Nâng cấp vô hạn!',
      descEn: '+5% to all Click, CPS, Crit and Luck per level. Infinite leveling!',
      effectType: 'allZenith',
      effectPerLevel: 0.05
    }
  ];

  // 27 Total Relics (equipped limit 4)
  const DEFAULT_RELICS = [
    { id: 'relic_eye', name: 'Eye of the Astral Seer', rarity: 'rare', effectDesc: '+15% Direct Click Power and +5% Critical Chance', equipped: true, clickBonus: 0.15, cpsBonus: 0, critBonus: 0.05, icon: 'eye' },
    { id: 'relic_hourglass', name: 'Hourglass of Infinity', rarity: 'epic', effectDesc: '+25% Passive Cosmic Generation (CPS)', equipped: true, clickBonus: 0, cpsBonus: 0.25, critBonus: 0, icon: 'hourglass' },
    { id: 'relic_heart', name: 'Heart of Nexyroth', rarity: 'legendary', effectDesc: '+40% Direct Click and +40% Passive CPS', equipped: false, clickBonus: 0.40, cpsBonus: 0.40, critBonus: 0.1, icon: 'heart' },
    // 3 New Relics from v8.1
    { id: 'relic_giant_hammer', name: 'Búa Chiến Người Khổng Lồ', rarity: 'legendary', effectDesc: '+50% Sát Thương Lên Boss Khủng', equipped: false, clickBonus: 0.10, cpsBonus: 0, critBonus: 0, bossDamageBonus: 0.50, icon: 'hammer' },
    { id: 'relic_lucky_coin', name: 'Đồng Xu May Mắn', rarity: 'epic', effectDesc: '+25% Tỉ Lệ Rơi Kim Cương (Gems)', equipped: false, clickBonus: 0, cpsBonus: 0, critBonus: 0, gemDropBonus: 0.25, icon: 'coins' },
    { id: 'relic_treasure_radar', name: 'Radar Dò Kho Báu', rarity: 'rare', effectDesc: '+30% Tỉ Lệ Rơi Item & Thuốc Quý', equipped: false, clickBonus: 0, cpsBonus: 0, critBonus: 0, itemDropBonus: 0.30, icon: 'compass' },
    // 21 Additional Diverse Relics
    { id: 'relic_void_crown', name: 'Vương Miện Hư Không', rarity: 'epic', effectDesc: '+30% Click Power và +10% Boss Damage', equipped: false, clickBonus: 0.30, cpsBonus: 0, critBonus: 0.03, bossDamageBonus: 0.10, icon: 'crown' },
    { id: 'relic_starlight_boots', name: 'Hài Tinh Tú', rarity: 'rare', effectDesc: '+20% CPS và +10% Offline Earnings', equipped: false, clickBonus: 0, cpsBonus: 0.20, critBonus: 0, offlineBonus: 0.10, icon: 'feather' },
    { id: 'relic_eclipse_amulet', name: 'Bùa Nhật Thực', rarity: 'epic', effectDesc: '+8% Crit Chance và +35% Crit Damage', equipped: false, clickBonus: 0.05, cpsBonus: 0.05, critBonus: 0.08, icon: 'moon' },
    { id: 'relic_singularity_ring', name: 'Nhẫn Điểm Kỳ Dị', rarity: 'mythic', effectDesc: '+50% Click Power và +50% CPS', equipped: false, clickBonus: 0.50, cpsBonus: 0.50, critBonus: 0.05, icon: 'disc' },
    { id: 'relic_nebula_cloak', name: 'Áo Choàng Tinh Vân', rarity: 'rare', effectDesc: '+25% CPS và +15% Item Drop', equipped: false, clickBonus: 0, cpsBonus: 0.25, critBonus: 0, itemDropBonus: 0.15, icon: 'shield' },
    { id: 'relic_ancient_tome', name: 'Sách Cổ Khe Nứt', rarity: 'epic', effectDesc: '+20% Tất Cả Thuốc và +20% Shards', equipped: false, clickBonus: 0.15, cpsBonus: 0.15, critBonus: 0.02, icon: 'book' },
    { id: 'relic_divine_orb', name: 'Quả Cầu Ánh Sáng Thần', rarity: 'legendary', effectDesc: '+45% Boss Damage và +20% Gem Drop', equipped: false, clickBonus: 0.20, cpsBonus: 0.20, critBonus: 0.05, bossDamageBonus: 0.45, gemDropBonus: 0.20, icon: 'sun' },
    { id: 'relic_shadow_blade', name: 'Hắc Ma Đao', rarity: 'epic', effectDesc: '+35% Click Power và +30% Boss Damage', equipped: false, clickBonus: 0.35, cpsBonus: 0, critBonus: 0.05, bossDamageBonus: 0.30, icon: 'crosshair' },
    { id: 'relic_celestial_compass', name: 'La Bàn Thiên Hà', rarity: 'rare', effectDesc: '+15% CPS và +15% Offline Efficiency', equipped: false, clickBonus: 0, cpsBonus: 0.15, critBonus: 0, offlineBonus: 0.15, icon: 'compass' },
    { id: 'relic_phoenix_feather', name: 'Lông Phượng Hoàng Tinh Tú', rarity: 'legendary', effectDesc: '+30% CPS và tự động tích luỹ năng lượng', equipped: false, clickBonus: 0.10, cpsBonus: 0.30, critBonus: 0.04, icon: 'wind' },
    { id: 'relic_dragon_scale', name: 'Vảy Rồng Hư Không', rarity: 'legendary', effectDesc: '+40% Sát Thương Boss và +15% Click', equipped: false, clickBonus: 0.15, cpsBonus: 0, critBonus: 0.06, bossDamageBonus: 0.40, icon: 'shield' },
    { id: 'relic_chrono_crystal', name: 'Pha Lê Thời Gian', rarity: 'epic', effectDesc: '+25% Thời Lượng Buff và +20% CPS', equipped: false, clickBonus: 0, cpsBonus: 0.20, critBonus: 0.03, icon: 'clock' },
    { id: 'relic_abyssal_mirror', name: 'Gương Phản Chiếu Vực Thẳm', rarity: 'rare', effectDesc: '+20% Click Power và +10% Crit Chance', equipped: false, clickBonus: 0.20, cpsBonus: 0, critBonus: 0.10, icon: 'layers' },
    { id: 'relic_cosmic_dice', name: 'Xúc Xắc Vận Mệnh', rarity: 'epic', effectDesc: '+20% Gem Drop và +20% Item Drop', equipped: false, clickBonus: 0.05, cpsBonus: 0.05, critBonus: 0.02, gemDropBonus: 0.20, itemDropBonus: 0.20, icon: 'box' },
    { id: 'relic_primordial_bell', name: 'Chuông Ngân Nguyên Thuỷ', rarity: 'legendary', effectDesc: '+35% Toàn Bộ Thu Hoạch và +15% Shards', equipped: false, clickBonus: 0.35, cpsBonus: 0.35, critBonus: 0.05, icon: 'bell' },
    { id: 'relic_eternity_chain', name: 'Xích Vĩnh Cửu', rarity: 'rare', effectDesc: '+18% Boss Damage và +15% CPS', equipped: false, clickBonus: 0, cpsBonus: 0.15, critBonus: 0.02, bossDamageBonus: 0.18, icon: 'link' },
    { id: 'relic_quasar_core', name: 'Lõi Quasar', rarity: 'mythic', effectDesc: '+60% CPS và +40% Click Power', equipped: false, clickBonus: 0.40, cpsBonus: 0.60, critBonus: 0.08, icon: 'sun' },
    { id: 'relic_spirit_flute', name: 'Sáo Tinh Linh', rarity: 'rare', effectDesc: '+15% Tốc Độ EXP và +15% CPS', equipped: false, clickBonus: 0, cpsBonus: 0.15, critBonus: 0.02, icon: 'music' },
    { id: 'relic_nirvana_lotus', name: 'Hoa Sen Niết Bàn', rarity: 'mythic', effectDesc: '+70% Sản Lượng và +50% Boss Damage Tối Cường', equipped: false, clickBonus: 0.70, cpsBonus: 0.70, critBonus: 0.10, bossDamageBonus: 0.50, icon: 'flower' },
    { id: 'relic_astral_monolith', name: 'Bản Đồ Thiên Cương', rarity: 'epic', effectDesc: '+30% Offline Earnings và +20% Click Power', equipped: false, clickBonus: 0.20, cpsBonus: 0, critBonus: 0.03, offlineBonus: 0.30, icon: 'map' },
    { id: 'relic_sovereign_ring', name: 'Nhẫn Chúa Tể Nexyroth', rarity: 'mythic', effectDesc: '+100% Sức Mạnh Toàn Diện và +100% Sát Thương Boss', equipped: false, clickBonus: 1.0, cpsBonus: 1.0, critBonus: 0.15, bossDamageBonus: 1.0, icon: 'award' }
  ];

  // 35 Achievements with Real Buffs (+0.5% per achievement = +17.5% total)
  // Rebalanced: Gems are precious premium currency (1-5 gems per achievement)
  const DEFAULT_ACHIEVEMENTS = [
    { id: 'clicks_100', name: 'Tia Lửa Thức Tỉnh', desc: 'Bấm Lõi Nexyroth 100 lần.', unlocked: false, rewardGems: 1, current: 0, target: 100, type: 'clicks' },
    { id: 'clicks_1000', name: 'Nhịp Đập Hư Không', desc: 'Bấm Lõi Nexyroth 1,000 lần.', unlocked: false, rewardGems: 2, current: 0, target: 1000, type: 'clicks' },
    { id: 'clicks_5000', name: 'Bàn Tay Tinh Tú', desc: 'Bấm Lõi Nexyroth 5,000 lần.', unlocked: false, rewardGems: 3, current: 0, target: 5000, type: 'clicks' },
    { id: 'clicks_25000', name: 'Thần Bấm Vực Thẳm', desc: 'Bấm Lõi Nexyroth 25,000 lần.', unlocked: false, rewardGems: 4, current: 0, target: 25000, type: 'clicks' },
    { id: 'clicks_100k', name: 'Clicker Vô Tận', desc: 'Bấm Lõi Nexyroth 100,000 lần.', unlocked: false, rewardGems: 6, current: 0, target: 100000, type: 'clicks' },

    { id: 'essence_10k', name: 'Người Thu Bụi Sao', desc: 'Tích luỹ tổng cộng 10,000 Năng Lượng.', unlocked: false, rewardGems: 1, current: 0, target: 10000, type: 'essence' },
    { id: 'essence_1m', name: 'Đại Gia Astral', desc: 'Tích luỹ tổng cộng 1,000,000 Năng Lượng.', unlocked: false, rewardGems: 2, current: 0, target: 1000000, type: 'essence' },
    { id: 'essence_100m', name: 'Nguyên Khí Tinh Vân', desc: 'Tích luỹ tổng cộng 100,000,000 Năng Lượng.', unlocked: false, rewardGems: 3, current: 0, target: 100000000, type: 'essence' },
    { id: 'essence_10b', name: 'Chúa Tể Thiên Hà', desc: 'Tích luỹ tổng cộng 10 Tỷ Năng Lượng.', unlocked: false, rewardGems: 4, current: 0, target: 10000000000, type: 'essence' },
    { id: 'essence_1t', name: 'Kho Báu Vô Hạn', desc: 'Tích luỹ tổng cộng 1 Nghìn Tỷ Năng Lượng.', unlocked: false, rewardGems: 6, current: 0, target: 1000000000000, type: 'essence' },

    { id: 'level_5', name: 'Bước Chân Đầu Tiên', desc: 'Đạt Cấp độ người chơi 5.', unlocked: false, rewardGems: 1, current: 1, target: 5, type: 'level' },
    { id: 'level_10', name: 'Học Đồ Phi Thăng', desc: 'Đạt Cấp độ người chơi 10.', unlocked: false, rewardGems: 2, current: 1, target: 10, type: 'level' },
    { id: 'level_25', name: 'Cao Thủ Vũ Trụ', desc: 'Đạt Cấp độ người chơi 25.', unlocked: false, rewardGems: 3, current: 1, target: 25, type: 'level' },
    { id: 'level_50', name: 'Đại Tông Sư Tinh Không', desc: 'Đạt Cấp độ người chơi 50.', unlocked: false, rewardGems: 4, current: 1, target: 50, type: 'level' },
    { id: 'level_100', name: 'Bậc Thầy Tối Cao', desc: 'Đạt Cấp độ người chơi 100.', unlocked: false, rewardGems: 8, current: 1, target: 100, type: 'level' },

    { id: 'boss_1', name: 'Dũng Sĩ Diệt Titan', desc: 'Hạ gục Boss đầu tiên trong Đấu Trường.', unlocked: false, rewardGems: 2, current: 0, target: 1, type: 'bosses' },
    { id: 'boss_5', name: 'Thợ Săn Quái Thú', desc: 'Hạ gục 5 Boss trong Đấu Trường.', unlocked: false, rewardGems: 3, current: 0, target: 5, type: 'bosses' },
    { id: 'boss_15', name: 'Chiến Binh Bất Bại', desc: 'Hạ gục 15 Boss trong Đấu Trường.', unlocked: false, rewardGems: 4, current: 0, target: 15, type: 'bosses' },
    { id: 'boss_30', name: 'Kẻ Huỷ Diệt Trùm', desc: 'Hạ gục 30 Boss trong Đấu Trường.', unlocked: false, rewardGems: 6, current: 0, target: 30, type: 'bosses' },
    { id: 'boss_daily', name: 'Thợ Săn Boss Ngày', desc: 'Hạ gục một 👑 Boss Ngày hiếm có.', unlocked: false, rewardGems: 5, current: 0, target: 1, type: 'boss_daily' },

    { id: 'crits_50', name: 'Điểm Huyệt Chính Xác', desc: 'Gây ra 50 cú đánh Chí Mạng.', unlocked: false, rewardGems: 1, current: 0, target: 50, type: 'crits' },
    { id: 'crits_500', name: 'Bão Táp Chí Mạng', desc: 'Gây ra 500 cú đánh Chí Mạng.', unlocked: false, rewardGems: 2, current: 0, target: 500, type: 'crits' },
    { id: 'crits_5000', name: 'Tử Thần Đoạt Mệnh', desc: 'Gây ra 5,000 cú đánh Chí Mạng.', unlocked: false, rewardGems: 4, current: 0, target: 5000, type: 'crits' },

    { id: 'upgrades_20', name: 'Nhà Xây Dựng Tinh Cầu', desc: 'Mua 20 lượt nâng cấp.', unlocked: false, rewardGems: 1, current: 0, target: 20, type: 'upgrades' },
    { id: 'upgrades_100', name: 'Công Trình Đa Tầng', desc: 'Mua 100 lượt nâng cấp.', unlocked: false, rewardGems: 2, current: 0, target: 100, type: 'upgrades' },
    { id: 'upgrades_500', name: 'Kỳ Quan Cơ Khí', desc: 'Mua 500 lượt nâng cấp.', unlocked: false, rewardGems: 4, current: 0, target: 500, type: 'upgrades' },

    { id: 'prestige_1', name: 'Vòng Lặp Luân Hồi', desc: 'Thực hiện Tái Sinh (Ascension) lần đầu.', unlocked: false, rewardGems: 2, current: 0, target: 1, type: 'prestige' },
    { id: 'prestige_3', name: 'Khai Mở Vực Thẳm', desc: 'Thực hiện Thăng Thiên 3 lần (mở Thế Giới 3).', unlocked: false, rewardGems: 4, current: 0, target: 3, type: 'prestige' },
    { id: 'prestige_6', name: 'Thiên Giới Giáng Thế', desc: 'Thực hiện Thăng Thiên 6 lần (mở Thế Giới 4: Thiên Giới Vĩnh Hằng).', unlocked: false, rewardGems: 6, current: 0, target: 6, type: 'prestige' },

    { id: 'potions_10', name: 'Nhà Giả Kim Vũ Trụ', desc: 'Sử dụng 10 bình thuốc tăng cường.', unlocked: false, rewardGems: 2, current: 0, target: 10, type: 'potions_used' },
    { id: 'potions_x100', name: 'Chúa Tể Năng Lượng x100', desc: 'Kích hoạt bình thuốc Chúa Tể Vũ Trụ x100.', unlocked: false, rewardGems: 5, current: 0, target: 1, type: 'potion_x100' },

    { id: 'skills_5', name: 'Nhà Chiêm Tinh Học', desc: 'Mở khoá 5 kỹ năng trong Cây Chòm Sao.', unlocked: false, rewardGems: 2, current: 0, target: 5, type: 'skills_unlocked' },
    { id: 'skills_luck_branch', name: 'Ngôi Sao May Mắn', desc: 'Mở khoá nhánh kỹ năng 🍀 Vận May.', unlocked: false, rewardGems: 3, current: 0, target: 1, type: 'luck_branch' },
    { id: 'relics_4_equipped', name: 'Vũ Trang Tối Cường', desc: 'Trang bị đủ 4 Cổ Vật trên người cùng lúc.', unlocked: false, rewardGems: 3, current: 0, target: 4, type: 'relics_equipped' },
    { id: 'all_achievements', name: 'Huyền Thoại Nexyroth', desc: 'Mở khóa 30 thành tựu trở lên.', unlocked: false, rewardGems: 15, current: 0, target: 30, type: 'achievements_count' }
  ];

  const DEFAULT_GEM_SHOP_ITEMS = [
    { id: 'gem_mult_1', name: 'Void Surge Prism', desc: 'Permanently doubles (x2) all Essence generation across all runs.', costGems: 40, purchased: false, value: 2 },
    { id: 'gem_auto_click', name: 'Astral Drone', desc: 'Automatically clicks Core 5 times/sec continuously.', costGems: 60, purchased: false, value: 5 },
    { id: 'gem_offline_boost', name: 'Stasis Chamber', desc: 'Offline progress efficiency boosted to 100% full speed.', costGems: 50, purchased: false, value: 1 },
    { id: 'gem_crit_overload', name: 'Astral Supernova', desc: 'Permanently boosts Critical Strike Chance by +10% and Power by +200%.', costGems: 70, purchased: false, value: 0.1 }
  ];

  const POTION_METADATA = [
    {
      id: 'potion_auto_50ms',
      type: 'auto_50ms',
      nameVi: 'Thuốc Auto-Click Tinh Tú 50ms',
      nameEn: 'Hyper-Clicker Potion (50ms)',
      icon: '⚡',
      duration: 300,
      costGems: 15,
      descVi: 'Tự động bấm Lõi 20 lần/giây (50ms/lần) trong 5 phút. Dùng 2 lần cộng dồn thời gian!',
      descEn: 'Automatically clicks Core every 50ms (20 clicks/sec) for 5 mins. Stacks duration!'
    },
    {
      id: 'potion_x2',
      type: 'x2',
      multiplier: 2,
      nameVi: 'Thuốc Năng Lượng x2',
      nameEn: 'Cosmic Elixir x2',
      icon: '🧪',
      duration: 300,
      costGems: 5,
      descVi: 'Nhân x2 sản lượng trong 5 phút. Dùng 2 lần cộng dồn thời gian. Dùng cùng thuốc khác sẽ cộng dồn (VD: 2+50=52)!',
      descEn: 'x2 Essence for 5 mins. Stacks duration. Adds with other potions (e.g. 2+50=52)!'
    },
    {
      id: 'potion_x5',
      type: 'x5',
      multiplier: 5,
      nameVi: 'Thuốc Năng Lượng x5',
      nameEn: 'Astral Elixir x5',
      icon: '🧪',
      duration: 300,
      costGems: 12,
      descVi: 'Nhân x5 sản lượng trong 5 phút. Dùng 2 lần cộng dồn thời gian. Cộng dồn với thuốc khác!',
      descEn: 'x5 Essence for 5 mins. Stacks duration. Adds with other potions!'
    },
    {
      id: 'potion_x10',
      type: 'x10',
      multiplier: 10,
      nameVi: 'Thuốc Năng Lượng x10',
      nameEn: 'Dimensional Elixir x10',
      icon: '🧪',
      duration: 300,
      costGems: 20,
      descVi: 'Nhân x10 sản lượng trong 5 phút. Dùng 2 lần cộng dồn thời gian. Cộng dồn với thuốc khác!',
      descEn: 'x10 Essence for 5 mins. Stacks duration. Adds with other potions!'
    },
    {
      id: 'potion_x20',
      type: 'x20',
      multiplier: 20,
      nameVi: 'Thuốc Năng Lượng x20',
      nameEn: 'Void Rift Elixir x20',
      icon: '⚗️',
      duration: 300,
      costGems: 35,
      descVi: 'Nhân x20 sản lượng trong 5 phút. Dùng 2 lần cộng dồn thời gian. Cộng dồn với thuốc khác!',
      descEn: 'x20 Essence for 5 mins. Stacks duration. Adds with other potions!'
    },
    {
      id: 'potion_x50',
      type: 'x50',
      multiplier: 50,
      nameVi: 'Thuốc Năng Lượng x50',
      nameEn: 'Singularity Elixir x50',
      icon: '✨',
      duration: 300,
      costGems: 75,
      descVi: 'Nhân x50 sản lượng trong 5 phút. Dùng 2 lần cộng dồn thời gian. Khi xài với x2 sẽ thành 2+50=52!',
      descEn: 'x50 Essence for 5 mins. Stacks duration. Adds with other potions (e.g. 2+50=52)!'
    },
    {
      id: 'potion_x100',
      type: 'x100',
      multiplier: 100,
      nameVi: 'Thuốc Chúa Tể Vũ Trụ x100',
      nameEn: 'Primordial Overlord Elixir x100',
      icon: '🪐',
      duration: 300,
      costGems: 120,
      descVi: 'Nhân x100 sản lượng trong 5 phút. Đỉnh cao sức mạnh! Cộng dồn với mọi loại thuốc khác!',
      descEn: 'x100 Essence for 5 mins. Ultimate cosmic surge! Adds with all other potions!'
    }
  ];

  // Permanent VIP Game Passes (Simulated IAP with permanent account perks)
  const DEFAULT_GAME_PASSES = [
    {
      id: 'pass_autoclick_perm',
      nameVi: '⚡ Tự Động Bấm Vĩnh Cửu (Infinite Astral Drone)',
      nameEn: 'Infinite Astral Drone Pass',
      descVi: 'Tự động bấm Lõi liên tục 15 lần/giây vĩnh viễn, không bao giờ hết hạn hay cần dùng thuốc!',
      descEn: 'Automatically clicks Core 15 times/sec continuously forever!',
      priceVnd: '119,000₫',
      priceUsd: '$4.99',
      icon: '⚡',
      badge: 'HOT',
      owned: false
    },
    {
      id: 'pass_double_essence',
      nameVi: '👑 VIP Nhân Đôi Sản Lượng (x2 All Essence)',
      nameEn: 'VIP Double Essence Pass (x2)',
      descVi: 'Nhân đôi vĩnh viễn toàn bộ sản lượng Năng Lượng Vũ Trụ thu hoạch từ mọi nguồn!',
      descEn: 'Permanently doubles all Essence generated across all runs!',
      priceVnd: '69,000₫',
      priceUsd: '$2.99',
      icon: '👑',
      badge: 'KHUYÊN DÙNG',
      owned: false
    },
    {
      id: 'pass_fortune_loot',
      nameVi: '🍀 Vận Mệnh Thần Thánh (Cosmic Fortune Pass)',
      nameEn: 'Cosmic Fortune Pass',
      descVi: 'Tăng vĩnh viễn +50% tỉ lệ rơi Cổ Vật & Quà Boss, gấp đôi tần suất xuất hiện Khe Nứt Vũ Trụ!',
      descEn: 'Permanently boosts Relic & Boss drop rates by +50%, doubles Cosmic Rift spawns!',
      priceVnd: '89,000₫',
      priceUsd: '$3.99',
      icon: '🍀',
      badge: 'PHỔ BIẾN',
      owned: false
    },
    {
      id: 'pass_offline_24h',
      nameVi: '⏳ Treo Máy 24H Vĩnh Cửu (24H Infinite Offline)',
      nameEn: '24H Infinite Offline Chamber',
      descVi: 'Tăng giới hạn thời gian ngoại tuyến lên 24 giờ với hiệu suất tối đa 100% full speed!',
      descEn: 'Boosts max offline time to 24 hours at 100% full production speed!',
      priceVnd: '49,000₫',
      priceUsd: '$1.99',
      icon: '⏳',
      owned: false
    },
    {
      id: 'pass_crit_overdrive',
      nameVi: '🔥 Bão Tố Bạo Kích (Overdrive Crit Master)',
      nameEn: 'Overdrive Crit Master Pass',
      descVi: 'Tăng vĩnh viễn +10% Tỉ lệ Bạo Kích và +250% Sát thương Bạo Kích tối thượng!',
      descEn: 'Permanently adds +10% Crit Chance & +250% Crit Damage!',
      priceVnd: '119,000₫',
      priceUsd: '$4.99',
      icon: '🔥',
      owned: false
    },
    {
      id: 'pass_ultimate_bundle',
      nameVi: '🪐 Gói Chúa Tể Toàn Năng (All-In-One Overlord)',
      nameEn: 'All-In-One Overlord Bundle',
      descVi: 'Mở khóa TOÀN BỘ 5 Game Pass trên cùng lúc với mức giá tiết kiệm 50%!',
      descEn: 'Unlocks ALL 5 Game Passes above at once with 50% discount!',
      priceVnd: '299,000₫',
      priceUsd: '$12.99',
      icon: '🪐',
      badge: 'GIẢM 50%',
      owned: false
    }
  ];

  // Gem Top-Up Packs (Simulated IAP Top-Up)
  const GEM_TOPUP_PACKS = [
    {
      id: 'pack_30',
      gems: 30,
      bonusGems: 0,
      priceVnd: '22,000₫',
      priceUsd: '$0.99',
      nameVi: 'Túi Đá Quý Nhỏ',
      nameEn: 'Pouch of Astral Gems',
      icon: '💎'
    },
    {
      id: 'pack_90',
      gems: 80,
      bonusGems: 10,
      priceVnd: '69,000₫',
      priceUsd: '$2.99',
      nameVi: 'Hộp Đá Quý Tinh Vân',
      nameEn: 'Nebula Gem Stash',
      icon: '✨',
      badge: '+12% TẶNG'
    },
    {
      id: 'pack_290',
      gems: 250,
      bonusGems: 40,
      priceVnd: '199,000₫',
      priceUsd: '$7.99',
      nameVi: 'Rương Kho Báu Hư Không',
      nameEn: 'Void Gem Vault',
      icon: '🔮',
      badge: 'BÁN CHẠY'
    },
    {
      id: 'pack_720',
      gems: 600,
      bonusGems: 120,
      priceVnd: '449,000₫',
      priceUsd: '$18.99',
      nameVi: 'Túi Thần Tài Thiên Hà',
      nameEn: 'Galactic Treasury',
      icon: '👑',
      badge: '+20% TẶNG'
    },
    {
      id: 'pack_1900',
      gems: 1500,
      bonusGems: 400,
      priceVnd: '999,000₫',
      priceUsd: '$39.99',
      nameVi: 'Kho Báu Chúa Tể Nexyroth',
      nameEn: 'Sovereign Gem Hoard',
      icon: '🪐',
      badge: 'SIÊU GIÁ TRỊ'
    }
  ];

  // Balanced default potions: only 1 starter potion, zero hyper-auto
  const DEFAULT_POTIONS = {
    potion_auto_50ms: 0,
    potion_x2: 1,        // Only 1 starter potion
    potion_x5: 0,
    potion_x10: 0,
    potion_x20: 0,
    potion_x50: 0,
    potion_x100: 0
  };

  const DEFAULT_ACTIVE_POTIONS = {
    auto_50ms: 0,
    x2: 0,
    x5: 0,
    x10: 0,
    x20: 0,
    x50: 0,
    x100: 0
  };

  // 4 Worlds Definition
  const WORLDS = [
    { id: 'w1', name: '🌌 Hư Không Nguyên Thuỷ', reqAscension: 0, currency: 'Essence', desc: 'Thế giới khởi nguyên của muôn loài, nơi năng lượng vũ trụ tràn ngập rực rỡ.' },
    { id: 'w2', name: '🪐 Tinh Vân Hỗn Độn', reqAscension: 1, currency: 'Bụi Sao Tinh Vân', desc: 'Cõi giới hỗn độn các vì sao rực cháy, mở khoá sau lần Thăng Thiên 1.' },
    { id: 'w3', name: '🕳️ Vực Thẳm Vô Tận', reqAscension: 3, currency: 'Tinh Thạch Vực Tối', desc: 'Vùng tối sâu thẳm vĩnh hằng, mở khoá sau lần Thăng Thiên thứ 3.' },
    { id: 'w4', name: '⛩️ Thiên Giới Vĩnh Hằng', reqAscension: 6, currency: 'Ánh Sáng Thần Thánh', desc: 'Thế giới thứ 4 thần thánh, mở khoá ở lần Thăng Thiên thứ 6, mang theo sức mạnh bất diệt.' }
  ];

  // 18 Pets: 5 in W1, 5 in W2, 5 in W3, 3 in W4 + Gacha Pets
  const DEFAULT_PETS = {
    // World 1 Pets
    w1_sprite: { id: 'w1_sprite', name: 'Hư Không Tinh Linh', world: 'w1', level: 1, bonusDesc: '+5% Click' },
    w1_ghost: { id: 'w1_ghost', name: 'Bóng Ma Tinh Tú', world: 'w1', level: 0, bonusDesc: '+5% CPS' },
    w1_bat: { id: 'w1_bat', name: 'Dơi Bóng Đêm', world: 'w1', level: 0, bonusDesc: '+2% Crit' },
    w1_cat: { id: 'w1_cat', name: 'Mèo Hư Không', world: 'w1', level: 0, bonusDesc: '+5% Item Drop' },
    w1_wolf: { id: 'w1_wolf', name: 'Sói Hắc Ám', world: 'w1', level: 0, bonusDesc: '+10% Boss Damage' },
    // World 2 Pets
    w2_dust: { id: 'w2_dust', name: 'Hạt Bụi Tinh Vân', world: 'w2', level: 0, bonusDesc: '+10% CPS' },
    w2_fox: { id: 'w2_fox', name: 'Hồ Ly Sao Băng', world: 'w2', level: 0, bonusDesc: '+10% Click' },
    w2_snake: { id: 'w2_snake', name: 'Rắn Hỗn Độn', world: 'w2', level: 0, bonusDesc: '+4% Crit' },
    w2_bear: { id: 'w2_bear', name: 'Gấu Thiên Hà', world: 'w2', level: 0, bonusDesc: '+15% Boss Damage' },
    w2_bird: { id: 'w2_bird', name: 'Chim Sấm Tinh Vân', world: 'w2', level: 0, bonusDesc: '+10% Gem Drop' },
    // World 3 Pets
    w3_demon: { id: 'w3_demon', name: 'Quỷ Lửa Vực Thẳm', world: 'w3', level: 0, bonusDesc: '+20% Click' },
    w3_serpent: { id: 'w3_serpent', name: 'Rồng Biển Sâu', world: 'w3', level: 0, bonusDesc: '+20% CPS' },
    w3_scorpion: { id: 'w3_scorpion', name: 'Bọ Cạp Vực Tối', world: 'w3', level: 0, bonusDesc: '+6% Crit' },
    w3_spider: { id: 'w3_spider', name: 'Nhện Bóng Tối', world: 'w3', level: 0, bonusDesc: '+15% Item Drop' },
    w3_beast: { id: 'w3_beast', name: 'Quái Vật Vô Tận', world: 'w3', level: 0, bonusDesc: '+25% Boss Damage' },
    // World 4 Pets ("⛩️ Thiên Giới Vĩnh Hằng")
    w4_crane: { id: 'w4_crane', name: 'Tiên Hạc Thần Thánh', world: 'w4', level: 0, bonusDesc: '+30% Tất Cả Thu Hoạch' },
    w4_pegasus: { id: 'w4_pegasus', name: 'Thiên Mã Ánh Sáng', world: 'w4', level: 0, bonusDesc: '+50% Sát Thương Boss' },
    w4_gold_dragon: { id: 'w4_gold_dragon', name: 'Kim Long Thần Giới', world: 'w4', level: 0, bonusDesc: '+35% Nhặt Đá Quý' },
    // 5th Gacha Pet: Cú Đêm Vĩnh Cửu (+5% Offline Efficiency per level)
    night_owl: { id: 'night_owl', name: 'Cú Đêm Vĩnh Cửu', level: 0, bonusDesc: '+5% Hiệu Suất Ngoại Tuyến mỗi cấp' }
  };

  const BOSS_PRESETS = [
    { id: 'boss_1', name: 'Mal’Zakar the Void Titan', title: 'Harbinger of Dimensional Fractures', maxHp: 25000, currentHp: 25000, timeLimit: 30, remainingTime: 30, rewardGems: 1, rewardShards: 25, rewardExp: 250, active: false, level: 1, tier: 'normal' },
    { id: 'boss_2', name: 'Vor’Thex the Astral Devourer', title: 'Ancient Nebula Wyrm', maxHp: 180000, currentHp: 180000, timeLimit: 35, remainingTime: 35, rewardGems: 2, rewardShards: 80, rewardExp: 800, active: false, level: 2, tier: 'normal' },
    { id: 'boss_3', name: 'Nexyroth, Primordial Entity', title: 'Architect of Endless Void', maxHp: 1500000, currentHp: 1500000, timeLimit: 45, remainingTime: 45, rewardGems: 3, rewardShards: 300, rewardExp: 3500, active: false, level: 3, tier: 'normal' },
    { id: 'boss_4', name: 'Chrono-Leviathan', title: 'Ruler of Shattered Timelines', maxHp: 12000000, currentHp: 12000000, timeLimit: 50, remainingTime: 50, rewardGems: 4, rewardShards: 600, rewardExp: 8000, active: false, level: 4, tier: 'normal' },
    { id: 'boss_5', name: 'Cosmic Singularity Warden', title: 'Keeper of Black Hole Rifts', maxHp: 80000000, currentHp: 80000000, timeLimit: 55, remainingTime: 55, rewardGems: 5, rewardShards: 1200, rewardExp: 20000, active: false, level: 5, tier: 'normal' }
  ];

  const DEFAULT_DAILY_STREAK = {
    streakDay: 0,
    lastClaimTimestamp: 0,
    lastClaimDate: '',
    claimedDays: []
  };

  const DEFAULT_EVENT_STATE = {
    eventId: 'cosmic_incursion_v8',
    eventTitle: 'Cosmic Void Incursion (v8.0)',
    endTime: Date.now() + 7 * 24 * 60 * 60 * 1000,
    eventTokens: 0,
    claimedMilestones: [],
    quests: [
      { id: 'q_click', name: 'Core Resonance', desc: 'Click the Nexyroth Core 150 times.', target: 150, current: 0, rewardTokens: 50, rewardGems: 1, type: 'clicks', claimed: false },
      { id: 'q_boss', name: 'Titan Executioner', desc: 'Defeat 2 Void Titans in the Arena.', target: 2, current: 0, rewardTokens: 80, rewardShards: 30, type: 'bosses', claimed: false },
      { id: 'q_rifts', name: 'Anomaly Catcher', desc: 'Collect 3 Cosmic Rifts.', target: 3, current: 0, rewardTokens: 60, rewardGems: 1, type: 'rifts', claimed: false },
      { id: 'q_upgrades', name: 'Ancient Engineering', desc: 'Purchase 25 total upgrades.', target: 25, current: 0, rewardTokens: 75, rewardGems: 2, type: 'upgrades', claimed: false },
      { id: 'q_essence', name: 'Essence Overflow', desc: 'Gather 100,000 Cosmic Essence.', target: 100000, current: 0, rewardTokens: 100, rewardGems: 2, type: 'essence', claimed: false },
      { id: 'q_crits', name: 'Precision Strikes', desc: 'Score 50 Critical Strikes on the Core.', target: 50, current: 0, rewardTokens: 70, rewardShards: 20, type: 'crits', claimed: false }
    ]
  };

  function createInitialState() {
    return {
      version: '8.0',
      essence: 0,
      totalEssence: 0,
      astralShards: 0,
      totalAstralShards: 0,
      astralGems: 5, // Rare starter amount (anti-inflation)
      divineLight: 0, // World 4 currency

      level: 1,
      currentExp: 0,
      maxExp: 100,
      skillPoints: 0,

      totalClicks: 0,
      totalCrits: 0,
      totalRifts: 0,
      totalUpgradesBought: 0,
      bossesDefeated: 0,
      dailyBossesDefeated: 0,
      lastDailyBossDate: '',
      prestigeCount: 0,
      currentWorld: 'w1',

      lastSaveTime: Date.now(),
      lastOfflineGain: 0,

      // Personal Records (v8.0: Kỷ Lục Cá Nhân - persist across resets)
      records: {
        highestCps: 0,
        highestClick: 0,
        maxClicksIn10s: 0
      },

      upgrades: JSON.parse(JSON.stringify(DEFAULT_UPGRADES)),
      skills: JSON.parse(JSON.stringify(DEFAULT_SKILLS)),
      relics: JSON.parse(JSON.stringify(DEFAULT_RELICS)),
      achievements: JSON.parse(JSON.stringify(DEFAULT_ACHIEVEMENTS)),
      gemShopItems: JSON.parse(JSON.stringify(DEFAULT_GEM_SHOP_ITEMS)),
      pets: JSON.parse(JSON.stringify(DEFAULT_PETS)),
      gamePasses: {
        pass_autoclick_perm: false,
        pass_double_essence: false,
        pass_fortune_loot: false,
        pass_offline_24h: false,
        pass_crit_overdrive: false,
        pass_ultimate_bundle: false
      },
      redeemedCodes: [],

      daily: JSON.parse(JSON.stringify(DEFAULT_DAILY_STREAK)),
      events: JSON.parse(JSON.stringify(DEFAULT_EVENT_STATE)),

      potions: JSON.parse(JSON.stringify(DEFAULT_POTIONS)),
      activePotions: JSON.parse(JSON.stringify(DEFAULT_ACTIVE_POTIONS)),

      settings: {
        language: 'vi',
        sfxEnabled: true,
        sfxVolume: 0.5,
        scientificNotation: false,
        floatingNumbers: true,
        particles: true
      },
      activeBoosts: []
    };
  }

  let state = createInitialState();
  let currentBoss = JSON.parse(JSON.stringify(BOSS_PRESETS[0]));

  /**
   * Helper: Deep 1-level merge to preserve any custom properties without overwriting new fields
   */
  function deepMerge(target, source) {
    if (!source || typeof source !== 'object') return target;
    const output = Object.assign({}, target, source);
    Object.keys(target).forEach(function (key) {
      if (target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])) {
        output[key] = Object.assign({}, target[key], source[key] || {});
      }
    });
    return output;
  }

  function loadState() {
    try {
      // Check current v8 or previous saves
      const raw = localStorage.getItem(SAVE_KEY) || localStorage.getItem('nexyroth_save_v4');
      if (raw) {
        const parsed = JSON.parse(raw);
        // Retain foreign fields for future backward compatibility
        state = deepMerge(createInitialState(), parsed);
        state.version = '8.0';

        // 1. Merge Upgrades: keep existing levels, append missing ones
        DEFAULT_UPGRADES.forEach(function (defU) {
          const existing = state.upgrades.find(function (u) { return u.id === defU.id; });
          if (!existing) {
            state.upgrades.push(JSON.parse(JSON.stringify(defU)));
          } else {
            // Update name, desc, baseEffect if needed
            existing.name = defU.name;
            existing.desc = defU.desc;
            existing.baseCost = defU.baseCost;
            existing.baseEffect = defU.baseEffect;
            existing.unlockedAtLevel = defU.unlockedAtLevel;
            existing.costMultiplier = defU.costMultiplier;
          }
        });

        // 2. Merge Skills: Constellation Map migration & safe SP refund
        const hasCore = state.skills && state.skills.some(function (s) { return s.id === 'core'; });
        if (!hasCore) {
          let refundedSp = 0;
          if (Array.isArray(state.skills)) {
            state.skills.forEach(function (oldS) {
              if (oldS.unlocked && oldS.costPoints) {
                refundedSp += oldS.costPoints;
                if (oldS.level && oldS.level > 1) {
                  refundedSp += (oldS.level - 1) * oldS.costPoints;
                }
              }
            });
          }
          state.skillPoints = (state.skillPoints || 0) + refundedSp;
          state.skills = JSON.parse(JSON.stringify(DEFAULT_SKILLS));
        } else {
          DEFAULT_SKILLS.forEach(function (defS) {
            const existing = state.skills.find(function (s) { return s.id === defS.id; });
            if (!existing) {
              state.skills.push(JSON.parse(JSON.stringify(defS)));
            } else {
              existing.name = defS.name;
              existing.nameVi = defS.nameVi;
              existing.branch = defS.branch;
              existing.branchNameVi = defS.branchNameVi;
              existing.x = defS.x;
              existing.y = defS.y;
              existing.requires = defS.requires;
              existing.maxLevel = defS.maxLevel;
              existing.costPoints = defS.costPoints;
              existing.icon = defS.icon;
              existing.descVi = defS.descVi;
              existing.descEn = defS.descEn;
              existing.effectType = defS.effectType;
              existing.effectPerLevel = defS.effectPerLevel;
              if (defS.isInfinite) existing.isInfinite = true;
            }
          });
        }

        // 3. Merge Relics: ensure all 27 relics exist
        DEFAULT_RELICS.forEach(function (defR) {
          const existing = state.relics.find(function (r) { return r.id === defR.id; });
          if (!existing) {
            state.relics.push(JSON.parse(JSON.stringify(defR)));
          } else {
            existing.name = defR.name;
            existing.rarity = defR.rarity;
            existing.effectDesc = defR.effectDesc;
            existing.clickBonus = defR.clickBonus || 0;
            existing.cpsBonus = defR.cpsBonus || 0;
            existing.critBonus = defR.critBonus || 0;
            if (defR.bossDamageBonus) existing.bossDamageBonus = defR.bossDamageBonus;
            if (defR.itemDropBonus) existing.itemDropBonus = defR.itemDropBonus;
            if (defR.gemDropBonus) existing.gemDropBonus = defR.gemDropBonus;
            if (defR.offlineBonus) existing.offlineBonus = defR.offlineBonus;
          }
        });

        // 4. Merge Achievements: ensure 35 achievements exist
        DEFAULT_ACHIEVEMENTS.forEach(function (defA) {
          const existing = state.achievements.find(function (a) { return a.id === defA.id; });
          if (!existing) {
            state.achievements.push(JSON.parse(JSON.stringify(defA)));
          } else {
            existing.name = defA.name;
            existing.desc = defA.desc;
            existing.rewardGems = defA.rewardGems;
            existing.target = defA.target;
            existing.type = defA.type;
          }
        });

        // 5. Merge Pets
        if (!state.pets) state.pets = JSON.parse(JSON.stringify(DEFAULT_PETS));
        Object.keys(DEFAULT_PETS).forEach(function (k) {
          if (!state.pets[k]) state.pets[k] = JSON.parse(JSON.stringify(DEFAULT_PETS[k]));
        });

        // 6. Merge Records
        if (!state.records) {
          state.records = { highestCps: 0, highestClick: 0, maxClicksIn10s: 0 };
        }

        // 7. Merge Potions
        if (!state.potions) state.potions = JSON.parse(JSON.stringify(DEFAULT_POTIONS));
        Object.keys(DEFAULT_POTIONS).forEach(function (k) {
          if (state.potions[k] === undefined) state.potions[k] = DEFAULT_POTIONS[k];
        });
        if (!state.activePotions) state.activePotions = JSON.parse(JSON.stringify(DEFAULT_ACTIVE_POTIONS));
        Object.keys(DEFAULT_ACTIVE_POTIONS).forEach(function (k) {
          if (state.activePotions[k] === undefined) state.activePotions[k] = 0;
        });

        // 8. Daily & Events
        if (!state.daily) state.daily = JSON.parse(JSON.stringify(DEFAULT_DAILY_STREAK));
        if (!state.events || !state.events.quests) state.events = JSON.parse(JSON.stringify(DEFAULT_EVENT_STATE));

        // 9. Game Passes
        if (!state.gamePasses) {
          state.gamePasses = {
            pass_autoclick_perm: false,
            pass_double_essence: false,
            pass_fortune_loot: false,
            pass_offline_24h: false,
            pass_crit_overdrive: false,
            pass_ultimate_bundle: false
          };
        }
      }
    } catch (e) {
      console.error('Failed to load state:', e);
    }
  }

  function saveState() {
    state.lastSaveTime = Date.now();
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }

  function resetState() {
    // Preserve records across hard reset if player wishes, or fresh start
    localStorage.removeItem(SAVE_KEY);
    state = createInitialState();
    currentBoss = JSON.parse(JSON.stringify(BOSS_PRESETS[0]));
    saveState();
  }

  // Base64 Save String Export / Import
  function exportSaveBase64() {
    state.lastSaveTime = Date.now();
    const json = JSON.stringify(state);
    return btoa(unescape(encodeURIComponent(json)));
  }

  function importSaveBase64(b64String) {
    try {
      const json = decodeURIComponent(escape(atob(b64String.trim())));
      const parsed = JSON.parse(json);
      if (parsed && typeof parsed.essence === 'number') {
        state = deepMerge(createInitialState(), parsed);
        saveState();
        return { success: true };
      }
      return { success: false, error: 'Dữ liệu lưu không hợp lệ.' };
    } catch (e) {
      return { success: false, error: 'Chuỗi Base64 không đúng định dạng.' };
    }
  }

  global.GameState = {
    get: function () { return state; },
    set: function (newState) { state = newState; },
    getBoss: function () { return currentBoss; },
    setBoss: function (b) { currentBoss = b; },
    getBossPresets: function () { return BOSS_PRESETS; },
    getPotionMetadata: function () { return POTION_METADATA; },
    getGamePasses: function () { return DEFAULT_GAME_PASSES; },
    getGemTopupPacks: function () { return GEM_TOPUP_PACKS; },
    getWorlds: function () { return WORLDS; },
    load: loadState,
    save: saveState,
    reset: resetState,
    exportBase64: exportSaveBase64,
    importBase64: importSaveBase64
  };
})(typeof window !== 'undefined' ? window : this);
