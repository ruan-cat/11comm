# Agent Findings

本文中“后续”“仍需”“必须”“待归类”或 endpoint 相关表述只表示风险、禁止误判、冲突口径或历史事实边界，不构成执行顺序、endpoint backlog 或任务源；可执行项一律以 `tasks.md` 未完成 checkbox 为准。

本文件记录发现、风险、失败路径和不迁移原因，不记录可执行任务清单。

## 2026-05-24 任务比例纠偏发现

本轮纠偏发现，当前后续执行风险不是缺少更多 endpoint 探索，而是探索闭环和证据补强继续占据活跃任务池，导致真实 Nitro 迁移入口不够靠前。新增 `tasks.md` 的 `1D` 区块后，后续小批次应优先围绕 named endpoint 的 handler、adapter、manifest、caller、test、HTTP/browser/DB evidence 推进。

复核边界：`1D.1` 当前只保留 10 项 checkbox，比例为 6 项实施、2 项验证、1 项记录、1 项复核；`1D.2` 只保留动态补全纪律，不再记录 checkbox backlog。后续若发现缺失文件、测试或证据，只能按当前 named endpoint 回写到 `tasks.md` 本节或对应业务章节，不能把 `agent-progress.md` 或本文件变成第二任务树。

二次审计发现：只把首批压成 10 项仍不够，容易让后续代理继续沿旧 §2/§3/§4 顺序探索。已在 `tasks.md` 补强 §1D.3 证据术语、§1D.4 后续小批次滚动规则，并在 §2/§3/§4 章首增加局部门禁。后续执行必须先从 §1D 开批，再把有效事实回写到对应业务章节；不得直接按旧章节排列顺序执行。

证据边界：`1D` 是执行优先队列和动态补全纪律，不代表其中任何 endpoint 已经迁移完成；`docs/reports/2026-05-24-openspec-do-long-task-dynamic-tasks-design.md` 是增强 `ai-plugins` 源技能的实施文档，不是全局技能修改结果；`docs/superpowers/specs/2026-05-24-openspec-task-rebalance-design.md` 是任务树比例纠偏设计，不是新的 OpenSpec change 或第二任务源。

No-go：不得把本轮文档和任务结构调整写成 runtime 迁移、`DB_READY`、shadow-off/fallback 复验、写入口安全放行或旧服务可退役。后续若执行中发现缺失任务，只能回写 `tasks.md`，`agent-progress.md` 与 `agent-findings.md` 仍不得承载 checkbox backlog。

## Legacy Document Roles

- 三份旧 Superpowers 文档的细目、职责和历史用途已迁入 OpenSpec canonical：`design.md` 记录来源角色与压缩原则，`tasks.md` 记录唯一可执行 backlog，本文件记录历史 provenance、风险和证据索引。
- `docs/superpowers/phase7-openspec-migration-index.md` 是后续接力的稳定入口，指向 OpenSpec canonical、`tasks.md`、`agent-progress.md` 和本文件。
- 临时来源覆盖审计快照已经完成使命并被删除；后续不得恢复或维护第四份来源覆盖矩阵。
- 后续执行入口只能是 OpenSpec canonical：可执行 backlog 归 `tasks.md`，风险和禁止误判归本文件，checkpoint 归 `agent-progress.md`，架构和验收规则归 `design.md` 与 `specs/**`。

## Must Preserve

- 旧总设计的核心迁移目标：`apps/admin/server` 和 `apps/app/server` 的旧 Nitro API 责任逐步合并到独立部署的 `apps/api`。
- `apps/api` 是 admin 与 app 的唯一长期 Nitro API 服务目标。
- Phase7 是统一 Nitro API 迁移的退役准备阶段，不是孤立的 endpoint 数量统计阶段。
- admin legacy Nitro stream 与 app legacy/mock Nitro stream 必须分别跟踪；admin exact coverage 不能推导 app legacy 完成。
- `coverageKind`、`dataSourceStatus`、`targetStatus`、`browserEvidence`、`fallbackEvidence`、`dbReadinessEvidence`、`writeReadRollbackEvidence`、`retirementDecision` 的字段语义。
- `READY_CONFIGURED != DB_READY`。
- `legacy-fallback 200 != DB/repository 完成`。
- `canonical-only != old path exact covered`。
- `hook-level evidence != browserEvidence`。
- `local-dev browserEvidence != production browserEvidence`。
- `admin H5 evidence != app H5 evidence != API server evidence`。
- 当前 no-go-for-retirement 状态。
- 受保护路径：`apps/admin/server`、`apps/app/server`、`D:\code\ruan-cat\01s-11comm-app`。
- Neon main 验收规则：不使用 Neon 测试分支；`RUN_PHASE7_DB_READINESS_CHECK=1` 且 `/__nitro/ready` 返回 `DB_READY` 才能记录 DB_READY。
- Neon/Drizzle 使用规则：DB-backed repository/service 必须使用 Drizzle 与 `@01s-11comm/type` 的 schema/table/type，`apps/type/src/business/**/schema.ts` 是业务 schema 事实源；禁止把旧 admin 私有 schema、旧 app in-memory 或本地 fake DB 写成生产数据库能力。
- 写入口闭环：guard-before、controlled write、read-back、rollback/cleanup、residual check、guard-after。
- Vitest 规则：运行时代码变更必须补 `*.test.ts` 或记录不可写原因；测试使用 `describe` 与 `test`，从 `vitest` 导入断言工具；Vitest 不能替代 Neon main `DB_READY`、真实库样本、写入读回回滚或旧服务退役门禁。
- Chrome MCP 三端双环境规则：admin H5、app H5、API server 必须分别在 local-dev 和 production 记录；local-dev 覆盖 `apps/api`、`apps/admin`、`apps/app` 三个 dev 服务，production 地址必须从三个 package 的 `homepage` 字段重新读取。

## Known Current Gaps

- 2026-05-19 初版 OpenSpec 迁移过度聚焦 Phase7 证据门禁，未充分呈现“admin/app 两套旧 Nitro API 合并到独立 `apps/api`”的上层主线；已补 `unified-nitro-api-consolidation` spec、设计四流模型和索引说明。
- 2026-05-19 二次复核发现 `tasks.md` 仍错误表现为 43/43 已完成，只覆盖文档载体迁移，没有承接旧计划 P0-P8 的后续 Nitro 合并任务；已重写为长期 backlog。
- 旧三文档曾由用户手动恢复用于核对；2026-05-20 已在完成核心语义转写、引用扫描和 OpenSpec 入口收敛后删除。删除只代表文档载体退场，不代表 `apps/admin/server`、`apps/app/server` 或旧 app 源目录退役。
- 旧矩阵存在冲突口径：同一文件既写 admin old path exact coverage 155/155，又在末尾风险中残留“未覆盖 exact legacy path 约 51 个”的旧说法。后续必须 fresh scan 后更新事实，不得直接照抄旧数字。
- 后续接力必须同时看 admin legacy stream、app legacy stream、unified `apps/api` runtime stream、retirement gate stream。
- 生产 `DB_READY` 仍未闭环。
- 真实库样本复核仍未闭环。
- shadow-off/fallback 页面演练仍未闭环。
- 真实页面 CRUD/交互证据仍未闭环。
- `property-manage/contract-manage` 12 个普通 list endpoint 已由 task77-task80 补本地 runtime manifest/contract/gated HTTP test 条目；upload/R2、写入、删除、detail 和页面/生产证据继续单独评审。
- app legacy 后续仍需 `/callComponent/**`、floor、repair、fee/report、guarded writes、remaining modules、client-only gap 和 server-only endpoint 调度。
- 2026-05-19 specs 中文化与细化前，7 个 spec 多数只写门禁概念，缺少 Nitro 接口迁移的实施规则。已补充 `apps/api` 模块组织、admin 三级业务路径、contract-manage 下一切片、R2/upload、app legacy 各类端点、DB_READY、写入口闭环、状态升级和目录退役前提。
- 2026-05-19 用户追问后发现：app Nitro 迁移和 Neon 使用已有部分说明，但实现边界仍不够具体；Vitest 触发时机、文件位置、写法和测试/运行时证据边界没有独立 spec。已补 `app-legacy-cutover`、`db-readiness-and-write-verification`，并新增 `vitest-and-runtime-verification`。
- 2026-05-19 用户追问后发现：Chrome DevTools MCP、本地三 dev 和三个生产环境验收只散落在任务和旧文档口径中，OpenSpec 没有独立规范三端双环境矩阵。已新增 `browser-and-environment-verification` spec，并在 `tasks.md` 增加 4A 验收任务。
- 2026-05-19 重新扫描当前 working tree：`apps/api/server/routes/api` 160、`apps/admin/server/api` 155、`apps/app/server/modules` 56、`apps/api/server/shared/runtime` 11；调用端方面 `apps/admin/src` 的 `/api/` 命中 437，`apps/app/src` 的 `/app/` 或 `/callComponent/` 命中 640。后续 baseline 必须以 fresh scan 为准，而不是旧矩阵末尾的过期口径。
- 2026-05-19 扩展 `tasks.md` 时确认旧数量口径不能直接当 endpoint 清单：`dev-team/config-manage` 旧“16”是四个子模块 CRUD 方法，当前 legacy 文件树是 20 个文件；`setting-manage/system-manage` 旧“15”是五个子模块 CUD 方法，当前 legacy 文件树是 20 个文件；`expense-manage` 旧 Phase7 list 口径是 14 个，当前 legacy list 文件是 16 个；`report-manage` 旧 Phase7 list 口径是 12 个，当前 legacy list 文件是 13 个。后续状态升级必须同时说明历史口径和当前文件口径。
- 2026-05-19 扩展 `tasks.md` 时确认 app remaining modules 不能继续压缩为模块桶；`apps/app/server/modules/**/endpoints.ts` 中的 activity、contact、notice、oa-workflow、profile、staff、test、video 等模块此前在压缩清单里体现不足，已改为显式 URL 级待归类任务。
- 2026-05-19 再次补全 `tasks.md` 时确认：endpoint 行本身仍不足以支撑旧服务安全退役，还必须有 spec-to-task traceability、统一 `apps/api` runtime 对账、批次调度纪律、admin/app 调用端差集、Vitest/HTTP gate、Neon schema/DB_READY、写入闭环和三端双环境证据矩阵。已新增 §1A、§1B、§1C、§2A、§3A、§4B、§4C，并扩展 §5。
- 2026-05-19 任务载体边界再次确认：`agent-progress.md` 不应记录未执行的 Nitro 迁移任务，只能写 checkpoint 和验证结果；本轮补任务源时只在 `tasks.md` 增加 future backlog。
- 2026-05-20 用户纠正迁移目标：当前缺口不是“引用没替换”或“旧文件没删除”，而是必须把旧三份大文档的核心长文本内容转写成 OpenSpec format。后续验收应按语义覆盖判断，而不是按旧路径扫描是否为空判断。
- 2026-05-20 已新增 `legacy-superpowers-content-transcription` spec，用于约束旧总设计、旧 endpoint 矩阵和旧 batch 计划的核心内容转写完成定义；它是删除旧三文档前的语义覆盖闸门。
- 2026-05-20 三名只读审计子代理共同指出：旧总设计仍需 Phase1/1.1 细则、Phase2/3 边界、CI/workflow、runtime governance；旧矩阵仍需默认值、ledger 字段、admin 小片事实、app fallback 红线、Windows/CDP gotcha；旧计划仍需 Agent Team 产出、Batch0 fresh scan gate、Batch0-8 具体映射、batch done definition、复核清单和 Neon main checklist。上述缺口已转写进对应 specs，但删除旧文件前仍需 final strict validate 与引用扫描。
- 2026-05-20 删除前语义覆盖复核结论：旧总设计落入 `legacy-superpowers-content-transcription`、`unified-nitro-api-consolidation`、`source-history-and-memory-governance`、`vitest-and-runtime-verification`、`db-readiness-and-write-verification` 和 `retirement-gate-and-archive`；旧矩阵落入 `phase7-evidence-model`、`admin-api-cutover`、`app-legacy-cutover` 和浏览器/进度/发现记录；旧计划落入 `agent-team-batch-execution`、`tasks.md` 和 Neon main/write verification 规则。
- 2026-05-20 当前重要负清单：`report-manage/expense-summary-table/list`、P1 `report-manage` 剩余 7 页、App repair 三个只读端点已有本地页面 Network 或等价本地 evidence，不应重复作为本地页面待补；但这些证据仍不能写成 production DB_READY、真实库样本、shadow-off/fallback、写入闭环或旧服务可退役。
- 2026-05-20 历史 Batch7a 与 2026-05-19 admin 小片 manifest/HTTP gate 都只能作为 local/runtime/contract evidence；不能自动代表生产 DB_READY、真实库样本、shadow-off/fallback 或退役候选。
- 2026-05-20 工作区纪律：旧矩阵曾记录工作区混有 staged/前序变更，后续任何批次必须先 `git status --short`，不得 stage/unstage/revert 非本轮范围。
- 2026-05-20 编辑子代理 D 复核发现：当前旧三文档转写记录已经覆盖主要语义，但仍需要一个明确的二次复核框架来防止“章节级漏转写”。已补入 `legacy-superpowers-content-transcription` 闸门和 `tasks.md` 任务块；后续探索/复核成员必须按旧总设计、旧 endpoint 状态矩阵、旧 batch 执行计划逐文档、逐章节、逐落点核对，未映射章节只能记为待收敛风险，不能写成已完成迁移。
- 2026-05-20 编辑子代理 D 明确边界：旧文件名可以继续出现在稳定索引、design 或 findings 中作为 historical source/provenance，但不能作为执行入口、任务源链接或长期维护对象。若后续发现旧文件名被用于“去读旧文档继续执行”，必须记录为引用治理缺口并改回 OpenSpec canonical。
- 2026-05-20 本轮二次复核框架只修改 OpenSpec 文档和接力记录，没有恢复三份旧文档，没有删除、移动、归档、重命名或清空 `apps/admin/server`、`apps/app/server` 或 `D:\code\ruan-cat\01s-11comm-app`；不得把本轮文档闸门收敛误读为 runtime 旧服务可退役。
- 2026-05-20 复核成员 E 判定旧语义仍缺口后，编辑子代理 F 已补强：旧总设计 Phase5 `L0-L4` 和 `houseCharge` 只作为历史 CRUD 分级/样板，Phase6 是 `VITE_11COMM_API_SHADOW_ENABLE`、`VITE_11COMM_API_USE_PROXY`、模块 allowlist 或等价配置驱动的受控切流与 fallback/shadow-off 复验，不是旧服务退役；动态 mock 增量同步只能记录 mock/fallback/local evidence；Batch7a 只能作为 historical local/runtime/contract evidence；retirement ledger 未落 endpoint 行不得升级退役候选；admin 收费/缴费证据不得推导 app 缴费 legacy 完成。本轮没有修改运行时代码。
- 2026-05-20 复核成员 G 对 F 的补强结果给出通过结论：Phase5 `L0-L4`/`houseCharge`、Phase6 shadow/proxy/fallback 顺序、动态 mock 增量同步、Batch7a 历史证据、retirement ledger 物化维护、admin/app 缴费双端边界均已有 canonical 落点；旧文件名仍只作为 provenance，`agent-progress.md` 和本文件未承载任务树。本结论只证明旧三文档语义转写补强完成，不证明 runtime 迁移、生产 `DB_READY`、真实库样本、shadow-off/fallback 或旧服务退役完成。
- 2026-05-20 第三轮 agent team 反向审计记录：H、I、J 均判定 PASS，无必须补写缺口；K 的本轮改动只处理建议级缺口，补强旧总设计 Phase4+ 示例边界（`repair/resource/parking`、`charge-machine/open-door`、`machine-record` 等）、单一汇总报告约 3500 行以内的软约束、do-long-task checkpoint 接力术语和 Batch0-8 到当前 backlog 的搜索索引。该 PASS 与 K 的补强只证明 OpenSpec 文档口径更完整，不代表 runtime 迁移、生产 `DB_READY`、真实库样本、shadow-off/fallback 或旧服务退役完成。
- 2026-05-20 本轮 F 会话没有暴露 `mcp__memorix__*` 工具，无法执行项目范围 Memorix 搜索或写入；这是会话环境缺口，不代表项目没有历史记忆。后续主代理具备 Memorix MCP 时需补写本轮摘要。
- 2026-05-20 task 54 复核发现：原显式 traceability 行只列出 8 个 spec，容易漏掉 `admin-special-cases`、`phase7-evidence-model`、`source-history-and-memory-governance`、`legacy-superpowers-content-transcription` 四个同属 `specs/**/spec.md` 的 Requirement 来源；探索成员 A 进一步指出 Phase1 app 快照范围、Phase2/Phase3 边界、Phase5 `L0-L4`/`houseCharge`、Phase6 shadow/proxy/fallback、Batch7a、Batch0 fresh scan、batch done definition、Windows dev gotcha、CI/workflow、默认 guard `409`、写入失败停止、admin manifest 最低字段和 admin/app 缴费边界必须有任务落点。已在 `tasks.md` 补 traceability note，并由复核成员 E 审批通过；这些补充只证明任务落点完整，不证明 runtime 迁移、生产 `DB_READY`、真实库样本、shadow-off/fallback、写入闭环或旧服务退役完成。
- 2026-05-20 task 56 复核发现：`agent-progress.md` 本体没有 markdown checkbox 或任务树，且开头明确 `tasks.md` 是唯一任务源；但复核成员 D 指出原“当前负清单”式 checkpoint 容易被误读为 Nitro endpoint backlog。已将该条改为“当时 checkpoint 摘要/历史状态摘要”，并明确它不构成可执行后续项、endpoint backlog 或任务源，后续可执行项一律以 `tasks.md` 未完成 checkbox 为准。该收敛只证明 `agent-progress.md` 的任务源边界清晰，不证明 runtime 迁移、生产 `DB_READY`、真实库样本、shadow-off/fallback、写入闭环或旧服务退役完成。
- 2026-05-20 task 57 复核发现：`agent-findings.md` 本体没有 markdown checkbox、待办标记或独立任务树；但探索成员 A/B 指出“后续/仍需/必须/待归类”与 endpoint 相关语气可能被误读为可执行 backlog。已在文件顶部补充全局边界声明，明确这些表述只表示风险、禁止误判、冲突口径或历史事实边界，不构成执行顺序、endpoint backlog 或任务源；可执行项一律以 `tasks.md` 未完成 checkbox 为准。该收敛只证明 `agent-findings.md` 的任务源边界清晰，不证明 runtime 迁移、生产 `DB_READY`、真实库样本、shadow-off/fallback、写入闭环或旧服务退役完成。
- 2026-05-20 task 58 复核发现：`tasks.md` 中保留的“剩余模块”“数量块”“压缩桶”“模块桶”和 `remaining modules` 表述必须被解释为历史口径或索引，不能作为可执行清单。已补强：Batch8 指向 `§3.5 Remaining App Modules`；admin 数量口径指向 §2.1/§2.2 显式 endpoint 行并给出 `rg --files apps/admin/server/api/property-manage apps/admin/server/api/dev-team apps/admin/server/api/setting-manage` fresh scan；app remaining modules 指向 §3.5 URL 台账并给出 `rg -n -- "/app/|/callComponent/|/test" apps/app/server/modules --glob "endpoints.ts"` fresh scan；server-only 新增项必须补显式 URL 行或写明无法展开原因，不得用模块桶结算。该收敛不证明任何 runtime 迁移、生产 `DB_READY`、真实库样本、shadow-off/fallback、写入闭环或旧服务退役完成。
- 2026-05-20 task 60 复核发现：本会话暴露 Memorix MCP，主代理已在继续前完成两次项目范围检索。第一条检索旧三文档/canonical 消化语境，命中 `obs:4433`、`obs:4435`；第二条检索 Phase7、Nitro 合并、`DB_READY`、Chrome MCP、旧三文档迁移和当前 task 60 语境，命中 `obs:4433`、`obs:4364`、`obs:4424`。无需记录当前会话 Memorix 环境缺口；该收敛不证明 runtime 迁移、生产 `DB_READY`、真实库样本、shadow-off/fallback、写入闭环或旧服务退役完成。
- 2026-05-20 task 61 复核发现：状态变更后已写入 Memorix `#4439`，其中包含变更文件、任务源变化、验证命令和剩余阻断项/no-go 边界。该记录只证明本轮 task 60/61 文档和记忆沉淀完成，不证明任何 endpoint runtime 迁移、生产 `DB_READY`、真实库样本、shadow-off/fallback、写入闭环或旧服务退役完成。
- 2026-05-20 task 113 route inventory 发现：`apps/api` route tree 有 160 个文件，其中 admin legacy 155 个旧 `/api/**` 文件均有同路径 `apps/api` route，但 `apps/api` 额外存在 `expense-item-setting/{create,delete,detail,update}` 与 `house-charge/detail` 5 个 fee route；task77-task80 后 `contract` 的 12 个普通 list route 已有本地 manifest/test/HTTP gate 条目，但其余 13 个非 list/upload/CUD/detail route 仍不得升级为 manifest covered；app legacy 只有 `fee`、`repair`、`floor` 共 21 个显式 registry 定义，剩余 app legacy path 仍是 fallback-proxy 候选而非已迁移 endpoint。
- 2026-05-20 task 113 复核修正：独立复核指出 route inventory 必须有完整逐 route 明细。已新增 `route-inventory-details.csv.md`，并把 `manifestPhase/manifestStatus` 直接落到 160 条 route 行上；其中 `manifest-missing` 明确覆盖 `contract`、`dev`、`setting`、`debug` 和 `j1-dashboard`，防止后续把 route file 存在误判为 runtime manifest 覆盖。
- 2026-05-20 task 114 模块分层审计发现：`module-layering-audit.md` 已逐 domain 记录七层结构。`fee` 与 `repair` 同时有 admin/app legacy adapter，`floor` 是 app legacy-facing 且缺 `admin-adapter.ts`；`community`、`contract`、`dev`、`house`、`operation`、`parking`、`patrol`、`setting` 具备 admin 基础分层但缺 `legacy-adapter.ts`。`contract` 有 route/runtime/service/repository/admin adapter 但 `runtimeEndpointManifest` 中 `contract` owner 为 0；`dev` 与 `setting` 也属于 route/module 存在但 manifest 缺口。app legacy executable registry 仍只覆盖 `fee`、`repair`、`floor` 21 条，fallback proxy 不能升级为显式迁移。
- 2026-05-20 task 114 handler 边界发现：未发现 `apps/api/server/routes/api` 中直接堆 Drizzle/Neon 查询；但 `property-manage/repairs-manage/{return-visit,phone-report-repairs,mandatory-return-issue}/list.post.ts` 直接取 `service`，并在 handler 内做 `result.list.map(...)`、`communityId: "COMM_001"`、分页响应与兼容字段拼装，应记录为 DTO/compat 逻辑未下沉到 `repair/admin-adapter.ts` 的结构缺口。`debug-env.get.ts` 与 `j1-dashboard/center/commonmenu/get.ts` 绕过 module runtime，只能作为诊断/占位例外或 edge route 风险，不能纳入业务迁移完成率。
- 2026-05-20 task 115 Nitro/H3 与鉴权审计发现：`apps/admin/server`、`apps/app/server`、`apps/api/server` 未发现直接 `from "h3"`、`from 'h3'`、`require("h3")` 或动态 `import("h3")`；`nitro/h3` 命中文件数为 350。未发现 `@neondatabase/auth`、`jsonwebtoken`、JWT 校验、`Authorization`/`Bearer` 解析、`authMiddleware`、`requireAuth`、`verifyJwt` 或 `verifyToken` 等 Nitro 运行时鉴权实现。误报包括 `apps/admin/package.json` 的历史 `jose` 依赖、`apps/admin/server/middleware/1.logger.ts` 日志中间件、`apps/admin/server/utils/sensitive-data.ts` 的 `maskToken` 脱敏工具，以及 `@neondatabase/serverless` 数据库驱动；这些均不得被升级为鉴权实现或迁移完成证据。
- 2026-05-20 task 116 数据库连接作用域审计发现：`apps/api/server` 未发现业务模块、route、repository、service 或 shared 模块顶层直接创建 Neon/Drizzle 连接；唯一 `drizzle(neon(url), { schema })` 位于 `apps/api/server/db/index.ts` 的 `useDb(event)` 函数内，并缓存到 `event.context.db`。各 module runtime 通过 `{ db: useDb(event) }` 注入 repository；`apps/api/server/shared/runtime/env.ts` 只解析连接串来源，不创建连接。旧 `apps/admin/server/db/index.ts` 仍保留 legacy `_db/getDb()` 与 `process.env` 回退路径，属于 source-side historical risk；`apps/app/server` 未发现 DB 连接创建命中。该审计不得被写成生产 `DB_READY`、真实库样本、写入口闭环或旧服务退役完成。
- 2026-05-20 task 116 误报边界：`apps/api/server/modules/*/runtime.ts` 的顶层 `fallbackRuntime` 是 in-memory fallback runtime，不是 Neon/Drizzle 连接，也不能作为 DB-backed 完成证据；`probeDatabaseReadiness(useDb(event))` 是 ready handler 内调用既有 helper，不是 route 顶层创建 DB；旧 admin `const db = useDb(event)` 是 helper 使用，不应误报为模块顶层连接创建。
- 2026-05-20 task 117 contract boundary 审计发现：`fee` 与 `repair` 是当前 `apps/api` 中同时服务 admin canonical 与 app legacy 的主要 domain；它们共用核心 repository/service，但 runtime 分别装配 `adminAdapter` 与 `legacyAdapter`。`adminAdapter` 使用 `adminSuccess` 和 `JsonVO/PageDTO`，`legacyAdapter` 使用 `legacySuccess/legacyFailure` 并保持 `{ code, msg, data }` envelope。`floor` 当前只有 app legacy-facing equivalent，没有 admin adapter，不得写成 admin canonical 完成。反向扫描未发现 app legacy adapter/endpoints 使用 `adminSuccess|adminFailure|JsonVO|PageDTO`，也未发现 admin route 使用 `legacySuccess|legacyFailure|LegacyResponse`。
- 2026-05-20 task 117 风险边界：`response-builder.ts` 同时定义 admin 与 legacy builder，`runtime-endpoints.ts` 同时包含 admin/app manifest，因此关键词命中必须看调用方和 manifest 字段；`legacy-dispatch` fallback 会原样返回旧 app fallback body，这不代表 fallback 旧服务 envelope 已完整验收。`repair` 仍有 3 个 admin route 在 handler 内直连 service 并拼装 `adminSuccess`，这是分层风险而非 admin/app 契约混用阻断；`fee` legacy 写/支付结果可能包含 legacy-shaped data 再被 `legacySuccess` 包裹，属于 app contract fidelity 风险，不是 admin DTO 覆盖。
- 2026-05-20 task 118 schema wiring 审计发现：`apps/api/server/modules/**/repository.ts` 中当前实际用于 `db.from()`、`db.insert()`、`db.update()` 或 `db.delete()` 的业务表符号均从 `@01s-11comm/type` 导入，并可反链到 `apps/type/src/business/**/schema.ts` 的 Drizzle table、Zod schema 和 TypeScript 类型；本轮未发现 repository-used table 的 `schema-missing`。这只支持 `db-read-repository-wired-with-gap` 或同等 gap 口径，不能升级为 `db-ready`、生产 `DB_READY`、真实库样本通过、shadow-off/fallback 完成、写入闭环完成或旧服务退役。
- 2026-05-20 task 118 保留 gap：`contract-upload` 的 `ctUploadSessions`/`ctUploadSessionParts` schema 已存在但 upload init/sign/complete/abort/status 仍为 mock/R2 未接，保持 `schema-exists-not-wired`；`fee` legacy payment/write 中 `exPayments` 等 schema 存在但 `createNativeQrcodePayment()`、`writeOweFeeCallable()`、`saveRoomCreateFee()` 仍走 fallback/guarded write，保持 `schema-exists-not-wired` 或 `non-db-or-fallback`；`repair` 的 `rpReturnVisits`、`rpMandatoryReturnIssues`、`rpPhoneRepairReports` 等 schema 存在但相关 list/write/appraise 路径仍有 service 直连、compat DTO、`COMM_001` 默认或 guarded fallback，不能写成 DB 完成；未归类 app legacy modules 继续保持 `unknown-needs-triage`。
- OpenSpec delta parser 要求每个 requirement 正文包含英文 `MUST` 或 `SHALL`。specs 保留中文正文，并在正文中保留 `MUST` 以满足 CLI；不得把 OpenSpec 结构关键字翻成中文。
- PowerShell `Set-Content -Encoding UTF8` 会写入 UTF-8 BOM 和 CRLF，曾导致 OpenSpec 无法解析 specs delta。已改用无 BOM UTF-8 + LF 写回；后续修改 specs 后需检查 `openspec validate`。

