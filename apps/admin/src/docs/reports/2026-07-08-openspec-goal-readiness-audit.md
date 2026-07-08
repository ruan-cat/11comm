# 2026-07-08 OpenSpec 目标达成度审计报告

## 1. 审计对象与范围

- **OpenSpec change**：D:/code/ruan-cat/01s-11comm/openspec/changes/migrate-superpowers-docs-to-openspec-longtask/
- **核心文件**：
  - proposal.md
  - design.md
  - specs/unified-nitro-api-consolidation/spec.md
  - specs/phase7-evidence-model/spec.md
  - specs/admin-api-cutover/spec.md
  - specs/app-legacy-cutover/spec.md
  - specs/retirement-gate-and-archive/spec.md
  - specs/db-readiness-and-write-verification/spec.md
  - specs/vitest-and-runtime-verification/spec.md
  - specs/browser-and-environment-verification/spec.md
  - specs/agent-team-batch-execution/spec.md
  - tasks.md
  - retirement-evidence-matrix.md
  - legacy-nitro-retirement-execution-plan.md
- **审计日期**：2026-07-08
- **审计方式**：只读读取 OpenSpec 工件与当前工作树，不修改代码。

## 2. 核心目标（来自 proposal.md）

本 change 不是单纯的文档迁移，而是把原三份 Superpowers Markdown 中的 Phase7 长任务体系迁移到 OpenSpec，并继续推进以下主线：

1. **统一 Nitro API 合并主线**：把 apps/admin/server 的旧 admin Nitro API 责任、apps/app/server 与旧项目 D:/code/ruan-cat/01s-11comm-app 的 app legacy/mock Nitro API 责任，逐步合并到独立部署的 apps/api Nitro 项目。
2. **Phase7 作为退役准备阶段**：Phase7 的状态矩阵、证据模型和 batch 计划必须服务于“证明旧 admin/app Nitro 职责已被 apps/api 承接”，而不是孤立的 endpoint 数量统计或文档清理。
3. **四条状态流独立跟踪**：
   - admin legacy Nitro stream
   - app legacy/mock Nitro stream
   - unified apps/api runtime stream
   - retirement gate stream
4. **tasks.md 是唯一可执行任务源**：agent-progress.md 与 agent-findings.md 只记录进度与发现，不得维护第二套任务清单。
5. **旧服务在门禁通过前保持受保护**：apps/admin/server、apps/app/server、D:/code/ruan-cat/01s-11comm-app 在退役门禁通过前不得删除、移动、归档、重命名或清空。

## 3. 系统架构与迁移策略（来自 design.md）

### 3.1 目标架构

```text
apps/admin/server 旧 admin Nitro API 责任
apps/app/server 与 D:/code/ruan-cat/01s-11comm-app 旧 app legacy/mock Nitro API 责任
        ↓
apps/api 独立 Nitro API 服务
        ↓
apps/admin 与 apps/app 共同消费统一 API
        ↓
证据闭环后清退旧 admin/app Nitro 服务责任
```

### 3.2 独立 apps/api 的定位

- apps/api 是 admin 与 app 的**唯一长期 API 服务目标**。
- apps/type 继续作为 Drizzle Table、Zod Schema、TypeScript Type 的**唯一事实源**。
- apps/api 接管 Drizzle Kit 配置、迁移目录、db:* 脚本、Neon readiness 与 drift 诊断的长期权威入口（B 方案）。
- apps/admin 的旧 Drizzle 入口只能作为兼容或退役来源，不得继续作为生产 DB 运维权威。

### 3.3 admin/app 内置 Nitro 的退役条件（2026-06-05 扩展）

2026-06-05 起，本 change 从“文档迁移已完成”重新打开为“旧内置 Nitro 退役执行增补阶段”。退役判断从 endpoint 数量升级为**目录/文件组级状态机**：

| 状态                       | 含义                                                                            |
| -------------------------- | ------------------------------------------------------------------------------- |
| protected                | 默认状态；旧目录仍是迁移来源、fallback、测试或运维入口，不可删除                |
| blocked                  | 已发现必须先处理的阻断，例如 fallback-only、旧脚本、DB/seed、R2、mock/test 依赖 |
| keep-source              | 暂时保留作为来源或回滚材料，即使部分调用已迁移                                  |
| not-candidate-but-unused | 当前无活动依赖，但缺少删除收益、回滚设计或最终确认                              |
| delete-candidate         | 反向依赖清零、替代实现明确、验证命令通过、生产证据闭环、回滚可执行              |

