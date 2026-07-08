# `apps/app/server` 目录删除后关闭报告

**任务编号**：task1172、task1173
**任务源**：`openspec/changes/migrate-superpowers-docs-to-openspec-longtask/tasks.md` §7B
**执行时间**：2026-07-08
**执行代理**：ZCode 子代理

## 1. 任务背景

`apps/app/server` 目录已在当前工作区物理删除（`git status` 显示大量 `D` 删除标记）。`task1174` 已完成对 `apps/app` 旧 Nitro 命令与引用残留的清理：

- `apps/app/package.json` 已移除 `dev:h5:nitro`/`dev:nitro`/`dev:mp-weixin:nitro` 脚本和 `nitro` devDependency；
- `apps/app/scripts/dev-h5-nitro.mjs`、`apps/app/scripts/dev-mp-weixin-nitro.mjs` 已删除；
- `apps/app/server/` 内置 Nitro 实现目录已删除；
- `apps/app/env/` 中 Nitro 专用环境文件及 `.env` 中 `NITRO_*` 变量已清理；
- `apps/app/vite.config.ts` 中的 Nitro 分支已清理；
- `apps/app/src/tests/nitro-runtime/` 已重命名为 `apps/app/src/tests/runtime-base/`；
- `.github/workflows/app-ci.yml` 已更新。

由于目录已删除，原 `task1172`（隔离 dry-run）调整为在现有工作区运行 app 引用扫描，确认 `apps/app/server` 无活动依赖；`task1173`（升级为 `delete-candidate`）调整为确认删除事实与回滚路径。

## 2. 验证命令与结果

### 2.1 引用扫描

扫描目标：确认 `apps/app/src` 和 `apps/app` 配置文件中不再存在对 `apps/app/server` 的活动依赖。

执行命令：

```bash
rg -n "apps/app/server|server/modules|server/shared/runtime|legacy-dispatch|process\.cwd\(\).*server" apps/app/src --glob "!*.md"
rg -n "apps/app/server|server/modules|server/shared/runtime|legacy-dispatch|build:nitro|dev:nitro|preview:nitro" apps/app --glob "*.json" --glob "*.ts" --glob "*.js" --glob "*.mjs" --glob "*.vue" --glob "!*.md"
rg -n "apps/app/server" apps/app --glob "*.json" --glob "*.ts" --glob "*.js" --glob "*.mjs" --glob "*.vue" --glob "*.md" --glob "*.yaml" --glob "*.yml"
rg -n "apps/app/server" .github --glob "*.yml" --glob "*.yaml" --glob "*.json" --glob "*.md"
```

结果：

- `apps/app/src` 中仅命中 `src/api/mock/shared/tests/*-retirement.test.ts` 中的 `not.toContain('server/modules')` 负向断言，这些断言属于退役测试，用于证明 mock 文件已脱离旧 server 导入，不是实际依赖。
- `apps/app` 的 `package.json`、`vite.config.ts`、`tsconfig.json` 等配置文件中未命中 `apps/app/server` 或 Nitro 相关活动引用。
- `apps/api` 中命中 `server/modules` 和 `server/shared/runtime` 的条目均为 `apps/api/server` 自身模块，不是对 `apps/app/server` 的引用。
- `.github` 工作流文件中未命中 `apps/app/server` 引用。
- `apps/admin/src/docs` 部分报告文件中提到了 `apps/app/server` 和 task1172/1173，属于文档/报告中的历史说明，已按允许范围排除。

结论：`apps/app/server` 在 `apps/app` 源码和配置中无活动依赖。

### 2.2 Runtime-base URL 测试

执行命令：

```bash
pnpm -F @01s-11comm/app exec vitest run src/tests/runtime-base/runtime-base-url.test.ts
```

结果：

```text
✓ src/tests/runtime-base/runtime-base-url.test.ts (117 tests)
Test Files 1 passed (1)
Tests 117 passed (117)
Duration 444ms
```

结论：测试通过，117 个断言全部通过。

### 2.3 TypeScript 类型检查

执行命令：

```bash
pnpm -F @01s-11comm/app run type-check
```

结果：

```text
$ vue-tsc --noEmit
```

结论：无类型错误，type-check 通过。

### 2.4 H5 生产构建

执行命令：

```bash
pnpm -F @01s-11comm/app run build:h5:prod
```

结果：失败。

错误信息：

```text
Only URLs with a scheme in: file, data, and node are supported by the default ESM loader. On Windows, absolute paths must be valid file:// URLs. Received protocol 'd:'
Build failed with errors.
```

判定：该错误是典型的 Windows 本地 ESM 路径问题（`d:` 协议不被默认 ESM loader 支持），与 `apps/app/server` 删除无关。本任务不将其作为阻塞项，仅记录为环境阻塞。后续应在 Linux/macOS 或 CI 环境中复测该构建命令。

## 3. 结论

- `task1172`：在现有工作区运行 app 引用扫描，确认 `apps/app/server` 无活动依赖（mock/test/docs 中的历史/负向引用除外）。核心验证通过。
- `task1173`：`apps/app/server` 目录已物理删除，删除事实成立，回滚路径明确。核心验证通过。
- `tasks.md` 中 task1172 和 task1173 已标记完成。
- `agent-progress.md` 和 `agent-findings.md` 已同步更新。
- `retirement-evidence-matrix.md` 中 `apps/app/server` 行已标记为 `delete-candidate-completed`（由主代理在 task1174 完成后更新）。

## 4. 限制与禁止外推

本关闭报告仅确认 `apps/app/server` 目录删除后的引用验证和删除事实，不代表以下任务完成：

- `apps/app/server/modules/**` 中 fallback-only endpoint 已全部收口（task438/task439 仍 open）；
- 全局 shadow-off/fallback 切换完成；
- 生产 App H5 Network 验证通过；
- `apps/api` 所有 exact handler 迁移完成；
- `apps/admin/server` 目录可删除；
- 旧 app 内置 Nitro 可完全退役。

## 5. 回滚路径

如需恢复 `apps/app/server`：

```bash
git restore --source=HEAD --staged -- apps/app/server
git restore --source=HEAD --staged -- apps/app/scripts/dev-h5-nitro.mjs apps/app/scripts/dev-mp-weixin-nitro.mjs
git checkout -- apps/app/server apps/app/scripts/dev-h5-nitro.mjs apps/app/scripts/dev-mp-weixin-nitro.mjs
```

恢复后需重新运行 `pnpm -F @01s-11comm/app run type-check` 和相关验证。

## 6. 相关文件

- `D:\code\ruan-cat\01s-11comm\openspec\changes\migrate-superpowers-docs-to-openspec-longtask\tasks.md`
- `D:\code\ruan-cat\01s-11comm\openspec\changes\migrate-superpowers-docs-to-openspec-longtask\agent-progress.md`
- `D:\code\ruan-cat\01s-11comm\openspec\changes\migrate-superpowers-docs-to-openspec-longtask\agent-findings.md`
- `D:\code\ruan-cat\01s-11comm\openspec\changes\migrate-superpowers-docs-to-openspec-longtask\retirement-evidence-matrix.md`
- `D:\code\ruan-cat\01s-11comm\apps\admin\src\docs\reports\2026-07-08-app-nitro-retirement-residual-scan.md`
- `D:\code\ruan-cat\01s-11comm\apps\admin\src\docs\reports\2026-07-08-app-nitro-retirement-review.md`
