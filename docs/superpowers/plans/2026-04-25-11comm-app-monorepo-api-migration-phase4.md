<!-- 已完成 -->

# 2026-04-25 11comm App Monorepo API Migration Phase4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 app legacy API 扩展迁移建立可审计波次矩阵，并在 `apps/api` 落地首个 repair 最小兼容迁移切片。

**Architecture:** Phase4 延续 Phase2/Phase3 的影子 API 策略：`apps/api` 继续作为唯一新增 Nitro 服务，app legacy `/app/**` 与 `/callComponent/**` 先兼容迁移，再逐步映射到 admin 业务路径。首批 Wave 4A 选择 repair/complaint/work-order 服务工单业务族，但只把已具备 admin 三级业务路径与 `apps/type` schema 基础的 repair 最小切片写入运行时；complaint/work-order 先进入迁移矩阵和独立评审队列。

**Tech Stack:** pnpm workspace, Turbo, Nitro v3, H3 from `nitro/h3`, Vitest Node environment, type-only shared DTO imports from `@01s-11comm/type`, app legacy endpoint registry, pure-admin route coordinates

---

## Scope Lock

Phase4 只处理 app legacy API 迁移波次规划和首批兼容迁移，不做 app/admin 全量切流，不退役旧服务，不做 Phase5 全量 admin CRUD。

允许范围：

- 读取 `apps/app/server/modules/**`、`apps/admin/server/api/**`、`apps/type/src/business/**` 和 `apps/admin/src/router/rank/rank-route-keys.ts` 作为迁移证据。
- 在 `docs/superpowers/reports/2026-04-25-phase4-consolidated-report.md` 维护单一 Phase4 汇总报告。
- 在 `apps/api` 新增 repair 最小兼容切片：legacy adapter、shared service/repository、少量 admin read-only adapter、Vitest 覆盖和 endpoint manifest 登记。
- Wave 4A 首批代码限定为 in-memory/shared runtime 兼容切片；`getRepairRuntime(event)` 始终返回 fallback runtime。
- 使用现有 `apps/type/src/business/property-manage/repairs-manage/schema.ts`；若实施中发现必须新增或修改 schema，停止当前落地，把 schema 变更拆成独立评审任务。

禁止范围：

- 不删除、移动、归档、重命名、清空 `apps/admin/server`、`apps/app/server`、`D:\code\ruan-cat\01s-11comm-app`。
- 不新增 Nitro 鉴权、JWT、Token、Neon Auth、`@neondatabase/auth`、Bearer/Authorization 校验。
- 不从 `"h3"` 导入 H3 helper；所有 H3 helper 均从 `nitro/h3` 导入。
- 不在 `apps/api` 或测试中定义 `pgTable`、`createInsertSchema`、`createSelectSchema`；数据库 schema 事实来源只在 `apps/type/src/business/**/schema.ts`。
- 不在 Wave 4A 新增 repair DB adapter、Drizzle query、`useDb(event)` runtime 分支或生产数据库写入逻辑。
- 不用脚本做大批量代码改写；只允许 `rg`、测试、类型检查、构建和人工编辑。
- 不一次性迁移 repair/resource/parking/charge-machine/open-door/machine-record。
- 不制造碎片化子代理报告；所有子代理反馈合并到单一 Phase4 汇总报告。
- 不提交 git；提交必须由用户另行授权。

## Wave 4A Recommendation

推荐首批 Wave 4A 选择 `repair/complaint/work-order` 服务工单业务族，而不是 `parking/resource`：

- `propertyManage.repairsManage.*` 已在 `rank-route-keys.ts` 中存在 7 个三级业务路径，首批可按 2-3 个三级路由拆分，不需要新建菜单坐标。
- `apps/type/src/business/property-manage/repairs-manage/schema.ts` 已存在 repair Trinity schema，首批可避免大批量 schema 落地。
- `apps/app/server/modules/repair/endpoints.ts` 已暴露 owner repair、staff repair、repair settings、dict 等 legacy endpoint，可从高频住户报修闭环开始验证。
- `complaint` 和 `work-order` 当前缺少明确 admin 三级业务路径与独立 schema 完成度，应先进入矩阵和评审，不在 Wave 4A 首批运行时注册。
- `parking/resource/charge-machine/open-door/machine-record` 涉及设备、开闸、库存、充电、外部集成和更宽 schema 面，风险高于 repair 首批切片。

Wave 4A 首批运行时只覆盖这些业务路径：

| 业务路径                                      | Phase4 首批职责          | 说明                                                                                                              |
| --------------------------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `propertyManage.repairsManage.repairsSetting` | repair settings 只读兼容 | 对应 `/app/repairSetting.listRepairSettings`                                                                      |
| `propertyManage.repairsManage.repairsTodo`    | 报修列表、详情、创建兼容 | 对应 `/app/ownerRepair.listOwnerRepairs`、`/app/ownerRepair.queryOwnerRepair`、`/app/ownerRepair.saveOwnerRepair` |
| `propertyManage.repairsManage.issues`         | 报修事件只读映射         | 只做 admin read-only adapter，不补齐完整 CRUD                                                                     |

执行子代理按业务路径拆分时，每个子代理最多负责 2-3 个三级路由。Wave 4A 的 repair 实施子代理不得同时接手 parking/resource/charge-machine。

## File Responsibility Map

### Phase4 Plan File

- Create: `docs/superpowers/plans/2026-04-25-11comm-app-monorepo-api-migration-phase4.md`
  - 本计划文件只描述 Phase4 执行方案。

### Phase4 Single Report

- Create or Modify: `docs/superpowers/reports/2026-04-25-phase4-consolidated-report.md`
  - 收纳 Scope Lock、只读盘点、迁移矩阵、子代理反馈、验证证据、pass/fail gate 结论。
  - 不为每个子代理、每个模块、每个检查点创建单独报告。

### Wave 4A Repair Runtime Files

- Create: `apps/api/server/modules/repair/types.ts`
  - 定义 Wave 4A repair DTO、query、list result 和 status mapping。
- Create: `apps/api/server/modules/repair/repository.ts`
  - 只提供 Wave 4A in-memory fallback repository；DB adapter、Drizzle query 与 schema import 延后到独立任务。
- Create: `apps/api/server/modules/repair/service.ts`
  - 封装列表、详情、创建、设置、字典等最小业务能力。
- Create: `apps/api/server/modules/repair/legacy-adapter.ts`
  - 输出 app legacy 响应形态，保持 `/app/**` 旧字段。
- Create: `apps/api/server/modules/repair/admin-adapter.ts`
  - 输出 admin read-only 响应形态，只覆盖本计划声明的 3 个三级业务路径。
- Create: `apps/api/server/modules/repair/legacy-endpoints.ts`
  - 注册 Wave 4A 允许进入 runtime 的 repair legacy endpoint。
- Create: `apps/api/server/modules/repair/runtime.ts`
  - 复用 Phase2/Phase3 runtime 模块形态，但 Wave 4A 始终返回 in-memory fallback runtime。
