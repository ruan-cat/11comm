## 1. 评审基线与保护确认

- [x] 1.1 [新增] `openspec/changes/assess-legacy-nitro-server-retirement/retirement-evidence-matrix.md` - 创建退役证据矩阵文件，列出字段：`scope`、`sourcePath`、`currentDependency`、`targetReplacement`、`callerEvidence`、`testBuildEvidence`、`fallbackEvidence`、`dbWriteEvidence`、`retirementDecision`、`rollbackNote`。
- [x] 1.2 [记录] `openspec/changes/assess-legacy-nitro-server-retirement/retirement-evidence-matrix.md` - 写入保护基线：`apps/admin/server` 与 `apps/app/server` 初始目录级状态均为 `protected`，并注明本 change 不授权删除。
- [x] 1.3 [记录] `openspec/changes/assess-legacy-nitro-server-retirement/retirement-evidence-matrix.md` - 记录来自 `migrate-superpowers-docs-to-openspec-longtask` 的基线结论：旧 change 完成和 strict 校验通过不等于旧 server 目录可删。
- [x] 1.4 [验证] `openspec/changes/assess-legacy-nitro-server-retirement` - 运行 `openspec validate assess-legacy-nitro-server-retirement --strict`，确认新 change artifacts 格式有效。

## 2. Admin 旧 server 目录只读建账

- [x] 2.1 [记录] `openspec/changes/assess-legacy-nitro-server-retirement/retirement-evidence-matrix.md` - 统计并记录 `apps/admin/server` 文件总数和一级分组，至少覆盖 `api`、`db`、`services`、`utils`、`middleware`、`plugins`。
- [x] 2.2 [记录] `openspec/changes/assess-legacy-nitro-server-retirement/retirement-evidence-matrix.md` - 记录 `apps/admin/nitro.config.ts` 对 `serverDir`、`scanDirs` 或 server alias 的依赖状态。
- [x] 2.3 [记录] `openspec/changes/assess-legacy-nitro-server-retirement/retirement-evidence-matrix.md` - 记录 `apps/admin/package.json` 中 `nitro:*`、`test:nitro`、`db:legacy:*`、`db:legacy:seed`、`db:legacy:reset` 对旧 server 的依赖状态。
- [x] 2.4 [记录] `openspec/changes/assess-legacy-nitro-server-retirement/retirement-evidence-matrix.md` - 记录 `apps/admin/drizzle.config.ts` 与旧 admin server utils 的兼容依赖状态。
- [x] 2.5 [记录] `openspec/changes/assess-legacy-nitro-server-retirement/retirement-evidence-matrix.md` - 记录 admin R2/upload、contract service、DB seed 与 utils 的保留或阻断原因，默认 `retirementDecision=blocked` 或 `keep-source`。
- [x] 2.6 [验证] `openspec/changes/assess-legacy-nitro-server-retirement/retirement-evidence-matrix.md` - 运行 `rg -n "apps/admin/server|server/db|server/utils|server/services|db:legacy|nitro:build|test:nitro" apps/admin apps/api tests scripts -g "!**/node_modules/**"`，把命中摘要写入证据矩阵。

## 3. App 旧 server 目录只读建账

- [x] 3.1 [记录] `openspec/changes/assess-legacy-nitro-server-retirement/retirement-evidence-matrix.md` - 统计并记录 `apps/app/server` 文件总数和一级分组，至少覆盖 `modules`、`handlers`、`shared`、`routes`。
- [x] 3.2 [记录] `openspec/changes/assess-legacy-nitro-server-retirement/retirement-evidence-matrix.md` - 记录 `apps/app/nitro.config.ts` 中 `serverDir: './server'`、`/app/**` handler、`/callComponent/**` handler 的依赖状态。
- [x] 3.3 [记录] `openspec/changes/assess-legacy-nitro-server-retirement/retirement-evidence-matrix.md` - 记录 `apps/app/vite.config.ts` 中 Nitro 插件和 `serverDir` 依赖状态。
- [x] 3.4 [记录] `openspec/changes/assess-legacy-nitro-server-retirement/retirement-evidence-matrix.md` - 记录 `apps/app/package.json` 中 `dev:nitro`、`build:nitro:*`、`preview:nitro`、`ci` 对旧 Nitro server 的依赖状态。
- [x] 3.5 [记录] `openspec/changes/assess-legacy-nitro-server-retirement/retirement-evidence-matrix.md` - 记录 `apps/app/src/api/mock/**` 与 `apps/app/src/tests/nitro-runtime/**` 对 `../../../server/modules/**` 的依赖摘要。
- [x] 3.6 [验证] `openspec/changes/assess-legacy-nitro-server-retirement/retirement-evidence-matrix.md` - 运行 `rg -n "server/modules|serverDir|legacy-dispatch|build:nitro|dev:nitro|/callComponent/|/app/" apps/app apps/api -g "!**/node_modules/**"`，把命中摘要写入证据矩阵。

