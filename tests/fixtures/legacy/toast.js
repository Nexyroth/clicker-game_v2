/**
 * NEXYROTH CLICKER - COSMIC TOAST NOTIFICATION SYSTEM
 * Replaces window.alert with non-blocking, mobile-friendly cosmic banners
 * Pure JavaScript - 100% Offline, Zero Dependencies
 * Anti-spam: max 3 simultaneous toasts & deduplication grouping
 */
(function (global) {
  'use strict';

  let toastContainer = null;
  const MAX_VISIBLE_TOASTS = 3;

  function ensureContainer() {
    if (!toastContainer) {
      toastContainer = document.getElementById('cosmicToastContainer');
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'cosmicToastContainer';
        toastContainer.style.cssText = [
          'position: fixed',
          'top: 1rem',
          'left: 50%',
          'transform: translateX(-50%)',
          'z-index: 99999',
          'display: flex',
          'flex-direction: column',
          'gap: 0.5rem',
          'align-items: center',
          'pointer-events: none',
          'width: calc(100% - 2rem)',
          'max-width: 440px'
        ].join(';');
        document.body.appendChild(toastContainer);
      }
    }
    return toastContainer;
  }

  function showToast(message, type, durationMs) {
    const container = ensureContainer();
    const duration = durationMs || 3000;

    // Check if an existing toast with identical message is currently showing
    const existing = container.querySelector(`[data-raw-msg="${encodeURIComponent(message)}"]`);
    if (existing) {
      let count = parseInt(existing.getAttribute('data-count') || '1', 10) + 1;
      existing.setAttribute('data-count', count);
      const msgSpan = existing.querySelector('.toast-msg-text');
      const badgeSpan = existing.querySelector('.toast-count-badge');
      if (badgeSpan) {
        badgeSpan.textContent = `x${count}`;
        badgeSpan.style.display = 'inline-block';
      }
      // Re-trigger pulse animation
      existing.style.transform = 'scale(1.05)';
      setTimeout(() => {
        if (existing) existing.style.transform = 'scale(1)';
      }, 150);

      // Reset decay timeout
      if (existing._removeTimeout) clearTimeout(existing._removeTimeout);
      existing._removeTimeout = setTimeout(function () {
        existing.style.opacity = '0';
        existing.style.transform = 'translateY(-10px)';
        setTimeout(function () {
          if (existing.parentNode) existing.parentNode.removeChild(existing);
        }, 200);
      }, duration);
      return;
    }

    // Enforce max 3 visible toasts: remove oldest immediately if at limit
    while (container.children.length >= MAX_VISIBLE_TOASTS) {
      const oldest = container.firstElementChild;
      if (oldest) {
        if (oldest._removeTimeout) clearTimeout(oldest._removeTimeout);
        container.removeChild(oldest);
      }
    }

    const toast = document.createElement('div');
    toast.className = 'cosmic-toast-item';
    toast.setAttribute('data-raw-msg', encodeURIComponent(message));
    toast.setAttribute('data-count', '1');

    let bg = 'rgba(15, 23, 42, 0.95)';
    let border = 'rgba(56, 189, 248, 0.5)';
    let color = '#38bdf8';
    let icon = '✨';

    if (type === 'success') {
      bg = 'rgba(6, 78, 59, 0.95)';
      border = '#10b981';
      color = '#6ee7b7';
      icon = '🎉';
    } else if (type === 'error') {
      bg = 'rgba(136, 19, 55, 0.95)';
      border = '#f43f5e';
      color = '#fda4af';
      icon = '⚠️';
    } else if (type === 'warning') {
      bg = 'rgba(120, 53, 15, 0.95)';
      border = '#f59e0b';
      color = '#fde68a';
      icon = '⏳';
    } else if (type === 'gold') {
      bg = 'rgba(146, 64, 14, 0.95)';
      border = '#fbbf24';
      color = '#fef08a';
      icon = '👑';
    }

    toast.style.cssText = [
      'background: ' + bg,
      'border: 1.5px solid ' + border,
      'color: #ffffff',
      'border-radius: 0.75rem',
      'padding: 0.65rem 1rem',
      'font-size: 0.8125rem',
      'font-weight: 700',
      'box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 0 15px ' + border,
      'display: flex',
      'align-items: center',
      'gap: 0.625rem',
      'backdrop-filter: blur(12px)',
      '-webkit-backdrop-filter: blur(12px)',
      'pointer-events: auto',
      'animation: toast-slide-down 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      'transition: opacity 0.2s ease, transform 0.2s ease',
      'width: 100%',
      'box-sizing: border-box'
    ].join(';');

    toast.innerHTML = `
      <span style="font-size: 1.15rem; flex-shrink: 0;">${icon}</span>
      <span class="toast-msg-text" style="flex: 1; min-width: 0; word-break: break-word; line-height: 1.35; color: ${color};">${message}</span>
      <span class="toast-count-badge" style="display: none; background: rgba(0,0,0,0.5); border: 1px solid ${border}; color: #fff; font-size: 0.6875rem; padding: 1px 6px; border-radius: 9999px; font-weight: 800; font-family: monospace;">x1</span>
      <button style="background: none; border: none; color: #94a3b8; font-size: 1.1rem; cursor: pointer; padding: 0 0.25rem; line-height: 1;" onclick="this.parentNode.remove()">×</button>
    `;

    container.appendChild(toast);

    toast._removeTimeout = setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 200);
    }, duration);
  }

  global.Toast = {
    show: showToast,
    success: function (msg, d) { showToast(msg, 'success', d); },
    error: function (msg, d) { showToast(msg, 'error', d); },
    warning: function (msg, d) { showToast(msg, 'warning', d); },
    info: function (msg, d) { showToast(msg, 'info', d); }
  };
})(typeof window !== 'undefined' ? window : this);
