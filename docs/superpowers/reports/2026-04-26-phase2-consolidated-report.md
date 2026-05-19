# 2026-04-26 Phase2 汇总报告

## 背景

本报告是 Phase2 唯一汇总报告，按用户本轮要求合并 `docs/superpowers/reports` 下 8 份新增临时报告后形成。合并目标是保留可验收结论、验证证据和风险记录，移除重复的探索、编辑、复核碎片报告。

Phase2 对应旧 app monorepo API 迁移总设计中的范围；旧总设计已迁移至稳定索引 `docs/superpowers/phase7-openspec-migration-index.md`，canonical OpenSpec change 为 `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/`：最小可运行 `apps/api` Nitro 影子服务，加上 fee/payment/report 首批纵切样板。Phase2 不是纯基础设施空壳，也不是 repair/resource/parking 等多模块并行迁移。CI workflow 修复属于 Phase2 到 Phase3 的交接验收补强。

## 阶段 2 完成结论

Phase2 已完成。当前 `apps/api` 可作为独立 Nitro 影子服务，支撑 app legacy 与 admin canonical 样板：

- app legacy 侧覆盖 fee/payment/report 首批兼容路由。
- admin canonical 侧覆盖物业费用与缴费明细两个样板接口。
- app legacy adapter 与 admin canonical adapter 共享同一 fee runtime/service/repository，避免维护两套互相漂移的数据源。
- 未把 repair/resource/parking、charge-machine/open-door、machine-record 等后续能力伪装为 Phase2 已完成内容。
- 未做 app/admin 全量切流；旧服务与旧源目录保留，后续仍可回退和对照。

## 接口服务能力

`apps/api` 已具备独立 package 能力，包含 `dev`、`test`、`typecheck`、`build`、`preview` 等脚本，并被 workspace 识别为 `@01s-11comm/api`。Nitro 配置使用独立 server 目录，服务端测试使用 Node 环境。

基础能力包括：

- 根入口与健康检查：`server/routes/index.get.ts`、`server/routes/__nitro/health.get.ts`。
- runtime helpers：endpoint registry、request adapter、response builder、runtime endpoint 汇总。
- legacy dispatch：通过 runtime registry 分发 `/app/**`，未命中时返回 legacy failure。
- fee module：包含 admin adapter、legacy adapter、legacy endpoint 白名单、runtime、service、repository、types 与统一导出。
- runtime fallback：无 event 或无数据库 URL 时使用共享 in-memory runtime；有数据库 URL 时按 request context 缓存 db-backed runtime。
- 数据库相关表、`JsonVO`、`PageDTO` 等类型来自 `@01s-11comm/type`，未在 `apps/api` 内私建 Drizzle/Zod schema。

Phase2 app legacy 白名单覆盖：

```text
/app/fee.listFee
/app/fee.queryFeeDetail
/app/feeApi/listOweFees
/app/payment.nativeQrcodePayment
/app/oweFeeCallable.listOweFeeCallable
/app/oweFeeCallable.writeOweFeeCallable
/app/fee.saveRoomCreateFee
/app/feeConfig.listFeeConfigs
/app/reportFeeMonthStatistics.queryReportFeeSummary
/app/reportFeeMonthStatistics/queryPayFeeDetail
/app/reportFeeMonthStatistics.queryReportFeeDetailRoom
/app/dataReport.queryFeeDataReport
```

Phase2 admin canonical 样板覆盖：

```text
POST /api/property-manage/expense-manage/house-charge/list
POST /api/property-manage/report-manage/payment-details-form/list
```

## 文档复查结论

Phase2 plan 与 design 文档均已把 Phase2 描述为完成并通过验收。文档口径确认：

