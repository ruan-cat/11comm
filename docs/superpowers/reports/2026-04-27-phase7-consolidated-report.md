# 2026-04-27 Phase7 综合收口报告

## 合并来源

本报告合并自此前误生成在 `apps/admin/src/docs/reports` 下的 Phase7 报告：

- `2026-04-27-phase7-editor-api-tests.md`
- `2026-04-27-phase7-editor-h5-client-tests.md`
- `2026-04-27-phase7-explorer-business-routes.md`
- `2026-04-27-phase7-explorer-test-topology.md`
- `2026-04-27-phase7-review.md`

## 结论

> 2026-05-04 最新复判：Phase7 的 `no-go / no-go-for-execution` 不再是单一状态。本地只读执行门已经解除，可进入“保留旧服务的 apps/api 只读候选切流验证”；旧服务退役/删除门仍为 `no-go-for-retirement`。也就是说，允许继续推进 admin/app 读链路切到 `apps/api` 并补页面证据，但仍禁止删除、移动、归档、重命名或清空 `apps/admin/server`、`apps/app/server` 和 `D:\code\ruan-cat\01s-11comm-app`。

Phase7 当前对“旧服务退役/删除执行态”仍为 `no-go-for-retirement`，不能据此删除、移动、归档、重命名或清空 `apps/admin/server`、`apps/app/server` 或受保护旧源目录 `D:\code\ruan-cat\01s-11comm-app`。

本轮已经补齐了部分有价值的自动化测试和 `apps/api` manifest 元数据：`apps/api` 的 admin/app 双客户端契约、`apps/admin` 的首批 shadow URL 解析与 hook 测试、`apps/app` 的 allowlist/fallback runtime base 测试均有覆盖。复核也记录了 `apps/api` 可作为独立 Nitro dev 服务响应 health、manifest、admin canonical 与 app legacy smoke 请求。

2026-05-04 追加补强：`payment-details-form`、`repairs-todo`、`repairs-setting`、`issues` 四个 admin 调用端已经从裸 `/api/**` 改为 `resolveAdminApiRequestUrl()`，并补充 shadow disabled、shadow proxy、direct apps/api base 三类 Vitest 用例；`apps/app` runtime base 测试已扩展为 table-driven 覆盖全部 12 条 fee/payment/report shadow allowlist，并显式证明 `/callComponent/core/list`、`ownerRepair`、`floor` 等非 allowlist 路径继续回退旧 runtime；`apps/api` 新增 gated HTTP 测试文件，只有显式设置 `RUN_PHASE7_HTTP_TESTS=1` 与 `PHASE7_API_BASE_URL` 时才请求运行中的 `apps/api`。

2026-05-04 继续补证：真实 Chrome DevTools MCP 已在四端本地拓扑中补齐首批页面级证据。Admin `expense-item-setting`、`payment-details-form`、`repairs-todo`、`repairs-setting`、`issues` 均命中 `http://127.0.0.1:8080/api-shadow/api/**` 并返回 200，响应带 `x-api-phase: phase3-infra`；App H5 `fee/detail`、`pay-qrcode`、`write-owe-callable`、`fee/create`、`report/fee-summary` 均完成页面打开或页面上下文请求取证，其中 allowlist endpoint 命中 `http://127.0.0.1:3102/app/**`，`/callComponent/core/list` 与 `floor.queryFloors` 保持 `3101` legacy fallback，三条高风险 mutation 默认返回 `409 PHASE7_MUTATION_GUARDED`。

2026-05-04 DB readiness 补强：当前会话未暴露 Neon MCP 工具，因此不能直接调用 `mcp__Neon__list_projects` 或 `describe_table_schema`；本轮改用项目内 Neon/Drizzle 配置、`apps/type` schema、Drizzle migration 产物、Neon Serverless 只读查询和 gated `/__nitro/ready` 完成补证。目标 Neon 库已确认可连接，`public` 下 111 张表与 `0000_fearless_shinko_yamashiro.sql` 的建表集合一致，`ct_upload_sessions.r2_upload_id` 已是 `text`，符合 `0001_bright_thaddeus_ross.sql` 结果；因该库此前已有表但 `drizzle.__drizzle_migrations` 记录数为 0，本轮在完整表集合匹配前置校验通过后补齐 2 条 Drizzle migration baseline。随后以 `RUN_PHASE7_DB_READINESS_CHECK=1` 启动 `apps/api`，`GET /__nitro/ready` 返回 `200 DB_READY`，验证连接、Phase7 必需表和 migration count 均通过。
2026-05-04 执行门补强：`payment-details-form` 页面已从本地 mock 表格改为调用 `usePaymentDetailsFormListQuery()`，页面刷新/搜索会进入具备 shadow resolver 的 API hook；三类高风险 app legacy mutation（`/app/payment.nativeQrcodePayment`、`/app/oweFeeCallable.writeOweFeeCallable`、`/app/fee.saveRoomCreateFee`）默认返回 legacy envelope 内的 `409 PHASE7_MUTATION_GUARDED`，只有显式设置 `PHASE7_ALLOW_LEGACY_MUTATIONS=1` 才允许进入兼容写逻辑；`runtimeEndpointManifest` 已将这三条标记为 `blocked-for-execution`，不再和只读 allowlist 混用。真实 HTTP gate 已在 `RUN_PHASE7_HTTP_TESTS=1`、`PHASE7_API_BASE_URL=http://127.0.0.1:3116` 下通过，覆盖 health、ready、endpoint manifest、admin canonical read、app legacy read 和三类 mutation 默认阻断。

2026-05-05 本地收口补证：已将全量 endpoint 对照、shadow-off 回退、受控写入/读回/回滚三项写入设计文档并完成本地验证。全量 endpoint 扫描确认 `apps/admin/server/api` 仍有 155 个旧 API 文件、`apps/api` 仅 exact covered 6 个 admin 旧路径；`apps/app/server` 仍有 212 个业务 legacy unique endpoint，`apps/api` 当前只承载 17 个 app legacy target，且 `/callComponent/**` 覆盖为 0，没有任何 endpoint 因本轮扫描进入 `removed-by-design`。Chrome MCP shadow-off 演练确认 app `fee/detail`、`report/fee-summary` 在关闭 shadow 后回到 `3101` legacy runtime，admin `issues` 与 `payment-details-form` 在关闭 shadow 后回到 `8080/api/**` legacy path，均返回 200。受控写入演练在清空 DB URL、设置 `PHASE7_ALLOW_LEGACY_MUTATIONS=1` 的 `apps/api:3102` in-memory runtime 中完成：催缴写入从 1 读回为 2，创建费用读回 `ROOM_PHASE7_ROLLBACK/FEE_004/oweAmount=77`，支付生成 `mock-payment://` URL；重启并移除开关后读数恢复，三条写入口重新返回 `409 PHASE7_MUTATION_GUARDED`。该结论只升级为 `write-runtime-fallback-only` 本地证据，不代表 Neon 真实写入、真实支付或生产回滚已经完成。

