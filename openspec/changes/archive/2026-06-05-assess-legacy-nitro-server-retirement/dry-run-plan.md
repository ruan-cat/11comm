# 旧 Nitro Server Dry-run Rename/Delete 计划

本计划只定义验证方式，不授权在当前工作区直接删除、移动、归档、重命名或清空 `apps/admin/server` 或 `apps/app/server`。

## 执行原则

- dry-run MUST 在独立分支或独立 worktree 中执行。
- dry-run MUST 使用临时 rename，而不是永久删除。
- dry-run MUST 在结束后恢复目录或丢弃隔离 worktree。
- dry-run 失败项 MUST 写回 `retirement-evidence-matrix.md` 或 `tasks.md`，不能在聊天记录里替代。
- 当前工作区存在用户改动 `apps/admin/src/docs/prompts/各种杂项/index.md`，dry-run 不得覆盖或提交该改动。

## 前置检查

1. 确认当前分支和工作区状态：

   ```powershell
   git status --short --branch
   ```

2. 确认新 change 格式有效：

   ```powershell
   openspec validate assess-legacy-nitro-server-retirement --strict
   ```

3. 确认旧目录存在：

   ```powershell
   Test-Path apps\admin\server
   Test-Path apps\app\server
   ```

## 隔离 worktree 建议

推荐使用 worktree 进行 dry-run：

```powershell
git worktree add ..\01s-11comm-retirement-dryrun dev
```

进入 worktree 后只做临时 rename 与验证，不提交、不推送。验证完成后退出并移除：

```powershell
git worktree remove ..\01s-11comm-retirement-dryrun
```

如果 worktree 创建失败，可以改用临时分支，但仍不得在原工作区执行 destructive 操作。

## Admin dry-run

### 临时 rename

```powershell
Rename-Item -LiteralPath apps\admin\server -NewName server.__retirement_dryrun__
```

### 必跑扫描

```powershell
rg -n "apps/admin/server|server/db|server/utils|server/services|db:legacy|nitro:build|test:nitro" apps/admin apps/api tests scripts -g "!**/node_modules/**"
```

预期：如果仍命中运行时、脚本、测试或配置依赖，则 `apps/admin/server` 不能删除，对应矩阵项保持 `blocked` 或 `keep-source`。

### 必跑验证

根据仓库脚本可用性执行：

```powershell
pnpm -F @01s-11comm/admin typecheck
pnpm -F @01s-11comm/admin exec vitest run
pnpm -F @01s-11comm/admin run nitro:build:vercel
```

如果某个命令不存在或环境缺失，必须记录为 `not-run-env-or-script-missing`，不得写成通过。

### 恢复

```powershell
Rename-Item -LiteralPath apps\admin\server.__retirement_dryrun__ -NewName server
```

## App dry-run

### 临时 rename

```powershell
Rename-Item -LiteralPath apps\app\server -NewName server.__retirement_dryrun__
```

### 必跑扫描

```powershell
rg -n "server/modules|serverDir|legacy-dispatch|build:nitro|dev:nitro|/callComponent/|/app/" apps/app apps/api -g "!**/node_modules/**"
```

预期：当前已知会命中 `apps/app/nitro.config.ts`、`apps/app/vite.config.ts`、`apps/app/package.json`、`apps/app/src/api/mock/**`、`apps/app/src/tests/nitro-runtime/**`、`apps/api` fallback 相关文件。只要这些依赖未迁移或未决策，`apps/app/server` 不能删除。

### 必跑验证

根据仓库脚本可用性执行：

```powershell
pnpm -F @01s-11comm/app type-check
pnpm -F @01s-11comm/app exec vitest run
pnpm -F @01s-11comm/app run build:nitro:vercel
```

如果项目实际脚本名不是 `type-check`，必须先读 `apps/app/package.json` 并使用真实脚本名。不得把未运行命令记为通过。

### 恢复

```powershell
Rename-Item -LiteralPath apps\app\server.__retirement_dryrun__ -NewName server
```

## API fallback 验证

在 app dry-run 前后都应运行 API fallback drill，确认 exact handler 与 fallback 行为边界：

```powershell
pnpm -F @01s-11comm/api exec vitest run tests/runtime/legacy-dispatch-fallback-drill.test.ts
pnpm -F @01s-11comm/api exec vitest run tests/runtime/legacy-fallback.test.ts
```

若 fallback-only 路径仍需要 `PHASE7_LEGACY_APP_FALLBACK_BASE_URL` 或旧 app server fallback，则 `apps/app/server` 目录级删除必须保持阻断。

## 判定规则

| dry-run 结果                                         | 判定                                         |
| ---------------------------------------------------- | -------------------------------------------- |
| 引用扫描仍命中旧目录运行时依赖                       | `blocked`                                    |
| typecheck/test/build 任一失败                        | `blocked`                                    |
| 命令未运行或环境缺失                                 | `blocked` 或 `not-run-env-or-script-missing` |
| fallback-only 未清零                                 | `keep-source` 或 `blocked`                   |
| 所有引用清零、验证通过、替代目标明确、回滚方案可执行 | 可逐文件组考虑 `delete-candidate`            |

## 回滚策略

- dry-run rename 失败时立即恢复目录原名。
- 如果 rename 后出现半恢复状态，运行 `git status --short -- apps/admin/server apps/app/server` 确认路径状态。
- 禁止使用 `git reset --hard` 或 `git checkout --` 回滚用户改动。
- 若在隔离 worktree 中实验，优先删除整个 dry-run worktree，而不是在主工作区修复。

## 当前结论

截至本计划创建时，dry-run 尚未执行。`apps/admin/server` 与 `apps/app/server` 仍保持 `protected`，不得删除。
