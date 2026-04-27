# 2026-04-27 11comm App Monorepo API 迁移 Phase6 实施计划

> **给智能体执行者的要求：** 执行本计划时必须使用 `superpowers:subagent-driven-development`（推荐）或 `superpowers:executing-plans`，逐项推进。所有步骤使用复选框 `- [ ]` 跟踪进度。

**目标：** 让 `apps/admin` 与 `apps/app` 以可配置、可验证、可回退的方式分批接入统一 `apps/api`，并保留 app legacy 路径契约。

**架构：** Phase6 继续采用影子迁移：先补齐统一 endpoint/env 规范和 compat/adapter 层，再通过 allowlist 分批切换已验收接口，最后用开关级与 endpoint 级回退证明旧路径仍可用。`apps/api` 继续承载 admin canonical route 与 app legacy route，两个消费端不直接共享页面实现，只共享统一 API 服务与领域层能力。

**技术栈：** pnpm workspace、Turbo、Nitro v3、`nitro/h3`、Vite env、Vite dev proxy、Axios、uni.request、Vitest、Neon serverless、`@01s-11comm/type`、pure-admin 业务路径坐标。

---

## 范围锁定

Phase6 只处理接入、切流、回退和验收证据，不退役旧服务。

允许修改的实现范围：

- `apps/admin/src/utils/http/api-base-url.ts`
- `apps/admin/src/utils/http/index.ts`
- `apps/admin/src/utils/http/tests/api-base-url.test.ts`
- `apps/admin/vite.config.ts`
- `apps/admin/types/env.shim.d.ts`
- 已通过 Phase5 联调的 admin hook：`apps/admin/src/api/property-manage/expense-manage/house-charge/index.ts`、`apps/admin/src/api/property-manage/expense-manage/expense-item-setting/index.ts`
- `apps/app/src/http/runtime-base.ts`
- `apps/app/src/http/interceptor.ts`
- `apps/app/src/tests/nitro-runtime/runtime-base-url.test.ts`
- 只有在确实需要 interceptor 专项覆盖时，才新建：`apps/app/src/http/tests/interceptor-base-url.test.ts`
- `apps/app/env/.env.development`
- `apps/app/env/.env.production`
- `apps/api/tests/**` 中用于接入验收的测试文件；若要切 `/callComponent/**`，必须先新增对应 compat handler 测试。
- 单一验收记录：`docs/superpowers/reports/2026-04-27-phase6-api-cutover-record.md`

禁止修改或删除：

- `apps/admin/server/**`
- `apps/app/server/**`
- `D:\code\ruan-cat\01s-11comm-app`
- `apps/type/src/business/**/schema.ts`
- `pnpm-lock.yaml`
- 根级 `package.json`、`pnpm-workspace.yaml`、`turbo.json`
- 任意鉴权中间件、鉴权插件、`@neondatabase/auth`、JWT/Token/Bearer/Authorization 服务端校验。
- 在未补齐 `apps/api` compat handler 与测试前，把 `/callComponent/**` 写入首批已切流清单。

执行原则：

- 每个批次先新增配置或 compat 路径，再验证，再切流，再记录回退证据。
- 每个 endpoint 必须能从 allowlist 移除并回到旧 runtime。
- 未验收 endpoint 不进入切流批次。
- 不自动提交 git commit；提交需要用户单独授权。

## 任务 1：现状盘点与保护门禁

**文件：**

- 只读：`docs/superpowers/specs/2026-04-25-11comm-app-monorepo-api-migration-design.md`
- 只读：`docs/superpowers/plans/2026-04-26-11comm-app-monorepo-api-migration-phase5.md`
- 只读：`apps/admin/src/utils/http/api-base-url.ts`
- 只读：`apps/admin/vite.config.ts`
- 只读：`apps/app/src/http/runtime-base.ts`
- 只读：`apps/app/src/http/interceptor.ts`
- 只读：`apps/api/package.json`
- 新建：`docs/superpowers/reports/2026-04-27-phase6-api-cutover-record.md`

- [x] **步骤 1：确认受保护路径存在**

运行：

```powershell
Test-Path apps/admin/server
Test-Path apps/app/server
Test-Path "D:\code\ruan-cat\01s-11comm-app"
```

预期：

