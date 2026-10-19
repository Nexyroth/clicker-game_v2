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

export type RelicRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'cosmic';

export interface Relic {
  id: string;
  name: string;
  rarity: RelicRarity;
  effectDesc: string;
  equipped: boolean;
  clickBonus: number; // e.g. 0.1 for +10%
  cpsBonus: number;   // e.g. 0.15 for +15%
  critBonus: number;  // e.g. 0.05 for +5%
  icon: string;
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  branch: 'void' | 'astral' | 'chrono';
  costPoints: number;
  unlocked: boolean;
  reqSkillId?: string;
  effectType: 'clickPower' | 'cps' | 'critChance' | 'critMultiplier' | 'frenzyDuration' | 'gemDropRate';
  effectValue: number;
  icon: string;
}

export interface Boss {
  id: string;
  name: string;
  title: string;
  maxHp: number;
  currentHp: number;
  timeLimit: number;
  remainingTime: number;
  rewardGems: number;
  rewardShards: number;
  rewardExp: number;
  rewardRelicPool?: string[];
  active: boolean;
  level: number;
}

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  unlocked: boolean;
  rewardGems: number;
  current: number;
  target: number;
  type: 'clicks' | 'essence' | 'level' | 'bosses' | 'upgrades' | 'prestige';
}

export interface GemShopItem {
  id: string;
  name: string;
  desc: string;
  costGems: number;
  purchased: boolean;
  icon: string;
  type: 'permanent_mult' | 'auto_clicker' | 'offline_boost' | 'relic_chest' | 'crit_overload';
  value: number;
}

export interface GameSettings {
  sfxEnabled: boolean;
  sfxVolume: number;
  scientificNotation: boolean;
  floatingNumbers: boolean;
  particles: boolean;
  highContrast: boolean;
  language?: 'vi' | 'en';
}

export interface ActiveBoost {
  id: string;
  name: string;
  multiplier: number;
  remainingSeconds: number;
  icon: string;
}

export interface GameState {
  version: number;
  essence: number;
  totalEssence: number;
  astralShards: number;
  totalAstralShards: number;
  astralGems: number;
  
  level: number;
  currentExp: number;
  maxExp: number;
  skillPoints: number;

  totalClicks: number;
  bossesDefeated: number;
  prestigeCount: number;

  lastSaveTime: number;
  lastOfflineGain: number;

  upgrades: Upgrade[];
  relics: Relic[];
  skills: SkillNode[];
  achievements: Achievement[];
  gemShopItems: GemShopItem[];
  redeemedCodes: string[];
  
  settings: GameSettings;
  activeBoosts: ActiveBoost[];
}

export interface FloatingNumberItem {
  id: number;
  x: number;
  y: number;
  value: string;
  isCrit: boolean;
  scatterX: number;
  timestamp: number;
}
