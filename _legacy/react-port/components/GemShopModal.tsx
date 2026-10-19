import React, { useState, useEffect } from 'react';
import { GemShopItem } from '../types/game';
import { sound } from '../utils/audio';
import { X, Gem, Sparkles, Check, Gift } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  astralGems: number;
  items: GemShopItem[];
  redeemedCodes: string[];
  onBuyItem: (item: GemShopItem) => void;
  onRedeemCode: (code: string) => { success: boolean; message: string; rewardGems?: number };
}

export const GemShopModal: React.FC<Props> = ({
  isOpen,
  onClose,
  astralGems,
  items,
  redeemedCodes,
  onBuyItem,
  onRedeemCode,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [redeemFeedback, setRedeemFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  // Keyboard shortcut 'G' handler (Must ignore when typing in input/textarea)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if target is an interactive input
      const target = e.target as HTMLElement | null;
      const isInput = target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      );

      if (isInput) return; // Do not trigger shortcut while typing

      if (e.key === 'g' || e.key === 'G') {
        if (isOpen) {
          onClose();
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    const result = onRedeemCode(promoCode.trim().toUpperCase());
    if (result.success) {
      sound.playLevelUp();
      setRedeemFeedback({ text: result.message, isError: false });
      setPromoCode('');
    } else {
      sound.playError();
      setRedeemFeedback({ text: result.message, isError: true });
    }

    setTimeout(() => {
      setRedeemFeedback(null);
    }, 4000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Gem className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold text-amber-300">Celestial Gem Vault</span>
              <div className="text-[11px] text-slate-400">Permanent transcendent artifacts and cosmic upgrades</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Current Gem Balance */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-950/40 border border-amber-500/40 rounded-lg text-amber-300 font-mono font-bold text-xs">
              <Gem className="w-3.5 h-3.5 text-amber-400" />
              <span>{astralGems.toLocaleString()} Gems</span>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close Gem Shop"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5">
          {/* Banner Graphic */}
          <div className="relative h-28 w-full rounded-xl overflow-hidden border border-amber-500/30 flex items-center px-4">
            <img
              src="/src/assets/images/nexyroth_gem_shop_relic_1790314674587.jpg"
              alt="Gem Vault Artifacts"
              className="absolute inset-0 w-full h-full object-cover opacity-35"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
            <div className="relative z-10 max-w-sm">
              <div className="text-xs uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Eternal Empowerments</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Purchases made here survive all Astral Rebirths and persist forever in your journey through the void.
              </p>
            </div>
          </div>

          {/* Shop Items List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Permanent Artifacts</h3>
            
            <div className="grid grid-cols-1 gap-2.5">
              {items.map((item) => {
                const canAfford = astralGems >= item.costGems;
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                      item.purchased
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                        : canAfford
                        ? 'bg-slate-950/60 hover:bg-slate-850 border-amber-500/30'
                        : 'bg-slate-950/40 border-slate-800 opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        item.purchased
                          ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                          : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                      }`}>
                        {item.purchased ? <Check className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-100">{item.name}</span>
                          {item.purchased && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (!item.purchased && canAfford) {
                          sound.playPurchase();
                          onBuyItem(item);
                        } else if (!item.purchased) {
                          sound.playError();
                        }
                      }}
                      disabled={item.purchased || !canAfford}
                      className={`px-3 py-2 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                        item.purchased
                          ? 'bg-slate-800 text-slate-400 border border-slate-700/60 cursor-default'
                          : canAfford
                          ? 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold shadow-[0_0_12px_rgba(245,158,11,0.4)] active:scale-95 cursor-pointer'
                          : 'bg-slate-800/80 text-slate-500 border border-slate-700/40 cursor-not-allowed'
                      }`}
                    >
                      {item.purchased ? (
                        <span>Purchased</span>
                      ) : (
                        <>
                          <Gem className="w-3.5 h-3.5" />
                          <span>{item.costGems} Gems</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Code Redemption Section */}
          <div className="pt-2 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>Redeem Astral Gift Code</span>
            </h3>

            <form onSubmit={handleRedeem} className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Try NEXYROTH2026 or COSMICVOID"
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono uppercase"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Redeem
              </button>
            </form>

            {redeemFeedback && (
              <div
                className={`mt-2 text-xs p-2 rounded-lg ${
                  redeemFeedback.isError
                    ? 'bg-rose-950/50 border border-rose-500/40 text-rose-300'
                    : 'bg-emerald-950/50 border border-emerald-500/40 text-emerald-300'
                }`}
              >
                {redeemFeedback.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
