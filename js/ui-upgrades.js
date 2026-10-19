/**
 * NEXYROTH CLICKER - UPGRADES CONTROLLER (TASK 4.2)
 * High-priority Right Column, Batch Purchase 1x/10x/100x/Max
 */
(function (global) {
  'use strict';

  let currentBatch = 1;

  function setBatchMultiplier(multiplier) {
    currentBatch = multiplier;
    const buttons = document.querySelectorAll('.multiplier-btn');
    buttons.forEach(function (btn) {
      if (btn.dataset.mult === String(multiplier)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    renderUpgradesList();
  }

  function buyUpgrade(upgradeId) {
    const state = global.GameState.get();
    const upgrade = state.upgrades.find(function (u) { return u.id === upgradeId; });
    if (!upgrade) return;

    let purchaseCount = currentBatch;
    let totalCost = 0;

    const hasMarketDiscount = state.skills && state.skills.some(function (s) { return s.id === 'fortune_market' && s.unlocked; });
    const discountMult = hasMarketDiscount ? 0.85 : 1.0;

    if (currentBatch === 'max') {
      const calc = global.Numeric.calculateMaxPurchasable(upgrade.baseCost * discountMult, upgrade.costMultiplier, upgrade.level, state.essence);
      purchaseCount = calc.count;
      totalCost = calc.totalCost;
    } else {
      purchaseCount = parseInt(currentBatch, 10) || 1;
      totalCost = Math.floor(global.Numeric.calculateBatchCost(upgrade.baseCost, upgrade.costMultiplier, upgrade.level, purchaseCount) * discountMult);
    }

    if (purchaseCount <= 0 || state.essence < totalCost) {
      if (global.Sound) global.Sound.playError();
      return;
    }

    state.essence -= totalCost;
    upgrade.level += purchaseCount;
    state.totalUpgradesBought = (state.totalUpgradesBought || 0) + purchaseCount;

    if (global.Sound) global.Sound.playUpgrade();
    if (global.CosmicEvents) global.CosmicEvents.track('upgrades', purchaseCount);

    global.GameState.save();
    global.UI.updateStatsDisplay();
    renderUpgradesList();
  }

  function renderUpgradesList() {
    const container = document.getElementById('upgradesList');
    if (!container) return;

    const state = global.GameState.get();
    const format = global.Numeric ? global.Numeric.format : function (n) { return Math.floor(n); };

    let html = '';

    state.upgrades.forEach(function (u) {
      // Check unlocked requirement
      if (state.level < u.unlockedAtLevel) {
        html += `
          <div class="upgrade-card" style="opacity: 0.45; filter: grayscale(0.8);">
            <div class="upgrade-info">
              <div class="upgrade-icon-box" style="background: rgba(30, 41, 59, 0.4); color: #64748b;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div class="upgrade-details">
                <div class="upgrade-name">${u.name}</div>
                <div class="upgrade-effect" style="color: #64748b;">Unlocks at Level ${u.unlockedAtLevel}</div>
              </div>
            </div>
            <span class="nx-badge" style="background: rgba(30, 41, 59, 0.6); color: #64748b; font-size: 0.6875rem;">Locked</span>
          </div>
        `;
        return;
      }

      let cost = 0;
      let buyLabel = '';
      let canAfford = false;

      const hasMarketDiscount = state.skills && state.skills.some(function (s) { return s.id === 'fortune_market' && s.unlocked; });
      const discountMult = hasMarketDiscount ? 0.85 : 1.0;

      if (currentBatch === 'max') {
        const calc = global.Numeric.calculateMaxPurchasable(u.baseCost * discountMult, u.costMultiplier, u.level, state.essence);
        if (calc.count === 0) {
          cost = Math.floor(global.Numeric.calculateBatchCost(u.baseCost, u.costMultiplier, u.level, 1) * discountMult);
          buyLabel = '+1';
          canAfford = state.essence >= cost;
        } else {
          cost = calc.totalCost;
          buyLabel = '+' + calc.count;
          canAfford = true;
        }
      } else {
        const count = parseInt(currentBatch, 10) || 1;
        cost = Math.floor(global.Numeric.calculateBatchCost(u.baseCost, u.costMultiplier, u.level, count) * discountMult);
        buyLabel = '+' + count;
        canAfford = state.essence >= cost;
      }

      const effectLabel = u.effectType === 'click'
        ? `+${format(u.baseEffect)} Click Power`
        : `+${format(u.baseEffect)}/s CPS`;

      const totalEffect = format(u.level * u.baseEffect);

      html += `
        <div class="upgrade-card ${canAfford ? 'can-afford' : 'cant-afford'}" onclick="UIUpgrades.buy('${u.id}')">
          <div class="upgrade-info">
            <div class="upgrade-icon-box" style="background: rgba(56, 189, 248, 0.12); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.25);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <div class="upgrade-details">
              <div class="upgrade-name-row">
                <span class="upgrade-name">${u.name}</span>
                <span class="upgrade-level-badge">Lv.${u.level}</span>
              </div>
              <div class="upgrade-effect">${effectLabel} <span style="color: #38bdf8; font-family: ui-monospace, monospace;">(Total: +${totalEffect})</span></div>
            </div>
          </div>
          <button class="nx-btn ${canAfford ? 'nx-btn-primary' : 'nx-btn-disabled'} upgrade-buy-btn" onclick="event.stopPropagation(); UIUpgrades.buy('${u.id}')">
            <span style="font-size: 0.6875rem; opacity: 0.85;">Buy ${buyLabel}</span>
            <span style="font-family: ui-monospace, monospace;">${format(cost)}</span>
          </button>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  function init() {
    const buttons = document.querySelectorAll('.multiplier-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const mult = btn.dataset.mult;
        setBatchMultiplier(mult === 'max' ? 'max' : parseInt(mult, 10));
      });
    });

    renderUpgradesList();

    // Auto re-render check every 500ms for cost afford highlighting
    setInterval(renderUpgradesList, 500);
  }

  global.UIUpgrades = {
    init: init,
    buy: buyUpgrade,
    setMultiplier: setBatchMultiplier,
    render: renderUpgradesList
  };
})(typeof window !== 'undefined' ? window : this);
