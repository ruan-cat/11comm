# 2026-07-08 admin 内置 Nitro server 删除干跑报告

## 任务来源

- OpenSpec change：`migrate-superpowers-docs-to-openspec-longtask` §7A
- 任务编号：task1132、task1133
- 目标：在隔离环境中对 `apps/admin/server` 执行 dry-run 重命名，验证删除后 admin 包是否仍能正常 typecheck/build/关键测试，并据此更新退役证据矩阵。

## 执行环境

- 主机仓库：`D:\code\ruan-cat\01s-11comm`
- 当前分支：`dev`
- 隔离工作树：`D:\code\ruan-cat\01s-11comm-wt`
- 隔离分支：`task1132-admin-server-dryrun`
- 创建命令：

```bash
cd /d/code/ruan-cat/01s-11comm
WT_DIR=/d/code/ruan-cat/01s-11comm-wt
rm -rf "$WT_DIR"
git worktree add "$WT_DIR" -b task1132-admin-server-dryrun
```

隔离工作树基于当前 `HEAD` 新建，未带入主工作区未提交变更，因此 `apps/app/server` 在隔离树中仍按 `HEAD` 存在；本次任务只操作 `apps/admin/server`，不影响 `apps/app` 相关状态。

## 1. 隔离重命名（dry-run）

在隔离工作树中执行：

```bash
cd /d/code/ruan-cat/01s-11comm-wt
mv apps/admin/server apps/admin/server.__retirement_dryrun__
```

结果：`apps/admin/server` 被重命名为 `apps/admin/server.__retirement_dryrun__`，未实际删除任何文件，主仓库 `apps/admin/server` 保持原状。

## 2. admin 引用扫描

在隔离工作树中执行全库引用扫描：

```bash
cd /d/code/ruan-cat/01s-11comm-wt
rg --files-with-matches "apps/admin/server" | sort
```

命中文件分为以下类别：

| 类别 | 示例文件 | 说明 |
|------|----------|------|
| 活动运行时代码 | 无 | `apps/admin/src`、`apps/api`、`apps/app/src` 中均未发现字面量引用或相对导入 |
| 旧文档/报告 | `apps/admin/src/docs/**/*.md`、`docs/**/*.md` | 历史说明、退役证据来源，仅作负向参考 |
| AI 记忆文件 | `AGENTS.md`、`CLAUDE.md`、`GEMINI.md` | 只读历史记录，非运行时依赖 |
| OpenSpec 证据/归档 | `openspec/changes/**/*.md`、`openspec/changes/archive/**/*.md` | 规范与证据工件，非运行时依赖 |
| 生成器模板 | `scripts/generate-tasks.ts` | 明确禁止新增 `apps/admin/server/**`，对旧目录的引用是负向说明 |
| 测试 helper | `apps/admin/tests/setup-neon.ts`、`apps/api/tests/infra/api-seed-cli.test.ts`、`apps/api/tests/infra/app-server-retirement-imports.test.ts` | 旧测试环境或 api 自身回归测试，不依赖 `apps/admin/server` 运行 |

在排除 docs、AI 记忆、OpenSpec 工件、生成器模板和测试 helper 后，**运行时代码中无 `apps/admin/server` 活动依赖**。进一步对 `apps/admin/src`、`apps/api`、`apps/app/src` 执行导入扫描：

```bash
cd /d/code/ruan-cat/01s-11comm-wt
rg -n "from\s+['\"]\.\.\/server|import\s+.*['\"]\.\.\/server|from\s+['\"]@\/server|apps/admin/server" apps/admin/src apps/api apps/app/src --glob '!apps/admin/src/docs/**'
```

输出为空，确认无活动依赖。

## 3. 依赖安装

隔离工作树中执行：

```bash
cd /d/code/ruan-cat/01s-11comm-wt
pnpm install --frozen-lockfile
```

结果：`Done in 30.9s using pnpm v11.0.8`，安装成功。

## 4. typecheck

### 第一次尝试

```bash
cd /d/code/ruan-cat/01s-11comm-wt
pnpm -F @01s-11comm/admin typecheck
```

结果：**失败**。错误集中在 `TS2304: Cannot find name 'UseAxiosOptionsJsonVO' / 'ParamsQueryKey' / 'UpType' / 'DialogOptions' / 'consola' / 'ref' / 'computed' / 'merge' / 'sortRoutes' / 'HttpCode' ...` 等全局自动导入类型。这些类型由 `unplugin-auto-import` 在 `types/auto-imports.d.ts` 中声明，而干净工作树中尚未生成该文件。这不是 `apps/admin/server` 删除导致的问题，而是干净工作树缺少预生成声明文件。

### 生成声明文件

执行 `build:prod`（详见第 5 节），`unplugin-auto-import` 在构建过程中生成了 `apps/admin/types/auto-imports.d.ts` 和 `apps/admin/src/route-map.d.ts`。

### 第二次尝试

```bash
cd /d/code/ruan-cat/01s-11comm-wt
pnpm -F @01s-11comm/admin typecheck
```

结果：**通过**，输出为：

```
$ tsc --noEmit && vue-tsc --noEmit --skipLibCheck
```

## 5. build:prod

```bash
cd /d/code/ruan-cat/01s-11comm-wt
pnpm -F @01s-11comm/admin build:prod
```

结果：**通过**。构建耗时约 1m27s，产物输出到 `apps/admin/dist`，最终输出：

```
Tasks:    1 successful, 1 total
Cached:    0 cached, 1 total
  Time:    1m27.201s
```

