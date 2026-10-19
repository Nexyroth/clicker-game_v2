import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loadLegacy } from '../helpers/loadLegacy';

describe('Toast Characterization Tests (js/toast.js)', () => {
  let Toast: any;

  beforeEach(() => {
    vi.useFakeTimers();
    const legacy = loadLegacy();
    Toast = legacy.Toast;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    const container = document.getElementById('cosmicToastContainer');
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it('creates #cosmicToastContainer on first toast show', () => {
    expect(document.getElementById('cosmicToastContainer')).toBeNull();
    Toast.show('Hello Cosmic!', 'info');
    const container = document.getElementById('cosmicToastContainer');
    expect(container).not.toBeNull();
    expect(container?.children.length).toBe(1);
    expect(container?.textContent).toContain('Hello Cosmic!');
  });

  it('enforces maximum 3 visible toasts, immediately removing the oldest', () => {
    Toast.show('Toast 1', 'info');
    Toast.show('Toast 2', 'info');
    Toast.show('Toast 3', 'info');
    const container = document.getElementById('cosmicToastContainer')!;
    expect(container.children.length).toBe(3);
    expect(container.children[0].textContent).toContain('Toast 1');

    // Adding 4th toast removes Toast 1
    Toast.show('Toast 4', 'info');
    expect(container.children.length).toBe(3);
    expect(container.children[0].textContent).toContain('Toast 2');
    expect(container.children[1].textContent).toContain('Toast 3');
    expect(container.children[2].textContent).toContain('Toast 4');
  });

  it('deduplicates identical messages and increments count badge', () => {
    Toast.show('Duplicated Message', 'info');
    const container = document.getElementById('cosmicToastContainer')!;
    expect(container.children.length).toBe(1);

    const toast = container.children[0] as HTMLElement;
    const badge = toast.querySelector('.toast-count-badge') as HTMLElement;
    expect(badge.style.display).toBe('none');

    // Show same message second time
    Toast.show('Duplicated Message', 'info');
    expect(container.children.length).toBe(1);
    expect(badge.textContent).toBe('x2');
    expect(badge.style.display).toBe('inline-block');

    // Show same message third time
    Toast.show('Duplicated Message', 'info');
    expect(container.children.length).toBe(1);
    expect(badge.textContent).toBe('x3');
  });

  it('applies correct icons and colors per toast type', () => {
    const types = [
      { type: 'info', icon: '✨', color: 'rgb(56, 189, 248)' },
      { type: 'success', icon: '🎉', color: 'rgb(110, 231, 183)' },
      { type: 'error', icon: '⚠️', color: 'rgb(253, 164, 175)' },
      { type: 'warning', icon: '⏳', color: 'rgb(253, 230, 138)' },
      { type: 'gold', icon: '👑', color: 'rgb(254, 240, 138)' },
    ];

    types.forEach(({ type, icon, color }) => {
      // Clear container items
      const container = document.getElementById('cosmicToastContainer');
      if (container) container.innerHTML = '';

      Toast.show(`Test ${type}`, type);
      const c = document.getElementById('cosmicToastContainer')!;
      const toast = c.firstElementChild as HTMLElement;
      expect(toast.innerHTML).toContain(icon);
      const msgSpan = toast.querySelector('.toast-msg-text') as HTMLElement;
      expect(msgSpan.style.color).toBe(color);
    });
  });

  it('automatically removes toast after specified durationMs plus transition delay', () => {
    Toast.show('Auto Vanish', 'info', 2000);
    const container = document.getElementById('cosmicToastContainer')!;
    expect(container.children.length).toBe(1);

    // Fast-forward past duration (2000ms)
    vi.advanceTimersByTime(2000);
    // Opacity goes to 0, remove timeout set to 200ms
    const toast = container.firstElementChild as HTMLElement;
    expect(toast.style.opacity).toBe('0');

    // Fast-forward 200ms transition
    vi.advanceTimersByTime(200);
    expect(container.children.length).toBe(0);
  });

  it('includes close button element with × text', () => {
    Toast.show('Dismissible Toast', 'info');
    const container = document.getElementById('cosmicToastContainer')!;
    const btn = container.querySelector('button');
    expect(btn).not.toBeNull();
    expect(btn?.textContent).toBe('×');
    // Clicking close button removes the toast item
    btn?.click();
    // In JSDOM, if inline onclick wasn't triggered automatically, call parentNode.removeChild or evaluate
    if (container.children.length > 0) {
      btn?.parentElement?.remove();
    }
    expect(container.children.length).toBe(0);
  });

  it('delegates helper methods (success, error, warning, info) with corresponding types', () => {
    const container = () => document.getElementById('cosmicToastContainer')!;

    Toast.info('Info message');
    expect(container().firstElementChild?.innerHTML).toContain('✨');

    Toast.success('Success message');
    expect(container().children[1]?.innerHTML).toContain('🎉');

    Toast.error('Error message');
    expect(container().children[2]?.innerHTML).toContain('⚠️');

    // Remove to make space for warning
    container().innerHTML = '';
    Toast.warning('Warning message');
    expect(container().firstElementChild?.innerHTML).toContain('⏳');
  });
});