只有目录级 evidence matrix 同时覆盖当前依赖、目标替代、测试/构建、生产 runtime、fallback/shadow-off、DB/write/R2 和 rollback 后，才允许进入删除步骤。


## 4. 独立 apps/api 需要具备的能力（来自 specs）

### 4.1 统一 Nitro API 合并（specs/unified-nitro-api-consolidation/spec.md）

- **唯一独立 Nitro API 目标**：apps/api 必须承接 admin/app 两套旧 Nitro API 责任。
- **Drizzle 迁移能力由 apps/api 承接**：apps/type 保留 schema 事实源；apps/api 成为 Drizzle Kit、迁移目录、db:* 脚本、Neon readiness 与 drift 诊断的长期权威入口。
- **Admin 与 App 两条旧 Nitro 源流独立跟踪**：任一源流完成不得推导另一源流完成。
- **领域模块组织标准**：迁入 apps/api 的业务域必须形成 repository、service、runtime、admin-adapter、legacy-adapter、legacy-endpoints 的清晰边界；route handler 只做参数读取、运行时组装、错误包装和响应输出。
- **Admin canonical 与 App legacy 双契约输出**：同一领域服务必须能通过不同 adapter 输出 admin canonical 契约和 app legacy 契约。
- **旧服务在门禁通过前只是迁移来源与保护路径**。
- **Phase1 到 Phase7 阶段链必须保留**。
- **Nitro runtime governance**：H3 API 从 nitro/h3 导入，禁止新增鉴权中间件，配置通过 runtimeConfig/env 管理，不得在模块顶层创建 Neon/Drizzle 连接。
- **统一 Nitro 完成证据**：必须具备调用端切流、route/adapter 存在、响应契约、共享数据源、DB readiness、fallback/shadow-off、guarded write、浏览器或 HTTP 证据、retirement decision。
- **前端项目不得继续内置 Nitro 运行时**：apps/admin 与 apps/app 只作为前端项目消费独立 apps/api。
- **apps/api 承接 DB、seed、R2 与 legacy dispatch 运维入口**。

### 4.2 Phase7 证据模型（specs/phase7-evidence-model/spec.md）

每个 endpoint 或目录必须保留以下证据字段：

- coverageKind：old-path-exact-covered、canonical-only、not-covered、unknown-needs-triage
- dataSourceStatus：db-ready、db-read-repository-wired、legacy-fallback、in-memory-only、blocked-for-execution 等
- targetStatus：available-in-apps-api-not-caller-verified、candidate-after-evidence、legacy-fallback、blocked-for-execution、delete-candidate 等
- callerEvidence、browserEvidence、fallbackEvidence、dbReadinessEvidence、writeReadRollbackEvidence
- retirementDecision：keep-source、blocked、candidate-after-review、delete-candidate
- 目录级额外字段：directoryPath、fileGroup、currentDependency、targetReplacement、configScriptEvidence、testBuildEvidence、runtimeEvidence、fallbackOrShadowEvidence、dbR2SeedEvidence、dryRunEvidence、rollbackNote

缺任一关键字段时，不得升级为 delete-candidate。

### 4.3 Admin 切流（specs/admin-api-cutover/spec.md）

- Admin endpoint 迁移以 apps/admin/src/router/rank/rank-route-keys.ts 三级业务路径为 canonical 坐标。
- 必须按 list、detail、create、update、delete、tree、debug、upload、file、payment-like 分级处理；普通 list 完成不能推导 detail/CUD/upload 完成。
- 当前下一推荐切片是 property-manage/contract-manage 12 个普通 list endpoint。
- Admin 前端 resolver 迁移已记录为完成，但仍需 fresh scan 复核。
- Admin 旧服务退役准备必须具备统一 Nitro 承接证据、调用端证据、DB 或接受的非 DB 解释、页面或 HTTP gate、fallback/shadow-off、写入口闭环、retirement gate 评审。
- Admin 内置 Nitro 退役后，apps/admin 不得再通过 Vite Nitro plugin、nitro.config.ts、serverDir: "./server"、Nitro build script 运行本包 server。
- Admin legacy DB、seed、Drizzle compatibility、R2/upload、generator 与活动文档必须在删除前迁入 apps/api 或显式废弃。

