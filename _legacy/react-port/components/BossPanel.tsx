import React, { useEffect } from 'react';
import { Boss } from '../types/game';
import { formatNumber } from '../utils/numeric';
import { sound } from '../utils/audio';
import { X, Swords, Skull, Trophy, Clock, AlertTriangle, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  boss: Boss;
  clickPower: number;
  frenzyMultiplier: number;
  scientificNotation: boolean;
  onHitBoss: (damage: number) => void;
  onStartBoss: (bossId: string) => void;
  onFleeBoss: () => void;
}

export const BossPanel: React.FC<Props> = ({
  isOpen,
  onClose,
  boss,
  clickPower,
  frenzyMultiplier,
  scientificNotation,
  onHitBoss,
  onStartBoss,
  onFleeBoss,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hpPercent = Math.max(0, Math.min(100, (boss.currentHp / boss.maxHp) * 100));

  const handleBossClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!boss.active || boss.currentHp <= 0) return;
    const damage = clickPower * frenzyMultiplier;
    sound.playClick(true);
    onHitBoss(damage);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-slate-900 border border-rose-500/40 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Swords className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold text-rose-300">Dimensional Rift Trial</span>
              <div className="text-[11px] text-slate-400">Challenge ancient Void Titans for colossal bounties</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close Boss Trial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5 text-center">
          {/* Boss Visual Portrait */}
          <div className="relative h-48 w-full rounded-2xl overflow-hidden border border-rose-500/30 flex flex-col items-center justify-center p-4">
            <img
              src="/src/assets/images/nexyroth_boss_titan_1790314646800.jpg"
              alt={boss.name}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <div className="relative z-10 flex flex-col items-center">
              <span className="text-xs uppercase font-extrabold tracking-widest text-rose-400">
                Tier {boss.level} Titan
              </span>
              <h3 className="text-xl font-extrabold text-white drop-shadow-md">
                {boss.name}
              </h3>
              <p className="text-xs text-rose-200/80 italic mt-0.5">{boss.title}</p>
            </div>
          </div>

          {/* Active Battle State */}
          {boss.active ? (
            <div className="space-y-4">
              {/* HP Bar */}
              <div className="space-y-1.5 text-left">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-rose-400 flex items-center gap-1">
                    <Skull className="w-3.5 h-3.5" /> Titan Health
                  </span>
                  <span className="font-mono text-slate-200">
                    {formatNumber(boss.currentHp, scientificNotation)} / {formatNumber(boss.maxHp, scientificNotation)} ({hpPercent.toFixed(1)}%)
                  </span>
                </div>
                <div className="nx-progress h-3 bg-slate-950 border-rose-500/30">
                  <div
                    className="nx-progress-bar bg-gradient-to-r from-rose-600 to-amber-500"
                    style={{ width: `${hpPercent}%` }}
                  />
                </div>
              </div>

              {/* Timer Bar */}
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                <div className="flex items-center gap-1.5 text-amber-300">
                  <Clock className="w-4 h-4" />
                  <span className="font-bold">Time Limit:</span>
                </div>
                <span className="font-mono font-extrabold text-sm text-amber-400">
                  {boss.remainingTime}s remaining
                </span>
              </div>

              {/* Click Strike Target Area */}
              <div
                onClick={handleBossClick}
                className="w-full py-8 rounded-2xl bg-gradient-to-b from-rose-950/40 to-slate-950/80 border-2 border-dashed border-rose-500/50 hover:border-rose-400 cursor-pointer active:scale-98 transition-all flex flex-col items-center justify-center gap-2 group shadow-inner"
              >
                <Swords className="w-8 h-8 text-rose-400 group-hover:scale-110 transition-transform animate-bounce" />
                <span className="text-sm font-extrabold text-rose-200 group-hover:text-white uppercase tracking-wider">
                  Strike the Titan! (Click Fast)
                </span>
                <span className="text-xs text-rose-300/80 font-mono">
                  Deal {formatNumber(clickPower * frenzyMultiplier, scientificNotation)} DMG per strike
                </span>
              </div>

              {/* Flee button */}
              <button
                onClick={onFleeBoss}
                className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
              >
                Retreat from Battle
              </button>
            </div>
          ) : (
            /* Inactive / Ready to Summon State */
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2 text-left">
                <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Victory Spoils</span>
                </div>
                <div className="grid grid-cols-3 gap-2 font-mono font-bold text-center">
                  <div className="p-2 bg-amber-950/30 border border-amber-500/30 rounded-lg text-amber-300">
                    +{boss.rewardGems} Gems
                  </div>
                  <div className="p-2 bg-indigo-950/30 border border-indigo-500/30 rounded-lg text-indigo-300">
                    +{boss.rewardShards} Shards
                  </div>
                  <div className="p-2 bg-cyan-950/30 border border-cyan-500/30 rounded-lg text-cyan-300">
                    +{boss.rewardExp} EXP
                  </div>
                </div>
              </div>

              <button
                onClick={() => onStartBoss(boss.id)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(225,29,72,0.4)] active:scale-98 transition-all cursor-pointer"
              >
                Summon Titan & Begin Trial
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
