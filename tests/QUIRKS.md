# Nexyroth Clicker - Documented Quirks & Unwired Behaviors (Characterization Phase 2)

Tài liệu này ghi lại toàn bộ các hành vi đặc thù, công thức tính toán thực tế, và các tính năng chưa được nối dây (dangling/unwired) hoặc có sự khác biệt giữa mô tả UI và code thực tế trong mã nguồn kế thừa `js/`.

Theo đúng quy tắc Phase 2: **TUYỆT ĐỐI KHÔNG sửa mã nguồn `js/`**; toàn bộ các hành vi này đã được khóa lại bằng các bài test tự động trong `tests/characterization/`.

---

## 1. Hệ Thống Số & Định Dạng (`js/numeric.js`)

### 1.1. Thứ tự kiểm tra vô cực âm (`-Infinity`)
- **Hiện tượng**: `Numeric.format(-Infinity)` trả về `'∞'` thay vì `'-∞'`.
- **Nguyên nhân**: Lệnh `if (!isFinite(num)) return '∞';` đứng trước lệnh `if (num < 0) return '-' + ...`. Vì `-Infinity` không phải số hữu hạn (`!isFinite` là `true`), hàm thoát ngay và trả về ký tự vô cực dương.

### 1.2. Giữ số 0 thừa ở hàng thập phân (`1500` -> `'1.50 K'`)
- **Hiện tượng**: `Numeric.format(1500)` trả về `'1.50 K'` thay vì `'1.5 K'`.
- **Nguyên nhân**: Khi số được thu nhỏ `< 100` (ở đây $1500 / 1000 = 1.5$), code gọi `.toFixed(2)` cho ra chuỗi `"1.50"`. Regex làm sạch chỉ là `.replace(/\.00$|\.0$/, '')`, nên chỉ xóa `.00` hoặc `.0`, không xóa số `0` đứng sau chữ số khác (như `.50`).

### 1.3. Nhánh ký hiệu khoa học (`useScientific = false`) ở ngưỡng cực lớn
- **Hiện tượng**: Mảng `SUFFIXES` có 103 phần tử (từ `''` đến `Inf` tại bậc $10^{306}$).
- **Hệ quả**: Trong chuẩn JavaScript IEEE-754 64-bit float, số lớn nhất là $\approx 1.79 \times 10^{308}$ (bậc 102). Mọi số $\ge 10^{309}$ đều tự động tràn thành `Infinity` và trả về `'∞'`. Do đó, điều kiện `tier >= SUFFIXES.length` để chuyển sang `toExponential` khi không bật cờ `useScientific` là nhánh mã chết (dead code) trên kiểu dữ liệu số thực chuẩn của JS.

---

## 2. Cửa Hàng & Tiền Tệ (`js/ui-core.js`, `js/state.js`)

### 2.1. [ĐÃ NỐI DÂY - Phase 5E-1] Cổ vật Gem Shop `gem_crit_overload` không tăng sát thương chí mạng
- **Trạng thái**: **ĐÃ NỐI DÂY** trong Phase 5E-1.
- **Mô tả trong game**: `"Permanently boosts Critical Strike Chance by +10% and Power by +200%"`.
- **Giải pháp**: Trong `src/engine/stats.ts`, khi `item.purchased && item.id === 'gem_crit_overload'`, cộng thêm `+2.0` vào hệ số sát thương chí mạng (`critMultiplier`), cộng dồn với kỹ năng `crit_supernova`.
- **Test chứng minh**: `tests/regression/prompt-5e1.test.ts` (Section 2) & `tests/characterization/wiring.test.ts`.

