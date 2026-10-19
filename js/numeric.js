/**
 * NEXYROTH CLICKER - NUMERIC & BIGNUM UTILITIES
 * Pure JavaScript - 100% Offline, Zero Dependencies
 */
(function (global) {
  'use strict';

  const SUFFIXES = [
    '', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No',
    'Dc', 'Ud', 'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Ocd', 'Nod',
    'Vg', 'Uvg', 'Dvg', 'Tvg', 'Qavg', 'Qivg', 'Sxvg', 'Spvg', 'Ocvg', 'Novg',
    'Tg', 'Utg', 'Dtg', 'Ttg', 'Qatg', 'Qitg', 'Sxtg', 'Sptg', 'Octg', 'Notg',
    'Qd', 'Uqd', 'Dqd', 'Tqd', 'Qaqd', 'Qiqd', 'Sxqd', 'Spqd', 'Ocqd', 'Noqd',
    'Qq', 'Uqq', 'Dqq', 'Tqq', 'Qaqq', 'Qiqq', 'Sxqq', 'Spqq', 'Ocqq', 'Noqq',
    'Sg', 'Usg', 'Dsg', 'Tsg', 'Qasg', 'Qisg', 'Sxsg', 'Spsg', 'Ocsg', 'Nosg',
    'St', 'Ust', 'Dst', 'Tst', 'Qast', 'Qist', 'Sxst', 'Spst', 'Ocst', 'Nost',
    'Og', 'Uog', 'Dog', 'Tog', 'Qaog', 'Qiog', 'Sxog', 'Spog', 'Ocog', 'Noog',
    'Nn', 'Unn', 'Dnn', 'Tnn', 'Qann', 'Qinn', 'Sxnn', 'Spnn', 'Ocnn', 'Nonn',
    'Ce', 'Inf'
  ];

  function formatNumber(num, useScientific) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    if (!isFinite(num)) return '∞';
    if (num < 0) return '-' + formatNumber(-num, useScientific);
    if (num < 1000) {
      return num % 1 === 0 ? num.toString() : num.toFixed(1).replace(/\.0$/, '');
    }

    if (useScientific) {
      return num.toExponential(2).replace('e+', 'e');
    }

    const tier = Math.floor(Math.log10(num) / 3);
    if (tier < SUFFIXES.length) {
      const suffix = SUFFIXES[tier];
      const scale = Math.pow(10, tier * 3);
      const scaled = num / scale;
      return scaled.toFixed(scaled >= 100 ? 1 : 2).replace(/\.00$|\.0$/, '') + ' ' + suffix;
    }

    return num.toExponential(2).replace('e+', 'e');
  }

  function calculateBatchCost(baseCost, multiplier, currentLevel, count) {
    if (count === 1) {
      return Math.floor(baseCost * Math.pow(multiplier, currentLevel));
    }
    let total = 0;
    for (let i = 0; i < count; i++) {
      total += Math.floor(baseCost * Math.pow(multiplier, currentLevel + i));
    }
    return total;
  }

  function calculateMaxPurchasable(baseCost, multiplier, currentLevel, availableEssence) {
    let count = 0;
    let totalCost = 0;
    while (true) {
      const nextCost = Math.floor(baseCost * Math.pow(multiplier, currentLevel + count));
      if (totalCost + nextCost > availableEssence) break;
      totalCost += nextCost;
      count++;
      if (count >= 1000) break; // Safeguard
    }
    return { count: count, totalCost: totalCost };
  }

  function formatDuration(sec) {
    if (!sec || sec <= 0) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
  }

  global.Numeric = {
    format: formatNumber,
    formatDuration: formatDuration,
    calculateBatchCost: calculateBatchCost,
    calculateMaxPurchasable: calculateMaxPurchasable
  };
})(typeof window !== 'undefined' ? window : this);
