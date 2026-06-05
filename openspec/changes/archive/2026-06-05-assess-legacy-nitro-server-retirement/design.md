## Context

`migrate-superpowers-docs-to-openspec-longtask` 已完成 387/387 项任务，并且 `openspec validate migrate-superpowers-docs-to-openspec-longtask --strict` 通过。该结论说明 Phase7/OpenSpec 迁移、证据模型、退役门禁和台账已经可审计，但并不表示旧 Nitro server 目录可删除。

当前只读审计显示：

- `apps/admin/server` 仍有约 189 个文件，覆盖 `/api/**` routes、DB seed、services、utils、middleware 和 plugins。
- `apps/app/server` 仍有约 69 个文件，覆盖 legacy dispatch、runtime shared helpers、modules endpoints/repositories 和 Nitro routes。
- `apps/app/nitro.config.ts` 仍使用 `serverDir: './server'`，并把 `/app/**` 与 `/callComponent/**` 指向 `./server/handlers/legacy-dispatch`。
- `apps/app/package.json` 仍保留 `dev:nitro`、`build:nitro:*`、`preview:nitro`、`ci` 等旧 Nitro server 构建入口。
- `apps/app/src/api/mock/**` 与 `apps/app/src/tests/nitro-runtime/**` 大量导入 `../../../server/modules/**`。
- `apps/admin/package.json` 仍保留 `db:legacy:seed` 与 `db:legacy:reset`，指向 `server/db/seed/index.ts`。
- `apps/admin/drizzle.config.ts` 仍保留对旧 admin server utils 的兼容引用。
- app 旧 runtime 仍存在 fallback-only 路径和未 exact 承接路径，不能整体删除 `apps/app/server`。

因此，本 change 的目标是建立独立退役评审流程，而不是执行删除。

## Goals / Non-Goals

**Goals:**

- 建立 `apps/admin/server` 与 `apps/app/server` 的目录级退役评审门禁。
- 产出可追踪的证据矩阵，把每个文件组或 endpoint 组归类为 `protected`、`blocked`、`keep-source`、`not-candidate-but-unused` 或 `delete-candidate`。
- 明确 admin 与 app 的不同阻断面，避免用 admin exact route 覆盖或 API HTTP 200 外推 app 退役。
- 定义 dry-run rename/delete 的隔离验证方式和失败回写规则。
- 定义进入删除执行阶段前必须取得的用户确认。

**Non-Goals:**

- 不在本 change 创建时删除、移动、归档、重命名或清空 `apps/admin/server` 或 `apps/app/server`。
- 不修改生产 API 行为、不改数据库 schema、不执行生产 CUD、不读取或写入 Vercel/Neon/R2 secret。
- 不归档 `migrate-superpowers-docs-to-openspec-longtask`。
- 不把 `D:\code\ruan-cat\01s-11comm-app` 纳入删除对象；它仍是只读历史来源。

## Decisions

### Decision 1: 退役评审独立于 Phase7/OpenSpec 迁移完成状态

选择：新建 `assess-legacy-nitro-server-retirement`，只承接旧 Nitro server 退役评审。

原因：上一个 change 已明确“删除旧服务目录必须是独立 OpenSpec change 或明确单独评审”。如果直接在已完成 change 上追加删除动作，会把“文档迁移完成”误读成“runtime 目录可删除”。

替代方案：直接删除旧目录后跑测试。拒绝该方案，因为当前仍有配置、mock、测试、fallback 和 package scripts 直接依赖旧目录。

### Decision 2: 以文件组和 endpoint 组为退役粒度

选择：不把 `apps/admin/server` 或 `apps/app/server` 作为单个二元开关，而是拆成文件组、endpoint 组、运行时职责和构建入口。

原因：两个目录内仍混有多种职责。admin 包含 routes、DB seed、R2/upload、utils 和 compatibility scripts；app 包含 legacy dispatch、modules、mock/test 共享逻辑和 Nitro build。单纯目录级判断会掩盖可迁移项和必须保留项。