### 2.2. [ĐÃ NỐI DÂY - Phase 5E-1] Drone tự động `gem_auto_click` chưa được nối dây (Dangling)
- **Trạng thái**: **ĐÃ NỐI DÂY** trong Phase 5E-1.
- **Mô tả trong game**: `"Automatically clicks Core 5 times/sec continuously"` (giá 60 Gems).
- **Giải pháp**: Tích hợp vào vòng lặp auto-click `setInterval(..., 50)` trong `js/ui-core.js`, chạy nhịp 4 tick (200ms = 5 click/giây), tôn trọng nút tạm dừng `isAutoClickerPaused` và đóng băng khi tab ẩn (`PAUSE_AUTOCLICK_POTION_WHILE_HIDDEN`). Nếu có nguồn auto 50ms (thuốc/VIP pass), ưu tiên tốc độ nhanh nhất (50ms).
- **Test chứng minh**: `tests/regression/prompt-5e1.test.ts` (Section 1).

---

## 3. Cây Kỹ Năng Vũ Trụ (`js/state.js`, `js/ui-core.js`, `js/bonuses.js`)

### 3.1. Nhánh 5 "Vận May" (`luck_*`) biến mất khỏi `DEFAULT_SKILLS`
- **Mã nguồn tham chiếu**:
  - `js/bonuses.js`: Kiểm tra các kỹ năng `luck_boss_1`, `luck_boss_2`, `luck_infinite`, `luck_item_1`, `luck_gem_1`, `luck_offline`.
  - `js/main.js`: Kiểm tra `s.branch === 'luck'`.
  - `js/state.js`: Thành tựu `skills_luck_branch` ("Mở khoá nhánh kỹ năng 🍀 Vận May").
- **Thực tế**: Mảng `DEFAULT_SKILLS` trong `js/state.js` chỉ có 15 kỹ năng thuộc 4 nhánh (`core`, `chrono`, `crit`, `fortune`, `overdrive`). Hoàn toàn không có bất kỳ kỹ năng nào thuộc nhánh `luck`.

### 3.2. Các Kỹ Năng Kế Thừa Chưa Được Nối Dây (Dangling Skills)
1. **`chrono_warp`**: Mô tả tăng tốc độ auto-click thêm +15%/cấp, nhưng interval auto-click cố định ở 50ms và không đọc `chrono_warp`.
2. **`chrono_infinity`**: Mô tả giảm 50% thời gian hồi chiêu của 3 kỹ năng kích hoạt, nhưng hàm `triggerSkill()` đặt cứng thời gian hồi 60s, 90s, 120s mà không áp dụng giảm trừ (chỉ tính toán hiển thị trên UI modal).
3. **`fortune_dust`**: Mô tả tăng +20% Shards khi Thăng Thiên/Tái Sinh, nhưng hàm `executePrestige()` trong `js/ui-modals.js` chỉ dùng công thức `Math.floor(Math.sqrt(state.totalEssence / 1000000))` mà không nhân với hệ số của `fortune_dust`.
4. **`fortune_meteor`**: Mô tả tăng 30% tần suất xuất hiện sao băng và khe nứt, nhưng các hàm `setInterval` trong `js/ui-core.js` chạy cố định chu kỳ 50s và 45s.
5. **`overdrive_horizon`**: Mô tả tăng 50% sản lượng trong 30s khi kích hoạt kỹ năng, nhưng `triggerSkill()` không tạo bùa lợi cho kỹ năng này.

---

## 4. Hệ Thống Thú Cưng (`DEFAULT_PETS` vs `js/bonuses.js`)

### 4.1. 18 Thú cưng thế giới (`w1_*`, `w2_*`, `w3_*`, `w4_*`) chưa có logic áp dụng
- Trong `DEFAULT_PETS` có 18 thú cưng thuộc 4 thế giới với mô tả như `+5% Click`, `+10% Boss Damage`, v.v.
- Tuy nhiên, trong `calculateStats()` và `bonuses.js`, không có đoạn code nào duyệt qua các thú cưng thế giới này để cộng chỉ số.

### 4.2. Thú cưng `dragon` và `night_owl`
- `DEFAULT_PETS` khai báo 19 thú cưng (18 thú cưng thế giới + `night_owl` - Cú Đêm Vĩnh Cửu).
- `night_owl` được nối dây chính xác trong `Bonuses.getOfflineEfficiency()`.
- `bonuses.js:38` có kiểm tra `state.pets.dragon.level` để tăng sát thương Boss, nhưng `dragon` không có trong danh sách khởi tạo của `DEFAULT_PETS`.

