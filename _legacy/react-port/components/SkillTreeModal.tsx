import React, { useEffect } from 'react';
import { SkillNode } from '../types/game';
import { sound } from '../utils/audio';
import { X, Compass, Check, Lock, Zap, Wind, Crosshair, Flame, Activity } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  skills: SkillNode[];
  skillPoints: number;
  onUnlockSkill: (skillId: string) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  zap: Zap,
  'zap-fast': Zap,
  wind: Wind,
  activity: Activity,
  crosshair: Crosshair,
  flame: Flame,
};

export const SkillTreeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  skills,
  skillPoints,
  onUnlockSkill,
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

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-slate-900 border border-indigo-500/40 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold text-indigo-300">Astral Constellations</span>
              <div className="text-[11px] text-slate-400">Branching skill tree to permanently awaken your powers</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 bg-indigo-950/40 border border-indigo-500/40 rounded-lg text-indigo-300 font-mono font-bold text-xs">
              Points: <span>{skillPoints}</span>
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
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
          <div className="text-xs text-slate-400">
            Earn 1 Skill Point every time you level up by gathering Cosmic Essence.
          </div>

          <div className="space-y-3">
            {skills.map((skill) => {
              const IconComp = ICON_MAP[skill.icon] || Zap;
              const hasReq = !skill.reqSkillId || skills.find((s) => s.id === skill.reqSkillId)?.unlocked;
              const canUnlock = !skill.unlocked && hasReq && skillPoints >= skill.costPoints;

              return (
                <div
                  key={skill.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    skill.unlocked
                      ? 'bg-indigo-950/30 border-indigo-500/40'
                      : canUnlock
                      ? 'bg-slate-950/60 hover:bg-slate-850 border-slate-700'
                      : 'bg-slate-950/30 border-slate-800/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      skill.unlocked
                        ? 'bg-indigo-900/40 border-indigo-400 text-indigo-300'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}>
                      <IconComp className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs md:text-sm font-bold text-slate-100 truncate">{skill.name}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-indigo-300 uppercase">
                          {skill.branch}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{skill.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (canUnlock) {
                        sound.playPurchase();
                        onUnlockSkill(skill.id);
                      } else if (!skill.unlocked) {
                        sound.playError();
                      }
                    }}
                    disabled={skill.unlocked || !canUnlock}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                      skill.unlocked
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 cursor-default'
                        : canUnlock
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm cursor-pointer active:scale-95'
                        : 'bg-slate-800 text-slate-500 border border-slate-700/40 cursor-not-allowed'
                    }`}
                  >
                    {skill.unlocked ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Mastered</span>
                      </>
                    ) : hasReq ? (
                      <span>Learn ({skill.costPoints} pt)</span>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
