export const DEFAULT_DAILY_STREAK = {
    streakDay: 0,
    lastClaimTimestamp: 0,
    lastClaimDate: '',
    claimedDays: []
  } as const;

export const DAILY_REWARDS = [
    { day: 1, titleVi: 'Tia Sáng Hư Không', titleEn: 'Spark of the Abyss', gems: 1, essence: 500, shards: 0, icon: '💎', descVi: '1 Đá Quý + 500 Năng Lượng', descEn: '1 Gem + 500 Essence' },
    { day: 2, titleVi: 'Rương Tinh Vân', titleEn: 'Astral Cache', gems: 1, essence: 1500, shards: 2, icon: '✨', descVi: '1 Đá Quý + 1,500 Năng Lượng + 2 Shards', descEn: '1 Gem + 1,500 Essence + 2 Shards' },
    { day: 3, titleVi: 'Mảnh Vỡ Hư Vô', titleEn: 'Shards of the Void', gems: 2, essence: 0, shards: 5, icon: '🔮', descVi: '2 Đá Quý + 5 Mảnh Shards', descEn: '2 Gems + 5 Shards' },
    { day: 4, titleVi: 'Thuốc Tăng Lực', titleEn: 'Elixir of Power', gems: 2, essence: 0, shards: 0, potionKey: 'potion_x2', icon: '🧪', descVi: '2 Đá Quý + 1 Thuốc Năng Lượng x2 (Balo)', descEn: '2 Gems + 1 Cosmic Elixir x2 (Backpack)' },
    { day: 5, titleVi: 'Kho Báu Chiều Không Gian', titleEn: 'Dimensional Stash', gems: 3, essence: 0, shards: 10, icon: '💠', descVi: '3 Đá Quý + 10 Mảnh Shards', descEn: '3 Gems + 10 Shards' },
    { day: 6, titleVi: 'Kho Báu Tinh Cầu', titleEn: 'Cosmic Treasury', gems: 3, essence: 10000, shards: 0, icon: '👑', descVi: '3 Đá Quý + 10,000 Năng Lượng', descEn: '3 Gems + 10,000 Essence' },
    { day: 7, titleVi: 'Trái Tim Chúa Tể Vũ Trụ', titleEn: 'Heart of the Sovereign', gems: 5, essence: 0, shards: 20, relic: true, icon: '🪐', descVi: '5 Đá Quý + 20 Shards + CỔ VẬT HUYỀN THOẠI!', descEn: '5 Gems + 20 Shards + LEGENDARY RELIC!' }
  ] as const;
export type DailyRewardDef = (typeof DAILY_REWARDS)[number];
