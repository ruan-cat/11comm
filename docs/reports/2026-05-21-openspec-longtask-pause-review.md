<!-- 已完成使用 -->

# 2026-05-21 OpenSpec 长任务暂停复盘报告

## 背景

用户要求暂停当前 goal 工作，并质疑过去约 16 小时的产出：没有看到足够的 admin、app 内置 Nitro 接口迁移到独立 `apps/api` 的实际代码改写，主要看到 Markdown 文档和 Vitest 测试。

本报告按用户要求落在 `docs/reports`，只做暂停复盘和纠偏建议，不新增新的任务源，不继续执行原 goal。

## 当前状态

当前 active goal 已处于暂停状态。当前环境暴露的 4 个旧子代理已经关闭，避免它们继续沿原迁移 goal 产生输出。

OpenSpec change：

```log
change: migrate-superpowers-docs-to-openspec-longtask
progress: 134/219 complete
remaining: 85
state: ready
```

当前未完成项中，真正进入实施主线的关键任务仍未完成，例如：

- `task 159`：每次只选 2-3 个 app legacy endpoint 或一个小模块，先补 manifest/allowlist/contract/guard，再考虑 DB repository。
- `task 169`：`apps/api` 独立启动、health、ready、build、typecheck、test。
- `task 170`：Neon main `DB_READY`。
- `task 177-184`：本地三 dev 与生产三端浏览器/Network 证据。
- `task 200-210`：旧服务退役门禁。

这意味着 `134/219` 不能解释为“核心 Nitro 迁移已完成 61%”。其中大量完成项是文档治理、语义转写、审计、证据归类、fallback 调查和 no-go 记录。

## 用户质疑是否成立

结论：成立。

这次长任务的执行结果和用户的核心目标之间存在明显偏差。用户目标是把 `apps/admin/server` 与 `apps/app/server` 的旧 Nitro/API 职责迁移到独立 `apps/api`，让 admin 与 app 共同消费统一 API。现阶段产出更多证明了“哪些还没有迁移、哪些只是 fallback、哪些不能退役”，而不是持续完成真实迁移。

这类证据有价值，但它不是用户期待的主要产出。用大量 Markdown 证据闭环来推进 OpenSpec checkbox，会让进度数字看起来前进，但核心代码迁移没有同步推进。

## 对问题 1 的答复：tasks.md 目标是否失衡

`proposal.md` 和 `design.md` 的上层目标并没有完全跑偏，它们明确写了统一 Nitro API 合并主线：

- `apps/admin/server` 旧 admin Nitro API 责任迁往 `apps/api`。
- `apps/app/server` 与旧 app legacy/mock Nitro API 责任迁往 `apps/api`。
- admin/app 最终共同消费独立统一 API。
- 证据闭环后才考虑旧服务责任退役。

问题出在 `tasks.md` 的执行结构失衡。

当前 `tasks.md` 把大量前置工作设计为文档语义转写、旧文档审计、任务源治理、证据模型、历史 provenance、fallback 调查和 exploration closure。这些任务本身可以存在，但它们在排序和数量上压过了真实迁移任务。结果是前 134 个完成项里，很多只证明“已经知道现状”，没有对应到“已经完成接口迁移”。

更具体地说，当前 `tasks.md` 的完成项经常是：

- `[探索]` 某模块 endpoint 已归类。
- fallback 证据已采集。
- 生产 ready 仍是 `READY_CONFIGURED`。
- 不执行生产 POST。
- 不代表 `DB_READY`。
- 不代表旧服务可退役。

这些结论是风险控制，不是迁移完成。把它们计入同一个总进度，会弱化用户对真实迁移进展的判断。

## 对问题 2 的答复：是否缺少 task.md 细粒度迁移机制

结论：是，当前机制不够合格。

`do-long-task` 要求 `tasks.md` 是唯一任务源；OpenSpec 的 tasks 编写规范还要求任务尽量是文件级、可执行、可验证的粒度，并且任务量大时要有试点批次。

当前 `tasks.md` 虽然被声明为唯一任务源，但它混合了几种不同性质的条目：

- 任务源纪律。
- 历史文档转写。
- 证据审计。
- endpoint 探索归类。
- 真实代码迁移。
- 浏览器验收。
- DB readiness。
- 退役门禁。

问题不是这些内容完全不该出现，而是它们没有被清晰分层成“迁移实施任务”。比如一个 app legacy endpoint 的迁移任务，应该拆成可执行文件级 checklist：

- 修改 `apps/api/server/modules/<domain>/legacy-endpoints.ts` 注册 exact legacy path。
- 修改 `apps/api/server/modules/<domain>/legacy-adapter.ts` 保持旧 envelope。
- 修改 `apps/api/server/modules/<domain>/repository.ts` 或明确 fallback/blocked。
- 修改 `apps/api/server/shared/runtime/runtime-endpoints.ts` 加 manifest/allowlist/guard。
- 新增 `apps/api/tests/legacy/<domain>.test.ts` 覆盖 method、payload、envelope、错误路径。
- 必要时修改 `apps/app/src/http/runtime-base.ts` 或 app caller 配置。
- 运行对应 Vitest、typecheck、HTTP gate。
- 记录 browser/DB/fallback 证据。