---

## 5. Hệ Thống Chiến Đấu & Combo (`js/ui-core.js`)

### 5.1. Hệ số Combo kích hoạt ngay từ cú click đầu tiên
- Khi thực hiện click Core lần đầu (`comboHits = 1`), hàm `updateComboState()` tính:
  ```javascript
  const baseComboMult = 1.0 + tier * 0.2 + progressInTier * 0.015;
  ```
  Với `tier = 0, progressInTier = 1`, hệ số trở thành $1.015$ (được áp dụng x1.01 trong combat gain). Vì vậy cú click đầu tiên nhận thêm $1.01 \times$ thay vì đúng $1.00 \times$.

### 5.2. Công thức máu Boss (Boss HP Formula)
- Công thức chuẩn xác trong code:
  $$\text{baseHp} = \lfloor 25000 \times 1.8^{(\text{nextLevel} - 1)} \rfloor$$
- Nếu `tier === 'rare'`: $\text{baseHp} = \lfloor \text{baseHp} \times 1.5 \rfloor$
- Nếu `tier === 'daily'`: $\text{baseHp} = \lfloor \text{baseHp} \times 3.0 \rfloor$
- Nếu `isMilestone` (cấp chia hết cho 10): $\text{baseHp} = \lfloor \text{baseHp} \times 1.5 \rfloor$
- Các hệ số nhân áp dụng kế tiếp nhau (tuần tự qua `Math.floor`).

---

## 6. Trạng Thái Khởi Tạo Mặc Định (`js/state.js`)

- **Cổ vật kích hoạt sẵn**: Mặc định khi tạo save mới, người chơi đã được trang bị sẵn 2 cổ vật:
  1. `relic_eye`: +15% Click Power, +5% Crit Chance.
  2. `relic_hourglass`: +25% CPS.
- Do đó, ở trạng thái ban đầu:
  - `clickPower = 1.15`
  - `critChance = 0.10` (0.05 cơ bản + 0.05 từ `relic_eye`)

---

## 7. Chi Tiết Điều Tra Bổ Sung (Nhiệm Vụ T9)

### 7.1. Kỹ năng `chrono_overclock` (Mô tả vs Thực tế)
- **Mô tả UI**: `descVi: "Tăng +25% thời lượng duy trì các bùa lợi và tăng tốc Lõi."`, `effectType: 'buffDuration'`.
- **Thực tế trong code**:
  - Tại `js/ui-core.js:160`: `if (s.id === 'chrono_overclock') skillClickMult += lvl * 0.10;`
  - Tại `js/ui-modals.js:1371`: `if (s.id === 'chrono_overclock') perkClick += lvl * 0.10;`
  - Không có bất kỳ dòng code nào tăng thời lượng cho `activeBoosts` hay các bùa lợi thuốc (`activePotions`).
  - **Kết luận**: Kỹ năng thực tế cộng **+10% Click Power (`skillClickMult`) mỗi cấp**. Phần thời lượng bùa lợi hoàn toàn chưa được nối dây (unwired).

### 7.2. Kỹ năng `fortune_market` (Giảm 15% giá mua Upgrade)
- **Mô tả UI**: `descVi: "Giảm 15% giá mua tất cả các công trình nâng cấp trong trạm vũ trụ."`, `effectType: 'costDiscount'`.
- **Thực tế trong code**:
  - Tại `js/ui-upgrades.js:31`:
    ```javascript
    const hasMarketDiscount = state.skills && state.skills.some(function (s) { return s.id === 'fortune_market' && s.unlocked; });
    const discountMult = hasMarketDiscount ? 0.85 : 1.0;
    ```
  - Tại `js/ui-upgrades.js:40`: `totalCost = Math.floor(calculateBatchCost(...) * discountMult);`
  - Tại `js/ui-upgrades.js:93`: Tương tự áp dụng cho giá hiển thị trong `renderUpgradesList()`.
  - **Kết luận**: Kỹ năng **ĐƯỢC NỐI DÂY VÀ HOẠT ĐỘNG CHUẨN XÁC** trong `js/ui-upgrades.js`, giảm thực tế 15% giá tiền nâng cấp khi mở khóa.

