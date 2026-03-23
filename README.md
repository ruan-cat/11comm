# 11comm 智慧社区项目 前端仓库

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/ruan-cat/11comm)

请点击此链接：

- [前端技术文档](https://01s-10wms-frontend-docs.ruancat6312.top/)
- [本项目技术文档](./apps/admin/src/docs/technical-doc.md)

## 部署项目

请阅读 [admin 项目的文档](./apps/admin/README.md)。

## 发版

根工作区已经接入 `relizy`，当前采用 `independent` 模式管理 `apps/*` 下的子包版本。标准发版命令如下：

```bash
pnpm release:relizy
```

这里额外包一层 `tsx scripts/relizy-runner.ts`，不是为了改 relizy 的发版逻辑，而是为了补两个前置约束：Windows 下给 relizy 补齐 `grep` / `head` / `sed` 依赖；首次接入 `independent` 模式时先检查子包基线 tag。包装层通过后，才继续执行下面这条 relizy 命令：

```bash
relizy release --no-publish --no-provider-release
```

兼容处理：

- Windows 下自动补齐 Git for Windows 的 GNU 工具路径，避免 `relizy` 内部调用 `grep`、`head`、`sed` 失败。
- 首次接入时自动检查每个子包是否已经有独立 package tag；如果没有，会直接提示需要先补基线 tag。

首次接入 `independent` 模式前，需要先补一次基线 tag：

```bash
git tag "@01s-11comm/admin@6.0.0"
git tag "@01s-11comm/type@1.0.0"
git push origin "@01s-11comm/admin@6.0.0" "@01s-11comm/type@1.0.0"
```

常用命令示例：

```bash
pnpm release:relizy -- --patch
pnpm release:relizy -- --minor
pnpm release:relizy -- --patch --dry-run --no-clean
```

执行效果：

- 基于 Conventional Commits 分析 `apps/admin` 与 `apps/type` 的变更。
- 仅对有变更的子包生成独立版本号，并同步更新依赖它们的工作区包版本引用。
- 在根目录生成聚合 `CHANGELOG.md`，同时为每个已发版子包生成各自的 `CHANGELOG.md`。
- 创建并推送对应的 git commit 与 package tag。
- 不执行 npm publish，也不创建 GitHub / GitLab provider release。

注意事项：

- `relizy` 不会扫描 `private: true` 的 workspace 包，因此 `apps/admin` 和 `apps/type` 已改为可参与版本管理的包。
- 这意味着两个子包不再享有 `private: true` 的“禁止发布”保护；当前仅通过 `relizy` 命令参数和配置显式禁用了 publish / provider release。
- 如果后续要真的接入 npm 发布，请先评估私有 registry、`publishConfig` 和权限策略，再移除 `--no-publish`。

### 为什么需要 `scripts/relizy-runner.ts` 兼容层？

不是所有接入 `relizy` 的项目都必须额外包一层脚本；如果项目已经运行在 Linux / macOS / CI 环境，并且每个子包都已经有完整的独立 package tag 历史，那么直接执行 `relizy release ...` 也可以。

但只要命中下面任一条件，就建议和本项目一样，在根命令前增加一个兼容层：

- 需要在 Windows 本地直接执行发版命令。当前 `relizy@1.2.1` 在 `independent` 模式下会直接调用 `grep` / `head` / `sed` 处理 git tag；Git Bash 或 CI 环境通常没问题，但 PowerShell / cmd 下不一定天然可用。
- 首次接入 `independent` 模式，仓库里还没有每个子包各自的基线 tag。此时 `relizy` 需要先知道每个包应当从哪个 `@scope/pkg@x.y.z` tag 开始计算后续变更，否则第一次发版的基线会不清晰，报错信息也不够直观。

本项目正好同时满足这两个条件，所以 [package.json](./package.json) 没有直接写成 `relizy release --no-publish --no-provider-release`，而是先通过 `tsx scripts/relizy-runner.ts` 做一次前置兼容处理：

- 在 Windows 下自动补齐 Git for Windows 的 GNU 工具路径，确保 `grep` / `head` / `sed` 可用。
- 在真正调用 `relizy` 前，先检查 `apps/*` 子包是否已经有基线 package tag；如果没有，就直接打印应补的 tag 命令，而不是等 `relizy` 进入内部流程后再抛出不够友好的错误。

如果其他项目也和这里一样，使用 `independent` 模式、需要照顾 Windows 本地发版、并且子包还没有历史基线 tag，那么也应该同步加上类似的兼容层；这不是为了改 `relizy` 的发版逻辑，而是为了补齐运行环境和首次接入时的前置约束。