替代方案：只按 endpoint route count 评估。拒绝该方案，因为 exact handler 覆盖不能证明调用端、DB/write、fallback、mock/test 和 build 全部安全。

### Decision 3: 使用保守状态机升级退役决策

选择：初始状态为 `protected` 或 `blocked`，只允许证据齐全后升级到 `delete-candidate`。

状态含义：

- `protected`: 受保护目录或未进入评审的文件组。
- `blocked`: 已知存在阻断，不能删除。
- `keep-source`: 当前仍作为 source、fallback、mock/test 或回滚来源保留。
- `not-candidate-but-unused`: 未被运行时依赖，但本次不作为删除候选，例如历史证据、诊断文件或需单独归档的内容。
- `delete-candidate`: 证据齐全、dry-run 通过、回滚方案明确，但仍需要用户确认后才能删除。

替代方案：使用布尔 `canDelete`。拒绝该方案，因为它不能表达保留、阻断、未使用但不删除、已候选但待确认等不同状态。

### Decision 4: dry-run rename/delete 必须隔离执行

选择：删除前在独立分支或 worktree 中临时 rename 旧目录，并运行引用扫描、typecheck、Vitest、Nitro build 和 OpenSpec 校验。

原因：当前工作区可能有用户未提交改动，旧目录删除具有大范围影响。隔离环境可以暴露真实破坏面，同时不污染主工作区。

替代方案：在当前工作区直接 rename 再 revert。拒绝该方案，因为风险高，且容易覆盖用户改动。

## Risks / Trade-offs

- [Risk] `tasks.md` 全部完成被误读为旧目录可删 → Mitigation: 本 change 在 proposal/spec/design/tasks 每层重复声明“完成不等于删除授权”。
- [Risk] app fallback-only 路径未迁完却删除 `apps/app/server` → Mitigation: app 退役矩阵必须列出 fallback-only、client-only gap、server-only endpoint 和 guarded write。
- [Risk] admin 旧 DB/seed/R2 入口被误删 → Mitigation: admin 退役矩阵必须覆盖 package scripts、drizzle compatibility、R2/upload 和 DB seed。
- [Risk] dry-run 发现大量失败导致任务扩大 → Mitigation: 先做只读矩阵，再做隔离 dry-run，把失败回写为后续小任务，不在同一步删除。
- [Risk] 验证命令过重或环境不完整 → Mitigation: 每个失败必须记录是环境缺失、测试失败还是真实依赖；不能用未运行命令替代通过证据。

## Migration Plan

1. 建立本 change 的 proposal/spec/design/tasks，并通过 `openspec validate assess-legacy-nitro-server-retirement --strict`。
2. 只读扫描 `apps/admin/server`、`apps/app/server`、相关 config、package scripts、tests、mock、`apps/api` fallback 和 OpenSpec 台账。
3. 写入证据矩阵，初始状态保持 `protected`、`blocked` 或 `keep-source`。
4. 对明显可迁移的依赖先提出后续迁移任务，例如 app mock/test 迁出 `server/modules/**`，admin legacy db scripts 迁到 `apps/api` 或明确废弃。
5. 在隔离 worktree 或分支中执行 dry-run rename/delete，运行验证命令并记录失败清单。
6. 只有当目标目录所有文件组均为 `delete-candidate` 时，向用户报告“可进入删除执行阶段”。
7. 删除执行必须另开明确步骤，并保留 rollback plan。

## Open Questions

- `apps/app` 是否还需要长期保留独立 Nitro build 作为开发或 CI 入口，还是最终只保留 H5/client 构建？
- `apps/app/src/api/mock/**` 共享业务逻辑应迁入 `apps/api`、`apps/type`，还是保留在 app 侧但移出 `server/**`？
- `apps/admin` 的 `db:legacy:*` 脚本是迁到 `apps/api`、删除，还是保留兼容 wrapper？
- app fallback-only 路径中哪些需要 exact handler 迁入 `apps/api`，哪些应永久 blocked 或废弃？