### 7.3. Phân Tích Thành Tựu Không Thể Đạt Được (Unattainable Achievements)
Trong tổng số 35 thành tựu (`DEFAULT_ACHIEVEMENTS`), có **2 thành tựu không thể hoàn thành** trong phiên bản hiện tại:
1. **`potions_10`** (id: `potions_10`, target: 10, type: `potions_used`):
   - *Mô tả*: "Sử dụng 10 bình thuốc tăng cường."
   - *Lý do*: Trong `js/main.js:220-234` (`updateAchievementsProgress`), hoàn toàn không có nhánh xử lý cho `type === 'potions_used'`. Đồng thời hàm `usePotion()` trong `js/ui-modals.js` cũng không lưu trữ biến đếm tổng số thuốc đã dùng. Do đó `current` vĩnh viễn bằng 0.
2. **`skills_luck_branch`** (id: `skills_luck_branch`, target: 1, type: `luck_branch`):
   - *Mô tả*: "Mở khoá nhánh kỹ năng 🍀 Vận May."
   - *Lý do*: Trong `js/main.js:217`: `const luckSkillUnlocked = (state.skills || []).some(function (s) { return s.branch === 'luck' && s.unlocked; });`. Tuy nhiên, mảng `DEFAULT_SKILLS` trong `js/state.js` chỉ có 15 kỹ năng thuộc 4 nhánh (`core`, `chrono`, `crit`, `fortune`, `overdrive`). Nhánh `luck` hoàn toàn không tồn tại trong dữ liệu game, khiến điều kiện không bao giờ thỏa mãn.

- **Hiệu quả thực tế của Buff Thành Tựu:**
  - Có 33/35 thành tựu khả thi (trong đó thành tựu thứ 35 `all_achievements` yêu cầu 30 thành tựu, vẫn đạt được vì $33 \ge 30$).
  - Mức buff tối đa thực tế: $33 \times 0.5\% = \mathbf{+16.5\%}$ (thay vì $+17.5\%$ trên lý thuyết nếu đủ 35 thành tựu).

### 7.4. Danh Sách Chi Tiết Toàn Bộ Tham Chiếu Tới `luck_*` / Nhánh `luck` Trong `js/`
Dưới đây là bảng thống kê toàn bộ 12 vị trí tham chiếu tới nhánh hoặc kỹ năng `luck` trong mã nguồn:
1. `js/bonuses.js:21`: `if (s.id === 'luck_boss_1') mult += 0.25;` — Không bao giờ khớp (không tăng sát thương boss).
2. `js/bonuses.js:22`: `if (s.id === 'luck_boss_2') mult += 0.40;` — Không bao giờ khớp.
3. `js/bonuses.js:23`: `if (s.id === 'luck_infinite' && s.level) mult += 0.05 * s.level;` — Không bao giờ khớp.
4. `js/bonuses.js:53`: `if (s.id === 'luck_item_1') chance += 0.15;` — Không bao giờ khớp (không tăng tỉ lệ rơi item).
5. `js/bonuses.js:54`: `if (s.id === 'luck_infinite' && s.level) chance += 0.02 * s.level;` — Không bao giờ khớp.
6. `js/bonuses.js:79`: `if (s.id === 'luck_gem_1') chance += 0.12;` — Không bao giờ khớp (không tăng tỉ lệ rơi gem).
7. `js/bonuses.js:80`: `if (s.id === 'luck_infinite' && s.level) chance += 0.02 * s.level;` — Không bao giờ khớp.
8. `js/bonuses.js:107`: `if (s.id === 'luck_offline') eff += 0.20;` — Không bao giờ khớp (không tăng hiệu suất ngoại tuyến).
9. `js/bonuses.js:108`: `if (s.id === 'luck_infinite' && s.level) eff += 0.03 * s.level;` — Không bao giờ khớp.
10. `js/main.js:217`: `const luckSkillUnlocked = (state.skills || []).some(function (s) { return s.branch === 'luck' && s.unlocked; });` — Luôn trả về `false`.
11. `js/main.js:230`: `if (ach.type === 'luck_branch') ach.current = luckSkillUnlocked ? 1 : 0;` — `ach.current` luôn là 0.
12. `js/state.js:443`: `{ id: 'skills_luck_branch', name: 'Ngôi Sao May Mắn', ... type: 'luck_branch' }` — Thành tựu treo không thể mở khóa.

