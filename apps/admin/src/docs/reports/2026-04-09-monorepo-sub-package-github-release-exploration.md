<!-- 有价值的调研报告 不予删除 -->

# 2026-04-09 Monorepo 子包 GitHub Release 自动化探索

## 背景

本项目（`11comm`）已通过 `relizy` 实现了 monorepo 子包的独立版本管理（`versionMode: "independent"`），能够为每个子包生成独立的 `CHANGELOG.md`、git tag（格式 `@scope/package@version`，如 `@01s-11comm/admin@6.1.3`）并推送到远端。

但 `relizy.config.ts` 中 `providerRelease` 设为 `false`，即 relizy 本身不创建 GitHub Release。原本的设想是由 GitHub Actions 工作流中的 `changelogithub` 来完成这一步——检测到 tag 推送后，自动生成对应的 GitHub Release 信息。

本次探索的目标是：**让 monorepo 子包的 tag 也能触发 GitHub Actions，并通过工具自动生成 GitHub Release**。

核心约束：本地生成 tag，云端负责生成 GitHub Release。

---

## 探索过程

### 第一步：修改 GitHub Actions tag 过滤模式（成功）

原始 `.github/workflows/release.yaml` 的 tag 触发规则：

```yaml
tags:
  - "v*"
  - "@*/v*"
```

`relizy` 生成的子包 tag 格式为 `@01s-11comm/admin@6.1.3`，不符合 `@*/v*` 模式（中间没有 `v` 前缀）。因此新增了匹配规则：

```yaml
tags:
  - "v*"
  - "@*/v*"
  - "@*/*@*" # 匹配 relizy 生成的 @scope/package@version 格式
```

**结果**：GitHub Actions 工作流成功被 `@01s-11comm/admin@6.1.3` 和 `@01s-11comm/type@1.1.2` 触发。tag 过滤模式修改有效。

---

### 第二步：尝试 changelogithub（失败）

工作流触发后，`changelogithub` 步骤执行失败。