- 三条命令都输出 `True`。
- 任意一条不是 `True` 时停止 Phase6，并在验收记录中写明阻塞原因。

- [x] **步骤 2：盘点当前统一 API 配置入口**

运行：

```powershell
rg -n "VITE_11COMM_API_BASE_URL|VITE_11COMM_API_PROXY_PREFIX|VITE_11COMM_API_USE_PROXY|VITE_11COMM_API_SHADOW_ENABLE|resolveAdminApiBaseUrl|resolveAdminShadowApiBaseUrl" apps/admin/src apps/admin/vite.config.ts apps/admin/types/env.shim.d.ts
rg -n "VITE_API_RUNTIME|VITE_SERVER_BASEURL|VITE_APP_PROXY_ENABLE|VITE_APP_PROXY_PREFIX|VITE_11COMM_API_BASE_URL|VITE_11COMM_API_SHADOW_ENABLE|PHASE2_API_SHADOW_ENDPOINTS|resolveHttpBaseUrlForPath" apps/app/src apps/app/env
rg -n "'/app/|\"/app/|/callComponent|routeRules|handler" apps/api/nitro.config.ts apps/app/nitro.config.ts
```

预期：

- admin 输出包含 `api-base-url.ts`、`vite.config.ts`、`env.shim.d.ts`。
- app 输出包含 `runtime-base.ts` 和 env 文件。
- nitro config 输出证明当前 `apps/api` 只承接 `/app/**` handler，`apps/app` legacy runtime 才同时包含 `/app/**` 与 `/callComponent/**`。
- 记录当前变量名，不新增与现有命名冲突的变量。

- [x] **步骤 3：盘点可进入首批切流的 endpoint**

运行：

```powershell
rg -n "house-charge/(list|detail)|expense-item-setting/(list|detail|create|update|delete)|payment-details-form/list|reportFeeMonthStatistics|fee\\.listFee|feeApi/listOweFees|repairSetting|ownerRepair|repairs-todo|repairs-setting|issues|callComponent/core/list|/callComponent" apps/api/server apps/api/tests apps/admin/src/api apps/app/src/http apps/app/server apps/api/nitro.config.ts apps/app/nitro.config.ts
```

预期：

- 输出能区分 admin canonical route、app legacy route、admin hook、app allowlist。
- 没有测试覆盖的 endpoint 不进入任务 5 的切流矩阵。
- `/callComponent/core/list` 或 `/callComponent/**` 必须记录为 `not-cut / compat-handler-required`，不能写入首批已切流。

- [x] **步骤 4：创建单一验收记录初稿**

新建 `docs/superpowers/reports/2026-04-27-phase6-api-cutover-record.md`，内容如下：

```markdown
# 2026-04-27 Phase6 API 切流验收记录

## 1. 范围与保护路径

本记录只覆盖 Phase6 接入、切流、验证和回退。`apps/admin/server`、`apps/app/server`、`D:\code\ruan-cat\01s-11comm-app` 均为受保护路径。

## 2. 配置矩阵

记录 admin/app 的开启变量、关闭变量、proxy 前缀、direct base URL 和回退目标。

## 3. 切流批次

按配置空跑、admin 只读、admin 配置型写入、app legacy 费用、repair 只读兼容记录。

## 4. 测试证据

每个批次记录实际运行命令、结果、缺失前置条件和补跑要求。

## 5. 回退证据

记录关闭开关或移出 allowlist 后，同一 endpoint 回到旧路径的证据。

## 6. 未切流清单

记录未切流 endpoint、原因、阻塞项和下一批进入条件。
```

预期：

- 文件只记录 Phase6 接入、切流、验证、回退，不记录旧服务删除计划。

## 任务 2：统一 endpoint/env 规范

**文件：**

- 修改：`apps/admin/src/utils/http/api-base-url.ts`
- 修改：`apps/admin/src/utils/http/tests/api-base-url.test.ts`
- 修改：`apps/admin/types/env.shim.d.ts`
- 修改：`apps/app/src/http/runtime-base.ts`
- 修改：`apps/app/src/tests/nitro-runtime/runtime-base-url.test.ts`
- 修改：`docs/superpowers/reports/2026-04-27-phase6-api-cutover-record.md`

- [x] **步骤 1：固化 admin base URL 解析矩阵测试**

新增或更新测试，覆盖以下行为：