2026-04-30 已补做一次真实 Chrome DevTools MCP 三端验证：Admin 已完成直接点击登录并进入业务页，Admin `house-charge` 页面命中 `/api-shadow/**`，App H5 `fee/detail` 与 `report/fee-summary` 页面命中 `http://127.0.0.1:3102/app/**`，且 `report/fee-summary` 中未迁移的 `/callComponent/**` 与 floor 查询仍回退到 `3101` 旧端。

因此 Phase7 的本地执行门已从 `no-go-for-execution` 改为 `go-for-local-complete-review-ready`：可以继续把已登记、已测试、非写入的 admin/app 候选读链路推进到 `apps/api`，三条高风险 app 写入口也已经具备默认阻断、显式开关受控写入、读回、重启回滚和 guard 恢复的本地边界。但旧服务退役/删除门仍不是 go：全量 endpoint 对照的 remaining 项、灰度/生产三端链路、真实 Neon 写入语义、真实支付边界和独立回滚方案仍不能被本地证据替代。

## 已完成的自动化补强

### apps/api 契约与 manifest

相关文件：

- `apps/api/tests/infra/phase7-api-contracts.test.ts`
- `apps/api/server/shared/runtime/runtime-endpoints.ts`

已补强内容：

- 新增 Phase7 双端契约测试。
- 覆盖 endpoint manifest 中首批 admin canonical 与 app legacy endpoint 的契约声明。
- 覆盖 admin canonical `JsonVO` 响应形态。
- 覆盖 app legacy allowlist endpoint 返回旧 `{ code, msg, data }` 响应形态。
- 覆盖 repair legacy、`/callComponent/**`、`house-charge create/update/delete` 不被错误宣称为已切流。
- 为 `runtimeEndpointManifest` 增加 admin canonical manifest 条目。
- 为 manifest 增加 `targetClient`、`routeKind`、`responseContract`、`cutoverStatus` 元数据。
- 将 `/app/payment.nativeQrcodePayment`、`/app/oweFeeCallable.writeOweFeeCallable`、`/app/fee.saveRoomCreateFee` 标记为 `blocked-for-execution`，不再和只读 app legacy allowlist 共用执行结论。
- 保持 `runtimeEndpointDefinitions` 仍只用于 legacy dispatcher allowlist，没有把 admin route 加入 legacy dispatcher。

验证记录：

```log
pnpm -F @01s-11comm/api exec vitest run tests/infra/phase7-api-contracts.test.ts

结果：1 files / 5 tests passed
```

```log
pnpm -F @01s-11comm/api test

结果：16 files / 58 tests passed
```

```log
pnpm -F @01s-11comm/api typecheck

结果：exit 0
```

### admin/app H5 客户端测试

相关文件：

- `apps/app/src/tests/nitro-runtime/runtime-base-url.test.ts`
- `apps/admin/src/utils/http/tests/api-base-url.test.ts`
- `apps/admin/src/api/property-manage/expense-manage/house-charge/tests/index.test.ts`
- `apps/admin/src/api/property-manage/expense-manage/expense-item-setting/tests/index.test.ts`
- `apps/admin/src/api/property-manage/report-manage/payment-details-form/tests/index.test.ts`
- `apps/admin/src/api/property-manage/repairs-manage/tests/phase7-shadow-resolver.test.ts`

已补强内容：

- `apps/app/src/tests/nitro-runtime/runtime-base-url.test.ts` 新增用例 `routes fee payment and report legacy endpoints to apps/api while keeping non-allowlisted endpoints on legacy runtime`。
- 覆盖 `fee`、`payment`、`report` 三类首批 allowlist endpoint 在 shadow 开启时解析到 `http://127.0.0.1:3102`。
- 同一用例确认未进入 allowlist 的 repair endpoint 和 `/callComponent/core/list` 仍解析到旧 runtime base。
- `apps/app/src/tests/nitro-runtime/runtime-base-url.test.ts` 进一步遍历全部 12 条 `PHASE2_API_SHADOW_ENDPOINTS`，确认 shadow 开启时均解析到 `http://127.0.0.1:3102`。
- 同一测试文件显式覆盖 `/callComponent/core/list`、`/app/ownerRepair.listOwnerRepairs`、`/app/floor.queryFloors`、`/app/floor.queryFloorDetail` 在 shadow 开启时仍解析到 `http://127.0.0.1:3101`。
- admin 已有测试覆盖 legacy、`/api-shadow` proxy、direct apps/api base 三种解析，以及 house-charge、expense-item-setting 首批 API hook 的 list/detail/create/update/delete URL 解析。
- `payment-details-form`、`repairs-todo`、`repairs-setting`、`issues` 四个 admin list hook 已补 shadow resolver/caller 测试；2026-05-04 又补齐真实 Chrome MCP 页面级 Network 200 证据，剩余缺口收窄为 shadow-off 回退与更大范围 CRUD/写动作演练。

验证记录：

```log
pnpm --filter @01s-11comm/app exec vitest run src/tests/nitro-runtime/runtime-base-url.test.ts

结果：
Test Files  1 passed (1)
Tests       32 passed (32)
```

```log
pnpm --filter @01s-11comm/admin exec vitest run src/utils/http/tests/api-base-url.test.ts src/api/property-manage/expense-manage/house-charge/tests/index.test.ts src/api/property-manage/expense-manage/expense-item-setting/tests/index.test.ts

结果：
Test Files  3 passed (3)
Tests       15 passed (15)
```

```log
pnpm --filter @01s-11comm/admin exec vitest run src/api/property-manage/report-manage/payment-details-form/tests/index.test.ts src/api/property-manage/repairs-manage/tests/phase7-shadow-resolver.test.ts

结果：
Test Files  2 passed (2)
Tests       12 passed (12)
```