- Create: `apps/api/server/modules/repair/index.ts`
  - 统一导出 repair runtime 模块。
- Modify: `apps/api/server/shared/runtime/runtime-endpoints.ts`
  - 把 repair Wave 4A endpoint 加入 runtime endpoint manifest，并保留 phase/ownerModule 审计字段。
- Create: `apps/api/server/routes/api/property-manage/repairs-manage/repairs-setting/list.post.ts`
- Create: `apps/api/server/routes/api/property-manage/repairs-manage/repairs-todo/list.post.ts`
- Create: `apps/api/server/routes/api/property-manage/repairs-manage/issues/list.post.ts`
  - 只读 admin canonical route，用来证明 admin/app 共享 repair service，不扩展完整 CRUD。

### Wave 4A Tests

- Create: `apps/api/tests/legacy/repair-legacy-endpoints.test.ts`
- Create: `apps/api/tests/modules/repair-service.test.ts`
- Create: `apps/api/tests/admin/repair-admin-endpoints.test.ts`
- Modify: `apps/api/tests/runtime/endpoint-registry.test.ts`
- Modify: `apps/api/tests/infra/endpoint-manifest.test.ts`
- Modify: `apps/api/package.json`
  - 增加 `verify:phase4`，复用现有 Vitest、typecheck 和 build，不引入全局工具。

## Implementation Steps

### Task 1: Phase4 Baseline And Guardrails

**Files:**

- Read: `docs/superpowers/phase7-openspec-migration-index.md`（旧 app monorepo API 迁移总设计稳定索引）
- Read: `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/`（canonical OpenSpec change）
- Read: `docs/superpowers/specs/2026-04-25-11comm-admin-app-support-feature-expansion-design.md`
- Read: `docs/superpowers/plans/2026-04-25-11comm-app-monorepo-api-migration-phase3.md`
- Read: `apps/admin/src/router/rank/rank-route-keys.ts`
- Verify: `apps/api/**`
- Verify: `apps/admin/server/**`
- Verify: `apps/app/server/**`
- Verify: `D:\code\ruan-cat\01s-11comm-app`
- Create or Modify: `docs/superpowers/reports/2026-04-25-phase4-consolidated-report.md`

- [x] **Step 1: Verify preserved legacy sources and service boundaries**

Run:

```powershell
Test-Path apps/api
Test-Path apps/admin/server
Test-Path apps/app/server
Test-Path "D:\code\ruan-cat\01s-11comm-app"
```

Expected:

- All four commands print `True`.
- If any path prints `False`, stop Phase4 execution and record the blocker in `docs/superpowers/reports/2026-04-25-phase4-consolidated-report.md`.

- [x] **Step 2: Verify repair business coordinates and schema sources**

Run:

```powershell
rg -n '"propertyManage\.repairsManage\.(issues|repairsSetting|repairsTodo)"' apps/admin/src/router/rank/rank-route-keys.ts
rg --files apps/app/server/modules | rg "repair|complaint|work-order"
rg --files apps/type/src/business/property-manage/repairs-manage
```

Expected:

- The first command prints `issues`, `repairsSetting`, and `repairsTodo`.
- The second command prints `apps/app/server/modules/repair/**`, `apps/app/server/modules/complaint/**`, and `apps/app/server/modules/work-order/**`.
- The third command prints `schema.ts` and the `index.ts` export file for repairs-manage.

- [x] **Step 3: Run Phase4 forbidden-pattern baseline scan**

Run:

```powershell
rg -n "from ['\"]h3['\"]" apps/api/server apps/api/tests
rg -n "@neondatabase/auth|JWT|jwt|Neon Auth|Token 验证|token 验证|Bearer|Authorization" apps/api/server apps/api/tests
rg -n "pgTable|createInsertSchema|createSelectSchema" apps/api/server apps/api/tests
rg -n "chargeMachine|openDoor|machine/listMachineRecords|iot/listChargeMachine|parking|resourceStore|workorder|complaint" apps/api/server/shared/runtime/runtime-endpoints.ts apps/api/server/modules
```

Expected:

- The first three commands print no matches.
- The fourth command prints no matches before Phase4 code starts.
- If matches are found, classify them in the single report before editing code.

- [x] **Step 4: Create the single Phase4 report shell**

Create or update `docs/superpowers/reports/2026-04-25-phase4-consolidated-report.md` with this structure:

```markdown
# 2026-04-25 Phase4 App Legacy API 迁移汇总报告

## 1. Scope Lock

- Phase4 只处理 app legacy API 迁移波次规划和首批兼容迁移。
- 不删除、移动、归档、重命名、清空 apps/admin/server、apps/app/server、D:\code\ruan-cat\01s-11comm-app。
- 不新增 Nitro 鉴权、JWT、Token、Neon Auth。
- H3 helper 只从 nitro/h3 导入。
- Schema 事实来源只在 apps/type/src/business/\*\*/schema.ts。

## 2. Read-only Inventory

## 3. Migration Matrix

## 4. Wave 4A Implementation Notes

## 5. Verification Evidence

## 6. Phase4 Pass/Fail Gate
```

Expected:

- The report exists as the only Phase4 summary report.
- No per-subagent report files are created.

### Task 2: Read-only Inventory And Migration Matrix

**Files:**

- Read: `apps/app/server/modules/repair/endpoints.ts`
- Read: `apps/app/server/modules/complaint/endpoints.ts`
- Read: `apps/app/server/modules/work-order/endpoints.ts`
- Read: `apps/admin/src/router/rank/rank-route-keys.ts`
- Read: `apps/type/src/business/property-manage/repairs-manage/schema.ts`
- Create or Modify: `docs/superpowers/reports/2026-04-25-phase4-consolidated-report.md`

- [x] **Step 1: Extract legacy endpoint evidence without editing source modules**

Run:

```powershell
rg -n "url: '(/app|/callComponent)" apps/app/server/modules/repair/endpoints.ts
rg -n "url: '(/app|/callComponent)" apps/app/server/modules/complaint/endpoints.ts
rg -n "url: '(/app|/callComponent)" apps/app/server/modules/work-order/endpoints.ts
```

Expected:

- The repair command prints ownerRepair, repairSetting, dict, and repair appraise endpoints.
- The complaint command prints auditUser, complaint, complaintAppraise endpoints.
- The work-order command prints `/app/workorder/**` endpoints.
- No source file is modified.

- [x] **Step 2: Add the Phase4 migration matrix table to the single report**

Append this table to `docs/superpowers/reports/2026-04-25-phase4-consolidated-report.md` under `## 3. Migration Matrix`:

```markdown
| app legacy URL                            | Method   | Source module                                   | Canonical business path                      | Phase4 status  | Handling                                                                            |
| ----------------------------------------- | -------- | ----------------------------------------------- | -------------------------------------------- | -------------- | ----------------------------------------------------------------------------------- |
| /app/ownerRepair.listOwnerRepairs         | GET/POST | apps/app/server/modules/repair/endpoints.ts     | propertyManage.repairsManage.repairsTodo     | wave4a-runtime | Register in apps/api repair legacy endpoints.                                       |
| /app/ownerRepair.queryOwnerRepair         | GET/POST | apps/app/server/modules/repair/endpoints.ts     | propertyManage.repairsManage.repairsTodo     | wave4a-runtime | Register in apps/api repair legacy endpoints.                                       |
| /app/ownerRepair.saveOwnerRepair          | POST     | apps/app/server/modules/repair/endpoints.ts     | propertyManage.repairsManage.issues          | wave4a-runtime | Register in apps/api repair legacy endpoints.                                       |
| /app/repairSetting.listRepairSettings     | GET/POST | apps/app/server/modules/repair/endpoints.ts     | propertyManage.repairsManage.repairsSetting  | wave4a-runtime | Register in apps/api repair legacy endpoints.                                       |
| /app/dict.queryRepairStates               | GET/POST | apps/app/server/modules/repair/endpoints.ts     | propertyManage.repairsManage.repairsTodo     | wave4a-runtime | Register only as repair dictionary compatibility.                                   |
| /app/ownerRepair.listStaffRepairs         | GET/POST | apps/app/server/modules/repair/endpoints.ts     | propertyManage.repairsManage.repairsTodo     | wave4b-review  | Keep out of runtime until staff workflow ownership is reviewed.                     |
| /app/ownerRepair.repairDispatch           | POST     | apps/app/server/modules/repair/endpoints.ts     | propertyManage.repairsManage.repairsTodo     | wave4b-review  | Keep out of runtime until dispatch state transitions are reviewed.                  |
| /app/ownerRepair.repairStart              | POST     | apps/app/server/modules/repair/endpoints.ts     | propertyManage.repairsManage.repairsTodo     | wave4b-review  | Keep out of runtime until staff action permissions and status mapping are reviewed. |
| /app/ownerRepair.repairFinish             | POST     | apps/app/server/modules/repair/endpoints.ts     | propertyManage.repairsManage.repairsHaveDone | wave4b-review  | Keep out of runtime until finish/cost fields are reviewed.                          |
| /callComponent/ownerRepair.appraiseRepair | POST     | apps/app/server/modules/repair/endpoints.ts     | propertyManage.repairsManage.returnVisit     | wave4b-review  | Keep out of runtime until /callComponent compatibility policy is reviewed.          |
| /app/auditUser.listAuditComplaints        | GET/POST | apps/app/server/modules/complaint/endpoints.ts  | route-review-required                        | matrix-only    | Do not register in runtime during Wave 4A.                                          |
| /app/complaint                            | POST     | apps/app/server/modules/complaint/endpoints.ts  | route-review-required                        | matrix-only    | Do not register in runtime during Wave 4A.                                          |
| /app/workorder/todo/list                  | GET/POST | apps/app/server/modules/work-order/endpoints.ts | route-review-required                        | matrix-only    | Do not register in runtime during Wave 4A.                                          |
| /app/workorder/create                     | POST     | apps/app/server/modules/work-order/endpoints.ts | route-review-required                        | matrix-only    | Do not register in runtime during Wave 4A.                                          |
```

Expected:

- The matrix explicitly distinguishes runtime scope from review-only scope.
- `route-review-required` rows are not implemented in Wave 4A.

- [x] **Step 3: Record endpoint conflict exclusions**

Append this paragraph below the matrix:

```markdown
Wave 4A explicitly excludes `/app/resourceStore.*`, `/app/resourceStoreType.*`, `/callComponent/core/list`, parking, charge-machine, open-door, machine-record, complaint, and work-order runtime registration. These entries require separate business-path and schema review before they can become runtime endpoints.
```

Expected:

- The report states why resource-like endpoints found inside the repair legacy module are excluded from the first runtime slice.

### Task 3: Repair Wave 4A Red Tests

**Files:**

- Create: `apps/api/tests/legacy/repair-legacy-endpoints.test.ts`
- Create: `apps/api/tests/modules/repair-service.test.ts`
- Create: `apps/api/tests/admin/repair-admin-endpoints.test.ts`
- Modify: `apps/api/tests/runtime/endpoint-registry.test.ts`
- Modify: `apps/api/tests/infra/endpoint-manifest.test.ts`

- [x] **Step 1: Add repair legacy compatibility tests**

Create `apps/api/tests/legacy/repair-legacy-endpoints.test.ts`:

```ts
import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

describe("repair legacy endpoints wave4a", () => {
	test("registers only the Wave 4A repair compatibility slice", () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		expect(findEndpointDefinition(registry, "GET", "/app/ownerRepair.listOwnerRepairs")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/ownerRepair.queryOwnerRepair")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.saveOwnerRepair")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/repairSetting.listRepairSettings")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/dict.queryRepairStates")).toBeTruthy();

		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.repairDispatch")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/resourceStore.listResources")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/workorder/todo/list")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/auditUser.listAuditComplaints")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/owner.queryOwnerCars")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/machine/listMachineRecords")).toBeUndefined();
	});

	test("serves list, detail, create, settings and dictionary legacy shapes", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const list = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/ownerRepair.listOwnerRepairs",
			query: { page: 1, row: 5, communityId: "COMM_001" },
		});
		expect(list).toMatchObject({ code: 0, data: { ownerRepairs: expect.any(Array), total: expect.any(Number) } });
		expect(list.data.ownerRepairs[0]).toMatchObject({
			repairId: expect.any(String),
			repairName: expect.any(String),
			statusCd: expect.any(String),
			statusName: expect.any(String),
		});

		const firstRepairId = list.data.ownerRepairs[0].repairId;
		const detail = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/ownerRepair.queryOwnerRepair",
			query: { repairId: firstRepairId },
		});
		expect(detail.data.ownerRepair).toMatchObject({ repairId: firstRepairId });

		const created = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/ownerRepair.saveOwnerRepair",
			body: {
				title: "Water pipe repair",
				context: "Kitchen pipe leaking",
				repairName: "Alice",
				tel: "13800000000",
				address: "Building 1 Room 101",
				repairType: "1001",
				communityId: "COMM_001",
			},
		});
		expect(created.data.ownerRepair).toMatchObject({
			repairId: expect.any(String),
			statusCd: "10001",
			communityId: "COMM_001",
		});

		const settings = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/repairSetting.listRepairSettings",
			query: { page: 1, row: 10, publicArea: "T" },
		});
		expect(settings.data).toEqual(expect.any(Array));
		expect(settings.data[0]).toMatchObject({ repairType: expect.any(String), repairTypeName: expect.any(String) });

		const dict = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/dict.queryRepairStates",
		});
		expect(dict.data[0]).toMatchObject({ statusCd: expect.any(String), name: expect.any(String) });
	});
});
```

Run:

```powershell
pnpm -F @01s-11comm/api test -- tests/legacy/repair-legacy-endpoints.test.ts
```

Expected:

- Red: fails because the repair module and runtime registration do not exist yet.

- [x] **Step 2: Add repair service tests**

Create `apps/api/tests/modules/repair-service.test.ts`:

```ts
import { describe, expect, test } from "vitest";

import { createInMemoryRepairRepository } from "../../server/modules/repair/repository";
import { createRepairService } from "../../server/modules/repair/service";

describe("repair service wave4a", () => {
	test("lists, reads and creates owner repairs through one shared service", async () => {
		const service = createRepairService(createInMemoryRepairRepository());

		const list = await service.listOwnerRepairs({ page: 1, row: 5, communityId: "COMM_001" });
		expect(list).toMatchObject({ total: expect.any(Number), page: 1, row: 5 });
		expect(list.list[0]).toMatchObject({ repairId: expect.any(String), communityId: "COMM_001" });

		const detail = await service.getOwnerRepair({ repairId: list.list[0].repairId });
		expect(detail).toMatchObject({ repairId: list.list[0].repairId });

		const created = await service.createOwnerRepair({
			title: "Water pipe repair",
			context: "Kitchen pipe leaking",
			repairName: "Alice",
			tel: "13800000000",
			address: "Building 1 Room 101",
			repairType: "1001",
			communityId: "COMM_001",
		});
		expect(created).toMatchObject({ repairId: expect.any(String), statusCd: "10001" });
	});

	test("exposes repair settings and status dictionary", async () => {
		const service = createRepairService(createInMemoryRepairRepository());

		const settings = await service.listRepairSettings({ page: 1, row: 10, publicArea: "T" });
		expect(settings[0]).toMatchObject({ repairType: expect.any(String), repairTypeName: expect.any(String) });

		const states = await service.listRepairStates();
		expect(states.map((item) => item.statusCd)).toContain("10001");
	});
});
```

Run:

```powershell
pnpm -F @01s-11comm/api test -- tests/modules/repair-service.test.ts
```

Expected:

- Red: fails until the repair repository and service are implemented.

- [x] **Step 3: Add read-only admin route tests for the same service**

Create `apps/api/tests/admin/repair-admin-endpoints.test.ts`:

```ts
import { describe, expect, test } from "vitest";

import { getRepairRuntime } from "../../server/modules/repair/runtime";

describe("repair admin read-only adapters wave4a", () => {
	test("serves repairs todo list through the admin adapter", async () => {
		const response = await getRepairRuntime().adminAdapter.listRepairsTodo({ pageIndex: 1, pageSize: 10 });

		expect(response).toMatchObject({
			success: true,
			code: 200,
			data: { list: expect.any(Array), total: expect.any(Number), pageIndex: 1, pageSize: 10 },
		});
		expect(response.data.list[0]).toMatchObject({
			workOrderNumber: expect.any(String),
			repairType: expect.any(String),
			repairStatus: expect.any(String),
		});
	});

	test("serves repairs setting and issues read-only lists", async () => {
		const runtime = getRepairRuntime();
		const settings = await runtime.adminAdapter.listRepairsSettings({ pageIndex: 1, pageSize: 10 });
		const issues = await runtime.adminAdapter.listIssues({ pageIndex: 1, pageSize: 10 });

		expect(settings.data.list[0]).toMatchObject({ repairTypeName: expect.any(String) });
		expect(issues.data.list[0]).toMatchObject({ workOrderCode: expect.any(String) });
	});
});
```

Run:

```powershell
pnpm -F @01s-11comm/api test -- tests/admin/repair-admin-endpoints.test.ts
```

Expected:

- Red: fails until `admin-adapter.ts` and `runtime.ts` exist.

### Task 4: Repair Runtime Module

**Files:**

- Create: `apps/api/server/modules/repair/types.ts`
- Create: `apps/api/server/modules/repair/repository.ts`
- Create: `apps/api/server/modules/repair/service.ts`
- Create: `apps/api/server/modules/repair/legacy-adapter.ts`
- Create: `apps/api/server/modules/repair/admin-adapter.ts`
- Create: `apps/api/server/modules/repair/legacy-endpoints.ts`
- Create: `apps/api/server/modules/repair/runtime.ts`
- Create: `apps/api/server/modules/repair/index.ts`

- [x] **Step 1: Define the Wave 4A repair contract**

Create `apps/api/server/modules/repair/types.ts` with these exported names and fields:

```ts
export interface RepairItem {
	repairId: string;
	workOrderNumber: string;
	title: string;
	context: string;
	repairName: string;
	tel: string;
	address: string;
	repairType: string;
	repairTypeName: string;
	statusCd: string;
	statusName: string;
	communityId: string;
	createTime: string;
	updateTime: string;
}

export interface RepairListQuery {
	page: number;
	row: number;
	communityId?: string;
	keyword?: string;
	statusCd?: string;
	repairType?: string;
}

export interface RepairListResult {
	list: RepairItem[];
	total: number;
	page: number;
	row: number;
}

export interface CreateRepairInput {
	title?: string;
	context?: string;
	repairName?: string;
	tel?: string;
	address?: string;
	repairType?: string;
	communityId?: string;
}

export interface RepairSettingItem {
	repairType: string;
	repairTypeName: string;
	publicArea: "T" | "F";
	payFeeFlag: "T" | "F";
	priceScope?: string;
}

export interface RepairStateDictionaryItem {
	statusCd: string;
	name: string;
}
```

Expected:

- The file contains DTO contracts only.
- No `pgTable`, Zod schema construction, JWT, Token, or auth import appears in this file.

- [x] **Step 2: Implement repository with in-memory fallback only**

Create `apps/api/server/modules/repair/repository.ts` with the complete Wave 4A in-memory implementation below. Wave 4A deliberately does not create a DB adapter; DB-backed repair persistence must be split into a later independent task after schema and production data mapping review.