错误日志（来自 [GitHub Actions Run #58](https://github.com/ruan-cat/11comm/actions/runs/24172076527/job/70545616016)）：

```plain
changelogithub v14.0.0
[info] 没有检测到文件修改
fatal: ambiguous argument '@01s-11comm/type@1.1.2...@01s-11comm/admin@6.1.3
@01s-11comm/type@1.1.2': unknown revision or path not in the working tree.
Use '--' to separate paths from revisions, like this:
'git <command> [<revision>...] -- [<file>...]'
```

#### 根本原因

**`changelogithub` 底层使用 `changelogen`，它在执行 `git log` 时会用 `tag1...tag2` 格式查找提交范围。但 `@scope/pkg@version` 格式中包含 `@` 符号，git 无法正确将其解析为 tag 引用（与路径产生歧义），导致 `fatal: ambiguous argument` 错误。**

具体来说：

1. `changelogithub` 需要确定两个 tag 之间的提交范围来生成 release notes
2. 它会构造类似 `git log @01s-11comm/type@1.1.2...@01s-11comm/admin@6.1.3` 的命令
3. Git 的参数解析器遇到 `@` 时产生歧义——无法判断这是一个 tag 名还是路径的一部分
4. 这是 `changelogen`/`changelogithub` 工具链的固有限制，不是配置问题

**结论**：`changelogithub` 从原理上就不兼容 `@scope/package@version` 格式的 monorepo tag。

---

### 第三步：尝试 relizy provider-release（失败）

relizy 提供独立的 `provider-release` 子命令，专门用于创建 GitHub/GitLab Release。理论上它天然理解自己生成的 tag 格式。

#### 3.1 首次尝试：`--yes` 参数不兼容

配置为 `pnpm relizy provider-release --yes` 时报错：

```plain
error: unknown option '--yes'
```

`--yes` 是 `release` 子命令的专属选项（用于跳过 bump 前的交互确认），`provider-release` 不接受此参数。

`provider-release` 的完整参数列表：

```plain
Options:
  --from <ref>           Start commit reference
  --to <ref>             End commit reference
  --token <token>        Provider token
  --provider <provider>  Git provider (github or gitlab)
```

#### 3.2 移除 `--yes` 后：创建 0 个 release

修正为 `pnpm relizy provider-release` 后，命令成功运行但创建了 0 个 release：

```plain
v1.2.2-beta.0
[log] Running in CI: GitHub Actions
[info] 没有检测到文件修改
[start] Start provider release
[info] Detected Git provider: github
[info] Creating 0 GitHub release(s)
[warn] No releases created
```

#### 根本原因

**relizy 官方从未在 CI 中单独使用过 `provider-release`。**

通过查看 relizy 官方仓库（[LouisMazel/relizy](https://github.com/LouisMazel/relizy)）的 `.github/workflows/release-latest.yml`，发现官方的做法是在 CI 中运行**完整的** `relizy release --yes`，由 `release` 命令统一编排所有步骤：

```yaml
# relizy 官方 release-latest.yml
- name: Version Packages (Latest)
  env:
    GITHUB_TOKEN: ${{ secrets.RELEASE_TOKEN }}
  run: |
    pnpm relizy release --tag latest --yes
```

`provider-release` 依赖 `release` 流程中产生的上下文信息（哪些包被 bumped、从哪个 tag 到哪个 tag 的范围等）。当单独调用 `provider-release` 时，它没有这些上下文，因此找不到需要创建 release 的版本。

relizy 官方的文档中虽然有 "Separate Bump and Publish" 示例展示了 `provider-release` 单独使用，但那个示例中 `provider-release` 运行在一个 checkout 了特定 tag 的独立 job 里（`ref: v${{ needs.bump.outputs.version }}`），并且是针对单包仓库的 `v*` 格式 tag，不适用于 monorepo independent 模式。

**结论**：`relizy provider-release` 单独运行在 CI 中缺少上下文，不适合"本地生成 tag → CI 创建 release"的工作流。它的设计初衷是作为 `relizy release` 全流程的一个子步骤，而非独立使用。

---

### 第四步：尝试 changelogen gh release（部分成功，tag 映射错误）

`changelogen` 提供了 `gh release` 子命令，工作方式与 `changelogithub` 完全不同：

- **`changelogithub`**：重新跑 `git log tag1...tag2` 生成 changelog → 遇到 `@` 歧义
- **`changelogen gh release`**：**直接解析已有的 CHANGELOG.md 文件**，从中提取版本 section 并调用 GitHub API 创建 Release → 不涉及 git log，理论上绕过 `@` 歧义

配置：

```yaml
- name: 用 changelogen 从 CHANGELOG.md 生成 github release
  run: pnpm changelogen gh release all --token $GITHUB_TOKEN
  continue-on-error: true
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

#### 实测结果

GitHub Release **成功创建了！** changelogen 从 CHANGELOG.md 中解析出所有版本的 section，并为每个版本创建了 GitHub Release。release 的内容（changelog body）完全正确。

但存在一个**关键问题：tag 名称映射错误**。

实际创建的 GitHub Release：

| changelogen 创建的 Release tag | 对应的 relizy git tag     | Release 内容 |
| ------------------------------ | ------------------------- | ------------ |
| `v6.1.6`                       | `@01s-11comm/admin@6.1.6` | admin 的变更 |
| `v6.1.5`                       | `@01s-11comm/admin@6.1.5` | admin 的变更 |
| `v1.1.4`                       | `@01s-11comm/type@1.1.4`  | type 的变更  |
| `v1.1.3`                       | `@01s-11comm/type@1.1.3`  | type 的变更  |
| `v0.11.0`                      | `v0.11.0`                 | 根包的变更   |

#### 问题分析

changelogen 在解析 CHANGELOG.md 中的版本 header（如 `## @01s-11comm/admin@6.1.6 (2026-04-09)`）时：

1. 提取出版本号 `6.1.6`
2. 自动添加 `v` 前缀，生成 tag 名 `v6.1.6`
3. 如果该 tag 不存在，changelogen 会**自动创建一个新的 git tag** `v6.1.6`
4. 然后将 GitHub Release 关联到这个新 tag

这导致了以下问题：

- **创建了多余的 git tag**：`v6.1.6`、`v6.1.5` 等不属于任何包的 tag 被创建
- **Release 未关联到正确的 scoped tag**：GitHub Release 的 tag 是 `v6.1.6` 而不是 `@01s-11comm/admin@6.1.6`
- **包归属不可辨识**：从 tag 名 `v6.1.6` 无法判断这是 admin 包还是 type 包的 release
- **版本号冲突风险**：如果 admin 和 type 碰巧 bump 到同一个版本号（如都到 `2.0.0`），会产生 tag 冲突

**结论**：`changelogen gh release` 的内容生成是正确的，但它的 tag 映射逻辑是为单包仓库设计的（`v*` 格式），无法正确处理 monorepo scoped tag 格式。此方案不可用。

---

## 方案总结

| 方案                             | 状态         | 说明                                                          |
| -------------------------------- | ------------ | ------------------------------------------------------------- |
| `changelogithub`                 | 失败         | 底层 `git log tag1...tag2` 无法解析含 `@` 的 scoped tag       |
| `relizy provider-release`（CI）  | 失败         | 单独运行缺少 release 流程上下文，创建 0 个 release            |
| `changelogen gh release`         | 部分成功     | Release 内容正确，但 tag 映射为 `v*` 格式而非 scoped tag 格式 |
| `relizy release`（全 CI）        | 可行但不选   | 官方推荐方式，但改变了本地发版习惯                            |
| `relizy providerRelease`（本地） | 可行但不选   | 需要本地配置 GitHub PAT，安全性较低                           |
| **`gh release create`（CI）**    | **最终采用** | 从 CHANGELOG.md 提取内容，tag 名作为普通字符串，完美兼容      |

---

### 第五步：gh release create 自定义脚本（成功）

鉴于以上所有工具都无法完美满足"本地生成 scoped tag → CI 创建对应 GitHub Release"的需求，最终采用 GitHub CLI（`gh`）编写自定义脚本。

#### 工作原理

1. 工作流由 tag 推送触发时，`github.ref_name` 为完整的 tag 名（如 `@01s-11comm/admin@6.1.7`）
2. 脚本转义 tag 中的特殊字符，用 `awk` 从根 `CHANGELOG.md` 中提取该 tag 对应的版本 section
3. 使用 `gh release create "$TAG" --title "$TAG" --notes "$NOTES"` 创建 Release
4. `gh` CLI 将 tag 名作为普通字符串传给 GitHub API，不存在任何 `@` 解析歧义
5. 脚本还包含幂等性检查：如果 release 已存在则跳过

#### 最终配置

```yaml
- name: 从 CHANGELOG.md 提取内容并创建 GitHub Release
  if: github.ref_type == 'tag'
  run: |
    TAG="${{ github.ref_name }}"
    ESCAPED_TAG=$(printf '%s' "$TAG" | sed 's/[[\\.^$*+?(){}|]/\\&/g; s/\//\\\//g')
    NOTES=$(awk "/^## ${ESCAPED_TAG}[[:space:]]/{found=1; next} found && /^## [^#]/{exit} found{print}" CHANGELOG.md)
    if [ -z "$NOTES" ]; then
      echo "::warning::未找到 tag '$TAG' 对应的 CHANGELOG section"
      exit 0
    fi
    if gh release view "$TAG" > /dev/null 2>&1; then
      echo "Release '$TAG' 已存在，跳过"
      exit 0
    fi
    gh release create "$TAG" --title "$TAG" --notes "$NOTES"
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

#### 验证结果

成功为两个子包创建了 GitHub Release，**tag 名称完全匹配 relizy 生成的 scoped tag**：

- `@01s-11comm/admin@6.1.7` → [GitHub Release](https://github.com/ruan-cat/11comm/releases/tag/%4001s-11comm/admin%406.1.7) - 内容为 admin 的变更日志
- `@01s-11comm/type@1.1.5` → [GitHub Release](https://github.com/ruan-cat/11comm/releases/tag/%4001s-11comm/type%401.1.5) - 内容为 type 的变更日志

**优势**：

- `gh` CLI 预装在 GitHub Actions runner 中，无需额外安装
- 完全控制 tag 名称和 release 内容
- 不依赖任何第三方工具的 tag 解析逻辑
- 天然支持任何格式的 tag 名
- 幂等：重复运行不会创建重复 release

## 最终结论

在"本地 `pnpm release` 生成 scoped tag → CI 自动创建 GitHub Release"这一工作流下：

1. 所有基于 `changelogen` 的工具（changelogithub、relizy provider-release、changelogen gh release）都存在不同程度的兼容性问题
2. **`gh release create` 自定义脚本是最可靠的方案**，因为它绕过了所有 tag 解析层，直接使用 GitHub API
3. 关键前提：relizy 已在本地生成了完整的 CHANGELOG.md，CI 只需从中提取内容

---

## 相关文件

- [`relizy.config.ts`](../../../../../relizy.config.ts) — relizy 配置
- [`.github/workflows/release.yaml`](../../../../../../.github/workflows/release.yaml) — Release 工作流
- [`package.json`](../../../../../package.json) — 发版脚本定义
- [`changelogithub.config.ts`](../../../../../changelogithub.config.ts) — changelogithub 配置（历史遗留，已注释）

## 关联报告

- [2026-03-23 接入 Relizy 独立发版方案并调整子包 private 约束](./2026-03-23-relizy-independent-release-breaking-change.md)