### apps/api gated HTTP 测试

相关文件：

- `apps/api/tests/http/phase7-gated-http.test.ts`

已补强内容：

- 默认不依赖本地端口；未设置 `RUN_PHASE7_HTTP_TESTS=1` 与 `PHASE7_API_BASE_URL` 时整组跳过。
- 启用后会通过真实 HTTP 请求运行中的 `apps/api`，覆盖 `GET /__nitro/health`、`GET /__nitro/ready`、`GET /__nitro/endpoints`、一个 admin canonical POST、一个 app legacy GET，以及三条高风险 app legacy mutation 的默认阻断。
- 默认 `ready` 不探测数据库，只验证 DB URL 是否配置；设置 `RUN_PHASE7_DB_READINESS_CHECK=1` 后会执行真实 DB 探针，检查 `select 1`、Phase7 必需表和 Drizzle migration count。
- `ready` 允许返回 200 或 503；若为 503，必须明确匹配 `DATABASE_CONFIG_MISSING`、`DATABASE_CONNECTION_FAILED`、`DATABASE_SCHEMA_MISSING` 或 `DATABASE_MIGRATIONS_NOT_READY`，把 DB readiness 缺口记录为阻断证据而不是测试失败。

验证记录：

```log
pnpm -F @01s-11comm/api exec vitest run tests/infra/phase7-api-contracts.test.ts tests/http/phase7-gated-http.test.ts

结果：
Test Files  1 passed (1) | 1 skipped (1)
Tests       4 passed (4) | 2 skipped (2)
```

更新后未启用真实 HTTP 的默认测试计数为：

```log
pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts

结果：
Test Files  1 skipped (1)
Tests       3 skipped (3)
```

本地启动 `apps/api` 后的真实 HTTP gate 记录：

```log
$env:NITRO_PORT="3116"
$env:RUN_PHASE7_DB_READINESS_CHECK="1"
$env:NITRO_CORS_ALLOWED_ORIGINS="http://localhost:8080,http://127.0.0.1:8080,http://localhost:3000,http://127.0.0.1:3000"
pnpm -F @01s-11comm/api dev

$env:RUN_PHASE7_HTTP_TESTS="1"
$env:PHASE7_API_BASE_URL="http://127.0.0.1:3116"
pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts

结果：
Test Files  1 passed (1)
Tests       3 passed (3)
```

目标 Neon DB readiness gate 记录：

```log
$env:comm_admin_11__DATABASE_URL=<来自 apps/admin/.env.vercel.local，未输出密钥>
$env:RUN_PHASE7_DB_READINESS_CHECK="1"
$env:NITRO_PORT="3113"
pnpm -F @01s-11comm/api dev

GET http://127.0.0.1:3113/__nitro/ready
200 DB_READY

checks.database.configured=true
checks.database.connected=true
checks.database.schema.requiredTablesPresent=true
checks.database.schema.missingTables=[]
checks.database.migrations.tablePresent=true
checks.database.migrations.appliedCount=2
checks.database.migrations.expectedAppliedCount=2
checks.database.migrations.upToDate=true
```

该 gate 实际覆盖 `GET /__nitro/health`、`GET /__nitro/ready`、`GET /__nitro/endpoints`、`POST /api/property-manage/expense-manage/house-charge/list`、`GET /app/fee.listFee`，并验证 `/app/payment.nativeQrcodePayment`、`/app/oweFeeCallable.writeOweFeeCallable`、`/app/fee.saveRoomCreateFee` 默认返回 `409 PHASE7_MUTATION_GUARDED`。本轮目标 Neon DB 的最小 readiness 已从 `DATABASE_CONFIG_MISSING`/`DATABASE_MIGRATIONS_NOT_READY` 补到 `DB_READY`；高风险写动作已从“不明状态”推进为“默认阻断、显式开关才可演练”，但该结果仍不能替代写、支付、催缴动作的真实受控写入/回滚、所有候选页面 Network、灰度/生产三端链路证据。

复核记录还显示：

```log
pnpm -F @01s-11comm/admin typecheck

结果：通过
```

```log
pnpm -F @01s-11comm/app type-check

结果：通过
```

## 业务路径与接口矩阵结论

### admin H5

- `house-charge`、`expense-item-setting`、`payment-details-form`、`repairs-todo`、`repairs-setting`、`issues` API hook 已使用 `resolveAdminApiRequestUrl()`；开启 `VITE_11COMM_API_SHADOW_ENABLE=true` 后具备命中 `/api-shadow/**` 或 direct apps/api base 的调用端条件。
- `payment-details-form` 页面已改为调用 `usePaymentDetailsFormListQuery()`，不再使用本地 `mockTableData`；Chrome MCP 已记录页面级 `payment-details-form/list` Network 200。
- repairs 三个页面的 hook 已具备 shadow resolver；Chrome MCP 已记录 `repairs-todo/list`、`repairs-setting/list`、`issues/list` 页面级 Network 200，剩余为 shadow-off 回退演练和后续写/详情能力评审。
- admin 验证前必须确认 `8080` 是带 shadow env 新启动的进程，否则 `/api-shadow/**` 可能被 Vite HTML fallback 掩盖。
- admin 登录是实际阻塞点：路由守卫要求 cookie/localStorage 中存在登录态，页面 meta 还要求 `物业团队` 角色。

首批可验证页面：

| 页面 URL                                                                      | 页面动作                     | 预期 Network                                                                                                                  | 当前判断                                                  |
| ----------------------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `http://127.0.0.1:8080/#/property-manage/expense-manage/house-charge`         | 列表、搜索、分页、详情       | `POST /api-shadow/api/property-manage/expense-manage/house-charge/list` 与 `/detail`                                          | 可验证 `apps/api`；新增/编辑/删除按钮当前只提示 pending   |
| `http://127.0.0.1:8080/#/property-manage/expense-manage/expense-item-setting` | 列表、搜索、新增、编辑、删除 | `POST /api-shadow/api/property-manage/expense-manage/expense-item-setting/{list,detail,create,update,delete}`                 | 可验证 `apps/api`；delete 预期为 unsupported/blocked 策略 |
| `http://127.0.0.1:8080/#/property-manage/report-manage/payment-details-form`  | 打开、搜索、刷新             | 页面已接入 `usePaymentDetailsFormListQuery()`，命中 `/api-shadow/api/property-manage/report-manage/payment-details-form/list` | Chrome MCP 已补页面 Network 200；仍需 shadow-off 回退证据 |
| repairs 相关页面                                                              | 列表、搜索、分页             | hook 已可解析到 `/api-shadow/api/property-manage/repairs-manage/{repairs-todo,repairs-setting,issues}/list`                   | Chrome MCP 已补三页 Network 200；仍需 shadow-off 回退演练 |

