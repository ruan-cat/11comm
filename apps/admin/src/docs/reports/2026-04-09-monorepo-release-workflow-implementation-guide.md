<!-- 非常有价值的报告 不予删除 -->

# 2026-04-09 Monorepo 全套发版流程落地指南

> 2026-04-17 当前状态补充：
>
> - 本报告保留 2026-04-09 的落地过程与推导链路，但仓库当前实现已经继续演进。
> - 当前现行根包链路为 `bumpp + changelogen`，不再使用 `conventional-changelog-cli` 或 `changelog:conventional-changelog` 作为正式根发版方案。
> - 下文凡出现 `conventional-changelog-cli` 或 `changelog:conventional-changelog`，都应视为历史快照；若与仓库当前代码冲突，以当前 `package.json`、`bump.config.ts`、`.github/workflows/release.yaml` 和根 `README.md` 为准。

## 概述

本文档记录了在 pnpm monorepo 项目中，实现**子包独立版本管理 + 根包版本管理 + GitHub Release 自动生成**的完整流程。适用于任何需要在 monorepo 中实现独立发版的项目。

### 设计理念

1. **本地控制 tag 生成**：开发者在本地运行 `pnpm release` 一条命令完成所有版本管理（bump、changelog、tag）
2. **云端负责 GitHub Release**：GitHub Actions 检测到 tag 推送后，自动从 CHANGELOG.md 提取内容创建 GitHub Release
3. **单次 push**：所有 tags（子包 + 根包）在一次 `git push --follow-tags` 中推送，减少 CI 触发延迟
4. **两工具协作**：relizy 负责子包（independent 模式），bumpp 负责根包，各司其职

### 最终效果

运行 `pnpm release` 后：

- 每个有变更的子包自动 bump 版本、生成 CHANGELOG、创建 scoped tag（如 `@scope/admin@6.1.8`）
- 根包自动 bump patch 版本、生成聚合 CHANGELOG、创建 `v*` tag（如 `v0.12.0`）
- 一次性推送所有 commits 和 tags
- GitHub Actions 为每个 tag 自动创建独立的 GitHub Release

---

## 依赖清单

```json
{
	"devDependencies": {
		"relizy": "1.2.2-beta.0",
		"bumpp": "^10.4.1",
		"changelogen": "^0.6.2",
		"changelogithub": "^13.16.1"
	}
}
```

| 工具                       | 职责                                        |
| -------------------------- | ------------------------------------------- |
| `relizy`                   | 子包独立版本管理（bump + changelog + tag）  |
| `bumpp`                    | 根包版本管理（bump + tag）                  |
| `changelogen`              | 根包 CHANGELOG.md 生成与 commit types 配置  |
| `changelogithub`           | 复用 changelog 类型配置，不参与正式 release |
| `gh` CLI（GitHub Actions） | 创建 GitHub Release（CI 中预装，无需安装）  |

---

## 配置文件

### 1. `relizy.config.ts` — 子包发版配置

```typescript
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parsePnpmWorkspaceYaml } from "pnpm-workspace-yaml";
import { defineConfig } from "relizy";
import changelogConfig from "./changelog.config";

function readWorkspacePackageGlobs(): string[] {
	const content = readFileSync(resolve(process.cwd(), "pnpm-workspace.yaml"), "utf8");
	return (parsePnpmWorkspaceYaml(content).toJSON().packages ?? []).filter((p) => !p.startsWith("!"));
}

export default defineConfig({
	projectName: "your-project-name",

	types: changelogConfig.types,
	templates: {
		...(changelogConfig.templates ?? {}),
		changelogTitle: "{{newVersion}} ({{date}})",
	},

	monorepo: {
		versionMode: "independent",
		packages: readWorkspacePackageGlobs(),
	},

	changelog: {
		rootChangelog: true,
		includeCommitBody: true,
		formatCmd: "pnpm run format:changelog",
	},
	release: {
		changelog: true,
		commit: true,
		push: true, // 注意：实际通过 CLI 参数 --no-push 覆盖
		gitTag: true,
		clean: true,
		noVerify: false,
		publish: false,
		providerRelease: false,
		social: false,
		prComment: false,
	},
});
```

关键点：

- `versionMode: "independent"`：每个子包独立版本号，tag 格式为 `@scope/pkg@version`
- `providerRelease: false`：relizy 不创建 GitHub Release，交给 CI
- `push: true` 在 config 中设置，但通过 CLI `--no-push` 覆盖，让最后统一 push

### 2. `bump.config.ts` — 根包发版配置

```typescript
import { execSync } from "node:child_process";
import { defineConfig } from "bumpp";

export default defineConfig({
	commit: "📢 publish(root): release v%s",
	tag: "v%s",
	// 不推送到远程仓库，由 release 流程最后统一 git push --follow-tags
	push: false,
	// 在执行完 bumpp 后回写根 CHANGELOG，并显式传入本次新版本号
	execute: (operation) => {
		execSync(`pnpm exec changelogen --output CHANGELOG.md -r ${operation.state.newVersion}`, {
			cwd: operation.options.cwd,
			stdio: "inherit",
		});
	},
	// 将暂存区的全部文件都提交
	all: true,
});
```

