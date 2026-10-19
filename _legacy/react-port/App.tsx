/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { User } from 'firebase/auth';
import { GameState, Upgrade, Relic, GemShopItem, Boss } from './types/game';
import { INITIAL_GAME_STATE, BOSS_PRESETS } from './data/initialState';
import { calculateUpgradeCost, formatNumber } from './utils/numeric';
import { sound } from './utils/audio';
import { initAuth } from './services/firebase';

import { Header } from './components/Header';
import { MainCore } from './components/MainCore';
import { UpgradesPanel } from './components/UpgradesPanel';
import { StatsPanel } from './components/StatsPanel';
import { SettingsModal } from './components/SettingsModal';
import { GemShopModal } from './components/GemShopModal';
import { BossPanel } from './components/BossPanel';
import { SkillTreeModal } from './components/SkillTreeModal';
import { InventoryModal } from './components/InventoryModal';
import { PrestigeModal } from './components/PrestigeModal';
import { AchievementsModal } from './components/AchievementsModal';
import { DriveModal } from './components/DriveModal';
import { CosmicRift } from './components/CosmicRift';
import { CosmicAudioProvider, useCosmicAudio } from './hooks/useCosmicAudio';

const SAVE_KEY = 'nexyroth_save_v4';

function NexyrothGame() {
  const { playLevelUp, playPrestige, playBossDefeat, playError } = useCosmicAudio();

  // Load initial state with offline progression
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as GameState;
        // Merge with initial state schema for forward compatibility
        return {
          ...INITIAL_GAME_STATE,
          ...parsed,
          settings: { ...INITIAL_GAME_STATE.settings, ...(parsed.settings || {}) },
        };
      }
    } catch {
      // fallback to initial
    }
    return INITIAL_GAME_STATE;
  });

  // Boss state
  const [currentBoss, setCurrentBoss] = useState<Boss>(BOSS_PRESETS[0]);

  // Auth & Cloud Save state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Active modal controllers
  const [modalOpen, setModalOpen] = useState<{
    settings: boolean;
    gemShop: boolean;
    boss: boolean;
    skills: boolean;
    inventory: boolean;
    prestige: boolean;
    achievements: boolean;
    drive: boolean;
  }>({
    settings: false,
    gemShop: false,
    boss: false,
    skills: false,
    inventory: false,
    prestige: false,
    achievements: false,
    drive: false,
  });

  // Offline Gain Banner
  const [offlineToast, setOfflineToast] = useState<{ essence: number; seconds: number } | null>(null);

  // Skill cooldowns (remaining seconds)
  const [skillCooldowns, setSkillCooldowns] = useState({
    overload: 0,
    surge: 0,
    warp: 0,
  });

  // Initialize Firebase Auth listener on app load
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe && unsubscribe();
  }, []);

  // Calculate offline gain on mount
  useEffect(() => {
    const now = Date.now();
    const lastSave = gameState.lastSaveTime || now;
    const diffSec = Math.floor((now - lastSave) / 1000);

    if (diffSec > 15) {
      // Calculate offline CPS
      const hasOfflineBonus = gameState.gemShopItems.find((i) => i.id === 'gem_offline_boost')?.purchased;
      const efficiency = hasOfflineBonus ? 1.0 : 0.5;

      // Base CPS calculation for offline
      let baseCps = 0;
      gameState.upgrades.forEach((u) => {
        if (u.effectType === 'cps') {
          baseCps += u.level * u.baseEffect;
        }
      });

      const gain = Math.floor(baseCps * diffSec * efficiency);
      if (gain > 0) {
        setGameState((prev) => ({
          ...prev,
          essence: prev.essence + gain,
          totalEssence: prev.totalEssence + gain,
          lastSaveTime: now,
          lastOfflineGain: gain,
        }));
        setOfflineToast({ essence: gain, seconds: diffSec });
      }
    }
  }, []);

  // Compute calculated stats (multipliers, total CPS, click power)
  const { clickPower, totalCps, critChance, critMultiplier, frenzyMultiplier } = useMemo(() => {
    let rawClick = 1;
    let rawCps = 0;

    gameState.upgrades.forEach((u) => {
      if (u.effectType === 'click') {
        rawClick += u.level * u.baseEffect;
      } else {
        rawCps += u.level * u.baseEffect;
      }
    });

    // Skills
    let skillClickMult = 1;
    let skillCpsMult = 1;
    let skillCritChance = 0.05; // 5% base
    let skillCritMult = 2.0;

    gameState.skills.forEach((s) => {
      if (s.unlocked) {
        if (s.effectType === 'clickPower') skillClickMult += s.effectValue;
        if (s.effectType === 'cps') skillCpsMult += s.effectValue;
        if (s.effectType === 'critChance') skillCritChance += s.effectValue;
        if (s.id === 'chrono_crit_1') skillCritMult += 1.0;
      }
    });

    // Relics
    let relicClickMult = 1;
    let relicCpsMult = 1;
    let relicCrit = 0;

    gameState.relics.forEach((r) => {
      if (r.equipped) {
        relicClickMult += r.clickBonus;
        relicCpsMult += r.cpsBonus;
        relicCrit += r.critBonus;
      }
    });

    // Gem Shop Permanent Upgrades
    let permanentMult = 1;
    const multItem = gameState.gemShopItems.find((i) => i.id === 'gem_mult_1');
    if (multItem?.purchased) {
      permanentMult *= 2;
    }
    const critOverload = gameState.gemShopItems.find((i) => i.id === 'gem_crit_overload');
    if (critOverload?.purchased) {
      skillCritChance += 0.1;
      skillCritMult += 2.0;
    }

    // Prestige Multiplier (+1% per shard)
    const prestigeMult = 1 + gameState.astralShards * 0.01;

    // Active Frenzy Boosts
    let activeFrenzy = 1;
    gameState.activeBoosts.forEach((b) => {
      activeFrenzy *= b.multiplier;
    });

    const finalClick = rawClick * skillClickMult * relicClickMult * permanentMult * prestigeMult;
    const finalCps = rawCps * skillCpsMult * relicCpsMult * permanentMult * prestigeMult;

    return {
      clickPower: Math.max(1, Math.floor(finalClick)),
      totalCps: Math.max(0, Math.floor(finalCps)),
      critChance: Math.min(0.85, skillCritChance + relicCrit),
      critMultiplier: skillCritMult,
      frenzyMultiplier: activeFrenzy,
    };
  }, [gameState]);

  // Main 100ms game loop tick
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Passive CPS generation
      const tickGain = (totalCps * frenzyMultiplier) / 10;

      // 2. Active Boost timers countdown
      setGameState((prev) => {
        let updatedBoosts = prev.activeBoosts
          .map((b) => ({ ...b, remainingSeconds: b.remainingSeconds - 0.1 }))
          .filter((b) => b.remainingSeconds > 0);

        return {
          ...prev,
          essence: prev.essence + tickGain,
          totalEssence: prev.totalEssence + tickGain,
          activeBoosts: updatedBoosts,
        };
      });

      // 3. Boss Timer Tick
      setCurrentBoss((prevBoss) => {
        if (!prevBoss.active) return prevBoss;
        const nextTime = Math.max(0, prevBoss.remainingTime - 0.1);
        if (nextTime <= 0) {
          sound.playError();
          return {
            ...prevBoss,
            active: false,
            remainingTime: prevBoss.timeLimit,
            currentHp: prevBoss.maxHp,
          };
        }
        return { ...prevBoss, remainingTime: parseFloat(nextTime.toFixed(1)) };
      });

      // 4. Skill Cooldowns Tick
      setSkillCooldowns((prev) => ({
        overload: Math.max(0, parseFloat((prev.overload - 0.1).toFixed(1))),
        surge: Math.max(0, parseFloat((prev.surge - 0.1).toFixed(1))),
        warp: Math.max(0, parseFloat((prev.warp - 0.1).toFixed(1))),
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [totalCps, frenzyMultiplier]);

  // Auto-Save to LocalStorage every 5 seconds
  useEffect(() => {
    const saveTimer = setInterval(() => {
      setGameState((prev) => {
        const stateToSave = { ...prev, lastSaveTime: Date.now() };
        try {
          localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
        } catch {
          // ignore
        }
        return stateToSave;
      });
    }, 5000);

    return () => clearInterval(saveTimer);
  }, []);

  // Update Achievements progress dynamically
  useEffect(() => {
    setGameState((prev) => {
      let changed = false;
      const updatedAchievements = prev.achievements.map((ach) => {
        let current = ach.current;
        if (ach.type === 'clicks') current = prev.totalClicks;
        if (ach.type === 'essence') current = Math.floor(prev.totalEssence);
        if (ach.type === 'level') current = prev.level;
        if (ach.type === 'bosses') current = prev.bossesDefeated;
        if (ach.type === 'prestige') current = prev.prestigeCount;

        if (current !== ach.current) {
          changed = true;
          return { ...ach, current };
        }
        return ach;
      });

      return changed ? { ...prev, achievements: updatedAchievements } : prev;
    });
  }, [gameState.totalClicks, gameState.totalEssence, gameState.level, gameState.bossesDefeated, gameState.prestigeCount]);

  // Handle core click
  const handleCoreClick = useCallback((gain: number) => {
    setGameState((prev) => {
      const nextExp = prev.currentExp + 1;
      let nextLevel = prev.level;
      let nextMaxExp = prev.maxExp;
      let nextSkillPoints = prev.skillPoints;

      if (nextExp >= prev.maxExp) {
        nextLevel += 1;
        nextMaxExp = Math.floor(prev.maxExp * 1.35);
        nextSkillPoints += 1;
        playLevelUp();
      }

      return {
        ...prev,
        essence: prev.essence + gain,
        totalEssence: prev.totalEssence + gain,
        totalClicks: prev.totalClicks + 1,
        level: nextLevel,
        currentExp: nextExp >= prev.maxExp ? 0 : nextExp,
        maxExp: nextMaxExp,
        skillPoints: nextSkillPoints,
      };
    });
  }, []);

  // Handle buy upgrade
  const handleBuyUpgrade = useCallback((upgradeId: string, count: number, totalCost: number) => {
    setGameState((prev) => ({
      ...prev,
      essence: Math.max(0, prev.essence - totalCost),
      upgrades: prev.upgrades.map((u) =>
        u.id === upgradeId ? { ...u, level: u.level + count } : u
      ),
    }));
  }, []);

  // Handle activate quick skills
  const handleActivateSkill = useCallback((skillId: 'overload' | 'surge' | 'warp') => {
    if (skillId === 'overload') {
      sound.playPurchase();
      setSkillCooldowns((prev) => ({ ...prev, overload: 45 }));
      setGameState((prev) => ({
        ...prev,
        activeBoosts: [
          ...prev.activeBoosts,
          { id: 'skill_overload', name: 'Void Overload', multiplier: 3, remainingSeconds: 15, icon: 'zap' },
        ],
      }));
    } else if (skillId === 'surge') {
      sound.playLevelUp();
      setSkillCooldowns((prev) => ({ ...prev, surge: 60 }));
      const instantGain = totalCps * 30;
      setGameState((prev) => ({
        ...prev,
        essence: prev.essence + instantGain,
        totalEssence: prev.totalEssence + instantGain,
      }));
    } else if (skillId === 'warp') {
      sound.playPurchase();
      setSkillCooldowns((prev) => ({ ...prev, warp: 90 }));
      setGameState((prev) => ({
        ...prev,
        activeBoosts: [
          ...prev.activeBoosts,
          { id: 'skill_warp', name: 'Temporal Warp', multiplier: 2, remainingSeconds: 20, icon: 'clock' },
        ],
      }));
    }
  }, [totalCps]);

  // Handle Buy Gem Shop item
  const handleBuyGemItem = useCallback((item: GemShopItem) => {
    setGameState((prev) => {
      if (prev.astralGems < item.costGems) return prev;
      return {
        ...prev,
        astralGems: prev.astralGems - item.costGems,
        gemShopItems: prev.gemShopItems.map((i) =>
          i.id === item.id ? { ...i, purchased: true } : i
        ),
      };
    });
  }, []);

  // Handle Promo Code redemption
  const handleRedeemCode = useCallback((code: string) => {
    const upper = code.trim().toUpperCase();
    if (gameState.redeemedCodes.includes(upper)) {
      return { success: false, message: 'This code has already been redeemed!' };
    }

    const CODES: Record<string, { gems: number; shards?: number; essence?: number; desc: string }> = {
      TANTHU: { gems: 200, shards: 50, essence: 20000, desc: 'Tân Thủ: +200 Gems, +50 Shards, +20,000 Essence!' },
      NEXYROTH: { gems: 150, shards: 30, essence: 5000, desc: 'Nexyroth: +150 Gems, +30 Shards, +5,000 Essence!' },
      VIP999: { gems: 500, shards: 100, essence: 100000, desc: 'VIP999: +500 Gems, +100 Shards, +100,000 Essence!' },
      COSMIC: { gems: 100, shards: 20, essence: 50000, desc: 'Cosmic: +100 Gems, +20 Shards, +50,000 Essence!' },
      PHASE4: { gems: 250, shards: 25, desc: 'Phase 4: +250 Gems, +25 Shards!' },
      NEXYROTH2026: { gems: 100, desc: '+100 Astral Gems!' },
      COSMICVOID: { gems: 75, desc: '+75 Astral Gems!' },
      LUCKYGEM: { gems: 25, desc: '+25 Astral Gems!' },
    };

    if (CODES[upper]) {
      const reward = CODES[upper];
      setGameState((prev) => ({
        ...prev,
        astralGems: prev.astralGems + reward.gems,
        astralShards: prev.astralShards + (reward.shards || 0),
        totalAstralShards: prev.totalAstralShards + (reward.shards || 0),
        essence: prev.essence + (reward.essence || 0),
        totalEssence: prev.totalEssence + (reward.essence || 0),
        redeemedCodes: [...prev.redeemedCodes, upper],
      }));
      return {
        success: true,
        message: `Thành công! ${reward.desc}`,
        rewardGems: reward.gems,
      };
    }

    return { success: false, message: 'Mã không hợp lệ. Vui lòng kiểm tra lại!' };
  }, [gameState.redeemedCodes]);

  // Boss Combat Handlers
  const handleStartBoss = useCallback((bossId: string) => {
    const preset = BOSS_PRESETS.find((b) => b.id === bossId) || BOSS_PRESETS[0];
    setCurrentBoss({
      ...preset,
      currentHp: preset.maxHp,
      remainingTime: preset.timeLimit,
      active: true,
    });
    sound.playClick(true);
  }, []);

  const handleHitBoss = useCallback((damage: number) => {
    setCurrentBoss((prev) => {
      if (!prev.active) return prev;
      const nextHp = Math.max(0, prev.currentHp - damage);

      if (nextHp <= 0) {
        sound.playBossVictory();
        setGameState((g) => ({
          ...g,
          astralGems: g.astralGems + prev.rewardGems,
          astralShards: g.astralShards + prev.rewardShards,
          totalAstralShards: g.totalAstralShards + prev.rewardShards,
          currentExp: g.currentExp + prev.rewardExp,
          bossesDefeated: g.bossesDefeated + 1,
        }));

        // Cycle to next boss preset
        const nextIndex = (prev.level % BOSS_PRESETS.length);
        const nextPreset = BOSS_PRESETS[nextIndex];

        return {
          ...nextPreset,
          active: false,
          currentHp: nextPreset.maxHp,
          remainingTime: nextPreset.timeLimit,
        };
      }

      return { ...prev, currentHp: nextHp };
    });
  }, []);

  const handleFleeBoss = useCallback(() => {
    setCurrentBoss((prev) => ({
      ...prev,
      active: false,
      currentHp: prev.maxHp,
      remainingTime: prev.timeLimit,
    }));
  }, []);

  // Skill Tree Unlock
  const handleUnlockSkill = useCallback((skillId: string) => {
    setGameState((prev) => {
      const skill = prev.skills.find((s) => s.id === skillId);
      if (!skill || prev.skillPoints < skill.costPoints) return prev;

      return {
        ...prev,
        skillPoints: prev.skillPoints - skill.costPoints,
        skills: prev.skills.map((s) => (s.id === skillId ? { ...s, unlocked: true } : s)),
      };
    });
  }, []);

  // Relic Vault Equip/Unequip
  const handleToggleEquipRelic = useCallback((relicId: string) => {
    setGameState((prev) => ({
      ...prev,
      relics: prev.relics.map((r) =>
        r.id === relicId ? { ...r, equipped: !r.equipped } : r
      ),
    }));
  }, []);

  // Claim Achievement
  const handleClaimAchievement = useCallback((achId: string, rewardGems: number) => {
    setGameState((prev) => ({
      ...prev,
      astralGems: prev.astralGems + rewardGems,
      achievements: prev.achievements.map((a) =>
        a.id === achId ? { ...a, unlocked: true } : a
      ),
    }));
  }, []);

  // Prestige (Ascension)
  const handlePerformPrestige = useCallback((shardsToGain: number) => {
    playPrestige();
    setGameState((prev) => ({
      ...prev,
      essence: 0,
      astralShards: prev.astralShards + shardsToGain,
      totalAstralShards: prev.totalAstralShards + shardsToGain,
      level: 1,
      currentExp: 0,
      maxExp: 100,
      skillPoints: 0,
      prestigeCount: prev.prestigeCount + 1,
      upgrades: prev.upgrades.map((u) => ({ ...u, level: 0 })),
      activeBoosts: [],
    }));
    setCurrentBoss((b) => ({ ...b, active: false, currentHp: b.maxHp }));
  }, [playPrestige]);

  // Cosmic Rift Collector
  const handleCosmicRiftCollect = useCallback((type: 'frenzy' | 'gems', value: number) => {
    if (type === 'frenzy') {
      setGameState((prev) => ({
        ...prev,
        activeBoosts: [
          ...prev.activeBoosts,
          { id: `rift_${Date.now()}`, name: 'Cosmic Anomaly Frenzy', multiplier: value, remainingSeconds: 20, icon: 'sparkles' },
        ],
      }));
    } else {
      setGameState((prev) => ({
        ...prev,
        astralGems: prev.astralGems + value,
      }));
    }
  }, []);

  // Settings & Save handlers
  const handleUpdateSettings = useCallback((newSettings: Partial<GameState['settings']>) => {
    setGameState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  }, []);

  const handleManualSave = useCallback(() => {
    const toSave = { ...gameState, lastSaveTime: Date.now() };
    localStorage.setItem(SAVE_KEY, JSON.stringify(toSave));
    setGameState(toSave);
  }, [gameState]);

  const handleResetGame = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    setGameState(INITIAL_GAME_STATE);
    setCurrentBoss(BOSS_PRESETS[0]);
  }, []);

  const handleExportSave = useCallback(() => {
    const json = JSON.stringify(gameState, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexyroth_save_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [gameState]);

  const handleImportSave = useCallback((jsonStr: string) => {
    const parsed = JSON.parse(jsonStr) as GameState;
    if (parsed.version) {
      setGameState(parsed);
      localStorage.setItem(SAVE_KEY, JSON.stringify(parsed));
    }
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Background Graphic Wallpaper */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src="/src/assets/images/nexyroth_realm_backdrop_1790314664094.jpg"
          alt="Cosmic Void Backdrop"
          className="w-full h-full object-cover opacity-20"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/90 to-slate-950" />
      </div>

      {/* Header Bar */}
      <Header
        essence={gameState.essence}
        astralShards={gameState.astralShards}
        astralGems={gameState.astralGems}
        scientificNotation={gameState.settings.scientificNotation}
        onOpenGemShop={() => setModalOpen((prev) => ({ ...prev, gemShop: true }))}
        onOpenSettings={() => setModalOpen((prev) => ({ ...prev, settings: true }))}
        onOpenDrive={() => setModalOpen((prev) => ({ ...prev, drive: true }))}
        isDriveConnected={!!currentUser}
      />

      {/* Offline Progress Toast */}
      {offlineToast && (
        <div className="mx-4 mt-3 p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-xs flex items-center justify-between z-20 shadow-lg">
          <div>
            <span className="font-bold text-cyan-300">Welcome Back, Cosmic Traveler! </span>
            <span className="text-slate-300">
              While away for {Math.floor(offlineToast.seconds / 60)} min, your conduits gathered{' '}
              <strong className="text-sky-300 font-mono">
                +{formatNumber(offlineToast.essence, gameState.settings.scientificNotation)}
              </strong>{' '}
              Cosmic Essence!
            </span>
          </div>
          <button
            onClick={() => setOfflineToast(null)}
            className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold cursor-pointer"
          >
            Claim
          </button>
        </div>
      )}

      {/* Main 3-Column Desktop / Responsive Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 md:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 z-10 overflow-hidden">
        {/* Left Column (Desktop 3 cols): Stats & Quick Navigation */}
        <section className="order-2 lg:order-1 lg:col-span-3 h-[420px] lg:h-[calc(100vh-6.5rem)] flex flex-col">
          <StatsPanel
            gameState={gameState}
            cps={totalCps}
            clickPower={clickPower}
            frenzyMultiplier={frenzyMultiplier}
            onOpenBoss={() => setModalOpen((prev) => ({ ...prev, boss: true }))}
            onOpenSkills={() => setModalOpen((prev) => ({ ...prev, skills: true }))}
            onOpenInventory={() => setModalOpen((prev) => ({ ...prev, inventory: true }))}
            onOpenPrestige={() => setModalOpen((prev) => ({ ...prev, prestige: true }))}
            onOpenAchievements={() => setModalOpen((prev) => ({ ...prev, achievements: true }))}
          />
        </section>

        {/* Center Column (Desktop 5 cols): Overhauled Cosmic Core (TASK 4.4) */}
        <section className="order-1 lg:order-2 lg:col-span-5 flex flex-col items-center justify-center min-h-[380px] lg:h-[calc(100vh-6.5rem)]">
          <MainCore
            clickPower={clickPower}
            critChance={critChance}
            critMultiplier={critMultiplier}
            frenzyMultiplier={frenzyMultiplier}
            scientificNotation={gameState.settings.scientificNotation}
            floatingEnabled={gameState.settings.floatingNumbers}
            onCoreClick={handleCoreClick}
            onActivateSkill={handleActivateSkill}
            skillCooldowns={skillCooldowns}
          />
        </section>

        {/* Right Column (Desktop 4 cols): UPGRADES AT THE TOP! (TASK 4.2) */}
        <section className="order-3 lg:order-3 lg:col-span-4 h-[420px] lg:h-[calc(100vh-6.5rem)] flex flex-col">
          <UpgradesPanel
            upgrades={gameState.upgrades}
            essence={gameState.essence}
            playerLevel={gameState.level}
            scientificNotation={gameState.settings.scientificNotation}
            onBuyUpgrade={handleBuyUpgrade}
          />
        </section>
      </main>

      {/* Spontaneous Cosmic Rift Anomaly */}
      <CosmicRift onCollect={handleCosmicRiftCollect} />

      {/* Modals */}
      {/* TASK 4.1: Settings Modal with 90vh max-height, backdrop & ESC close */}
      <SettingsModal
        isOpen={modalOpen.settings}
        onClose={() => setModalOpen((prev) => ({ ...prev, settings: false }))}
        settings={gameState.settings}
        onUpdateSettings={handleUpdateSettings}
        onManualSave={handleManualSave}
        onResetGame={handleResetGame}
        onExportSave={handleExportSave}
        onImportSave={handleImportSave}
        onRedeemCode={handleRedeemCode}
      />

      {/* TASK 4.3: Standalone Gem Shop Modal with 'G' shortcut */}
      <GemShopModal
        isOpen={modalOpen.gemShop}
        onClose={() => setModalOpen((prev) => ({ ...prev, gemShop: false }))}
        astralGems={gameState.astralGems}
        items={gameState.gemShopItems}
        redeemedCodes={gameState.redeemedCodes}
        onBuyItem={handleBuyGemItem}
        onRedeemCode={handleRedeemCode}
      />

      {/* Boss Encounters Modal */}
      <BossPanel
        isOpen={modalOpen.boss}
        onClose={() => setModalOpen((prev) => ({ ...prev, boss: false }))}
        boss={currentBoss}
        clickPower={clickPower}
        frenzyMultiplier={frenzyMultiplier}
        scientificNotation={gameState.settings.scientificNotation}
        onHitBoss={handleHitBoss}
        onStartBoss={handleStartBoss}
        onFleeBoss={handleFleeBoss}
      />

      {/* Skill Tree Modal */}
      <SkillTreeModal
        isOpen={modalOpen.skills}
        onClose={() => setModalOpen((prev) => ({ ...prev, skills: false }))}
        skills={gameState.skills}
        skillPoints={gameState.skillPoints}
        onUnlockSkill={handleUnlockSkill}
      />

      {/* Relic Vault / Inventory Modal */}
      <InventoryModal
        isOpen={modalOpen.inventory}
        onClose={() => setModalOpen((prev) => ({ ...prev, inventory: false }))}
        relics={gameState.relics}
        onToggleEquip={handleToggleEquipRelic}
      />

      {/* Prestige / Astral Rebirth Modal */}
      <PrestigeModal
        isOpen={modalOpen.prestige}
        onClose={() => setModalOpen((prev) => ({ ...prev, prestige: false }))}
        essence={gameState.essence}
        totalAstralShards={gameState.totalAstralShards}
        prestigeCount={gameState.prestigeCount}
        scientificNotation={gameState.settings.scientificNotation}
        onPerformPrestige={handlePerformPrestige}
      />

      {/* Achievements Modal */}
      <AchievementsModal
        isOpen={modalOpen.achievements}
        onClose={() => setModalOpen((prev) => ({ ...prev, achievements: false }))}
        achievements={gameState.achievements}
        onClaimAchievement={handleClaimAchievement}
      />

      {/* Google Drive Cloud Save Sync Modal */}
      <DriveModal
        isOpen={modalOpen.drive}
        onClose={() => setModalOpen((prev) => ({ ...prev, drive: false }))}
        currentUser={currentUser}
        accessToken={accessToken}
        gameState={gameState}
        onApplyLoadedSave={(loaded) => setGameState(loaded)}
        onUserAuthChange={(user, token) => {
          setCurrentUser(user);
          setAccessToken(token);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <CosmicAudioProvider>
      <NexyrothGame />
    </CosmicAudioProvider>
  );
}