---

## 8. Hệ Thống Thông Báo Toast (`js/toast.js` & `src/ui/toast.ts`)

### 8.1. Toast: message được chèn dưới dạng HTML
- **Hiện tượng**: Trong `showToast` (`js/toast.js:134` và `src/ui/toast.ts`), thông điệp thông báo được nội suy trực tiếp vào mẫu chuỗi template của `toast.innerHTML`:
  ```html
  <span class="toast-msg-text" style="...">${message}</span>
  ```
- **Rà soát toàn bộ mã nguồn `js/` về chuỗi do người chơi nhập**:
  - *Mã đổi thưởng (Gift Codes)*: Trong `js/ui-modals.js` (`handleRedeemCode`), kết quả phản hồi được gán an toàn qua thuộc tính `codeFeedback.textContent = (result.success ? '✓ ' : '✗ ') + result.message;` trên modal Cài đặt, **hoàn toàn không gọi `Toast.show`**. Chuỗi input người chơi nhập từ ô input mã quà tặng không bị đưa vào Toast.
  - *Nhập mã sao lưu (Import Save Base64)*: Trong `js/ui-modals.js:468`, nếu việc giải mã Base64 thất bại, code gọi `Toast.show(res.error, 'error')`. `res.error` trả về các thông báo lỗi cố định nội bộ (như `"Mã lưu Base64 không hợp lệ."`, `"Tệp sao lưu không hợp lệ."`, hoặc message từ ngoại lệ `SyntaxError`).
  - *Các sự kiện trong game*: Tất cả các điểm gọi `Toast.show` khác trong `js/ui-core.js`, `js/ui-modals.js`, `js/daily.js`, `js/main.js` đều sử dụng các chuỗi mẫu cố định (hardcoded string literals / template literals) kết hợp với các giá trị số đã qua `Numeric.format()`, tên vật phẩm/cổ vật/kỹ năng định nghĩa sẵn trong từ điển `i18n.js`.
- **Kết luận**: Hiện tại không có luồng nào cho phép người chơi trực tiếp đưa chuỗi văn bản HTML/XSS tùy ý từ giao diện vào `Toast.show`. Tuy nhiên, vì mục tiêu Phase 3 là **giữ nguyên 100% hành vi**, cấu trúc gán `innerHTML` này được bảo toàn nguyên bản trong `src/ui/toast.ts`.

---

## 9. Hành Vi Đặc Thù Phase 4B (`js/daily.js`, `js/state.js`)

### 9.1. [ĐÃ SỬA - 2026-10-14] Cổ vật `relic_sovereign` từ Điểm Danh Ngày 7 (`js/daily.js:106-121`)
- **Trạng thái**: **ĐÃ SỬA** trong Phase 5D-2 (F4 Fix).
- **Giải pháp**:
  1. Trong `js/daily.js`: chỉ gán `equipped: true` nếu số lượng relic đang trang bị `< 4`; ngược lại gán `equipped: false`.
  2. Trong `src/engine/state/migrations.ts`: bước migration số 10 tự động tháo các relic vượt quá giới hạn 4 từ cuối mảng `state.relics` xuống còn đúng 4 (relic_sovereign bị tháo trước).
- **Test chứng minh**: `tests/regression/fixes.test.ts` (nhóm F4 Fix) & `tests/characterization/sovereign.test.ts` (test ii).

