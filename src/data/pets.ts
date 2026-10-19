export const DEFAULT_PETS = {
  w1_sprite: { id: 'w1_sprite', name: 'Hư Không Tinh Linh', world: 'w1', level: 1, bonusDesc: '+5% Click' },
  w1_ghost: { id: 'w1_ghost', name: 'Bóng Ma Tinh Tú', world: 'w1', level: 0, bonusDesc: '+5% CPS' },
  w1_bat: { id: 'w1_bat', name: 'Dơi Bóng Đêm', world: 'w1', level: 0, bonusDesc: '+2% Crit' },
  w1_cat: { id: 'w1_cat', name: 'Mèo Hư Không', world: 'w1', level: 0, bonusDesc: '+5% Item Drop' },
  w1_wolf: { id: 'w1_wolf', name: 'Sói Hắc Ám', world: 'w1', level: 0, bonusDesc: '+10% Boss Damage' },
  w2_dust: { id: 'w2_dust', name: 'Hạt Bụi Tinh Vân', world: 'w2', level: 0, bonusDesc: '+10% CPS' },
  w2_fox: { id: 'w2_fox', name: 'Hồ Ly Sao Băng', world: 'w2', level: 0, bonusDesc: '+10% Click' },
  w2_snake: { id: 'w2_snake', name: 'Rắn Hỗn Độn', world: 'w2', level: 0, bonusDesc: '+4% Crit' },
  w2_bear: { id: 'w2_bear', name: 'Gấu Thiên Hà', world: 'w2', level: 0, bonusDesc: '+15% Boss Damage' },
  w2_bird: { id: 'w2_bird', name: 'Chim Sấm Tinh Vân', world: 'w2', level: 0, bonusDesc: '+10% Gem Drop' },
  w3_demon: { id: 'w3_demon', name: 'Quỷ Lửa Vực Thẳm', world: 'w3', level: 0, bonusDesc: '+20% Click' },
  w3_serpent: { id: 'w3_serpent', name: 'Rồng Biển Sâu', world: 'w3', level: 0, bonusDesc: '+20% CPS' },
  w3_scorpion: { id: 'w3_scorpion', name: 'Bọ Cạp Vực Tối', world: 'w3', level: 0, bonusDesc: '+6% Crit' },
  w3_spider: { id: 'w3_spider', name: 'Nhện Bóng Tối', world: 'w3', level: 0, bonusDesc: '+15% Item Drop' },
  w3_beast: { id: 'w3_beast', name: 'Quái Vật Vô Tận', world: 'w3', level: 0, bonusDesc: '+25% Boss Damage' },
  w4_crane: { id: 'w4_crane', name: 'Tiên Hạc Thần Thánh', world: 'w4', level: 0, bonusDesc: '+30% Tất Cả Thu Hoạch' },
  w4_pegasus: { id: 'w4_pegasus', name: 'Thiên Mã Ánh Sáng', world: 'w4', level: 0, bonusDesc: '+50% Sát Thương Boss' },
  w4_gold_dragon: { id: 'w4_gold_dragon', name: 'Kim Long Thần Giới', world: 'w4', level: 0, bonusDesc: '+35% Nhặt Đá Quý' },
  night_owl: { id: 'night_owl', name: 'Cú Đêm Vĩnh Cửu', level: 0, bonusDesc: '+5% Hiệu Suất Ngoại Tuyến mỗi cấp' },
} as const;

export type DefaultPets = typeof DEFAULT_PETS;
export type PetDef = (typeof DEFAULT_PETS)[keyof typeof DEFAULT_PETS];