关键点：

- `push: false`：不单独推送，等待最后统一 push
- `tag: "v%s"`：根包使用 `v0.12.0` 格式的 tag
- `execute`：bump 后自动执行 `changelogen` 生成根包 CHANGELOG
- `commit`：使用 `publish(root)` scope 与子包的 `publish` 区分

### 3. `changelog.config.ts` — 共享的 changelog 配置

```typescript
import type { ChangelogConfig } from "changelogen";

export default {
	output: "CHANGELOG.md",
	types: {
		/* 你的 commit type 配置 */
	},
	templates: {
		commitMessage: "📢 publish: release {{newVersion}}",
	},
} satisfies Partial<ChangelogConfig>;
```

此文件被 `relizy.config.ts` 引用，统一 commit types 和模板。

---

## 命令调度

### `package.json` scripts

```json
{
	"scripts": {
		"release": "pnpm run release:sub && pnpm run release:root && pnpm run git:push",
		"release:sub": "relizy-runner release --no-publish --no-provider-release --no-push --yes",
		"release:root": "bumpp --yes --release patch",
		"release:dry": "relizy-runner release --dry-run --no-publish --no-provider-release --no-push --no-commit --no-clean --yes",
		"git:push": "git push --follow-tags",
		"changelog:root": "changelogen --output CHANGELOG.md"
	}
}
```

### 执行流程

```plain
pnpm release
    │
    ├── 1. pnpm run release:sub（relizy）
    │   ├── 分析各子包 commits
    │   ├── bump 有变更的子包 package.json version
    │   ├── 生成子包 CHANGELOG.md + 根 CHANGELOG.md
    │   ├── git commit（如 "📢 publish: release @scope/admin@6.1.8, @scope/type@1.1.5"）
    │   ├── git tag（如 @scope/admin@6.1.8, @scope/type@1.1.5）
    │   └── 不 push（--no-push）
    │
    ├── 2. pnpm run release:root（bumpp）
    │   ├── bump 根 package.json version（patch）
    │   ├── 执行 changelogen 生成根 CHANGELOG 聚合 section
    │   ├── git commit（如 "📢 publish(root): release v0.12.0"）
    │   ├── git tag（如 v0.12.0）
    │   └── 不 push（push: false）
    │
    └── 3. pnpm run git:push
        └── git push --follow-tags（一次性推送所有 commits + tags）
```

### 为什么要单次 push

- 所有 tags 同时到达远端，GitHub Actions 几乎同时触发
- 避免分批推送导致 CI 执行时间差
- 减少 GitHub 通知邮件的时间跨度

---

## GitHub Actions 工作流

### `.github/workflows/release.yaml`

```yaml
name: Release

on:
  push:
    branches:
      - main
    tags:
      - "v*"
      - "@*/*@*" # 匹配 relizy 生成的 @scope/package@version 格式

permissions: write-all

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: 检出分支
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 安装pnpm
        uses: pnpm/action-setup@v4
        with:
          run_install: |
            - recursive: true

      - name: 安装node
        uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: pnpm

      - name: 从 CHANGELOG.md 提取内容并创建 GitHub Release
        if: github.ref_type == 'tag'
        run: |
          TAG="${{ github.ref_name }}"
          echo "触发 tag: $TAG"

          # 幂等检查：release 已存在则跳过
          if gh release view "$TAG" > /dev/null 2>&1; then
            echo "Release '$TAG' 已存在，跳过创建"
            exit 0
          fi

          # 根据 tag 格式选择不同的 CHANGELOG 提取策略
          if [[ "$TAG" == v* ]]; then
            # 根包 tag (v0.12.0) → changelogen 格式
            # section header: ## v0.12.0
            VERSION="${TAG#v}"
            ESCAPED_VER=$(printf '%s' "$VERSION" | sed 's/[[\\.^$*+?(){}|]/\\&/g')
            NOTES=$(awk "/^## <small>${ESCAPED_VER}[[:space:]]/{found=1; next} found && /^## /{exit} found && /^# /{exit} found{print}" CHANGELOG.md)
          else
            # 子包 tag (@scope/pkg@version) → relizy 格式
            # section header: ## @scope/pkg@version (2026-04-09)
            ESCAPED_TAG=$(printf '%s' "$TAG" | sed 's/[[\\.^$*+?(){}|]/\\&/g; s/\//\\\//g')
            NOTES=$(awk "/^## ${ESCAPED_TAG}[[:space:]]/{found=1; next} found && /^## [^#]/{exit} found{print}" CHANGELOG.md)
          fi

          if [ -z "$NOTES" ]; then
            echo "::warning::未在根 CHANGELOG.md 中找到 tag '$TAG' 对应的 section，跳过 release 创建"
            exit 0
          fi

          echo "提取到的 release notes:"
          echo "$NOTES"

          gh release create "$TAG" --title "$TAG" --notes "$NOTES"
          echo "成功为 tag '$TAG' 创建 GitHub Release"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 核心设计

**为什么用 `gh release create` 而不是 changelogithub / relizy provider-release / changelogen gh release？**

| 工具                      | 问题                                                            |
| ------------------------- | --------------------------------------------------------------- |
| `changelogithub`          | 底层 `git log tag1...tag2` 无法解析含 `@` 的 scoped tag（歧义） |
| `relizy provider-release` | 单独运行缺少 `release` 流程上下文，创建 0 个 release            |
| `changelogen gh release`  | Release 内容正确，但 tag 映射为 `v*` 格式，无法关联 scoped tag  |
| **`gh release create`**   | tag 名作为普通字符串传给 GitHub API，无歧义，完全可控           |

**两种 CHANGELOG 格式的处理**：

| tag 格式                     | 生成工具                     | CHANGELOG section header 格式        |
| ---------------------------- | ---------------------------- | ------------------------------------ |
| `@scope/pkg@version`（子包） | relizy                       | `## @scope/pkg@version (date)`       |
| `v*`（根包）                 | changelogen（由 bumpp 调用） | `## vversion` / `## [vversion](...)` |