### 4.4 App 旧接口切流（specs/app-legacy-cutover/spec.md）

- App legacy/mock 源流包括 apps/app/server/modules/**/endpoints.ts 与旧项目 D:/code/ruan-cat/01s-11comm-app。
- 每个 app legacy endpoint 必须记录旧路径、HTTP method、旧模块、调用端、runtime manifest、shadow allowlist、legacy dispatch、adapter、response contract、dataSourceStatus、guard、fallback、browser/HTTP evidence、retirementDecision。
- /callComponent/**、floor、repair、fee/report、guarded writes、剩余 app modules 必须独立评审。
- 高风险 app 写入口默认必须 guarded，未设置 PHASE7_ALLOW_LEGACY_MUTATIONS=1 时返回 409 PHASE7_MUTATION_GUARDED。
- App mock 与测试不得库化依赖旧 server；app 内置 Nitro 退役后不得拥有自有 Nitro build/dev/preview/runtime。
- App fallback-only endpoint 必须逐项收口为 exact handler、guarded write、explicit blocked、diagnostic/not-candidate 或删除候选外保留项。

### 4.5 退役门禁（specs/retirement-gate-and-archive/spec.md）

- 退役评审必须同时检查 admin legacy stream、app legacy stream、unified apps/api runtime stream、DB/write evidence、fallback/shadow-off 和受保护路径状态。
- apps/admin/server、apps/app/server 和 D:/code/ruan-cat/01s-11comm-app 在 no-go-for-retirement 解除前必须受保护。
- 删除旧 Superpowers 文档或推进旧服务退役都必须有 fresh scan、OpenSpec validation、状态审查、git diff 检查和 Memorix 记录。
- 删除旧服务目录前 MUST 在隔离 worktree 或临时 rename 中执行 dry-run，覆盖引用扫描、typecheck、Vitest、build、OpenSpec strict 和回滚演练。


### 4.6 DB 就绪与写入验收（specs/db-readiness-and-write-verification/spec.md）

- Phase7 DB readiness 必须使用 Neon main 分支连接串完成；不得使用 Neon 测试分支、本地 fake DB 或 in-memory fallback。
- 唯一允许的真实库验收方式：通过生产或受控 Vercel apps/api runtime 的公开 HTTP endpoint，最小入口为 GET /__nitro/health 与 GET /__nitro/ready。
- Drizzle Kit 与 Neon schema 变更流程归属 apps/api；生产问题先做只读 drift/readiness 诊断，确认 drift 后再审查迁移 SQL。
- 受控写入验收必须使用唯一 PHASE7_E2E_* 或 phase7RunId 标记，并包含 guard-before、write-window、controlled write、read-back、rollback/cleanup、residual check、guard-after。
- 生产 CUD 只能通过公开 apps/api HTTP endpoint 触发业务 handler，不得直接写数据库。

### 4.7 Vitest 与运行时验证（specs/vitest-and-runtime-verification/spec.md）

- 修改 apps/api handler、adapter、service、repository、runtime manifest、legacy dispatch、guard、admin resolver、app legacy caller 或 response contract 时，必须补对应 Vitest。
- App legacy 迁移测试必须覆盖 legacy response envelope、兼容 DTO、GET/POST 或 body/query 参数兼容、fallback/allowlist 状态、guard 默认阻断和 DB-backed 字段语义。
- Nitro 接口格式自检机制必须由 Vitest/infra test 证明：module files、legacy-endpoints.ts handler 形状、runtime manifest、App shadow allowlist 与 response contract 必须同时对齐。
- Vitest 不得默认连接 Neon main 或执行真实生产写入；DB_READY、真实库样本、写入读回回滚属于受控运行时证据。

### 4.8 浏览器与环境验证（specs/browser-and-environment-verification/spec.md）

- 必须建立 admin H5、app H5、独立 apps/api server 三端，分别放入 local-dev 和 production 两类环境的验收矩阵。
- Chrome DevTools MCP 是页面级浏览器证据的主采集工具；直接 shell fetch、Vitest 不能冒充 Chrome MCP browserEvidence。
- 生产入口必须重新读取三个 package 的 homepage 字段，不得从旧文档或截图反推。

### 4.9 Agent Team 批次执行（specs/agent-team-batch-execution/spec.md）

- 后续执行继承 Agent Team 模型：主代理、探索子代理、编辑子代理、复核子代理。
- Batch0 是所有实施批次的前置 fresh scan gate；Batch1-8 分别映射到 app legacy、floor、repair、fee/report、guarded writes、admin P1/P2/P3、剩余 app legacy 等当前 backlog。
- 批次完成前必须同时满足：矩阵/任务状态更新、代码或阻断原因落地、相关测试/HTTP gate/页面证据记录、shadow-off/fallback/DB_READY/真实库样本/写入口闭环按适用性记录、独立复核完成、Memorix 写入完成。

## 5. 当前状态评估

### 5.1 tasks.md 总体进度

- 任务总数：464
- 已完成：437
- 未完成：27
- 完成率：94.18%

全部 27 项未完成均位于 §7（旧内置 Nitro 退役执行增补阶段），属于临门一脚工作。

### 5.2 未完成项分类

| 类别 | 数量 | 关键任务 |
|------|------|----------|
| admin 内置 Nitro 退役 | 4 | apps/admin/server dry-run、delete-candidate 升级、.env.production standalone 配置、最终删除 |
| app 内置 Nitro 退役 | 4 | apps/app/server dry-run、delete-candidate 升级、.env.production shadow-disabled 配置、最终删除 |
| apps/api 承接增强 | 4 | 补齐 15 个模块 fallback-only exact handlers、runtime-endpoints.ts 状态收敛、deterministic seed 迁移、readiness probe 扩展 |
| 测试/验证/文档 | 14 | DB_READY 复验、R2 live drill、apps/api 包级 build/test、生产 Network、shadow-off drill、最终 OpenSpec 校验、readiness 报告、Memorix 记录 |
| 其他 | 1 | 确认 D:/code/ruan-cat/01s-11comm-app 永久只读保留 |


### 5.3 当前工作树关键事实

- apps/app/server/ 已物理删除（2026-07-08 子代理清理），但 tasks.md 中对应 dry-run 与 delete-candidate 勾选尚未关闭。
- apps/admin/server/ 仍然存在。
- 当前 git 工作树有 84 个变更文件，主要为 apps/app/server/ 删除、apps/app/package.json 与文档清理、.github/workflows/app-ci.yml 更新。
- retirement-evidence-matrix.md 当前没有任何 delete-candidate 行；apps/admin/server 与 apps/app/server 仍为 blocked 或 keep-source。

### 5.4 已达成的重要前置

- apps/app 已移除自有 Nitro build/dev/preview/ci pipeline、nitro.config.ts、mock/test 对旧 server 的库化依赖、tsconfig.json 中的 server include。
- apps/admin 已移除 nitro.config.ts、drizzle.config.ts、旧 db:*/db:legacy:*/nitro:* 脚本、Vite Nitro plugin 接入。
- apps/api 已新增 seed CLI、readiness probe（含 upload 表与 R2 env 探针）、fallback 关闭开关、legacy dispatch fail-closed 测试。
- 大量 app legacy endpoint 已按小批次收口为 exact/guarded/readonly handler，但 fallback-only 尚未清零。

