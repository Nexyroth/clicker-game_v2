# ⚔️ Nexyroth Clicker

Game **incremental / clicker** phong cách **cyberpunk – glassmorphism**, thuộc hệ NEXYROTH. Chạy hoàn toàn trên trình duyệt, không cần máy chủ, không cần tài khoản. Tiến trình được lưu ngay trên máy của bạn.

> 🚧 **Đang phát triển.** Dự án đang được chuyển dần sang TypeScript. Số liệu cân bằng và tính năng có thể thay đổi giữa các bản.

## Tính năng

- Bấm vào Lõi để thu Năng lượng, có bạo kích và combo
- Nâng cấp sản lượng tự động, cây kỹ năng nhiều nhánh
- Cổ vật (relic), thú cưng, thành tựu, quà điểm danh hằng ngày
- Boss, kể cả Boss Ngày
- Thăng Thiên (prestige) để nhận Astral Shards
- Bình thuốc tăng cường và cửa hàng Gem (ví dụ Astral Drone tự bấm)
- Tiến trình ngoại tuyến: vắng mặt vẫn nhận sản lượng khi quay lại
- Tab chạy nền vẫn được bù sản lượng (bù tick khi vắng dưới 2 phút, dài hơn dùng công thức ngoại tuyến)
- Hai ngôn ngữ: Tiếng Việt (mặc định) và English

## Chạy trên máy

Yêu cầu: [Node.js](https://nodejs.org/) (khuyến nghị bản LTS mới).

```bash
npm install
npm run dev
```

Mở http://localhost:3000.

> Không mở trực tiếp `index.html` hay dùng máy chủ tĩnh thông thường để chạy mã nguồn: các tệp `.ts` sẽ lỗi MIME trên Windows. Hãy dùng Vite như trên.

## Lệnh hữu ích

| Lệnh | Tác dụng |
| :--- | :--- |
| `npm run dev` | Chạy bản phát triển (cổng 3000) |
| `npm run build` | Đóng gói bản phát hành vào `dist/` |
| `npm run preview` | Xem thử bản đã build |
| `npm run lint` | Kiểm tra kiểu TypeScript (thường và strict) |
| `npm run test:run` | Chạy toàn bộ bộ test |

## Cấu trúc thư mục

```
src/engine/    Lõi game thuần (không DOM): chỉ số, click, tick, boss, offline, prestige...
src/engine/state/  Trạng thái, lưu/nạp, di trú phiên bản save
src/data/      Dữ liệu game (kỹ năng, relic, thành tựu, cửa hàng...)
js/            Lớp giao diện (đang chuyển dần sang TypeScript)
tests/         Test đối chiếu, đặc tả hành vi, kiến trúc, hồi quy
docs/          Tài liệu kiến trúc
_legacy/       Bản gốc v8 đóng băng, dùng làm chuẩn đối chiếu
```

Tài liệu thêm: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`tests/BEHAVIOR_CHANGELOG.md`](tests/BEHAVIOR_CHANGELOG.md), [`tests/QUIRKS.md`](tests/QUIRKS.md).

## Dữ liệu lưu

Game lưu bằng `localStorage` của trình duyệt (khóa `nexyroth_save_v8`, định dạng save hiện tại là phiên bản 9.0). Xóa dữ liệu trình duyệt hoặc đổi trình duyệt/thiết bị sẽ mất tiến trình, hãy dùng chức năng xuất/nhập save trong Cài đặt để sao lưu.

## Phát triển và kiểm thử

Mọi thay đổi lõi game được kiểm chứng bằng test đối chiếu từng bit với bản v8 gốc. Các thay đổi hành vi có chủ đích đều được ghi trong `tests/BEHAVIOR_CHANGELOG.md`. Trước khi gửi thay đổi, chạy:

```bash
npm run lint && npm run test:run && npm run build
```

## Triển khai (GitHub Pages)

`vite.config.ts` đã đặt `base: './'`, nên thư mục `dist/` sau `npm run build` có thể đăng trực tiếp lên GitHub Pages.

## Giấy phép

Chưa chọn giấy phép. Khi chưa có tệp `LICENSE`, mặc định mọi quyền được bảo lưu.