```text
VITE_11COMM_API_USE_PROXY=true + VITE_11COMM_API_PROXY_PREFIX=/api-shadow -> /api-shadow
VITE_11COMM_API_USE_PROXY=false + VITE_11COMM_API_BASE_URL=http://127.0.0.1:3102 -> http://127.0.0.1:3102
VITE_11COMM_API_SHADOW_ENABLE=false -> module hook keeps legacy relative /api path
VITE_IS_REVERSE_PROXY=true -> resolveAdminApiBaseUrl returns VITE_PROXY_PREFIX
default -> resolveAdminApiBaseUrl returns VITE_BASE_URL or empty string
```

运行：

```powershell
pnpm -F @01s-11comm/admin exec vitest run src/utils/http/tests/api-base-url.test.ts
```

预期：

- 测试通过，并证明 direct base URL、proxy base URL 和 legacy fallback 三种行为。

- [x] **步骤 2：收敛 admin helper 命名**

只有当当前命名无法表达 Phase6 语义时，才修改 `apps/admin/src/utils/http/api-base-url.ts`。必须保留以下导出行为：

```text
resolveAdminApiBaseUrl(env)
resolveAdminShadowApiBaseUrl(env)
isAdminApiShadowEnabled(env)
```

预期：

- 现有 Phase5 hooks 继续通过编译。
- 页面组件不直接导入或拼接 env 变量。

- [x] **步骤 3：固化 app compat allowlist 解析测试**

新增或更新测试，覆盖以下行为：

```text
VITE_11COMM_API_SHADOW_ENABLE=true + allowlisted /app/fee.listFee -> VITE_11COMM_API_BASE_URL + /app/fee.listFee
VITE_11COMM_API_SHADOW_ENABLE=true + non-allowlisted /app/unknown.endpoint -> existing resolveHttpBaseUrl result
VITE_11COMM_API_SHADOW_ENABLE=false -> existing runtime behavior
VITE_API_RUNTIME=nitro-vite -> relative URL unchanged
VITE_API_RUNTIME=nitro-standalone -> VITE_SERVER_BASEURL or project domain alias
```

运行：

```powershell
pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/runtime-base-url.test.ts
```

预期：

- 测试通过，并证明 allowlist 不会变成 app 全量切流。
- 同一测试记录 `/callComponent/core/list` 为 `not-cut / compat-handler-required`，除非后续任务已创建 `apps/api` compat handler 和配套测试。

- [x] **步骤 4：更新 env 类型声明和验收记录**

只为运行时代码真实消费的变量更新 `apps/admin/types/env.shim.d.ts` 和 app env typings。随后把配置矩阵写入验收记录：

```markdown
| 端    | 变量                          | 开启值           | 关闭/回退值       | 命中目标                     |
| ----- | ----------------------------- | ---------------- | ----------------- | ---------------------------- |
| admin | VITE_11COMM_API_SHADOW_ENABLE | true             | false             | 模块级 apps/api shadow       |
| admin | VITE_11COMM_API_USE_PROXY     | true             | false             | dev proxy 或 direct base URL |
| app   | VITE_11COMM_API_SHADOW_ENABLE | true             | false             | allowlist legacy endpoint    |
| app   | VITE_API_RUNTIME              | nitro-standalone | mock 或原 runtime | app 运行时基址               |
```

预期：

- 验收记录能直接指导开启和关闭每个接入路径。

## 任务 3：admin http client/proxy 接入

**文件：**

- 修改：`apps/admin/vite.config.ts`
- 修改：`apps/admin/src/utils/http/api-base-url.ts`
- 修改：`apps/admin/src/api/property-manage/expense-manage/house-charge/index.ts`
- 修改：`apps/admin/src/api/property-manage/expense-manage/expense-item-setting/index.ts`
- 测试：`apps/admin/src/utils/http/tests/api-base-url.test.ts`
- 测试：`apps/admin/src/api/property-manage/expense-manage/house-charge/tests/index.test.ts`
- 测试：`apps/admin/src/api/property-manage/expense-manage/expense-item-setting/tests/index.test.ts`
- 修改：`docs/superpowers/reports/2026-04-27-phase6-api-cutover-record.md`

- [x] **步骤 1：验证 dev proxy 到 `apps/api`**

在一个终端启动 `apps/api`：

