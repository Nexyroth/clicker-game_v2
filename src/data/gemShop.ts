export const DEFAULT_GEM_SHOP_ITEMS = [
  { id: 'gem_mult_1', name: 'Void Surge Prism', desc: 'Permanently doubles (x2) all Essence generation across all runs.', costGems: 40, purchased: false, value: 2 },
  { id: 'gem_auto_click', name: 'Astral Drone', desc: 'Automatically clicks Core 5 times/sec continuously.', costGems: 60, purchased: false, value: 5 },
  { id: 'gem_offline_boost', name: 'Stasis Chamber', desc: 'Offline progress efficiency boosted to 100% full speed.', costGems: 50, purchased: false, value: 1 },
  { id: 'gem_crit_overload', name: 'Astral Supernova', desc: 'Permanently boosts Critical Strike Chance by +10% and Power by +200%.', costGems: 70, purchased: false, value: 0.1 }
] as const;

export type GemShopItemDef = (typeof DEFAULT_GEM_SHOP_ITEMS)[number];
