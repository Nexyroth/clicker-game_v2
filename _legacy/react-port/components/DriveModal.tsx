import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { DriveFileInfo, listSaveFiles, saveGameToDrive, loadGameFromDrive, deleteSaveFromDrive } from '../services/drive';
import { googleSignIn, logout } from '../services/firebase';
import { GameState } from '../types/game';
import { sound } from '../utils/audio';
import { X, Cloud, Download, Upload, Trash2, CheckCircle2, AlertCircle, RefreshCw, LogOut } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  accessToken: string | null;
  gameState: GameState;
  onApplyLoadedSave: (loadedState: GameState) => void;
  onUserAuthChange: (user: User | null, token: string | null) => void;
}

export const DriveModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  accessToken,
  gameState,
  onApplyLoadedSave,
  onUserAuthChange,
}) => {
  const [driveFiles, setDriveFiles] = useState<DriveFileInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Destructive Confirmation States
  const [confirmLoadFileId, setConfirmLoadFileId] = useState<string | null>(null);
  const [confirmDeleteFileId, setConfirmDeleteFileId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const fetchDriveSaves = async (token: string) => {
    try {
      setLoading(true);
      const files = await listSaveFiles(token);
      setDriveFiles(files);
    } catch (err: unknown) {
      console.error(err);
      setStatusMsg({ text: 'Failed to retrieve Drive files.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && accessToken) {
      fetchDriveSaves(accessToken);
    }
  }, [isOpen, accessToken]);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const res = await googleSignIn();
      if (res) {
        onUserAuthChange(res.user, res.accessToken);
        sound.playLevelUp();
        setStatusMsg({ text: 'Signed in with Google successfully!', isError: false });
        await fetchDriveSaves(res.accessToken);
      }
    } catch (err: unknown) {
      console.error(err);
      sound.playError();
      setStatusMsg({ text: 'Sign in cancelled or failed.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      onUserAuthChange(null, null);
      setDriveFiles([]);
      setStatusMsg({ text: 'Signed out from Google account.', isError: false });
    } catch {
      // ignore
    }
  };

  const handleSaveToDrive = async () => {
    if (!accessToken) return;
    try {
      setLoading(true);
      const result = await saveGameToDrive(accessToken, gameState);
      sound.playPurchase();
      setStatusMsg({ text: `Successfully saved to Google Drive at ${new Date(result.modifiedTime).toLocaleTimeString()}`, isError: false });
      await fetchDriveSaves(accessToken);
    } catch (err: unknown) {
      sound.playError();
      setStatusMsg({ text: 'Failed to write save to Google Drive.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmLoad = async () => {
    if (!accessToken || !confirmLoadFileId) return;
    try {
      setLoading(true);
      const state = await loadGameFromDrive(accessToken, confirmLoadFileId);
      onApplyLoadedSave(state);
      sound.playLevelUp();
      setConfirmLoadFileId(null);
      setStatusMsg({ text: 'Cloud save restored successfully!', isError: false });
      onClose();
    } catch (err: unknown) {
      sound.playError();
      setStatusMsg({ text: 'Failed to read save from Google Drive.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!accessToken || !confirmDeleteFileId) return;
    try {
      setLoading(true);
      await deleteSaveFromDrive(accessToken, confirmDeleteFileId);
      sound.playPurchase();
      setConfirmDeleteFileId(null);
      setStatusMsg({ text: 'Cloud save deleted from Google Drive.', isError: false });
      await fetchDriveSaves(accessToken);
    } catch (err: unknown) {
      sound.playError();
      setStatusMsg({ text: 'Failed to delete file from Google Drive.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold text-emerald-300">Google Drive Cloud Sync</span>
              <div className="text-[11px] text-slate-400">Secure cross-device backup and progression sync</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close Drive Sync"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5">
          {/* Status Message */}
          {statusMsg && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                statusMsg.isError
                  ? 'bg-rose-950/40 border border-rose-500/40 text-rose-300'
                  : 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
              }`}
            >
              {statusMsg.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* User Auth Section */}
          {!currentUser ? (
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-4">
              <div className="text-xs text-slate-300">
                Connect your Google account to automatically store and restore your Nexyroth Clicker progress across devices.
              </div>

              {/* Official Google Sign In Button */}
              <button
                onClick={handleSignIn}
                disabled={loading}
                className="gsi-material-button mx-auto shadow-md"
              >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                  <div className="gsi-material-button-icon">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents">Sign in with Google</span>
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Profile Card */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Google User'}
                      className="w-10 h-10 rounded-full border border-emerald-500/40"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-300">
                      {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold text-slate-100">{currentUser.displayName || 'Connected Account'}</div>
                    <div className="text-[11px] text-slate-400">{currentUser.email}</div>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleSaveToDrive}
                  disabled={loading}
                  className="flex-1 nx-btn nx-btn-primary text-xs py-2.5 flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Backup to Google Drive</span>
                </button>

                <button
                  onClick={() => accessToken && fetchDriveSaves(accessToken)}
                  disabled={loading}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Refresh Drive saves"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Cloud Saves Found */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Cloud Saves on Google Drive
                </div>

                {driveFiles.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-500">
                    No cloud save found on Google Drive. Click "Backup to Google Drive" to create one.
                  </div>
                ) : (
                  driveFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-200">{file.name}</div>
                        <div className="text-[11px] text-slate-400">
                          Updated: {new Date(file.modifiedTime).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setConfirmLoadFileId(file.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Load</span>
                        </button>

                        <button
                          onClick={() => setConfirmDeleteFileId(file.id)}
                          className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs"
                          title="Delete cloud save"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Mandatory User Confirmation Dialog for Overwriting Local Save */}
          {confirmLoadFileId && (
            <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-500/50 space-y-2.5">
              <div className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Overwrite Local Game Progress?</span>
              </div>
              <p className="text-xs text-amber-300/80">
                Loading this Google Drive save will replace your current local progress with the cloud version. This cannot be undone.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleConfirmLoad}
                  disabled={loading}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold"
                >
                  Confirm & Overwrite Local Save
                </button>
                <button
                  onClick={() => setConfirmLoadFileId(null)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Mandatory User Confirmation Dialog for Deleting Cloud File */}
          {confirmDeleteFileId && (
            <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 space-y-2.5">
              <div className="text-xs font-bold text-rose-200 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Delete Google Drive Save File?</span>
              </div>
              <p className="text-xs text-rose-300/80">
                Are you sure you want to permanently delete this save file from Google Drive?
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleConfirmDelete}
                  disabled={loading}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  Confirm Delete File
                </button>
                <button
                  onClick={() => setConfirmDeleteFileId(null)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
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