- 2026-05-20 task 119 status evidence field gate 审计发现：`route-inventory.md` 的 `cutoverStatus` 与 `route-inventory-details.csv.md` 的 `manifestStatus` 只是 inventory 标签，不是正式 `coverageKind`、`targetStatus` 或 `retirementDecision`；`schema-wiring-audit.md` 只支持 `dataSourceStatus` 的 gap 口径，不能单独支持生产 `DB_READY`、fallback ready、写入闭环或退役。任何 status upgrade 必须同时填写或引用 `coverageKind`、`dataSourceStatus`、`targetStatus`、`browserEvidence`、`fallbackEvidence`、`dbReadinessEvidence`、`writeReadRollbackEvidence`、`retirementDecision`，字段不全时只能保持保守状态。
- 2026-05-20 task 119 no-go：不得用 route 文件存在、manifest 命中、HTTP 本地通过、单元测试通过、mock 数据、schema table 存在或 repository import 反链来替代完整 status evidence；不得把 `READY_CONFIGURED-only` 写成生产 `DB_READY`；写入口必须有 guard/write/read-back/cleanup/guard-after 证据，否则保持 `pending`、`guarded` 或 `blocked-for-execution`；`targetStatus` 与 `retirementDecision` 必须分开记录。
- 2026-05-20 task 120 runtime evidence alignment 审计发现：`/__nitro/health`、`/__nitro/ready`、runtime manifest、contract tests、HTTP gate 与 browser/API evidence 是不同层级证据，只能按 endpoint/method/path/response contract/environment/data source 对齐后组合使用，任一层单独存在都不能升级完整覆盖、生产 `DB_READY`、真实库样本、shadow-off/fallback、写入闭环或旧服务退役。
- 2026-05-20 task 120 no-go：route file 存在但 runtime manifest 缺失时只能保持 `canonical-only` 或 `unknown-needs-triage`，不得写成 `old-path-exact-covered`；`READY_CONFIGURED` 不能冒充 `DB_READY`；contract test 或 HTTP 200 不能冒充 Chrome MCP browserEvidence；local-dev evidence 不能外推为 production evidence；`contract`、`dev`、`setting`、`debug`、`j1-dashboard` 等 `manifest-missing` 行不得升级为 manifest covered。
- 2026-05-20 task 128 调度 no-go：后续 batch 启动声明不是完成证据，只是实施前 guard。不得一次性吞掉 admin、app legacy、DB/write 或 retirement 整域；不得在没有明确 endpoint 或业务路径列表时实施；不得把 owner 文件、目标 `apps/api` route/manifest/adapter/caller 文件、预期测试和 DB/浏览器/生产证据需求留空后继续动手；不得越过本批声明去触碰 upload/R2/CUD/write/detail/retirement 或无关范围；不得把 local、contract、HTTP gate、historical Batch7a 或启动声明本身升级为 production `DB_READY`、真实库样本、shadow-off/fallback 完成、写入闭环或旧服务退役候选。

## Source Re-Audit Findings

- 2026-05-19 独立子代理复核确认：旧总设计的核心任务是 `apps/admin/server` 与 `apps/app/server`/旧 app 项目中的旧 Nitro 职责合并到独立 `apps/api`，Phase7 只是这条主线的退役准备阶段。
- 2026-05-19 独立子代理复核确认：旧计划 §2、§12、§13 的 Agent Team 模型、每批固定流程、批次拆分和复核清单此前没有 spec 化；已新增 `agent-team-batch-execution`。
- 2026-05-19 独立子代理复核确认：旧总设计 Phase1.1 的 Markdown 文档迁移、skills/AI 记忆、Memorix 项目身份、敏感信息、字符集和动态 mock 文档同步此前承接不足；已新增 `source-history-and-memory-governance`。
- 2026-05-19 独立子代理复核确认：OpenSpec 原先缺少 git hash 级 provenance；已在本文件写入关键提交表。
- 2026-05-19 独立子代理复核确认：OpenSpec 原先缺少 `.tmp/phase7-dev-browser/**` 和 `.tmp/phase7-agent-reports/**` 证据 artifact 集中索引；已在本文件写入 artifact index。
- 2026-05-19 独立子代理复核确认：`agent-progress.md` 中“旧三文档已删除”的陈旧表达会误导后续接力；已修正为“用户已恢复，当前只作迁移来源/核对材料”。
- 2026-05-19 编辑子代理 B 复核确认：临时来源审计中值得长期保留的是 provenance 线索、Memorix lookup、artifact evidence、禁止误判和临时审计边界；旧文档章节覆盖大表不应原样迁入 canonical。

## Canonicalized Source Audit Summary

- 来源角色：旧 endpoint 矩阵提供证据字段、状态字段、扫描快照、当前口径和禁止误判；旧 batch 计划提供 Agent Team 调度、P0-P8 批次、每批固定流程和复核门槛；旧总设计提供唯一 `apps/api` 架构、Phase1-7 阶段链、文档/AI 记忆治理、Vitest、Neon main 和退役门禁。
- OpenSpec 落点：执行项进入 `tasks.md`；统一 API 主线进入 `unified-nitro-api-consolidation` 与 `design.md`；app/admin cutover 进入对应 specs；DB、Vitest、浏览器验收、Agent Team 与来源治理分别进入 `db-readiness-and-write-verification`、`vitest-and-runtime-verification`、`browser-and-environment-verification`、`agent-team-batch-execution`、`source-history-and-memory-governance`。
- 压缩决策：旧矩阵大表不逐字复制；只有 endpoint 级 backlog、明确差集调查、风险说明和证据索引进入 canonical。历史批次流水只能解释来源，不能自动继承为完成事实。
- 退场边界：临时来源覆盖审计快照完成迁移后已删除；后续 agent 不应继续要求同步维护它，也不得恢复成长期任务源。

## Git History Provenance

| 提交                               | 旧文件    | 结论                                                                                                                      |
| ---------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------- |
| `2af48327`                         | 总设计    | 创建 app 迁入与唯一 API 设计，确立 `apps/api` 目标和 `apps/type` 事实源。                                                 |
| `dd6c5078`、`cc50fec0`、`edc7a693` | 总设计    | 细化文档治理、字符集、AI 记忆和 Memorix 保全。                                                                            |
| `024c4785`                         | 总设计    | 补充 app 迁移自测与 Vitest 验收方案。                                                                                     |
| `22da5b95`                         | 总设计    | 补充 Phase6 计划与 Phase7 门禁。                                                                                          |
| `611c5f99`                         | 计划      | 创建 Phase7 分批计划，定义 Batch 0-6 与 Agent Team 执行框架。                                                             |
| `828a019e`                         | 矩阵/计划 | 创建 endpoint 矩阵和批次矩阵，明确证据字段和 delete-candidate 禁止升级。                                                  |
| `cf85abbd`                         | 三文件    | 引入 Neon main `DB_READY` 与写入闭环。                                                                                    |
| `e3b377fa`                         | 三文件    | 重写当前接力口径，压缩流水事实。                                                                                          |
| `058a9680`、`0a68f7d7`、`b3c94e2f` | 计划      | 记录 Chrome MCP 44/44、本地 Neon main `DB_READY`、shadow-off/fallback 44/44；均不得自动升级为生产 DB_READY 或旧服务退役。 |
| `1969bbac`                         | 矩阵/计划 | 记录 CRUD/CUD DB、HTTP gate 和 Upload R2 评审。                                                                           |
| `04a8e56c`                         | 三文件    | 同步 expense-summary、report-manage 和 App repair evidence。                                                              |
| `6bf1dbc2`                         | 三文件    | 同步 2026-05-19 admin list manifest/contract/HTTP gate 和 contract-manage 下一片。                                        |

## Memorix Lookup Index

- `#4152`：Neon main 验收口径；只能作为 DB readiness 规则来源，不能代替本轮生产 `DB_READY`。
- `#4217`、`#4218`、`#4220`、`#4221`：Phase7 resolver、readiness/browser/fallback 边界、handoff 文档和 no-go gotcha。
- `#4260`、`#4263`、`#4267`、`#4273`、`#4276`、`#4277`、`#4282`、`#4289`、`#4290`：operation/expense/report/browser/dev gotcha 链路，均为历史证据索引。
- `#4301`：Phase7 Chrome MCP final verification 44/44 PASS，属于 local evidence。
- `#4367`：report-manage remaining pages verified，属于 local admin browser evidence。
- `#4373`：Chrome MCP transport blocked；若使用 CDP fallback，必须写 fallback evidence，不能写 MCP 完成。
- `#4375`、`#4376`、`#4377`：App repair H5 CORS block、evidence docs 和 session completion；仍缺 production DB_READY、真实库样本、shadow-off/fallback 和 `/app/repairSetting.listRepairSettings` 单独页面证据。
- `#4405`-`#4409`：本次 OpenSpec 迁移修复过程的记录。

## Artifact Evidence Index

- `.tmp/phase7-dev-browser/2026-05-16-final-batch-page-network-verification.log`：local final batch page/API shadow 44/44 PASS。
- `.tmp/phase7-dev-browser/2026-05-16-final-batch-shadow-verification.log`：local shadow-off/fallback 44/44 演练。
- `.tmp/phase7-dev-browser/2026-05-16-crud-batch-http-gate-verification.log`：47 个 CRUD/边缘 route HTTP gate。
- `.tmp/phase7-dev-browser/2026-05-18-report-manage-remaining-page-network-verification.md`：7 个 report-manage 页面 Network。
- `.tmp/phase7-dev-browser/2026-05-18-report-manage-remaining-http-gate.log`：report-manage HTTP gate。
- `.tmp/phase7-dev-browser/2026-05-18-app-repair-readonly-h5-network-verification.md`：App repair 只读 H5 页面 Network；如本轮无法确认 MCP transport，应按 CDP/fallback 证据谨慎使用。
- `.tmp/phase7-agent-reports/**`：子代理历史报告；有效事实必须迁入 OpenSpec canonical 后才可用于接力。

## Reference Risks

- 三份旧文档曾被 prompt、历史计划、汇总报告和设计文档交叉引用。
- 2026-05-19：已提供稳定迁移索引 `docs/superpowers/phase7-openspec-migration-index.md`。
- 2026-05-20：删除后三份旧文件本体不再存在；旧文件名扫描只剩 `docs/superpowers/phase7-openspec-migration-index.md` 和 OpenSpec `design.md` 的迁移来源说明。
- 当前 OpenSpec change 与稳定索引内仍保留旧文件名，用于说明迁移来源、删除对象和历史发现；这不是外部死链，也不是执行入口。
- `proposal.md`、`design.md`、`tasks.md` 与本文件已改为指向 OpenSpec canonical，不再把旧三文档或临时来源覆盖审计文件当作执行源。

## Deletion Notes

- 旧 endpoint 状态矩阵、旧 Phase7 batch 计划和旧 monorepo API 迁移总设计曾在前一轮被删除后由用户恢复；本轮按用户要求完成核心内容转写后再次删除。
- `docs/superpowers/phase7-openspec-migration-index.md` 是后续文档侧稳定入口。
- 后续执行入口必须是 `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/tasks.md`。
- 本次没有修改运行时代码、数据库 schema、部署配置或 package dependency。

## Failed Or Blocked Attempts

- 2026-05-19：尝试创建 date-prefixed OpenSpec change `2026-05-19-migrate-superpowers-docs-to-openspec-longtask` 失败，CLI 报错 change name must start with a letter。已改用合法名称 `migrate-superpowers-docs-to-openspec-longtask`。

## Task 129 No-Go Findings

2026-05-20：task129 只固化调度颗粒度，不是 runtime 迁移证据。后续 admin 批次必须以 `apps/admin/src/router/rank/rank-route-keys.ts` 的三级业务路径为 canonical 坐标，不得凭空新建业务路径，不得一口气整域迁移；同一路径下超过 3 个 endpoint 时必须继续按 ordinary list、upload/R2、CUD/detail、edge endpoint 或紧密 endpoint 小组拆分，且不得把 upload/R2/write/delete/detail 与 ordinary list 混在同一普通 list 批次。app legacy 批次每次只能处理 2-3 endpoints 或一个小模块，可按 `/callComponent/**`、floor、repair、fee/report、guarded write、remaining app module 拆分；本调度项不得被当成端点 runtime 迁移完成、`DB_READY`、shadow-off、fallback 移除或旧服务退役证据。

## Task 130 No-Go Findings

2026-05-20：task130 只固化 batch 三角色与独立复核契约，不是 runtime 迁移证据。后续任何批次不得无复核就勾选，不得把同一编辑者自审写成独立复核，不得用子代理报告直接作为任务源；子代理有效事实必须合并回 OpenSpec canonical 后才能接力。复核结论不得替代实际测试、HTTP gate、browser evidence、`DB_READY`、真实库样本或写入回滚证据；local、contract、browser、historical evidence 不得升级为 production `DB_READY`、shadow-off/fallback 或 retirement。若某类证据不适用，必须写明不适用原因，不能空缺后用总结文字覆盖缺口。

## Task 131 No-Go Findings

2026-05-20：task131 只固化子代理输出的 canonical merge 边界，不是 runtime 迁移证据。后续不得把聊天记录、子代理总结、`.tmp/phase7-agent-reports/**`、旧 Superpowers 文档或临时报告当成后续执行入口、完成证据、接力入口或长期维护清单；不得新建第四份长期 source coverage 矩阵；不得用“子代理说已完成”替代 tests/evidence/checkbox；不得把未合并到 `tasks.md`、`agent-progress.md`、`agent-findings.md`、`design.md` 或 `specs/**` 的临时结论用于接力。artifact 路径可以作为证据引用，但不得维护 parallel checkbox 清单或第二任务树。

## Task 132 No-Go Findings

2026-05-20：task132 只固化复核发现缺口后的退回/新建编辑切片边界，不是 runtime 迁移证据。后续复核发现任务缺漏、证据不足、状态越权升级、旧服务退役误判、source coverage 缺失、测试/证据命令缺失或 no-go 约束缺失时，必须退回对应 endpoint 或新建后续编辑切片，并保持任务未完成、partial、blocked、unknown-needs-triage 或 keep-source，直到补齐。不得用总结文字覆盖缺口；不得口头豁免证据；不得把复核发现写成完成证据；不得把 local/contract/HTTP/browser/historical evidence 升级为 production `DB_READY`、真实库样本、shadow-off/fallback、write closure 或 retirement candidate；不得删除、移动、归档、重命名或清空旧服务目录。

## Task 133 No-Go Findings

2026-05-20：task133 只固化每批结束前的验证门禁，不是 runtime 迁移证据。后续每个批次必须运行与本批相关的 OpenSpec strict、`git diff --check`、包级测试/typecheck、Vitest、HTTP gate、browser/API evidence 中适用项，或明确记录不可运行/不适用原因；文档-only 批次至少需要 OpenSpec strict 和 diff check，runtime 批次必须按修改范围补包级测试/typecheck、contract/manifest/HTTP gate，并按适用性分层记录 browser evidence、DB_READY、真实库样本、写入回滚和 retirement gate。不得只跑无关命令冒充验证；不得用单一测试替代 browser evidence、DB_READY、真实库样本、写入回滚或 retirement gate；不得全局安装工具或依赖全局 turbo；不得把不可运行原因留空；不得把失败批次写成完成。任一 required check 失败时必须在 `agent-progress.md` 记录失败命令/摘要，在本文件记录阻断原因、影响范围和下一步，并按 task132 退回或新建编辑切片。

## Task 76 Contract-Manage List Coverage Findings

2026-05-20：task76 只完成 `property-manage/contract-manage` 12 个普通 list endpoint 的当前覆盖状态确认，不是 runtime 迁移完成证据。`contract-manage-list-coverage-audit.md` 记录了 12 个旧 admin source、12 个 `apps/api` route 和 12 个 admin hook 均存在；探索当时 `runtimeEndpointManifest`、`apps/api` contract/manifest tests 和 gated HTTP test 对这 12 个 endpoint 全缺失。task77-task80 后 12 个普通 list endpoint 获得本地 manifest/contract/gated HTTP test 条目；不得把 route file 存在、旧 source 存在、admin hook 存在或 shadow resolver 测试写成 production `DB_READY`、真实库样本、shadow-off/fallback、真实页面 Network、真实 HTTP 已跑或旧服务退役。`rank-route-keys.ts` 只登记 5 个相关三级业务路径，另外 7 个普通 list 目前不能写成 rank 页面完成。

## Task 77 Contract-Manage List Findings

2026-05-20：task77 只为 `archive/list`、`attachment/list`、`clause/list` 增补本地 `runtimeEndpointManifest`、manifest/contract tests 和 gated HTTP test 条目，不包含 upload/R2、write/delete/detail，也不代表其他 9 个 contract-manage list endpoint 完成。三端点 status 只能写为 `available-in-apps-api-not-caller-verified`；不得升级为生产 `DB_READY`、真实库样本、shadow-off/fallback、真实页面 Network、真实 HTTP 已跑、写入闭环或旧服务退役。当前 HTTP gate 文件已补断言，但本地命令因缺少 `RUN_PHASE7_HTTP_TESTS=1` 和 `PHASE7_API_BASE_URL` 按既有机制 skipped，因此只能写成 gated HTTP test coverage added / local gated run skipped，不能写成真实 HTTP passed。

## Task 78 Contract-Manage List Findings

2026-05-20：task78 只为 `change/list`、`draft-contract/list`、`expire/list` 增补本地 `runtimeEndpointManifest`、manifest/contract tests 和 gated HTTP test 条目；不包含 `change/{create,detail,update,delete}`、`draft-contract/{create,detail,update,delete}`、upload/R2、write/delete/detail，也不代表 `first-party/list`、`print/list`、`review/list`、`second-party/list`、`template/list`、`type/list` 完成。三端点 status 只能写为 `available-in-apps-api-not-caller-verified`；不得升级为生产 `DB_READY`、真实库样本、shadow-off/fallback、真实页面 Network、真实 HTTP 已跑、写入闭环或旧服务退役。HTTP gate 文件已补断言，但本地命令因缺少 `RUN_PHASE7_HTTP_TESTS=1` 和 `PHASE7_API_BASE_URL` 按既有机制 skipped，因此只能写成 gated HTTP test coverage added / local gated run skipped，不能写成真实 HTTP passed。

## Task 79 Contract-Manage List Findings

2026-05-20：task79 只为 `first-party/list`、`print/list`、`review/list` 增补本地 `runtimeEndpointManifest`、manifest/contract tests 和 gated HTTP test 条目；不包含 upload/R2、write/delete/detail，也不代表 `second-party/list`、`template/list`、`type/list` 完成。三端点 status 只能写为 `available-in-apps-api-not-caller-verified`；不得升级为生产 `DB_READY`、真实库样本、shadow-off/fallback、真实页面 Network、真实 HTTP 已跑、写入闭环或旧服务退役。HTTP gate 文件已补断言，但本地命令因缺少 `RUN_PHASE7_HTTP_TESTS=1` 和 `PHASE7_API_BASE_URL` 按既有机制 skipped，因此只能写成 gated HTTP test coverage added / local gated run skipped，不能写成真实 HTTP passed。

## Task 80 Contract-Manage List Findings

2026-05-20：task80 只为 `second-party/list`、`template/list`、`type/list` 增补本地 `runtimeEndpointManifest`、manifest/contract tests 和 gated HTTP test 条目；不包含 upload/R2、write/delete/detail，也不代表 25 个 contract-manage route 整体完成。至此 task77-task80 覆盖的是 12 个普通 list endpoint，status 只能写为 `available-in-apps-api-not-caller-verified`；不得升级为生产 `DB_READY`、真实库样本、shadow-off/fallback、真实页面 Network、真实 HTTP 已跑、写入闭环或旧服务退役。HTTP gate 文件已补断言，但本地命令因缺少 `RUN_PHASE7_HTTP_TESTS=1` 和 `PHASE7_API_BASE_URL` 按既有机制 skipped，因此只能写成 gated HTTP test coverage added / local gated run skipped，不能写成真实 HTTP passed。

## Task 82 Contract-Manage Record Findings

2026-05-20：task82 只完成记录闭环：`agent-progress.md`、本文件和 Memorix `#4472` 已同步 task77-task80 的 12 个普通 list endpoint local-dev manifest/contract/gated HTTP test 覆盖事实，并记录独立复核 PASS。该记录项不得被解释为新增运行时代码、真实 HTTP passed、页面 Network、生产 `DB_READY`、真实库样本、shadow-off/fallback、写入闭环、upload/R2、CUD/detail 或旧服务退役证据。

## Task 199 Admin Count Baseline Findings

2026-05-20：task199 只完成 admin 数量口径复核和 OpenSpec 文档收敛，不是 Nitro 接口迁移完成。`dev-team/config-manage` 旧文档“16”= 四个子模块按 `list/create/update/delete` 的历史 CRUD 方法口径；当前 legacy 文件树为 20 个文件，四个子模块 `center/dictionary/item/type` 各含 `list/create/detail/update/delete`，`apps/api` 目标 route 也为 20 个，但缺 runtime manifest/contract/HTTP gate 覆盖。`setting-manage/system-manage` 旧文档“15”= 五个子模块按 `create/update/delete` 的历史 CUD 方法口径；当前 legacy 文件树为 20 个文件，五个子模块 `change-password/community-configuration/initialize-cell/register-protocol/system-config` 各含 `list/create/update/delete`，`apps/api` 目标 route 也为 20 个，但缺 `/api/setting-manage/system-manage/**` runtime manifest/contract/HTTP gate 覆盖。`property-manage/expense-manage` 当前 legacy list 文件树为 16 个 = 14 个 `phase7-expense-manage-admin-list` list + 2 个 `phase5a-expense-manage` list（`house-charge/list`、`expense-item-setting/list`）；既有 Phase7 runtime/HTTP gate 数组只代表 14 个 list 分组，不等于当前 list 总数。`property-manage/report-manage` 当前 legacy list 文件树为 13 个 = 12 个 `phase7-report-manage-admin-list` list + 1 个 `phase2-fee-payment-report` list（`payment-details-form/list`）；既有 Phase7 runtime/HTTP gate 数组只代表 12 个 list 分组，不等于当前 list 总数。

No-go：不得把 20/20/16/13 写成 runtime manifest、contract、HTTP gate、页面 Network、生产 `DB_READY`、真实库样本、shadow-off/fallback、写入闭环或旧服务退役证据；不得用目录数量替代 endpoint ledger；不得把 list evidence 推导到 CUD/detail/upload/R2。后续执行必须以当前 working tree legacy 文件树和 `tasks.md` 显式 endpoint 行为准，旧数字只作为 dated historical snapshot。

## Task 203 Report Expense Summary Findings

2026-05-20：task203 对应 `property-manage/report-manage/expense-summary-table/list`，当前结论为 partial evidence，不能勾选完成。

Pass evidence：只读代理确认 report 与 expense 同名 expense-summary-table endpoint 没有 alias 混用。report legacy/source/target route 调用链为 `adminAdapter.listReportExpenseSummaryTables` -> `service.listReportExpenseSummaryTables` -> `repository.listReportExpenseSummaryTables` -> `rptExpenseSummaries` / `rpt_expense_summaries`；expense 同名 endpoint 调用 `listExpenseSummaryTables` -> `exExpenseSummaryTables` / `ex_expense_summary_tables`。前端 caller 已分离：report hook 指向 `/api/property-manage/report-manage/expense-summary-table/list`，expense hook 指向 `/api/property-manage/expense-manage/expense-summary-table/list`；report 页面导入 report hook，expense 页面导入 expense hook。已有本地测试通过：`pnpm -F @01s-11comm/api exec vitest run tests/admin/report-manage-expense-summary-table.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts`，3 个测试文件、14 个测试通过。

Production API partial evidence：生产 API 入口来自 `apps/api/package.json` 的 `homepage`，当前为 `https://01s-11-server.ruan-cat.com`。Shell fetch 显示 `GET /__nitro/health` 返回 200 且 database configured 为 true；`GET /__nitro/ready` 返回 200、code 为 `READY_CONFIGURED`、probeEnabled 为 false，不是 `DB_READY`；`POST /api/property-manage/report-manage/expense-summary-table/list` 返回 200、`success=true`、`total=2`，首条字段包含 `feeItem=物业费`、`statisticsTime=2024-01-01`。Chrome DevTools browser-context 也确认 health 200、ready code `READY_CONFIGURED`、endpoint 200、`success=true`、`total=2`，Network reqid=5；request/response 已保存为 `.tmp/phase7-dev-browser/2026-05-20-report-manage-expense-summary-table-production-api.network-request` 与 `.tmp/phase7-dev-browser/2026-05-20-report-manage-expense-summary-table-production-api.network-response`。

No-go：当前没有 `RUN_PHASE7_DB_READINESS_CHECK=1` 下的 `DB_READY`，没有 Neon main readiness probe 通过证据，没有 admin H5 生产页面 Network，没有 shadow-off/fallback 演练，没有退役 ledger/旧服务退役证据。因此不得把本 task 写成完成，不得把 `READY_CONFIGURED`、HTTP 200、本地 Vitest 或生产 API 200 写成 `DB_READY`、真实库样本完整或 retirement。特别禁止把 `expense-manage/expense-summary-table` 的 `.tmp` 页面证据当成 report 证据。

2026-05-21 refresh: this task remains incomplete. Independent `apps/api` production returned the report contract for `POST /api/property-manage/report-manage/expense-summary-table/list`: `x-request-id=req_fc097735-1a83-46fd-86f2-4445e363dba9`, `success=true`, `total=2`, and a sample with `feeItem=物业费`, `currentReceivable=50000.00`, `currentActualReceipt=45000.00`, `chargeRate=90.00%`, `statisticsTime=2024-01-01`. The same run returned ready `x-request-id=req_1ec42e11-19d4-444b-8fde-50a79b7a1e60`, `code=READY_CONFIGURED`, `connected=null`, `probeEnabled=false`, so it is still not `DB_READY`.

Production admin H5 route `GET https://01s-11comm.ruan-cat.com/property-manage/report-manage/expense-summary-table` returned only the SPA HTML document. Same-origin admin `POST /api/property-manage/report-manage/expense-summary-table/list` returned HTTP 200 with `x-request-id=e469c568-07ab-4b9b-b8a9-6dfae75a05ab`, but the sample keys were legacy/source-style `time`, `expenseItemId`, `expenseItemName`, `receivableAmount`, `actualAmount`, `status`, and `remark`. Local legacy source confirms `apps/admin/server/api/property-manage/report-manage/expense-summary-table/list.post.ts` reads `rptExpenseSummaries` but maps to legacy `ExpenseSummaryTableListItem` fields. Therefore this same-origin response cannot be used as proof of production admin H5 page Network cutover to the independent report contract, and it cannot be used as shadow-off/fallback success.

Artifact: `.tmp/phase7-dev-browser/2026-05-21-report-expense-summary-refresh.md`. No-go remains unchanged: do not mark task203 complete until `DB_READY`, Neon main readiness, real admin H5 page Network, shadow-off/fallback drill, and retirement ledger evidence exist.

## Task 208 Report Manage P1 Findings

2026-05-20：task208 对应 `property-manage/report-manage` P1 四端点：`owner-payment-details/list`、`repair-report-form/list`、`repair-reports-summary-table/list`、`statement-expenses/list`。当前结论为 partial evidence，不能勾选完成。

Pass evidence：源码链路已接入 `apps/api`，且未混用 expense 表。`owner-payment-details/list` 调用 `listOwnerPaymentDetails` 并读 `rptOwnerPaymentDetails` / `rpt_owner_payment_details`；`repair-report-form/list` 调用 `listRepairReportForms` 并读 `rptRepairReports` / `rpt_repair_reports`；`repair-reports-summary-table/list` 调用 `listRepairReportsSummaryTables` 并读 `rptRepairSummaries` / `rpt_repair_summaries`；`statement-expenses/list` 调用 `listStatementExpenses` 并读 `rptStatementExpenses` / `rpt_statement_expenses`。前端 hook/page caller 存在，四个 hook URL 均指向 `/api/property-manage/report-manage/<endpoint>/list`，页面 caller 也存在。runtime manifest/contract/HTTP gate 文件覆盖存在，status 仍为 `available-in-apps-api-not-caller-verified`，owner `fee-report`，phase `phase7-report-manage-admin-list`。

