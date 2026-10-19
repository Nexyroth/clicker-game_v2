export const GEM_TOPUP_PACKS = [
  { id: 'pack_30', gems: 30, bonusGems: 0, priceVnd: '22,000₫', priceUsd: '$0.99', nameVi: 'Túi Đá Quý Nhỏ', nameEn: 'Pouch of Astral Gems', icon: '💎' },
  { id: 'pack_90', gems: 80, bonusGems: 10, priceVnd: '69,000₫', priceUsd: '$2.99', nameVi: 'Hộp Đá Quý Tinh Vân', nameEn: 'Nebula Gem Stash', icon: '✨', badge: '+12% TẶNG' },
  { id: 'pack_290', gems: 250, bonusGems: 40, priceVnd: '199,000₫', priceUsd: '$7.99', nameVi: 'Rương Kho Báu Hư Không', nameEn: 'Void Gem Vault', icon: '🔮', badge: 'BÁN CHẠY' },
  { id: 'pack_720', gems: 600, bonusGems: 120, priceVnd: '449,000₫', priceUsd: '$18.99', nameVi: 'Túi Thần Tài Thiên Hà', nameEn: 'Galactic Treasury', icon: '👑', badge: '+20% TẶNG' },
  { id: 'pack_1900', gems: 1500, bonusGems: 400, priceVnd: '999,000₫', priceUsd: '$39.99', nameVi: 'Kho Báu Chúa Tể Nexyroth', nameEn: 'Sovereign Gem Hoard', icon: '🪐', badge: 'SIÊU GIÁ TRỊ' },
] as const;

export type GemTopupPackDef = (typeof GEM_TOPUP_PACKS)[number];