### 9.2. Phân kỳ giữa `importSaveBase64` và `loadState` (`js/state.js:847-983` vs `1013-1026`)
- `loadState()` khi nạp dữ liệu từ `localStorage`:
  1. `deepMerge(createInitialState(), parsed)`
  2. Chạy chuỗi di chuyển dữ liệu (migrations): backfill upgrades mới, hoàn SP và đồng bộ cấu trúc kỹ năng chòm sao nếu chưa có `core`, backfill 27 relics, 35 achievements, bổ sung pets còn thiếu, đảm bảo `records`, `potions`, `activePotions`, `daily`, `events`, `gamePasses`.
- `importSaveBase64(b64String)` khi nạp chuỗi Base64:
  1. Giải mã chuỗi Base64 -> JSON string -> `parsed`.
  2. Kiểm tra `parsed && typeof parsed.essence === 'number'`.
  3. Chỉ gọi duy nhất: `state = deepMerge(createInitialState(), parsed); saveState(); return { success: true };`.
  4. **HOÀN TOÀN KHÔNG CHẠY các bước migrate của `loadState()`**. Nếu một chuỗi Base64 thiếu upgrades mới hoặc skills ở phiên bản cũ, nó chỉ được `deepMerge` 1 cấp mà không được chạy các bước hoàn SP hay backfill chuyên sâu của `loadState` cho tới lần reload trang tiếp theo.

---

## 10. Hành Vi Đặc Thù Phase 5B (`js/ui-core.js`, `js/daily.js`)

### 10.1. Tỉ lệ xuất hiện Boss Hiếm (`rare`) trong `spawnNextBoss` (`js/ui-core.js:526-540`)
- **Code thực tế**:
  ```javascript
  const roll = Math.random();
  const canSpawnDaily = state.lastDailyBossDate !== today;
  if (canSpawnDaily && roll < 0.03) {
    tier = 'daily';
  } else if (roll < 0.15) {
    tier = 'rare';
  }
  ```
- **Hành vi**: Khi `canSpawnDaily` là `false` (người chơi đã hạ gục Boss Ngày hôm đó, `lastDailyBossDate === today`), điều kiện `canSpawnDaily && roll < 0.03` không thỏa mãn. Khi đó toàn bộ dải `roll < 0.15` (từ `0.00` đến `< 0.15`) đều rơi vào nhánh `else if (roll < 0.15) tier = 'rare'`. Do đó, tỉ lệ xuất hiện Boss Hiếm thực tế sau khi đã diệt Boss Ngày là **15%** (thay vì 12% khi chưa diệt Boss Ngày).

### 10.2. [ĐÃ SỬA - 2026-10-14] Lệch múi giờ giữa Boss Ngày (`ui-core.js:527, 421`) và Điểm Danh Ngày (`daily.js:22-25`)
- **Trạng thái**: **ĐÃ SỬA** trong Phase 5D-2 (F5 Fix).
- **Giải pháp**: `js/ui-core.js` (`handleCoreClick` và `spawnNextBoss`) chuyển sang dùng `getTodayDateString()` (YYYY-MM-DD theo giờ địa phương: `getFullYear()`, `getMonth() + 1`, `getDate()`) đồng nhất hoàn toàn với `js/daily.js`.
- **Test chứng minh**: `tests/regression/fixes.test.ts` (nhóm F5 Fix).

### 10.3. [ĐÃ SỬA - 2026-10-14] Thưởng EXP hạ gục Boss không kiểm tra thăng cấp ngay (`js/ui-core.js:433` vs `366`)
- **Trạng thái**: **ĐÃ SỬA** trong Phase 5D-2 (F3 Fix).
- **Giải pháp**: Trong `src/engine/click.ts`, vòng lặp thăng cấp được thực hiện SAU khi đã cộng dồn phần thưởng EXP khi hạ gục Boss (`newCurrentExp += earnedExp`), cho phép người chơi thăng cấp ngay trong cùng cú click kết liễu boss.
- **Test chứng minh**: `tests/regression/fixes.test.ts` (nhóm F3 Fix).

---

## 11. Vòng Lặp Trò Chơi, Offline & Thành Tựu Phase 5C-B (`js/main.js`, `js/bonuses.js`, `src/data/achievements.ts`)