### app H5

- app H5 的 fee/payment/report allowlist 可以继续使用旧业务层接口路径，但只限 `apps/app/src/http/runtime-base.ts` 中的 12 条 `PHASE2_API_SHADOW_ENDPOINTS`。
- allowlist 内路径开启 `VITE_11COMM_API_SHADOW_ENABLE=true` 后会被 alova 改写到 `http://127.0.0.1:3102/app/**`。
- allowlist 外的 `/callComponent/**`、floor/room/repair/charge-machine/open-door 等必须回退 legacy runtime。
- app 登录不是阻塞点：`isNeedLoginMode=false`，guards 默认放行；当前用户和小区信息由 `utils/user.ts` 返回 mock `COMM_001`。

首批可验证页面：

| 页面 URL                            | 页面动作             | 应命中 `apps/api` 的 endpoint                                          | 应回退 legacy 的 endpoint                                               |
| ----------------------------------- | -------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `/pages-sub/fee/detail`             | 打开页面             | `GET /app/fee.listFee`、`GET /app/fee.queryFeeDetail`                  | 无                                                                      |
| `/pages-sub/fee/owe-callable`       | 输入并搜索           | `GET /app/oweFeeCallable.listOweFeeCallable`                           | 无                                                                      |
| `/pages-sub/fee/write-owe-callable` | 打开、选择费用、提交 | `GET /app/fee.listFee`、`POST /app/oweFeeCallable.writeOweFeeCallable` | 写动作仍需 readiness 与回滚证据                                         |
| `/pages-sub/fee/pay-qrcode`         | 自动生成二维码       | `POST /app/payment.nativeQrcodePayment`                                | 支付动作仍需阻断/回滚证据                                               |
| `/pages-sub/fee/create`             | 打开、选择、提交     | `GET /app/feeConfig.listFeeConfigs`、`POST /app/fee.saveRoomCreateFee` | `GET /callComponent/core/list` 必须回退 legacy                          |
| report 相关页面                     | 打开、查询、分页     | reportFeeMonthStatistics 相关 endpoint                                 | `GET /callComponent/core/list`、`GET /app/floor.listFloors` 回退 legacy |
| `/pages-sub/report/data-report`     | 打开页面             | 无；`loadReport()` 当前被注释                                          | 需要接线或明确保持未验证                                                |

## 三端拓扑与验证要求

推荐端口：

- `apps/api`：3102，Phase7 目标独立服务。
- `apps/admin`：8080，admin H5。
- `apps/app` H5：3000。
- `apps/app` legacy fallback Nitro：3101，仅作为 app H5 非 allowlist endpoint 的旧 runtime fallback。

关键启动建议：

```log
$env:NITRO_PORT="3102"
$env:NITRO_CORS_ALLOWED_ORIGINS="http://localhost:8080,http://127.0.0.1:8080,http://localhost:3000,http://127.0.0.1:3000"
pnpm -F @01s-11comm/api dev
```

```log
$env:VITE_11COMM_API_SHADOW_ENABLE="true"
$env:VITE_11COMM_API_USE_PROXY="true"
$env:VITE_11COMM_API_PROXY_PREFIX="/api-shadow"
$env:VITE_11COMM_API_BASE_URL="http://127.0.0.1:3102"
pnpm -F @01s-11comm/admin vite:dev
```

```log
$env:VITE_API_RUNTIME="nitro-standalone"
$env:VITE_SERVER_BASEURL="http://127.0.0.1:3101"
$env:VITE_APP_PROXY_ENABLE="false"
$env:VITE_11COMM_API_SHADOW_ENABLE="true"
$env:VITE_11COMM_API_BASE_URL="http://127.0.0.1:3102"
$env:NITRO_PORT="3101"
pnpm -F @01s-11comm/app dev:h5:nitro
```

浏览器验证必须进入真实业务页面，清空 Network 后执行业务操作，保留请求 URL、method、status、response preview 和 initiator。不能只打开首页或只请求 `/__nitro/health`。

## 2026-04-30 Chrome MCP 三端补证

### 启动配置与端口

本轮使用三端本地 dev 进程补证，启动日志写入 `.tmp/phase7-live-*-20260430-165709.*.log`，PID 记录为 `.tmp/phase7-live-pids-20260430-165709.csv`。

实际监听端口：

```log
3000  apps/app H5
3101  apps/app legacy fallback Nitro
3102  apps/api 独立 Nitro
8080  apps/admin Vite
```

关键环境变量：

```log
apps/api:
NITRO_PORT=3102
NITRO_CORS_ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080,http://localhost:3000,http://127.0.0.1:3000

apps/admin:
TURBO_ENV_MODE=loose
VITE_PORT=8080
VITE_11COMM_API_SHADOW_ENABLE=true
VITE_11COMM_API_USE_PROXY=true
VITE_11COMM_API_PROXY_PREFIX=/api-shadow
VITE_11COMM_API_BASE_URL=http://127.0.0.1:3102

apps/app:
VITE_API_RUNTIME=nitro-standalone
VITE_SERVER_BASEURL=http://127.0.0.1:3101
VITE_APP_PROXY_ENABLE=false
VITE_11COMM_API_SHADOW_ENABLE=true
VITE_11COMM_API_BASE_URL=http://127.0.0.1:3102
NITRO_PORT=3101
```

服务健康状态：

```log
GET http://127.0.0.1:3102/__nitro/health
200 {"success":true,"service":"@01s-11comm/api","phase":"phase3-infra","status":"ok","checks":{"database":{"configured":false}}}

GET http://127.0.0.1:3102/__nitro/ready
503

GET http://127.0.0.1:3101/__nitro/health
200 {"status":"ok","runtime":"nitro-standalone","dataSource":"mock"}
```

### Admin 登录与业务页

