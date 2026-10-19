import React, { useEffect, useState } from 'react';
import { formatNumber } from '../utils/numeric';
import { sound } from '../utils/audio';
import { X, Sparkles, Disc, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  essence: number;
  totalAstralShards: number;
  prestigeCount: number;
  scientificNotation: boolean;
  onPerformPrestige: (shardsToGain: number) => void;
}

export const PrestigeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  essence,
  totalAstralShards,
  prestigeCount,
  scientificNotation,
  onPerformPrestige,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

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

  // Formula: 1 shard per 1,000,000 essence sqrt scaled
  const shardsToGain = Math.max(0, Math.floor(Math.sqrt(essence / 1000000)));
  const canPrestige = shardsToGain > 0;
  const currentBonusPercent = totalAstralShards * 1;
  const newBonusPercent = (totalAstralShards + shardsToGain) * 1;

  const handleAscend = () => {
    if (!canPrestige) {
      sound.playError();
      return;
    }
    sound.playLevelUp();
    onPerformPrestige(shardsToGain);
    setShowConfirm(false);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-slate-900 border border-purple-500/40 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold text-purple-300">Astral Rebirth (Ascension)</span>
              <div className="text-[11px] text-slate-400">Transcending reality unlocks permanent cosmic multipliers</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5 text-center">
          {/* Shards to Gain Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-purple-950/40 to-slate-950/60 border border-purple-500/30 flex flex-col items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-purple-400">
              Astral Shards to Harvest
            </span>
            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-200 to-indigo-300 font-mono">
              +{formatNumber(shardsToGain, scientificNotation)}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
              <span>Current Boost: <strong className="text-purple-300">+{currentBonusPercent}%</strong></span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              <span>Next Boost: <strong className="text-emerald-300">+{newBonusPercent}%</strong></span>
            </div>
          </div>

          {/* Breakdown: Retained vs Reset */}
          <div className="grid grid-cols-2 gap-3 text-left text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1.5">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>What Stays</span>
              </div>
              <ul className="text-slate-300 space-y-1 text-[11px]">
                <li>✓ All Astral Shards & Gems</li>
                <li>✓ Permanent Gem Shop Items</li>
                <li>✓ Unlocked Relics & Artifacts</li>
                <li>✓ Completed Achievements</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1.5">
              <div className="text-rose-400 font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>What Resets</span>
              </div>
              <ul className="text-slate-300 space-y-1 text-[11px]">
                <li>✗ Current Cosmic Essence</li>
                <li>✗ Regular Upgrades levels</li>
                <li>✗ Player Level & Exp</li>
                <li>✗ Active Boss Encounter</li>
              </ul>
            </div>
          </div>

          {/* Action Button */}
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              disabled={!canPrestige}
              className={`w-full py-3.5 rounded-xl font-extrabold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                canPrestige
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-98 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{canPrestige ? 'Ascend to Astral Plane' : 'Need at least 1,000,000 Essence'}</span>
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-500/50 space-y-3">
              <div className="text-xs text-purple-200 font-bold">
                Confirm Astral Ascension? Current run will reset and grant +{formatNumber(shardsToGain, scientificNotation)} Astral Shards!
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAscend}
                  className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Yes, Ascend Now
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
