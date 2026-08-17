# Angular Countries List

這是一個以 Angular 19 建立的國家資訊應用程式，提供使用者瀏覽全球國家列表、快速搜尋、依區域篩選，以及查看各國詳細資料的體驗。

## 專案簡介

本專案讓使用者可以：

- 瀏覽全世界各國的基本資訊
- 依國家名稱或代碼進行搜尋
- 依地區（Region）篩選國家
- 分頁查看結果列表
- 點選國家進入詳細頁面查看人口、首都、語言、貨幣、邊境國家等資訊
- 切換亮暗主題，並保留使用者偏好

## 功能特色

- 國家列表展示
  - 顯示國旗、國家名稱、人口、區域以及首都
- 搜尋功能
  - 可依國家英文名稱、官方名稱或 ISO 代碼搜尋
- 區域篩選
  - 可依洲/地區快速篩選
- 分頁導覽
  - 每頁固定數量資料，支援分頁切換
- 國家詳細頁
  - 顯示詳細資料與邊境國家連結
- 載入與錯誤狀態處理
  - 提供 loading、重試與未找到資料的提示
- 主題切換
  - 支援亮色 / 深色模式，並保存在 localStorage

## 使用技術

- Angular 19
- TypeScript
- RxJS
- Angular Router
- Angular HttpClient
- Standalone Components
- SCSS
- MSW (Mock Service Worker) 用於模擬 API 資料
- Lucide Icons
- Karma + Jasmine（單元測試）

## 專案結構

```bash
src/
├── app/
│   ├── core/
│   │   ├── api/          # 國家資料 API 服務
│   │   ├── theme/        # 主題管理
│   │   └── country.model.ts
│   ├── features/
│   │   ├── countries-list/   # 國家列表頁
│   │   └── country-detail/   # 國家詳細頁
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── app.config.ts
├── mocks/                # MSW mock 資料與 handlers
└── styles.scss
```

## 安裝與啟動

### 1. 安裝依賴

使用 pnpm：

```bash
pnpm install
```

### 2. 啟動開發伺服器

```bash
pnpm start
```

啟動後可在瀏覽器打開：

```text
http://localhost:4200/
```

### 3. 建置專案

```bash
pnpm run build
```

### 4. 執行測試

```bash
pnpm test
```

## 資料來源

本專案的國家資料使用 mock API 方式提供，實際內容遵循常見的國家資訊結構，方便在前端開發中進行資料展示與互動測試。