Fallback and caller gaps：`getFeeRuntime(event)` 无 DB URL/event 时会走 in-memory fallback，四端点 fallback 当前为空分页，不是真实库证据；部分页面筛选字段未完全落到真实列，必须保守记录。虽然 hook/page caller 存在，但仍缺明确本地和生产 admin H5 页面 Network artifact，不能把 hook 证据写成页面 Network。

Local and infra test evidence：`pnpm -F @01s-11comm/api exec vitest run tests/admin/report-manage-p1-endpoints.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts` 通过，3 文件 18 测试通过。`pnpm -F @01s-11comm/api exec vitest run tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/modules/fee-db-repository.test.ts` 通过，3 文件 16 测试通过。

Production API partial evidence：生产 API shell 采样四个 POST 均 200 且 `success=true`，total 分别为 `owner-payment-details=2`、`repair-report-form=1`、`repair-reports-summary-table=1`、`statement-expenses=1`。Chrome DevTools browser-context 生产 API 采样四个 POST 均 200 且 `success=true`，total/listCount 同上；request/response 已保存为 `.tmp/phase7-dev-browser/2026-05-20-report-manage-p1-owner-payment-details-production-api.network-request` / `.network-response`、`.tmp/phase7-dev-browser/2026-05-20-report-manage-p1-repair-report-form-production-api.network-request` / `.network-response`、`.tmp/phase7-dev-browser/2026-05-20-report-manage-p1-repair-reports-summary-table-production-api.network-request` / `.network-response`、`.tmp/phase7-dev-browser/2026-05-20-report-manage-p1-statement-expenses-production-api.network-request` / `.network-response`。真实生产 HTTP gate 通过：`$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts`，1 文件 13 测试 passed，其中包含 report-manage canonical list endpoint 批量验证。

No-go：不能勾选 task208，因为缺 `RUN_PHASE7_DB_READINESS_CHECK=1` 下 `/__nitro/ready` 返回 `DB_READY`。仍缺 Neon main readiness probe 通过证据、真实库样本逐端点证明、admin H5 页面 Network（本地和生产都未找到明确 artifact）、shadow-off/fallback 演练、retirement ledger/旧服务退役证据。不得把 production API 200、HTTP gate passed、Vitest、manifest/contract、fallback 空分页或 `READY_CONFIGURED` 写成 `DB_READY`、真实库样本完整、页面 Network、shadow-off/fallback 或 retirement。

## Task 210 Report Manage Remaining Seven Findings

2026-05-20：task210 对应 `property-manage/report-manage` 剩余七页：`arrears-details-list/list`、`data-statistics/list`、`deposit-report/list`、`fee-reminder/list`、`no-charge-house/list`、`outstanding-fees-analysis/list`、`patrol-report/list`。当前结论为 partial evidence，不能勾选完成。

Local page evidence：`.tmp/phase7-dev-browser/2026-05-18-report-manage-remaining-page-network-verification.md` 记录本地 admin 8080 通过 `/api-shadow/api/property-manage/report-manage/<endpoint>/list` 调用七页，均 200 且 `x-api-phase=phase3-infra`。requestId 分别为 `arrears-details-list=req_7fe4f163-677a-496f-98da-6fddd0b6d318`、`data-statistics=req_682d06ce-98e5-46a2-a95e-3ad98e521bba`、`deposit-report=req_becd6558-3344-479b-b65a-5d97112d203c`、`fee-reminder=req_6765dce1-6dce-4781-9082-aaeb8974bf05`、`no-charge-house=req_1da231b2-4ee0-45df-aa8e-399524689364`、`outstanding-fees-analysis=req_87784237-2029-4c16-8758-7ecd2960ab3e`、`patrol-report=req_4ae4d269-378d-4a8e-8f0b-4a2a0bb87946`；页面渲染标题分别为 `欠费明细表`、`数据统计`、`押金报表`、`费用提醒`、`未收费房屋`、`欠费分析`、`巡检报表`，total 分别为 2、2、2、1、1、2、1。该证据只代表 local/admin page-level Network，不代表 production admin H5、DB_READY、真实库样本、shadow-off/fallback 或 retirement。

Runtime/test evidence：当前本地 working tree 确认七个 endpoint 已在 `apps/api/server/shared/runtime/runtime-endpoints.ts`、`tests/infra/endpoint-manifest.test.ts`、`tests/infra/phase7-api-contracts.test.ts` 和 `tests/http/phase7-gated-http.test.ts` 的 report-manage canonical list 覆盖中。以 GitHub 默认分支读取到“未登记/无覆盖”的子代理回报与本地未提交 working tree 不一致，只能作为 stale-remote 风险提示，不能覆盖当前本地源码、测试和生产 API 证据。本地测试 `pnpm -F @01s-11comm/api exec vitest run tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/modules/fee-db-repository.test.ts` 通过，3 文件 16 测试通过。

Production API partial evidence：生产 API 地址来自 `apps/api/package.json` 的 `homepage`，当前为 `https://01s-11-server.ruan-cat.com`。生产 API shell 与 Chrome DevTools browser-context 采样七个 POST 均 200 且 `success=true`，total 分别为 `arrears-details-list=2`、`data-statistics=2`、`deposit-report=2`、`fee-reminder=1`、`no-charge-house=1`、`outstanding-fees-analysis=2`、`patrol-report=1`。Chrome request/response 已保存为 `.tmp/phase7-dev-browser/2026-05-20-report-manage-remaining-arrears-details-list-production-api.network-request` / `.network-response`、`.tmp/phase7-dev-browser/2026-05-20-report-manage-remaining-data-statistics-production-api.network-request` / `.network-response`、`.tmp/phase7-dev-browser/2026-05-20-report-manage-remaining-deposit-report-production-api.network-request` / `.network-response`、`.tmp/phase7-dev-browser/2026-05-20-report-manage-remaining-fee-reminder-production-api.network-request` / `.network-response`、`.tmp/phase7-dev-browser/2026-05-20-report-manage-remaining-no-charge-house-production-api.network-request` / `.network-response`、`.tmp/phase7-dev-browser/2026-05-20-report-manage-remaining-outstanding-fees-analysis-production-api.network-request` / `.network-response`、`.tmp/phase7-dev-browser/2026-05-20-report-manage-remaining-patrol-report-production-api.network-request` / `.network-response`。真实生产 HTTP gate 已通过：`$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts`，1 文件 13 测试 passed，覆盖 report-manage canonical list endpoint 批量验证。

No-go：不能勾选 task210，因为仍缺 `RUN_PHASE7_DB_READINESS_CHECK=1` 下 `/__nitro/ready` 返回 `DB_READY`、Neon main readiness probe 通过证据、生产 admin H5 页面 Network、shadow-off/fallback 演练、真实库样本逐端点证明和 retirement ledger/旧服务退役证据。不得把 local `/api-shadow` 页面 Network、production API 200、HTTP gate passed、Vitest、manifest/contract 覆盖或 `READY_CONFIGURED` 写成 `DB_READY`、真实库样本完整、生产页面 Network、shadow-off/fallback 或 retirement。

## Task 211 Payment Details Form Findings

2026-05-20：task211 对应 `property-manage/report-manage/payment-details-form/list`，当前完成的是“第 13 个 report-manage list 的 phase、manifest、contract、HTTP gate 和历史测试覆盖归属复核”。该完成不代表生产 `DB_READY`、生产 admin H5 页面 Network、真实库样本完整、shadow-off/fallback、retirement ledger 或旧服务退役。

Phase and ownership：`payment-details-form/list` 是 `phase2-fee-payment-report`、owner `fee`、admin canonical `JsonVO` endpoint，不属于 12 个 `phase7-report-manage-admin-list` / owner `fee-report` 的 report list 批量分组。后续统计 report-manage 时必须区分 “12 个 Phase7 report list” 与 “当前 legacy 文件树 13 个 report-manage list”，不能用前者覆盖后者。

Source and schema evidence：`apps/api/server/routes/api/property-manage/report-manage/payment-details-form/list.post.ts` 使用 `nitro/h3`，调用 `getFeeRuntime(event).adminAdapter.listPaymentDetailsForm`；adapter 调用 `service.getPayFeeDetailReport`，repository 读取 `rptPaymentDetails` / `rpt_payment_details`，并通过 `toPaymentDetailsFormItem` 映射为 `PaymentDetailsFormListItem`。`rptPaymentDetails` 定义在 `apps/type/src/business/property-manage/report-manage/schema.ts`，同时导出 insert/select/update Zod schema 与 `RptPaymentDetail` 类型。无 DB URL/event 时仍可能走 in-memory fallback，因此 fallback 结果不能写成真实库证据。

Test and HTTP gate evidence：`apps/api/tests/admin/fee-admin-endpoints.test.ts` 覆盖 admin adapter shape、route fallback 和 failure；`tests/modules/fee-db-repository.test.ts` 覆盖 `rptPaymentDetails` repository 读取；`tests/infra/endpoint-manifest.test.ts` 与 `tests/infra/phase7-api-contracts.test.ts` 覆盖该 endpoint 的 phase/owner/contract。已补强 `apps/api/tests/http/phase7-gated-http.test.ts`：新增独立 `phase2FeePaymentReportAdminEndpoint` 和 `serves the phase2 fee payment report admin endpoint over real HTTP`，避免继续误用 12 个 Phase7 report list gate 证明第 13 个 endpoint。

Verification evidence：`pnpm -F @01s-11comm/api exec vitest run tests/admin/fee-admin-endpoints.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/modules/fee-db-repository.test.ts` 通过，4 文件 23 测试 passed。`pnpm -F @01s-11comm/admin exec vitest run src/api/property-manage/report-manage/payment-details-form/tests/index.test.ts src/pages/property-manage/report-manage/payment-details-form/tests/page-api-wiring.test.ts` 通过，2 文件 4 测试 passed。默认 `pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts` 未设置 env 时按既有机制 skipped，1 文件 14 tests skipped。真实生产 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts` 通过，1 文件 14 测试 passed，其中新增 phase2 payment report admin endpoint gate 已实际运行。

Production API partial evidence：`apps/api/package.json` 的 `homepage` 当前为 `https://01s-11-server.ruan-cat.com`。生产 API shell 与 Chrome DevTools browser-context 采样 `POST /api/property-manage/report-manage/payment-details-form/list` 均为 200、`success=true`、`total=2`、`listCount=2`，首条 `orderNumber=82f9ec1f-6850-5822-b897-70c2c00d8338`、`feeItem=物业费`、`actualAmount=300`。Chrome request/response 已保存为 `.tmp/phase7-dev-browser/2026-05-20-report-manage-payment-details-form-production-api.network-request` 和 `.network-response`，响应头 `x-api-phase=phase3-infra`、`x-request-id=req_c86b6947-0a62-4378-9c19-db5d812b6655`。生产 health/ready 仍是 partial：health 200 且 database configured true；ready 200、code `READY_CONFIGURED`、probeEnabled false，不是 `DB_READY`。

No-go：不得把 task211 完成写成 report-manage 13/13 可退役、旧服务删除候选、生产 admin H5 页面 Network、Neon main `DB_READY`、真实库样本完整、shadow-off/fallback 或 write/read rollback 完成。真实生产 HTTP 200 与 Chrome API artifact 只能证明 API server 层 partial evidence；页面级生产 evidence 仍需通过 admin H5 入口另采。

## Task 89 Expense Manage Phase7 Findings

2026-05-20：task89 对应 `property-manage/expense-manage` Phase7 14 个 list。当前结论为 partial evidence，不能勾选完成。该 14 个 endpoint 是 `phase7-expense-manage-admin-list` 范围，不包括同目录下 `phase5a-expense-manage` 的 `house-charge/list` 与 `expense-item-setting/list`。

Source/runtime evidence：14 个 endpoint 的 `apps/api` route 均存在，均走 `getFeeRuntime(event).adminAdapter -> FeeService -> FeeRepository`。runtime manifest 均为 phase `phase7-expense-manage-admin-list`、owner `fee`、`targetClient=admin`、`routeKind=admin-canonical`、`responseContract=JsonVO`、`cutoverStatus=available-in-apps-api-not-caller-verified`。逐项数据表为：`cancel-fee/list` -> `exCancelFees` / `ex_cancel_fees`；`contracte-charge/list` -> `exContractCharges` / `ex_contract_charges`；`discount-apply/list` -> `exDiscountApplications` / `ex_discount_applications`；`discount-setting/list` -> `exDiscountSettings` / `ex_discount_settings`；`discount-type/list` -> `exDiscountTypes` / `ex_discount_types`；`expense-summary-table/list` -> `exExpenseSummaryTables` / `ex_expense_summary_tables`；`meter-reading-type/list` -> `exMeterReadingTypes` / `ex_meter_reading_types`；`overdue-payment-information/list` -> `exOverdueReminders` / `ex_overdue_reminders`；`payment-review/list` -> `exPaymentReviews` / `ex_payment_reviews`；`refund-review/list` -> `exRefundReviews` / `ex_refund_reviews`；`reminder-for-overdue-payments/list` -> `exOverdueReminders` / `ex_overdue_reminders`；`reprint-voucher/list` -> `exReprintVouchers` / `ex_reprint_vouchers`；`vehicle-charge/list` -> `exVehicleCharges` / `ex_vehicle_charges`；`water-and-electricity-meter-reading/list` -> `exMeterReadings` / `ex_meter_readings`。

Caller evidence：14 个 endpoint 的 admin hook、页面 caller 与 `rank-route-key` 均存在。`.tmp/phase7-dev-browser` 下有本地 `expense-*` request/response artifact 覆盖 14 个 endpoint，但这些文件缺页面 URL、Network URL 和 local/prod 自证字段，因此严格口径下不能写成完整页面 Network 证据。生产侧本轮保存的是 `production-api` artifact，也只能证明 API server 层请求，不能替代 admin H5 页面 Network。

Verification evidence：`pnpm -F @01s-11comm/api exec vitest run tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/modules/fee-db-repository.test.ts` 通过，3 文件 16 测试 passed。`pnpm -F @01s-11comm/admin exec vitest run src/api/property-manage/expense-manage/tests/phase7-shadow-resolver-slice-a.test.ts src/api/property-manage/expense-manage/tests/phase7-shadow-resolver-slice-b.test.ts src/api/property-manage/expense-manage/tests/phase7-shadow-resolver-slice-c.test.ts src/api/property-manage/expense-manage/tests/phase7-shadow-resolver-slice-d.test.ts src/api/property-manage/expense-manage/tests/phase7-shadow-resolver-slice-e.test.ts` 通过，5 文件 42 测试 passed。真实生产 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts` 通过，1 文件 14 测试 passed，其中 `serves all admin expense-manage canonical list endpoints over real HTTP` 已实际遍历 14 个 endpoint。

Production API partial evidence：生产 API 入口来自 `apps/api/package.json` 的 `homepage`，当前为 `https://01s-11-server.ruan-cat.com`。生产 API shell 与 Chrome DevTools browser-context 采样 14 个 POST 均为 200 且 `success=true`，total/listCount 为 `cancel-fee=1/1`、`contracte-charge=1/1`、`discount-apply=1/1`、`discount-setting=1/1`、`discount-type=2/2`、`expense-summary-table=2/2`、`meter-reading-type=3/3`、`overdue-payment-information=1/1`、`payment-review=1/1`、`refund-review=1/1`、`reminder-for-overdue-payments=1/1`、`reprint-voucher=1/1`、`vehicle-charge=2/2`、`water-and-electricity-meter-reading=2/2`。Chrome request/response 保存为 `.tmp/phase7-dev-browser/2026-05-20-expense-manage-phase7-<endpoint>-production-api.network-request` / `.network-response`；后四个补采的 x-request-id 分别为 `req_0e3bb717-5dd4-46c8-a022-7b2055736814`、`req_38f17de8-6f76-4623-8c09-6d857fb005d1`、`req_face2923-b29d-424a-b6a0-e58d37c426dd`、`req_d93c5ca3-fbde-4963-a73c-f0a1445f5ee3`。生产 health/ready 仍是 partial：health 200 且 database configured true；ready 200、code `READY_CONFIGURED`、probeEnabled false，不是 `DB_READY`。

No-go：不得把 task89 勾选完成。仍缺生产 admin H5 页面 Network、`RUN_PHASE7_DB_READINESS_CHECK=1` 下 `/__nitro/ready` 返回 `DB_READY`、Neon main readiness probe 通过、真实库样本逐 endpoint 证明、shadow-off/fallback 演练和 retirement ledger/旧服务退役证据。不得把 route/manifest/test 覆盖、HTTP gate passed、production API 200、Chrome API artifact、本地 `.tmp` request/response 或 `READY_CONFIGURED` 写成 `DB_READY`、完整页面 Network、真实库样本完整、shadow-off/fallback 或 retirement。

## Task 90 Expense Summary Alias Findings

2026-05-20：task90 对应 `property-manage/expense-manage/expense-summary-table/list` 与 `property-manage/report-manage/expense-summary-table/list` 的同名路径隔离。当前结论为完成：页面、hook、ownerModule、数据表和响应字段语义没有混用；但该完成只覆盖 alias/语义隔离，不代表 `DB_READY`、生产 admin H5 页面 Network、真实库样本完整、shadow-off/fallback 或 retirement。

Frontend separation：expense 页面使用 `getRouteRank("propertyManage.expenseManage.expenseSummaryTable")`，并从 `@/api/property-manage/expense-manage/expense-summary-table` 导入 `useExpenseSummaryTableListQuery`；hook URL 为 `/api/property-manage/expense-manage/expense-summary-table/list`，类型为 `ExpenseSummaryTableListItem` / `ExpenseSummaryTableQueryParams`。report 页面使用 `getRouteRank("propertyManage.reportManage.expenseSummaryTable")`，并从 `@/api/property-manage/report-manage/expense-summary-table` 导入同名 hook；hook URL 为 `/api/property-manage/report-manage/expense-summary-table/list`，类型为 `ReportExpenseSummaryTableListItem` / `ReportExpenseSummaryTableQueryParams`。两个模块内的 hook 函数名和 `QUERY_KEY_PREFIX = "expenseSummaryTable"` 相同，但模块路径、URL 和类型参数分离。

Runtime and data-source separation：runtime manifest 中 expense endpoint 是 phase `phase7-expense-manage-admin-list`、owner `fee`；report endpoint 是 phase `phase7-report-manage-admin-list`、owner `fee-report`。expense route 调用 `adminAdapter.listExpenseSummaryTables` -> `service.listExpenseSummaryTables` -> `repository.listExpenseSummaryTables` -> `exExpenseSummaryTables` / `ex_expense_summary_tables`，字段语义为 `time`、`expenseItemId`、`expenseItemName`、`receivableAmount`、`actualAmount`、`status`。report route 调用 `adminAdapter.listReportExpenseSummaryTables` -> `service.listReportExpenseSummaryTables` -> `repository.listReportExpenseSummaryTables` -> `rptExpenseSummaries` / `rpt_expense_summaries`，字段语义为 `houseNumberContractName`、`ownerName`、`ownerPhone`、`feeItem`、`currentReceivable`、`currentActualReceipt`、`chargeRate`、`statisticsTime` 等。

Test evidence：新增 `apps/api/tests/admin/expense-manage-expense-summary-table.test.ts`，断言 expense route 将筛选字段传入 `listExpenseSummaryTables`，admin adapter 不调用 `listReportExpenseSummaryTables`，repository 查询 `ex_expense_summary_tables` 且不查询 `rpt_expense_summaries`。report 侧已有 `apps/api/tests/admin/report-manage-expense-summary-table.test.ts`，断言 report route/adapter/repository 不混用 expense 方法和 `ex_expense_summary_tables`。

Verification evidence：`pnpm -F @01s-11comm/api exec vitest run tests/admin/expense-manage-expense-summary-table.test.ts` 通过，1 文件 3 测试 passed。`pnpm -F @01s-11comm/api exec vitest run tests/admin/expense-manage-expense-summary-table.test.ts tests/admin/report-manage-expense-summary-table.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts` 通过，4 文件 17 测试 passed。`pnpm -F @01s-11comm/admin exec vitest run src/api/property-manage/expense-manage/tests/phase7-shadow-resolver-slice-b.test.ts src/api/property-manage/report-manage/expense-summary-table/tests/index.test.ts` 通过，2 文件 12 测试 passed。`pnpm -F @01s-11comm/api run typecheck` 通过。

No-go：不得把 task90 的 alias 隔离完成写成 task89 的 14 个 expense list 全量完成；不得把 expense `.tmp` artifact 写成 report 证据；不得把同名 hook 函数名或 query key 写成跨模块混用；不得把本地 Vitest/typecheck 写成生产 `DB_READY`、生产 admin H5 页面 Network、真实库样本完整、shadow-off/fallback 或 retirement。

## Task 91 Expense Manage Phase5a Findings

2026-05-20：task91 对应 `property-manage/expense-manage/house-charge/list` 与 `property-manage/expense-manage/expense-item-setting/list`。当前结论为完成：两个 list 已按 phase5a 范围单独复核，不能混入 Phase7 14-list 完成口径；但该完成不代表生产 `DB_READY`、生产 admin H5 页面 Network、生产写入闭环、shadow-off/fallback 或旧服务退役。

Scope and manifest：`house-charge/list`、`house-charge/detail`、`expense-item-setting/list`、`expense-item-setting/detail`、`expense-item-setting/create`、`expense-item-setting/update`、`expense-item-setting/delete` 均在 runtime manifest 中归属 phase `phase5a-expense-manage`、owner `fee`、target admin、response `JsonVO`、cutover status `cut-to-apps-api`。这七个 endpoint 是 `apps/api` 额外存在的 fee route，不能拿 Phase7 14-list 数组覆盖。

Data-source and write boundary：`house-charge` 当前只支持 list/detail 读模型，读取 `exHouseCharges` / `ex_house_charges`；repository、service、adminAdapter 都没有 `createHouseCharge`、`updateHouseCharge`、`deleteHouseCharge`。前端页面也保留字段归属提示，说明 houseCharge create/update/delete 要等字段归属和业务 action 评审后再接真实 hook。`expense-item-setting` 支持 list/detail/create/update/delete，读取和写入 `exExpenseItems` / `ex_expense_items`；create/update 经 schema/service 校验并排除 blocked fields，delete 返回 explicit unsupported/delete-policy rejection，不是软删除或生产删除成功。

Caller evidence：admin hook 已分开存在。`house-charge` hook 使用 `/api/property-manage/expense-manage/house-charge/list` 和 `/detail`，并在页面 `propertyManage.expenseManage.houseCharge` 中调用；页面写入口当前只提示 pending，不接真实 create/update/delete hook。`expense-item-setting` hook 使用 `/api/property-manage/expense-manage/expense-item-setting/{list,detail,create,update,delete}`，页面 `propertyManage.expenseManage.expenseItemSetting` 调用对应 hook。

Verification evidence：`pnpm -F @01s-11comm/api exec vitest run tests/admin/fee-admin-endpoints.test.ts tests/admin/expense-manage-phase5a.test.ts tests/modules/fee-admin-crud.test.ts tests/modules/fee-db-repository.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts` 通过，6 文件 34 测试 passed。`pnpm -F @01s-11comm/admin exec vitest run src/api/property-manage/expense-manage/house-charge/tests/index.test.ts src/api/property-manage/expense-manage/expense-item-setting/tests/index.test.ts` 通过，2 文件 6 测试 passed。HTTP gate 事实边界：`tests/http/phase7-gated-http.test.ts` 当前显式覆盖 `house-charge/list`；`expense-item-setting/list` 不在当前 HTTP gate 成员内，因此只能记录为 manifest/contract + 本地 API/hook 测试 + 生产 API 采样覆盖。

Production API partial evidence：shell 与 Chrome DevTools browser-context 均确认 `POST https://01s-11-server.ruan-cat.com/api/property-manage/expense-manage/house-charge/list` 返回 200、`success=true`、`total=3`、`listCount=2`，首条 `id=40bb4956-6eaa-5bae-b84f-ba535402473d`、`name=住宅物业服务费`；`POST https://01s-11-server.ruan-cat.com/api/property-manage/expense-manage/expense-item-setting/list` 返回 200、`success=true`、`total=5`、`listCount=2`，首条 `id=c4b15095-070f-579a-977f-4a3adc15bbca`、`expenseItem=生活用水费`。Chrome artifact 保存为 `.tmp/phase7-dev-browser/2026-05-20-expense-manage-phase5a-house-charge-production-api.network-request` / `.network-response` 和 `.tmp/phase7-dev-browser/2026-05-20-expense-manage-phase5a-expense-item-setting-production-api.network-request` / `.network-response`；浏览器侧 x-request-id 为 `req_858c2b85-8c2b-43eb-b6db-58875a59d7b4`、`req_cb124afa-f9b1-4fe5-bc9e-5a3b5eac8fa5`，独立 shell 采样 x-request-id 为 `req_797ab312-d584-4470-8b6d-a62028392bc8`、`req_65809d10-e9ab-4026-b147-cbab48f5814f`。

No-go：本轮没有执行生产 create/update/delete，不能把本地 create/update/delete 策略测试写成生产写入闭环。仍缺生产 `DB_READY`、Neon readiness、生产 admin H5 页面 Network、shadow-off/fallback 和 retirement ledger；不得把 phase5a `cut-to-apps-api` manifest、production API 200 或本地 Vitest 写成旧服务删除候选。

## Task 92 Dev Config Center Findings

2026-05-20 / 2026-05-21：task92 对应 `dev-team/config-manage/center/{list,create,detail,update,delete}`。当前结论为 partial evidence，不能勾选完成。2026-05-20 记录只说明 `apps/api` 已有五个 route 文件和 repository CRUD 源码链路；2026-05-21 已进一步补齐本地 runtime manifest、API 专项 Vitest、infra contract 和默认 HTTP gate 证据，但仍不代表页面级 CUD、生产 detail/CUD、生产 `DB_READY` 或旧服务退役完成。

Source and DB evidence：`apps/api/server/routes/api/dev-team/config-manage/center/{list.post.ts,detail.get.ts,create.post.ts,update.post.ts,delete.post.ts}` 与旧 `apps/admin/server/api/dev-team/config-manage/center/*` 同路径文件均存在。`apps/api` handler 从 `nitro/h3` 导入，调用 `getDevRuntime(event).adminAdapter`。repository 源码显示 `listConfigCenter`、`createConfigCenter`、`getConfigCenterDetail`、`updateConfigCenter`、`deleteConfigCenter` 均落到 `dtConfigs` / `dt_configs`，其中 list/detail 为 select，create 为 insert，update 为 update，delete 为 delete。

Local API coverage evidence：2026-05-21 新增 `apps/api/tests/admin/dev-config-manage-center.test.ts`，先红灯确认 4 tests 中 1 failed + 3 passed，唯一失败是 `runtimeEndpointManifest` 缺 center 五个 endpoint；路由分发、repository `dt_configs` CRUD 意图和 adapter 缺 id 400 均已通过。随后 `apps/api/server/shared/runtime/runtime-endpoints.ts` 新增 `/api/dev-team/config-manage/center/{list,create,detail,update,delete}` 五条 admin canonical manifest，list/create/update/delete 为 `POST`，detail 为 `GET`，phase `phase7-dev-config-manage-admin-crud`、owner `dev`、response `JsonVO`、status `available-in-apps-api-not-caller-verified`。同步补 `apps/api/tests/infra/endpoint-manifest.test.ts`、`apps/api/tests/infra/phase7-api-contracts.test.ts` 与 `apps/api/tests/http/phase7-gated-http.test.ts` 的 center list/detail 只读 HTTP gate；`route-inventory.md` 与 `route-inventory-details.csv.md` 已将 center 五行改为上述 phase/status，admin canonical manifest rows 为 142，dev rows 为 20。

Frontend caller evidence：`apps/admin/src/api/dev-team/config-manage/center/index.ts` 当前只导出 `useConfigCenterListQuery`，URL 为 `/api/dev-team/config-manage/center/list`。页面 `apps/admin/src/pages/dev-team/config-manage/center/index.vue` 使用 `getRouteRank("devTeam.configManage.center")` 并调用 list hook；但 `viewDetails`、`copyConfig`、`toggleStatus`、`deleteConfig` 当前仍是 console/log/确认文案，没有接真实 `detail/create/update/delete` hook，所以不能写成页面级 CUD 证据。

