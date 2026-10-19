/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';

export interface CosmicAudioContextValue {
  isMuted: boolean;
  volume: number;
  subtleAtmosphere: boolean;
  toggleMute: () => void;
  setVolume: (vol: number) => void;
  setSubtleAtmosphere: (enabled: boolean) => void;
  playClick: (isCrit?: boolean) => void;
  playUpgrade: (tier?: number) => void;
  playLevelUp: () => void;
  playCrit: () => void;
  playPrestige: () => void;
  playDailyReward: () => void;
  playQuestComplete: () => void;
  playBossHit: () => void;
  playBossDefeat: () => void;
  playError: () => void;
}

const CosmicAudioContext = createContext<CosmicAudioContextValue | null>(null);

export interface CosmicAudioProviderProps {
  children: React.ReactNode;
  initialVolume?: number;
  initialMuted?: boolean;
}

export function CosmicAudioProvider({
  children,
  initialVolume = 0.5,
  initialMuted = false,
}: CosmicAudioProviderProps) {
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [volume, setVolumeState] = useState(initialVolume);
  const [subtleAtmosphere, setSubtleAtmosphere] = useState(true);

  const ctxRef = useRef<AudioContext | null>(null);

  // Initialize or resume Web Audio Context on user gesture
  const getContext = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null;

    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        ctxRef.current = new AudioCtx();
      }
    }

    if (ctxRef.current && ctxRef.current.state === 'suspended') {
      ctxRef.current.resume().catch(() => {});
    }

    return ctxRef.current;
  }, []);

  const setVolume = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  /**
   * Subtle Cosmic Click
   * Deep void sub-harmonic pulse + crystal tap filtered for low ear-fatigue
   */
  const playClick = useCallback((isCrit: boolean = false) => {
    if (isMuted || volume <= 0) return;
    const actx = getContext();
    if (!actx) return;

    try {
      const now = actx.currentTime;
      const effectiveVol = volume * (isCrit ? 0.35 : 0.22);

      // Lowpass Filter for velvety dark-fantasy warmth
      const filter = actx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(subtleAtmosphere ? (isCrit ? 2200 : 1400) : 3200, now);
      filter.Q.setValueAtTime(1.2, now);

      // Master gain for this click sound
      const masterGain = actx.createGain();
      masterGain.gain.setValueAtTime(effectiveVol, now);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + (isCrit ? 0.16 : 0.08));

      // 1. Transient Click (Crystal tap)
      const osc = actx.createOscillator();
      osc.type = isCrit ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(isCrit ? 580 : 340, now);
      osc.frequency.exponentialRampToValueAtTime(isCrit ? 1100 : 160, now + (isCrit ? 0.12 : 0.06));

      // 2. Void Sub-harmonic Thump (Subtle body)
      const subOsc = actx.createOscillator();
      const subGain = actx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(55, now + 0.07);
      subGain.gain.setValueAtTime(0.35, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

      osc.connect(filter);
      subOsc.connect(subGain);
      subGain.connect(filter);

      filter.connect(masterGain);
      masterGain.connect(actx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
      subOsc.start(now);
      subOsc.stop(now + 0.08);

      // 3. Ethereal Astral Shimmer on Critical Hit
      if (isCrit) {
        const shimmer = actx.createOscillator();
        const shimmerGain = actx.createGain();
        shimmer.type = 'sine';
        shimmer.frequency.setValueAtTime(1250, now);
        shimmer.frequency.exponentialRampToValueAtTime(1880, now + 0.14);
        shimmerGain.gain.setValueAtTime(effectiveVol * 0.45, now);
        shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

        shimmer.connect(shimmerGain);
        shimmerGain.connect(actx.destination);

        shimmer.start(now);
        shimmer.stop(now + 0.15);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  }, [isMuted, volume, subtleAtmosphere, getContext]);

  /**
   * Subtle Cosmic Upgrade
   * Harmonic fifth ascending chord with soft envelope and celestial resonance
   */
  const playUpgrade = useCallback((tier: number = 1) => {
    if (isMuted || volume <= 0) return;
    const actx = getContext();
    if (!actx) return;

    try {
      const now = actx.currentTime;
      const effectiveVol = volume * 0.28;

      // Base note shifts subtly higher based on upgrade tier (mod 6)
      const baseFreqs = [311.13, 349.23, 392.00, 440.00, 466.16, 523.25];
      const rootFreq = baseFreqs[(tier - 1) % baseFreqs.length] || 349.23;
      const fifthFreq = rootFreq * 1.4983; // Perfect fifth
      const octaveFreq = rootFreq * 2;

      // Filter for cosmic warmth
      const filter = actx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(subtleAtmosphere ? 1800 : 2800, now);
      filter.Q.setValueAtTime(1.5, now);

      const gain = actx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(effectiveVol, now + 0.02); // 20ms gentle attack
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);  // 240ms decay

      // Voice 1: Root Tone
      const osc1 = actx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(rootFreq, now);

      // Voice 2: Perfect Fifth
      const osc2 = actx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(fifthFreq, now + 0.02);

      // Voice 3: Subtle Harmonic Sparkle
      const osc3 = actx.createOscillator();
      const gain3 = actx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(octaveFreq, now + 0.04);
      gain3.gain.setValueAtTime(0.35, now);

      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(gain3);
      gain3.connect(filter);

      filter.connect(gain);
      gain.connect(actx.destination);

      osc1.start(now);
      osc1.stop(now + 0.28);
      osc2.start(now + 0.02);
      osc2.stop(now + 0.28);
      osc3.start(now + 0.04);
      osc3.stop(now + 0.28);
    } catch {
      // Audio autoplay policy fallback
    }
  }, [isMuted, volume, subtleAtmosphere, getContext]);

  /**
   * Subtle Cosmic Level-Up
   * Multi-voice celestial chord progression with deep void resonance and ethereal shimmer
   */
  const playLevelUp = useCallback(() => {
    if (isMuted || volume <= 0) return;
    const actx = getContext();
    if (!actx) return;

    try {
      const now = actx.currentTime;
      const effectiveVol = volume * 0.38;

      // Chord frequencies: C4 -> E4 -> G4 -> C5 (Celestial Major)
      const chord = [261.63, 329.63, 392.00, 523.25];

      chord.forEach((freq, idx) => {
        const noteTime = now + idx * 0.075; // Arpeggiated entry
        const osc = actx.createOscillator();
        const noteGain = actx.createGain();

        osc.type = idx === 3 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        // Gentle attack & sustained celestial ring
        noteGain.gain.setValueAtTime(0.001, noteTime);
        noteGain.gain.linearRampToValueAtTime(effectiveVol * (1 - idx * 0.1), noteTime + 0.03);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.65);

        osc.connect(noteGain);
        noteGain.connect(actx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.7);
      });

      // Warm void sub-harmonic anchor (C2 = 65.41 Hz)
      const sub = actx.createOscillator();
      const subGain = actx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(65.41, now);
      subGain.gain.setValueAtTime(effectiveVol * 0.5, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

      sub.connect(subGain);
      subGain.connect(actx.destination);

      sub.start(now);
      sub.stop(now + 0.9);
    } catch {
      // Audio autoplay policy fallback
    }
  }, [isMuted, volume, getContext]);

  const playCrit = useCallback(() => {
    playClick(true);
  }, [playClick]);

  const playPrestige = useCallback(() => {
    if (isMuted || volume <= 0) return;
    const actx = getContext();
    if (!actx) return;

    try {
      const now = actx.currentTime;
      const vol = volume * 0.45;

      // Deep void rumble rising to ethereal cosmic shimmer
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.6);

      gain.gain.setValueAtTime(vol * 0.3, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

      osc.connect(gain);
      gain.connect(actx.destination);

      osc.start(now);
      osc.stop(now + 0.95);
    } catch {}
  }, [isMuted, volume, getContext]);

  const playDailyReward = useCallback(() => {
    if (isMuted || volume <= 0) return;
    const actx = getContext();
    if (!actx) return;

    try {
      const now = actx.currentTime;
      const vol = volume * 0.35;
      const notes = [440, 554.37, 659.25, 880];

      notes.forEach((freq, i) => {
        const time = now + i * 0.08;
        const osc = actx.createOscillator();
        const g = actx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        g.gain.setValueAtTime(0.001, time);
        g.gain.linearRampToValueAtTime(vol, time + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, time + 0.35);

        osc.connect(g);
        g.connect(actx.destination);
        osc.start(time);
        osc.stop(time + 0.4);
      });
    } catch {}
  }, [isMuted, volume, getContext]);

  const playQuestComplete = useCallback(() => {
    if (isMuted || volume <= 0) return;
    const actx = getContext();
    if (!actx) return;

    try {
      const now = actx.currentTime;
      const vol = volume * 0.32;
      const notes = [587.33, 739.99, 880];

      notes.forEach((freq, i) => {
        const time = now + i * 0.07;
        const osc = actx.createOscillator();
        const g = actx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        g.gain.setValueAtTime(vol, time);
        g.gain.exponentialRampToValueAtTime(0.0001, time + 0.28);

        osc.connect(g);
        g.connect(actx.destination);
        osc.start(time);
        osc.stop(time + 0.3);
      });
    } catch {}
  }, [isMuted, volume, getContext]);

  const playBossHit = useCallback(() => {
    if (isMuted || volume <= 0) return;
    const actx = getContext();
    if (!actx) return;

    try {
      const now = actx.currentTime;
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(65, now + 0.1);
      gain.gain.setValueAtTime(volume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch {}
  }, [isMuted, volume, getContext]);

  const playBossDefeat = useCallback(() => {
    if (isMuted || volume <= 0) return;
    const actx = getContext();
    if (!actx) return;

    try {
      const now = actx.currentTime;
      const vol = volume * 0.42;

      // Heavy titan fall
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.4);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start(now);
      osc.stop(now + 0.48);

      // Victory shimmer
      setTimeout(() => {
        playLevelUp();
      }, 150);
    } catch {}
  }, [isMuted, volume, getContext, playLevelUp]);

  const playError = useCallback(() => {
    if (isMuted || volume <= 0) return;
    const actx = getContext();
    if (!actx) return;

    try {
      const now = actx.currentTime;
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.14);
      gain.gain.setValueAtTime(volume * 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }, [isMuted, volume, getContext]);

  const value: CosmicAudioContextValue = {
    isMuted,
    volume,
    subtleAtmosphere,
    toggleMute,
    setVolume,
    setSubtleAtmosphere,
    playClick,
    playUpgrade,
    playLevelUp,
    playCrit,
    playPrestige,
    playDailyReward,
    playQuestComplete,
    playBossHit,
    playBossDefeat,
    playError,
  };

  return (
    <CosmicAudioContext.Provider value={value}>
      {children}
    </CosmicAudioContext.Provider>
  );
}

export function useCosmicAudio(): CosmicAudioContextValue {
  const context = useContext(CosmicAudioContext);
  if (!context) {
    throw new Error('useCosmicAudio must be used within a CosmicAudioProvider');
  }
  return context;
}