## 6. 是否应进入收尾？

**结论：当前阶段不应进入收尾。**

虽然整体完成率达到 94.18%，且 apps/app/server/ 已物理删除、大量配置入口已切换，但以下收尾条件尚未满足：

1. **OpenSpec 任务未关闭**：tasks.md 仍有 27 项 [ ] 未完成，全部位于退役执行阶段；openspec instructions apply 不会返回 all_done。
2. **目录级 evidence matrix 未升级为 delete-candidate**：retirement-evidence-matrix.md 仍标记 apps/admin/server 与 apps/app/server 为 blocked/keep-source。
3. **dry-run 与回滚证据缺失**：apps/admin/server 与 apps/app/server 的隔离 rename/delete dry-run 尚未执行并记录。
4. **生产验证缺口**：admin/app 生产 Network、shadow-off drill、R2 live drill、DB_READY 删除门禁复验均未完成。
5. **apps/api 承接仍在进行中**：15 个模块 fallback-only exact handlers、runtime-endpoints 状态收敛、deterministic seed 迁移、完整 readiness probe 尚未完成。
6. **最终报告与 Memorix 未记录**：legacy-nitro-retirement-readiness-report.md 尚未编写，最终结果未写入 Memorix。

## 7. 进入收尾还需满足的条件

必须按以下顺序补齐后，才可宣布本 longtask 进入收尾：