Verification and production API partial evidence：`pnpm -F @01s-11comm/admin exec vitest run src/api/dev-team/config-manage/tests/phase7-shadow-resolver.test.ts` 通过，1 文件 12 测试 passed，覆盖 center list shadow resolver。生产 API shell 与 Chrome DevTools browser-context 均确认 `POST https://01s-11-server.ruan-cat.com/api/dev-team/config-manage/center/list` 返回 200、`success=true`、`total=3`、`listCount=2`，首条 `id=e5859909-d510-5742-b338-11951949dafb`、`configName=系统名称`。Chrome request/response 保存为 `.tmp/phase7-dev-browser/2026-05-20-dev-team-config-manage-center-production-api.network-request` / `.network-response`；浏览器 x-request-id 为 `req_782906d0-e825-424f-8a18-6bd6165f03a0`，shell x-request-id 为 `req_81abb071-fc0e-4c7a-b1f0-3380ae34e869`。

Local verification evidence：center 本地绿色组合命令 `pnpm -F @01s-11comm/api exec vitest run tests/admin/dev-config-manage-center.test.ts tests/admin/dev-config-manage-dictionary.test.ts tests/admin/dev-config-manage-item.test.ts tests/admin/dev-config-manage-type.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/http/phase7-gated-http.test.ts` 已通过，6 文件 27 tests passed + 1 文件 23 skipped；HTTP gate 默认 skipped，不代表生产 detail 或 CUD 已执行。

No-go：不得把 `center/list` 的生产 API 200、admin resolver 测试、本地 manifest/contract/Vitest/skipped HTTP gate、repository 源码 CRUD 能力或旧/新 route 文件存在写成五个 endpoint 完成。仍缺生产 detail GET 真实调用证据、create/update/delete 受控写入读回回滚证据、生产 admin H5 页面 Network、生产 `DB_READY`、shadow-off/fallback 和 retirement ledger。

## App Legacy CallComponent Core List Findings

2026-05-21：`/callComponent/core/list` 属于 app legacy stream，不属于 admin canonical route。当前结论为 mixed compat / DB-wired-with-gap evidence；已补旧服务生产行为、生产 API server real HTTP gate、生产 App H5 页面 Network 和 DB repository mixed compat 测试，因此可关闭 §3.1 的 `[探索]`、`[实施]`、`[验证]` 三项，但三项完成不代表 DB_READY、真实 fee 字典迁移或旧服务退役。

Caller and semantics evidence：`apps/app/src/api/property-application.ts` 与 `apps/app/src/pages-sub/property/apply-room.vue` 使用 `name=apply_room_discount&type=state`；`apps/app/src/api/repair.ts` 使用 `domain=repair_status/repair_type` 等；`apps/app/src/api/fee.ts` 与 report/fee 页面使用 `name=pay_fee_config&type=fee_type_cd`。旧实现合并层在 `apps/app/server/shared/runtime/legacy-endpoints.ts`，原始定义分布在 `apps/app/server/modules/repair/endpoints.ts` 和 `apps/app/server/modules/property-application/endpoints.ts`。

apps/api evidence：`apps/api/nitro.config.ts` 将 `/callComponent/**` 交给 legacy dispatch；`apps/api/server/modules/repair/legacy-endpoints.ts` 注册 `/callComponent/core/list` GET+POST，adapter 为 `legacyAdapter.listCoreDict`，输出旧 `{ code, msg, data }` envelope；`runtime-endpoints.ts` 与 route inventory 中状态为 `app-shadow-allowlist`。本地回放通过：`pnpm -F @01s-11comm/api exec vitest run tests/legacy/callcomponent-batch1.test.ts tests/runtime/legacy-fallback.test.ts` 为 2 文件 16 tests passed；`pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/legacy-endpoints.test.ts src/tests/nitro-runtime/runtime-base-url.test.ts src/tests/nitro-runtime/property-application-endpoints.test.ts src/tests/nitro-runtime/repair-endpoints.test.ts` 为 4 文件 54 tests passed。生产 API real HTTP evidence：新增 `apps/api/tests/http/phase7-gated-http.test.ts` 测试 `serves app legacy callComponent core list mixed compat over real HTTP`；默认 gate 为 24 skipped，生产 `PHASE7_API_BASE_URL=https://01s-11-server.ruan-cat.com` 下目标 test 为 1 passed、23 skipped，覆盖 GET `name=apply_room_discount&type=state`、POST `{ domain: "repair_type" }` 和 GET `name=pay_fee_config&type=fee_type_cd`。

Old service production behavior evidence：生产旧 app server `https://01s-11-app-server.ruan-cat.com` 只读采样确认旧行为仍是 mixed compat：`GET /callComponent/core/list?name=pay_fee_config&type=fee_type_cd` 返回 `success=true`、`code="0"`、`message="查询字典成功"`、`data=[]`；`GET /callComponent/core/list?name=apply_room_discount&type=state` 返回 7 个申请状态；`GET /callComponent/core/list?domain=repair_status` 返回 `{ data, list }` 双字段和 5 个维修状态；`POST /callComponent/core/list` body `{ domain: "repair_type" }` 返回 `{ data, list }` 双字段和 7 个维修类型。结论：`pay_fee_config/fee_type_cd` 空数组是旧服务一致行为，不是新 API 丢字典；但也不能写成真实 fee 字典迁移完成。

Implementation decision evidence：`apps/api/server/modules/repair/repository.ts` 的 DB repository 对 `repair_type` 读 `rpRepairTypes`，对 `repair_status` 保留 static code map，对 `apply_room_discount/state` 与 `pay_fee_config/fee_type_cd` 走 in-memory compat。新增 `apps/api/tests/modules/repair-db-repository.test.ts` 用例 `keeps core list mixed compat while reading repair types from DB`，证明 `repair_type` DB 优先、`repair_status` / `apply_room_discount/state` / `pay_fee_config/fee_type_cd` 兼容行为不被误写成全量 DB；`pnpm -F @01s-11comm/api exec vitest run tests/modules/repair-db-repository.test.ts` 通过 7 tests。

Production App H5 evidence：`apps/app/package.json` homepage 为 `https://01s-11-app.ruan-cat.com`。Chrome 打开 `https://01s-11-app.ruan-cat.com/#/pages-sub/report/room-fee?communityId=COMM_001` 后，Network 捕获 `GET https://01s-11-server.ruan-cat.com/callComponent/core/list?name=pay_fee_config&type=fee_type_cd`，status 200，response `{ code: 0, msg: "query success", data: [] }`，响应头含 `x-api-phase=phase3-infra`、`x-request-id=req_066f4a55-c186-4f93-b5f0-7374d4fc4f3f`、`access-control-allow-origin=https://01s-11-app.ruan-cat.com`，console 无消息；artifact 保存到 `.tmp/phase7-dev-browser/2026-05-21-callcomponent-core-list-production-app-room-fee.network-request.md`、`.network-response`、`.snapshot.txt`、`.png`。同页 `GET /app/reportFeeMonthStatistics.queryReportFeeDetailRoom` 也返回 200，说明页面业务数据加载。

Caller gap：`apps/app/src/pages-sub/property/apply-room.vue` 定义了 `loadApplyStateRequest()` 调 `name=apply_room_discount&type=state`，但未发现实际调用；repair 页面未发现自动触发 `domain=repair_status` 或 `domain=repair_type`；fee/report 的 `room-fee`、`pay-fee-detail`、`fee-summary` 和 `fee/create` 会触发 `name=pay_fee_config&type=fee_type_cd`。因此当前 App H5 页面证据只覆盖 fee/report 的空数组兼容分支，不能外推到 property-application 和 repair 页面调用完成。

No-go：`repair_type` 可记录为 DB-wired-with-gap，但 `repair_status`、`apply_room_discount/state` 仍是 compat/static，`pay_fee_config/fee_type_cd` 当前返回空数组；不得写成 DB 完成。`legacy-dispatch` 只有 registry 404 才会调用 `proxyLegacyAppRequest`，因此 `/callComponent/core/list` 的生产 HTTP gate 与 App H5 Network 可证明 exact handler 可达并被生产页面命中，但不能替代全局 shadow-off/fallback 复验、DB_READY、真实库样本或 retirement ledger；不能把本轮探索/实施/验证三项完成写成 `/callComponent/**` 全量完成、app legacy cutover 完成或旧 app server 可退役。

## App Legacy Floor Findings

2026-05-21：`/app/floor.queryFloors` 与 `/app/floor.queryFloorDetail` 属于 app legacy stream。当前结论为 partial evidence，不勾选 `tasks.md` 对应 checkbox。代码、生产 API、生产 App H5 list 页面和真实 `hp_houses` 样本均已有证据，但仍缺 detail 自然 H5 页面入口、明确 shadow-off/fallback drill、`DB_READY` 和 retirement ledger。

Runtime and data-source evidence：两个 endpoint 在 `apps/api/server/modules/floor/legacy-endpoints.ts` 注册 GET+POST，`runtime-endpoints.ts` 标记为 `app-shadow-allowlist`，response contract 为 `{ code, msg, data }`。`getFloorRuntime(event)` 有 DB URL 时注入 `createDbFloorRepository(useDb(event))`，否则走 fallback runtime。DB repository 从 `hpHouses` / `hp_houses` 聚合 `communityId + buildingNo + floor` 生成兼容楼层视图；`floorId` 形如 `DB_<communityUuid>_<buildingNo>_<floorNum>`，只是兼容 ID，不是真实 floor 专表主键。无 DB URL fallback 才生成 `F_COMM_*`。

Production App H5 evidence：`apps/app/package.json` homepage 为 `https://01s-11-app.ruan-cat.com`。Chrome 打开 `https://01s-11-app.ruan-cat.com/#/pages-sub/property/floor-list` 后，Network 捕获 `GET https://01s-11-server.ruan-cat.com/app/floor.queryFloors?page=1&row=10&communityId=COMM_001`，status 200，response `{ code, msg, data }`，首批 `floorId` 为 `DB_92f3885e-f3eb-5f5e-a0db-1f3e0373fd21_A_1` 和 `DB_92f3885e-f3eb-5f5e-a0db-1f3e0373fd21_B_2`；response headers 含 `x-api-phase=phase3-infra`、`x-request-id=req_dc3236af-1eb6-4e17-8414-fc5f0ced76ff`、`access-control-allow-origin=https://01s-11-app.ruan-cat.com`，console 无消息。Artifacts: `.tmp/phase7-dev-browser/2026-05-21-floor-production-app-floor-list.network-response`、`.snapshot.txt`、`.png`；Chrome tool 输出了 request metadata，但未生成独立 `.network-request` 文件。

Production API and DB sample evidence：`apps/api/package.json` homepage 为 `https://01s-11-server.ruan-cat.com`。生产 API list->detail shell 采样确认 `/app/floor.queryFloors?page=1&row=1&communityId=COMM_001` 返回 `DB_92f3885e-f3eb-5f5e-a0db-1f3e0373fd21_A_1`，随后 `/app/floor.queryFloorDetail?floorId=...` 返回同一 `floorId/floorNum=1/floorName=A-1/communityId=92f3885e-f3eb-5f5e-a0db-1f3e0373fd21`。受控 Neon 样本反查只记录脱敏 host 与聚合结果：`hp_houses` 中 `community_id=92f3885e-f3eb-5f5e-a0db-1f3e0373fd21`、`building_no=A`、`floor=1` 有 `house_count=2`。生产 `/__nitro/ready` 当前仍为 `READY_CONFIGURED`、`connected=null`、`probeEnabled=false`，不是 `DB_READY`。

Verification evidence：新增 `apps/api/tests/http/phase7-gated-http.test.ts` 用例 `serves app legacy floor list and detail DB synthetic id over real HTTP`，断言生产 HTTP gate 下 list 返回 `DB_*` 合成 ID、detail 可用同一合成 ID 查回，并保持 `{ code, msg, data }` 且不含 `success`。默认 gate 未设置 env 时为 25 skipped；生产命令 `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts -t "serves app legacy floor list and detail DB synthetic id over real HTTP"` 为 1 passed、24 skipped。`pnpm -F @01s-11comm/api exec vitest run tests/modules/floor-db-repository.test.ts tests/legacy/floor-legacy-endpoints.test.ts tests/runtime/legacy-fallback.test.ts` 为 3 files 22 tests passed。`pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/floor-endpoints.test.ts src/tests/nitro-runtime/runtime-base-url.test.ts` 为 2 files 44 tests passed。`pnpm -F @01s-11comm/api run typecheck` passed。

Caller and fallback gaps：`apps/app/src/pages-sub/property/floor-list.vue` 自然触发 `queryFloors`，并把 `floorId` 传给 unit-list；`apps/app/src/api/floor.ts` 定义了 `getFloorDetail()`，但 `apps/app/src` 只发现封装和测试引用，未发现自然 H5 页面触发 `/app/floor.queryFloorDetail`。`apps/app/src/http/runtime-base.ts` 与 runtime-base-url test 证明 shadow enabled 时 floor path 指向统一 `apps/api`；`apps/api/server/handlers/legacy-dispatch.ts` 只有 registry 404 且 legacy path 时才调用 `proxyLegacyAppRequest`。这些只能证明 exact handler 与 shadow route 可达，仍不是完整 shadow-off/fallback drill。

Old service comparison：旧 app server `https://01s-11-app-server.ruan-cat.com/app/floor.queryFloors?page=1&row=1&communityId=COMM_001` 返回 `success/code/message/data/timestamp` envelope 和 `F_COMM_001_001`；新 `apps/api` 返回 `{ code, msg, data }` 和 `DB_*`。因此本轮只能记录 unified app legacy contract 与 DB 聚合兼容 ID，不能写成旧 app server envelope 完全一致。

No-go：不要勾选 floor task。不得把 `DB_*` 写成真实 floor 主键、不得把 floor list/detail 往返外推成 unit/room 下游真实外键完成、不得把 `READY_CONFIGURED` 或 `hp_houses` 单样本反查写成全局 `DB_READY`、不得把 exact handler 可达写成 shadow-off/fallback 退役完成、不得把旧 app server 可退役。

## App Legacy Repair Setting Findings

2026-05-21：`/app/repairSetting.listRepairSettings` 验证项已按“补 App H5 页面 Network”关闭。该项不是无页面入口：`apps/app/src/pages-sub/repair/add-order.vue` 导入 `getRepairSettings`，`loadRepairTypes()` 在 `onLoad()` 中触发；页面入口为 `https://01s-11-app.ruan-cat.com/#/pages-sub/repair/add-order?communityId=COMM_001`。

Runtime evidence：`apps/api/server/modules/repair/legacy-endpoints.ts` 注册 `/app/repairSetting.listRepairSettings` GET+POST，adapter 为 `legacyAdapter.listRepairSettings`，输出旧 app `{ code, msg, data }` envelope；`apps/api/server/shared/runtime/runtime-endpoints.ts` 将其标为 `app-shadow-allowlist`。DB repository 有 `rpRepairSettings` 分支，并在 DB settings 为空时保留 repair type compatibility fallback，因此不能把该项单独写成全 repair DB_READY。

Production App H5 evidence：Chrome 打开生产 App H5 页面 `https://01s-11-app.ruan-cat.com/#/pages-sub/repair/add-order?communityId=COMM_001` 后，Network 捕获 `GET https://01s-11-server.ruan-cat.com/app/repairSetting.listRepairSettings?communityId=COMM_001&publicArea=T&page=1&row=50`，status 200，response `{ code:0,msg:"query success",data:[...] }`。首条数据为 `repairType=e49c1c1d-8778-55fe-84e2-ac670440ed67`、`repairTypeName=cleaning`、`publicArea=T`、`payFeeFlag=F`、`priceScope=public_area`；response headers 含 `x-api-phase=phase3-infra`、`x-request-id=req_be8e6c6e-efe9-4855-820b-2f1aaeb27c1a` 和 `access-control-allow-origin=https://01s-11-app.ruan-cat.com`；console 无消息。Artifacts: `.tmp/phase7-dev-browser/2026-05-21-repair-setting-production-app-add-order.network-request.md`、`.network-response`、`.snapshot.txt`、`.png`。

Verification evidence：生产 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts -t "serves Batch3 repair read-only legacy endpoints over real HTTP"` 通过，1 passed、24 skipped，其中包含 `/app/repairSetting.listRepairSettings?page=1&row=1&publicArea=T`。`pnpm -F @01s-11comm/api exec vitest run tests/legacy/repair-legacy-endpoints.test.ts tests/modules/repair-db-repository.test.ts tests/runtime/legacy-fallback.test.ts` 通过，3 files 14 tests passed。`pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/repair-endpoints.test.ts src/tests/nitro-runtime/runtime-base-url.test.ts` 通过，2 files 45 tests passed。

No-go：本项只证明 `/app/repairSetting.listRepairSettings` 的生产 App H5 页面 Network 已补齐，不代表 `/app/ownerRepair.listOwnerRepairs`、`/app/dict.queryRepairStates`、`/app/ownerRepair.queryOwnerRepair` 的 2026-05-18 页面证据仍有效，不代表 `/app/ownerRepair.saveOwnerRepair` 写入口闭环，不代表 production `DB_READY`、shadow-off/fallback 复验、repair legacy 全量完成或旧 app server 可退役。

## App Legacy Repair Readonly Findings

2026-05-21: `/app/ownerRepair.listOwnerRepairs`、`/app/dict.queryRepairStates`、`/app/ownerRepair.queryOwnerRepair` 已完成生产 App H5 Chrome MCP Network 重采并勾选 `tasks.md` 对应验证项。完成口径仅限“三个目标只读端点的生产页面 Network 命中生产 `apps/api` 且返回旧 app envelope”；不沿用 2026-05-18 本地历史证据作为当前完成依据。

Caller evidence：`/app/ownerRepair.listOwnerRepairs` 的自然入口是 `apps/app/src/pages-sub/repair/order-list.vue`，页面 `onMounted()` 触发 `pagingRef.reload()`，再由 `handleQuery()` 调 `getRepairOrderList()`。`/app/dict.queryRepairStates` 的自然入口是同页 `repair-list-search-bar`，组件 immediate watcher 调 `getRepairStates()`。`/app/ownerRepair.queryOwnerRepair` 的自然入口是 `apps/app/src/pages-sub/repair/order-detail.vue`，`onLoad/onShow` 调 `loadPageData()`，再调 `getRepairDetail()`；本轮没有使用注释示例 `REP_001`，而是使用列表返回的真实 `repairId=65eba1b3-4d85-514a-836e-85c68c3b573e`。

Browser evidence：生产列表页 `https://01s-11-app.ruan-cat.com/#/pages-sub/repair/order-list?statusCd=10001&page=1&row=10` 捕获 `GET https://01s-11-server.ruan-cat.com/app/dict.queryRepairStates` status 200，旧 `{ code,msg,data }` envelope，headers 含 `x-api-phase=phase3-infra`、`x-request-id=req_33e40b38-920d-464a-8e55-5936c6b12ccd`、`access-control-allow-origin=https://01s-11-app.ruan-cat.com`；同页捕获 `GET https://01s-11-server.ruan-cat.com/app/ownerRepair.listOwnerRepairs?page=1&row=15&statusCd=10001&storeId=STORE_001&userId=USER_001&communityId=COMM_001&repairName=&reqSource=mobile` status 200，旧 `{ code,msg,data.ownerRepairs }` envelope，首条 `repairId=65eba1b3-4d85-514a-836e-85c68c3b573e`、`workOrderNumber=RT202401170003`、`statusCd=10001`，`x-request-id=req_ffa664e1-0d5e-496d-bae6-a36081d87fe8`，列表页 console 无消息。生产详情页 `https://01s-11-app.ruan-cat.com/#/pages-sub/repair/order-detail?repairId=65eba1b3-4d85-514a-836e-85c68c3b573e&storeId=STORE_001` 捕获 `GET https://01s-11-server.ruan-cat.com/app/ownerRepair.queryOwnerRepair?repairId=65eba1b3-4d85-514a-836e-85c68c3b573e&storeId=STORE_001&communityId=COMM_001` status 200，旧 `{ code,msg,data.ownerRepair }` envelope，`ownerRepair.repairId` 与列表一致，`x-request-id=req_f056de87-1d56-4948-ae0d-19939c404e47`。

Artifacts：`.tmp/phase7-dev-browser/2026-05-21-repair-readonly-production-app-order-list-list.network-request.md`、`.network-response`，`.tmp/phase7-dev-browser/2026-05-21-repair-readonly-production-app-order-list-states.network-request.md`、`.network-response`，`.tmp/phase7-dev-browser/2026-05-21-repair-readonly-production-app-order-detail-detail.network-request.md`、`.network-response`，以及 `.tmp/phase7-dev-browser/2026-05-21-repair-readonly-production-app-order-list.snapshot.txt`、`.png`、`.tmp/phase7-dev-browser/2026-05-21-repair-readonly-production-app-order-detail.snapshot.txt`、`.png`。

Verification evidence：`apps/api/tests/http/phase7-gated-http.test.ts` 的 `serves Batch3 repair read-only legacy endpoints over real HTTP` 已补 `queryOwnerRepair`：从列表响应取真实 `repairId` 后请求详情并断言旧 `{ code,msg,data.ownerRepair }` envelope、`repairId` 与列表一致且无 `success` 字段。生产 gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts -t "serves Batch3 repair read-only legacy endpoints over real HTTP"` 通过，1 passed、24 skipped；默认未设置 gate env 时同文件 25 skipped。

Side finding：详情页同次载入还请求 `/app/ownerRepair.listRepairStaffRecords?repairId=65eba1b3-4d85-514a-836e-85c68c3b573e&communityId=COMM_001`，生产响应为 status 200 但业务体 `{ success:false, code:"404", data:null }`，并产生 alova `Uncaught (in promise)` console error。该端点位于 `tasks.md` §3.5 `repair-extra` 后续列表中，不能作为本项三只读端点失败依据，也不能反向写成本项完成依据。

No-go：本项不代表 repair legacy 全量完成、生产 `DB_READY`、真实库样本完整、shadow-off/fallback 复验、`ownerRepair.saveOwnerRepair` 写入闭环、`listRepairStaffRecords` 完成或旧 app server 可退役。

## App Legacy Owner Repair Save Guard Findings

2026-05-21: `/app/ownerRepair.saveOwnerRepair` 已完成默认 guard 证据闭环并勾选 `tasks.md` 对应实施项。闭环口径是“默认保持 `409 PHASE7_MUTATION_GUARDED`，未开启写入窗口”；不是实际生产 create/read-back/rollback 完成。

Runtime evidence：`apps/api/server/modules/repair/legacy-endpoints.ts` 注册 `POST /app/ownerRepair.saveOwnerRepair`，handler 转发到 `getRepairRuntime(event).legacyAdapter.saveOwnerRepair(asRecord(body))`。`apps/api/server/modules/repair/legacy-adapter.ts` 的 `saveOwnerRepair()` 在 title/context 校验和 `service.createOwnerRepair()` 前先检查 `process.env.PHASE7_ALLOW_LEGACY_MUTATIONS === "1"`；默认返回 `legacyFailure(..., 409, { errorCode:"PHASE7_MUTATION_GUARDED" })`。`apps/api/server/shared/runtime/runtime-endpoints.ts` 将 `/app/ownerRepair.saveOwnerRepair` 纳入 guarded mutation set，manifest 状态保持 `blocked-for-execution`。

Caller boundary：`apps/app/src/pages-sub/repair/add-order.vue` 的 submit path 会调用 `createRepairOrder()`，`apps/app/src/api/repair.ts` 将其映射到 `/app/ownerRepair.saveOwnerRepair`。`apps/app/src/tests/nitro-runtime/runtime-base-url.test.ts` 仍断言该 endpoint 不在 shadow allowlist；生产 env 路由会解析到 `https://01s-11-server.ruan-cat.com/app/ownerRepair.saveOwnerRepair`。因此本轮证明生产 API guard 可达，不证明 App H5 已完成一次安全提交演练。

Verification evidence：`pnpm -F @01s-11comm/api exec vitest run tests/legacy/repair-legacy-endpoints.test.ts -t "blocks owner repair create by default in phase7 execution guard"` 通过，1 passed、3 skipped。生产 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts -t "blocks high-risk app legacy mutation endpoints by default over real HTTP"` 通过，1 passed、24 skipped，覆盖 `/app/ownerRepair.saveOwnerRepair`。直接生产 guard probe `POST https://01s-11-server.ruan-cat.com/app/ownerRepair.saveOwnerRepair` 返回 HTTP 200 但业务体 `{ code:409, data:null, errorCode:"PHASE7_MUTATION_GUARDED" }`，headers 含 `x-api-phase=phase3-infra` 和 `x-request-id=req_aa0e648e-ecd5-46f4-8d4c-eb4eb22ebfed`。同一关键词残留检查列表查询前后 `beforeTotal=3`、`afterTotal=3`。

Artifact：`.tmp/phase7-dev-browser/2026-05-21-owner-repair-save-guard-production-api.md`。

No-go：不得把本项写成生产维修工单创建完成、受控写入窗口已授权、read-back/rollback/cleanup 完成、repair 写链路放行、`ownerRepair.updateOwnerRepair` / `repairDispatch` / `repairFinish` / `repairEnd` / `repairStart` / `repairStop` 等其他流转写入口完成、生产 `DB_READY` 完成或旧 app server 可退役。

## App Legacy Owner Repair Appraise Guard Findings

2026-05-21: `/callComponent/ownerRepair.appraiseRepair` 已完成默认 guard 证据闭环并勾选 `tasks.md` 对应实施项。闭环口径是“默认保持 guarded，阻止生产评价写入”；不是实际评价写入、读回、回滚完成。

Runtime evidence：`apps/api/server/modules/repair/legacy-endpoints.ts` 注册 `POST /callComponent/ownerRepair.appraiseRepair`，handler 转发到 `getRepairRuntime(event).legacyAdapter.appraiseRepair(asRecord(body))`。`apps/api/server/modules/repair/legacy-adapter.ts` 的 `appraiseRepair()` 在 `repairId/context` 校验和 `service.appraiseRepair()` 前先检查 `process.env.PHASE7_ALLOW_LEGACY_MUTATIONS === "1"`；默认返回 `legacyFailure(..., 409, { errorCode:"PHASE7_MUTATION_GUARDED" })`。`apps/api/server/shared/runtime/runtime-endpoints.ts` 将该 URL 纳入 guarded mutation set。

Caller boundary：`apps/app/src/pages-sub/repair/appraise.vue` 的 submit path 会调用 `appraiseRepair()`，`apps/app/src/api/repair.ts` 将其映射到 `/callComponent/ownerRepair.appraiseRepair`。本轮未通过 H5 表单点击做真实评价提交，只验证生产 API 默认 guard；这避免把没有 rollback 的评价写入打到生产。

Verification evidence：`pnpm -F @01s-11comm/api exec vitest run tests/legacy/callcomponent-batch1.test.ts -t "blocks /callComponent/ownerRepair.appraiseRepair by default"` 通过，1 passed、12 skipped。生产 HTTP gate `blocks high-risk app legacy mutation endpoints by default over real HTTP` 已补 `/callComponent/ownerRepair.appraiseRepair` 并通过，1 passed、24 skipped。直接生产 guard probe `POST https://01s-11-server.ruan-cat.com/callComponent/ownerRepair.appraiseRepair` 返回 HTTP 200 但业务体 `{ code:409, data:null, errorCode:"PHASE7_MUTATION_GUARDED" }`，headers 含 `x-api-phase=phase3-infra` 和 `x-request-id=req_71b5d129-057d-44d0-912a-9482714621f9`。同一工单详情查询前后 `beforeStatus=10001`、`afterStatus=10001`、`sameRepairId=true`。

Artifact：`.tmp/phase7-dev-browser/2026-05-21-owner-repair-appraise-guard-production-api.md`。

No-go：不得把本项写成生产评价创建完成、受控写入窗口已授权、read-back/rollback/cleanup 完成、repair 评价链路放行、`repair.replyRepairAppraise` 完成、其他维修写入口完成、生产 `DB_READY` 完成或旧 app server 可退役。

## App Legacy Fee Guarded Writes Findings

2026-05-21: `/app/payment.nativeQrcodePayment`、`/app/oweFeeCallable.writeOweFeeCallable`、`/app/fee.saveRoomCreateFee` 已完成默认 guard 证据闭环并勾选 `tasks.md` 3.4 默认 guard 项。闭环口径是“默认阻止生产支付、催缴和费用创建写入”；不是实际支付/催缴/费用创建、读回、回滚完成。

Runtime evidence：`apps/api/server/modules/fee/legacy-endpoints.ts` 注册三项 POST endpoint，分别分发到 `getFeeRuntime(event).legacyAdapter.nativeQrcodePayment`、`writeOweFeeCallable`、`saveRoomCreateFee`。`apps/api/server/modules/fee/legacy-adapter.ts` 的三个方法均在调用 `service.createNativeQrcodePayment()`、`service.writeOweFeeCallable()` 或 `service.saveRoomCreateFee()` 前先检查 `process.env.PHASE7_ALLOW_LEGACY_MUTATIONS === "1"`；默认返回 `legacyFailure(..., 409, { errorCode:"PHASE7_MUTATION_GUARDED" })`。