```powershell
pnpm -F @01s-11comm/api dev
```

在另一个终端用 proxy env 启动 admin：

```powershell
$env:VITE_11COMM_API_USE_PROXY="true"
$env:VITE_11COMM_API_BASE_URL="http://127.0.0.1:3102"
$env:VITE_11COMM_API_PROXY_PREFIX="/api-shadow"
$env:VITE_11COMM_API_SHADOW_ENABLE="true"
pnpm -F @01s-11comm/admin dev
```

预期：

- 从 admin dev server 请求 `/api-shadow/__nitro/health`、`/api-shadow/__nitro/ready`、`/api-shadow/__nitro/endpoints` 时，返回当前 `apps/api` 的 health、readiness 和 endpoint manifest 响应。
- 将 `VITE_11COMM_API_USE_PROXY` 改为 `false` 后，不再依赖 proxy 路径。

- [x] **步骤 2：有测试后再替换模块私有 URL helper**

如果 `house-charge` 与 `expense-item-setting` 仍使用重复的 `resolvePhase5ApiUrl`，在测试存在后再替换为 `api-base-url.ts` 的共享 helper。必须保持以下行为：

```text
shadow disabled -> /api/property-manage/...
shadow enabled + proxy -> /api-shadow/api/property-manage/...
shadow enabled + direct base -> http://127.0.0.1:3102/api/property-manage/...
```

运行：

```powershell
pnpm -F @01s-11comm/admin exec vitest run src/utils/http/tests/api-base-url.test.ts src/api/property-manage/expense-manage/house-charge/tests/index.test.ts src/api/property-manage/expense-manage/expense-item-setting/tests/index.test.ts
```

预期：

- 测试证明 hook URL 解析正确。
- 不需要编辑页面组件。

- [x] **步骤 3：记录 admin 回退证据**

开启 shadow 时，通过 `/api-shadow` 调用一个已迁移只读 endpoint。随后关闭 shadow，用相对 `/api` 调用同一个 hook URL。

预期：

- 验收记录包含两种请求 URL，并说明每种模式命中的服务。
- `apps/admin/server/**` 下没有任何文件被修改。

## 任务 4：app legacy route adapter 接入

**文件：**

- 修改：`apps/app/src/http/runtime-base.ts`
- 修改：`apps/app/src/http/interceptor.ts`
- 修改：`apps/app/src/tests/nitro-runtime/runtime-base-url.test.ts`
- 只有在确实需要 interceptor 专项覆盖时，才新建：`apps/app/src/http/tests/interceptor-base-url.test.ts`
- 验证：`apps/api/tests/legacy/**`
- 修改：`apps/app/env/.env.development`
- 修改：`apps/app/env/.env.production`
- 修改：`docs/superpowers/reports/2026-04-27-phase6-api-cutover-record.md`

- [x] **步骤 1：只把已测试 endpoint 扩入 app compat allowlist**

以现有 `PHASE2_API_SHADOW_ENDPOINTS` 为起点。只加入已经具备 `apps/api/tests/legacy/**` 覆盖的 endpoint。矩阵中必须把 `/callComponent/**` 与 `/app/**` 分开记录；在 `apps/api` 具备 compat handler 和测试前，`/callComponent/**` 只能标记为 `not-cut / compat-handler-required`。

运行：

```powershell
pnpm -F @01s-11comm/api exec vitest run tests/legacy
pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/runtime-base-url.test.ts
```

预期：

- legacy 测试先通过，再允许 app 路由指向 `apps/api`。
- 未进入 allowlist 的 legacy path 继续使用现有 runtime base。
- `/callComponent/core/list` 和 `/callComponent/**` 不进入 allowlist，除非本任务先补齐缺失的 `apps/api` compat handler 和配套测试。

- [x] **步骤 2：验证 request interceptor 保留旧路径契约**

运行单元测试或 H5 请求检查，证明以下行为：

```text
input url: /app/fee.listFee
output url with shadow enabled: <VITE_11COMM_API_BASE_URL>/app/fee.listFee
input url: /app/not-migrated
output url with shadow enabled: original runtime base + /app/not-migrated
input url: /callComponent/core/list
output url without apps/api compat handler: original runtime base + /callComponent/core/list
```

预期：

