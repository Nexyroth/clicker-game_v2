import React, { useEffect, useRef, useState } from 'react';
import { GameSettings } from '../types/game';
import { X, Volume2, VolumeX, Eye, Sparkles, Binary, RotateCcw, Download, Upload, Check, Gift, Globe } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onManualSave: () => void;
  onResetGame: () => void;
  onExportSave: () => void;
  onImportSave: (jsonStr: string) => void;
  onRedeemCode?: (code: string) => { success: boolean; message: string };
}

export const SettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onManualSave,
  onResetGame,
  onExportSave,
  onImportSave,
  onRedeemCode,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [giftCode, setGiftCode] = useState('');
  const [codeFeedback, setCodeFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const isVi = settings.language !== 'en'; // Default is Vietnamese

  // Close on Escape key
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

  const handleManualSaveClick = () => {
    onManualSave();
    sound.playPurchase();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        try {
          onImportSave(content);
          sound.playLevelUp();
          onClose();
        } catch {
          sound.playError();
        }
      }
    };
    reader.readAsText(file);
  };

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftCode.trim()) return;

    if (onRedeemCode) {
      const res = onRedeemCode(giftCode);
      setCodeFeedback(res);
      if (res.success) {
        sound.playPurchase();
        setGiftCode('');
      } else {
        sound.playError();
      }
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
    >
      {/* Modal Container: Max-height 90vh, overflow-hidden wrapper, custom scrollbar inside */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Fixed Header with Top-Right Close Button */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-slate-100">
              {isVi ? 'Cài Đặt & Điều Khiển' : 'Settings & Controls'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close Settings Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
          {/* 1. Language Selection (Tiếng Việt & English) */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isVi ? 'Ngôn Ngữ (Language)' : 'Language (Ngôn Ngữ)'}</span>
            </h3>
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-200">
                  {isVi ? 'Chọn ngôn ngữ hiển thị' : 'Display Language'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isVi ? 'Tiếng Việt mặc định, chuyển đổi tức thì' : 'Instant toggle between Vietnamese & English'}
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ language: 'vi' })}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    isVi
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🇻🇳 Tiếng Việt
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ language: 'en' })}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    !isVi
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>
          </section>

          {/* 2. Audio & Mute Controls */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {isVi ? 'Âm Thanh & Hiệu Ứng' : 'Audio & Sound Effects'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  const nextVal = !settings.sfxEnabled;
                  onUpdateSettings({ sfxEnabled: nextVal });
                  sound.setEnabled(nextVal);
                }}
                className={`text-xs px-2.5 py-1 rounded-md border font-semibold transition-all ${
                  settings.sfxEnabled
                    ? 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40'
                    : 'border-rose-500/40 text-rose-300 bg-rose-950/40'
                }`}
              >
                {settings.sfxEnabled ? (isVi ? '🔊 Đang Bật' : '🔊 Sound ON') : (isVi ? '🔇 Đã Tắt Tiếng' : '🔇 Muted')}
              </button>
            </div>
            
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.sfxEnabled ? (
                  <Volume2 className="w-5 h-5 text-cyan-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-500" />
                )}
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    {isVi ? 'Bật/Tắt Tiếng Game' : 'Sound Effects'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isVi ? 'Âm thanh tiếng bấm lõi, thăng cấp và nhận quà' : 'Procedural audio for clicks, purchases, and crits'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  const nextVal = !settings.sfxEnabled;
                  onUpdateSettings({ sfxEnabled: nextVal });
                  sound.setEnabled(nextVal);
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.sfxEnabled ? 'bg-cyan-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    settings.sfxEnabled ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {settings.sfxEnabled && (
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-300">{isVi ? 'Âm lượng' : 'Volume'}</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.sfxVolume}
                  onChange={(e) => {
                    const vol = parseFloat(e.target.value);
                    onUpdateSettings({ sfxVolume: vol });
                    sound.setVolume(vol);
                  }}
                  className="flex-1 accent-cyan-500 cursor-pointer"
                />
                <span className="text-xs font-mono text-cyan-400 w-10 text-right">
                  {Math.round(settings.sfxVolume * 100)}%
                </span>
              </div>
            )}
          </section>

          {/* 3. Giftcode Redemption */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5" />
              <span>{isVi ? 'Nhập Mã Quà Tặng (Giftcode)' : 'Redeem Giftcode'}</span>
            </h3>

            <div className="p-3.5 rounded-xl bg-gradient-to-tr from-amber-950/20 via-slate-950 to-indigo-950/20 border border-amber-500/30 space-y-2.5">
              <div className="text-[11px] text-slate-400">
                {isVi ? 'Nhập mã để nhận Đá Quý, Shards và Năng Lượng (Mã: TANTHU, NEXYROTH, VIP999, COSMIC)' : 'Enter code for free Gems, Shards & Essence (Codes: TANTHU, NEXYROTH, VIP999, COSMIC)'}
              </div>
              <form onSubmit={handleRedeem} className="flex gap-2">
                <input
                  type="text"
                  value={giftCode}
                  onChange={(e) => setGiftCode(e.target.value)}
                  placeholder={isVi ? 'Nhập mã (VD: TANTHU)' : 'Enter code (e.g. TANTHU)'}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono uppercase focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-all active:scale-95"
                >
                  {isVi ? 'Đổi Quà' : 'Redeem'}
                </button>
              </form>

              {codeFeedback && (
                <div
                  className={`text-xs px-2.5 py-1.5 rounded-md font-semibold ${
                    codeFeedback.success
                      ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-950/50 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {codeFeedback.message}
                </div>
              )}
            </div>
          </section>

          {/* 4. Gameplay & Visuals */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isVi ? 'Hiển Thị & Giao Diện' : 'Display & Performance'}
            </h3>

            {/* Scientific Notation */}
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Binary className="w-5 h-5 text-indigo-400" />
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    {isVi ? 'Ký Hiệu Khoa Học' : 'Scientific Notation'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isVi ? 'Hiển thị dạng 1.00e12 thay vì K, M, B' : 'Show 1.00e12 instead of shorthand'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => onUpdateSettings({ scientificNotation: !settings.scientificNotation })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.scientificNotation ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    settings.scientificNotation ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Floating Numbers */}
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-sky-400" />
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    {isVi ? 'Số Sát Thương Bay' : 'Floating Damage Numbers'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isVi ? 'Hiển thị số bay lên khi bấm Lõi' : 'Render animated resource numbers on click'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => onUpdateSettings({ floatingNumbers: !settings.floatingNumbers })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.floatingNumbers ? 'bg-sky-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    settings.floatingNumbers ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Visual Particles */}
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-fuchsia-400" />
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    {isVi ? 'Hiệu Ứng Hạt Vũ Trụ' : 'Cosmic Particles'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isVi ? 'Hiệu ứng gợn sóng và ánh sao nền' : 'Enable stellar background dust & click ripples'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => onUpdateSettings({ particles: !settings.particles })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.particles ? 'bg-fuchsia-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    settings.particles ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </section>

          {/* 5. Save Management & ZIP */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isVi ? 'Lưu Trữ & Xuất File' : 'Save Data & Backup'}
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleManualSaveClick}
                className="nx-btn nx-btn-primary text-xs py-2.5 flex items-center justify-center gap-2"
              >
                {saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Download className="w-4 h-4" />}
                <span>{saveSuccess ? (isVi ? 'Đã Lưu!' : 'Saved!') : (isVi ? 'Lưu Tiến Trình' : 'Save Progress')}</span>
              </button>

              <button
                onClick={onExportSave}
                className="nx-btn nx-btn-secondary text-xs py-2.5 flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>{isVi ? 'Xuất File Lưu' : 'Export Save'}</span>
              </button>
            </div>

            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full nx-btn nx-btn-secondary text-xs py-2 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{isVi ? 'Nhập Tiến Trình Từ File .JSON' : 'Import Save From .JSON'}</span>
              </button>

              <a
                href="./nexyroth-clicker-v8.zip"
                download="nexyroth-clicker-v8.zip"
                className="w-full nx-btn nx-btn-primary text-xs py-2.5 flex items-center justify-center gap-2 text-decoration-none font-bold shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isVi ? 'TẢI FILE DỰ ÁN (.ZIP) VỀ MÁY' : 'DOWNLOAD PROJECT (.ZIP) NOW'}</span>
              </a>
            </div>
          </section>

          {/* 6. Hard Reset */}
          <section className="pt-2 border-t border-slate-800">
            {!showConfirmReset ? (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="w-full nx-btn nx-btn-danger text-xs py-2.5 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isVi ? 'Xóa Toàn Bộ Dữ Liệu (Chơi Lại Từ Đầu)' : 'Hard Reset (Wipe All Progress)'}</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-600/60 space-y-2">
                <div className="text-xs text-rose-200 font-bold">
                  {isVi ? '⚠️ BẠN CÓ CHẮC CHẮN KHÔNG?' : '⚠️ ARE YOU ABSOLUTELY SURE?'}
                </div>
                <div className="text-[11px] text-rose-300">
                  {isVi ? 'Thao tác này sẽ xóa sạch Năng Lượng, Nâng Cấp và Shards vĩnh viễn!' : 'This will permanently wipe all Essence, Upgrades, and Shards!'}
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      onResetGame();
                      sound.playError();
                      onClose();
                    }}
                    className="flex-1 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-lg"
                  >
                    {isVi ? 'Xóa Hết' : 'Confirm Wipe'}
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="flex-1 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                  >
                    {isVi ? 'Hủy' : 'Cancel'}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
