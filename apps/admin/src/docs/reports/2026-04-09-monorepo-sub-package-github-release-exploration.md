# 2026-04-09 Monorepo 子包 GitHub Release 自动化探索

## 背景

本项目（`11comm`）已通过 `relizy` 实现了 monorepo 子包的独立版本管理（`versionMode: "independent"`），能够为每个子包生成独立的 `CHANGELOG.md`、git tag（格式 `@scope/package@version`，如 `@01s-11comm/admin@6.1.3`）并推送到远端。

但 `relizy.config.ts` 中 `providerRelease` 设为 `false`，即 relizy 本身不创建 GitHub Release。原本的设想是由 GitHub Actions 工作流中的 `changelogithub` 来完成这一步——检测到 tag 推送后，自动生成对应的 GitHub Release 信息。

本次探索的目标是：**让 monorepo 子包的 tag 也能触发 GitHub Actions，并通过工具自动生成 GitHub Release**。

## 探索过程

### 第一步：修改 GitHub Actions tag 过滤模式

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

### 第二步：changelogithub 处理子包 tag

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

### 根本原因

**`changelogithub` 底层使用 `changelogen`，它在执行 `git log` 时会用 `tag1...tag2` 格式查找提交范围。但 `@scope/pkg@version` 格式中包含 `@` 符号，git 无法正确将其解析为 tag 引用（与路径产生歧义），导致 `fatal: ambiguous argument` 错误。**

具体来说：

1. `changelogithub` 需要确定两个 tag 之间的提交范围来生成 release notes
2. 它会构造类似 `git log @01s-11comm/type@1.1.2...@01s-11comm/admin@6.1.3` 的命令
3. Git 的参数解析器遇到 `@` 时产生歧义——无法判断这是一个 tag 名还是路径的一部分
4. 这是 `changelogen`/`changelogithub` 工具链的固有限制，不是配置问题

这意味着 **`changelogithub` 从原理上就不兼容 `@scope/package@version` 格式的 monorepo tag**。

### 第三步：替代方案评估

| 方案                                   | 可行性     | 说明                                                                    |
| -------------------------------------- | ---------- | ----------------------------------------------------------------------- |
| changelogithub                         | **不可行** | 底层 changelogen 无法解析含 `@` 的 scoped tag                           |
| relizy `providerRelease: true`（本地） | 可行       | 需要在本地配置 `RELIZY_GITHUB_TOKEN` (PAT)，安全性较低                  |
| relizy `provider-release`（CI）        | **推荐**   | 在 GitHub Actions 中运行 `relizy provider-release`，复用 `GITHUB_TOKEN` |

## 推荐方案：在 GitHub Actions 中使用 `relizy provider-release`

relizy 提供独立的 `provider-release` 子命令，专门用于创建 GitHub/GitLab Release，不会执行 bump、changelog、publish 等操作。

### 工作原理

- `relizy provider-release` 读取当前 tag 对应的 changelog 内容，调用 GitHub API 创建 Release
- relizy 天然理解自己生成的 `@scope/package@version` tag 格式，不存在 changelogen 的路径歧义问题
- 在 CI 中通过 `RELIZY_GITHUB_TOKEN` 环境变量传入 `secrets.GITHUB_TOKEN`

### 具体改动

将 `release.yaml` 中的 changelogithub 步骤：

```yaml
- name: 用 changelogithub 生成 github release 发行版日志
  run: pnpm dlx changelogithub
  continue-on-error: true
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

替换为：

```yaml
- name: 用 relizy 生成 github release 发行版日志
  run: pnpm relizy provider-release --yes
  continue-on-error: true
  env:
    RELIZY_GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 注意事项

- `relizy.config.ts` 中的 `providerRelease: false` 和 `package.json` 中的 `--no-provider-release` 保持不变——这些只控制**本地** `pnpm release` 时是否创建 release，不影响 CI 中单独运行 `relizy provider-release`
- `provider-release` 是独立子命令，不受 config 中 `release.providerRelease` 配置项约束
- 此方案保持了职责分离：本地负责版本管理（bump/changelog/tag/push），CI 负责 GitHub Release 创建

## 验证过程中的踩坑记录

### `provider-release` 不支持 `--yes` 参数

首次在 CI 中配置为 `pnpm relizy provider-release --yes` 时报错：

```plain
error: unknown option '--yes'
```

`--yes` 是 `release` 子命令的专属选项（用于跳过 bump 前的交互确认），`provider-release` 不接受此参数。正确写法：

```yaml
run: pnpm relizy provider-release
```

### `provider-release` 的完整参数列表

```plain
Options:
  --from <ref>           Start commit reference
  --to <ref>             End commit reference
  --token <token>        Provider token
  --provider <provider>  Git provider (github or gitlab)
```

认证通过环境变量 `RELIZY_GITHUB_TOKEN` 传入即可，无需 `--token` 参数。

## 结论

1. **`changelogithub` 不兼容 monorepo scoped tag 格式**（`@scope/pkg@version`），这是底层 `changelogen` 使用 git 命令时的固有限制，不可通过配置解决
2. **`relizy provider-release` 单独运行缺少上下文**：relizy 官方从未在 CI 中单独使用 `provider-release`，官方做法是在 CI 中运行完整的 `relizy release --yes`。`provider-release` 依赖 `release` 流程中产生的上下文（哪些包被 bumped、tag 范围等），单独调用时报 "Creating 0 GitHub release(s)"
3. GitHub Actions 的 tag 过滤模式 `@*/*@*` 已验证可正确匹配 relizy 生成的子包 tag
4. **`provider-release` 不接受 `--yes` 参数**，该选项仅用于 `release` 子命令
5. **当前尝试方向**：改用 `changelogen gh release all`，它直接解析已有的 CHANGELOG.md 创建 GitHub Release，不需要跑 `git log tag1...tag2`，有望绕过 `@` 歧义问题

## 相关文件

- [`relizy.config.ts`](../../../../../relizy.config.ts) — relizy 配置
- [`.github/workflows/release.yaml`](../../../../../../.github/workflows/release.yaml) — Release 工作流
- [`package.json`](../../../../../package.json) — 发版脚本定义
- [`changelogithub.config.ts`](../../../../../changelogithub.config.ts) — changelogithub 配置（待决定是否保留）

## 关联报告

- [2026-03-23 接入 Relizy 独立发版方案并调整子包 private 约束](./2026-03-23-relizy-independent-release-breaking-change.md)