Verification evidence：`pnpm -F @01s-11comm/api exec vitest run tests/legacy/fee-legacy-endpoints.test.ts -t "blocks payment, callable write, and fee-create actions by default in phase7 execution guard"` 通过，1 passed、4 skipped。生产 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts -t "blocks high-risk app legacy mutation endpoints by default over real HTTP"` 通过，1 passed、24 skipped，覆盖三项 endpoint。

Production probe evidence：直接生产 probes 均返回 HTTP 200 包裹旧 app 业务 409。`POST https://01s-11-server.ruan-cat.com/app/payment.nativeQrcodePayment` 返回 `errorCode=PHASE7_MUTATION_GUARDED`、`x-api-phase=phase3-infra`、`x-request-id=req_ea0f955b-bd09-4186-945b-2c2fea1460a0`。`POST https://01s-11-server.ruan-cat.com/app/oweFeeCallable.writeOweFeeCallable` 返回同类 guard，`x-request-id=req_a4450f46-abfc-462e-a2ca-15d26f819b49`。`POST https://01s-11-server.ruan-cat.com/app/fee.saveRoomCreateFee` 返回同类 guard，`x-request-id=req_c827dc1d-1088-4da7-8c53-4efc7d7f8b4c`。同一社区 `GET /app/fee.listFee?page=1&row=10&communityId=COMM_001` 在 probes 前后均为 `code=0`、`data.total=3`，可见 fee ids 保持 `FEE_001/FEE_002/FEE_003`。

Artifact：`.tmp/phase7-dev-browser/2026-05-21-fee-guarded-writes-production-api.md`。

No-go：不得把本项写成支付、催缴或费用创建可放行。仍缺受控写入窗口授权、真实 write/read-back/rollback/cleanup、residual cleanup、guard restored、生产 `DB_READY`、shadow-off/fallback 和旧 app server 退役证据。

## App Legacy Fee Report Readonly Findings

2026-05-21: `/app/feeConfig.listFeeConfigs`、`/app/reportFeeMonthStatistics.queryReportFeeSummary`、`/app/reportFeeMonthStatistics/queryPayFeeDetail`、`/app/dataReport.queryFeeDataReport` 已完成 3.3 只读验证项并勾选 `tasks.md`。闭环口径是 HTTP gate、生产响应样本、DB repository 意图测试与 shadow-off/fallback 行为证据；不是生产 `DB_READY`，也不是旧服务退役。

Runtime and data-source evidence：四个 endpoint 均在 `apps/api/server/modules/fee/legacy-endpoints.ts` 注册为 GET/POST，并经 `fee/legacy-adapter.ts` 输出旧 app `{ code,msg,data }` envelope。DB repository 分支分别读取 `exExpenseItems`、`rptExpenseSummaries`、`rptPaymentDetails`、`rptExpenseSummaries`。`apps/api/tests/modules/fee-db-repository.test.ts` 当前 7 tests passed，覆盖 fee configs、summary、pay fee detail、data report，并新增 room fee report DB 源测试作为旁证；但 `/app/reportFeeMonthStatistics.queryReportFeeDetailRoom` 仍由独立探索项约束，未在本项关闭。

Caller and fallback evidence：`apps/app/src/pages-sub/fee/create.vue` 与 `apps/app/src/pages-sub/meter/add-meter.vue` 可触发 `queryFeeConfigs()`；`apps/app/src/pages-sub/report/pay-fee-detail.vue` 可触发 `getPayFeeDetailReport()`；`apps/app/src/pages-sub/report/data-report.vue` 定义了 `getDataReport()`，但当前 `loadReport(communityInfo.communityId)` 被注释，因此本轮对 `dataReport` 采用 HTTP gate 而非自然页面 evidence。`apps/app/src/tests/nitro-runtime/runtime-base-url.test.ts` 当前 46 tests passed，明确 shadow enabled 命中 apps/api，shadow disabled 对 fee/report 四端点回到旧 runtime base。

Production evidence：生产 API 采样来自 `https://01s-11-server.ruan-cat.com`。四端点均 HTTP 200、旧 app envelope、无 `success` 字段，并带 `x-api-phase=phase3-infra`：feeConfig `x-request-id=req_d85f7da0-0dc6-4a54-82d1-daff43857574`，首两条为 `生活用水费`、`住宅物业服务费`；summary `x-request-id=req_1280b469-72ff-4029-a976-7857ab10fa93`，`curReceivableFee=80000`；payFeeDetail `x-request-id=req_0de2eb88-e56e-48c2-aa31-6aad1d2a2501`，返回两条缴费明细；dataReport `x-request-id=req_5fe877d7-1789-4003-832f-60b7e9cea6f4`，返回 `物业费` 与 `停车费` 两条统计。生产 HTTP gate `serves Batch4 fee read-only report endpoints over real HTTP` 已增强关键字段断言并通过，1 passed、24 skipped。

Legacy fallback comparison：旧 app server `https://01s-11-app-server.ruan-cat.com` 对同四端点均可读，HTTP 200，但 envelope 为 `{ success,code,message,data,timestamp }`。旧服务样本含 `CONFIG_001/CONFIG_002`、summary `curReceivableFee=924`、pay fee detail `total=200`、data report `本月应收/本月实收/欠费房屋`。这只证明旧 runtime fallback 可读，且新旧数据源存在明显差异；不能写成完整 parity 或退役候选。

Artifact：`.tmp/phase7-dev-browser/2026-05-21-fee-report-readonly-production-api.md`。

No-go：生产 `GET /__nitro/ready` 仍为 `READY_CONFIGURED`、`connected=null`、`probeEnabled=false`，不是 `DB_READY`。不得把本项外推为 `/app/fee.listFee`、`/app/fee.queryFeeDetail`、`/app/oweFeeCallable.listOweFeeCallable` join/DTO 探索完成，也不得外推为 `/app/reportFeeMonthStatistics.queryReportFeeDetailRoom` 房间维度探索完成、费用写入口可放行、旧 app server 可退役或完整新旧数据一致。

## App Legacy Fee Join And Room Report Exploration Findings

2026-05-21: 3.3 中 `/app/fee.listFee`、`/app/fee.queryFeeDetail`、`/app/oweFeeCallable.listOweFeeCallable` 和 `/app/reportFeeMonthStatistics.queryReportFeeDetailRoom` 两个探索项已关闭。关闭含义是“确认数据源、兼容 DTO 和 gap”，不是 DB_READY 或完整迁移完成。

Fee list/detail/callable finding：`apps/api/server/modules/fee/repository.ts` 的 `createDbFeeRepository(db)` 通过 `Object.assign(fallback,{...})` 只覆盖部分 DB-backed 方法，当前没有覆盖 `listLegacyFees`、`listFeeDetails`、`listOweFeeCallables`。所以 `/app/fee.listFee`、`/app/fee.queryFeeDetail`、`/app/oweFeeCallable.listOweFeeCallable` 即使在 DB runtime 下仍走 in-memory compatibility 分支。字段语义已确认：fee list 保留 fee/room/owner/amount/state 兼容 DTO；fee detail 新 API 主要返回 `data.list`，旧 app server 还会返回 `data.feeDetails`；callable list 返回 `amountdOwed/callableWayName/staffName/remark/startTime/endTime` 等催缴兼容字段。

Room report finding：`/app/reportFeeMonthStatistics.queryReportFeeDetailRoom` 分发到 `legacyAdapter.getRoomFeeReport()`，DB branch 读取 `exHouseCharges`。当前 `roomId` 与 `roomName` 都来自 `exHouseCharges.houseId`，`ownerName` 固定为空，`feeName/receivableFee/receivedFee/oweFee/stateName` 来自费用项、金额和状态映射；`floorId` 不能下推，非 UUID `communityId=COMM_001` 也不会被强行写入 UUID 列。因此它是 `db-read-with-join-gap`，不是完整房间/业主维度报表。

Production and fallback evidence：新 API `fee.listFee`、`fee.queryFeeDetail`、`oweFeeCallable.listOweFeeCallable`、`queryReportFeeDetailRoom` 均返回 HTTP 200、`x-api-phase=phase3-infra` 和旧 `{code,msg,data}` envelope，request-id 分别为 `req_e6dd00ce-9040-43cc-a4d7-1ac41f86a468`、`req_ddb66430-0c52-488d-b9cb-ee495c33d55c`、`req_4133c948-7ee3-47cc-91a7-31eea877cb7f`、`req_3c46a536-b369-45ce-8e37-33217f7a40ce`。旧 app server 同路径也可读，但 envelope 为 `{success,code,message,data,timestamp}`，且样本差异明显：旧 fee list `total=4` 而新 API `total=3`；旧 fee detail 额外包含 `data.feeDetails`；旧 room report 有 human-readable room/owner，新 API 是 `houseId` 兼容值和空 owner。

Caller evidence：`apps/app/src/pages-sub/fee/detail.vue` 调 `getFeeList()` 与 `getFeeDetail()`；`apps/app/src/pages-sub/property/apply-room-detail.vue` 通过 `getFeeDetailList()` 调 `/app/fee.queryFeeDetail`；`apps/app/src/pages-sub/fee/write-owe-callable.vue` 调 `getFeeList()` 加载待催缴费用，写入提交仍由 3.4 guard 项保护；`apps/app/src/pages-sub/report/room-fee.vue` 调 `getRoomFeeReport()`。

Artifact：`.tmp/phase7-dev-browser/2026-05-21-fee-join-and-room-report-exploration.md`。

No-go：不得把探索项关闭写成真实 DB join 完成、完整房间/楼栋/业主维度完成、生产 `DB_READY`、新旧 parity、旧 app server 退役或费用写入口可放行。后续若要升级这些端点，必须先设计并验证 fee/room/owner/payment join 和 DTO parity。

## Task 93 Dev Config Dictionary Findings

2026-05-20：task93 对应 `dev-team/config-manage/dictionary/{list,create,detail,update,delete}`。当前结论为 partial evidence，不能勾选完成。本轮确实补了 Nitro/API 代码覆盖和测试，不是只写 Markdown；但仍缺页面级 CUD、生产写入回滚、FK 删除阻断、生产 `DB_READY` 和退役证据。

Implemented evidence：新增 `apps/api/tests/admin/dev-config-manage-dictionary.test.ts`，先红灯确认 `runtimeEndpointManifest` 缺少 dictionary 五个 endpoint，再补 `apps/api/server/shared/runtime/runtime-endpoints.ts`。manifest 当前包含 `/api/dev-team/config-manage/dictionary/{list,create,detail,update,delete}` 五条 admin canonical 记录：list/create/update/delete 为 `POST`，detail 为 `GET`，phase `phase7-dev-config-manage-admin-crud`，owner `dev`，response `JsonVO`，cutover status `available-in-apps-api-not-caller-verified`。同步补强 `apps/api/tests/infra/endpoint-manifest.test.ts`、`apps/api/tests/infra/phase7-api-contracts.test.ts` 和 `apps/api/tests/http/phase7-gated-http.test.ts`；HTTP gate 只做 list + detail 只读验证，不执行生产 create/update/delete。

Source and data-source evidence：五个 route 文件位于 `apps/api/server/routes/api/dev-team/config-manage/dictionary/{list.post.ts,create.post.ts,detail.get.ts,update.post.ts,delete.post.ts}`，均从 `nitro/h3` 导入并调用 `getDevRuntime(event).adminAdapter`。dev repository 的 `listDictionary`、`createDictionary`、`getDictionaryDetail`、`updateDictionary`、`deleteDictionary` 均使用 `dtDictionaries` / `dt_dictionaries`；专项测试断言这些 CRUD 调用不混用 `dtDictionaryItems` / `dt_dictionary_items`，避免把 dictionary 与 item 子表证据混写。

Local verification：`pnpm -F @01s-11comm/api exec vitest run tests/admin/dev-config-manage-dictionary.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts` 通过，3 文件 14 测试 passed。默认 HTTP gate 未设置 env 时 `tests/http/phase7-gated-http.test.ts` 15 tests skipped。真实生产 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts` 通过，1 文件 15 测试 passed，其中 `serves dev config-manage dictionary list and detail over real HTTP` 已实际运行。`pnpm -F @01s-11comm/admin exec vitest run src/api/dev-team/config-manage/tests/phase7-shadow-resolver.test.ts` 通过，1 文件 12 测试 passed。`pnpm -F @01s-11comm/api run typecheck` 通过。

Production API partial evidence：shell 与 Chrome DevTools browser-context 均确认 `POST https://01s-11-server.ruan-cat.com/api/dev-team/config-manage/dictionary/list` 返回 200、`success=true`、`total=5`、`listCount=2`，首条 `id=0e23b1d6-f7a2-548b-9673-b17f3a4dba87`、`dictionaryName=民族`；随后 `GET https://01s-11-server.ruan-cat.com/api/dev-team/config-manage/dictionary/detail?id=0e23b1d6-f7a2-548b-9673-b17f3a4dba87` 返回 200、`success=true`、同一 id 和名称。Chrome request/response 保存为 `.tmp/phase7-dev-browser/2026-05-20-dev-team-config-manage-dictionary-list-production-api.network-request` / `.network-response` 与 `.tmp/phase7-dev-browser/2026-05-20-dev-team-config-manage-dictionary-detail-production-api.network-request` / `.network-response`；浏览器侧 x-request-id 为 `req_2123be42-2ae0-4ee5-9c6c-c0c572f9e39f`、`req_afc7f9a6-2746-4439-9a23-09949f642478`，shell x-request-id 为 `req_9450e1dd-1c59-427f-9efc-e05a6e7f21ee`、`req_365193c4-3f4e-4d62-adae-f5973a3d9907`。

Inventory and caller boundary：`route-inventory.md` 与 `route-inventory-details.csv.md` 已同步 dictionary 五行 manifest 状态，admin canonical manifest 计数从 81 更新为 86；`dev` 组只有 dictionary 五行被补 manifest，`center`、`item`、`type`、`cache-manage`、`menu-manage` 仍需单独覆盖。前端 hook `apps/admin/src/api/dev-team/config-manage/dictionary/index.ts` 目前只导出 `useDictionaryListQuery`，URL 为 `/api/dev-team/config-manage/dictionary/list`；页面 `apps/admin/src/pages/dev-team/config-manage/dictionary/index.vue` 的 add/edit dialog submit 只调用 `testAsync()` 模拟异步，delete 按钮没有真实 handler，因此不能写成页面级 create/update/delete evidence。

No-go：不得把本轮 manifest、contract、HTTP gate、production API list/detail 200 或 repository CRUD 源码能力写成 task93 完成。仍缺生产 create/update/delete 受控写入-读回-回滚证据、字典有子项时外键约束阻止删除的证据、生产 admin H5 页面 Network、生产 `DB_READY`、Neon readiness、shadow-off/fallback 和 retirement ledger；不能把 `dtDictionaries` evidence 外推到 `dtDictionaryItems`，也不能把 list/detail 只读 HTTP gate 外推为 CUD 完成。

## Task 94 Dev Config Item Findings

2026-05-20：task94 对应 `dev-team/config-manage/item/{list,create,detail,update,delete}`。当前结论为 partial evidence，不能勾选完成。本轮补了 Nitro/API 代码覆盖和测试，但仍缺页面级 CUD、生产写入回滚、生产 `DB_READY` 和退役证据。

Implemented evidence：新增 `apps/api/tests/admin/dev-config-manage-item.test.ts`，先红灯确认 `runtimeEndpointManifest` 缺少 item 五个 endpoint，再补 `apps/api/server/shared/runtime/runtime-endpoints.ts`。manifest 当前包含 `/api/dev-team/config-manage/item/{list,create,detail,update,delete}` 五条 admin canonical 记录：list/create/update/delete 为 `POST`，detail 为 `GET`，phase `phase7-dev-config-manage-admin-crud`，owner `dev`，response `JsonVO`，cutover status `available-in-apps-api-not-caller-verified`。同步补强 `apps/api/tests/infra/endpoint-manifest.test.ts`、`apps/api/tests/infra/phase7-api-contracts.test.ts` 和 `apps/api/tests/http/phase7-gated-http.test.ts`；HTTP gate 只做 list + detail 只读验证，不执行生产 create/update/delete。

Source and data-source evidence：五个 route 文件位于 `apps/api/server/routes/api/dev-team/config-manage/item/{list.post.ts,create.post.ts,detail.get.ts,update.post.ts,delete.post.ts}`，均从 `nitro/h3` 导入并调用 `getDevRuntime(event).adminAdapter`。dev repository 的 `listDictionaryItem`、`createDictionaryItem`、`getDictionaryItemDetail`、`updateDictionaryItem`、`deleteDictionaryItem` 均使用 `dtDictionaryItems` / `dt_dictionary_items`；专项测试断言这些 CRUD 调用不混用 `dtDictionaries` / `dt_dictionaries`，避免把 dictionary 主表证据混写成 item 子表证据。

Local verification：`pnpm -F @01s-11comm/api exec vitest run tests/admin/dev-config-manage-item.test.ts tests/admin/dev-config-manage-dictionary.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/http/phase7-gated-http.test.ts` 通过，4 文件 18 测试 passed + 1 文件 16 skipped。真实生产 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts` 通过，1 文件 16 测试 passed，其中 `serves dev config-manage item list and detail over real HTTP` 已实际运行。`pnpm -F @01s-11comm/admin exec vitest run src/api/dev-team/config-manage/tests/phase7-shadow-resolver.test.ts` 通过，1 文件 12 测试 passed。`pnpm -F @01s-11comm/api run typecheck` 通过。

Production API partial evidence：shell 与 Chrome DevTools browser-context 均确认 `POST https://01s-11-server.ruan-cat.com/api/dev-team/config-manage/item/list` 返回 200、`success=true`、`total=15`、`listCount=2`，首条 `id=14acbc2a-b857-5c68-b800-87f9b3312c3f`、`itemName=女`、`itemCode=female`；随后 `GET https://01s-11-server.ruan-cat.com/api/dev-team/config-manage/item/detail?id=14acbc2a-b857-5c68-b800-87f9b3312c3f` 返回 200、`success=true`、同一 id/name/code。Chrome request/response 保存为 `.tmp/phase7-dev-browser/2026-05-20-dev-team-config-manage-item-list-production-api.network-request` / `.network-response` 与 `.tmp/phase7-dev-browser/2026-05-20-dev-team-config-manage-item-detail-production-api.network-request` / `.network-response`；浏览器侧 x-request-id 为 `req_854abed4-663e-470f-897f-0995b9921b55`、`req_522a8d06-79df-4ed2-b418-0f96458b4526`，shell x-request-id 为 `req_142ed2b2-56b8-4c17-9655-1bc7f247bf7c`、`req_fb2fe508-f62e-4d6b-8dd6-4971aee3818a`。

Inventory and caller boundary：`route-inventory.md` 与 `route-inventory-details.csv.md` 已同步 item 五行 manifest 状态，admin canonical manifest 计数从 86 更新为 91；`dev` 组当前只有 dictionary 与 item 共 10 行被补 manifest，`center`、`type`、`cache-manage`、`menu-manage` 仍需单独覆盖。前端 hook `apps/admin/src/api/dev-team/config-manage/item/index.ts` 目前只导出 `useConfigItemListQuery`，URL 为 `/api/dev-team/config-manage/item/list`；页面 `apps/admin/src/pages/dev-team/config-manage/item/index.vue` 的 add/edit dialog submit 只调用 `testAsync()` 模拟异步，delete/info 按钮没有真实 handler，因此不能写成页面级 create/update/delete/detail evidence。

No-go：不得把本轮 manifest、contract、HTTP gate、production API list/detail 200 或 repository CRUD 源码能力写成 task94 完成。仍缺生产 create/update/delete 受控写入-读回-回滚证据、生产 admin H5 页面 Network、生产 `DB_READY`、Neon readiness、shadow-off/fallback 和 retirement ledger；不能把 `dtDictionaryItems` evidence 外推到 `dtDictionaries`，也不能把 list/detail 只读 HTTP gate 外推为 CUD 完成。

## Task 95 Dev Config Type Findings

2026-05-20：task95 对应 `dev-team/config-manage/type/{list,create,detail,update,delete}`。当前结论为 partial evidence，不能勾选完成。本轮补了 Nitro/API 代码覆盖和测试，但仍缺页面级 CUD、生产写入回滚、生产 `DB_READY` 和退役证据。

Implemented evidence：新增 `apps/api/tests/admin/dev-config-manage-type.test.ts`，先红灯确认 `runtimeEndpointManifest` 缺少 type 五个 endpoint，再补 `apps/api/server/shared/runtime/runtime-endpoints.ts`。manifest 当前包含 `/api/dev-team/config-manage/type/{list,create,detail,update,delete}` 五条 admin canonical 记录：list/create/update/delete 为 `POST`，detail 为 `GET`，phase `phase7-dev-config-manage-admin-crud`，owner `dev`，response `JsonVO`，cutover status `available-in-apps-api-not-caller-verified`。同步补强 `apps/api/tests/infra/endpoint-manifest.test.ts`、`apps/api/tests/infra/phase7-api-contracts.test.ts` 和 `apps/api/tests/http/phase7-gated-http.test.ts`；HTTP gate 只做 list + detail 只读验证，不执行生产 create/update/delete。

Source and data-source evidence：五个 route 文件位于 `apps/api/server/routes/api/dev-team/config-manage/type/{list.post.ts,create.post.ts,detail.get.ts,update.post.ts,delete.post.ts}`，均从 `nitro/h3` 导入并调用 `getDevRuntime(event).adminAdapter`。dev repository 的 `listDictionaryType`、`createDictionaryType`、`getDictionaryTypeDetail`、`updateDictionaryType`、`deleteDictionaryType` 均使用 `dtConfigTypes` / `dt_config_types`；专项测试断言这些 CRUD 调用不混用 `dtDictionaries` / `dt_dictionaries` 或 `dtDictionaryItems` / `dt_dictionary_items`，避免把 dictionary/item 证据混写成 type 证据。

Local verification：红灯命令 `pnpm -F @01s-11comm/api exec vitest run tests/admin/dev-config-manage-type.test.ts` 失败符合预期，4 tests 中 1 failed + 3 passed，唯一失败是 `manifest records all type CRUD endpoints with the real HTTP methods` 找不到五个 type manifest entry。补 manifest 后 `pnpm -F @01s-11comm/api exec vitest run tests/admin/dev-config-manage-type.test.ts tests/admin/dev-config-manage-item.test.ts tests/admin/dev-config-manage-dictionary.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/http/phase7-gated-http.test.ts` 通过，5 文件 22 测试 passed + 1 文件 17 skipped。真实生产 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts` 通过，1 文件 17 测试 passed，其中 `serves dev config-manage type list and detail over real HTTP` 已实际运行。`pnpm -F @01s-11comm/admin exec vitest run src/api/dev-team/config-manage/tests/phase7-shadow-resolver.test.ts` 通过，1 文件 12 测试 passed。`pnpm -F @01s-11comm/api run typecheck` 通过。

Production API partial evidence：shell 与 Chrome DevTools browser-context 均确认 `POST https://01s-11-server.ruan-cat.com/api/dev-team/config-manage/type/list` 返回 200、`success=true`、`total=3`、`listCount=2`，首条 `id=9df17c1a-5fa2-5863-bf16-c19435a6b1ac`、`typeName=系统配置`、`typeCode=system`；随后 `GET https://01s-11-server.ruan-cat.com/api/dev-team/config-manage/type/detail?id=9df17c1a-5fa2-5863-bf16-c19435a6b1ac` 返回 200、`success=true`、同一 id/name/code。Chrome request/response 保存为 `.tmp/phase7-dev-browser/2026-05-20-dev-team-config-manage-type-list-production-api.network-request` / `.network-response` 与 `.tmp/phase7-dev-browser/2026-05-20-dev-team-config-manage-type-detail-production-api.network-request` / `.network-response`；浏览器侧 x-request-id 为 `req_42d19d03-55a3-4ccc-b465-6170bbc8d601`、`req_3f1b8b16-d32d-4076-b400-51eb2cb3febf`，shell x-request-id 为 `req_caf3b445-6fb5-4d98-b1c7-71504d30ae07`、`req_e11d8c13-2136-41c7-81a8-4d0e2c6e7efb`。

Inventory and caller boundary：`route-inventory.md` 与 `route-inventory-details.csv.md` 已同步 type 五行 manifest 状态，admin canonical manifest 计数从 91 更新为 96；`dev` 组当前 dictionary、item、type 共 15 行被补 manifest，`center`、`cache-manage`、`menu-manage` 仍需单独覆盖。前端 hook `apps/admin/src/api/dev-team/config-manage/type/index.ts` 目前只导出 `useDictionaryTypeListQuery`，URL 为 `/api/dev-team/config-manage/type/list`；页面 `apps/admin/src/pages/dev-team/config-manage/type/index.vue` 只调用 list hook，add/edit/delete 是按钮占位，没有真实 handler，因此不能写成页面级 create/update/delete/detail evidence。

No-go：不得把本轮 manifest、contract、HTTP gate、production API list/detail 200 或 repository CRUD 源码能力写成 task95 完成。仍缺生产 create/update/delete 受控写入-读回-回滚证据、生产 admin H5 页面 Network、生产 `DB_READY`、Neon readiness、shadow-off/fallback 和 retirement ledger；不能把 `dtConfigTypes` evidence 外推到 `dtDictionaries` 或 `dtDictionaryItems`，也不能把 list/detail 只读 HTTP gate 外推为 CUD 完成。

## Task 96 Setting Change Password Findings

2026-05-20：task96 对应 `setting-manage/system-manage/change-password/{list,create,update,delete}`。当前结论为 partial evidence，不能勾选完成。本轮补了 Nitro/API 代码覆盖和测试，但仍缺页面级 CUD、生产写入回滚、生产 `DB_READY` 和退役证据。

Implemented evidence：新增 `apps/api/tests/admin/setting-system-change-password.test.ts`，先红灯确认 `runtimeEndpointManifest` 缺少 change-password 四个 endpoint，再补 `apps/api/server/shared/runtime/runtime-endpoints.ts`。Manifest 当前包含 `/api/setting-manage/system-manage/change-password/{list,create,update,delete}` 四条 admin canonical 记录，均为 `POST`，phase `phase7-setting-system-manage-admin-crud`，owner `setting`，response `JsonVO`，cutover status `available-in-apps-api-not-caller-verified`。同步补强 `apps/api/tests/infra/endpoint-manifest.test.ts`、`apps/api/tests/infra/phase7-api-contracts.test.ts` 和 `apps/api/tests/http/phase7-gated-http.test.ts`；HTTP gate 只做 list 只读验证，不执行生产 create/update/delete。

Source and data-source evidence：四个 route 文件位于 `apps/api/server/routes/api/setting-manage/system-manage/change-password/{list.post.ts,create.post.ts,update.post.ts,delete.post.ts}`，均从 `nitro/h3` 导入并调用 `getSettingRuntime(event).adminAdapter`。Setting repository 的 `listChangePassword`、`createChangePassword`、`updateChangePassword`、`deleteChangePassword` 均使用 `smChangePasswordRecords` / `sm_change_password_records`；专项测试断言 select/insert/update/delete 均落到该表，并覆盖 delete 缺失 id 返回 400。

Local verification：红灯命令 `pnpm -F @01s-11comm/api exec vitest run tests/admin/setting-system-change-password.test.ts` 失败符合预期，4 tests 中 1 failed + 3 passed，唯一失败是 manifest 缺失。补 manifest 后 `pnpm -F @01s-11comm/api exec vitest run tests/admin/setting-system-change-password.test.ts tests/admin/dev-config-manage-type.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/http/phase7-gated-http.test.ts` 通过，4 文件 18 tests passed + 1 文件 18 skipped。`pnpm -F @01s-11comm/api run typecheck` 通过。`pnpm -F @01s-11comm/admin exec vitest run src/api/setting-manage/system-manage/change-password/tests/index.test.ts` 通过，1 文件 3 tests passed。

Production API partial evidence：真实生产 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts` 通过，1 文件 18 tests passed，其中 `serves setting system-manage change-password list over real HTTP` 已实际运行。Shell 与 Chrome DevTools browser-context 均确认 `POST https://01s-11-server.ruan-cat.com/api/setting-manage/system-manage/change-password/list` 返回 200、`success=true`、`total=2`、`listCount=2`，首条 `id=e6aff33a-4bdd-59af-b849-b45b6e33cbff`、`username=zhangsan`、`realName=张三`、`status=success`、`changeType=initial_setup`。Chrome request/response 保存为 `.tmp/phase7-dev-browser/2026-05-20-setting-system-change-password-list-production-api.network-request` / `.network-response`；浏览器 x-request-id 为 `req_cdcf217c-ce53-4fe2-aeb8-878a07393720`，shell x-request-id 为 `req_f6b49f27-bbbc-4757-a843-22a78f8c7a56`。

