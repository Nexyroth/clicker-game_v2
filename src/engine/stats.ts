import type { GameState } from './types';
import { achievementBuffPercent } from './bonusRules';

export interface ComputedStats {
  clickPower: number;
  cps: number;
  critChance: number;
  critMultiplier: number;
  frenzyMultiplier: number;
  potionMultiplierSum: number;
  potionMultiplier: number;
  achMultiplier: number;
  achBuffPercent: number;
}

export function computeStats(state: GameState): ComputedStats {
  let baseClick = 1;
  let baseCps = 0;

  // 1. Upgrades contribution
  if (state.upgrades) {
    state.upgrades.forEach((u) => {
      if (u.level > 0) {
        if (u.effectType === 'click') {
          baseClick += u.level * u.baseEffect;
        } else if (u.effectType === 'cps') {
          baseCps += u.level * u.baseEffect;
        }
      }
    });
  }

  // 2. Relic bonuses
  let relicClickMult = 1;
  let relicCpsMult = 1;
  let relicCritBonus = 0;
  if (state.relics) {
    state.relics.forEach((r) => {
      if (r.equipped) {
        if (r.clickBonus) relicClickMult += r.clickBonus;
        if (r.cpsBonus) relicCpsMult += r.cpsBonus;
        if (r.critBonus) relicCritBonus += r.critBonus;
      }
    });
  }

  // 3. Skills tree bonuses
  let skillClickMult = 1;
  let skillCpsMult = 1;
  let skillCritBonus = 0;
  let skillCritDamageBonus = 0;

  if (state.skills) {
    state.skills.forEach((s) => {
      if (s.unlocked) {
        const lvl = s.level || 1;
        if (s.id === 'chrono_pulse') skillCpsMult += lvl * 0.10;
        if (s.id === 'chrono_overclock') skillClickMult += lvl * 0.10;
        if (s.id === 'crit_focus') skillCritBonus += lvl * 0.05;
        if (s.id === 'crit_supernova') skillCritDamageBonus += lvl * 1.00;
        if (s.id === 'crit_chain') skillClickMult += lvl * 0.35;
        if (s.id === 'overdrive_synergy') skillCpsMult += lvl * 0.01 * (state.skillPoints || 0);
        if (s.id === 'overdrive_zenith') {
          skillClickMult += lvl * 0.05;
          skillCpsMult += lvl * 0.05;
          skillCritBonus += lvl * 0.02;
        }
        if (s.effectType === 'clickPower' && s.id !== 'crit_chain') skillClickMult += (s.effectPerLevel || 0.1) * lvl;
        if (s.effectType === 'cps' && s.id !== 'chrono_pulse') skillCpsMult += (s.effectPerLevel || 0.1) * lvl;
        if (s.effectType === 'critChance' && s.id !== 'crit_focus') skillCritBonus += (s.effectPerLevel || 0.05) * lvl;
      }
    });
  }

  // 4. Achievement real buff
  const achBuff = achievementBuffPercent(state);
  const achMultiplier = 1 + (achBuff / 100);

  // 5. Prestige shards bonus (+1% all per shard)
  const shardMult = 1 + ((state.astralShards || 0) * 0.01);

  // 6. Gem shop multipliers
  let gemMult = 1;
  let gemCritDamageBonus = 0;
  if (state.gemShopItems) {
    state.gemShopItems.forEach((item) => {
      if (item.purchased && item.id === 'gem_mult_1') gemMult *= item.value;
      if (item.purchased && item.id === 'gem_crit_overload') {
        relicCritBonus += 0.10;
        gemCritDamageBonus += 2.0;
      }
    });
  }

  // 7. Active boosts
  let frenzyMultiplier = 1;
  if (state.activeBoosts) {
    state.activeBoosts.forEach((b) => {
      if (b.multiplier) frenzyMultiplier *= b.multiplier;
    });
  }

  // 8. Timed Multiplier Potions
  let potionMultiplierSum = 0;
  if (state.activePotions) {
    if (state.activePotions.x2 > 0) potionMultiplierSum += 2;
    if (state.activePotions.x5 > 0) potionMultiplierSum += 5;
    if (state.activePotions.x10 > 0) potionMultiplierSum += 10;
    if (state.activePotions.x20 > 0) potionMultiplierSum += 20;
    if (state.activePotions.x50 > 0) potionMultiplierSum += 50;
    if (state.activePotions.x100 > 0) potionMultiplierSum += 100;
  }
  const potionMult = potionMultiplierSum > 0 ? potionMultiplierSum : 1;

  // 9. Game Passes
  let passEssenceMult = 1;
  let passCritChanceBonus = 0;
  let passCritDamageBonus = 0;
  if (state.gamePasses) {
    if (state.gamePasses.pass_double_essence || state.gamePasses.pass_ultimate_bundle) {
      passEssenceMult *= 2;
    }
    if (state.gamePasses.pass_crit_overdrive || state.gamePasses.pass_ultimate_bundle) {
      passCritChanceBonus += 0.10;
      passCritDamageBonus += 1.50;
    }
  }

  const finalClick = baseClick * relicClickMult * skillClickMult * shardMult * gemMult * potionMult * achMultiplier * passEssenceMult;
  const finalCps = baseCps * relicCpsMult * skillCpsMult * shardMult * gemMult * potionMult * achMultiplier * passEssenceMult;
  const critChance = Math.min(0.95, 0.05 + relicCritBonus + skillCritBonus + passCritChanceBonus);
  const critMult = 2.5 + skillCritDamageBonus + passCritDamageBonus + gemCritDamageBonus;

  return {
    clickPower: finalClick,
    cps: finalCps,
    critChance,
    critMultiplier: critMult,
    frenzyMultiplier,
    potionMultiplierSum,
    potionMultiplier: potionMult,
    achMultiplier,
    achBuffPercent: achBuff,
  };
}
