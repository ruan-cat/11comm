<!-- 已完成 -->

# Relizy 标准化收敛 Implementation Plan

> 2026-04-17 当前状态补充：
>
> - 本文对应的是 2026-04-09 的 Relizy 单链路收敛计划，已退为历史计划文档。
> - 当前仓库现行发版基线已经扩展为：`release:sub` 使用 `relizy-runner + relizy`，`release:root` 使用 `bumpp + changelogen`，并由 workflow 从根 `CHANGELOG.md` 创建 GitHub Release。
> - 文中保留的 `conventional-changelog-cli` / `changelog:conventional-changelog` 只代表当时计划快照，不再代表当前实现。

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将本仓库的 Relizy 发版入口从本地 `scripts/relizy-runner.ts` 收敛为 `@ruan-cat/utils` 提供的 `relizy-runner` bin，并同步删除旧 runner、更新 README 与验证命令。

**Architecture:** 先修正依赖安装状态，确保 `relizy` 与 `relizy-runner` 可执行；然后收敛根 `package.json` 的脚本入口，删除仓库内自建 runner 与测试，最后按技能规定的 dry-run 路径重写 README 并完成 CLI 验证。整个改造不改变 `relizy.config.ts` 的 `independent` 语义，只调整入口与文档。

**Tech Stack:** pnpm workspace, relizy, @ruan-cat/utils, TypeScript, Markdown

---

### Task 1: 修正 relizy 依赖安装状态

**Files:**

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: 记录当前依赖与命令缺失现状**

```powershell
Get-Content package.json
Get-Content node_modules\@ruan-cat\utils\package.json
pnpm exec relizy --help
```

Expected:

- `package.json` 声明 `@ruan-cat/utils` 与 `relizy`
- `node_modules/@ruan-cat/utils/package.json` 版本落后或未暴露 `relizy-runner`
- `pnpm exec relizy --help` 失败，证明当前安装状态异常

- [ ] **Step 2: 先执行一次安装以对齐锁文件与 node_modules**

```powershell
pnpm install
```

Expected:

- 安装成功
- `node_modules` 重新与锁文件同步

- [ ] **Step 3: 重新验证 relizy 与 runner 是否可执行**

```powershell
Get-Content node_modules\@ruan-cat\utils\package.json
Get-ChildItem node_modules\.bin | Where-Object { $_.Name -like '*relizy*' -or $_.Name -like '*ruan*' }
pnpm exec relizy --help
pnpm exec relizy-runner --help
```

Expected:

- `relizy` 可执行
- `relizy-runner` 可执行

- [ ] **Step 4: 若 runner 仍缺失，则最小升级依赖并重装**

```powershell
pnpm add -Dw @ruan-cat/utils@latest relizy@latest
pnpm install
```

Expected:

- `package.json` 与 `pnpm-lock.yaml` 更新到可用版本
- `pnpm exec relizy-runner --help` 成功

### Task 2: 收敛根 package.json 发版脚本

**Files:**

- Modify: `package.json`

- [ ] **Step 1: 写入目标脚本集合**

```json
{
	"scripts": {
		"release": "relizy-runner release --no-publish --no-provider-release --yes",
		"release:dry": "relizy-runner release --dry-run --no-publish --no-provider-release --no-push --no-commit --no-clean --yes",
		"changelog": "relizy-runner changelog",
		"changelog:dry": "relizy-runner changelog --dry-run"
	}
}
```

- [ ] **Step 2: 删除旧入口**

Remove:

- `release:relizy`
- 任何 `tsx scripts/relizy-runner.ts ...` 形式的脚本

- [ ] **Step 3: 保留非 Relizy 辅助脚本（历史计划快照）**

Keep unchanged:

- `release:bumpp`
- `release:changelogen`
- `changelog:conventional-changelog`（仅为 2026-04-09 当时快照；当前仓库已移除）

> **注意**：`changelog:commit-and-tag-version` 已于 2026-04-09 单独清理，原因是 `commit-and-tag-version` 将 `conventional-changelog@4.0.0` 锁死，导致旧版 `angular@6.0.0` 通过 pnpm shamefully-hoist 污染新链路，已彻底卸载该依赖。

Expected:

- 本次只收敛 Relizy 主链路，不扩大到其它发版工具

### Task 3: 删除仓库内本地 runner 与测试

**Files:**

- Delete: `scripts/relizy-runner.ts`
- Delete: `tests/relizy-runner.test.ts`