Inventory and caller boundary：`route-inventory.md` 与 `route-inventory-details.csv.md` 已同步 change-password 四行 manifest 状态，admin canonical manifest 计数从 96 更新到 100。`setting` 组当前只有 change-password 四行被补 manifest；all `organize-manage` rows 和 `community-configuration`、`initialize-cell`、`register-protocol`、`system-config` 仍需单独覆盖。前端 hook `apps/admin/src/api/setting-manage/system-manage/change-password/index.ts` 当前只有 `useChangePasswordRecordListQuery`，URL 为 `/api/setting-manage/system-manage/change-password/list`，因此不能写成页面级 create/update/delete evidence。

No-go：不得把本轮 manifest、contract、HTTP gate、production API list 200 或 repository CRUD 源码能力写成 task96 完成。仍缺生产 create/update/delete 受控写入-读回-回滚证据、生产 admin H5 页面 Network、生产 `DB_READY`、Neon readiness、shadow-off/fallback 和 retirement ledger；也不能把 change-password 四行覆盖外推为 setting system-manage 20 个文件或 setting 全量 28 个 route 完成。

## Task 97 Setting Community Configuration Findings

2026-05-20：task97 对应 `setting-manage/system-manage/community-configuration/{list,create,update,delete}`。当前结论为 partial evidence，不能勾选完成。本轮补了 Nitro/API 代码覆盖和测试，但仍缺页面级 CUD、生产写入回滚、生产 `DB_READY` 和退役证据。

Implemented evidence：新增 `apps/api/tests/admin/setting-system-community-configuration.test.ts`，先红灯确认 `runtimeEndpointManifest` 缺少 community-configuration 四个 endpoint，再补 `apps/api/server/shared/runtime/runtime-endpoints.ts`。Manifest 当前包含 `/api/setting-manage/system-manage/community-configuration/{list,create,update,delete}` 四条 admin canonical 记录，均为 `POST`，phase `phase7-setting-system-manage-admin-crud`，owner `setting`，response `JsonVO`，cutover status `available-in-apps-api-not-caller-verified`。同步补强 `apps/api/tests/infra/endpoint-manifest.test.ts`、`apps/api/tests/infra/phase7-api-contracts.test.ts` 和 `apps/api/tests/http/phase7-gated-http.test.ts`；HTTP gate 只做 list 只读验证，不执行生产 create/update/delete。

Source and data-source evidence：四个 route 文件位于 `apps/api/server/routes/api/setting-manage/system-manage/community-configuration/{list.post.ts,create.post.ts,update.post.ts,delete.post.ts}`，均从 `nitro/h3` 导入并调用 `getSettingRuntime(event).adminAdapter`。Setting repository 的 `listCommunityConfiguration`、`createCommunityConfiguration`、`updateCommunityConfiguration`、`deleteCommunityConfiguration` 均使用 `smCommunityConfigurations` / `sm_community_configurations`；专项测试断言 select/insert/update/delete 均落到该表，并覆盖 delete 缺失 id 返回 400。

Local verification：红灯命令 `pnpm -F @01s-11comm/api exec vitest run tests/admin/setting-system-community-configuration.test.ts` 失败符合预期，4 tests 中 1 failed + 3 passed，唯一失败是 manifest 缺失。补 manifest 后 `pnpm -F @01s-11comm/api exec vitest run tests/admin/setting-system-community-configuration.test.ts tests/admin/setting-system-change-password.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/http/phase7-gated-http.test.ts` 通过，4 文件 18 tests passed + 1 文件 19 skipped。`pnpm -F @01s-11comm/api run typecheck` 通过。`pnpm -F @01s-11comm/admin exec vitest run src/api/setting-manage/system-manage/community-configuration/tests/index.test.ts` 通过，1 文件 3 tests passed。

Production API partial evidence：真实生产 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts` 通过，1 文件 19 tests passed，其中 `serves setting system-manage community-configuration list over real HTTP` 已实际运行。Shell 与 Chrome DevTools browser-context 均确认 `POST https://01s-11-server.ruan-cat.com/api/setting-manage/system-manage/community-configuration/list` 返回 200、`success=true`、`total=3`、`listCount=2`，首条 `id=8ef5f334-f6eb-53a0-a2a7-208a7684c519`、`communityName=阳光花园`、`settingName=物业费标准`、`settingType=fee`、`statusCd=0`。Chrome request/response 保存为 `.tmp/phase7-dev-browser/2026-05-20-setting-system-community-configuration-list-production-api.network-request` / `.network-response`；浏览器 x-request-id 为 `req_a62e2063-5ac4-4a46-8dff-8c58ad84e605`，shell x-request-id 为 `req_49dedc9f-4786-4243-bef4-3adbbc65c524`。

Inventory and caller boundary：`route-inventory.md` 与 `route-inventory-details.csv.md` 已同步 community-configuration 四行 manifest 状态，admin canonical manifest 计数从 100 更新到 104。`setting` 组当前只有 change-password 和 community-configuration 共八行被补 manifest；all `organize-manage` rows 和 `initialize-cell`、`register-protocol`、`system-config` 仍需单独覆盖。前端 hook `apps/admin/src/api/setting-manage/system-manage/community-configuration/index.ts` 当前只有 `useCommunityConfigurationListQuery`，URL 为 `/api/setting-manage/system-manage/community-configuration/list`；页面 `apps/admin/src/pages/setting-manage/system-manage/community-configuration/index.vue` 的 add/edit/info dialog 存在，但提交按钮仍调用 `testAsync()` 模拟操作，delete 按钮无真实 handler，因此不能写成页面级 create/update/delete evidence。

No-go：不得把本轮 manifest、contract、HTTP gate、production API list 200 或 repository CRUD 源码能力写成 task97 完成。仍缺生产 create/update/delete 受控写入-读回-回滚证据、生产 admin H5 页面 Network、生产 `DB_READY`、Neon readiness、shadow-off/fallback 和 retirement ledger；也不能把 community-configuration 四行覆盖外推为 setting system-manage 20 个文件或 setting 全量 28 个 route 完成。

## Task 98 Setting Initialize Cell Findings

2026-05-20：task98 对应 `setting-manage/system-manage/initialize-cell/{list,create,update,delete}`。当前结论为 partial evidence，不能勾选完成。本轮补了 Nitro/API 代码覆盖和测试，但仍缺页面级 CUD、生产写入回滚、生产 `DB_READY` 和退役证据。

Implemented evidence：新增 `apps/api/tests/admin/setting-system-initialize-cell.test.ts`，先红灯确认 `runtimeEndpointManifest` 缺少 initialize-cell 四个 endpoint，再补 `apps/api/server/shared/runtime/runtime-endpoints.ts`。Manifest 当前包含 `/api/setting-manage/system-manage/initialize-cell/{list,create,update,delete}` 四条 admin canonical 记录，均为 `POST`，phase `phase7-setting-system-manage-admin-crud`，owner `setting`，response `JsonVO`，cutover status `available-in-apps-api-not-caller-verified`。同步补强 `apps/api/tests/infra/endpoint-manifest.test.ts`、`apps/api/tests/infra/phase7-api-contracts.test.ts` 和 `apps/api/tests/http/phase7-gated-http.test.ts`；HTTP gate 只做 list 只读验证，不执行生产 create/update/delete。

Source and data-source evidence：四个 route 文件位于 `apps/api/server/routes/api/setting-manage/system-manage/initialize-cell/{list.post.ts,create.post.ts,update.post.ts,delete.post.ts}`，均从 `nitro/h3` 导入并调用 `getSettingRuntime(event).adminAdapter`。Setting repository 的 `listInitializeCell`、`createInitializeCell`、`updateInitializeCell`、`deleteInitializeCell` 均使用 `smInitializeCells` / `sm_initialize_cells`；专项测试断言 select/insert/update/delete 均落到该表，并覆盖 delete 缺失 id 返回 400。

Local verification：红灯命令 `pnpm -F @01s-11comm/api exec vitest run tests/admin/setting-system-initialize-cell.test.ts` 失败符合预期，4 tests 中 1 failed + 3 passed，唯一失败是 manifest 缺失。补 manifest 后 `pnpm -F @01s-11comm/api exec vitest run tests/admin/setting-system-initialize-cell.test.ts tests/admin/setting-system-community-configuration.test.ts tests/admin/setting-system-change-password.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/http/phase7-gated-http.test.ts` 通过，5 文件 22 tests passed + 1 文件 20 skipped。`pnpm -F @01s-11comm/api run typecheck` 通过。`pnpm -F @01s-11comm/admin exec vitest run src/api/setting-manage/system-manage/initialize-cell/tests/index.test.ts` 通过，1 文件 3 tests passed。

Production API partial evidence：真实生产 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts` 通过，1 文件 20 tests passed，其中 `serves setting system-manage initialize-cell list over real HTTP` 已实际运行。Shell 与 Chrome DevTools browser-context 均确认 `POST https://01s-11-server.ruan-cat.com/api/setting-manage/system-manage/initialize-cell/list` 返回 200、`success=true`、`total=3`、`listCount=2`，首条 `id=17e5bba4-a1d5-56e8-af0e-f33606990125`、`initItem=数据库初始化`、`initStatus=completed`、`configParams={"tables":45,"migrated":true}`。Chrome request/response 保存为 `.tmp/phase7-dev-browser/2026-05-20-setting-system-initialize-cell-list-production-api.network-request` / `.network-response`；浏览器 x-request-id 为 `req_d55ba03c-5aec-4550-9fe5-469d0cb79c47`，shell x-request-id 为 `req_9b0d26ea-df51-4540-a923-dbd8d4fe72e4`。

Inventory and caller boundary：`route-inventory.md` 与 `route-inventory-details.csv.md` 已同步 initialize-cell 四行 manifest 状态，admin canonical manifest 计数从 104 更新到 108。`setting` 组当前只有 change-password、community-configuration 和 initialize-cell 共十二行被补 manifest；all `organize-manage` rows 和 `register-protocol`、`system-config` 仍需单独覆盖。前端 hook `apps/admin/src/api/setting-manage/system-manage/initialize-cell/index.ts` 当前只有 `useInitializeCommunityListQuery`，URL 为 `/api/setting-manage/system-manage/initialize-cell/list`；页面 `apps/admin/src/pages/setting-manage/system-manage/initialize-cell/index.vue` 的 add/edit submit 与 format dialog 仍调用 `testAsync()` 模拟操作，操作列没有真实 delete handler，因此不能写成页面级 create/update/delete evidence。

No-go：不得把本轮 manifest、contract、HTTP gate、production API list 200 或 repository CRUD 源码能力写成 task98 完成。仍缺生产 create/update/delete 受控写入-读回-回滚证据、生产 admin H5 页面 Network、生产 `DB_READY`、Neon readiness、shadow-off/fallback 和 retirement ledger；也不能把 initialize-cell 四行覆盖外推为 setting system-manage 20 个文件或 setting 全量 28 个 route 完成。

## Task 99 Setting Register Protocol Findings

2026-05-21：task99 对应 `setting-manage/system-manage/register-protocol/{list,create,update,delete}`。当前结论为 partial evidence，不能勾选完成。本轮补了 Nitro/API 代码覆盖和测试，但仍缺页面级 CUD、生产写入回滚、生产 `DB_READY` 和退役证据。

Implemented evidence：新增 `apps/api/tests/admin/setting-system-register-protocol.test.ts`，先红灯确认 `runtimeEndpointManifest` 缺少 register-protocol 四个 endpoint，再补 `apps/api/server/shared/runtime/runtime-endpoints.ts`。manifest 当前包含 `/api/setting-manage/system-manage/register-protocol/{list,create,update,delete}` 四条 admin canonical 记录，均为 `POST`，phase `phase7-setting-system-manage-admin-crud`，owner `setting`，response `JsonVO`，cutover status `available-in-apps-api-not-caller-verified`。同步补强 `apps/api/tests/infra/endpoint-manifest.test.ts`、`apps/api/tests/infra/phase7-api-contracts.test.ts` 和 `apps/api/tests/http/phase7-gated-http.test.ts`；HTTP gate 只做 list 只读验证，不执行生产 create/update/delete。

Source and data-source evidence：四个 route 文件位于 `apps/api/server/routes/api/setting-manage/system-manage/register-protocol/{list.post.ts,create.post.ts,update.post.ts,delete.post.ts}`，均从 `nitro/h3` 导入并调用 `getSettingRuntime(event).adminAdapter`。Setting repository 的 `listRegisterProtocol`、`createRegisterProtocol`、`updateRegisterProtocol`、`deleteRegisterProtocol` 均使用 `smRegisterProtocols` / `sm_register_protocols`；专项测试断言 select/insert/update/delete 均落到该表，并覆盖 delete 缺失 id 返回 400。

Local verification：红灯命令 `pnpm -F @01s-11comm/api exec vitest run tests/admin/setting-system-register-protocol.test.ts` 按预期失败，4 tests 中 1 failed + 3 passed，唯一失败是 manifest 缺失。补 manifest 后 `pnpm -F @01s-11comm/api exec vitest run tests/admin/setting-system-register-protocol.test.ts tests/admin/setting-system-change-password.test.ts tests/admin/setting-system-community-configuration.test.ts tests/admin/setting-system-initialize-cell.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/http/phase7-gated-http.test.ts` 通过，6 文件 26 tests passed + 1 文件 21 skipped。`pnpm -F @01s-11comm/api run typecheck` 通过。`pnpm -F @01s-11comm/admin exec vitest run src/api/setting-manage/system-manage/register-protocol/tests/index.test.ts` 通过，1 文件 3 tests passed。

Production API partial evidence：真实生产 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts` 通过，1 文件 21 tests passed，其中 `serves setting system-manage register-protocol list over real HTTP` 已实际运行。Shell 与 Chrome DevTools browser-context 均确认 `POST https://01s-11-server.ruan-cat.com/api/setting-manage/system-manage/register-protocol/list` 返回 200、`success=true`、`code=200`、`message=查询成功`、`total=2`、`listCount=2`、`hasMsg=false`，首条 `id=4e9782ef-24e3-52bf-88de-b412e3ce4d9c`、`title=用户注册协议`、`version=v1.0.0`、`status=enabled`。Chrome request/response 保存为 `.tmp/phase7-dev-browser/2026-05-21-setting-system-register-protocol-list-production-api.network-request` / `.network-response`；浏览器 x-request-id 为 `req_fe161693-aedc-43e7-a05c-9f3b5577491e`，shell x-request-id 为 `req_277a6dcc-e586-43c2-b202-d9510e80665c`。

Inventory and caller boundary：`route-inventory.md` 与 `route-inventory-details.csv.md` 已同步 register-protocol 四行 manifest 状态，admin canonical manifest 计数从 108 更新到 112，`setting` manifest 行数从 12 更新到 16。前端 hook `apps/admin/src/api/setting-manage/system-manage/register-protocol/index.ts` 当前只有 `useRegisterProtocolListQuery`，URL 为 `/api/setting-manage/system-manage/register-protocol/list`；页面 `apps/admin/src/pages/setting-manage/system-manage/register-protocol/index.vue` 只读取列表首条协议并展示 `title/content`，没有真实 create/update/delete hook、提交按钮、删除 handler 或页面级 CUD 调用，因此不能写成页面级 create/update/delete evidence。

No-go：不得把本轮 manifest、contract、HTTP gate、production API list 200 或 repository CRUD 源码能力写成 task99 完成。仍缺生产 create/update/delete 受控写入-读回-回滚证据、生产 admin H5 页面 Network、生产 `DB_READY`、Neon readiness、shadow-off/fallback 和 retirement ledger；也不能把 register-protocol 四行覆盖外推为 setting system-manage 20 个文件或 setting 全量 28 个 route 完成。

## Task 100 Setting System Config Findings

2026-05-21：task100 对应 `setting-manage/system-manage/system-config/{list,create,update,delete}`。当前结论为 partial evidence，不能勾选完成。本轮补了 Nitro/API 代码覆盖和测试，但仍缺页面级 CUD、生产写入回滚、生产 `DB_READY` 和退役证据。

Implemented evidence：新增 `apps/api/tests/admin/setting-system-config.test.ts`，先红灯确认 `runtimeEndpointManifest` 缺少 system-config 四个 endpoint，再补 `apps/api/server/shared/runtime/runtime-endpoints.ts`。Manifest 当前包含 `/api/setting-manage/system-manage/system-config/{list,create,update,delete}` 四条 admin canonical 记录，均为 `POST`，phase `phase7-setting-system-manage-admin-crud`，owner `setting`，response `JsonVO`，cutover status `available-in-apps-api-not-caller-verified`。同步补强 `apps/api/tests/infra/endpoint-manifest.test.ts`、`apps/api/tests/infra/phase7-api-contracts.test.ts` 和 `apps/api/tests/http/phase7-gated-http.test.ts`；HTTP gate 只做 list 只读验证，不执行生产 create/update/delete。

Source and data-source evidence：四个 route 文件位于 `apps/api/server/routes/api/setting-manage/system-manage/system-config/{list.post.ts,create.post.ts,update.post.ts,delete.post.ts}`，均从 `nitro/h3` 导入并调用 `getSettingRuntime(event).adminAdapter`。Setting repository 的 `listSystemConfig`、`createSystemConfig`、`updateSystemConfig`、`deleteSystemConfig` 均使用 `smSystemConfigs` / `sm_system_configs`；专项测试断言 select/insert/update/delete 均落到该表，并覆盖 delete 缺失 id 返回 400。

Local verification：红灯命令 `pnpm -F @01s-11comm/api exec vitest run tests/admin/setting-system-config.test.ts` 按预期失败，4 tests 中 1 failed + 3 passed，唯一失败是 manifest 缺失。补 manifest 后 `pnpm -F @01s-11comm/api exec vitest run tests/admin/setting-system-config.test.ts tests/admin/setting-system-register-protocol.test.ts tests/admin/setting-system-initialize-cell.test.ts tests/admin/setting-system-community-configuration.test.ts tests/admin/setting-system-change-password.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/http/phase7-gated-http.test.ts` 通过，7 文件 30 tests passed + 1 文件 22 skipped。`pnpm -F @01s-11comm/api run typecheck` 通过。`pnpm -F @01s-11comm/admin exec vitest run src/api/setting-manage/system-manage/system-config/tests/index.test.ts` 通过，1 文件 3 tests passed。

Production API partial evidence：真实生产 HTTP gate `$env:RUN_PHASE7_HTTP_TESTS='1'; $env:PHASE7_API_BASE_URL='https://01s-11-server.ruan-cat.com'; pnpm -F @01s-11comm/api exec vitest run tests/http/phase7-gated-http.test.ts` 通过，1 文件 22 tests passed，其中 `serves setting system-manage system-config list over real HTTP` 已实际运行。Shell 与 Chrome DevTools browser-context 均确认 `POST https://01s-11-server.ruan-cat.com/api/setting-manage/system-manage/system-config/list` 返回 200、`success=true`、`code=200`、`message=查询成功`、`total=1`、`listCount=1`、`hasMsg=false`，首条 `id=fc60b62e-d530-5fec-80e1-11f45f84f4de`、`configKey=system.config`、`category=""`、`title=system.config`；Chrome request/response 保存为 `.tmp/phase7-dev-browser/2026-05-21-setting-system-config-list-production-api.network-request` / `.network-response`，浏览器 x-request-id 为 `req_6d8841ed-8bf3-4e63-9790-715ce6aaa745`，shell x-request-id 为 `req_0b2429bf-3601-4239-add3-1bcc31bb93f4`。

Inventory and caller boundary：`route-inventory.md` 与 `route-inventory-details.csv.md` 已同步 system-config 四行 manifest 状态，admin canonical manifest 计数从 112 更新到 116，`setting` manifest 行数从 16 更新到 20。前端 hook `apps/admin/src/api/setting-manage/system-manage/system-config/index.ts` 当前只有 `useSystemConfigListQuery`，URL 为 `/api/setting-manage/system-manage/system-config/list`；页面 `apps/admin/src/pages/setting-manage/system-manage/system-config/index.vue` 有编辑表单但提交仍调用 `testAsync()` 并保留 TODO，因此不能写成页面级 create/update/delete evidence。

No-go：不得把本轮 manifest、contract、HTTP gate、production API list 200 或 repository CRUD 源码能力写成 task100 完成。仍缺生产 create/update/delete 受控写入-读回-回滚证据、生产 admin H5 页面 Network、生产 `DB_READY`、Neon readiness、shadow-off/fallback 和 retirement ledger；也不能把 system-config 四行覆盖外推为 setting system-manage 20 个 endpoint 完成或 setting 全量 28 个 route 完成。

## Task 101 Contract Change/Draft CRUD Findings

2026-05-21：task101 对应 `property-manage/contract-manage/change/{create,detail,update,delete}` 与 `property-manage/contract-manage/draft-contract/{create,detail,update,delete}`。当前结论为 partial evidence，不能勾选完成。本轮补了 local apps/api Nitro/API 代码覆盖和测试，但仍缺生产 CUD、write-read-rollback、生产 admin H5 Network、生产 `DB_READY` 和退役证据。

Implemented evidence：`apps/api/server/shared/runtime/runtime-endpoints.ts` 当前包含 8 条 admin canonical POST manifest，phase `phase7-contract-manage-admin-crud`，owner `contract`，response `JsonVO`，cutover status `available-in-apps-api-not-caller-verified`。8 个 route 文件位于 `apps/api/server/routes/api/property-manage/contract-manage/change/{create.post.ts,detail.post.ts,update.post.ts,delete.post.ts}` 与 `apps/api/server/routes/api/property-manage/contract-manage/draft-contract/{create.post.ts,detail.post.ts,update.post.ts,delete.post.ts}`，均从 `nitro/h3` 导入并调用 `getContractRuntime(event).adminAdapter`，未直接走旧 `apps/admin/server` service。

Source and data-source evidence：`apps/api/tests/admin/contract-change-draft-crud.test.ts` 断言 8 个 route 分别调用 contract runtime adapter 的 `createChange/getChangeDetail/updateChange/deleteChange/createDraftContract/getDraftContractDetail/updateDraftContract/deleteDraftContract`。同一测试还断言 DB repository 的 change CRUD 使用 `ctChanges` / `ct_changes`，draft-contract CRUD 使用 `ctContracts` / `ct_contracts`，并覆盖 detail/delete 缺失 id 返回 400。

Local verification：`pnpm -F @01s-11comm/api exec vitest run tests/admin/contract-change-draft-crud.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/http/phase7-gated-http.test.ts` 通过，3 文件 15 tests passed + 1 文件 22 skipped。默认 HTTP gate 未设置 `RUN_PHASE7_HTTP_TESTS=1` 和 `PHASE7_API_BASE_URL` 时仍 skipped，本轮没有把 create/update/delete 写入生产环境。`pnpm -F @01s-11comm/api run typecheck` 通过；`openspec validate migrate-superpowers-docs-to-openspec-longtask --strict` 通过。

Inventory and caller boundary：`route-inventory.md` 与 `route-inventory-details.csv.md` 已同步 8 行 manifest 状态，contract manifest 行数从 12 更新到 20。独立复核在 2026-05-21 纠正当前 inventory 总数：按 `runtime-endpoints.ts` 实际状态，admin canonical manifest rows 为 136，contract rows 为 20；此前 task101 记录中的 `116 -> 124` 只反映局部旧计数，后续以修正后的 inventory 为准。该状态只表示 local apps/api manifest/contract coverage，不表示 caller 已在生产页面命中新 API。`contract-manage/upload/*` 5 个 R2 multipart route 仍单独阻断，不属于 task101 完成范围。

No-go：不得把本轮 manifest、route、adapter、repository、Vitest 或 skipped HTTP gate 写成 task101 完成。仍缺生产 create/detail/update/delete 实际请求证据、受控写入-读回-回滚和清理证据、生产 admin H5 页面 Network、生产 `DB_READY`、Neon readiness、shadow-off/fallback 和 retirement ledger；也不能把 change/draft-contract 8 行覆盖外推为 upload/R2 完成、contract-manage 25 个 route 全量完成或旧 `apps/admin/server` 可退役。

## Edge Route Setting Org Tree Findings

2026-05-21: edge route task covers `org-info/tree`, `j1-dashboard/center/commonmenu/get`, and `debug-env.get`. Current conclusion is partial evidence, not task completion.

Implemented evidence: `org-info/tree` is the only one of the three promoted to local apps/api admin contract coverage. `apps/api/server/routes/api/setting-manage/organize-manage/org-info/tree.post.ts` dispatches to `getSettingRuntime(event).adminAdapter.getOrgInfoTree`; `apps/api/server/modules/setting/admin-adapter.ts` now calls `service.getOrgInfoTree`; `apps/api/server/modules/setting/service.ts` exposes the repository method; `apps/api/server/modules/setting/repository.ts` reads `smOrganizations` / `sm_organizations`, orders by `sortOrder` and `orgName`, and builds `OrganizationTreeNode[]` parent-child data. `apps/api/server/shared/runtime/runtime-endpoints.ts` now includes `/api/setting-manage/organize-manage/org-info/tree` as admin canonical POST with phase `phase7-setting-organize-manage-admin-edge`, owner `setting`, response `JsonVO`, and status `available-in-apps-api-not-caller-verified`.

Contract and exclusion evidence: `apps/api/tests/admin/setting-organize-edge-routes.test.ts` first failed for the expected reasons: missing manifest row, adapter returned `data: []`, and repository lacked `getOrgInfoTree`. After implementation it verifies manifest coverage, route-to-adapter dispatch, adapter/service/repository tree behavior, and repository table intent. The same test asserts `debug-env.get.ts` and `j1-dashboard/center/commonmenu/get.ts` are not in `runtimeEndpointManifest`; `debug-env` is diagnostic-only (`nodeEnv` + `nitro: true`) and `commonmenu/get` is still a placeholder file route returning `[]` with no proven business module or real caller.

Verification evidence: `pnpm -F @01s-11comm/api exec vitest run tests/admin/setting-organize-edge-routes.test.ts` passed after the red/green cycle, 1 file 5 tests passed. `pnpm -F @01s-11comm/api exec vitest run tests/admin/setting-organize-edge-routes.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts` passed, 3 files 16 tests passed. `pnpm -F @01s-11comm/api run typecheck` passed.

Local admin H5 browser evidence: `org-info/tree` now has local Chrome DevTools MCP page Network evidence. Local dev services were `apps/api` on `http://127.0.0.1:3102` and `apps/admin` on `http://127.0.0.1:8080`, with admin shadow env set to proxy `/api-shadow` to the local API base. The business route was `http://127.0.0.1:8080/#/setting-manage/organize-manage/org-info`; after injecting a minimal local login state, Network recorded `POST http://127.0.0.1:8080/api-shadow/api/setting-manage/organize-manage/org-info/tree` with status 200 and a `JsonVO` organization tree response. Artifacts are `.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-tree-local-admin-page.network-request`, `.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-tree-local-admin-page.network-response`, `.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-tree-local-admin-page.snapshot.txt`, and `.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-tree-local-admin-page.png`. `org-info/list` also returned 200 through `/api-shadow` on the same page and was saved as a side artifact, but it remains `manifest-missing` and must not be upgraded from this evidence.

Production API blocker: `apps/api/package.json` declares production API homepage `https://01s-11-server.ruan-cat.com`. Production read-only sampling on 2026-05-21 showed `GET /__nitro/ready` returning `READY_CONFIGURED` with `checks.database.connected=null` and `probeEnabled=false`, so this is not `DB_READY`. `POST /api/setting-manage/organize-manage/org-info/tree` returned 200 with `success=true`, `code=200`, but `data=[]`. The same production API returned 5 organization rows for `POST /api/setting-manage/organize-manage/org-info/list` (`total=5`, first row `总公司/HQ`). This combination means production API reachability exists, but production DB-backed tree behavior is not proven and should be treated as a deployment/runtime blocker until tree returns the expected hierarchy in production. Chrome artifacts are `.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-tree-production-api.chrome.network-request`, `.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-tree-production-api.chrome.network-response`, `.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-list-production-api.chrome.network-request`, `.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-list-production-api.chrome.network-response`, `.tmp/phase7-dev-browser/2026-05-21-api-ready-production-api.chrome.network-request`, and `.tmp/phase7-dev-browser/2026-05-21-api-ready-production-api.chrome.network-response`.

