# Nexyroth Clicker - Architecture Overview

1. Tách bạch hoàn toàn giữa Pure Math Engine (`src/engine/`) và UI Presentation/DOM (`js/` và `src/ui/`).
2. Pure Engine gồm các module độc lập: `stats.ts`, `bonusRules.ts`, `boss.ts`, `drops.ts`, `combo.ts`, `click.ts`, `tick.ts`, `catchup.ts`, `offline.ts`, `achievements.ts`, `prestige.ts`.
3. Toàn bộ hàm engine là pure functions: không dùng `window`, `document`, `Date.now()`, `Math.random()`, `localStorage`, nhận đầu vào bất biến.
4. Cầu nối đồng bộ `src/engine/api.ts` xuất đối tượng toàn cục `Engine` trên `globalThis` và `window`.
5. Vòng lặp trò chơi `gameTick` vận hành theo cơ chế Frame & Delta-Time: đo khoảng trống thời gian thực tế `gapMs` bằng `Date.now()` và thời gian ẩn bằng `document.visibilitychange`, ủy quyền cho `Engine.planCatchUp` phân bổ số bước bù hoặc chuyển đổi sang thưởng ngoại tuyến (`mode: 'offline'`) khi khoảng trống vượt 120s (`ACTIVE_CATCHUP_MAX_MS`).
6. Cơ chế đóng băng khi ẩn tab: đóng băng thời gian đánh Boss (`PAUSE_BOSS_WHILE_HIDDEN = true`) và tạm dừng đếm ngược thuốc tự động click `auto_50ms` (`PAUSE_AUTOCLICK_POTION_WHILE_HIDDEN = true`), trong khi sản lượng CPS thụ động vẫn được tính toán 100%.
7. Hệ thống chiến đấu cốt lõi `Engine.resolveClick` quản lý đếm đúng số cú click chí mạng (`state.totalCrits`), thăng cấp đa cấp độ qua vòng lặp `while` khi nhận lượng lớn EXP, và thăng cấp ngay tức thì khi nhận thưởng EXP từ việc hạ gục Boss.
8. Quản lý trạng thái và di chuyển dữ liệu: `src/engine/state/migrations.ts` thực thi quy tắc giới hạn tối đa 4 cổ vật trang bị đồng thời (bước migration 10 tháo các relic dư thừa ở cuối mảng).
9. Đồng bộ múi giờ địa phương: `js/ui-core.js` và `js/daily.js` dùng chung chuẩn ngày địa phương `YYYY-MM-DD` (`getTodayDateString`) cho cả điểm danh và Boss Ngày.
10. Kiểm thử tự động đa tầng: Architecture Purity Tests, Parity Tests đối chiếu 1:1 với legacy code, Characterization Tests, Unit Tests cho catchup planning, Regression Tests cho các lỗi sửa có chủ đích và Integrity Tests.
