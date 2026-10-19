/**
 * NEXYROTH CLICKER - NUMERIC & BIGNUM UTILITIES
 * Pure JavaScript - Zero dependencies
 */
(function (global) {
  'use strict';

  const SUFFIXES = [
    '', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 
    'Dc', 'Ud', 'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Ocd', 'Nod', 'Vg'
  ];

  /**
   * Format any number into human-readable shorthand or scientific notation
   */
  function formatNumber(value, scientific) {
    if (value === undefined || value === null || isNaN(value)) return '0';
    if (value < 0) return '-' + formatNumber(-value, scientific);
    if (value < 1000) {
      return value >= 10 ? Math.floor(value).toLocaleString() : value.toFixed(1).replace(/\.0$/, '');
    }

    if (scientific || value >= 1e66) {
      return value.toExponential(2).replace('+', '');
    }

    const exponent = Math.floor(Math.log10(value) / 3);
    if (exponent < SUFFIXES.length) {
      const scaled = value / Math.pow(10, exponent * 3);
      return scaled.toFixed(2) + SUFFIXES[exponent];
    }

    return value.toExponential(2).replace('+', '');
  }

  /**
   * Calculate cost for buying count upgrades
   * Geometric Series formula: a * (r^n - 1) / (r - 1)
   */
  function calculateUpgradeCost(baseCost, costMultiplier, currentLevel, count) {
    if (count <= 0) return 0;
    if (count === 1) {
      return Math.floor(baseCost * Math.pow(costMultiplier, currentLevel));
    }
    const a = baseCost * Math.pow(costMultiplier, currentLevel);
    const r = costMultiplier;
    const total = a * (Math.pow(r, count) - 1) / (r - 1);
    return Math.floor(total);
  }

  /**
   * Calculate max affordable levels and total cost
   */
  function calculateMaxAffordable(baseCost, costMultiplier, currentLevel, currency) {
    if (currency <= 0) return { count: 0, totalCost: 0 };
    
    const currentCost = baseCost * Math.pow(costMultiplier, currentLevel);
    if (currency < currentCost) {
      return { count: 0, totalCost: 0 };
    }

    const r = costMultiplier;
    const a = currentCost;
    
    const term = (currency * (r - 1) / a) + 1;
    let n = Math.floor(Math.log(term) / Math.log(r));
    if (n <= 0) n = 1;

    let totalCost = calculateUpgradeCost(baseCost, costMultiplier, currentLevel, n);
    while (totalCost > currency && n > 0) {
      n--;
      totalCost = calculateUpgradeCost(baseCost, costMultiplier, currentLevel, n);
    }

    return { count: Math.max(0, n), totalCost: totalCost };
  }

  global.Numeric = {
    formatNumber: formatNumber,
    calculateUpgradeCost: calculateUpgradeCost,
    calculateMaxAffordable: calculateMaxAffordable
  };
})(typeof window !== 'undefined' ? window : this);
