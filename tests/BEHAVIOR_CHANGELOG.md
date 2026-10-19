# Nexyroth Clicker - Intentional Behavior Changes Log (Phase 5D-1 & Phase 5D-2)

Tài liệu này ghi lại chi tiết toàn bộ các thay đổi hành vi có chủ đích trong Phase 5D-1 và Phase 5D-2, cùng danh sách các bài test đã được cập nhật assertion theo đúng quy tắc nghiêm ngặt của dự án.

---

## 1. Danh Sách Lỗi & Thay Đổi Hành Vi Có Chủ Đích

### 5D-1. Vòng lặp tick bù khi tab chạy nền (Background Tab Throttling Catch-Up)
- **Vấn đề**: Vòng tick `setInterval(gameTick, 100)` bị trình duyệt hạ xung/throttling khi tab ẩn, làm mất sản lượng CPS thụ động, làm chậm bộ đếm thời gian thuốc và kéo dài thời gian đánh Boss.
- **Giải pháp**: Xây dựng engine bù tick thuần `src/engine/catchup.ts` (`planCatchUp`) và tích hợp lắng nghe `document.visibilitychange` kết hợp `Date.now()` trong `js/main.js`.
- **Chính sách**:
  - `TICK_MS = 100`
  - `ACTIVE_CATCHUP_MAX_MS = 120000` (khoảng trống $\le 120$s bù theo tick; $> 120$s chuyển sang offline)
  - `PAUSE_BOSS_WHILE_HIDDEN = true` (đóng băng thời gian Boss khi tab ẩn)
  - `PAUSE_AUTOCLICK_POTION_WHILE_HIDDEN = true` (đóng băng thuốc auto_50ms khi tab ẩn)

### F1. `state.totalCrits` không bao giờ được tăng
- **Vấn đề**: Các cú click chí mạng không hề tăng trường `state.totalCrits`, dẫn đến bảng Thống kê luôn hiển thị 0 và 3 thành tựu chí mạng (`crits_50`, `crits_500`, `crits_5000`) không bao giờ hoàn thành được.
- **Giải pháp**: `resolveClick` đưa `totalCrits: isCrit ? current + 1 : current` vào `patch`; `js/ui-core.js` cập nhật lên state.

### F2. Lên cấp tối đa MỘT lần mỗi click (Single Level-Up Bug)
- **Vấn đề**: Lệnh `if (newCurrentExp >= newMaxExp)` chỉ cho phép người chơi tăng đúng 1 cấp dù nhận được lượng EXP khổng lồ.
- **Giải pháp**: Thay bằng vòng lặp `while (newCurrentExp >= newMaxExp && loops < 1000)` để thăng cấp liên tục đầy đủ các cấp độ tương ứng với lượng EXP nhận được.

### F3. Thưởng EXP khi hạ Boss không kích hoạt lên cấp ngay
- **Vấn đề**: Thưởng EXP từ Boss được cộng sau bước kiểm tra thăng cấp, khiến người chơi không được lên cấp ngay ở cú click kết liễu boss.
- **Giải pháp**: Di chuyển vòng lặp thăng cấp `while` xuống sau khi đã tính toán xong phần thưởng EXP hạ gục Boss.

### F4. `relic_sovereign` luôn được thêm với `equipped: true` vượt quá giới hạn 4 relic
- **Vấn đề**: Khi điểm danh ngày 7, mã nguồn đẩy `relic_sovereign` vào danh sách với `equipped: true` bất chấp người chơi đã trang bị đủ 4 cổ vật.
- **Giải pháp**:
  - Trong `js/daily.js`: chỉ gán `equipped: true` nếu số lượng relic đang trang bị $< 4$, ngược lại gán `equipped: false`.
  - Trong `src/engine/state/migrations.ts`: thêm bước 10 tháo các relic thừa ở cuối mảng `state.relics` nếu có nhiều hơn 4 relic đang trang bị.

### F5. Lệch múi giờ giữa Boss Ngày (UTC) và Quà Hằng Ngày (Giờ địa phương)
- **Vấn đề**: Boss Ngày dùng `toISOString().slice(0, 10)` (UTC, đổi ngày lúc 07:00 sáng tại VN) lệch với Điểm Danh Ngày dùng ngày địa phương (đổi ngày lúc 00:00).
- **Giải pháp**: `js/ui-core.js` chuyển sang dùng `getTodayDateString()` (YYYY-MM-DD theo `getFullYear()`, `getMonth() + 1`, `getDate()`) đồng bộ với `js/daily.js`.

---

## 2. Bảng Thống Kê Các Test Đã Cập Nhật Assertion