- 不需要批量改写 `apps/app/src/api/**` 文件。
- 客户端现有 `Authorization` header 行为可以保持，但 `apps/api` 不做服务端校验。

- [x] **步骤 3：记录 app 回退证据**

同一个 allowlisted endpoint 分别在开启和关闭 shadow 时运行：

```powershell
$env:VITE_11COMM_API_SHADOW_ENABLE="true"
pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/runtime-base-url.test.ts
$env:VITE_11COMM_API_SHADOW_ENABLE="false"
pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/runtime-base-url.test.ts
```

预期：

- 验收记录写明开启和关闭时的 URL 解析结果。
- `/app/**` 与 `/callComponent/**` 仍作为旧契约可见；`/callComponent/**` 记录为未切到 `apps/api`。

## 任务 5：首批模块切流

**文件：**

- 修改：`docs/superpowers/reports/2026-04-27-phase6-api-cutover-record.md`
- 验证：`apps/api/tests/admin/**`
- 验证：`apps/api/tests/legacy/**`
- 验证：`apps/admin/src/api/property-manage/expense-manage/house-charge/index.ts`
- 验证：`apps/admin/src/api/property-manage/expense-manage/expense-item-setting/index.ts`
- 验证：`apps/app/src/http/runtime-base.ts`
- 验证：`apps/app/src/tests/nitro-runtime/runtime-base-url.test.ts`

- [x] **步骤 1：切流批次 A - 配置空跑**

运行：

```powershell
pnpm -F @01s-11comm/api exec vitest run tests/infra tests/runtime
pnpm -F @01s-11comm/api run typecheck
```

预期：

- `__nitro` health、ready、runtime endpoint manifest 和 typecheck 通过。
- 还不声明任何消费端 endpoint 已切流。

- [x] **步骤 2：切流批次 B - admin 只读接口**

运行：

```powershell
pnpm -F @01s-11comm/api exec vitest run tests/admin tests/modules
pnpm -F @01s-11comm/admin exec vitest run src/api/property-manage/expense-manage/house-charge/tests/index.test.ts
```

预期：

- `houseCharge list/detail` 和 payment/report 只读接口通过 `apps/api`。
- 验收记录明确 `houseCharge create/update/delete` 不属于 Phase6 切流范围。

- [x] **步骤 3：切流批次 C - admin 配置型写接口**

运行：

```powershell
pnpm -F @01s-11comm/api exec vitest run tests/admin/expense-manage-phase5a.test.ts
pnpm -F @01s-11comm/admin exec vitest run src/api/property-manage/expense-manage/expense-item-setting/tests/index.test.ts
```

预期：

- `expenseItemSetting list/detail/create/update/delete-policy` 通过。
- 写入验证记录测试数据身份、查询结果、清理结果或 delete-policy 结果。

- [x] **步骤 4：切流批次 D - app legacy fee/payment/report**

运行：

```powershell
pnpm -F @01s-11comm/api exec vitest run tests/legacy
pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/runtime-base-url.test.ts
```

预期：

- `/app/fee.listFee` 与 Phase2 fee/payment/report allowlist 保持 legacy response format。
- app 页面不做批量编辑。
- `/callComponent/core/list` 和 `/callComponent/**` 记录为 `not-cut / compat-handler-required`，继续使用 app legacy runtime。

- [x] **步骤 5：切流批次 E - repair 只读兼容**

只有在 Phase4 repair 测试仍通过时才运行：

```powershell
pnpm -F @01s-11comm/api exec vitest run tests/legacy tests/admin tests/modules
```

预期：

- 只纳入 Phase4 已声明的 repair settings、owner repair 和 issues 只读兼容 endpoint。
- parking/resource/charge-machine/open-door 不进入本批次。

## 任务 6：回退与观测

**文件：**

- 修改：`docs/superpowers/reports/2026-04-27-phase6-api-cutover-record.md`
- 验证：`apps/admin/src/utils/http/api-base-url.ts`
- 验证：`apps/app/src/http/runtime-base.ts`
- 验证：`apps/api/server/**`

- [x] **步骤 1：admin 全局回退**

运行：

```powershell
$env:VITE_11COMM_API_SHADOW_ENABLE="false"
$env:VITE_11COMM_API_USE_PROXY="false"
pnpm -F @01s-11comm/admin exec vitest run src/utils/http/tests/api-base-url.test.ts
```

