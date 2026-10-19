export const DEFAULT_GAME_PASSES = [
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
  },
] as const;

export type GamePassDef = (typeof DEFAULT_GAME_PASSES)[number];

export const DEFAULT_GAME_PASS_KEYS = {
  pass_autoclick_perm: false,
  pass_double_essence: false,
  pass_fortune_loot: false,
  pass_offline_24h: false,
  pass_crit_overdrive: false,
  pass_ultimate_bundle: false,
} as const;

export type DefaultGamePassKeys = typeof DEFAULT_GAME_PASS_KEYS;