Chrome MCP 操作记录：

- 打开 `http://127.0.0.1:8080/#/login`。
- 登录页自动填充 `admin` / `123456`，按用户要求直接点击登录按钮。
- 页面出现“登录成功”，随后进入 `http://127.0.0.1:8080/#/welcome`。
- 打开 `http://127.0.0.1:8080/#/property-manage/expense-manage/house-charge`，页面标题为“房屋收费”，表格展示“物业管理费”“公共服务费”“水费”等 3 条记录。

关键 Network：

```log
POST https://m1.apifoxmock.com/m1/6386631-6083270-default/login/auth-login?username=admin&password=123456
status: 200

POST http://127.0.0.1:8080/api-shadow/api/property-manage/expense-manage/house-charge/list
status: 200
request headers: authorization: Bearer ...
response headers: content-type: application/json;charset=UTF-8; x-api-phase: phase3-infra; x-request-id: req_92756e00-e680-460f-a9f6-268e8a173e7d
response envelope: {"success":true,"code":200,"message":"查询成功","data":{"list":[...],"total":3,"pageIndex":1,"pageSize":10,"totalPages":1}}
```

本地证据文件：

```log
.tmp/phase7-live-admin-house-charge-list.network-request
.tmp/phase7-live-admin-house-charge-list.network-response
.tmp/phase7-live-admin-house-charge-20260430-1712.png
.tmp/phase7-live-admin-house-charge-20260430-1712.snapshot.txt
```

Admin 控制台摘要：无 `error` 级别消息；存在 Vite 连接日志、Pinia 安装日志、Vue Router `next()` deprecation warn，以及一个菜单图标配置 warn。登录后的 `GET http://127.0.0.1:8080/api/auth/me` 返回 200 但内容类型为 Vite HTML fallback，这不是本轮 `apps/api` 业务页取证依据，需要后续单独确认 Admin 鉴权用户态接口是否仍应由 mock 或真实 handler 接管。

### App H5 费用详情页

Chrome MCP 打开：

```log
http://127.0.0.1:3000/#/pages-sub/fee/detail?feeId=FEE_001&communityId=COMM_001
```

页面证据：标题为“费用详情”，页面展示“物业管理费”“物业费”“部分缴费”“缴费历史”，缴费金额包括 `¥300` 与 `¥50`。

关键 Network：

```log
GET http://127.0.0.1:3102/app/fee.listFee?page=1&row=1&communityId=COMM_001&feeId=FEE_001
status: 200
response headers: content-type: application/json;charset=UTF-8; x-api-phase: phase3-infra; x-request-id: req_c209b152-4002-4d41-b6b4-dfc75643edc0
response envelope: {"code":0,"msg":"查询费用列表成功","data":{"list":[...],"total":1,"page":1,"row":1}}

GET http://127.0.0.1:3102/app/fee.queryFeeDetail?page=1&row=30&feeId=FEE_001&communityId=COMM_001
status: 200
response headers: content-type: application/json;charset=UTF-8; x-api-phase: phase3-infra; x-request-id: req_3e091557-98e5-4626-a22d-817150e06790
response envelope: {"code":0,"msg":"查询费用详情成功","data":{"list":[...]}}
```

本地证据文件：

```log
.tmp/phase7-live-app-fee-list-repeat.network-response
.tmp/phase7-live-app-fee-detail-repeat.network-response
.tmp/phase7-live-app-fee-detail-20260430-1714.png
.tmp/phase7-live-app-fee-detail-20260430-1714.snapshot.txt
```

### App H5 费用汇总页与 fallback

Chrome MCP 打开：

```log
http://127.0.0.1:3000/#/pages-sub/report/fee-summary?communityId=COMM_001
```

页面证据：标题为“费用汇总报表”，页面展示欠费 `¥656.00`、实缴 `¥400`、当期应收 `¥736`、收费率 `54.35%` 等统计数据。

命中 `apps/api` 的 allowlist endpoint：

```log
GET http://127.0.0.1:3102/app/reportFeeMonthStatistics.queryReportFeeSummary?page=1&row=1&communityId=COMM_001&startDate=2026-04-01&endDate=2026-04-30&feeTypeCd=&floorId=
status: 200
response headers: content-type: application/json;charset=UTF-8; x-api-phase: phase3-infra; x-request-id: req_9d0897f3-918d-4348-9527-fa03663e9b61
response envelope: {"code":0,"msg":"查询费用汇总成功","data":{"list":[{"feeRoomCount":3,"oweRoomCount":2,"curOweFee":336,"hisOweFee":320,"receivedFee":400,"curReceivableFee":736,"hisReceivedFee":960,"roomCount":3}]}}
```

仍回退到 `3101` 旧端的非 allowlist endpoint：

```log
GET http://127.0.0.1:3101/callComponent/core/list?name=pay_fee_config&type=fee_type_cd
status: 200
response envelope: {"success":true,"code":"0","message":"查询字典成功","data":[]}

GET http://127.0.0.1:3101/app/floor.queryFloors?page=1&row=50&communityId=COMM_001
status: 200
response envelope: {"success":true,"code":"0","message":"查询楼层列表成功","data":{"list":[...],"total":30,"page":1,"pageSize":50,"hasMore":false}}
```

本地证据文件：

```log
.tmp/phase7-live-app-report-summary-repeat.network-response
.tmp/phase7-live-app-callcomponent-repeat.network-response
.tmp/phase7-live-app-floor-query-repeat.network-response
.tmp/phase7-live-app-fee-summary-20260430-1715.png
.tmp/phase7-live-app-fee-summary-20260430-1715.snapshot.txt
```

App H5 控制台摘要：无 `error` 级别消息；存在 Vite HMR 日志、`App Launch/Show` 日志、`ignoreAuth` 日志，以及 `vue-router` deprecated import warn。

### 本轮最小自动化复验

```log
pnpm -F @01s-11comm/api exec vitest run tests/infra/phase7-api-contracts.test.ts

结果：1 file / 4 tests passed
```

```log
pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/runtime-base-url.test.ts

结果：1 file / 16 tests passed
```

### 进程清理

本轮验证完成后关闭 `.tmp/phase7-live-pids-20260430-165709.csv` 中记录的父进程及对应端口上的 node 子进程。清理后端口状态：

```log
No listeners on 3000, 3101, 3102, 8080
```

