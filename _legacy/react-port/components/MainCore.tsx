import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FloatingNumberItem } from '../types/game';
import { formatNumber } from '../utils/numeric';
import { useCosmicAudio } from '../hooks/useCosmicAudio';
import { FloatingNumbers } from './FloatingNumbers';
import { Sparkles, Zap, Flame, Clock, TrendingUp } from 'lucide-react';

interface Props {
  clickPower: number;
  critChance: number;
  critMultiplier: number;
  frenzyMultiplier: number;
  scientificNotation: boolean;
  floatingEnabled: boolean;
  onCoreClick: (amount: number, isCrit: boolean) => void;
  onActivateSkill: (skillId: 'overload' | 'surge' | 'warp') => void;
  skillCooldowns: {
    overload: number; // remaining seconds
    surge: number;
    warp: number;
  };
}

interface RippleItem {
  id: number;
  x: number;
  y: number;
}

interface MilestoneTooltipState {
  milestone: number;
  multiplier: number;
  key: number;
}

const POOL_SIZE = 30;
const COMBO_TIMEOUT_MS = 3000; // Reset after 3 seconds of inactivity

export const MainCore: React.FC<Props> = ({
  clickPower,
  critChance,
  critMultiplier,
  frenzyMultiplier,
  scientificNotation,
  floatingEnabled,
  onCoreClick,
  onActivateSkill,
  skillCooldowns,
}) => {
  const [floatingPool, setFloatingPool] = useState<FloatingNumberItem[]>([]);
  const [ripples, setRipples] = useState<RippleItem[]>([]);
  const [isPressing, setIsPressing] = useState(false);
  const [lastCrit, setLastCrit] = useState(false);
  const [isCritFlashing, setIsCritFlashing] = useState(false);

  // Combo tracking states
  const [comboHits, setComboHits] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1.0);
  const [recentCps, setRecentCps] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [milestoneTooltip, setMilestoneTooltip] = useState<MilestoneTooltipState | null>(null);

  const poolIndexRef = useRef(0);
  const rippleIndexRef = useRef(0);
  const coreRef = useRef<HTMLDivElement>(null);
  const { playClick } = useCosmicAudio();

  // Refs for timer and combo tracking
  const comboHitsRef = useRef(0);
  const lastClickTimeRef = useRef(0);
  const clickTimestampsRef = useRef<number[]>([]);
  const decayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const milestoneTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const critFlashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (decayIntervalRef.current) clearInterval(decayIntervalRef.current);
      if (milestoneTimeoutRef.current) clearTimeout(milestoneTimeoutRef.current);
      if (critFlashTimeoutRef.current) clearTimeout(critFlashTimeoutRef.current);
    };
  }, []);

  // Interval loop for combo decay & 3-second reset
  const startDecayWatcher = useCallback(() => {
    if (decayIntervalRef.current) return;

    decayIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastClickTimeRef.current;
      const leftMs = COMBO_TIMEOUT_MS - elapsed;

      // Filter recent timestamps for CPS calculation
      clickTimestampsRef.current = clickTimestampsRef.current.filter((t) => now - t <= 1500);
      const activeCps = clickTimestampsRef.current.length > 0
        ? Number((clickTimestampsRef.current.length / 1.5).toFixed(1))
        : 0;
      setRecentCps(activeCps);

      if (leftMs <= 0) {
        // 3 seconds passed without clicks -> reset combo
        comboHitsRef.current = 0;
        setComboHits(0);
        setComboMultiplier(1.0);
        setRecentCps(0);
        setRemainingTime(0);
        setMilestoneTooltip(null);
        if (decayIntervalRef.current) {
          clearInterval(decayIntervalRef.current);
          decayIntervalRef.current = null;
        }
      } else {
        setRemainingTime(Math.max(0, leftMs / 1000));
      }
    }, 50);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      const now = Date.now();
      lastClickTimeRef.current = now;

      // Record timestamp for CPS
      clickTimestampsRef.current.push(now);
      clickTimestampsRef.current = clickTimestampsRef.current.filter((t) => now - t <= 1500);
      const activeCps = Number((clickTimestampsRef.current.length / 1.5).toFixed(1));
      setRecentCps(activeCps);

      // Increment Combo count
      const nextComboHits = comboHitsRef.current + 1;
      comboHitsRef.current = nextComboHits;
      setComboHits(nextComboHits);
      setRemainingTime(COMBO_TIMEOUT_MS / 1000);

      // Calculate Combo Multiplier:
      // - Grows with combo count (milestone tiers) + speed bonus based on clicks per second
      const tier = Math.floor(nextComboHits / 10);
      const progressInTier = nextComboHits % 10;
      const baseComboMult = 1.0 + tier * 0.2 + progressInTier * 0.015;
      const cpsBonus = Math.min(1.5, Math.max(0, (activeCps - 1) * 0.08));
      const nextMultiplier = Number(Math.min(10.0, Math.max(1.0, baseComboMult + cpsBonus)).toFixed(2));
      setComboMultiplier(nextMultiplier);

      // Start watcher if not already running
      startDecayWatcher();

      // Check for Combo Milestone (every 10 hits: 10, 20, 30, ...)
      if (nextComboHits % 10 === 0) {
        setMilestoneTooltip({
          milestone: nextComboHits,
          multiplier: nextMultiplier,
          key: now,
        });

        if (milestoneTimeoutRef.current) {
          clearTimeout(milestoneTimeoutRef.current);
        }
        milestoneTimeoutRef.current = setTimeout(() => {
          setMilestoneTooltip(null);
        }, 2500);
      }

      // Calculate Crit & Gains
      const isCrit = Math.random() < critChance;
      const baseGain = clickPower * frenzyMultiplier * nextMultiplier;
      const finalGain = isCrit ? baseGain * critMultiplier : baseGain;

      setLastCrit(isCrit);

      // Trigger bright white flash overlay on critical hit
      if (isCrit) {
        setIsCritFlashing(true);
        if (critFlashTimeoutRef.current) {
          clearTimeout(critFlashTimeoutRef.current);
        }
        critFlashTimeoutRef.current = setTimeout(() => {
          setIsCritFlashing(false);
        }, 150);
      }

      playClick(isCrit);
      onCoreClick(finalGain, isCrit);

      // Coordinates relative to core
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      if (coreRef.current) {
        const rect = coreRef.current.getBoundingClientRect();
        const relX = clientX - rect.left;
        const relY = clientY - rect.top;

        // Add ripple
        const nextRippleId = rippleIndexRef.current++;
        setRipples((prev) => [
          ...prev.slice(-8), // Keep max 8 ripples
          { id: nextRippleId, x: relX, y: relY },
        ]);

        // Add floating number if enabled
        if (floatingEnabled) {
          const scatterX = (Math.random() - 0.5) * 50;
          const nextPoolId = poolIndexRef.current++;
          const newItem: FloatingNumberItem = {
            id: nextPoolId,
            x: relX,
            y: relY,
            value: formatNumber(finalGain, scientificNotation),
            isCrit,
            scatterX,
            timestamp: Date.now(),
          };

          setFloatingPool((prev) => {
            const next = [...prev, newItem];
            if (next.length > POOL_SIZE) {
              return next.slice(next.length - POOL_SIZE);
            }
            return next;
          });
        }
      }
    },
    [
      clickPower,
      critChance,
      critMultiplier,
      frenzyMultiplier,
      scientificNotation,
      floatingEnabled,
      onCoreClick,
      playClick,
      startDecayWatcher,
    ]
  );

  // Styling helpers for combo heat
  const isComboActive = comboHits > 0;
  const progressToNextMilestone = ((comboHits % 10) / 10) * 100;
  const decayPercentage = (remainingTime / (COMBO_TIMEOUT_MS / 1000)) * 100;

  const comboTheme =
    comboHits >= 50
      ? 'from-rose-500 via-fuchsia-500 to-amber-400'
      : comboHits >= 20
      ? 'from-amber-400 via-orange-500 to-yellow-300'
      : 'from-cyan-400 via-sky-500 to-indigo-400';

  return (
    <div className="flex flex-col items-center justify-between w-full h-full p-4 relative select-none">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col items-center text-center z-10 space-y-1">
        <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Dimensional Conduit</span>
        </div>
        <div className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-200 to-fuchsia-300 tracking-tight">
          Nexyroth Core
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-3">
          <span>
            Click:{' '}
            <strong className="text-sky-300 font-mono">
              +{formatNumber(clickPower * frenzyMultiplier * comboMultiplier, scientificNotation)}
            </strong>
          </span>
          <span>·</span>
          <span>
            Crit: <strong className="text-amber-300 font-mono">{(critChance * 100).toFixed(1)}%</strong> ({critMultiplier}x)
          </span>
        </div>
      </div>

      {/* Persistent 'Combo Multiplier' Bar above Click Area */}
      <div className="w-full max-w-sm z-10 my-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 shadow-lg backdrop-blur-md transition-all duration-200">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Flame
              className={`w-4 h-4 transition-colors duration-200 ${
                isComboActive
                  ? comboHits >= 50
                    ? 'text-rose-400 animate-pulse'
                    : comboHits >= 20
                    ? 'text-amber-400 animate-bounce'
                    : 'text-cyan-400'
                  : 'text-slate-500'
              }`}
            />
            <span className="text-xs font-bold tracking-wide text-slate-200 uppercase flex items-center gap-1">
              Combo Multiplier
            </span>
            {isComboActive && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-slate-800 text-sky-300 border border-sky-500/30 font-mono">
                {comboHits} {comboHits === 1 ? 'Hit' : 'Hits'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isComboActive && (
              <span className="text-[10px] text-slate-400 font-mono flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3 text-cyan-400" />
                {recentCps} CPS
              </span>
            )}
            <div
              className={`font-mono font-black text-xs px-2 py-0.5 rounded-md border ${
                isComboActive
                  ? 'bg-cyan-950/80 border-cyan-400/50 text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                  : 'bg-slate-800/60 border-slate-700/50 text-slate-400'
              }`}
            >
              {comboMultiplier.toFixed(2)}x
            </div>
          </div>
        </div>

        {/* Multi-tier progress & decay indicator */}
        <div className="space-y-1">
          {/* Main Combo Progress Gauge */}
          <div className="w-full h-1.5 bg-slate-950/80 rounded-full overflow-hidden border border-slate-800 flex">
            <div
              className={`h-full bg-gradient-to-r ${comboTheme} transition-all duration-100 rounded-full shadow-sm`}
              style={{
                width: isComboActive
                  ? `${Math.max(8, progressToNextMilestone === 0 ? 100 : progressToNextMilestone)}%`
                  : '0%',
              }}
            />
          </div>

          {/* Activity Decay Timer Bar (Resets if no click within 3 seconds) */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 px-0.5 pt-0.5">
            <span className="text-[10px] text-slate-500">
              {isComboActive ? `Next milestone: ${Math.ceil((comboHits + 0.1) / 10) * 10} hits` : 'Click to build combo'}
            </span>
            <span className="font-mono text-[10px]">
              {isComboActive ? (
                <span className={remainingTime < 1.0 ? 'text-rose-400 font-bold animate-pulse' : 'text-slate-400'}>
                  Decay in {remainingTime.toFixed(1)}s
                </span>
              ) : (
                <span className="text-slate-600">Idle (3.0s window)</span>
              )}
            </span>
          </div>

          {/* Active 3s timeout indicator bar */}
          {isComboActive && (
            <div className="w-full h-0.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-75 ${
                  remainingTime < 1.0 ? 'bg-rose-500' : 'bg-cyan-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, decayPercentage))}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Core Interactive Sphere Area */}
      <div className="relative my-2 flex items-center justify-center">
        {/* Outer Rotating Runic Ring */}
        <div className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full border border-dashed border-cyan-500/30 animate-core-rotate pointer-events-none" />
        {/* Inner Counter-Rotating Orbit */}
        <div className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full border border-violet-500/20 border-t-cyan-400/50 animate-core-reverse pointer-events-none" />

        {/* Prominent Animated Tooltip on Combo Milestone (every 10 hits) */}
        {milestoneTooltip && (
          <div
            key={milestoneTooltip.key}
            className="absolute -top-12 z-30 pointer-events-none animate-milestone-pop flex flex-col items-center"
          >
            <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-950/95 via-slate-900/95 to-cyan-950/95 border-2 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.6)] backdrop-blur-md flex items-center gap-2.5">
              <div className="p-1 rounded-full bg-amber-500/20 text-amber-300">
                <Flame className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex flex-col text-left">
                <div className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                  Combo Milestone! {milestoneTooltip.milestone} Hits
                </div>
                <div className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-sky-200 to-white font-mono">
                  Temporary Multiplier: {milestoneTooltip.multiplier.toFixed(2)}x
                </div>
              </div>
            </div>
            {/* Tooltip downward pointer arrow */}
            <div className="w-3 h-3 rotate-45 bg-slate-900 border-r-2 border-b-2 border-amber-400 -mt-1.5 shadow-sm" />
          </div>
        )}

        {/* The Clickable Core Container */}
        <div
          ref={coreRef}
          onMouseDown={() => setIsPressing(true)}
          onMouseUp={() => setIsPressing(false)}
          onMouseLeave={() => setIsPressing(false)}
          onTouchStart={() => setIsPressing(true)}
          onTouchEnd={() => setIsPressing(false)}
          onClick={handleClick}
          className={`relative w-48 h-48 md:w-64 md:h-64 rounded-full cursor-pointer overflow-hidden transition-all duration-100 ease-out select-none flex items-center justify-center ${
            isPressing
              ? 'scale-90 shadow-[0_0_30px_rgba(56,189,248,0.8)]'
              : 'hover:scale-105 shadow-[0_0_50px_rgba(56,189,248,0.35)]'
          } ${
            isCritFlashing
              ? 'ring-4 ring-amber-300 shadow-[0_0_60px_rgba(255,255,255,0.9)]'
              : lastCrit
              ? 'ring-2 ring-amber-400'
              : 'ring-1 ring-cyan-500/40'
          }`}
        >
          {/* Core Crystal Asset Image */}
          <img
            src="/src/assets/images/nexyroth_core_crystal_1790314625863.jpg"
            alt="Nexyroth Core Crystal"
            className="w-full h-full object-cover rounded-full pointer-events-none"
            referrerPolicy="no-referrer"
          />

          {/* Holographic Energy Overlay */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-cyan-950/60 via-transparent to-indigo-900/30 pointer-events-none" />

          {/* Bright White Flash Overlay on Critical Hit */}
          <div
            className={`absolute inset-0 rounded-full pointer-events-none transition-opacity duration-150 z-20 ${
              isCritFlashing
                ? 'opacity-95 bg-white shadow-[0_0_60px_rgba(255,255,255,1)]'
                : 'opacity-0'
            }`}
          />

          {/* Ripples */}
          {ripples.map((rip) => (
            <div
              key={rip.id}
              className="absolute w-20 h-20 rounded-full border-2 border-cyan-300 pointer-events-none animate-ripple"
              style={{ left: `${rip.x}px`, top: `${rip.y}px` }}
            />
          ))}

          {/* Floating Numbers Layer */}
          <FloatingNumbers items={floatingPool} />
        </div>
      </div>

      {/* Active Skills Quickbar */}
      <div className="w-full max-w-sm z-10 flex items-center justify-center gap-2 pt-2">
        {/* Skill 1: Void Overload */}
        <button
          onClick={() => onActivateSkill('overload')}
          disabled={skillCooldowns.overload > 0}
          className={`flex-1 flex flex-col items-center justify-center p-2 rounded-xl border text-xs transition-all relative overflow-hidden ${
            skillCooldowns.overload > 0
              ? 'bg-slate-900/60 border-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-indigo-950/50 hover:bg-indigo-900/60 border-indigo-500/40 text-indigo-200 active:scale-95 shadow-sm'
          }`}
          title="3x Click Power for 15s"
        >
          <Zap className="w-4 h-4 mb-0.5 text-indigo-400" />
          <span className="font-semibold text-[11px] truncate">Overload</span>
          {skillCooldowns.overload > 0 && (
            <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center font-mono font-bold text-xs text-indigo-300">
              {skillCooldowns.overload}s
            </div>
          )}
        </button>

        {/* Skill 2: Astral Surge */}
        <button
          onClick={() => onActivateSkill('surge')}
          disabled={skillCooldowns.surge > 0}
          className={`flex-1 flex flex-col items-center justify-center p-2 rounded-xl border text-xs transition-all relative overflow-hidden ${
            skillCooldowns.surge > 0
              ? 'bg-slate-900/60 border-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-cyan-950/50 hover:bg-cyan-900/60 border-cyan-500/40 text-cyan-200 active:scale-95 shadow-sm'
          }`}
          title="Instant 30s of CPS generation"
        >
          <Flame className="w-4 h-4 mb-0.5 text-cyan-400" />
          <span className="font-semibold text-[11px] truncate">Astral Surge</span>
          {skillCooldowns.surge > 0 && (
            <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center font-mono font-bold text-xs text-cyan-300">
              {skillCooldowns.surge}s
            </div>
          )}
        </button>

        {/* Skill 3: Time Warp */}
        <button
          onClick={() => onActivateSkill('warp')}
          disabled={skillCooldowns.warp > 0}
          className={`flex-1 flex flex-col items-center justify-center p-2 rounded-xl border text-xs transition-all relative overflow-hidden ${
            skillCooldowns.warp > 0
              ? 'bg-slate-900/60 border-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-fuchsia-950/50 hover:bg-fuchsia-900/60 border-fuchsia-500/40 text-fuchsia-200 active:scale-95 shadow-sm'
          }`}
          title="2x Global CPS and Boss Freeze for 20s"
        >
          <Clock className="w-4 h-4 mb-0.5 text-fuchsia-400" />
          <span className="font-semibold text-[11px] truncate">Time Warp</span>
          {skillCooldowns.warp > 0 && (
            <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center font-mono font-bold text-xs text-fuchsia-300">
              {skillCooldowns.warp}s
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