关键观察：
- `apps/admin/build/plugins/index.ts` 不再接入 `nitro()` 或 `nitro/vite`。
- `vite.config.ts` 只使用 Vite 前端插件链，没有 `serverDir`/`scanDirs` 配置。
- 重命名 `apps/admin/server` 未导致构建失败，说明当前 admin 包已不依赖该目录作为构建入口。

## 6. 关键页面 / API base URL 测试

选取覆盖 admin 调用端 URL resolver 与 shadow/代理/直连三态的关键 Vitest 用例：

```bash
cd /d/code/ruan-cat/01s-11comm-wt
pnpm -F @01s-11comm/admin exec vitest run \
  src/api/dev-team/config-manage/tests/phase7-shadow-resolver.test.ts \
  src/api/dev-team/menu-manage/tests/phase7-shadow-resolver-menu.test.ts \
  src/api/property-manage/contract-manage/upload/tests/index.test.ts
```

结果：

```
Test Files  3 passed (3)
     Tests  35 passed (35)
```

其中：
- `phase7-shadow-resolver.test.ts` 20 tests：覆盖 `config-manage` 类型/配置项/配置中心/字典四类 hook 在 shadow 关闭、shadow+代理、shadow+直连三态下的 URL 解析。
- `phase7-shadow-resolver-menu.test.ts` 12 tests：覆盖 menu-catalog/menu-group/menu-item/refresh-cache 四类 hook 的同样三态。
- `upload/tests/index.test.ts` 3 tests：覆盖 contract upload 在 shadow 代理、shadow 直连、shadow 关闭但 standalone 开启三种 base URL 形态。

所有测试证明 admin 调用端不再依赖 `apps/admin/server` 作为 base URL 来源；resolver 已统一指向 `apps/api` 或保留旧相对路径。

## 7. 结论与证据矩阵更新

- 隔离 dry-run 成功：重命名 `apps/admin/server` 后，admin 运行时代码无活动依赖。
- `build:prod` 通过；`typecheck` 在生成自动导入声明后通过。
- 关键 API base URL / shadow resolver 测试 35/35 通过。
- 无证据表明白 `apps/admin/server` 目录仍被 admin 构建或前端运行时引用。

据此，在 `retirement-evidence-matrix.md` 中将 `apps/admin/server` 行的 `retirementDecision` 从 `blocked` 升级为 `delete-candidate`，并同步更新了以下字段：

- `currentDependency`：改为“隔离 dry-run 后无活动依赖；仅 docs、legacy generator、test helper 等负向/历史引用”。
- `configScriptEvidence`：说明 `apps/admin/nitro.config.ts`、`apps/admin/drizzle.config.ts` 已不在 active 阻断，生成器与活动 docs 命中已归类为 legacy/负向说明。
- `testBuildEvidence`：记录 `typecheck` 首次因干净工作树缺少 `types/auto-imports.d.ts` 失败，`build:prod` 生成后二次通过；`build:prod` 通过。
- `runtimeEvidence`：关键页面/URL resolver Vitest 通过；无运行时回退旧 admin server 证据。
- `fallbackOrShadowEvidence`：resolver 与 upload 三态测试证明 shadow 关闭/代理/直连均指向 `apps/api` 或保留旧相对路径，不触发旧 server fallback。
- `dryRunEvidence`：隔离工作树重命名为 `apps/admin/server.__retirement_dryrun__`，引用扫描无活动依赖，typecheck/build/关键测试通过。
- `rollbackNote`：恢复 `apps/admin/server` 目录名并重新运行验证即可回滚。

## 8. 边界与后续

- 本次任务**只将 `apps/admin/server` 升级为删除候选（`delete-candidate`），并未实际删除该目录**。主仓库中 `apps/admin/server` 仍保持原状。
- `apps/api` 侧仍需继续完成：seed/reset、R2/upload 服务迁移、CUD 生产 evidence、全局 shadow-off/fallback 复验、旧 app server 退役等后续门禁。
- `apps/app` 相关状态在本次任务中未被修改；`apps/app/server` 的退役状态仍按既有证据矩阵执行。

## 命令清单（便于复现）

```bash
# 1. 创建隔离工作树
cd /d/code/ruan-cat/01s-11comm
WT_DIR=/d/code/ruan-cat/01s-11comm-wt
rm -rf "$WT_DIR"
git worktree add "$WT_DIR" -b task1132-admin-server-dryrun

# 2. dry-run 重命名
cd "$WT_DIR"
mv apps/admin/server apps/admin/server.__retirement_dryrun__

# 3. 安装依赖
cd "$WT_DIR"
pnpm install --frozen-lockfile

# 4. 引用扫描
rg --files-with-matches "apps/admin/server" "$WT_DIR" | sort
rg -n "from\s+['\"]\.\.\/server|import\s+.*['\"]\.\.\/server|from\s+['\"]@\/server|apps/admin/server" \
  "$WT_DIR"/apps/admin/src "$WT_DIR"/apps/api "$WT_DIR"/apps/app/src

# 5. 生成声明文件并验证构建
cd "$WT_DIR"
pnpm -F @01s-11comm/admin build:prod

# 6. 验证 typecheck
cd "$WT_DIR"
pnpm -F @01s-11comm/admin typecheck

# 7. 关键 resolver/base URL 测试
cd "$WT_DIR"
pnpm -F @01s-11comm/admin exec vitest run \
  src/api/dev-team/config-manage/tests/phase7-shadow-resolver.test.ts \
  src/api/dev-team/menu-manage/tests/phase7-shadow-resolver-menu.test.ts \
  src/api/property-manage/contract-manage/upload/tests/index.test.ts

# 8. 清理隔离工作树（可选）
cd /d/code/ruan-cat/01s-11comm
git worktree remove "$WT_DIR" --force
git branch -D task1132-admin-server-dryrun
```