工作流通过 `if [[ "$TAG" == v* ]]` 判断 tag 类型，分别用不同的 awk 模式提取对应 section。

---

## 首次接入清单

在新 monorepo 项目中复现此流程的步骤：

### 1. 安装依赖

```bash
pnpm add -D relizy bumpp changelogen changelogithub @ruan-cat/utils @types/node pnpm-workspace-yaml
```

### 2. 创建配置文件

- `changelog.config.ts`：定义 commit types 和模板
- `relizy.config.ts`：子包发版配置（independent 模式）
- `bump.config.ts`：根包发版配置（push: false）

### 3. 补充基线 tag

relizy 的 independent 模式需要每个子包有一个初始 tag 作为基线：

```bash
git tag "@scope/package-a@1.0.0"
git tag "@scope/package-b@1.0.0"
git push origin "@scope/package-a@1.0.0" "@scope/package-b@1.0.0"
```

### 4. 配置 package.json scripts

```json
{
	"scripts": {
		"release": "pnpm run release:sub && pnpm run release:root && pnpm run git:push",
		"release:sub": "relizy-runner release --no-publish --no-provider-release --no-push --yes",
		"release:root": "bumpp --yes --release patch",
		"git:push": "git push --follow-tags",
		"changelog:root": "changelogen --output CHANGELOG.md"
	}
}
```

### 5. 创建 GitHub Actions 工作流

将上文的 `.github/workflows/release.yaml` 复制到项目中，根据需要调整 pnpm/node 安装步骤。

### 6. 确保子包非 private

relizy 在 independent 模式下会忽略 `private: true` 的包。如果子包不需要发布到 npm，仍需将 `private` 改为 `false`，并通过 `--no-publish` 阻止实际发布。

### 7. Windows 注意事项

relizy 在 independent 模式下依赖 `grep`、`head`、`sed` 等 GNU 工具。Windows 上需要通过 `relizy-runner` 入口脚本自动补齐 Git for Windows 的 `usr/bin` 到 PATH。详见 [2026-03-23 Relizy 独立发版报告](./2026-03-23-relizy-independent-release-breaking-change.md)。

---

## 验证方法

发版后，检查以下内容是否正确：

1. **Git tags**：`git tag --list --sort=-creatordate | head -5`，应看到子包 scoped tags + 根包 `v*` tag
2. **GitHub Releases**：在 `https://github.com/<owner>/<repo>/releases` 检查每个 tag 是否有对应的 Release
3. **Release 内容**：子包 Release 包含该包的变更日志，根包 Release 包含聚合的所有提交

---

## 关联文件

| 文件                             | 说明                  |
| -------------------------------- | --------------------- |
| `relizy.config.ts`               | 子包发版配置          |
| `bump.config.ts`                 | 根包发版配置          |
| `changelog.config.ts`            | 共享 changelog 配置   |
| `.github/workflows/release.yaml` | GitHub Release 工作流 |
| `package.json`                   | 命令调度              |

## 关联报告

- [2026-04-09 Monorepo 子包 GitHub Release 自动化探索](./2026-04-09-monorepo-sub-package-github-release-exploration.md) — 记录了所有尝试过的方案及失败原因
- [2026-03-23 接入 Relizy 独立发版方案并调整子包 private 约束](./2026-03-23-relizy-independent-release-breaking-change.md) — relizy 首次接入的详细记录