## 复核记录

复核报告记录的 HTTP smoke 证据：

- `GET http://127.0.0.1:3102/__nitro/endpoints` 返回 200，manifest count 为 28，包含 `/app/fee.listFee` 与 `/api/property-manage/expense-manage/house-charge/list`。
- `GET http://127.0.0.1:3102/__nitro/ready` 返回 503 `DATABASE_CONFIG_MISSING`，说明本地目标 DB readiness 未满足。
- `GET http://127.0.0.1:8080/api-shadow/__nitro/health` 返回 `@01s-11comm/api` JSON，说明当时 admin dev proxy health 可转发到 `apps/api`。
- `POST http://127.0.0.1:8080/api-shadow/api/property-manage/expense-manage/house-charge/list` 返回 admin `JsonVO`。
- `GET http://127.0.0.1:3102/app/fee.listFee?page=1&row=10&communityId=COMM_001` 返回 app legacy `{ code, msg, data }`。
- `GET http://127.0.0.1:3000/` 仅证明 app H5 首页 HTML 可访问，不证明业务页 Network 命中。

上述为 2026-04-30 复核时的历史状态；2026-05-04 本轮已将目标 Neon DB readiness 从该阻断状态补到 `DB_READY`。复核报告原结论为不通过，原因是缺少真实 Chrome H5 业务页 Network 证据、目标环境 DB readiness、allowlist 外 fallback 演练和写/支付/催缴回滚证据。2026-04-30 已补齐首批真实 Chrome MCP 业务页 Network 证据，并补到一个 App H5 allowlist 外 fallback 证据；2026-05-04 已补目标 Neon DB 最小 readiness；其余写/支付/催缴回滚、更多页面和灰度/生产三端链路仍未满足。

## 2026-05-04 Chrome MCP admin 补证

### 启动配置与端口

本轮使用三端本地 dev 进程补证，启动日志写入 `.tmp/phase7-browser-*-20260504-190650.*.log`，PID 记录为 `.tmp/phase7-browser-pids-20260504-190650.csv`。

实际监听端口：

```log
3000  apps/app H5
3101  apps/app legacy fallback Nitro
3102  apps/api 独立 Nitro
8080  apps/admin Vite
```

服务探针：

```log
GET http://127.0.0.1:3102/__nitro/health
200 {"success":true,"service":"@01s-11comm/api","phase":"phase3-infra","status":"ok","checks":{"database":{"configured":false}}}

GET http://127.0.0.1:3102/__nitro/ready
503 DATABASE_CONFIG_MISSING

GET http://127.0.0.1:8080/
200

GET http://127.0.0.1:3000/
200

GET http://127.0.0.1:3101/__nitro/health
200 {"status":"ok","runtime":"nitro-standalone","dataSource":"mock"}
```

### Admin expense-item-setting 页面

Chrome MCP 操作记录：

- 打开 `http://127.0.0.1:8080/#/login`，使用页面默认填入的 `admin` / `123456` 登录，进入 `http://127.0.0.1:8080/#/welcome`。
- 打开 `http://127.0.0.1:8080/#/property-manage/expense-manage/expense-item-setting`。
- 页面显示“费用项设置”，表格渲染出 `FEE_PROPERTY`、`Property fee`、`monthly`、`enabled` 等字段。

关键 Network：

```log
POST http://127.0.0.1:8080/api-shadow/api/property-manage/expense-manage/expense-item-setting/list
status: 200
request body: {"pageIndex":1,"pageSize":10,"code":"","name":""}
response header: x-api-phase: phase3-infra
response envelope: {"success":true,"code":200,"message":"查询成功","data":{"list":[{"id":"00000000-0000-4000-8000-000000000001","code":"FEE_PROPERTY","expenseItem":"Property fee","paymentType":"monthly","status":"enabled"}],"total":1,"pageIndex":1,"pageSize":10,"totalPages":1}}
```

本地证据文件：

```log
.tmp/phase7-live-admin-expense-item-setting-list-20260504.network-request
.tmp/phase7-live-admin-expense-item-setting-list-20260504.network-response
.tmp/phase7-live-admin-expense-item-setting-20260504-1908.png
.tmp/phase7-live-admin-expense-item-setting-20260504-1908.snapshot.txt
```

控制台摘要：存在 1 条 `Uncaught (in promise)`，堆栈来自登录流程 `index.ts:249` / `doLoginWithCaptcha`，发生在进入业务页前；本次 `expense-item-setting/list` Network 请求返回 200。该 console residual 需要后续分类确认，不能用来阻断本条 list 读链路，但也不能被报告为“无错误”。

本轮新增证据先把 `expense-item-setting/list` 从“缺页面 Network”收窄为“list 页面读取已补证”；随后又补齐目标 Neon DB 最小 readiness。`expense-item-setting` 的 detail/create/update/delete、shadow-off 回退与写入回滚仍未完成。

## 2026-05-04 Chrome MCP 四端续证

### 启动配置与端口

本轮使用四端本地 dev 进程补证，PID 记录为 `.tmp/phase7-dev-pids-20260504-203014.csv`。`apps/api` 使用目标 Neon 连接并开启 `RUN_PHASE7_DB_READINESS_CHECK=1`；`apps/admin` 使用 `/api-shadow` proxy 指向 `3102`；`apps/app` H5 开启 `VITE_11COMM_API_SHADOW_ENABLE=true`，同时保留 `3101` legacy fallback。

实际监听端口：

```log
3000  apps/app H5
3101  apps/app legacy fallback Nitro
3102  apps/api 独立 Nitro
8080  apps/admin Vite
```

服务探针：

```log
GET http://127.0.0.1:3102/__nitro/health -> 200
GET http://127.0.0.1:3102/__nitro/ready  -> 200 DB_READY
GET http://127.0.0.1:3102/__nitro/endpoints -> 200
GET http://127.0.0.1:3101/__nitro/health -> 200
GET http://127.0.0.1:8080/ -> 200
GET http://127.0.0.1:3000/ -> 200
```

### Admin 页面级 Network

Chrome MCP 打开并刷新以下 admin 业务页，页面渲染出列表数据，Network 均命中 `8080` 的 `/api-shadow/**` 代理并转发到 `apps/api`：

