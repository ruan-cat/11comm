<!--
  TODO: 需要整合到通用工具包的说明文档内
  有参考意义 不予删除
-->

# 2026-03-23 接入 Relizy 独立发版方案并调整子包 private 约束

## 背景

本次目标是在 `11comm` 根工作区接入 `LouisMazel/relizy`，实现以下能力：

- 子包版本号管理
- 根目录与子包级别的 `CHANGELOG.md` 生成
- git tag 创建与推送
- 暂不执行 npm publish

最初设想是使用 `versionMode: "selective"`，但在核对 `relizy@1.2.1` 的实际实现后，确认 `selective` 并不提供“各子包独立版本号”，而是会把根包和被 bump 的包统一写成同一个版本号。这与当前仓库版本现状直接冲突：

- 根包 `@01s-11comm/root`: `0.11.0`
- 子包 `@01s-11comm/admin`: `6.0.0`
- 子包 `@01s-11comm/type`: `1.0.0`

如果直接接入 `selective`，第一次发版就可能把 `admin` 和 `type` 改写到根包的 `0.11.x` 版本线。因此本次最终改为 `versionMode: "independent"`。

## 本次改动

- 根目录新增 [`relizy.config.ts`](./../../../../../relizy.config.ts)。
- 根 `package.json` 新增 `release` / `release:relizy` 命令，通过 [`scripts/relizy-runner.ts`](./../../../../../scripts/relizy-runner.ts) 在仓库内执行 `relizy release --no-publish --no-provider-release --yes`（`--yes` 用于跳过 bump 前的交互确认，见 README「Relizy 发版」小节）。
- `relizy` monorepo 包范围改为 `apps/*`，实际覆盖 `apps/admin` 和 `apps/type`。
- `relizy.config.ts` 直接复用 [`changelog.config.ts`](./../../../../../changelog.config.ts) 的 `types` 和 `templates`。
- 保留根 changelog，同时为每个子包生成独立 changelog。
- 关闭 publish、provider release、social、pr comment，只保留版本 bump、changelog、commit、tag、push。
- `release:relizy` 增加了 Windows 兼容处理，自动补齐 `relizy` 依赖的 `grep`、`head`、`sed` 命令搜索路径。

## 首次接入前提

### 1. independent 模式需要先补基线 package tag

当前仓库历史上只有根包 `v0.x.x` 这类仓库级 tag，没有 `@01s-11comm/admin@x.y.z`、`@01s-11comm/type@x.y.z` 这类子包级 tag。

而 `relizy` 的 independent 模式会优先基于 package tag 计算每个子包的变更区间。没有这些 tag 时，首次接入会把子包视为“新包”，再从首个提交向当前 ref 计算 commit 区间；在本仓库里，`apps/admin` 与 `apps/type` 的首个提交就是仓库初始提交，这会触发一次额外的边界问题。

因此，首次接入需要先补一次基线 tag：

```bash
git tag "@01s-11comm/admin@6.0.0"
git tag "@01s-11comm/type@1.0.0"
git push origin "@01s-11comm/admin@6.0.0" "@01s-11comm/type@1.0.0"
```

为了避免团队成员忘记这一步，`release:relizy` 入口脚本已经内置检查；如果缺少 package tag，会直接报错并打印上面的命令。

### 2. Windows 直接跑原生命令会踩 GNU 工具依赖

`relizy@1.2.1` 在 independent 模式下，内部会通过 shell 命令使用 `grep`、`head`、`sed` 过滤 package tag。PowerShell / cmd 默认环境通常没有这些 GNU 工具，因此直接执行裸命令时会失败。

本次没有修改第三方依赖源码，而是在仓库内新增兼容入口脚本，让 `pnpm release:relizy` 在 Windows 下自动补齐 Git for Windows 的 `usr/bin` 到 PATH，再继续执行 relizy。

## 破坏性变更

### 1. `apps/admin` 与 `apps/type` 不再是 `private: true`

这是本次最重要的破坏性变更。

原因不是业务偏好，而是 `relizy` 当前实现会在 workspace 扫描阶段直接忽略 `private: true` 的包。如果不把这两个子包改成可参与版本管理的包，`relizy` 根本不会识别它们，也就无法生成版本、changelog 和 tag。

受影响文件：

- [`apps/admin/package.json`](./../../../../../apps/admin/package.json)
- [`apps/type/package.json`](./../../../../../apps/type/package.json)

### 2. 子包失去 npm 层面的“禁止发布”硬保护

把 `private` 改成 `false` 之后，两个子包理论上已经具备被发布的资格，不再有 `npm publish` 的硬阻断。

当前缓解措施只有两层：

- 标准命令固定使用 `relizy release --no-publish --no-provider-release --yes`（避免交互确认在无 TTY/CI 下阻塞）
- `relizy.config.ts` 默认也关闭了 `publish` 与 `providerRelease`

这能阻止当前发版流程误发 npm，但它不是等价于 `private: true` 的硬保护。

## 为什么不用 selective

`relizy@1.2.1` 的 `selective` 模式特点是：

- 只 bump 有变更的包及其依赖包
- 但所有被 bump 的包共享同一个新版本号

这更接近“选择性统一版本”，而不是“独立版本”。

当前仓库需要的是：

- `admin` 和 `type` 可以沿着各自版本线演进
- 不被根包 `0.11.0` 绑到同一版本线上

因此只能改用 `independent`。

## 标准命令

```bash
pnpm release:relizy
```

实际执行（经 runner 调用 relizy；与根 `package.json` 脚本一致）：

```bash
relizy release --no-publish --no-provider-release --yes
```

`--yes`：`relizy` 默认会在 bump 前询问是否继续；不加则在许多环境下会卡住等待输入。详见仓库根目录 [README.md](../../../../../README.md) 中「`--yes` 是做什么的？」。

推荐发版示例：

```bash
pnpm release:relizy -- --patch
pnpm release:relizy -- --minor
pnpm release:relizy -- --patch --dry-run --no-clean
```

执行结果预期：

- 根据 Conventional Commits 计算 `apps/admin`、`apps/type` 的独立版本
- 生成根 `CHANGELOG.md`
- 生成子包 `CHANGELOG.md`
- 创建并推送 git commit 与 package tag
- 不发布 npm
- 不创建 provider release

## 验证结论

已验证以下结论：

- 仅修改配置但不补 package tag 时，independent 模式无法在当前仓库历史上稳定完成首次区间计算。
- 为 `apps/admin` 与 `apps/type` 临时补上基线 tag 后，`relizy` 可以正确识别子包 tag，并继续后续版本分析流程。
- 在 Windows 环境中，只要将 Git for Windows 的 `usr/bin` 放入 PATH，`relizy` 内部依赖的 `grep`、`head`、`sed` 就可以正常工作。

## 后续建议

1. 如果未来真的要启用 npm publish，先补充私有 registry / `publishConfig` / token / 权限策略，不要直接移除 `--no-publish`。
2. 团队后续文档、脚本、CI 如涉及发版入口，应统一切到 `pnpm release:relizy`，不要直接在 Windows 环境里调用裸 `relizy release ...`。
3. 如果后续又想回到统一版本体系，可以重新评估 `selective` 或 `unified`，但那会再次触发版本线迁移。