| Tệp Test | Tên Test | Kỳ Vọng Cũ | Kỳ Vọng Mới | Lỗi Liên Quan | Lý Do Thay Đổi |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tests/characterization/sovereign.test.ts` | Test (ii): Claiming Day 7 reward when 4 relics are already equipped | `countAfter = 5`, stats tăng vượt trội do kích hoạt 5 relic | `countAfter = 4`, `sovereign.equipped = false`, stats không đổi | F4 | Tuân thủ giới hạn tối đa 4 relic trang bị đồng thời; relic mới được cất vào Balo ở trạng thái chưa kích hoạt. |
| `tests/characterization/achievements.reachability.test.ts` | Test 1: state.totalCrits behavior on critical clicks | `expect(state.totalCrits).toBe(0)` sau 25 cú click chí mạng | `expect(state.totalCrits).toBe(25)` sau 25 cú click chí mạng | F1 | Sửa lỗi bộ đếm chí mạng để ghi nhận chính xác thành tích người chơi. |
| `tests/characterization/achievements.reachability.test.ts` | Test 2: Unreachable achievements characterization | 6 thành tựu không thể đạt (`potions_10`, `skills_luck_branch`, `crits_50`, `crits_500`, `crits_5000`, `all_achievements`), tối đa đạt 29/35, buff +14.5% | 2 thành tựu không thể đạt (`potions_10`, `skills_luck_branch`). 3 thành tựu chí mạng và `all_achievements` đạt được, tối đa đạt 33/35, buff +16.5% | F1 | `totalCrits` hoạt động giúp mở khóa 3 thành tựu chí mạng, từ đó vượt ngưỡng 30 thành tựu để mở `all_achievements`. |
| `tests/parity/click.parity.test.ts` | Sequence parity (400 random click seeds) | So sánh bit-for-bit nguyên bản với mã legacy cũ (vốn có lỗi F1, F2, F3) | Chuẩn hóa `legacyEnv` cho các thay đổi F1, F2, F3 trước khi đối chiếu bit-for-bit | F1, F2, F3 | Cho phép kiểm tra tính tương đương tuyệt đối của RNG, sát thương, vàng rơi, bùa lợi trong khi bảo đảm các hành vi sửa lỗi mới được chấp nhận. |
| `tests/architecture/engine-purity.test.ts` | Purity Boundary Enforcement | Kiểm tra danh sách 10 tệp engine thuần | Bổ sung `src/engine/catchup.ts` vào danh sách tệp thuần | 5D-1 | Đảm bảo module catchup tuân thủ 100% ranh giới kiến trúc không phụ thuộc DOM hay hàm sinh ngẫu nhiên impure. |
| `tests/characterization/wiring.test.ts` | Section 4: Gem Shop Items Wiring | `expect(critStats.critMultiplier).toBe(2.5)` (chưa nối sát thương chí mạng) | `expect(critStats.critMultiplier).toBe(4.5)` (+2.0 khi đã mua `gem_crit_overload`) | 5E-1 | Nối đầy đủ hiệu ứng của `gem_crit_overload` theo mô tả (tăng +2.0 critMultiplier). |
| `tests/characterization/achievements.reachability.test.ts` | Test 2: Unreachable achievements characterization | 2 thành tựu không thể đạt (`potions_10`, `skills_luck_branch`), tối đa 33/35 | 1 thành tựu không thể đạt (`skills_luck_branch`), tối đa 34/35, buff +17.0% | 5E-1 | `potionsUsed` hoạt động giúp hoàn thành thành tựu `potions_10` tại lần dùng thứ 10. |
| `tests/parity/stats.parity.test.ts` | Legacy vs pure stats parity (500 seeds) | So sánh nguyên bản với legacy `evalLegacyCalculateStats` | Chuẩn hóa `evalLegacyCalculateStats` cho `gem_crit_overload` (+2.0 khi purchased) | 5E-1 | Giữ nguyên assertion, bảo đảm parity bit-for-bit khi chưa mua gem và đồng bộ khi mua gem. |
| `tests/characterization/save.test.ts` | Corrupted JSON fallback version | `expect(loaded.version).toBe('8.0')` | `expect(loaded.version).toBe('9.0')` | 5E-1 | Cập nhật phiên bản Save v9.0 cho trạng thái mặc định fallback. |
| `tests/parity/achievements.parity.test.ts` | Legacy vs engine achievements parity (300 seeds) | `potions_used` không được xử lý trong legacy `main.js` | Chuẩn hóa legacy achievements cho `potions_used` sang `state.potionsUsed || 0` | 5E-1 | Đảm bảo tính tương thích bit-for-bit giữa Engine và Shell khi `potions_used` được nối dây. |
| `tests/parity/initialState.parity.test.ts` | createInitialState vs GameState.reset() | `expect(tsKeys.length).toBe(37)` | `expect(tsKeys.length).toBe(38)`, chuẩn hóa `legacyGS.get()` | 5E-1 | Đồng bộ trường `potionsUsed: 0` và save version `9.0` giữa TS và Legacy. |
| `tests/purity/engine.purity.test.ts` | Immutability & output check for achievementCurrents | `expect(achRes1![3]).toBeUndefined()` | `expect(achRes1![3]).toBe(0)` | 5E-1 | `achievementCurrents` nay trả về 0 thay vì undefined khi chưa dùng thuốc. |

---

## 3. Chi Tiết Thay Đổi Hành Vi Phase 5E-1 (Nối Dây Tính Năng & Save v9.0)

### 5E-1.1. Nối dây Astral Drone (`gem_auto_click`)
- **Vấn đề**: Vật phẩm Gem Shop `gem_auto_click` (giá 60 Gems) mô tả tự bấm 5 lần/giây nhưng hoàn toàn bị bỏ sót (dangling).
- **Giải pháp**:
  - Tận dụng vòng lặp `setInterval(..., 50)` sẵn có tại `js/ui-core.js`, không tạo vòng lặp song song.
  - Sử dụng bộ đếm chu kỳ 4 tick (4 × 50ms = 200ms = đúng 5 click/giây) gọi qua `handleCoreClick(null, true)` (có thể chí mạng).
  - Tôn trọng cờ tạm dừng `isAutoClickerPaused` và đóng băng khi tab ẩn (`typeof document !== 'undefined' && document.hidden` kết hợp `PAUSE_AUTOCLICK_POTION_WHILE_HIDDEN`).
  - Nếu có auto-click nhanh hơn (thuốc 50ms hoặc VIP Pass vĩnh viễn), tự động ưu tiên nguồn nhanh nhất (50ms), Drone chỉ đóng vai trò mức sàn 200ms và không cộng dồn chồng chéo.
  - Thêm hiển thị badge và nút Tạm dừng/Tiếp tục trên thanh Active Buffs khi Drone đang hoạt động.

### 5E-1.2. Nối dây Astral Supernova (`gem_crit_overload`)
- **Vấn đề**: `gem_crit_overload` chỉ cộng `+0.10` vào tỉ lệ chí mạng trong `stats.ts`, phần +200% (+2.0) sát thương chí mạng bị thiếu.
- **Giải pháp**:
  - Trong `src/engine/stats.ts`: khi `item.purchased && item.id === 'gem_crit_overload'`, cộng thêm `+2.0` vào `gemCritDamageBonus`.
  - Hệ số sát thương chí mạng: `critMult = 2.5 + skillCritDamageBonus + passCritDamageBonus + gemCritDamageBonus`.
  - Cộng dồn chính xác với kỹ năng `crit_supernova`. Khi chưa mua gem, hệ số bằng đúng 2.5.

### 5E-1.3. Thêm bộ đếm `state.potionsUsed` & Hoàn thành thành tựu `potions_10`
- **Vấn đề**: Không có biến đếm số thuốc đã sử dụng; `achievementCurrents` trả về `undefined` cho case `potions_used`.
- **Giải pháp**:
  - Bổ sung trường `potionsUsed: 0` vào `createInitialState()` và type definitions.
  - Tăng `state.potionsUsed` (+1) khi người chơi dùng thuốc từ Balo (`usePotion`) hoặc mua & kích hoạt ngay (`buyPotion` với `useImmediately = true`). Không tăng khi tải save.
  - Trong `src/engine/achievements.ts`: case `potions_used` trả về `state.potionsUsed || 0`.
  - Trong fallback `updateAchievementsProgress` (`js/main.js`): gán `ach.current = state.potionsUsed || 0`.
  - Thành tựu `potions_10` nay có thể đạt được và nhận thưởng 2 Gems.

### 5E-1.4. Nâng cấp phiên bản Save lên `9.0` & Đồng bộ Migration cho `importSaveBase64`
- **Vấn đề**: Save ở phiên bản `'8.0'` cần nâng lên `'9.0'`; hàm `importSaveBase64` trước đây chỉ `deepMerge` và lưu mà không chạy `runMigrations`.
- **Giải pháp**:
  - `initialState.ts` và `gameState.ts` thiết lập `version: '9.0'`.
  - `src/engine/state/migrations.ts`: thêm bước 11 di trú `potionsUsed = 0` nếu thiếu hoặc không hợp lệ, đồng thời gán `state.version = '9.0'`.
  - Giữ nguyên khóa lưu trữ localStorage: `nexyroth_save_v8`.
  - `importSaveBase64` trong `gameState.ts` nay chạy cùng quy trình migration như `loadState()`.