预期：

- 已迁移 hook 解析回相对 `/api/...` 或既有 admin base 行为。
- 验收记录写明精确的关闭变量值。

- [x] **步骤 2：app endpoint 回退**

在工作区变更中临时从 app compat allowlist 移除一个 endpoint，运行 URL 解析测试，然后恢复目标 allowlist 后再继续。

运行：

```powershell
pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/runtime-base-url.test.ts
```

预期：

- 被移除的 endpoint 解析回旧 runtime base。
- 最终文件状态只包含获准的 allowlist。

- [x] **步骤 3：禁用模式扫描**

运行：

```powershell
rg -n "from ['\"]h3['\"]" apps/api/server apps/api/tests
rg -n "@neondatabase/auth|JWT|jwt|Neon Auth|Token 验证|token 验证|Bearer|Authorization" apps/api/server apps/api/tests
rg -n "pgTable|createInsertSchema|createSelectSchema" apps/api/server apps/api/tests
Test-Path apps/admin/server
Test-Path apps/app/server
Test-Path "D:\code\ruan-cat\01s-11comm-app"
```

预期：

- 三条 `rg` 命令没有服务端禁用模式命中。
- 三条 `Test-Path` 命令都输出 `True`。

## 任务 7：测试证据归档与完成判定

**文件：**

- 修改：`docs/superpowers/reports/2026-04-27-phase6-api-cutover-record.md`
- 只读：`docs/superpowers/specs/2026-04-25-11comm-app-monorepo-api-migration-design.md`
- 验证：`git status --short`

- [x] **步骤 1：运行最终验证组合**

运行：

```powershell
pnpm -F @01s-11comm/api run verify:phase5
pnpm -F @01s-11comm/admin exec vitest run src/utils/http/tests/api-base-url.test.ts src/api/property-manage/expense-manage/house-charge/tests/index.test.ts src/api/property-manage/expense-manage/expense-item-setting/tests/index.test.ts
pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/runtime-base-url.test.ts
```

预期：

- 所有命令通过。
- 如果某条命令因为本地服务或 DB URL 缺失而无法运行，验收记录必须写明缺失前置条件，并记录实际已运行的更窄命令。

- [x] **步骤 2：补全切流矩阵**

更新验收记录：

```markdown
| 批次      | Endpoint                                              | 端        | 开启变量       | 回退变量       | 测试命令                                                          | 结果    |
| --------- | ----------------------------------------------------- | --------- | -------------- | -------------- | ----------------------------------------------------------------- | ------- |
| A         | /**nitro/health, /**nitro/ready, /\_\_nitro/endpoints | admin/app | proxy/base URL | disable shadow | pnpm -F @01s-11comm/api exec vitest run tests/infra tests/runtime | pass    |
| D-blocked | /callComponent/core/list, /callComponent/\*\*         | app       | none           | legacy runtime | not-cut / compat-handler-required                                 | not-cut |
```

预期：

- 每个已切 endpoint 都有一行记录。
- 每个未切 endpoint 都有原因和下一批进入条件。

- [x] **步骤 3：验证只修改预期文件**

运行：

```powershell
git status --short
git diff -- docs/superpowers/specs/2026-04-25-11comm-app-monorepo-api-migration-design.md docs/superpowers/plans/2026-04-27-11comm-app-monorepo-api-migration-phase6.md
```

预期：

- 本次计划文档编写任务中，只修改设计文档和本计划文件。
- 后续执行 Phase6 时，除非验收记录写明已批准原因，否则只修改每个任务列出的文件。

## 完成标准

- `apps/admin` 已记录 direct base URL、proxy base URL 和 legacy fallback 行为。
- `apps/app` 保留 `/app/**` 与 `/callComponent/**` 契约；allowlisted `/app/**` endpoint 可以命中 `apps/api`；`/callComponent/**` 在 `apps/api` compat handler 与测试存在前保持 `not-cut / compat-handler-required`。
- 每个切流批次都有测试证据、必要时的数据证据、回退开关和验收记录。
- `apps/admin/server` 与 `apps/app/server` 仍然存在，且不进入 Phase6 清理范围。
- 未新增 Nitro 鉴权、`@neondatabase/auth`、服务端 JWT/Token/Bearer/Authorization 校验、私有 schema 来源或页面批量改写。