Production admin H5 blocker: `apps/admin/package.json` declares production admin homepage `https://01s-11comm.ruan-cat.com`. After injecting a minimal local browser login state, Chrome reached `https://01s-11comm.ruan-cat.com/#/setting-manage/organize-manage/org-info`. Network shows the production page directly calling `POST https://01s-11-server.ruan-cat.com/api/setting-manage/organize-manage/org-info/tree` with status 200 and `data=[]`; it also calls `POST https://01s-11-server.ruan-cat.com/api/setting-manage/organize-manage/org-info/list` with status 200 and 5 rows. The page snapshot shows the organization tree container empty while the table has 5 rows. Artifacts are `.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-tree-production-admin-page.network-request`, `.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-tree-production-admin-page.network-response`, `.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-list-production-admin-page.network-request`, `.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-list-production-admin-page.network-response`, `.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-tree-production-admin-page.snapshot.txt`, and `.tmp/phase7-dev-browser/2026-05-21-setting-organize-org-info-tree-production-admin-page.png`. This proves production admin H5 caller routing to `apps/api`, but it also confirms the production tree data blocker.

Inventory boundary: `route-inventory.md` and `route-inventory-details.csv.md` now count 137 admin canonical manifest rows and 21 `setting` rows. This update only upgrades `org-info/tree`; the remaining `setting-manage/organize-manage` rows remain manifest-missing.

No-go: do not mark the edge route task complete yet. Missing evidence still includes production `DB_READY`, production tree data parity, shadow-off/fallback, and retirement ledger. Do not treat `debug-env` or `commonmenu/get` as business migration rows, and do not infer `setting-manage/organize-manage` full coverage from the single `org-info/tree` row.

## App Notice Profile Video Test Exploration Findings

2026-05-21: §3.5 `notice/profile/video` and `test` exploration is closed as triage, not as independent `apps/api` migration.

`notice/profile/video` are legacy App H5 runtime modules with real App page callers, but independent `apps/api` has no exact registry entries for the nine paths. Production `apps/api` currently returns 200 for those `/app/**` paths only because `legacy-dispatch` falls back to `https://01s-11-app-server.ruan-cat.com` after registry 404. The response envelope is `{ success, code, message, data, timestamp }`, which is old App server shape, not the `apps/api` exact app legacy `{ code, msg, data }` contract used by migrated fee/floor/repair handlers. Therefore these nine endpoints must remain `legacy-fallback/mock-like` until a future slice adds explicit manifest/allowlist/contract/guard and repository decisions.

`profile.changeCommunity` and `profile.changePassword` are mutation-like operations in the old in-memory profile repository. Current production 200 samples are fallback evidence and do not prove a Phase7 guarded exact handler. A future migration must not copy them as open writes; it needs an explicit guard, write/read-back/rollback model, and a decision on whether these are mock-only, public profile operations, or real account/community state changes.

`video.getPlayVideoUrl` returns sample media from `interactive-examples.mdn.mozilla.net` with the machine id appended. That is useful compatibility evidence but not a real camera/video integration and not DB evidence.

`/test`, `/test/params`, and `/test/error` are diagnostic/mock routes. Independent `apps/api` production returns 404 for all three because only `/app/**` and `/callComponent/**` enter legacy fallback. The old app server returns H5 HTML for `/test*`, not diagnostic JSON. These routes should be excluded from business endpoint completion percentage and retirement ledgers unless a later explicit diagnostic-route decision says otherwise.

Tooling gotcha: PowerShell `Invoke-WebRequest -SkipHttpErrorCheck` and direct `[System.Net.Http.HttpClient]` sampling both failed in this shell before HTTP conclusions could be made. The accepted production evidence was collected with Node 22 `fetch`; do not reuse the earlier PowerShell errors as endpoint status evidence.

No-go: this finding does not prove `DB_READY`, exact `apps/api` handlers, real DB samples, profile write safety, shadow-off/fallback retirement, or old app server retirement.

## App Room Unit Exploration Findings

2026-05-21: §3.5 `room/unit` exploration is closed as ID-semantics and fallback triage, not independent `apps/api` migration.

`apps/app/server/modules/unit/repository.ts` generates synthetic IDs such as `F_COMM_001_001` and `U_COMM_001_001_01`. `apps/app/server/modules/room/repository.ts` generates synthetic IDs such as `R_COMM_001_001_01_01`. These values are old App compatibility/mock identifiers. They must not be described as real database primary keys, real building/unit/room foreign keys, or proof that downstream DB joins are safe.

Production `apps/api` returns HTTP 200 for `/app/unit.queryUnits`, `/app/unit.queryUnitDetail`, `/app/room.queryRooms`, and `/app/room.queryRoomDetail`, but the response envelope is `{ success, code, message, data, timestamp }`. Independent `apps/api` has no exact room/unit app legacy registry entries, so these are legacy fallback proxy samples from the old app server, not migrated exact handlers. Current ready evidence is still `READY_CONFIGURED` with database probe disabled, not `DB_READY`.

Caller coverage exists in `apps/app/src/api/unit.ts`, `apps/app/src/api/room.ts`, `pages-sub/property/unit-list.vue`, `room-list.vue`, and `room-detail.vue`; that proves App H5 has consumers, not that the consumers have cut over to exact `apps/api` handlers.

A future migration should either map compatibility IDs to schema-backed real keys explicitly or preserve them as documented compatibility IDs in a new exact handler. It must not silently mix the synthetic `F/U/R_COMM_*` namespace with real UUID-backed schema rows.

No-go: this finding does not prove DB-backed room/unit reads, App H5 production page Network, shadow-off/fallback retirement, or old app server retirement.

## App Contact Exploration Findings

2026-05-21: Section 3.5 `contact` exploration is closed as server-only/fallback/mutation-risk triage, not as independent `apps/api` migration.

`apps/app/server/modules/contact/endpoints.ts` defines eight old App runtime endpoints and `apps/app/server/shared/runtime/runtime-endpoints.ts` includes them. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register contact exact handlers, so production 200 responses for `/app/contact.*` are old App server fallback samples through `legacy-dispatch`, not migrated exact handlers.

The old contact repository is in-memory and mock/randomized. It generates `CON_001` through `CON_030`, uses randomized names/phones/departments/positions/online states, and uses `Math.random()` inside `getFavoriteContacts()`. Therefore favorite-contact output is volatile and cannot be used as deterministic new/old parity evidence. Emergency contacts are compatibility samples such as `EMG_001` and `400-888-9999`.

Current caller scan did not find a normal `apps/app/src/api/contact.ts` wrapper or ordinary App H5 business page caller for `/app/contact.*`. Found callers are limited to Vite mock wrapping, types/constants, tests, icons, and unrelated contact-phone UI fields. This makes the module server-only in the current App H5 caller scan, but server-only does not authorize deletion.

`/app/contact.updateOnlineStatus` is a POST mutation in the old runtime and mutates the in-memory contact object. No production POST was executed in this slice. If retained in independent `apps/api`, it needs an explicit default guard, controlled write window, read-back, rollback/cleanup, and residual check. It must not be migrated as an open production write.

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.

No-go: this finding does not prove exact `apps/api` handlers, DB-backed contact data, App H5 page cutover, contact write safety, shadow-off/fallback retirement, or old app server retirement.

## App Appointment Exploration Findings

2026-05-21: Section 3.5 `appointment` exploration is closed as page-caller/fallback/write-risk triage, not as independent `apps/api` migration.

`apps/app/src/api/appointment.ts` and `apps/app/src/pages-sub/appointment/index.vue` prove a real App H5 caller exists for both `/app/communitySpace.listCommunitySpaceConfirmOrder` and `/app/communitySpace.saveCommunitySpaceConfirmOrder`. This differs from server-only modules, but it does not prove cutover to an exact independent `apps/api` handler.

Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register appointment exact handlers. Production read-only responses for `/app/communitySpace.listCommunitySpaceConfirmOrder` use the old App H5 `{ success, code, message, data, timestamp }` envelope, so they are old App server fallback samples through `legacy-dispatch`, not migrated exact handlers.

`/app/communitySpace.saveCommunitySpaceConfirmOrder` is a POST 核销 endpoint in the old runtime. The old repository mutates in-memory order state from `WAIT_CONFIRM` to `CONFIRMED`; existing App runtime tests intentionally prove that mutation behavior. No production POST was executed in this slice. If retained in independent `apps/api`, it needs an explicit default guard, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.

No-go: this finding does not prove exact `apps/api` handlers, DB-backed appointment orders, safe 核销 writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.

## App Visit Exploration Findings

2026-05-21: Section 3.5 `visit` exploration is closed as page-caller/fallback/write-risk triage, not as independent `apps/api` migration.

`apps/app/src/api/visit.ts`, `apps/app/src/pages-sub/visit/index.vue`, and `apps/app/src/pages-sub/visit/detail.vue` prove real App H5 callers exist for `/app/visit.getVisit`, `/app/visit.getVisitDetail`, and `/app/visit.auditVisit`. This does not prove cutover to an exact independent `apps/api` handler.

Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register visit exact handlers. Its `return-visit` admin route is unrelated to App H5 `/app/visit.*`. Production read-only responses for `/app/visit.*` use the old App H5 `{ success, code, message, data, timestamp }` envelope, so they are old App server fallback samples through `legacy-dispatch`, not migrated exact handlers.

`/app/visit.auditVisit` is a POST approval endpoint in the old runtime. The old repository mutates in-memory `state/stateName`; existing App runtime tests intentionally prove that mutation behavior. No production POST was executed in this slice. If retained in independent `apps/api`, it needs an explicit default guard, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.

No-go: this finding does not prove exact `apps/api` handlers, DB-backed visit data, safe visit approval writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.

## App Repair Extra Exploration Findings

2026-05-21: Section 3.5 `repair-extra` exploration is closed as exact-registry-gap/fallback/shared-URL/write-risk triage, not as independent `apps/api` migration.

`apps/app/server/modules/repair/endpoints.ts` registers the 18 endpoints in this row. Ten are read-compatible list/dictionary/statistics/resource paths, while eight are repair workflow mutations: update, dispatch, finish, end, reply appraise, start, stop, and grabbing repair. The old repository is in-memory and mutates repair state for these workflow actions.

`apps/app/src/api/repair.ts` exposes wrappers for the row, and `pages-sub/repair/dispatch.vue`, `finish.vue`, `handle.vue`, `select-resource.vue`, `order-detail.vue`, `end-order.vue`, `appraise-reply.vue`, and `order-list.vue` provide natural page or action callers. This proves caller presence, but does not prove cutover to independent exact handlers.

Independent `apps/api/server/modules/repair/legacy-endpoints.ts` currently registers only the Phase4A minimal repair slice: owner repair list/detail, save guard, repair settings, repair states, core list, and appraise guard. The `repair-extra` row endpoints are absent from `runtimeEndpointDefinitions` and `runtimeEndpointManifest`; tests explicitly assert `repairDispatch`, `listStaffRepairs`, `resourceStore.listResources`, and `resourceStoreType.listResourceStoreTypes` are absent.

Production API read samples for the ten read-compatible paths returned old App fallback envelopes `{ success, code, message, data, timestamp }` through the API front door. Representative request IDs: `listStaffRepairs=req_12333f99-2038-491f-8b66-104c1e7c3af2`, `listStaffFinishRepairs=req_cf3236c2-e417-47ca-81d0-868326b164be`, `listRepairStaffs=req_a3ba4c0e-08ae-4b35-b2fb-120a0f0131c8`, `repairTypeUsers=req_be27338b-4b7c-4e00-9a4a-b3f8c6ce6571`, `listUserStorehouses=req_cf94934c-f1c2-4230-952e-3c4075d8848c`, `statistics=req_5a006987-3c43-4cec-b5da-d60a444610db`, `resourceStoreTypes=req_77ad9820-6b8c-4cf8-9b1e-018834b75b83`, `staffRecords=req_a14fa585-624c-4f54-bc40-d17c7485c6d1`, `payTypes=req_150551f6-d681-460b-83e3-9f121368bc3f`, `resources=req_7a349708-4a70-48d3-a3ea-a18187efe551`. Direct fallback base returned compatible old envelopes; App H5 direct API-path probes returned 404.

`/app/resourceStoreType.listResourceStoreTypes` is a repair/resource shared URL. The old legacy merge dispatcher sends paginated calls to the resource module and non-paginated calls to the repair module. Therefore this finding does not close the larger `resource` 24-endpoint row.

No production POST was executed. If these workflow endpoints are migrated, they need explicit default guard behavior, controlled test data, read-back, rollback/cleanup, residual check, guard restoration, and App H5 page evidence.

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.

No-go: this finding does not prove exact `apps/api` handlers, DB-backed repair-extra data, safe repair workflow writes, production App H5 Network cutover, resource row completion, shadow-off/fallback retirement, or old app server retirement.

## App Resource Exploration Findings

2026-05-21: Section 3.5 `resource` exploration is closed as source/caller/fallback/shared-URL/write-risk triage, not as independent `apps/api` migration.

`apps/app/server/modules/resource/endpoints.ts` registers the 24 endpoints in this row. Eleven are read-compatible list/audit/resource-stock paths; thirteen are purchase, item-out, allocation, audit, delete, enter, transfer, return, or scrap write endpoints. The old repository is in-memory and mutates purchase/apply/allocation lists or audit task states for these write paths.

`apps/app/src/api/resource.ts` exposes wrappers for the row. Resource pages under `pages-sub/resource/*` and the purchase list page provide real page/action callers. This proves caller presence, but not cutover to independent exact handlers.

Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` currently imports only fee, repair, and floor app legacy definitions. It has no resource exact app legacy handler. The infra manifest test explicitly keeps `/app/resourceStore.listResourceStores` out of the independent runtime manifest. Therefore production 200 responses for these resource paths are old App fallback samples through the API front door.

Duplicate URL boundaries matter: `/app/resourceStore.listResourceStores` is merged from purchase/resource and returns both `data.list` and `data.resourceStores`; `/app/purchase/purchaseApply` is also purchase/resource shared and is a write endpoint; `/app/resourceStoreType.listResourceStoreTypes` is repair/resource shared and dispatches to resource only when `page` or `row` is present.

Production read samples for the 11 read-compatible paths returned old App fallback envelopes `{ success, code, message, data, timestamp }`. Representative request IDs: `resourceStore.listResourceStores=req_56bfc168-5bcc-4b97-9a5c-f69446fbe94e`, `listStorehouses=req_a0c2ff28-e353-43d7-9b51-57207c8ec10e`, `purchaseApply.listPurchaseApplys=req_c7c6b454-a1ca-42fb-9019-bafe7bfae55d`, `itemRelease.listItemRelease=req_410a21dc-fe80-408d-9cfd-73dde3b0820e`, `listAllocationStorehouseApplys=req_51a7cd3e-012d-47b3-a9df-2f3a458453cf`, `listMyAuditOrders=req_70b15a19-932f-4789-b2b7-2d76790c0879`, `queryUndoItemRelease=req_c6336bb7-a249-41a1-8477-72578b2e86af`, `listAllocationStoreAuditOrders=req_9f400111-223a-40ad-bd4c-6bcf9dc7b8ae`, `resourceStoreType.listResourceStoreTypes=req_2d238c3d-81c5-45d4-ab1d-ba5b626fa1de`, `listAllocationStorehouses=req_709a67f4-afb1-43cc-8e37-a2a5f74c0843`, `queryMyResourceStoreInfo=req_ac26b46d-89f3-43bb-be80-20d2d5581a9b`. Direct fallback base returned compatible old envelopes; App H5 direct API-path probes returned 404.

The existing client-only gap paths `/app/itemRelease.queryFinishItemRelease`, `/app/purchase/updatePurchaseApply`, `/app/purchaseApply.listAuditHistoryOrders`, and `/app/resourceStore.listAllocationStoreHisAuditOrders` remain blocked and are not closed by this finding.

No production POST was executed. If resource writes are migrated, they need explicit default guard behavior, controlled test data, read-back, rollback/cleanup, residual check, guard restoration, and App H5 page evidence.

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.

No-go: this finding does not prove exact `apps/api` handlers, DB-backed resource data, safe resource workflow writes, client-only gap closure, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.

## App Purchase Exploration Findings

2026-05-21: Section 3.5 `purchase` exploration is closed as duplicate-URL/fallback/write-risk triage, not as independent `apps/api` migration.

`/app/resourceStore.listResourceStores` and `/app/purchase/purchaseApply` are duplicate legacy URLs shared by the old `purchase` and `resource` modules. The old App runtime intentionally keeps these URLs out of the module priority layers and serves them through `legacy-endpoints.ts` merge definitions. Therefore future migration must preserve the merged compatibility contract or make a deliberate split decision; it must not silently pick only one module's response shape.

`/app/resourceStore.listResourceStores` production output includes both `data.list` and `data.resourceStores`. That is compatibility/fallback behavior from the old App server. Independent `apps/api` has no exact purchase app legacy registry entries for this slice.

`/app/purchase/purchaseApply`, `/app/purchase/urgentPurchaseApply`, and the client-only `/app/purchase/updatePurchaseApply` are write endpoints or write callers. No production POST was executed. Existing old-runtime tests only prove in-memory mutation/merge behavior; they do not prove Phase7 guarded exact handlers.

`/app/purchaseApply.listAuditHistoryOrders` is a client-only read gap in this slice. The API wrapper exists in `apps/app/src/api/resource.ts`, but no old runtime endpoint was found and both production `apps/api` fallback and direct old App server probes return HTTP 500 with `error/status/unhandled`. This path is blocked until an exact handler, fallback fix, or product retirement decision exists.

This finding does not close the larger `resource` 24-endpoint row even though the two modules share URLs.

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.

No-go: this finding does not prove exact `apps/api` handlers, DB-backed purchase/resource data, safe purchase writes, client-only gap closure, shadow-off/fallback retirement, or old app server retirement.

## App Owner Exploration Findings

2026-05-21: Section 3.5 `owner` exploration is closed as page-caller/fallback/high-risk-write triage, not as independent `apps/api` migration.

`apps/app/src/api/owner.ts`, `owner-list.vue`, `add-owner.vue`, and `edit-owner.vue` prove real App H5 callers exist for `/app/owner.queryOwnerAndMembers`, `/app/owner.saveRoomOwner`, `/app/owner.editOwner`, and `/app/owner.deleteOwner`. This does not prove cutover to an exact independent `apps/api` handler.

Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register owner exact handlers. Mentions of `ownerRepair` and admin owner routes are unrelated to App H5 `/app/owner.*`. Production read-only responses for `/app/owner.queryOwnerAndMembers` use the old App H5 `{ success, code, message, data, timestamp }` envelope, so they are old App server fallback samples through `legacy-dispatch`, not migrated exact handlers.

The owner module contains personal-data-shaped fields (`name`, `link`, `idCard`, `address`) and three write endpoints. The old repository mutates in-memory owner/member state on save, edit, and delete; existing App runtime tests intentionally prove that mutation behavior. No production POST was executed in this slice. If retained in independent `apps/api`, these endpoints need explicit default guards, controlled write windows, read-back, rollback/cleanup, residual checks, and App H5 evidence.

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.

No-go: this finding does not prove exact `apps/api` handlers, DB-backed owner data, safe owner writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.

## App Item Release Exploration Findings

2026-05-21: Section 3.5 `item-release` exploration is closed as V2 page-caller/fallback/client-only-gap/write-risk triage, not as independent `apps/api` migration.

`apps/app/src/api/item-release.ts`, `pages-sub/item/release.vue`, and `pages-sub/item/release-detail.vue` prove real App H5 callers exist for the six V2 item-release endpoints. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register item-release exact handlers, so production 200 responses are old App server fallback samples through `legacy-dispatch`, not migrated exact handlers.

`/app/itemRelease.auditItemRelease` is a POST approval endpoint in the old runtime. The old repository mutates in-memory state by moving a pending task into the finished list, updating the detail remark, and appending an approval comment. No production POST was executed in this slice. If retained in independent `apps/api`, it needs an explicit default guard, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.

The non-V2 `/app/itemRelease.queryFinishItemRelease` is a client-only read gap from `apps/app/src/api/resource.ts`. No old runtime endpoint was found for that exact path, and both production `apps/api` fallback and direct old App server probes return HTTP 500 with `error/status/unhandled`. It remains blocked until an exact handler, fallback fix, or product retirement decision exists.

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.

No-go: this finding does not prove exact `apps/api` handlers, DB-backed item-release data, safe item-release approval writes, client-only gap closure, shadow-off/fallback retirement, or old app server retirement.

## App Staff Exploration Findings

2026-05-21: Section 3.5 `staff` exploration is closed as dynamic-route/fallback/write-risk triage, not as independent `apps/api` migration.

`apps/app/server/modules/staff/endpoints.ts` registers the eight staff endpoints. `/app/staff/:staffId` is a `GET` dynamic detail route, while literal routes such as `/app/staff/by-department`, `/app/staff/search`, `/app/staff/organizations`, and `/app/staff/online` must match before the dynamic route. The old repository is in-memory, with 50 random staff rows plus `STAFF_DEMO_PINYIN`, and uses `pinyin-pro` for pinyin-aware fuzzy search.

`apps/app/src/api/staff.ts`, `apps/app/src/hooks/useAddressList.ts`, and `apps/app/src/pages/address/list.vue` prove real App H5 address-book callers exist for list/detail/by-department usage. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register staff exact handlers, so production 200 responses are old App server fallback samples through `legacy-dispatch`, not migrated exact handlers.

Production read-only samples returned old `{success,code,message,data,timestamp}` envelopes: list `req_27b00611-51b2-4db8-97c0-c928f160937c`, dynamic detail `req_6ab9cd91-0f0e-47ad-aba6-24031dd8a0a7`, byDepartment `req_606dcb67-131c-4b67-a30d-57f2d749c5d7`, search `req_2d6642a1-ad8a-4e51-bf96-2c838419218c`, organizations `req_3f2b5d16-3cfb-402f-9bf7-6584dec9d39f`, and online `req_e048b536-8f29-47ca-bc71-e975cebceed2`. The app H5 homepage from `apps/app/package.json` returned HTTP 404 for the same staff paths, so this is API-layer fallback evidence, not App H5 page-level Network evidence.

`/app/staff/update-online-status` and `/app/staff/add` are POST mutation endpoints in the old runtime. No production POST was executed in this slice. If retained in independent `apps/api`, they need explicit default guards, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.

No-go: this finding does not prove exact `apps/api` handlers, DB-backed staff data, safe staff writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.

## App Coupon Exploration Findings

2026-05-21: Section 3.5 `coupon` exploration is closed as page-caller/fallback/write-risk triage, not as independent `apps/api` migration.

`apps/app/server/modules/coupon/endpoints.ts` registers the seven coupon/integral/reserve write-off endpoints. The old repository is in-memory: 42 coupon write-off records, 28 integral logs, 36 reserve write-off records, and one integral setting. `writeOffCoupon()`, `useIntegral()`, and `saveReserveOrder()` prepend records to old runtime memory, so they are write paths even though the data is mock-like.

`apps/app/src/api/coupon.ts`, `pages-sub/coupon/write-off-coupon.vue`, `pages-sub/coupon/write-off-integral.vue`, and `pages-sub/coupon/write-off-reserve.vue` prove real App H5 callers exist for the coupon, integral, and reserve write-off flows. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register coupon exact handlers. `apps/api/server/shared/runtime/env.ts` sets the default fallback base to `https://01s-11-app-server.ruan-cat.com`, so production 200 responses are old App server fallback samples through `legacy-dispatch`, not migrated exact handlers.

Production read-only samples returned old `{success,code,message,data,timestamp}` envelopes: coupon list `req_918db659-c967-4a4c-9f69-a9d98a0db28a`, integral setting `req_5d802e98-00b4-49ca-a04e-cebfcab830e2`, integral logs `req_46a1c783-a064-4782-a8a3-ab8ba07bb04f`, and reserve list `req_c1f23b18-93c0-4b6c-9685-b7d19346f88f`. The same four paths also returned old envelopes from the default fallback server; representative app H5 homepage requests returned HTTP 404, so this is API-layer fallback evidence, not App H5 page-level Network evidence.

No production POST was executed for `/app/couponProperty.writeOffCouponPropertyUser`, `/app/integral.useIntegral`, or `/app/reserveOrder.saveReserveGoodsConfirmOrder`. If retained in independent `apps/api`, these endpoints need explicit default guards, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.

No-go: this finding does not prove exact `apps/api` handlers, DB-backed coupon/integral/reserve data, safe write-off or integral-consumption writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.

## App Inspection Exploration Findings

2026-05-21: Section 3.5 `inspection` exploration is closed as page-caller/fallback/write-risk triage, not as independent `apps/api` migration.

`apps/app/server/modules/inspection/endpoints.ts` registers seven inspection endpoints, including `/app/staff.listStaffs` as the inspection transfer candidate staff list. The old repository is in-memory: 20 tasks, per-task details, 10 today-report rows, 20 transfer staff candidates, and item title definitions for `ITEM_001` through `ITEM_005`. `submitInspection()` mutates task detail state to `20200407` and writes description/photos; `transferTask()` mutates the task assignee name.

`apps/app/src/api/inspection.ts` and the inspection pages under `apps/app/src/pages-sub/inspection/` prove real App H5 callers exist for task list, today report, detail, item titles, submit, staff list, and transfer. `pages-sub/maintenance/transfer.vue` also reuses `getStaffList()`. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register inspection exact handlers, so production 200 responses are old App server fallback samples through `legacy-dispatch`, not migrated exact handlers.

Production read-only samples returned old `{success,code,message,data,timestamp}` envelopes: task list `req_b15f1763-0a4b-46c7-bee6-5c9d33141f94`, today report `req_dc97f2fa-66ee-4368-bb5d-fe139661ffba`, task details for `TASK_001` `req_53d0240f-7f37-477c-b4c6-559bfcf361d0`, item titles for `ITEM_001` `req_1059713b-673a-49c8-aae2-965cb4d7b0fc`, and staff list `req_0d9631c5-d8d8-4463-8454-c6a166116d2d`. The same five paths also returned old envelopes from the default fallback server; representative app H5 homepage requests returned HTTP 404, so this is API-layer fallback evidence, not App H5 page-level Network evidence.

No production POST was executed for `/app/inspection.submitInspection` or `/app/inspection.transferTask`. If retained in independent `apps/api`, these endpoints need explicit default guards, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.

No-go: this finding does not prove exact `apps/api` handlers, DB-backed inspection data, safe inspection submit/transfer writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.

## App Maintenance Exploration Findings

2026-05-21: Section 3.5 `maintenance` exploration is closed as page-caller/fallback/write-risk triage, not as independent `apps/api` migration.

`apps/app/server/modules/maintenance/endpoints.ts` registers seven maintenance endpoints. The old repository is in-memory: 15 maintenance tasks, per-task detail rows, and status values `10001` pending, `10002` processing, `10003` completed. `startTask()`, `completeTask()`, `submitSingle()`, and `transferTask()` mutate task state, task detail content, or staff assignment.

`apps/app/src/api/maintenance.ts`, `pages-sub/maintenance/task-list.vue`, `execute.vue`, `execute-single.vue`, and `transfer.vue` prove real App H5 callers exist for list/detail/items and the start/complete/single-submit/transfer flows. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register maintenance exact handlers, so production 200 responses are old App server fallback samples through `legacy-dispatch`, not migrated exact handlers.

Production read-only samples returned old `{success,code,message,data,timestamp}` envelopes: list `req_d6f53c9e-fe49-4be6-94e2-1570a194c867`, detail for `MT_001` `req_b375aea4-5b4f-443d-8b97-6c9eb1d3350a`, and detail items `req_ca5ca526-7352-418b-ad82-fb8c2b0e4f1b`. The same three paths also returned old envelopes from the default fallback server; representative app H5 homepage requests returned HTTP 404, so this is API-layer fallback evidence, not App H5 page-level Network evidence.

No production POST was executed for `/app/maintenance.startMaintenanceTask`, `/app/maintenance.completeMaintenanceTask`, `/app/maintenance.submitMaintenanceSingle`, or `/app/maintenance.transferMaintenanceTask`. If retained in independent `apps/api`, these endpoints need explicit default guards, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.

No-go: this finding does not prove exact `apps/api` handlers, DB-backed maintenance data, safe maintenance writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.

## App Meter Exploration Findings

2026-05-21: Section 3.5 `meter` exploration is closed as page-caller/fallback/write-risk triage, not as independent `apps/api` migration.