- Phase2 的验收核心是 `apps/api` 最小可运行 Nitro 影子服务和 fee/payment/report 首批纵切样板。
- CI、部署 preset、完整 runtimeConfig、环境变量治理、CORS、日志监控、admin/app API base URL 接入策略归入 Phase3。
- repair/resource/parking、charge-machine/open-door、machine-record、更多 admin 三级业务路径 CRUD 归入 Phase4 或后续阶段。
- Phase2 到 Phase3 的 GitHub workflow 交接验收要求包含 frozen lockfile、workspace-local Turbo、全量 workspace build、禁止全局安装、语义化中文命名和必要 action major versions 不降级。

## 代码复查结论

Phase2 独立复核结论为通过。已确认：

- `apps/api` 存在独立 Nitro package scripts，测试、类型检查和 Nitro build 均有通过记录。
- 健康检查与根入口存在，smoke tests 覆盖基础可访问性。
- legacy/admin 两侧测试分别覆盖 app legacy DTO 与 admin canonical DTO，并存在共享 service/repository 的断言。
- H3 helper 未发现从 `"h3"` 直接导入，当前约束为从 `nitro/h3` 使用。
- 未发现 `@neondatabase/auth`、JWT、Bearer、Authorization、Token 校验或鉴权中间件/插件。
- 未发现 `apps/api` 私建 `pgTable`、`createInsertSchema`、`createSelectSchema` 或直接建立独立 schema 体系。
- `charge-machine/open-door/machine-record/repair/resource/parking` 相关文本只出现在排除性测试断言中，未混入 server runtime 能力。

## CI workflow 故障根因

GitHub Actions 两个失败 run 的共同根因是 lockfile snapshot 不完整：

- `CI` run `24943223560` 在 job `tester` 的安装 pnpm 步骤失败。
- `App CI` run `24943223567` 在 job `build` 的安装依赖步骤失败。
- 失败日志均指向 `ERR_PNPM_LOCKFILE_MISSING_DEPENDENCY`，缺少 `drizzle-orm@0.42.0(...@types/pg@8.15.6...)` 对应的 `pnpm-lock.yaml` snapshot。

同时发现 workflow 结构性风险：

- 旧 `ci.yaml` 在 `actions/setup-node@v6` 前通过 `pnpm/action-setup@v5 run_install` 触发 install，使 workspace install 运行在 runner 自带 Node 20 上，而项目要求 Node `>=22.14.0`。
- 旧 workflow 存在全局安装 `tsx`、`turbo`、`pnpm ls -g`、直接 `turbo --version` 等模式，违反本项目禁止全局安装工具包的约束。
- 旧 app workflow 只验证 app 单包命令，不能替代 monorepo 全量 Turbo CI。

## CI 修复内容

CI 已改为全量 Turbo CI，覆盖 admin/api/app/type 四包；App 专项 CI 四步通过。临时报告记录的最终状态如下：

- `.github/workflows/ci.yaml` 已改为 `全量 Turbo CI`，job/step 名称为语义化中文。
- 保留 `actions/checkout@v6`、`pnpm/action-setup@v5`、`actions/setup-node@v6`，未通过降级 action major version 规避问题。
- 安装顺序改为 checkout -> 安装 pnpm -> 安装 Node.js 22.14.0 并启用 pnpm cache -> `pnpm install --frozen-lockfile`。
- Turbo 相关命令通过 workspace-local 方式执行：`pnpm exec turbo` 或根脚本 `pnpm run ci`。
- 移除 `run_install`、`--global`、`pnpm ls -g`、直接 `turbo --version`、直接 `run: turbo`。
- `pnpm-lock.yaml` 最小对齐 `apps/api` importer 的 `drizzle-orm`、`nitro`、`vitest` resolution 到 lockfile 中已存在的 snapshot；未修改 package.json 依赖版本。
- `apps/type/package.json` 已有 `build: tsc --noEmit`，使全量 Turbo build 中 `@01s-11comm/type#build` 不再是 `<NONEXISTENT>`。
- `.github/workflows/app-ci.yml` 保留 App 专项验证四步：H5 production build、type-check、Vitest、Nitro Vercel build。

## 最终验证结果

临时报告记录的关键验证命令与结果如下：

```log
pnpm install --frozen-lockfile
结果：通过。
```

