<!-- TODO:  等待使用 -->

# 2026-04-17 升级 `@ruan-cat/utils` 的 `relizy-runner` 以兼容 `changelog --yes`

## 背景

当前 `11comm` 仓库已经把子包发版入口统一到：

```bash
pnpm exec relizy-runner changelog --dry-run
pnpm exec relizy-runner release --dry-run --no-publish --no-provider-release --no-push --no-commit --no-clean --yes
```

但在对齐最新版 `init-release-base-relizy-and-bumpp` 技能时，发现技能原文仍会给出下面这条命令：

```bash
pnpm exec relizy-runner changelog --dry-run --yes
```

当前 `@ruan-cat/utils` 内的 `relizy-runner` 只对 `release` / `bump` 做 `--yes` 自动注入，`changelog --yes` 会被原样透传给上游 `relizy`，从而触发：

```log
error: unknown option '--yes'
```

这不是 `11comm` 仓库自身配置问题，而是 `@ruan-cat/utils` 中 `relizy-runner` 的参数兼容层还没有覆盖这个场景。

## 现状定位

根据 `D:\code\ruan-cat\monorepo\packages\utils` 当前代码，关键事实如下：

- 包入口：[`package.json`](D:\code\ruan-cat\monorepo\packages\utils\package.json)
- CLI 主实现：[`src/node-esm/scripts/relizy-runner/index.ts`](D:\code\ruan-cat\monorepo\packages\utils\src\node-esm\scripts\relizy-runner\index.ts)
- 测试：[`src/node-esm/scripts/relizy-runner/index.test.ts`](D:\code\ruan-cat\monorepo\packages\utils\src\node-esm\scripts\relizy-runner\index.test.ts)
- 文档：[`src/node-esm/scripts/relizy-runner/index.md`](D:\code\ruan-cat\monorepo\packages\utils\src\node-esm\scripts\relizy-runner\index.md)

现有实现中：

- `RELIZY_SUBCOMMANDS_WITH_YES_PRESET = new Set(["release", "bump"])`
- `prepareRelizySpawnArgs()` 只会在 `release` / `bump` 自动补 `--yes`
- 显式传入的 `--yes` 不会被 runner 吃掉；如果子命令是 `changelog`，它会直接透传给上游 relizy
- 测试明确写死了“`changelog` 不注入 `--yes`”，但还没有覆盖“`changelog --yes` 应被兼容接受”的场景

## 升级目标

让下面两类命令都稳定可用，同时不改变现有 `release` / `bump` 行为：

```bash
relizy-runner changelog --dry-run
relizy-runner changelog --dry-run --yes
```

目标语义应为：

1. `changelog` 子命令仍然**不自动注入** `--yes`
2. 如果用户显式写了 `--yes`，runner 应当**兼容接受**它
3. 对 `changelog` 来说，`--yes` 只作为 runner 兼容参数存在，**不得再透传**给上游 `relizy`
4. `release` / `bump` 的自动注入与 `--no-yes` 语义保持不变

## 推荐改造方案

### 1. 调整参数规整逻辑，而不是改写调用方

优先修改：

- [`src/node-esm/scripts/relizy-runner/index.ts`](D:\code\ruan-cat\monorepo\packages\utils\src\node-esm\scripts\relizy-runner\index.ts)

推荐把 `prepareRelizySpawnArgs()` 的策略从“只剔除 `--no-yes`”升级为“两层处理”：

1. 先识别 runner 级参数：
   - `--no-yes`
   - `--yes`
2. 再基于 relizy 子命令决定是否把 `--yes` 传给上游

推荐行为矩阵：

| 子命令         | 用户未传 `--yes`      | 用户显式传 `--yes`                                                              | 用户显式传 `--no-yes`                |
| -------------- | --------------------- | ------------------------------------------------------------------------------- | ------------------------------------ |
| `release`      | runner 自动补 `--yes` | 保留一个 `--yes` 传给 relizy                                                    | 不传 `--yes`                         |
| `bump`         | runner 自动补 `--yes` | 保留一个 `--yes` 传给 relizy                                                    | 不传 `--yes`                         |
| `changelog`    | 不补                  | **吃掉 `--yes`，不要透传**                                                      | 允许出现但仅作为 runner 级无操作参数 |
| 其他未知子命令 | 默认透传原参数        | 建议保守处理：仅当确认上游支持时才保留 `--yes`；否则可比照 `changelog` 兼容吃掉 |

更稳妥的落地方式是新增一个专门判定函数，例如：

- `shouldForwardYesToRelizy(command: string | undefined): boolean`
- 或 `normalizeRunnerOnlyArgs(relizyArgs: string[]): { command; hasYes; optOutYes; forwardBaseArgs }`

这样可以把“是否自动注入”和“是否允许透传”拆开，避免后续再出现同类兼容漏洞。

### 2. 不要把 `changelog` 也纳入自动注入集合

不要简单把：

```ts
new Set(["release", "bump"]);
```

改成：

```ts
new Set(["release", "bump", "changelog"]);
```

原因：

- `relizy changelog` 上游本身不接受 `--yes`
- 如果改成自动注入，runner 会把原本可执行的 `changelog` 命令全部打坏
- 本次需要的是“兼容 skill 原文里的显式 `--yes`”，不是“给 changelog 增加确认跳过语义”