### 11.1. [ĐÃ SỬA - 2026-10-14] Tick Cố Định 0.1s Không Xử Lý VisibilityChange / Delta-Time (`js/main.js:44`)
- **Trạng thái**: **ĐÃ SỬA** trong Phase 5D-1 (2026-10-14).
- **Giải pháp**: Xây dựng engine bù tick thuần `src/engine/catchup.ts` (`planCatchUp`) kết hợp theo dõi thời gian thực bằng `Date.now()` và `document.visibilitychange` trong `js/main.js`.
- **Chính sách áp dụng**:
  - `TICK_MS = 100`: Bước thời gian tick chuẩn 0.1 giây.
  - `ACTIVE_CATCHUP_MAX_MS = 120000` (2 phút): Khoảng trống thời gian $\le 120$s được bù theo các bước tick (`mode: 'ticks'`); lớn hơn 120s chuyển sang tính thưởng ngoại tuyến (`mode: 'offline'`).
  - `PAUSE_BOSS_WHILE_HIDDEN = true`: Đóng băng thời gian đếm ngược của Boss khi tab bị ẩn.
  - `PAUSE_AUTOCLICK_POTION_WHILE_HIDDEN = true`: Đóng băng thuốc `auto_50ms` khi tab bị ẩn; các thuốc và bùa lợi khác vẫn đếm ngược bình thường.
- **Test chứng minh**:
  - `tests/unit/catchup.plan.test.ts`: Kiểm tra phân bổ bước bù, cộng dồn dư số, và ngưỡng chuyển đổi sang offline.
  - `tests/integration/catchup.shell.test.ts`: Chứng minh tính tương đương từng bit khi tab hiển thị (250 trường hợp ngẫu nhiên có seed), đóng băng boss/thuốc auto khi ẩn tab, và nhận thưởng offline đúng công thức khi khoảng trống thời gian vượt 120s.

### 11.2. `calculateOfflineProgress` Không Giới Hạn Mốc Thời Gian & Bỏ Qua Frenzy (`js/main.js:118-135`)
- **Hiện tượng**: Hàm `calculateOfflineProgress` trong `js/main.js` tính:
  `const offlineGain = stats.cps * elapsedSeconds * efficiency;`
- **Hành vi**:
  1. Không có giới hạn trần thời gian offline (người chơi rời game bao lâu cũng được nhận lũy kế theo toàn bộ `elapsedSeconds`).
  2. Sử dụng `stats.cps` mà không nhân với `stats.frenzyMultiplier` (khác với `gameTick` nơi `tickGain = (stats.cps * stats.frenzyMultiplier) / 10`).

### 11.3. Thẻ Game Pass `pass_offline_24h` Không Giới Hạn 24 Giờ (`js/bonuses.js:133`)
- **Mô tả trong game**: "Offline 24h & Hiệu suất 100%".
- **Code thực tế**: Trong `Bonuses.getOfflineEfficiency()` (`js/bonuses.js:133`):
  `if (state.gamePasses && (state.gamePasses.pass_offline_24h || state.gamePasses.pass_ultimate_bundle)) return 1.0;`
- **Hệ quả**: Thuộc tính này chỉ thiết lập hiệu suất offline đạt 100% (thay vì 50%), hoàn toàn không áp đặt mốc chặn 24 giờ cho thời gian vắng mặt trong `calculateOfflineProgress`.

### 11.4. Thành Tựu `potions_used` Không Có Nhánh Cập Nhật Tiến Độ (`src/data/achievements.ts:31`, `js/main.js:220-234`)
- **Hiện tượng**: Thành tựu `potions_10` được định nghĩa với `type: 'potions_used'`.
- **Thực tế**: Trong vòng lặp `updateAchievementsProgress()` (`js/main.js:220-234`), có các nhánh `if (ach.type === ...)` cho 13 loại thành tựu, nhưng hoàn toàn **không có nhánh nào xử lý `type === 'potions_used'`**. Tiến độ `current` của thành tựu này không bao giờ được cập nhật tự động trong tick.

---