```ts
import type {
	CreateRepairInput,
	RepairItem,
	RepairListQuery,
	RepairListResult,
	RepairSettingItem,
	RepairStateDictionaryItem,
} from "./types";

export interface RepairRepository {
	listOwnerRepairs: (params: RepairListQuery) => Promise<RepairListResult>;
	getOwnerRepair: (params: { repairId: string }) => Promise<RepairItem | undefined>;
	createOwnerRepair: (input: CreateRepairInput) => Promise<RepairItem>;
	listRepairSettings: (params: { page: number; row: number; publicArea?: string }) => Promise<RepairSettingItem[]>;
	listRepairStates: () => Promise<RepairStateDictionaryItem[]>;
}

export function createRepairRepository(): RepairRepository {
	return createInMemoryRepairRepository();
}

export function createInMemoryRepairRepository(seed?: Partial<InMemoryRepairSeed>): RepairRepository {
	return new InMemoryRepairRepository(seed);
}

interface InMemoryRepairSeed {
	repairs: RepairItem[];
	settings: RepairSettingItem[];
	states: RepairStateDictionaryItem[];
}

class InMemoryRepairRepository implements RepairRepository {
	private readonly repairs: RepairItem[];
	private readonly settings: RepairSettingItem[];
	private readonly states: RepairStateDictionaryItem[];

	constructor(seed?: Partial<InMemoryRepairSeed>) {
		this.repairs = structuredClone(seed?.repairs ?? defaultRepairs);
		this.settings = structuredClone(seed?.settings ?? defaultRepairSettings);
		this.states = structuredClone(seed?.states ?? defaultRepairStates);
	}

	async listOwnerRepairs(params: RepairListQuery): Promise<RepairListResult> {
		let data = [...this.repairs];
		if (params.communityId) {
			data = data.filter((item) => item.communityId === params.communityId);
		}
		if (params.statusCd) {
			data = data.filter((item) => item.statusCd === params.statusCd);
		}
		if (params.repairType) {
			data = data.filter((item) => item.repairType === params.repairType);
		}
		if (params.keyword) {
			const keyword = params.keyword.toLowerCase();
			data = data.filter((item) =>
				[item.workOrderNumber, item.title, item.context, item.repairName, item.tel, item.address]
					.join(" ")
					.toLowerCase()
					.includes(keyword),
			);
		}
		return paginate(data, params.page, params.row);
	}

	async getOwnerRepair(params: { repairId: string }): Promise<RepairItem | undefined> {
		return this.repairs.find((item) => item.repairId === params.repairId);
	}

	async createOwnerRepair(input: CreateRepairInput): Promise<RepairItem> {
		const repairType = input.repairType || "1001";
		const item: RepairItem = {
			repairId: `REPAIR_${String(this.repairs.length + 1).padStart(3, "0")}`,
			workOrderNumber: `WO${Date.now()}`,
			title: input.title || "Owner repair",
			context: input.context || "",
			repairName: input.repairName || "Owner",
			tel: input.tel || "",
			address: input.address || "",
			repairType,
			repairTypeName: toRepairTypeName(repairType, this.settings),
			statusCd: "10001",
			statusName: toStatusName("10001", this.states),
			communityId: input.communityId || "COMM_001",
			createTime: "2026-04-25 09:00:00",
			updateTime: "2026-04-25 09:00:00",
		};
		this.repairs.unshift(item);
		return item;
	}

	async listRepairSettings(params: { page: number; row: number; publicArea?: string }): Promise<RepairSettingItem[]> {
		let data = [...this.settings];
		if (params.publicArea === "T" || params.publicArea === "F") {
			data = data.filter((item) => item.publicArea === params.publicArea);
		}
		return paginate(data, params.page, params.row).list;
	}

	async listRepairStates(): Promise<RepairStateDictionaryItem[]> {
		return [...this.states];
	}
}

function paginate<T>(data: T[], page: number, row: number) {
	const start = (page - 1) * row;
	const end = start + row;
	return {
		list: data.slice(start, end),
		total: data.length,
		page,
		row,
	};
}

function toRepairTypeName(repairType: string, settings: RepairSettingItem[]): string {
	return settings.find((item) => item.repairType === repairType)?.repairTypeName || "General repair";
}

function toStatusName(statusCd: string, states: RepairStateDictionaryItem[]): string {
	return states.find((item) => item.statusCd === statusCd)?.name || "Pending";
}

const defaultRepairStates: RepairStateDictionaryItem[] = [
	{ statusCd: "10001", name: "Pending" },
	{ statusCd: "10002", name: "Processing" },
	{ statusCd: "10003", name: "Finished" },
];

const defaultRepairSettings: RepairSettingItem[] = [
	{
		repairType: "1001",
		repairTypeName: "Water and electricity",
		publicArea: "F",
		payFeeFlag: "F",
		priceScope: "0",
	},
	{
		repairType: "1002",
		repairTypeName: "Public area",
		publicArea: "T",
		payFeeFlag: "T",
		priceScope: "50-200",
	},
];

const defaultRepairs: RepairItem[] = [
	{
		repairId: "REPAIR_001",
		workOrderNumber: "WO202604250001",
		title: "Kitchen pipe leaking",
		context: "Kitchen pipe is leaking under the sink",
		repairName: "Zhang San",
		tel: "13800138001",
		address: "Building 1 Room 101",
		repairType: "1001",
		repairTypeName: "Water and electricity",
		statusCd: "10001",
		statusName: "Pending",
		communityId: "COMM_001",
		createTime: "2026-04-24 09:00:00",
		updateTime: "2026-04-24 09:00:00",
	},
	{
		repairId: "REPAIR_002",
		workOrderNumber: "WO202604250002",
		title: "Corridor lamp broken",
		context: "Public corridor lamp does not work",
		repairName: "Li Si",
		tel: "13800138002",
		address: "Building 2 Corridor",
		repairType: "1002",
		repairTypeName: "Public area",
		statusCd: "10002",
		statusName: "Processing",
		communityId: "COMM_001",
		createTime: "2026-04-24 10:00:00",
		updateTime: "2026-04-24 10:30:00",
	},
];
```

Implementation requirements:

- `createInMemoryRepairRepository()` seeds at least two `RepairItem` rows with `communityId: "COMM_001"` and status codes `10001` and `10002`.
- `createRepairRepository()` always returns the in-memory repository in Wave 4A.
- Do not import `DbType`, `useDb`, Drizzle query helpers, or `@01s-11comm/type` schemas in this file during Wave 4A.
- No schema is added or modified in `apps/type` as part of this task.

Run:

```powershell
pnpm -F @01s-11comm/api test -- tests/modules/repair-service.test.ts
```

Expected:

- The test still fails until `service.ts` exists, but TypeScript import errors from `repository.ts` are resolved.

- [x] **Step 3: Implement repair service**

Create `apps/api/server/modules/repair/service.ts`:

```ts
import type { CreateRepairInput, RepairListQuery } from "./types";
import type { RepairRepository } from "./repository";

export interface RepairService {
	listOwnerRepairs: RepairRepository["listOwnerRepairs"];
	getOwnerRepair: RepairRepository["getOwnerRepair"];
	createOwnerRepair: (input: CreateRepairInput) => ReturnType<RepairRepository["createOwnerRepair"]>;
	listRepairSettings: RepairRepository["listRepairSettings"];
	listRepairStates: RepairRepository["listRepairStates"];
}

export function createRepairService(repository: RepairRepository): RepairService {
	return {
		listOwnerRepairs: (params: RepairListQuery) => repository.listOwnerRepairs(params),
		getOwnerRepair: (params) => repository.getOwnerRepair(params),
		createOwnerRepair: (input) => repository.createOwnerRepair(input),
		listRepairSettings: (params) => repository.listRepairSettings(params),
		listRepairStates: () => repository.listRepairStates(),
	};
}
```

Run:

```powershell
pnpm -F @01s-11comm/api test -- tests/modules/repair-service.test.ts
```

Expected:

- `tests/modules/repair-service.test.ts` passes.

- [x] **Step 4: Implement legacy adapter**

Create `apps/api/server/modules/repair/legacy-adapter.ts`:

```ts
import type { RepairService } from "./service";
import { legacyFailure, legacySuccess } from "../../shared/runtime/response-builder";

export function createLegacyRepairAdapter(service: RepairService) {
	return {
		async listOwnerRepairs(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);
			const result = await service.listOwnerRepairs({
				page,
				row,
				communityId: toString(input.communityId) || "COMM_001",
				keyword: toString(input.keyword),
				statusCd: toString(input.statusCd || input.status),
				repairType: toString(input.repairType),
			});
			return legacySuccess({ ownerRepairs: result.list, total: result.total, page, row }, "query success");
		},
		async queryOwnerRepair(input: Record<string, unknown>) {
			const repairId = toString(input.repairId);
			if (!repairId) return legacyFailure("repairId is required", 400);
			const repair = await service.getOwnerRepair({ repairId });
			return repair ? legacySuccess({ ownerRepair: repair }, "query success") : legacyFailure("repair not found", 404);
		},
		async saveOwnerRepair(input: Record<string, unknown>) {
			if (!toString(input.title)) return legacyFailure("title is required", 400);
			if (!toString(input.context)) return legacyFailure("context is required", 400);
			const created = await service.createOwnerRepair({
				title: toString(input.title),
				context: toString(input.context),
				repairName: toString(input.repairName),
				tel: toString(input.tel),
				address: toString(input.address),
				repairType: toString(input.repairType),
				communityId: toString(input.communityId) || "COMM_001",
			});
			return legacySuccess({ ownerRepair: created }, "create success");
		},
		async listRepairSettings(input: Record<string, unknown>) {
			return legacySuccess(
				await service.listRepairSettings({
					page: toNumber(input.page, 1),
					row: toNumber(input.row, 10),
					publicArea: toString(input.publicArea),
				}),
				"query success",
			);
		},
		async listRepairStates() {
			return legacySuccess(await service.listRepairStates(), "query success");
		},
	};
}

function toNumber(value: unknown, fallback: number): number {
	const result = Number(value);
	return Number.isFinite(result) && result > 0 ? result : fallback;
}

function toString(value: unknown): string | undefined {
	if (value === undefined || value === null || `${value}`.trim() === "") {
		return undefined;
	}
	return `${value}`.trim();
}
```

Run:

```powershell
pnpm -F @01s-11comm/api test -- tests/legacy/repair-legacy-endpoints.test.ts
```

Expected:

- The test still fails until endpoint registration exists.

- [x] **Step 5: Implement admin adapter and fallback-only runtime**

Create `apps/api/server/modules/repair/admin-adapter.ts`:

```ts
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { RepairItem, RepairSettingItem } from "./types";
import type { RepairService } from "./service";
import { adminSuccess } from "../../shared/runtime/response-builder";

export function createAdminRepairAdapter(service: RepairService) {
	return {
		async listRepairsTodo(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			status?: string;
			keyword?: string;
		}): Promise<JsonVO<PageDTO<RepairItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listOwnerRepairs({
				page: pageIndex,
				row: pageSize,
				communityId: "COMM_001",
				keyword: blankToUndefined(input.keyword),
				statusCd: blankToUndefined(input.status),
			});
			return adminSuccess(toPageResult(result.list, result.total, pageIndex, pageSize));
		},
		async listRepairsSettings(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			publicArea?: string;
		}): Promise<JsonVO<PageDTO<RepairSettingItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const list = await service.listRepairSettings({
				page: pageIndex,
				row: pageSize,
				publicArea: blankToUndefined(input.publicArea),
			});
			return adminSuccess(toPageResult(list, list.length, pageIndex, pageSize));
		},
		async listIssues(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			keyword?: string;
		}): Promise<JsonVO<PageDTO<RepairItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listOwnerRepairs({
				page: pageIndex,
				row: pageSize,
				communityId: "COMM_001",
				keyword: blankToUndefined(input.keyword),
			});
			return adminSuccess(toPageResult(result.list, result.total, pageIndex, pageSize));
		},
	};
}

function toPageResult<T>(list: T[], total: number, pageIndex: number, pageSize: number): PageDTO<T> {
	return {
		list,
		total,
		pageIndex,
		pageSize,
		totalPages: Math.ceil(total / pageSize),
	};
}

function toNumber(value: unknown, fallback: number): number {
	const result = Number(value);
	return Number.isFinite(result) && result > 0 ? result : fallback;
}

function blankToUndefined(value: unknown): string | undefined {
	if (value === undefined || value === null || `${value}`.trim() === "") {
		return undefined;
	}
	return `${value}`.trim();
}
```

Create `apps/api/server/modules/repair/runtime.ts`:

```ts
import type { H3Event } from "nitro/h3";
import { createAdminRepairAdapter } from "./admin-adapter";
import { createLegacyRepairAdapter } from "./legacy-adapter";
import { createRepairRepository, type RepairRepository } from "./repository";
import { createRepairService, type RepairService } from "./service";

export interface RepairRuntime {
	repository: RepairRepository;
	service: RepairService;
	adminAdapter: ReturnType<typeof createAdminRepairAdapter>;
	legacyAdapter: ReturnType<typeof createLegacyRepairAdapter>;
}

const fallbackRuntime = createRepairRuntime(createRepairRepository());

export function getRepairRuntime(event?: H3Event): RepairRuntime {
	void event;
	return fallbackRuntime;
}

export function createRepairRuntime(repository: RepairRepository): RepairRuntime {
	const service = createRepairService(repository);
	return {
		repository,
		service,
		adminAdapter: createAdminRepairAdapter(service),
		legacyAdapter: createLegacyRepairAdapter(service),
	};
}
```

Wave 4A runtime limitation:

- `getRepairRuntime(event)` intentionally returns the fallback runtime even when an H3 event is passed.
- Do not import `hasDatabaseUrl`, `useDb`, or `DbType` in `runtime.ts` during Wave 4A.
- DB-backed runtime selection must be added only by a later DB adapter task with complete repository code and tests.

Run:

```powershell
pnpm -F @01s-11comm/api test -- tests/admin/repair-admin-endpoints.test.ts
```

Expected:

- `tests/admin/repair-admin-endpoints.test.ts` passes after the adapter maps list fields to admin read-only DTO shape.

### Task 5: Endpoint Registration And Admin Read-only Routes

**Files:**

- Create: `apps/api/server/modules/repair/legacy-endpoints.ts`
- Create: `apps/api/server/modules/repair/index.ts`
- Modify: `apps/api/server/shared/runtime/runtime-endpoints.ts`
- Create: `apps/api/server/routes/api/property-manage/repairs-manage/repairs-setting/list.post.ts`
- Create: `apps/api/server/routes/api/property-manage/repairs-manage/repairs-todo/list.post.ts`
- Create: `apps/api/server/routes/api/property-manage/repairs-manage/issues/list.post.ts`
- Modify: `apps/api/package.json`

- [x] **Step 1: Register only Wave 4A repair legacy endpoints**

Create `apps/api/server/modules/repair/legacy-endpoints.ts`:

```ts
import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { getRepairRuntime } from "./runtime";

export const repairLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/ownerRepair.listOwnerRepairs",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getRepairRuntime(event).legacyAdapter.listOwnerRepairs(mergeInput(query, body)),
	},
	{
		url: "/app/ownerRepair.queryOwnerRepair",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getRepairRuntime(event).legacyAdapter.queryOwnerRepair(mergeInput(query, body)),
	},
	{
		url: "/app/ownerRepair.saveOwnerRepair",
		method: "POST",
		handler: ({ body, event }) => getRepairRuntime(event).legacyAdapter.saveOwnerRepair(asRecord(body)),
	},
	{
		url: "/app/repairSetting.listRepairSettings",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getRepairRuntime(event).legacyAdapter.listRepairSettings(mergeInput(query, body)),
	},
	{
		url: "/app/dict.queryRepairStates",
		method: ["GET", "POST"],
		handler: ({ event }) => getRepairRuntime(event).legacyAdapter.listRepairStates(),
	},
];

function mergeInput(query: unknown, body: unknown): Record<string, unknown> {
	return {
		...asRecord(query),
		...asRecord(body),
	};
}

function asRecord(value: unknown): Record<string, unknown> {
	if (!value || typeof value !== "object" || Array.isArray(value)) {
		return {};
	}
	return value as Record<string, unknown>;
}
```

Create `apps/api/server/modules/repair/index.ts`:

```ts
export * from "./admin-adapter";
export * from "./legacy-adapter";
export * from "./legacy-endpoints";
export * from "./repository";
export * from "./runtime";
export * from "./service";
export * from "./types";
```

Expected:

- No complaint, work-order, resourceStore, parking, charge-machine, open-door, or machine-record URL appears in this file.

- [x] **Step 2: Register repair entries in runtime manifest**

Modify `apps/api/server/shared/runtime/runtime-endpoints.ts` to use manifest entries:

```ts
import { feeLegacyEndpointDefinitions } from "../../modules/fee/legacy-endpoints";
import { repairLegacyEndpointDefinitions } from "../../modules/repair/legacy-endpoints";

const runtimeEndpointEntries = [
	...feeLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: "phase2-fee-payment-report",
		ownerModule: "fee",
	})),
	...repairLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: "phase4a-repair-minimal",
		ownerModule: "repair",
	})),
];

export const runtimeEndpointDefinitions = runtimeEndpointEntries.map((entry) => entry.definition);

export const runtimeEndpointManifest = runtimeEndpointEntries.map((entry) => ({
	url: entry.definition.url,
	method: entry.definition.method,
	phase: entry.phase,
	ownerModule: entry.ownerModule,
}));
```

Run:

```powershell
pnpm -F @01s-11comm/api test -- tests/legacy/repair-legacy-endpoints.test.ts
pnpm -F @01s-11comm/api test -- tests/infra/endpoint-manifest.test.ts
pnpm -F @01s-11comm/api test -- tests/runtime/endpoint-registry.test.ts
```

Expected:

- Repair legacy tests pass.
- Endpoint manifest includes `phase4a-repair-minimal`.
- Existing fee endpoint tests still pass.

- [x] **Step 3: Add three admin read-only route handlers**

Create `apps/api/server/routes/api/property-manage/repairs-manage/repairs-todo/list.post.ts`:

```ts
import { defineHandler, readBody } from "nitro/h3";
import { getRepairRuntime } from "../../../../../modules/repair/runtime";

export default defineHandler(async (event) => {
	return getRepairRuntime(event).adminAdapter.listRepairsTodo(await readBody(event));
});
```

Create `apps/api/server/routes/api/property-manage/repairs-manage/repairs-setting/list.post.ts`:

```ts
import { defineHandler, readBody } from "nitro/h3";
import { getRepairRuntime } from "../../../../../modules/repair/runtime";

export default defineHandler(async (event) => {
	return getRepairRuntime(event).adminAdapter.listRepairsSettings(await readBody(event));
});
```

Create `apps/api/server/routes/api/property-manage/repairs-manage/issues/list.post.ts`:

```ts
import { defineHandler, readBody } from "nitro/h3";
import { getRepairRuntime } from "../../../../../modules/repair/runtime";

export default defineHandler(async (event) => {
	return getRepairRuntime(event).adminAdapter.listIssues(await readBody(event));
});
```

Expected:

- All H3 helpers are imported from `nitro/h3`.
- No auth middleware or token check is added.
- `apps/admin/server/**` remains untouched.

- [x] **Step 4: Add Phase4 verification script**

Modify `apps/api/package.json` scripts:

```json
{
	"verify:phase4": "vitest run tests/legacy tests/admin tests/modules tests/runtime tests/infra && pnpm run typecheck && pnpm run build:node"
}
```

Expected:

- The script uses local package scripts and dependencies only.
- No global install, `run_install`, direct `turbo`, or shell rewrite script is introduced.

### Task 6: Keep Complaint, Work-order, Parking, Resource And Device Domains Out Of Runtime

**Files:**

- Verify: `apps/api/server/shared/runtime/runtime-endpoints.ts`
- Verify: `apps/api/server/modules/repair/**`
- Modify: `docs/superpowers/reports/2026-04-25-phase4-consolidated-report.md`

- [x] **Step 1: Scan runtime files for excluded domains**

Run:

```powershell
rg -n "resourceStore|resourceStoreType|parking|chargeMachine|openDoor|machine/listMachineRecords|workorder|complaint|auditUser" apps/api/server/shared/runtime/runtime-endpoints.ts apps/api/server/modules/repair
```

Expected:

- No output.
- If output appears, remove that runtime registration unless it is an import-free explanatory comment in a report file. Runtime code must not include excluded domains.

- [x] **Step 2: Record review queue in the single report**

Append this section to `docs/superpowers/reports/2026-04-25-phase4-consolidated-report.md`:

