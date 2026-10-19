import React, { useEffect } from 'react';
import { Achievement } from '../types/game';
import { sound } from '../utils/audio';
import { X, Trophy, Gem, Check, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  onClaimAchievement: (achievementId: string, rewardGems: number) => void;
}

export const AchievementsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  achievements,
  onClaimAchievement,
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

  const completedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold text-amber-300">Cosmic Milestones & Trophies</span>
              <div className="text-[11px] text-slate-400">Achieve milestones to earn precious Astral Gems</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 bg-amber-950/40 border border-amber-500/40 rounded-lg text-amber-300 font-mono font-bold text-xs">
              {completedCount} / {achievements.length} Unlocked
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-3">
          {achievements.map((ach) => {
            const isCompleted = ach.current >= ach.target;
            const progressPercent = Math.min(100, Math.floor((ach.current / ach.target) * 100));

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                  ach.unlocked
                    ? 'bg-slate-950/40 border-slate-800/80 opacity-75'
                    : isCompleted
                    ? 'bg-amber-950/30 border-amber-500/50 shadow-sm'
                    : 'bg-slate-950/50 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    ach.unlocked
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                      : isCompleted
                      ? 'bg-amber-950/60 border-amber-400 text-amber-300 animate-pulse'
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                  }`}>
                    <Trophy className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs md:text-sm font-bold text-slate-100 truncate">{ach.name}</span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {ach.current.toLocaleString()} / {ach.target.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{ach.desc}</p>

                    {/* Progress Bar */}
                    <div className="nx-progress h-1.5 mt-2 bg-slate-950">
                      <div
                        className={`nx-progress-bar ${ach.unlocked ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Claim Button */}
                <button
                  onClick={() => {
                    if (isCompleted && !ach.unlocked) {
                      sound.playLevelUp();
                      onClaimAchievement(ach.id, ach.rewardGems);
                    }
                  }}
                  disabled={ach.unlocked || !isCompleted}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                    ach.unlocked
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : isCompleted
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-[0_0_10px_rgba(245,158,11,0.5)] cursor-pointer active:scale-95'
                      : 'bg-slate-800 text-slate-500 border border-slate-700/40 cursor-not-allowed'
                  }`}
                >
                  {ach.unlocked ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Claimed</span>
                    </>
                  ) : (
                    <>
                      <Gem className="w-3.5 h-3.5" />
                      <span>+{ach.rewardGems}</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