## 12. Hành Vi Đặc Thù Phase 5C-A (`js/ui-core.js`, `js/state.js`, `js/main.js`, `js/ui-modals.js`)

### 12.1. [ĐÃ SỬA - 2026-10-14] `totalCrits` Vĩnh Viễn Bằng 0 (Ghost Counter & Unreachable Crits Achievements)
- **Trạng thái**: **ĐÃ SỬA** trong Phase 5D-2 (F1 Fix).
- **Giải pháp**: `resolveClick` (`src/engine/click.ts`) tính toán `totalCrits: isCrit ? currentTotalCrits + 1 : currentTotalCrits` và đưa vào `patch`; `js/ui-core.js` đồng bộ trường này vào `state`.
- **Hệ quả**: Bảng Thống kê hiển thị đúng số lần chí mạng; các thành tựu `crits_50`, `crits_500`, `crits_5000` và `all_achievements` nay đều có thể hoàn thành.
- **Test chứng minh**: `tests/regression/fixes.test.ts` (nhóm F1 Fix) & `tests/characterization/achievements.reachability.test.ts`.

### 12.2. [ĐÃ SỬA - 2026-10-14] Lên Cấp Tối Đa MỘT Lần Mỗi Cú Click (`js/ui-core.js:344-354`)
- **Trạng thái**: **ĐÃ SỬA** trong Phase 5D-2 (F2 Fix).
- **Giải pháp**: Thay thế câu lệnh rẽ nhánh `if` bằng vòng lặp `while (newCurrentExp >= newMaxExp && levelLoops < 1000)` trong `src/engine/click.ts`, thăng cấp liên tục đầy đủ các cấp độ tương ứng với lượng EXP nhận được từ cú click hoặc từ hạ gục boss.
- **Test chứng minh**: `tests/regression/fixes.test.ts` (nhóm F2 Fix).

### 12.3. [ĐÃ NỐI DÂY - Phase 5E-1] `potions_used` Không Có Bộ Đếm Lưu Trữ (`js/ui-modals.js:1597-1630`, `js/main.js:220-234`)
- **Trạng thái**: **ĐÃ NỐI DÂY** trong Phase 5E-1.
- **Giải pháp**: Bổ sung trường `potionsUsed: 0` trên `GameState` (Save v9.0); tăng +1 khi dùng thuốc qua `usePotion` hoặc `buyPotion(id, true)`; kết nối `achievementCurrents` trả về `state.potionsUsed || 0` cho case `potions_used`.
- **Hệ quả**: Thành tựu `potions_10` (Sử dụng 10 bình thuốc tăng cường) nay hoạt động chính xác và mở khóa khi đạt 10 lần dùng.
- **Test chứng minh**: `tests/regression/prompt-5e1.test.ts` (Section 3).

### 12.4. Phân Tích Khả Năng Đạt Được Của Toàn Bộ 35 Thành Tựu (Cập Nhật Sau 5E-1)
- Trong 35 thành tựu của hệ thống (`DEFAULT_ACHIEVEMENTS`):
  1. `skills_luck_branch` (type: `luck_branch`): Bị kẹt do nhánh kỹ năng `luck` không tồn tại trong `DEFAULT_SKILLS`.
  - Thành tựu `potions_10` (type: `potions_used`) nay **đã có thể đạt được** nhờ bộ đếm `state.potionsUsed` (Phase 5E-1).
  - Các thành tựu chí mạng `crits_50`, `crits_500`, `crits_5000` nay **đã có thể đạt được** nhờ sửa lỗi `totalCrits` (F1).
  - Thành tựu `all_achievements` (type: `achievements_count`, target: 30) nay **đã có thể đạt được** ($34 \ge 30$).
- **Tổng kết khả năng đạt**:
  - Số thành tựu không thể đạt: **1 / 35** (`skills_luck_branch`).
  - Số thành tựu tối đa có thể đạt: **34 / 35**.
  - Buff thành tựu tối đa thực tế: $34 \times 0.5\% = \mathbf{+17.0\%}$ (thay vì $+17.5\%$ trên lý thuyết nếu đủ 35 thành tựu).