```log
pnpm run ci
结果：通过。Turbo 2.8.17 对 @01s-11comm/admin、@01s-11comm/api、@01s-11comm/app、@01s-11comm/type 四个 workspace 包运行 build，4 个任务成功。
```

```log
pnpm -F @01s-11comm/app run build:h5:prod
结果：通过。
```

```log
pnpm -F @01s-11comm/app run type-check
结果：通过。
```

```log
pnpm -F @01s-11comm/app exec vitest run
结果：通过。43 个测试文件、126 个用例通过。
```

```log
pnpm -F @01s-11comm/app run build:nitro:vercel
结果：通过。
```

```log
pnpm -F @01s-11comm/api test
结果：通过。5 个测试文件、17 个测试用例通过。
```

```log
pnpm -F @01s-11comm/api typecheck
结果：通过。
```

```log
pnpm -F @01s-11comm/api build
结果：通过。Nitro node-server 构建成功。
```

```log
pnpm -F @01s-11comm/type typecheck
结果：通过。
```

```log
pnpm exec turbo run build --dry-run=json
结果：通过。输出包含 @01s-11comm/admin、@01s-11comm/api、@01s-11comm/app、@01s-11comm/type；@01s-11comm/type#build 的 command 为 tsc --noEmit。
```

```log
rg -n "run_install|--global|pnpm ls -g|turbo --version|run: turbo" .github/workflows/ci.yaml .github/workflows/app-ci.yml
结果：无匹配输出，表示未发现这些禁用模式。
```

```log
git diff --check
结果：通过，无输出。
```

## 遗留风险

- 真实 Neon 数据库连接行为未作为 Phase2 阻断项完成验收；Phase2 已验证无数据库 URL fallback、测试、类型检查和构建，真实运行环境接入应进入 Phase3。
- Nitro build 输出中可能包含来自 `@01s-11comm/type` / `drizzle-zod` 的传递 zod chunk；这不代表 `apps/api` 直接依赖 zod 或私建 schema。
- `apps/api/nitro.config.ts` 当前使用方式与早期计划样例不完全一致，但 test/typecheck/build 已通过，模块通过显式 import 使用，暂不构成 Phase2 阻断问题。
- CI 修复已覆盖当前失败 workflow；其他 workflow 若仍存在 `run_install` 或全局安装模式，应作为后续专项处理，不混入本次报告结论。
- 旧源目录 `D:\code\ruan-cat\01s-11comm-app` 必须永久保留，任何 Phase3、Phase4、旧服务收口、retirement review 或清理流程都不得将其纳入删除、移动、归档、重命名或清空范围。

## Phase3 准入建议

建议允许进入 Phase3。Phase3 应聚焦：

- API 部署 preset 与部署平台配置。
- 完整 runtimeConfig、环境变量治理、CORS、日志、监控与错误追踪。
- admin/app API base URL 接入策略、回退策略和切流验证。
- 将 Phase2 中最小 runtime helper 固化为可扩展基础设施规范。
- 持续以 `pnpm install --frozen-lockfile` 和 `pnpm run ci` 作为 monorepo 全量健康门禁。
- 保持 App 专项 CI 四步作为 app 侧补充验证，但不把它替代全量 Turbo CI。

Phase4 或更晚阶段再处理 repair/resource/parking、charge-machine/open-door、machine-record、更多 admin 三级业务路径 CRUD 和其他 app legacy endpoint 扩展。

## 被合并的临时报告清单

按用户本轮要求，以下 8 份临时报告已合并进本报告并移除：

- `2026-04-26-phase2-code-explorer-report.md`
- `2026-04-26-phase2-doc-explorer-report.md`
- `2026-04-26-phase2-editor-report.md`
- `2026-04-26-phase2-reviewer-report.md`
- `2026-04-26-ci-workflow-explorer-report.md`
- `2026-04-26-ci-workflow-editor-report.md`
- `2026-04-26-ci-workflow-reviewer-report.md`
- `2026-04-26-ci-workflow-final-review-report.md`
