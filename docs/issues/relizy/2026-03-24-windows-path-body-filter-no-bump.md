<!-- TODO: 等待pr合并 -->

# relizy：Windows 下 independent 发版误报「No packages to bump, no relevant commits found」

> 本文档用于向 [LouisMazel/relizy](https://github.com/LouisMazel/relizy) 提交 issue 时的背景说明与复现材料；亦供本仓库排错参考。

## 环境

| 项                         | 值                           |
| -------------------------- | ---------------------------- |
| OS                         | Windows 10/11（`win32`）     |
| relizy                     | `1.2.1`                      |
| changelogen（relizy 依赖） | `^0.6.2`（实际以 lock 为准） |
| Node                       | `>=20`                       |

## 现象

在 monorepo 根目录执行：

```bash
relizy release --no-publish --no-provider-release
```

（或经 `tsx scripts/relizy-runner.ts` 包装调用）

在 **已有** 自各包 baseline tag 之后、且 **确有** 修改 `apps/<pkg>/...` 的 Conventional Commits 时，仍输出：

```text
× No packages to bump, no relevant commits found
```

在 **Linux / macOS** 或 **WSL** 下同仓同 tag 同提交历史，行为可能正常（能够识别待 bump 的包）。

## 根因分析（源码结论）

### 1. 提交解析与 Emoji

`changelogen` 中 `ConventionalCommitRegex` **在 type 前包含可选的 emoji 分组**，因此 **`✨ feat(scope): …` 可被正确解析**，**不应**将本问题归因于「标题行首 Emoji」。

### 2. 包级提交过滤：`commit.body.includes(relativePath)`

`relizy` 在 `getPackageCommits` 等逻辑中，用 **`path.relative(cwd, pkg.path)`** 得到包相对路径，再与 **`commit.body`** 做 **`includes`** 匹配。

`changelogen` 的 `getGitDiff` 使用：

```text
git log ... --pretty="..." --name-status
```

Git 在 `--name-status` 中输出的路径为 **正斜杠**（如 `apps/admin/foo.vue`）。

在 **Windows** 上，`path.relative(repoRoot, '...\\apps\\admin')` 通常为 **`apps\admin`（反斜杠）**。

因此：

- `commit.body` 含 `apps/admin/...`
- `packageRelativePath` 为 `apps\admin`
- **`commit.body.includes(packageRelativePath)` → `false`**

同类逻辑还出现在 **`isCommitOfTrackedPackages`**（对每个 workspace 包同样 `commit.body.includes(relative(...))`），导致 **过滤后某包的 `commits` 为空**，进而在 independent 模式下 **`packagesWithCommits` 为空**，最终 **`bumped: false`** 并打印上述错误。

### 3. 与「types 白名单」的关系

若某段时间内 tag 之后仅有 `chore` 等 **未在 `types` 中配置** 的 type，也会出现无 bump；但 **在已有 `feat`/`fix` 且仍无 bump** 时，应 **优先排查 Windows 路径分隔符** 是否与上述逻辑一致。

## 建议修复方向（供上游）

在比较前将用于匹配的包路径 **规范为 POSIX 风格**，例如：

```ts
const posixPath = relative(cwd, pkg.path).split(sep).join("/");
commit.body.includes(posixPath);
```

或在 `isCommitOfTrackedPackages` 中对 `path` 做同样处理，保证与 `git log --name-status` 输出一致。

## 复现

仓库内脚本（不修改 `node_modules`，仅演示 **与 relizy 相同的路径语义**）：

```bash
pnpm run repro:relizy-path
```

（等价：`pnpm exec node docs/issues/relizy/repro-relizy-body-path-includes.mjs`。请勿依赖首行 `#!/usr/bin/env node`，以免在 Windows + Code Runner 下触发路径错误与乱码。）

详见同目录 [`repro-relizy-body-path-includes.mjs`](./repro-relizy-body-path-includes.mjs)。

## 上游链接

- 仓库：<https://github.com/LouisMazel/relizy>
- 版本：`1.2.1`（`package.json` `version`）

## 本仓库上下文

- 本 monorepo 使用 `independent` 与 `@scope/pkg@version` baseline tag。
- 发版入口：`pnpm release` / `pnpm release:relizy` → `scripts/relizy-runner.ts`。

---

_文档日期：2026-03-24_
