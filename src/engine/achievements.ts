export function achievementCurrents(state: any): number[] | null {
  if (!state || !state.achievements) return null;

  const equippedRelicsCount = (state.relics || []).filter((r: any) => r.equipped).length;
  const unlockedSkillsCount = (state.skills || []).filter((s: any) => s.unlocked).length;
  const luckSkillUnlocked = (state.skills || []).some((s: any) => s.branch === 'luck' && s.unlocked);
  const unlockedAchievementsCount = state.achievements.filter((a: any) => a.unlocked).length;

  return state.achievements.map((ach: any) => {
    switch (ach.type) {
      case 'clicks':
        return state.totalClicks;
      case 'essence':
        return Math.floor(state.totalEssence);
      case 'level':
        return state.level;
      case 'bosses':
        return state.bossesDefeated;
      case 'boss_daily':
        return state.dailyBossesDefeated || 0;
      case 'crits':
        return state.totalCrits || 0;
      case 'upgrades':
        return state.totalUpgradesBought || 0;
      case 'prestige':
        return state.prestigeCount;
      case 'skills_unlocked':
        return unlockedSkillsCount;
      case 'luck_branch':
        return luckSkillUnlocked ? 1 : 0;
      case 'relics_equipped':
        return equippedRelicsCount;
      case 'achievements_count':
        return unlockedAchievementsCount;
      case 'potion_x100':
        return (state.activePotions && state.activePotions.x100 > 0) ? 1 : 0;
      case 'potions_used':
        return state.potionsUsed || 0;
      default:
        return ach.current;
    }
  });
}