### 3. 对兼容吞掉的 `--yes` 给出轻量提示

建议在 `changelog --yes` 场景下打印一次 `consola.info` 或 `consola.debug`，例如：

```text
[relizy-runner] `changelog` 子命令不需要 `--yes`，已兼容忽略该参数。
```

要求：

- 不要报错
- 不要影响退出码
- 不要在测试输出里造成脆弱依赖；若日志难测，可只断言不抛错且参数未透传

### 4. 测试必须补齐

重点修改：

- [`src/node-esm/scripts/relizy-runner/index.test.ts`](D:\code\ruan-cat\monorepo\packages\utils\src\node-esm\scripts\relizy-runner\index.test.ts)

至少新增这些用例：

1. `prepareRelizySpawnArgs(["changelog", "--dry-run", "--yes"])` 应返回 `["changelog", "--dry-run"]`
2. `prepareRelizySpawnArgs(["changelog", "--yes"])` 应返回 `["changelog"]`
3. `prepareRelizySpawnArgs(["release", "--yes", "--dry-run"])` 仍保持单个 `--yes`
4. `prepareRelizySpawnArgs(["release", "--no-yes", "--yes"])` 需要明确优先级

推荐优先级规则：

- `--no-yes` 优先级高于自动注入
- 但如果用户同时显式给了 `--yes` 与 `--no-yes`，需要在计划里写清楚最终语义

建议统一成：

- `--no-yes` 只关闭自动注入
- 如果用户显式写了 `--yes`，则视为“我就是要传”

也就是说：

```ts
prepareRelizySpawnArgs(["release", "--no-yes", "--yes"]);
// => ["release", "--yes"]
```

这个规则更符合 CLI 直觉，也更便于解释。

### 5. 文档与帮助文本一起改

重点同步以下文件：

- [`src/node-esm/scripts/relizy-runner/index.md`](D:\code\ruan-cat\monorepo\packages\utils\src\node-esm\scripts\relizy-runner\index.md)
- [`src/cli/index.md`](D:\code\ruan-cat\monorepo\packages\utils\src\cli\index.md)

需要补充的口径：

1. `release` / `bump` 仍会自动追加 `--yes`
2. `changelog` 不会自动追加 `--yes`
3. 若用户显式写 `changelog --yes`，runner 会兼容忽略该参数，不再透传给 relizy
4. `--no-yes` 是 runner 级参数，不会传给 relizy

帮助文本 `getRelizyRunnerHelpText()` 也应更新，避免继续让使用者误以为任意子命令都可以把 `--yes` 原样交给 relizy。

### 6. 版本发布建议

这是兼容性 bugfix，不是破坏性重构，建议按 **patch** 发布：

- `@ruan-cat/utils`：`4.25.0 -> 4.25.1`（示例）

如果该仓库有既定的 changeset / changelog / 发布流水线，也应把这次变更归类为：

- `fix(cli): relizy-runner 兼容 changelog --yes，避免向上游 relizy 透传非法参数`

## 验收标准

在 `D:\code\ruan-cat\monorepo\packages\utils` 仓库内，至少完成以下验证：

```bash
pnpm exec vitest run packages/utils/src/node-esm/scripts/relizy-runner/index.test.ts
pnpm exec tsx packages/utils/src/cli/relizy-runner.ts --help
pnpm exec tsx packages/utils/src/cli/relizy-runner.ts changelog --dry-run --yes
pnpm exec tsx packages/utils/src/cli/relizy-runner.ts release --dry-run --no-publish --no-provider-release --no-push --no-commit --no-clean --yes
```

理想结果：

- `changelog --dry-run --yes` 不再报 `unknown option '--yes'`
- `release` / `bump` 的既有行为不回退
- 文档、帮助文本、测试三者口径一致

## 非目标

这次改造**不应该**顺手去做下面这些事情：

1. 不要在 `@ruan-cat/utils` 里 vendor 一份 relizy
2. 不要为 `11comm` 单独写特判仓库名
3. 不要改写 relizy 的 changelog 生成逻辑
4. 不要把 `changelog` 错误地纳入自动 `--yes` 注入集合

## 建议给下一个 AI 的执行口令

如果你后面要把这个计划交给别的 AI，可以直接给它下面这段任务描述：

```md
请在 D:\code\ruan-cat\monorepo\packages\utils 内升级 @ruan-cat/utils 的 relizy-runner：

1. 保持 release / bump 的自动 --yes 注入不变
2. 让 relizy-runner changelog --dry-run --yes 被兼容接受
3. changelog 子命令下显式传入的 --yes 不能再透传给上游 relizy
4. 同步修改：
   - packages/utils/src/node-esm/scripts/relizy-runner/index.ts
   - packages/utils/src/node-esm/scripts/relizy-runner/index.test.ts
   - packages/utils/src/node-esm/scripts/relizy-runner/index.md
   - packages/utils/src/cli/index.md
5. 用 vitest 补测试，并验证 changelog --dry-run --yes 不再报 unknown option '--yes'
6. 这是 patch 级兼容修复，不要顺手做大改
```
