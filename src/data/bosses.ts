export const BOSS_PRESETS = [
  { id: 'boss_1', name: 'Mal’Zakar the Void Titan', title: 'Harbinger of Dimensional Fractures', maxHp: 25000, currentHp: 25000, timeLimit: 30, remainingTime: 30, rewardGems: 1, rewardShards: 25, rewardExp: 250, active: false, level: 1, tier: 'normal' },
  { id: 'boss_2', name: 'Vor’Thex the Astral Devourer', title: 'Ancient Nebula Wyrm', maxHp: 180000, currentHp: 180000, timeLimit: 35, remainingTime: 35, rewardGems: 2, rewardShards: 80, rewardExp: 800, active: false, level: 2, tier: 'normal' },
  { id: 'boss_3', name: 'Nexyroth, Primordial Entity', title: 'Architect of Endless Void', maxHp: 1500000, currentHp: 1500000, timeLimit: 45, remainingTime: 45, rewardGems: 3, rewardShards: 300, rewardExp: 3500, active: false, level: 3, tier: 'normal' },
  { id: 'boss_4', name: 'Chrono-Leviathan', title: 'Ruler of Shattered Timelines', maxHp: 12000000, currentHp: 12000000, timeLimit: 50, remainingTime: 50, rewardGems: 4, rewardShards: 600, rewardExp: 8000, active: false, level: 4, tier: 'normal' },
  { id: 'boss_5', name: 'Cosmic Singularity Warden', title: 'Keeper of Black Hole Rifts', maxHp: 80000000, currentHp: 80000000, timeLimit: 55, remainingTime: 55, rewardGems: 5, rewardShards: 1200, rewardExp: 20000, active: false, level: 5, tier: 'normal' }
] as const;

export type BossPresetDef = (typeof BOSS_PRESETS)[number];
