# H5 Mock Endpoint Coverage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 补齐 H5 页面自检暴露的 mock 端点缺口，并修复通讯录搜索结果分组为空。

**Architecture:** 费用和工作单接口继续使用共享 server module 模式，仓储在 `server/modules/*/repository.ts`，端点在 `server/modules/*/endpoints.ts`，H5 mock 和 Nitro runtime 复用同一实现。通讯录搜索修复落在前端 API 工具函数 `formatStaffList`。

**Tech Stack:** uni-app Vue3、Alova、Vite mock、Nitro shared endpoint registry、Vitest。

---

### Task 1: Red Tests

**Files:**

- Modify: `src/tests/nitro-runtime/fee-endpoints.test.ts`
- Modify: `src/tests/nitro-runtime/work-order-endpoints.test.ts`
- Modify: `src/tests/nitro-runtime/staff-endpoints.test.ts`

- [x] **Step 1: Add fee endpoint coverage tests**

Add tests that assert these paths register and return page-compatible data: `/app/fee.listFee`, `/app/feeApi/listOweFees`, `/app/payment.nativeQrcodePayment`, `/app/iot/listChargeMachineBmoImpl`, `/app/iot/listChargeMachineOrderBmoImpl`, `/app/iot/listChargeMachinePortBmoImpl`, `/app/reportFeeMonthStatistics.queryReportFeeSummary`, `/app/reportFeeMonthStatistics/queryPayFeeDetail`, `/app/reportFeeMonthStatistics.queryReportFeeDetailRoom`, `/app/dataReport.queryFeeDataReport`, `/app/machine/listMachineRecords`, `/app/feeConfig.listFeeConfigs`.

- [x] **Step 2: Add work-order task endpoint tests**

Add tests for `/app/workorder/task/list`, `/app/workorder/task/items`, and `/app/workorder/copy/finish`.

- [x] **Step 3: Add staff grouping regression test**

Add a direct test for `formatStaffList` where all returned staff have `initials: 'Z'`; expected one group containing both staff.

- [x] **Step 4: Run targeted tests and verify red**

Run: `pnpm vitest run src/tests/nitro-runtime/fee-endpoints.test.ts src/tests/nitro-runtime/work-order-endpoints.test.ts src/tests/nitro-runtime/staff-endpoints.test.ts`

Expected: tests fail because endpoints and grouping behavior are missing.

### Task 2: Fee Shared Endpoints

**Files:**

- Modify: `server/modules/fee/repository.ts`
- Modify: `server/modules/fee/endpoints.ts`
- Modify: `server/shared/runtime/runtime-endpoints.ts`

- [x] **Step 1: Extend fee repository interface**

Add explicit methods for fee list, owe fee list, callable records, fee configs, payment QR code, charge machines, charge orders, charge ports, fee reports, data report, and open door records.

- [x] **Step 2: Add deterministic mock datasets**

Use stable IDs like `FEE_001`, `MACHINE_001`, `ORDER_001`, `ROOM_001`, and `COMM_001` so H5 smoke tests can use predictable route parameters.

- [x] **Step 3: Register endpoint definitions**

Map each old business URL from `src/api/fee.ts` to a repository method and wrap responses with `successResponse`.

- [x] **Step 4: Register fee runtime endpoints**

Ensure non-conflict fee endpoints are available in `runtimeEndpointDefinitions`; keep `/app/fee.queryFeeDetail` behavior covered by tests.

### Task 3: Work Order Task Endpoints

**Files:**

- Modify: `server/modules/work-order/repository.ts`
- Modify: `server/modules/work-order/endpoints.ts`

- [x] **Step 1: Extend work-order repository interface**

Add `getTaskList`, `getTaskItems`, and `finishCopyWork`.

- [x] **Step 2: Generate task data from existing orders**

Create task records for `WO_001` and compatible `WORK_001` route smoke parameters, with stable staff names and item states.

- [x] **Step 3: Register task endpoints**

Add endpoints for `/app/workorder/task/list`, `/app/workorder/task/items`, and `/app/workorder/copy/finish`.

### Task 4: Staff Grouping Fix

**Files:**

- Modify: `src/api/staff.ts`

- [x] **Step 1: Fix first group initialization**

Initialize the first group before iterating or use a `Map<string, Staff[]>`, then return sorted groups without dropping employees.

### Task 5: Verification

**Files:**

- No source edits unless verification exposes a bug.

- [x] **Step 1: Run targeted Vitest**

Run: `pnpm vitest run src/tests/nitro-runtime/fee-endpoints.test.ts src/tests/nitro-runtime/work-order-endpoints.test.ts src/tests/nitro-runtime/staff-endpoints.test.ts`

Expected: all targeted tests pass.

- [x] **Step 2: Start H5 mock server**

Run: `pnpm dev:h5`

Expected: local H5 server responds at `http://localhost:3000`.

- [x] **Step 3: Chrome MCP regression**

Open and check: `/pages-sub/fee/charge`, `/pages-sub/fee/charge-detail?machineId=MACHINE_001&communityId=COMM_001`, `/pages-sub/report/fee-summary`, `/pages-sub/report/pay-fee-detail`, `/pages-sub/report/room-fee`, `/pages-sub/report/open-door-log`, `/pages-sub/work/task-list?workId=WO_001`, `/pages-sub/work/do-copy-work?workId=WO_001&copyId=WC_001`, `/pages/address/list` with search keyword `张`.

Expected: no request from the listed endpoints returns 404, and 通讯录搜索 shows staff rows instead of empty state.