`apps/app/server/modules/meter/endpoints.ts` registers 10 meter endpoints. Seven are read-compatible GET/POST endpoints: `/app/meter.listMeterWaters`, `/app/meter.queryFeeTypes`, `/app/meter.queryFeeTypesItems`, `/app/meter.listMeterType`, `/app/meter.queryPreMeterWater`, `/app/meter.listFloorShareReading`, and `/app/meter.listFloorShareMeter`. Three are POST mutation endpoints: `/app/meter.saveMeterWater`, `/app/meter.saveFloorShareReading`, and `/app/meter.auditFloorShareReading`.

The old repository is in-memory. It creates 60 meter reading rows, fee types/config items, meter types, 16 floor-share meters, and 28 floor-share readings. `saveMeterWater()` prepends a new meter reading, `saveFloorShareReading()` prepends a pending floor-share reading, and `auditFloorShareReading()` mutates floor-share state and audit remark.

`apps/app/src/api/meter.ts`, `pages-sub/meter/reading.vue`, `add-meter.vue`, `qrcode-meter.vue`, `share-meter.vue`, `add-share-reading.vue`, and `audit-share-reading.vue` prove real App H5 callers exist. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register meter exact handlers, so production 200 responses are old App server fallback samples through `legacy-dispatch`, not migrated exact handlers.

Production read-only samples returned old `{success,code,message,data,timestamp}` envelopes: meter list `req_7f105a94-44f2-42b6-9376-cb2c46cfe567`, fee types `req_736d64cf-7eb8-4e75-b071-b4f2e62d31b5`, fee items `req_b44f6af9-fb73-403d-adaf-a4f8a7ed0edd`, meter types `req_78ce679d-a9d4-4e99-87d1-58c31e2b58c8`, previous meter value `req_4108b838-aef1-4ff2-a005-1df873938b91`, floor-share readings `req_a931aa30-c98d-4ac4-a259-68aab0728014`, floor-share meters `req_c48412d8-d686-4763-acb0-38fe4e3b2950`, and one `fsmId=FSM_0001` filtered sample `req_6f690e4b-f1a2-4787-a65c-836d75dbcb22`. The same seven read-compatible paths also returned old envelopes from the default fallback server; representative app H5 homepage requests returned HTTP 404, so this is API-layer fallback evidence, not App H5 page-level Network evidence.

No production POST was executed for `/app/meter.saveMeterWater`, `/app/meter.saveFloorShareReading`, or `/app/meter.auditFloorShareReading`. If retained in independent `apps/api`, these endpoints need explicit default guards, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.

No-go: this finding does not prove exact `apps/api` handlers, DB-backed meter data, safe meter writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.

## App Activity Exploration Findings

2026-05-21: Section 3.5 `activity` exploration is closed as read/side-effect/write-risk triage, not as independent `apps/api` migration.

`apps/app/server/modules/activity/endpoints.ts` registers nine activity endpoints. `/app/activities.listActivitiess` is GET/POST compatible and is used for both list and detail. Detail is not pure read: when `activitiesId` is supplied, `apps/app/server/modules/activity/repository.ts` calls `increaseView(activitiesId)` inside `list()`, mutating `viewCount`.

The remaining eight endpoints are mutation or counter/status endpoints: `/app/activities.saveActivities`, `/app/activities.updateActivities`, `/app/activities.deleteActivities`, `/app/activities.increaseView`, `/app/activities.likeActivity`, `/app/activities.updateStatus`, `/app/activities.updateLike`, and `/app/activities.updateCollect`.

The old repository is in-memory with 30 seeded activities. It supports `communityId`, `status`, `activitiesId`, and `keyword` filters and returns the legacy `activitiess` spelling. The create/update/delete/view/like/status/collect methods mutate in-memory rows.

`apps/app/src/api/activity.ts`, `pages/activity/index.vue`, `pages/activity/detail.vue`, and `components/activity/activity-actions.vue` prove real App H5 callers exist for list/detail, view-count, like, and collect flows. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register activity exact handlers, so production 200 responses are old App server fallback samples through `legacy-dispatch`, not migrated exact handlers.

Production read-only list/filter samples returned old `{success,code,message,data,timestamp}` envelopes: base list `req_d1615e2b-c5ec-4d04-b3b0-32ea2b8bdeed`, `status=ONGOING` `req_2f2972b0-d494-4931-b1ed-1e5d7d4c065d`, and `keyword=health` `req_2315dcef-a275-44ca-85ca-a303cea88681`. Detail GET with `activitiesId` was intentionally not executed because it increments view count. The same three list/filter paths also returned old envelopes from the default fallback server; representative app H5 homepage requests returned HTTP 404, so this is API-layer fallback evidence, not App H5 page-level Network evidence.

No production POST was executed for create/update/delete/view/like/status/collect endpoints. If retained in independent `apps/api`, these endpoints need explicit default guards, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence. Detail GET also needs an explicit decision because the old API combines read and view-count mutation.

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.

No-go: this finding does not prove exact `apps/api` handlers, DB-backed activity data, safe activity writes, detail side-effect acceptability, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.

## App Complaint Exploration Findings

2026-05-21: Section 3.5 `complaint` exploration is closed as page-caller/fallback/write-risk triage, not as independent `apps/api` migration.

`apps/app/server/modules/complaint/endpoints.ts` registers seven complaint endpoints. Four endpoints are read-compatible: `/app/auditUser.listAuditComplaints`, `/app/auditUser.listAuditHistoryComplaints`, `/app/complaint.listComplaintEvent`, and `/app/complaintAppraise.listComplaintAppraise`. Three endpoints are mutation endpoints: `/app/complaint`, `/app/complaint.auditComplaint`, and `/app/complaintAppraise.replyComplaintAppraise`.

The old repository is in-memory with 40 seeded complaints and prebuilt event/appraise rows for the first 15 complaints. `saveComplaint()` prepends a complaint and create event, `auditComplaint()` appends a handle event and may mutate complaint state/stateName, and `replyComplaintAppraise()` mutates appraise state and replyContext.

`apps/app/src/api/complaint.ts`, `pages-sub/complaint/list.vue`, `finish.vue`, `order.vue`, `detail.vue`, `handle.vue`, `audit.vue`, and `appraise-reply.vue` prove real App H5 callers exist for todo/history/order/detail/handle/audit/appraise-reply flows. `handleComplaint()` and `auditComplaint()` both use `/app/complaint.auditComplaint`, so simple handling and audit result submission share the same write endpoint. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register complaint exact handlers, so production 200 responses are old App server fallback samples through `legacy-dispatch`, not migrated exact handlers.

Production read-only samples returned old `{success,code,message,data,timestamp}` envelopes: todo list `req_720c48de-85b7-4f13-88c0-b232cbf67aa2`, history list `req_8d17ba93-7e26-4b09-bb3c-cf7bde79e33d`, complaint events for `COMP_001` `req_66aa7e48-f1cd-482d-8569-9e6bbf35505a`, and complaint appraises for `COMP_001` `req_46740223-638f-4a0b-b958-bc5dfe11b2f9`. The same four read-compatible paths also returned old envelopes from the default fallback server; representative app H5 homepage requests returned HTTP 404, so this is API-layer fallback evidence, not App H5 page-level Network evidence.

No production POST was executed for `/app/complaint`, `/app/complaint.auditComplaint`, or `/app/complaintAppraise.replyComplaintAppraise`. If retained in independent `apps/api`, these endpoints need explicit default guards, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.

No-go: this finding does not prove exact `apps/api` handlers, DB-backed complaint data, safe complaint create/audit/reply writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.

## App Parking Exploration Findings

2026-05-21: Section 3.5 `parking` exploration is closed as page-caller/fallback/high-risk-device-command triage, not as independent `apps/api` migration.

`apps/app/server/modules/parking/endpoints.ts` registers twelve parking endpoints. Nine endpoints are read-compatible: `/app/owner.queryOwnerCars`, `/app/parkingArea.listParkingAreas`, `/app/machine.listParkingAreaMachines`, `/app/carInout.listCarInParkingAreaCmd`, `/app/parkingCoupon.listParkingCouponCar`, `/app/tempCarFee.getTempCarFeeOrder`, `/app/carInoutDetail.listCarInoutDetail`, `/app/carInoutPayment.listCarInoutPayment`, and `/app/machine.getBarrierCloudVideo`. Three endpoints are high-risk device or vehicle-flow commands: `/app/machine/openDoor`, `/app/machine/closeDoor`, and `/app/machine.customCarInOutCmd`.

The old repository is in-memory with seeded parking areas, barrier machines, owner cars, in/out details, payments, temporary in-area cars, and coupons. The open-door and close-door handlers currently validate `machineCode` and return placeholder success. The custom car in/out command validates `carNum` and `type` and returns placeholder success. These are not safe production write samples.

`apps/app/src/api/parking.ts`, `pages-sub/parking/owner-car.vue`, `barrier-gate.vue`, `barrier-video.vue`, `car-in.vue`, and `car-out.vue` prove real App H5 callers exist for vehicle list, barrier management, video, manual car-in, and manual car-out flows. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register these parking App legacy exact handlers, so production 200 responses are old App server fallback samples through `legacy-dispatch`, not migrated exact handlers.

Production read-only samples returned old `{success,code,message,data,timestamp}` envelopes: owner cars `req_13e9f287-e84b-486f-9ab6-0d22eae89f64`, parking areas `req_b36bba72-e1b9-4b08-976e-2d37f76d4fac`, machines `req_8c43db84-d711-49a2-89a0-581e84a6fa57`, temp cars in area `req_238d307f-e5e4-4bb3-818a-859d6cfb1ec5`, coupons `req_f5b53517-7f79-498a-aa97-fd48e2823b44`, temp fee `req_d4811f08-8584-4ccf-a7a8-59827a5dbe54`, in/out detail `req_5956645f-e4c5-474f-aea7-866048af7490`, payments `req_d1e35831-9f11-4aa6-ad86-145604bd689e`, and barrier video `req_c9b184a1-a9b6-4716-9bab-9cbbd3ba1b4e`. The same nine read-compatible paths also returned old envelopes from the default fallback server; representative app H5 homepage requests returned HTTP 404, so this is API-layer fallback evidence, not App H5 page-level Network evidence.

No production POST was executed for `/app/machine/openDoor`, `/app/machine/closeDoor`, or `/app/machine.customCarInOutCmd`. If retained in independent `apps/api`, these endpoints need explicit default guards, product authorization, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.

No-go: this finding does not prove exact `apps/api` handlers, DB-backed parking data, safe barrier/device writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.

## App Property Application Exploration Findings

2026-05-21: Section 3.5 `property-application` exploration is closed as page-caller/fallback/shared-conflict/write-risk triage, not as independent `apps/api` migration.

`apps/app/server/modules/property-application/endpoints.ts` registers ten source paths. Four module-owned paths are read-compatible: `/app/applyRoomDiscount/queryApplyRoomDiscount`, `/app/feeDiscount/queryFeeDiscount`, `/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecord`, and `/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecordDetail`. Four module-owned paths are mutations: `/app/applyRoomDiscount/updateApplyRoomDiscount`, `/app/applyRoomDiscount/updateReviewApplyRoomDiscount`, `/app/applyRoomDiscountRecord/addApplyRoomDiscountRecord`, and `/app/applyRoomDiscountRecord/cutApplyRoomDiscountRecord`.

Two source paths in this row are shared or conflicting rather than property-application-owned in independent `apps/api`: `/callComponent/core/list` is served by the repair shared compatibility layer, and `/app/fee.queryFeeDetail` is served by the fee legacy compatibility layer. The App source filters both out of `propertyApplicationRuntimeEndpointDefinitions`, so they must not be claimed as property-application-only exact migration.

The old repository is in-memory with apply-room rows, tracking records, record details, fee discounts, and fee details. `updateCheckInfo()` mutates application check state and photos, `updateReviewInfo()` mutates review state, `saveRecord()` prepends tracking data, and `deleteRecord()` removes tracking data.

`apps/app/src/api/property-application.ts`, `pages-sub/property/apply-room.vue`, `apply-room-detail.vue`, `apply-room-record.vue`, `apply-room-record-detail.vue`, and `apply-room-record-handle.vue` prove real App H5 callers exist for list/detail/dict/discount/fee-detail/record flows. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not import property-application runtime definitions, so production 200 responses for module-owned property-application paths are old App server fallback samples through `legacy-dispatch`, not migrated exact handlers.

Production read-only samples: apply list `req_a244efd7-a28f-4b32-bdf8-72709a02b8b8`, apply detail `req_89041f06-ffbd-4602-bc8a-84a1c052433c`, shared dict `req_1ff9ac84-db81-45a4-b60a-d8c6b7ec25c4`, fee discount `req_efddc7ca-deeb-41f4-8a87-39a2c332b33a`, fee detail `req_e34b08d7-f0f5-49ac-a6ba-c010d9af4e1d`, record list `req_5f701338-5040-475d-923c-3463c725f63c`, and record detail `req_b35002c9-5d53-45ba-9aae-6d33f4fdbb35`. The same seven source read paths also returned HTTP 200 from the default fallback server. For `/callComponent/core/list` and `/app/fee.queryFeeDetail`, the independent API response contract differs from fallback because independent `apps/api` uses the shared repair/fee compatibility implementations.

No production POST or DELETE was executed for check update, review update, record save, or record delete. If retained in independent `apps/api`, these endpoints need explicit default guards, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.

No-go: this finding does not prove ten-path exact `apps/api` ownership, DB-backed property-application data, safe check/review/record writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.

## App Work Order Exploration Findings

2026-05-21: Section 3.5 `work-order` exploration is closed as page-caller/fallback/write-risk triage, not as independent `apps/api` migration.

`apps/app/server/modules/work-order/endpoints.ts` registers twelve old App runtime endpoints. Five paths are read-compatible: `/app/workorder/todo/list`, `/app/workorder/copy/list`, `/app/workorder/detail`, `/app/workorder/task/list`, and `/app/workorder/task/items`. Seven paths are mutations: `/app/workorder/create`, `/app/workorder/update`, `/app/workorder/start`, `/app/workorder/complete`, `/app/workorder/audit`, `/app/workorder/cancel`, and `/app/workorder/copy/finish`.

The old repository is in-memory with seeded todo work orders, copy work orders, task rows, and task items. `create`, `update`, `start`, `complete`, `audit`, `cancel`, and `finishCopyWork` mutate in-memory work order or task-item state.

`apps/app/src/api/work-order.ts`, `pages-sub/work/do-work.vue`, `copy-work.vue`, `work-detail.vue`, `start-work.vue`, `edit-work.vue`, `audit-work.vue`, `task-list.vue`, and `do-copy-work.vue` prove real App H5 callers exist for list/detail/create/update/start/complete/audit/task/copy-finish flows. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register work-order exact handlers. Production 200 responses are routed through the independent API front door and then fall back to the old App server, not migrated exact handlers.

Production read-only samples returned old `{success,code,message,data,timestamp}` envelopes: todo list sample `WO_001/state=10001/stateName=待处理`, detail `WO_001/state=10001`, copy list `WO_100/state=10002/stateName=处理中`, task list `TASK_WO_001_001/state=W`, and task items `ITEM_WO_001_001/state=W`. Response-header spot checks from the independent API showed `x-api-phase=phase3-infra` and request ids for the five read paths, but the response body matches the default old App fallback server shape, so this remains fallback evidence. Representative app H5 homepage requests returned HTTP 404, so this is not App H5 page-level Network evidence.

No production POST was executed for create, update, start, complete, audit, cancel, or copy-finish. If retained in independent `apps/api`, these endpoints need explicit default guards, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.

No-go: this finding does not prove exact `apps/api` handlers, DB-backed work-order data, safe work-order writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.

## App OA Workflow Exploration Findings

2026-05-21: Section 3.5 `oa-workflow` exploration is closed as page-caller/fallback/write-risk triage, not as independent `apps/api` migration.

`apps/app/server/modules/oa-workflow/endpoints.ts` registers thirteen old App runtime endpoints. Nine paths are read-compatible or query endpoints: `/app/oa/workflow/query`, `/app/oa/workflow/form/query`, `/app/oa/workflow/form/data/query`, `/app/oa/workflow/task/undo/query`, `/app/oa/workflow/task/his/query`, `/app/oa/workflow/user/query`, `/app/oa/workflow/image/run`, `/app/oa/workflow/task/next`, and `/app/oa/workflow/undo/next-deal-user`. Four paths are mutations: `/app/oa/workflow/form/save`, `/app/oa/workflow/form/update`, `/app/oa/workflow/audit`, and `/app/oa/workflow/undo/audit`.

The old repository is in-memory with three seeded flows, three workflow records, flow form schemas, comment history, a static base64 workflow image, and placeholder next-task data. `saveFormData`, `updateFormData`, and `submitAudit` mutate in-memory workflow records or comments.

`apps/app/src/api/oa-workflow.ts`, `pages-sub/oa/workflow.vue`, `workflow-form.vue`, `workflow-form-edit.vue`, `workflow-todo.vue`, `workflow-finish.vue`, `workflow-detail.vue`, `workflow-audit.vue`, and `audit-todo.vue` prove real App H5 callers exist for workflow list, form query, form save/update, todo/history, detail, image, next-task, and audit flows. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register oa-workflow exact handlers, so production 200 responses are old App server fallback samples through the independent API front door, not migrated exact handlers.

Production read/query samples returned old `{success,code,message,data,timestamp}` envelopes: workflow list `req_d4ea46d5-133c-4902-8e69-851f44de81f7`, form definition `req_a706fd77-b28f-417f-ab88-af335763a28a`, form data `req_865e1136-2cb0-47da-90a4-5778863db9c4`, undo list `req_0b90802d-86b1-44bf-933c-aed181f4af11`, history list `req_71e8ce9d-0a41-40fa-92a6-746bf94e06a5`, comments `req_1ce0ce66-9bf4-483e-b473-63a9af10602a`, workflow image `req_529c8b0a-17ff-4184-b8a4-127d22c9fd76`, next task `req_fe3683db-f0c7-4dfb-9089-0bd62ebf617d`, and next deal user `req_0dc4e296-e772-4f3b-8e23-1589db2ad836`. The same nine query paths also returned old envelopes from the default fallback server; representative app H5 homepage requests returned HTTP 404, so this is API-layer fallback evidence, not App H5 page-level Network evidence.

No production POST was executed for form save, form update, audit, or undo audit. If retained in independent `apps/api`, these endpoints need explicit default guards, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.

No-go: this finding does not prove exact `apps/api` handlers, DB-backed workflow data, safe workflow form/audit writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.

## App Client-Only Gap Findings

2026-05-21: Section 3.5 client-only gap investigation is closed as explicit blocker triage, not as gap repair or independent `apps/api` migration.

The four paths are exposed by `apps/app/src/api/resource.ts`: `/app/itemRelease.queryFinishItemRelease`, `/app/purchase/updatePurchaseApply`, `/app/purchaseApply.listAuditHistoryOrders`, and `/app/resourceStore.listAllocationStoreHisAuditOrders`.

Observed page callers exist for three of them: `pages-sub/resource/item-out-audit.vue` calls the non-V2 item-release history path, `pages-sub/resource/allocation-audit.vue` calls the allocation history path, and `pages-sub/resource/edit-purchase-apply.vue` calls `updatePurchaseApply()`. No direct page caller was found in this scan for `listAuditHistoryOrders()`, but the wrapper exists and must remain tracked.

No exact old runtime endpoint was found for the four paths. The old item-release module registers `/app/itemRelease.queryFinishItemReleaseV2`, not the non-V2 path. The resource module registers current undo/audit paths but not the three history gap paths. The purchase module does not register `/app/purchase/updatePurchaseApply`. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` also has no exact app legacy entries for these paths.

Production GET samples for the three read gaps returned HTTP 500 through the independent API front door and HTTP 500 through the direct old App fallback server. Production request ids were `req_6c90d16e-45b6-47db-b4ca-6f8b15d661ec` for `/app/itemRelease.queryFinishItemRelease`, `req_e9c02c31-6b52-4c30-aaeb-08e848937aea` for `/app/purchaseApply.listAuditHistoryOrders`, and `req_bd38a683-8ea1-4db9-919c-6628119fad0f` for `/app/resourceStore.listAllocationStoreHisAuditOrders`. The response body shape was `{ error, status, unhandled }` rather than a legacy success envelope.

No production POST was executed for `/app/purchase/updatePurchaseApply`. If retained in independent `apps/api`, it needs an exact handler or product retirement decision plus default guard, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.

No-go: this finding does not prove exact `apps/api` handlers, client-only gap fixes, DB-backed resource/purchase/item-release data, safe purchase update writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.

## App Server-Only Endpoint Summary Findings

2026-05-21: Section 3.5 server-only endpoint investigation is closed as cross-module classification, not as exact `apps/api` migration or deletion approval.

The row name is broader than the actual evidence. `contact` is the only named module currently classified as server-only/mock compatibility in the strict App H5 caller scan. `test` is diagnostic/mock-only. `activity`, `notice`, `profile`, `video`, `staff`, and `oa-workflow` all have real App H5 API wrappers and page or route callers, so they are not server-only in the strict caller sense.

All named modules are imported by `apps/app/server/shared/runtime/runtime-endpoints.ts` and therefore exist in the old App runtime registry. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not import these module definitions; it maps exact app legacy definitions from fee, repair, and floor only. Current production success responses for these modules, where present, remain fallback evidence unless a later slice adds exact independent handlers and corresponding contract/guard evidence.

The cross-module summary artifact is `.tmp/phase7-dev-browser/2026-05-21-server-only-endpoint-summary.md`. It points to the stable module artifacts for activity, contact, notice/profile/video/test, staff, and oa-workflow.

This summary is intended to prevent two opposite mistakes: deleting old runtime modules just because current H5 caller scan is thin, and claiming exact independent migration just because production `/app/**` fallback returned 200.

No-go: this finding does not prove exact `apps/api` handlers, DB-backed data, production App H5 Network cutover, safe writes, shadow-off/fallback retirement, retirement ledger completeness, or old App server retirement.

## App Renovation Exploration Findings

2026-05-21: Section 3.5 `renovation` exploration is closed as page-caller/fallback/write-risk triage, not as independent `apps/api` migration.

`apps/app/server/modules/renovation/endpoints.ts` registers eight old App runtime endpoints. Three paths are read-compatible: `/app/roomRenovation/queryRoomRenovation`, `/app/roomRenovation/queryRoomRenovationRecord`, and `/app/roomRenovation/queryRoomRenovationRecordDetail`. Five paths are mutations: `/app/roomRenovation/updateRoomToExamine`, `/app/roomRenovation/saveRoomRenovationDetail`, `/app/roomRenovation/updateRoomRenovationState`, `/app/roomRenovation/updateRoomDecorationRecord`, and `/app/roomRenovation/deleteRoomRenovationRecord`.

The old repository is in-memory with 36 seeded renovation applications, tracking records, and optional media rows. Examine, acceptance, finish-state update, record add, and record delete mutate in-memory application, record, or media state.

`apps/app/src/api/renovation.ts`, `pages-sub/property/renovation.vue`, `renovation-detail.vue`, `renovation-record.vue`, `renovation-record-handle.vue`, and `renovation-record-detail.vue` prove real App H5 callers exist. Independent `apps/api/server/shared/runtime/runtime-endpoints.ts` does not register renovation exact handlers, so production 200 responses are old App server fallback samples through the independent API front door, not migrated exact handlers.

Production read-only samples returned old `{success,code,message,data,timestamp}` envelopes: renovation list `req_d45bc0a3-4c41-43a0-854d-8bc29fca9234` with sample `REN_0001/ROOM_0001/state=3000`, record list `req_8cdee700-427c-4071-9bc0-2ac68451ca4f` with sample `RR_0001/REN_0001/state=3000`, and record detail `req_cc956105-e0ba-4ec0-9d63-32ffcd4e60af` with an empty media array for the selected record. The same three read paths returned old envelopes from the default fallback server; representative app H5 homepage requests returned HTTP 404, so this is API-layer fallback evidence, not App H5 page-level Network evidence.

No production POST was executed for examine, acceptance, finish-state update, record add, or record delete. If retained in independent `apps/api`, these endpoints need explicit default guards, controlled write window, read-back, rollback/cleanup, residual check, and App H5 evidence.

Current ready evidence remains `READY_CONFIGURED` with database probe disabled, not `DB_READY`.

No-go: this finding does not prove exact `apps/api` handlers, DB-backed renovation data, safe renovation writes, production App H5 Network cutover, shadow-off/fallback retirement, or old app server retirement.

## Production Homepage Source Findings

2026-05-21: Section 4A production homepage source task is closed as package-field evidence only.

Structured `ConvertFrom-Json` reads confirmed the current authoritative production entrypoints:

- Admin H5: `apps/admin/package.json` -> `https://01s-11comm.ruan-cat.com`
- App H5: `apps/app/package.json` -> `https://01s-11-app.ruan-cat.com`
- Unified API server: `apps/api/package.json` -> `https://01s-11-server.ruan-cat.com`

Supplemental direct field reads with `Select-String` matched the same three values. Earlier inline `node -e` attempts were discarded because PowerShell quoting mangled the JavaScript; no files were changed by those failed commands. The accepted evidence source is the structured PowerShell JSON read plus direct field reads.

No-go: this finding does not prove production health, production ready, `DB_READY`, Chrome page Network, local dev base URL, admin resolver base, app shadow/API base, shadow-off/fallback retirement, or old service retirement.

## Task 102 Contract Upload/R2 Findings

2026-05-21：task102 对应 `property-manage/contract-manage/upload/{init,sign-part,complete,abort,status}`。当前结论为 BLOCK，不能勾选完成。本轮不是完成 R2 迁移，而是把独立 `apps/api` 内的 mock-like success 收敛为显式阻断，防止 `mock-upload-id`、空 `signedUrl` 或 `unknown` status 被误判为可用。

Implemented evidence：新增 `apps/api/tests/admin/contract-upload-r2-blocked.test.ts`。红灯阶段该测试确认默认 `createAdminContractAdapter(...).uploadInit()` 仍返回 `success=true` 与 `uploadId="mock-upload-id"`；修复后 `apps/api/server/modules/contract/admin-adapter.ts` 的 `uploadInit`、`uploadSignPart`、`uploadComplete`、`uploadAbort`、`uploadStatus` 均返回 `409` JsonVO 阻断响应，message 明确包含 R2 阻断原因。5 个 upload route 文件仍位于 `apps/api/server/routes/api/property-manage/contract-manage/upload/{init,sign-part,complete,abort,status}.post.ts`，均从 `nitro/h3` 导入并分发到 `getContractRuntime(event).adminAdapter.upload*`。

Evidence boundary：专项测试断言 5 个 upload URL 仍不在 `runtimeEndpointManifest`，这是有意保持 blocked，而不是遗漏完成证据。`apps/api/package.json` 仍无 `@aws-sdk/client-s3` 和 `@aws-sdk/s3-request-presigner`；`apps/api` 仍无 R2 env/client/service/repository 迁移。`apps/type` 的 `ctUploadSessions` / `ctUploadSessionParts` schema、旧 `apps/admin/server` upload service、以及前端 `shared-upload/use-resumable-upload.ts` 只能作为 partial/source evidence，不能证明独立 API 已具备 R2 multipart。

Verification evidence：红灯命令 `pnpm -F @01s-11comm/api exec vitest run tests/admin/contract-upload-r2-blocked.test.ts` 先失败，失败点为 adapter 返回 placeholder success；修复后同命令通过，1 文件 3 tests passed。组合回归 `pnpm -F @01s-11comm/api exec vitest run tests/admin/contract-upload-r2-blocked.test.ts tests/admin/contract-change-draft-crud.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/http/phase7-gated-http.test.ts` 通过，4 文件 18 tests passed + 1 文件 22 skipped。`pnpm -F @01s-11comm/api run typecheck` 通过。只读探索/复核报告位于 `.tmp/phase7-agent-reports/2026-05-21-task102-contract-upload-r2-explorer.md` 与 `.tmp/phase7-agent-reports/2026-05-21-task102-contract-upload-r2-review-criteria.md`，结论均为 BLOCK。

No-go：不得把 route file 存在、adapter 409、schema table 存在、旧 admin upload-service、前端 hook/cache 或 skipped HTTP gate 写成 upload/R2 完成。仍缺 `apps/api` AWS SDK 依赖、脱敏 R2 env、真实 R2 multipart create/sign/status/complete/abort、DB upload session/part 写入读回、异常清理与幂等、前端断点续传页面闭环、local/production HTTP 或浏览器证据、生产 `DB_READY`、shadow-off/fallback 和 retirement ledger。5 个 upload route 不得加入 available manifest，不得写成 old path exact covered、生产上传完成或旧服务可退役。
