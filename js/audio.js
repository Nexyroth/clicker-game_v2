/**
 * NEXYROTH CLICKER - PROCEDURAL COSMIC AUDIO SYNTHESIZER
 * Subtle Cosmic Dark-Fantasy Audio Cues for Clicks, Upgrades, and Level-Ups
 * Pure Web Audio API - 100% Offline, Zero Dependencies
 */
(function (global) {
  'use strict';

  let ctx = null;

  function getAudioContext() {
    if (!ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        ctx = new AudioCtx();
      }
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(function () {});
    }
    return ctx;
  }

  function getEffectiveVolume(customVol) {
    const state = global.GameState && global.GameState.get ? global.GameState.get() : null;
    if (state && state.settings && !state.settings.sfxEnabled) return 0;
    const baseVolume = (state && state.settings && state.settings.sfxVolume !== undefined)
      ? state.settings.sfxVolume
      : 0.5;
    return (customVol || 0.25) * baseVolume;
  }

  /**
   * Subtle Cosmic Click
   * Soft lowpass filtered crystal transient + void sub-harmonic body
   */
  function playCosmicClick(isCrit) {
    const actx = getAudioContext();
    if (!actx) return;
    const vol = getEffectiveVolume(isCrit ? 0.35 : 0.22);
    if (vol <= 0) return;

    try {
      const now = actx.currentTime;

      // Lowpass filter for velvety dark fantasy tone
      const filter = actx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(isCrit ? 2200 : 1350, now);
      filter.Q.setValueAtTime(1.2, now);

      const masterGain = actx.createGain();
      masterGain.gain.setValueAtTime(vol, now);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + (isCrit ? 0.16 : 0.08));

      // 1. Crystal Tap Transient
      const osc = actx.createOscillator();
      osc.type = isCrit ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(isCrit ? 580 : 340, now);
      osc.frequency.exponentialRampToValueAtTime(isCrit ? 1100 : 160, now + (isCrit ? 0.12 : 0.06));

      // 2. Void Sub-harmonic Thump (Subtle body)
      const subOsc = actx.createOscillator();
      const subGain = actx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(135, now);
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
        shimmerGain.gain.setValueAtTime(vol * 0.45, now);
        shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

        shimmer.connect(shimmerGain);
        shimmerGain.connect(actx.destination);

        shimmer.start(now);
        shimmer.stop(now + 0.15);
      }
    } catch (e) {}
  }

  /**
   * Subtle Cosmic Upgrade Cue
   * Ascending harmonic fifth chord with gentle attack and celestial resonance
   */
  function playCosmicUpgrade(tier) {
    const actx = getAudioContext();
    if (!actx) return;
    const vol = getEffectiveVolume(0.28);
    if (vol <= 0) return;

    try {
      const now = actx.currentTime;
      const baseFreqs = [311.13, 349.23, 392.00, 440.00, 466.16, 523.25];
      const rootFreq = baseFreqs[((tier || 1) - 1) % baseFreqs.length] || 349.23;
      const fifthFreq = rootFreq * 1.4983;
      const octaveFreq = rootFreq * 2;

      const filter = actx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now);
      filter.Q.setValueAtTime(1.5, now);

      const gain = actx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.02); // 20ms gentle attack
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);

      const osc1 = actx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(rootFreq, now);

      const osc2 = actx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(fifthFreq, now + 0.02);

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
    } catch (e) {}
  }

  /**
   * Subtle Cosmic Level-Up Cue
   * Multi-voice celestial chord progression (C4 -> E4 -> G4 -> C5) + warm void sub-bass
   */
  function playCosmicLevelUp() {
    const actx = getAudioContext();
    if (!actx) return;
    const vol = getEffectiveVolume(0.38);
    if (vol <= 0) return;

    try {
      const now = actx.currentTime;
      const chord = [261.63, 329.63, 392.00, 523.25];

      chord.forEach(function (freq, idx) {
        const noteTime = now + idx * 0.075;
        const osc = actx.createOscillator();
        const noteGain = actx.createGain();

        osc.type = idx === 3 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        noteGain.gain.setValueAtTime(0.001, noteTime);
        noteGain.gain.linearRampToValueAtTime(vol * (1 - idx * 0.1), noteTime + 0.03);
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
      subGain.gain.setValueAtTime(vol * 0.5, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

      sub.connect(subGain);
      subGain.connect(actx.destination);

      sub.start(now);
      sub.stop(now + 0.9);
    } catch (e) {}
  }

  function playTone(freq, type, duration, vol, endFreq) {
    const actx = getAudioContext();
    if (!actx) return;
    const effectiveVolume = getEffectiveVolume(vol);
    if (effectiveVolume <= 0) return;

    try {
      const now = actx.currentTime;
      const osc = actx.createOscillator();
      const gain = actx.createGain();

      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, now);
      if (endFreq) {
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
      }

      gain.gain.setValueAtTime(effectiveVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(actx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {}
  }

  function isMuted() {
    const state = global.GameState && global.GameState.get ? global.GameState.get() : null;
    return state && state.settings ? !state.settings.sfxEnabled : false;
  }

  function setMuted(muted) {
    const state = global.GameState && global.GameState.get ? global.GameState.get() : null;
    if (state && state.settings) {
      state.settings.sfxEnabled = !muted;
      if (global.GameState.save) global.GameState.save();
      updateMuteIcons();
    }
  }

  function toggleMute() {
    const state = global.GameState && global.GameState.get ? global.GameState.get() : null;
    if (state && state.settings) {
      state.settings.sfxEnabled = !state.settings.sfxEnabled;
      if (global.GameState.save) global.GameState.save();
      updateMuteIcons();
      return !state.settings.sfxEnabled;
    }
    return false;
  }

  function setVolume(volume) {
    const state = global.GameState && global.GameState.get ? global.GameState.get() : null;
    if (state && state.settings) {
      state.settings.sfxVolume = Math.max(0, Math.min(1, volume));
      if (global.GameState.save) global.GameState.save();
    }
  }

  function updateMuteIcons() {
    const muted = isMuted();
    const isVi = global.I18n ? global.I18n.getLang() === 'vi' : true;

    // Header Mute Button
    const headerMuteBtn = document.getElementById('headerMuteBtn');
    if (headerMuteBtn) {
      headerMuteBtn.innerHTML = muted
        ? '<span style="font-size: 1rem; color: #f43f5e;">🔇</span>'
        : '<span style="font-size: 1rem; color: #38bdf8;">🔊</span>';
      headerMuteBtn.title = muted
        ? (isVi ? 'Bật âm thanh / Unmute' : 'Unmute sound')
        : (isVi ? 'Tắt tiếng / Mute' : 'Mute sound');
      headerMuteBtn.classList.toggle('is-muted', muted);
    }

    // Modal Quick Mute Button
    const modalMuteBtn = document.getElementById('quickMuteBtn');
    if (modalMuteBtn) {
      modalMuteBtn.className = 'nx-btn ' + (muted ? 'nx-btn-danger' : 'nx-btn-secondary');
      modalMuteBtn.innerHTML = muted
        ? (isVi ? '🔇 Đã Tắt Tiếng' : '🔇 Muted')
        : (isVi ? '🔊 Đang Bật' : '🔊 Sound ON');
    }
  }

  global.Sound = {
    isMuted: isMuted,
    setMuted: setMuted,
    toggleMute: toggleMute,
    setVolume: setVolume,
    updateIcons: updateMuteIcons,
    playClick: playCosmicClick,
    playCrit: function () { playCosmicClick(true); },
    playUpgrade: playCosmicUpgrade,
    playLevelUp: playCosmicLevelUp,
    playAchievement: function () {
      playTone(523.25, 'sine', 0.12, 0.4);
      setTimeout(function () { playTone(659.25, 'sine', 0.12, 0.4); }, 90);
      setTimeout(function () { playTone(783.99, 'sine', 0.15, 0.4); }, 180);
      setTimeout(function () { playTone(1046.50, 'triangle', 0.35, 0.5, 1318.51); }, 270);
    },
    playBossHit: function () {
      playTone(130, 'sawtooth', 0.1, 0.25, 65);
    },
    playBossDefeat: function () {
      playTone(160, 'sawtooth', 0.35, 0.45, 45);
      setTimeout(function () { playCosmicLevelUp(); }, 150);
    },
    playDailyClaim: function () {
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach(function (freq, i) {
        setTimeout(function () { playTone(freq, 'sine', 0.25, 0.35); }, i * 80);
      });
    },
    playQuestComplete: function () {
      playTone(587.33, 'triangle', 0.12, 0.35);
      setTimeout(function () { playTone(739.99, 'triangle', 0.14, 0.38); }, 80);
      setTimeout(function () { playTone(880, 'sine', 0.3, 0.45); }, 160);
    },
    playModalOpen: function () {
      playTone(320, 'sine', 0.08, 0.18, 480);
    },
    playModalClose: function () {
      playTone(450, 'sine', 0.08, 0.15, 260);
    },
    playError: function () {
      playTone(180, 'sawtooth', 0.14, 0.2, 100);
    },
    playAutoClickTick: function () {
      playTone(660, 'sine', 0.035, 0.12, 880);
    }
  };
})(typeof window !== 'undefined' ? window : this);