```markdown
## Wave 4B+ Review Queue

| Candidate domain                        | Required review before runtime registration                                                                                            |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| complaint                               | Confirm admin business path and schema ownership before registering `/app/auditUser.*`, `/app/complaint*`, `/app/complaintAppraise.*`. |
| work-order                              | Confirm whether new business paths are allowed in `rank-route-keys.ts` before registering `/app/workorder/**`.                         |
| resource                                | Confirm `propertyManage.resourceManage.*` business paths and schema plan before registering `resourceStore*` endpoints.                |
| parking                                 | Confirm parking device/open-door boundary before registering parking runtime endpoints.                                                |
| charge-machine/open-door/machine-record | Keep out of Phase4A; requires separate device integration and admin route review.                                                      |
```

Expected:

- The report keeps future work visible without implementing it in Wave 4A.

### Task 7: Verification And Phase4 Pass/Fail Gate

**Files:**

- Verify: `apps/api/tests/legacy/repair-legacy-endpoints.test.ts`
- Verify: `apps/api/tests/modules/repair-service.test.ts`
- Verify: `apps/api/tests/admin/repair-admin-endpoints.test.ts`
- Verify: `apps/api/tests/infra/**`
- Verify: `apps/api/tests/runtime/**`
- Verify: `apps/api/server/**`
- Verify: `apps/type/src/business/property-manage/repairs-manage/schema.ts`
- Verify: `docs/superpowers/reports/2026-04-25-phase4-consolidated-report.md`

- [x] **Step 1: Run targeted Wave 4A tests**（主代理最终验证通过：13 files / 43 tests passed。）

Run:

```powershell
pnpm -F @01s-11comm/api test -- tests/modules/repair-service.test.ts
pnpm -F @01s-11comm/api test -- tests/legacy/repair-legacy-endpoints.test.ts
pnpm -F @01s-11comm/api test -- tests/admin/repair-admin-endpoints.test.ts
pnpm -F @01s-11comm/api test -- tests/infra/endpoint-manifest.test.ts tests/runtime/endpoint-registry.test.ts
```

Expected:

- All commands pass.
- Existing fee tests continue to pass through the runtime registry.

- [x] **Step 2: Run package verification**（主代理最终验证通过：`verify:phase4`、API typecheck/build、type typecheck 均 exit 0。）

Run:

```powershell
pnpm -F @01s-11comm/api run verify:phase4
pnpm -F @01s-11comm/api typecheck
pnpm -F @01s-11comm/api build
pnpm -F @01s-11comm/type typecheck
```

Expected:

- API Phase4 verification passes.
- API typecheck and build pass.
- Type project typecheck passes without new schema changes.

- [x] **Step 3: Run forbidden-pattern scans**（收口复核：runtime exclusion、auth、schema 与 H3 直接导入扫描无匹配。）

Run:

```powershell
rg -n "from ['\"]h3['\"]" apps/api/server apps/api/tests
rg -n "@neondatabase/auth|JWT|jwt|Neon Auth|Token 验证|token 验证|Bearer|Authorization" apps/api/server apps/api/tests
rg -n "pgTable|createInsertSchema|createSelectSchema" apps/api/server apps/api/tests
rg -n "resourceStore|resourceStoreType|parking|chargeMachine|openDoor|machine/listMachineRecords|workorder|complaint|auditUser" apps/api/server/shared/runtime/runtime-endpoints.ts apps/api/server/modules/repair
```

Expected:

- All commands print no matches.
- If tests contain negative assertions for excluded URLs, those strings are allowed only in test files and must not appear in runtime files.

- [x] **Step 4: Verify protected directories remain preserved**（收口复核：三个 `Test-Path` 为 `True`，`apps/admin/server` 与 `apps/app/server` 无删除/移动状态输出。）

Run:

```powershell
Test-Path apps/admin/server
Test-Path apps/app/server
Test-Path "D:\code\ruan-cat\01s-11comm-app"
git status --short -- apps/admin/server apps/app/server
```

Expected:

- The three `Test-Path` commands print `True`.
- `git status --short -- apps/admin/server apps/app/server` shows no deletion, move, rename, or cleanup from Phase4 work.

- [x] **Step 5: Run final workspace checks**（主代理最终验证通过：`pnpm run ci` exit 0，`git diff --check` 作为最终 workspace 检查复跑。）

Run:

```powershell
pnpm -F @01s-11comm/api run verify:phase4
pnpm run ci
git diff --check
```

Expected:

- API Phase4 verification passes.
- Full CI passes.
- `git diff --check` prints no whitespace errors.

## Verification Command Summary

```powershell
Test-Path apps/api
Test-Path apps/admin/server
Test-Path apps/app/server
Test-Path "D:\code\ruan-cat\01s-11comm-app"
rg -n '"propertyManage\.repairsManage\.(issues|repairsSetting|repairsTodo)"' apps/admin/src/router/rank/rank-route-keys.ts
rg --files apps/app/server/modules | rg "repair|complaint|work-order"
rg --files apps/type/src/business/property-manage/repairs-manage
pnpm -F @01s-11comm/api test -- tests/modules/repair-service.test.ts
pnpm -F @01s-11comm/api test -- tests/legacy/repair-legacy-endpoints.test.ts
pnpm -F @01s-11comm/api test -- tests/admin/repair-admin-endpoints.test.ts
pnpm -F @01s-11comm/api test -- tests/infra/endpoint-manifest.test.ts tests/runtime/endpoint-registry.test.ts
pnpm -F @01s-11comm/api run verify:phase4
pnpm -F @01s-11comm/api typecheck
pnpm -F @01s-11comm/api build
pnpm -F @01s-11comm/type typecheck
pnpm run ci
rg -n "from ['\"]h3['\"]" apps/api/server apps/api/tests
rg -n "@neondatabase/auth|JWT|jwt|Neon Auth|Token 验证|token 验证|Bearer|Authorization" apps/api/server apps/api/tests
rg -n "pgTable|createInsertSchema|createSelectSchema" apps/api/server apps/api/tests
rg -n "resourceStore|resourceStoreType|parking|chargeMachine|openDoor|machine/listMachineRecords|workorder|complaint|auditUser" apps/api/server/shared/runtime/runtime-endpoints.ts apps/api/server/modules/repair
git diff --check
```

## Phase4 Pass/Fail Gate

Phase4 passes only if all conditions are true:

1. `docs/superpowers/reports/2026-04-25-phase4-consolidated-report.md` contains the read-only inventory, migration matrix, verification evidence, and final gate conclusion.
2. Runtime endpoint manifest contains Phase2 fee/payment/report entries plus Wave 4A repair entries only.
3. Wave 4A repair legacy endpoints pass list, detail, create, settings, and dictionary compatibility tests.
4. Admin read-only repair routes use the same repair service/repository as app legacy adapters.
5. No runtime code registers complaint, work-order, parking, resourceStore, charge-machine, open-door, or machine-record endpoints.
6. No H3 helper is imported from `"h3"`.
7. No Nitro auth, JWT, Token, Neon Auth, Bearer, or Authorization verification is added.
8. No schema is added or modified outside `apps/type/src/business/**/schema.ts`; Wave 4A should not require schema edits.
9. Repair runtime remains fallback-only in Wave 4A: no repair DB adapter, Drizzle query, `DbType`, `useDb(event)`, or `hasDatabaseUrl(event)` branch appears in `apps/api/server/modules/repair/**`.
10. `apps/admin/server`, `apps/app/server`, and `D:\code\ruan-cat\01s-11comm-app` still exist and are not deleted, moved, renamed, archived, emptied, or cleaned.
11. `pnpm -F @01s-11comm/api run verify:phase4`, `pnpm -F @01s-11comm/type typecheck`, `pnpm run ci`, and `git diff --check` pass.

Phase4 fails if any condition is false. On failure, the executor must stop expanding migration scope, record the failed command and exact file path in the single report, fix the failing layer, and rerun the matching verification command before continuing.

## Execution Notes

- Use one implementation subagent for Task 1-2 inventory/report work, one implementation subagent for Task 3-5 repair runtime work, and one verification subagent for Task 6-7. The repair implementation subagent owns only `propertyManage.repairsManage.repairsSetting`, `propertyManage.repairsManage.repairsTodo`, and `propertyManage.repairsManage.issues`.
- Do not let any subagent modify `apps/admin/server`, `apps/app/server`, or `D:\code\ruan-cat\01s-11comm-app`; those paths are read-only evidence and rollback references.
- Do not use generated scripts for large edits. Use `rg` to locate sources, then edit the few files listed in each task.
- If a schema gap is found, record it in the single report and split it into an independent schema review task. Do not batch-add repair, complaint, work-order, parking, or resource schemas inside this Phase4 plan.
