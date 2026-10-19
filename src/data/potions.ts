export const POTION_METADATA = [
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
  },
] as const;

export type PotionMetaDef = (typeof POTION_METADATA)[number];

export const DEFAULT_POTIONS = {
  potion_auto_50ms: 0,
  potion_x2: 1,
  potion_x5: 0,
  potion_x10: 0,
  potion_x20: 0,
  potion_x50: 0,
  potion_x100: 0,
} as const;

export type DefaultPotions = typeof DEFAULT_POTIONS;

export const DEFAULT_ACTIVE_POTIONS = {
  auto_50ms: 0,
  x2: 0,
  x5: 0,
  x10: 0,
  x20: 0,
  x50: 0,
  x100: 0,
} as const;

export type DefaultActivePotions = typeof DEFAULT_ACTIVE_POTIONS;