- [ ] **Step 1: 删除旧 runner 文件**

Delete file:

```text
scripts/relizy-runner.ts
```

- [ ] **Step 2: 删除仅服务于旧 runner 的测试**

Delete file:

```text
tests/relizy-runner.test.ts
```

- [ ] **Step 3: 检查仓库内是否仍存在当前入口依赖旧 runner**

```powershell
rg -n "scripts/relizy-runner\.ts|tests/relizy-runner\.test\.ts|pnpm exec tsx scripts/relizy-runner" .
```

Expected:

- 只剩历史报告或历史 issue 文档引用
- 当前入口文件不再依赖旧 runner

### Task 4: 最小调整 relizy 配置兼容性

**Files:**

- Modify: `relizy.config.ts`
- Modify: `changelog.config.ts`

- [ ] **Step 1: 检查 relizy 配置是否仍与技能基线一致**

Checklist:

- `versionMode: "independent"`
- `packages` 与 `pnpm-workspace.yaml` 对齐
- `release.publish = false`
- `release.providerRelease = false`
- `changelog.formatCmd = "pnpm run format:changelog"`

- [ ] **Step 2: 仅在依赖升级引发类型或字段不兼容时做等价修订**

Allowed shape:

```ts
release: {
	changelog: true,
	commit: true,
	push: true,
	gitTag: true,
	clean: true,
	noVerify: false,
	publish: false,
	providerRelease: false,
	social: false,
	prComment: false,
}
```

Expected:

- 不改变 `independent`、`publish: false`、`providerRelease: false` 语义

### Task 5: 重写根 README 的 Relizy 发版章节

**Files:**

- Modify: `README.md`

- [ ] **Step 1: 替换所有当前入口说明为 bin 形式**

Required command examples:

```bash
pnpm release
pnpm run release:dry
pnpm run changelog
pnpm run changelog:dry
pnpm exec relizy-runner --help
pnpm exec relizy-runner changelog --dry-run
pnpm exec relizy-runner release --dry-run --no-publish --no-provider-release --no-push --no-commit --no-clean --yes
```

- [ ] **Step 2: 删除对本地 runner 路径的当前说明**

Remove current README references to:

- `scripts/relizy-runner.ts`
- `pnpm exec tsx scripts/relizy-runner.ts ...`
- 以旧 runner 为前提的“当前使用方式”

- [ ] **Step 3: 保留历史风险说明，但改成当前入口语义**

README must still explain:

- `--yes` 的作用
- `--no-yes` 的人工确认方式，以及它只作用于 `release` / `bump`
- Windows GNU 工具兼容与 baseline tag 预检是 `relizy-runner` 提供，不改变 relizy 语义
- README 与 CHANGELOG 的职责边界

### Task 6: 验证 CLI、脚本与文档一致性

**Files:**

- Test: `package.json`
- Test: `README.md`
- Test: `relizy.config.ts`
- Test: `changelog.config.ts`

- [ ] **Step 1: 验证 relizy-runner 与 relizy CLI**

```powershell
pnpm exec relizy-runner --help
pnpm exec relizy --help
```

Expected:

- 两个命令都能正常输出帮助

- [ ] **Step 2: 验证 changelog dry-run**

```powershell
pnpm exec relizy-runner changelog --dry-run
```

Expected:

- 无配置错误
- 若无可写变更，输出仍可解释

- [ ] **Step 3: 验证 release dry-run**

```powershell
pnpm exec relizy-runner release --dry-run --no-publish --no-provider-release --no-push --no-commit --no-clean --yes
```

Expected:

- 无平台错误
- 无配置错误
- 若当前无变更可发，也应视为接入通过

- [ ] **Step 4: 验证仓库内当前入口不再依赖旧 runner**

```powershell
rg -n "scripts/relizy-runner\.ts|pnpm exec tsx scripts/relizy-runner|release:relizy" README.md package.json relizy.config.ts changelog.config.ts docs
```

Expected:

- `README.md`、`package.json` 中不再有当前入口残留
- 历史文档中的历史叙述允许保留

- [ ] **Step 5: 可选格式检查**

```powershell
pnpm exec prettier --check README.md package.json relizy.config.ts changelog.config.ts docs/superpowers/specs/2026-04-09-relizy-standardization-design.md docs/superpowers/plans/2026-04-09-relizy-standardization.md
```

Expected:

- 相关文件格式通过，或明确指出需格式化的文件
