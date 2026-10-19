export interface BonusesSnapshot {
  bossDamageMultiplier: number;
  itemDropChance: number;
  gemDropChance: number;
  offlineEfficiency: number;
  achievementBuffPercent: number;
}

export type BonusesState = Partial<GameState>;

export type UpgradeEffectType = 'click' | 'cps';

export interface Upgrade {
  id: string;
  name: string;
  desc: string;
  baseCost: number;
  costMultiplier: number;
  level: number;
  baseEffect: number;
  effectType: UpgradeEffectType;
  unlockedAtLevel: number;
  icon: string;
}

export type RelicRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'cosmic' | string;

export interface Relic {
  id: string;
  name: string;
  rarity: RelicRarity;
  effectDesc: string;
  equipped: boolean;
  clickBonus?: number;
  cpsBonus?: number;
  critBonus?: number;
  bossDamageBonus?: number;
  itemDropBonus?: number;
  gemDropBonus?: number;
  offlineBonus?: number;
  icon?: string;
}

export interface SkillNode {
  id: string;
  name: string;
  nameVi?: string;
  branch: string;
  branchNameVi?: string;
  x?: number;
  y?: number;
  requires?: readonly string[] | string[];
  maxLevel?: number;
  level?: number;
  costPoints: number;
  unlocked: boolean;
  reqSkillId?: string;
  effectType: string;
  effectPerLevel?: number;
  effectValue?: number;
  descVi?: string;
  descEn?: string;
  icon: string;
}

export type BossTier = 'normal' | 'rare' | 'daily' | string;

export interface Boss {
  id?: string;
  name?: string;
  title?: string;
  maxHp: number;
  currentHp: number;
  timeLimit: number;
  remainingTime: number;
  rewardGems?: number;
  rewardShards?: number;
  rewardExp?: number;
  rewardRelicPool?: string[];
  active: boolean;
  level?: number;
  tier?: BossTier;
  isMilestone?: boolean;
}

export interface Achievement {
  id: string;
  name?: string;
  desc?: string;
  unlocked?: boolean;
  rewardGems?: number;
  current: number;
  target?: number;
  type: string;
}

export interface GemShopItem {
  id: string;
  name: string;
  desc: string;
  costGems: number;
  purchased: boolean;
  icon?: string;
  type?: string;
  value: number;
}

export interface GameSettings {
  sfxEnabled: boolean;
  sfxVolume: number;
  scientificNotation: boolean;
  floatingNumbers: boolean;
  particles: boolean;
  highContrast?: boolean;
  language?: 'vi' | 'en';
}

export interface ActiveBoost {
  id: string;
  name: string;
  multiplier: number;
  remainingSeconds: number;
  icon?: string;
}

export interface GamePasses {
  pass_autoclick_perm?: boolean;
  pass_double_essence?: boolean;
  pass_fortune_loot?: boolean;
  pass_offline_24h?: boolean;
  pass_crit_overdrive?: boolean;
  pass_ultimate_bundle?: boolean;
  [key: string]: boolean | undefined;
}

export interface GameState {
  version: string | number;
  essence: number;
  totalEssence: number;
  astralShards?: number;
  totalAstralShards?: number;
  astralGems?: number;
  level: number;
  currentExp: number;
  maxExp: number;
  skillPoints?: number;
  totalClicks: number;
  bossesDefeated: number;
  dailyBossesDefeated?: number;
  totalCrits?: number;
  totalUpgradesBought?: number;
  prestigeCount: number;
  lastSaveTime?: number;
  lastOfflineGain?: number;
  lastDailyBossDate?: string;
  upgrades: Upgrade[];
  relics: Relic[];
  skills: SkillNode[];
  achievements: Achievement[];
  gemShopItems?: GemShopItem[];
  redeemedCodes?: string[];
  settings?: GameSettings;
  activeBoosts: ActiveBoost[];
  activePotions?: Record<string, number>;
  potions?: Record<string, number>;
  pets?: Record<string, any>;
  records?: {
    highestCps: number;
    highestClick: number;
    maxClicksIn10s: number;
  };
  daily?: any;
  events?: any;
  gamePasses?: GamePasses;
  [key: string]: any;
}