| 页面                   | 关键 Network                                                                    | 结果                                                       |
| ---------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `expense-item-setting` | `POST /api-shadow/api/property-manage/expense-manage/expense-item-setting/list` | 200；表格显示 `FEE-001`、`住宅物业服务费`                  |
| `payment-details-form` | `POST /api-shadow/api/property-manage/report-manage/payment-details-form/list`  | 200；表格显示 `A-101 / 张三`、`物业费`、`cashier=apps/api` |
| `repairs-todo`         | `POST /api-shadow/api/property-manage/repairs-manage/repairs-todo/list`         | 200；表格显示 `WO202604250002`、`Building 2 Corridor`      |
| `repairs-setting`      | `POST /api-shadow/api/property-manage/repairs-manage/repairs-setting/list`      | 200；表格显示 `Water and electricity`、`Public area`       |
| `issues`               | `POST /api-shadow/api/property-manage/repairs-manage/issues/list`               | 200；表格显示 `WO202604250002`、`WO202604250001`           |

`payment-details-form/list` 响应头包含 `x-api-phase: phase3-infra`，响应体为 admin `JsonVO<PageDTO>`，`data.list` 共 2 条支付明细；`issues/list` 响应头同样包含 `x-api-phase: phase3-infra`，响应体返回 2 条维修工单。

Admin 控制台摘要：仅记录 Vue Router `next()` deprecation warning 与登录 token 检查日志；本轮补证页面未出现会阻断上述 API 读链路的 console error。

### App 页面级 Network 与写入口阻断

Chrome MCP 使用移动视口打开 app H5 页面并记录 Network：

| 页面                                | 关键 Network                                                                                                                                                | 结果                                                                                       |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `/pages-sub/fee/detail`             | `GET http://127.0.0.1:3102/app/fee.listFee`、`GET http://127.0.0.1:3102/app/fee.queryFeeDetail`                                                             | 200；页面显示 `费用详情`、`物业管理费`                                                     |
| `/pages-sub/fee/pay-qrcode`         | `POST http://127.0.0.1:3102/app/payment.nativeQrcodePayment`                                                                                                | HTTP 200；legacy envelope 内 `code=409`、`errorCode=PHASE7_MUTATION_GUARDED`               |
| `/pages-sub/fee/write-owe-callable` | `GET http://127.0.0.1:3102/app/fee.listFee` 与页面上下文 `POST /app/oweFeeCallable.writeOweFeeCallable`                                                     | GET 200；POST 返回 `409 PHASE7_MUTATION_GUARDED`                                           |
| `/pages-sub/fee/create`             | `GET http://127.0.0.1:3101/callComponent/core/list`、`GET http://127.0.0.1:3102/app/feeConfig.listFeeConfigs`、页面上下文 `POST /app/fee.saveRoomCreateFee` | callComponent 保持 3101 fallback；feeConfig 200；create 返回 `409 PHASE7_MUTATION_GUARDED` |
| `/pages-sub/report/fee-summary`     | `GET http://127.0.0.1:3101/app/floor.queryFloors`、`GET http://127.0.0.1:3102/app/reportFeeMonthStatistics.queryReportFeeSummary`                           | floor 保持 3101 fallback；summary 200；页面显示 `欠费: ¥656.00`、`实缴 ¥400`               |

App 控制台摘要：仅记录 Vite HMR、路由鉴权日志和 alova memory cache 日志；未出现会阻断上述 allowlist/fallback/guard 证据的 console error。

本轮未开启 `PHASE7_ALLOW_LEGACY_MUTATIONS=1`。结论是高风险 app 写入口在默认 dev/候选切流状态下已经可被真实浏览器触达并安全阻断，不代表支付、催缴或费用创建已经完成真实写入能力。

### 残留日志分类

本轮曾使用 PowerShell `Invoke-WebRequest` 直接 POST admin proxy，Nitro dev 内部 undici 因 PowerShell 默认 `Expect` header 记录 `NotSupportedError: expect header not supported`。随后 Node fetch 与 Chrome MCP 对同一路由均返回 200，因此该日志归类为工具诱发 residual，不作为浏览器链路阻断。

### 进程清理

本轮验证完成后关闭 `.tmp/phase7-browser-pids-20260504-190650.csv` 中记录的父进程及对应端口上的 node 子进程。清理后端口状态：

```log
No listeners on 3000, 3101, 3102, 8080
```

## 仍未覆盖项

- 首批 Chrome/MCP 页面级 Network 证据已补：admin `house-charge`、`expense-item-setting/list`、`payment-details-form/list`、`repairs-todo/list`、`repairs-setting/list`、`issues/list`；app `fee/detail`、`pay-qrcode` 默认阻断、`write-owe-callable` 默认阻断、`fee/create` fallback 与默认阻断、`report/fee-summary`。
- admin `expense-item-setting` detail/create/update/delete 写动作策略仍未完成 Network 级验证；`payment-details-form` 与 repairs 三页的正向 list Network 已补，仍缺 shadow-off 回退演练。
- app 已补 `fee/detail`、`pay-qrcode`、`write-owe-callable`、`fee/create` 与 `report/fee-summary` 业务页证据，并证明 `/callComponent/core/list` 与 `floor.queryFloors` 保持 legacy fallback；仍缺 app repair endpoint、`data-report` 和更大范围非 allowlist 页面证据。
- 目标 Neon DB 最小 readiness 已补：`RUN_PHASE7_DB_READINESS_CHECK=1` 下 `GET /__nitro/ready` 返回 `DB_READY`；但仍缺灰度/生产三端链路里的同等 readiness 取证。
- 未演练关闭 shadow、移出 allowlist、恢复 proxy 或 legacy runtime 的回退路径。
- 高风险 app 写动作已具备默认阻断、manifest 标记和 Chrome MCP Network 证据，但仍缺在 `PHASE7_ALLOW_LEGACY_MUTATIONS=1` 下进行的受控写入/读取校验/回滚演练。
- repairs 相关 admin route 已补 caller resolver 测试和页面 list Network；app repair、`data-report`、`/callComponent/**` compat handler 等仍有 handler/fallback 缺口。

## 后续处理建议

