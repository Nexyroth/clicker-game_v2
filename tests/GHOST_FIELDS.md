# Báo Cáo Rà Soát Trường Ma (Ghost Fields) Trong Nexyroth Clicker

Rà soát toàn bộ các tệp nguồn trong thư mục `js/` (`main.js`, `ui-core.js`, `ui-modals.js`, `events.js`, `daily.js`, `ui-upgrades.js`, `bonuses.js`, `audio.js`, `toast.js`, `state.js`).

---

## 1. Các trường cấp cao nhất trên `GameState` (`state.<field>`)

**Kết quả:** **0 trường ma cấp cao**.
Toàn bộ các truy cập `state.<field>` trong toàn bộ mã nguồn `js/` đều thuộc tập hợp 37 trường đã được khởi tạo trong `createInitialState()`:

1. `version`
2. `essence`
3. `totalEssence`
4. `astralShards`
5. `totalAstralShards`
6. `astralGems`
7. `divineLight`
8. `level`
9. `currentExp`
10. `maxExp`
11. `skillPoints`
12. `totalClicks`
13. `totalCrits`
14. `totalRifts`
15. `totalUpgradesBought`
16. `bossesDefeated`
17. `dailyBossesDefeated`
18. `lastDailyBossDate`
19. `prestigeCount`
20. `currentWorld`
21. `lastSaveTime`
22. `lastOfflineGain`
23. `records`
24. `upgrades`
25. `skills`
26. `relics`
27. `achievements`
28. `gemShopItems`
29. `pets`
30. `gamePasses`
31. `redeemedCodes`
32. `daily`
33. `events`
34. `potions`
35. `activePotions`
36. `settings`
37. `activeBoosts`

---

## 2. Các thực thể và thuộc tính động phát sinh lúc runtime / phụ thuộc Save

### 2.1. Thú cưng ảo `state.pets.dragon`
- **Tệp:Dòng**: `js/bonuses.js:38-39`
- **Truy cập**: Đọc (`if (state.pets && state.pets.dragon && state.pets.dragon.level) { mult += state.pets.dragon.level * 0.04; }`)
- **Có nằm trong `DEFAULT_PETS` không**: Không. Trong `DEFAULT_PETS` chỉ có `w4_gold_dragon`, không có key `dragon`.
- **Có được lưu vào save không**: Có thể xuất hiện nếu nạp tệp save từ phiên bản cũ hơn.
- **Xử lý TypeScript**: Đã mô hình hóa trong `PetsState` với trường optional `dragon?: PhantomDragonPet`.

### 2.2. Kỹ năng ảo nhánh Vận May (`luck_*`)
- **Tệp:Dòng**:
  - `js/bonuses.js:21`: `s.id === 'luck_boss_1'` (Đọc)
  - `js/bonuses.js:22`: `s.id === 'luck_boss_2'` (Đọc)
  - `js/bonuses.js:23`: `s.id === 'luck_infinite'` (Đọc)
  - `js/bonuses.js:53`: `s.id === 'luck_item_1'` (Đọc)
  - `js/bonuses.js:54`: `s.id === 'luck_infinite'` (Đọc)
  - `js/bonuses.js:79`: `s.id === 'luck_gem_1'` (Đọc)
  - `js/bonuses.js:80`: `s.id === 'luck_infinite'` (Đọc)
  - `js/bonuses.js:107`: `s.id === 'luck_offline'` (Đọc)
  - `js/bonuses.js:108`: `s.id === 'luck_infinite'` (Đọc)
  - `js/main.js:217`: `s.branch === 'luck' && s.unlocked` (Đọc)
- **Có nằm trong `DEFAULT_SKILLS` không**: Không.
- **Có được lưu vào save không**: Nếu người chơi nhập mã save cũ có các kỹ năng này, chúng sẽ nằm trong `state.skills` và được lưu lại.

### 2.3. Cổ vật động `relic_sovereign`
- **Tệp:Dòng**: `js/daily.js:107-123`
- **Truy cập**: Đọc (`state.relics.some(...)`) và Ghi (`state.relics.push({...})`)
- **Chi tiết**: Khi người chơi điểm danh nhận thưởng ngày 7 của chuỗi điểm danh hàng ngày (`daily.js`), mã nguồn kiểm tra nếu chưa có relic `relic_sovereign` thì đẩy một đối tượng Cổ Vật mới vào mảng `state.relics`. (Lưu ý: Trong `DEFAULT_RELICS` đã có sẵn `relic_sovereign_ring`, đây là 2 ID khác nhau).
- **Có được lưu vào save không**: **Có**. Sau khi được push vào `state.relics`, nó tồn tại trong state và được lưu vĩnh viễn vào `localStorage` khi `saveState()` chạy.

### 2.4. Thuộc tính `isInfinite` trên đối tượng Kỹ Năng
- **Tệp:Dòng**:
  - `js/state.js:358`: Khởi tạo trên skill `overdrive_zenith`
  - `js/state.js:909`: Gán khi merge state (`existing.isInfinite = true`)
  - `js/ui-modals.js:1100, 1218, 1252, 1267, 1289, 1290`: Đọc để kiểm tra điều kiện nâng cấp vô hạn
- **Có được lưu vào save không**: **Có**. Nằm trên phần tử của mảng `state.skills`.

### 2.5. Đối tượng Boss (`currentBoss`)
- **Tệp:Dòng**: `js/state.js:831, 1031, 1032`
- **Truy cập**: Thông qua `GameState.getBoss()` và `GameState.setBoss(b)`.
- **Có nằm trong `state` không**: **Không**. Boss là biến riêng biệt ngoài `state`.
- **Có được lưu vào save không**: **Không**. Khi tải lại trang hoặc reset, Boss luôn được khởi tạo lại từ `BOSS_PRESETS[0]`.

### 2.6. Trường bộ đếm thuốc `state.potionsUsed` (Chính thức hóa từ Phase 5E-1 / Save v9.0)
- **Tệp:Dòng**:
  - `src/engine/state/initialState.ts`: Khởi tạo giá trị mặc định `potionsUsed: 0`.
  - `src/engine/state/migrations.ts`: Bước 11 di trú `potionsUsed = 0` nếu save cũ thiếu trường này.
  - `js/ui-modals.js`: Tăng +1 khi dùng thuốc (`usePotion`, `buyPotion(id, true)`).
  - `src/engine/achievements.ts` & `js/main.js`: Đọc gán vào tiến độ thành tựu `potions_10`.
- **Có nằm trong `state` không**: **Có**. Nay là trường cấp 1 thứ 38 chính thức trong `GameState`.
- **Có được lưu vào save không**: **Có**. Được lưu và migrate tự động lên save version `'9.0'`.
