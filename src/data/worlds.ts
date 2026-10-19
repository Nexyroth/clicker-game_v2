export const WORLDS = [
  { id: 'w1', name: '🌌 Hư Không Nguyên Thuỷ', reqAscension: 0, currency: 'Essence', desc: 'Thế giới khởi nguyên của muôn loài, nơi năng lượng vũ trụ tràn ngập rực rỡ.' },
  { id: 'w2', name: '🪐 Tinh Vân Hỗn Độn', reqAscension: 1, currency: 'Bụi Sao Tinh Vân', desc: 'Cõi giới hỗn độn các vì sao rực cháy, mở khoá sau lần Thăng Thiên 1.' },
  { id: 'w3', name: '🕳️ Vực Thẳm Vô Tận', reqAscension: 3, currency: 'Tinh Thạch Vực Tối', desc: 'Vùng tối sâu thẳm vĩnh hằng, mở khoá sau lần Thăng Thiên thứ 3.' },
  { id: 'w4', name: '⛩️ Thiên Giới Vĩnh Hằng', reqAscension: 6, currency: 'Ánh Sáng Thần Thánh', desc: 'Thế giới thứ 4 thần thánh, mở khoá ở lần Thăng Thiên thứ 6, mang theo sức mạnh bất diệt.' },
] as const;

export type WorldDef = (typeof WORLDS)[number];