当前很多 endpoint 只有“探索归类项”，没有这样的文件级迁移子任务。因此用户看到的就会是不断补 `.md` 证据，而不是看到 route、adapter、repository、manifest、caller 的连续改写。

## 对问题 3 的答复：16 小时主要在调研还是迁移

主要是在调研、验证、归类、补证据和补任务体系。

目前确实有少量代码和测试变更，例如当前工作树可见：

- `apps/api/server/modules/contract/admin-adapter.ts`：把 contract upload/R2 placeholder success 改为 409 blocked。
- `apps/api/server/modules/setting/*`：补了组织树读取链路。
- `apps/api/server/shared/runtime/runtime-endpoints.ts`：补了大量 admin manifest 条目。
- `apps/api/tests/**`：新增和扩展了大量 Vitest 覆盖。
- `apps/app/src/tests/**` 与 `apps/admin/src/api/**/tests/**`：补了部分 resolver/runtime 测试。

但这些不是完整迁移闭环。它们更像是局部阻断、manifest 扩展、测试护栏和少量 endpoint 支撑能力。与“把 admin/app 全部内置 Nitro 接口系统性迁到独立 `apps/api`”相比，核心实现产出不足。

换句话说，过去 16 小时确实更像是在回答：

- 当前哪些 endpoint 只是 fallback？
- 哪些 endpoint 有页面调用？
- 哪些写入口不能碰？
- 哪些不能误记为 `DB_READY`？
- 哪些旧服务不能退役？

而不是持续回答：

- 这个 endpoint 的 exact handler 是否已经迁入 `apps/api`？
- repository/service/adapter 是否已连通真实 schema？
- admin/app caller 是否已切到统一 API？
- 本地和生产是否通过页面 Network 验证？

这是执行策略偏差。

## 产出价值与不足

有价值的部分：

- 防止把 fallback 200、mock、in-memory、`READY_CONFIGURED` 误判成完成。
- 明确了很多 app legacy 模块并未 exact 迁移到 `apps/api`。
- 发现了大量高风险写入口，避免无授权生产 POST。
- 补了部分 Vitest 护栏和 manifest/adapter 局部代码。
- 把旧三文档的核心语义迁入 OpenSpec，解决了一部分接力失忆问题。

不足的部分：

- 迁移代码改写比例太低。
- `tasks.md` 的进度数字混合了文档治理和迁移实施，不能体现真实迁移完成度。
- endpoint 粒度的探索项太多，文件级实施项太少。
- app legacy 的大量 endpoint 仍处于 fallback-only 或 blocked 状态。
- `DB_READY` 未闭环，不能证明真实库生产可用。
- 本地/生产三端浏览器 Network 证据仍未系统完成。
- 没有形成稳定的“每 2-3 个 endpoint 完成一个真实迁移小闭环”的节奏。

## 纠偏建议

如果继续这个 change，不建议直接按当前剩余 checkbox 顺序盲目推进。应先重构 `tasks.md` 的后续执行结构，但仍保持它是唯一任务源。

建议新增一个靠前的“Implementation Pilot Batch”块，强制把真实迁移放到前面：

1. 选 1 个 admin 普通 list endpoint。
2. 选 1 个 app legacy 只读 endpoint。
3. 选 1 个默认 blocked 的 app/admin 写入口。

每个试点都必须按文件级 checklist 展开：route、runtime、adapter、repository/service、manifest/guard、caller、Vitest、HTTP gate、browser evidence、DB/fallback 状态。只有这些文件级项闭环，才允许勾选“迁移完成”。

同时把现有探索项改口径：

- “探索完成”只能表示未知状态已归类。
- “fallback evidence”只能表示兼容路径可用。
- “blocked”只能表示安全阻断已建立。
- “migration complete” 必须保留给 exact handler、调用端、测试、运行时和证据全部完成的 endpoint。

建议新增一个真实进度看板，区别于 OpenSpec checkbox 总数：

```log
exact migrated endpoint count:
fallback-only endpoint count:
blocked write endpoint count:
DB_READY: yes/no
local browser evidence: admin/app/api counts
production browser evidence: admin/app/api counts
retirement candidates: count
```

这样用户能直接看到迁移进度，而不是只看到 Markdown 和测试数量。

## 本次暂停结论

用户不满意是合理的。当前产出不是完全无效，但与“持续 16 小时应看到大量具体 Nitro 接口迁移代码”的期待不匹配。

我这边的问题不是完全没理解目标，而是在执行中把“补齐证据、避免误判、维护 OpenSpec 接力”放得过重，把“具体接口迁移实施”推得太靠后。`tasks.md` 也确实需要纠偏：保留证据纪律，但必须把后续任务改成以 endpoint/file-level 迁移闭环为中心，而不是继续扩大 Markdown 证据层。

暂停当前 goal 是正确的。下一步应先由用户决定：是重构当前 `migrate-superpowers-docs-to-openspec-longtask` 的 `tasks.md`，还是新建一个更聚焦的 OpenSpec change，只处理“admin/app 内置 Nitro 接口迁移到独立 `apps/api`”的实施批次。
