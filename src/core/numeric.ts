/**
 * NEXYROTH CLICKER - NUMERIC & BIGNUM UTILITIES (TypeScript)
 * 100% Offline, Zero Dependencies
 */

export const SUFFIXES: readonly string[] = [
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
] as const;

export function format(num: number | null | undefined, useScientific?: boolean): string {
  if (num === null || num === undefined || isNaN(num)) return '0';
  if (!isFinite(num)) return '∞';
  if (num < 0) return '-' + format(-num, useScientific);
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

export function calculateBatchCost(
  baseCost: number,
  multiplier: number,
  currentLevel: number,
  count: number
): number {
  if (count === 1) {
    return Math.floor(baseCost * Math.pow(multiplier, currentLevel));
  }
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += Math.floor(baseCost * Math.pow(multiplier, currentLevel + i));
  }
  return total;
}

export interface MaxPurchasableResult {
  count: number;
  totalCost: number;
}

export function calculateMaxPurchasable(
  baseCost: number,
  multiplier: number,
  currentLevel: number,
  availableEssence: number
): MaxPurchasableResult {
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

export function formatDuration(sec: number): string {
  if (!sec || sec <= 0) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
}

export const Numeric = {
  format: format,
  formatDuration: formatDuration,
  calculateBatchCost: calculateBatchCost,
  calculateMaxPurchasable: calculateMaxPurchasable
};

if (typeof window !== 'undefined') {
  (window as any).Numeric = Numeric;
}