## 4. Endpoint 与 fallback 阻断分类

- [x] 4.1 [记录] `openspec/changes/assess-legacy-nitro-server-retirement/retirement-evidence-matrix.md` - 从 `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/old-service-retirement-candidates.md` 摘录 admin 160 行、app 214 个旧 runtime endpoint、app exact/fallback-only/client-only gap 的当前基线。
- [x] 4.2 [记录] `openspec/changes/assess-legacy-nitro-server-retirement/retirement-evidence-matrix.md` - 对 admin old `/api/**` exact covered 项保持 `keep-source`，直到 caller、browser、DB/write、fallback/shadow-off 与 dry-run 证据齐全。
- [x] 4.3 [记录] `openspec/changes/assess-legacy-nitro-server-retirement/retirement-evidence-matrix.md` - 对 app fallback-only 路径保持 `keep-source` 或 `blocked`，并标记为 `apps/app/server` 目录级删除阻断项。
- [x] 4.4 [记录] `openspec/changes/assess-legacy-nitro-server-retirement/retirement-evidence-matrix.md` - 对 app guarded write、client-only gap、server-only endpoint 和 diagnostic/test endpoint 分别记录保守处置策略。
- [x] 4.5 [验证] `openspec/changes/assess-legacy-nitro-server-retirement/retirement-evidence-matrix.md` - 运行 `rg -n "fallback-only|requires-old-app-server-fallback|delete-candidate|keep-source|blocked" openspec/changes/migrate-superpowers-docs-to-openspec-longtask`，确认旧台账未放行目录删除。

## 5. Dry-run rename/delete 设计

- [x] 5.1 [新增] `openspec/changes/assess-legacy-nitro-server-retirement/dry-run-plan.md` - 创建 dry-run 计划，规定必须在独立分支或 worktree 执行，不得在当前工作区直接删除旧目录。
- [x] 5.2 [记录] `openspec/changes/assess-legacy-nitro-server-retirement/dry-run-plan.md` - 写明 admin dry-run 步骤：临时 rename `apps/admin/server`，运行引用扫描、admin typecheck、admin tests、admin Nitro build 或其替代验证，并记录失败。
- [x] 5.3 [记录] `openspec/changes/assess-legacy-nitro-server-retirement/dry-run-plan.md` - 写明 app dry-run 步骤：临时 rename `apps/app/server`，运行引用扫描、app typecheck、app Vitest、`pnpm -F @01s-11comm/app run build:nitro:vercel` 或明确替代决策，并记录失败。
- [x] 5.4 [记录] `openspec/changes/assess-legacy-nitro-server-retirement/dry-run-plan.md` - 写明 api fallback 验证步骤：运行 legacy fallback/shadow-off 相关 Vitest，并确认未依赖旧 app server fallback-only 路径。
- [x] 5.5 [记录] `openspec/changes/assess-legacy-nitro-server-retirement/dry-run-plan.md` - 写明 rollback 步骤：撤销 rename/delete 实验、恢复旧目录、保留失败清单，不把 dry-run 删除带回主工作区。

## 6. 验证与完成判定

- [x] 6.1 [验证] `openspec/changes/assess-legacy-nitro-server-retirement` - 运行 `openspec validate assess-legacy-nitro-server-retirement --strict`，确认本退役评审 change 格式有效。
- [x] 6.2 [验证] `openspec/changes/assess-legacy-nitro-server-retirement` - 运行 `git diff --check -- openspec/changes/assess-legacy-nitro-server-retirement`，确认新增 OpenSpec 文档无空白错误。
- [x] 6.3 [决策] `openspec/changes/assess-legacy-nitro-server-retirement/tasks.md` - 在只读建账和 dry-run 计划完成前，保持旧目录删除任务不存在；不得新增直接删除 `apps/admin/server` 或 `apps/app/server` 的 checkbox。
- [x] 6.4 [决策] `openspec/changes/assess-legacy-nitro-server-retirement/retirement-evidence-matrix.md` - 只有在对应文件组通过引用清零、替代实现、验证命令、fallback 处置和 rollback 方案后，才允许写入 `retirementDecision=delete-candidate`。
- [x] 6.5 [决策] `openspec/changes/assess-legacy-nitro-server-retirement/retirement-evidence-matrix.md` - 当且仅当所有目标文件组均为 `delete-candidate` 后，向用户报告“可进入删除执行阶段”，并等待用户明确确认，不自动删除目录。