- 继续扩大 Chrome MCP 业务页取证范围，补 `expense-item-setting` detail/create/update/delete、app repair、`data-report` 与写/支付/催缴动作的受控回滚证据。
- 补 `payment-details-form`、repairs 三页和 app allowlist 的 shadow-off/legacy fallback 演练证据。
- 补 `/callComponent/core/list` compat handler 设计或继续显式 fallback 的浏览器证据；当前仅证明它在 `fee/create` 页面保持 3101 fallback。
- 在三端 dev 服务运行时继续设置 `RUN_PHASE7_HTTP_TESTS=1` 与 `PHASE7_API_BASE_URL=http://127.0.0.1:3102`，复跑 gated HTTP 测试并把 health、ready、manifest、admin canonical、app legacy 的真实 HTTP 结果追加到每批收口报告。
- 继续补灰度/生产 Neon readiness、读写权限、失败回滚和写/支付/催缴动作的受控执行证据；本轮覆盖目标 Neon DB 最小 readiness，并把三条高风险写动作推进为默认阻断。

## 2026-05-09 生产 server 验证与前端接入状态

本轮使用 `https://01s-11-server.ruan-cat.com` 作为独立 `apps/api` 生产入口推进 Phase7 生产 gate。生产 server 已完成 Vercel 预构建部署并别名到统一域名。

### 已通过的生产 server 证据

```log
GET https://01s-11-server.ruan-cat.com/__nitro/health -> 200
GET https://01s-11-server.ruan-cat.com/__nitro/ready -> 200 READY_CONFIGURED
GET https://01s-11-server.ruan-cat.com/__nitro/endpoints -> 200
OPTIONS https://01s-11-server.ruan-cat.com/__nitro/health
  Origin: https://01s-11comm.ruan-cat.com -> 204 access-control-allow-origin=https://01s-11comm.ruan-cat.com
OPTIONS https://01s-11-server.ruan-cat.com/__nitro/health
  Origin: https://01s-11-app.ruan-cat.com -> 204 access-control-allow-origin=https://01s-11-app.ruan-cat.com
OPTIONS https://01s-11-server.ruan-cat.com/__nitro/health
  Origin: https://01s.11.app.ruan-cat.com -> 204 access-control-allow-origin=https://01s.11.app.ruan-cat.com
GET https://01s-11-server.ruan-cat.com/app/fee.listFee?page=1&row=1&communityId=COMM_001 -> 200
GET https://01s-11-server.ruan-cat.com/app/floor.queryFloors?page=1&row=1&communityId=COMM_001 -> 200
GET https://01s-11-server.ruan-cat.com/callComponent/core/list?name=pay_fee_config&type=fee_type_cd -> 200
```

`/app/floor.queryFloors` 与 `/callComponent/core/list` 是统一 server 显式 fallback 到 `https://01s-11-app-server.ruan-cat.com` 的兼容结果，只能归类为 `legacy-fallback`，不能归类为已完成 `apps/api` DB/repository 迁移。

生产 gated HTTP 测试已通过：

```log
RUN_PHASE7_HTTP_TESTS=1
PHASE7_API_BASE_URL=https://01s-11-server.ruan-cat.com
pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts

Test Files  1 passed
Tests       3 passed
```

`READY_CONFIGURED` 表示生产环境已配置数据库连接，但本轮生产部署未开启深度 DB readiness probe；它不能替代 `RUN_PHASE7_DB_READINESS_CHECK=1` 下的 `DB_READY` 证据。

### 本轮代码与配置变更

- `apps/api` 增加默认生产 CORS allowlist，覆盖 admin/app H5 域名。
- `apps/api` 增加 `/app/**` 与 `/callComponent/**` legacy fallback 能力，确保统一 server 可以承接 app 生产 base URL 中尚未迁移的 legacy 路由。
- `apps/admin/.env.production` 增加阶段 7 API base URL，指向 `https://01s-11-server.ruan-cat.com`；未强行切换模板登录所用 `VITE_BASE_URL`。
- `apps/app/env/.env.production` 将 `VITE_SERVER_BASEURL`、`VITE_UPLOAD_BASEURL`、`VITE_11COMM_API_BASE_URL` 指向 `https://01s-11-server.ruan-cat.com`。

本地验证已通过：

```log
pnpm -F @01s-11comm/api exec vitest run tests/infra/runtime-env.test.ts tests/infra/cors.test.ts tests/runtime/legacy-fallback.test.ts tests/runtime/endpoint-registry.test.ts tests/infra/phase7-api-contracts.test.ts
pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/runtime-base-url.test.ts
pnpm -F @01s-11comm/admin exec vitest run src/utils/http/tests/api-base-url.test.ts src/api/property-manage/report-manage/payment-details-form/tests/index.test.ts src/api/property-manage/repairs-manage/tests/phase7-shadow-resolver.test.ts
pnpm -F @01s-11comm/api typecheck
pnpm -F @01s-11comm/admin typecheck
pnpm -F @01s-11comm/app type-check
pnpm -F @01s-11comm/api build:vercel
pnpm -F @01s-11comm/admin build
pnpm -F @01s-11comm/app build:h5:prod
```

### 前端生产接入状态

admin H5 当前生产部署尚未完成。`apps/admin` 本地生产构建已通过，但执行 Vercel 生产部署时，Vercel 在独立项目目录安装依赖失败：

```log
ERR_PNPM_WORKSPACE_PKG_NOT_FOUND
"@01s-11comm/type@workspace:^" is in the dependencies but no package named "@01s-11comm/type" is present in the workspace
```

该问题说明 `11comm-admin` 的 Vercel monorepo/root directory 或安装策略仍需调整；在修复前，不能宣称 admin 生产 H5 已切到统一 server。

app H5 当前生产发布暂停。发布前必须先把 `apps/app` 正确 link 到 Vercel 项目 `11comm-app-h5`，当前未执行 link，也未执行 app H5 生产发布。`apps/app` 本地 H5 生产构建已确认使用统一 server 环境变量，但这只证明构建配置正确，不等同于线上 H5 已更新。

### 当前 gate 结论

- `apps/api` 生产 server gate：通过。
- 生产 server CORS gate：通过。
- 生产 app legacy fallback gate：通过，但标记为 `legacy-fallback`。
- admin H5 生产接入 gate：未通过，阻塞于 Vercel workspace 安装配置。
- app H5 生产接入 gate：暂停，等待 link 到 `11comm-app-h5` 后再发布和验证。
- Phase7 总体状态：仍不能关闭旧 server，也不能从 `no-go-for-production-h5-cutover` 升级为完成态。
