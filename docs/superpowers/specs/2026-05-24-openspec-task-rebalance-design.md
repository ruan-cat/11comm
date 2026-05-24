<!-- 已完成 -->

# 2026-05-24 OpenSpec 任务树比例纠偏设计

## 背景

`docs/reports/2026-05-21-openspec-longtask-pause-review.md` 指出，`migrate-superpowers-docs-to-openspec-longtask` 的任务树出现比例失衡：探索、排查、验证、补充证据和历史治理任务过多，真实 Nitro endpoint 迁移推进被稀释。进度数字不能等同于独立 `apps/api` 的真实迁移完成度。

本设计只用于纠偏当前 OpenSpec change 的任务组织，不新建 change，不恢复旧 Superpowers 文档为任务源，不直接修改全局技能文件。

## 调整目标

后续活跃任务池按以下比例推进：

- 真实 Nitro 迁移实施：55%-60%。
- 验证与证据门禁：20%-25%。
- 必要探索与动态任务补全：10%-15%。
- 退役治理：5%-10%。
- 历史文档治理：0%，只保留已完成历史记录，不再作为活跃推进面。

每个小批次建议约 10 项 checkbox：6 项实施、2 项验证、1 项记录、1 项复核。探索项只有绑定到本批 endpoint 缺口时才允许新增。

## `tasks.md` 结构调整方案

在 `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/tasks.md` 的 `## 1C. Batch Execution Control And Agent Handoff` 后、`## 2. Admin Legacy Nitro Stream` 前插入 `## 1D. 2026-05-24 纠偏后的实施优先队列`。

该区块的作用：

- 不删除历史完成项。
- 不重写整棵任务树。
- 把下一批可执行入口前置到真实 Nitro 迁移。
- 明确探索、验证、报告只能服务于 named endpoint。
- 明确动态补全仍写回 `tasks.md`，不能落到 `agent-progress.md` 或 `agent-findings.md` 形成第二任务源。

## 推荐首批实施切片

### Admin 普通 list 试点

优先选择 `property-manage/contract-manage/type/list`，因为项目中已有 `apps/api/server/modules/contract/admin-adapter.ts`、`runtime-endpoints.ts` 和前端调用端 `apps/admin/src/api/property-manage/contract-manage/type/index.ts`，适合把已有状态推进到真实页面证据和状态口径闭环。

验收重点：

- route/adapter/runtime manifest/caller 对齐。
- admin 页面 Network 命中统一 `apps/api`。
- 能区分 exact migrated、fallback、blocked、unknown。
- 不夹带 CUD、detail、upload/R2。

### App legacy 只读 exact handler 试点

优先选择 `work-order` 的只读路径：`/app/workorder/todo/list` 与 `/app/workorder/detail`。已有探索证明这些路径当前只是 old App fallback，不是独立 exact handler；这正好适合作为“从探索结论转实施”的样板。

验收重点：

- 在 `apps/api/server/modules/work-order` 新增 exact handler、adapter 和必要测试。
- 在 `runtime-endpoints.ts` 注册 app legacy manifest/allowlist。
- 保持旧 envelope 或明确统一 app legacy contract。
- 不迁移 create/update/start/complete/audit/cancel 等写入口。

### 写入口默认阻断试点

优先选择 `/app/purchase/updatePurchaseApply`。已有 client-only gap 探索证明它是页面调用的 POST 写入口，但当前没有 exact runtime 保护，不能在生产直接执行写操作。

验收重点：

- 若当前阶段不做真实写入迁移，应新增默认 guard 或明确 no-go。
- 默认返回受控阻断，例如 409 与稳定错误码。
- 测试覆盖不会触发生产写入。
- 不把 blocked guard 写成迁移完成。

## 证据口径

后续勾选任务时必须按层级记录，不允许互相替代：

- `exact migrated`：独立 `apps/api` route/registry/handler 命中，contract 和 caller 证据闭环。
- `fallback-only`：通过统一 API front door 返回 200，但 body 仍来自 old App server fallback。
- `blocked write`：写入口明确被 guard 阻断，不能写成迁移完成。
- `DB_READY`：必须有生产 ready/probe 或真实 DB 样本证据，不能用 `READY_CONFIGURED` 替代。
- `browser evidence`：页面 Network 命中统一 API，并记录 URL、method、status、响应摘要和 console 状态。
- `retirement candidate`：必须同时满足 exact coverage、caller cutover、fallback/shadow-off、DB/write evidence 和退役账本。

## 动态补全规则

执行中如果发现任务缺项，应按以下顺序处理：

1. 判断缺项是否属于当前 OpenSpec change 范围。
2. 属于当前范围时，先追加或合并到 `tasks.md` 对应业务区块。
3. 改变行为要求时同步 `specs/**/spec.md`。
4. 改变技术路线时同步 `design.md`。
5. 运行 `openspec validate migrate-superpowers-docs-to-openspec-longtask --strict`。
6. 在 `agent-progress.md` 记录 checkpoint，在 `agent-findings.md` 记录风险或 no-go。

动态补全不得扩张成新的长期探索清单，也不得在 `agent-progress.md` 或 `agent-findings.md` 中创建 checkbox backlog。

## 预期效果

调整后，当前 change 的活跃执行入口应从“继续探索更多 endpoint”转为“按首批切片推进真实 Nitro 迁移”。探索结果仍保留为证据，但不再压过实现任务。后续每轮都应能回答三个问题：本轮迁移了哪个 endpoint、证据证明了什么、哪些旧服务路径仍不能退役。