1. **关闭 §7C 承接增强任务**：
   - 按小批次补齐 15 个模块 fallback-only exact handlers（每批 2-3 个 endpoint）。
   - 收敛 runtime-endpoints.ts 状态为 exact/blocked/guarded/not-candidate。
   - 对 deterministic seed 模块明确 DB-backed 或 not-candidate 决策。
   - 扩展 readiness probe 覆盖关键 app legacy 表、seed sentinel、R2 env。

2. **完成验证矩阵**：
   - 本地和生产 GET /__nitro/ready 返回 DB_READY。
   - R2/upload live drill 完成并记录脱敏证据。
   - apps/api 包级测试通过：test:infra、指定 legacy/runtime/admin 测试套件、typecheck、build:node。

3. **完成生产环境验收**：
   - 重新读取三个 package homepage。
   - admin production Network 证明关键 list/detail/CUD/upload 命中 apps/api。
   - app production Network 证明 /app/**、/callComponent/** exact/guard/blocked 行为由 apps/api 承接。
   - admin/app shadow-off drill 证明关闭 shadow/fallback 后目标 endpoint 仍命中 apps/api。

4. **执行目录级 dry-run**：
   - 在隔离 worktree 或临时 rename 中分别 rename apps/admin/server 与 apps/app/server。
   - 运行 admin/app/api 引用扫描、typecheck、Vitest、build、OpenSpec strict、git diff --check。
   - 恢复目录名并记录回滚命令与结果。

5. **升级目录状态为 delete-candidate**：
   - apps/admin/server：route parity、DB/seed/R2、Nitro config、脚本、docs/generator、引用扫描、dry-run、页面 Network、回滚证据全部通过。
   - apps/app/server：mock/test/runtime/fallback/Nitro build 引用清零、fallback-only 全部处理、dry-run 通过、回滚路径明确。

6. **执行最终删除与验证（仅当 delete-candidate 通过后）**：
   - 删除 apps/admin/server/** 与 apps/app/server/**。
   - 删除后立即运行 admin/app/api 扫描和构建测试。

7. **最终文档与记忆**：
   - 编写 legacy-nitro-retirement-readiness-report.md。
   - 运行 openspec validate migrate-superpowers-docs-to-openspec-longtask --strict 与 openspec instructions apply --change migrate-superpowers-docs-to-openspec-longtask --json。
   - 将最终结果、提交范围和未推送状态写入 Memorix。

## 8. 结论

- **核心目标已明确并固化**：独立 apps/api 承接 admin/app 旧 Nitro 职责、Phase7 作为退役准备阶段、四条状态流独立跟踪、目录级状态机等要求已在 OpenSpec 工件中完整落地。
- **当前阶段为退役执行临门一脚**：前期迁移、审计、配置入口切换已基本完成（437/464 任务已关闭）。
- **尚未满足收尾条件**：27 项未完成全部集中在 §7 退役执行阶段，尤其是 apps/api fallback-only 收口、生产验证、dry-run、目录级 evidence matrix 升级和最终报告。
- **建议**：继续按 tasks.md §7A-§7E 推进，优先完成 apps/api 承接增强与生产验证，再执行 admin/app server 的 dry-run 与删除门禁。

## 9. 参考文件路径

- D:/code/ruan-cat/01s-11comm/openspec/changes/migrate-superpowers-docs-to-openspec-longtask/proposal.md
- D:/code/ruan-cat/01s-11comm/openspec/changes/migrate-superpowers-docs-to-openspec-longtask/design.md
- D:/code/ruan-cat/01s-11comm/openspec/changes/migrate-superpowers-docs-to-openspec-longtask/tasks.md
- D:/code/ruan-cat/01s-11comm/openspec/changes/migrate-superpowers-docs-to-openspec-longtask/retirement-evidence-matrix.md
- D:/code/ruan-cat/01s-11comm/openspec/changes/migrate-superpowers-docs-to-openspec-longtask/legacy-nitro-retirement-execution-plan.md
- D:/code/ruan-cat/01s-11comm/apps/admin/src/docs/reports/2026-07-08-openspec-tasks-unfinished-audit.md
- D:/code/ruan-cat/01s-11comm/apps/admin/src/docs/reports/2026-07-08-app-nitro-retirement-review.md
