# relizy 相关问题反馈（本仓库）

| 文档                                                                                               | 说明                                                           |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| [2026-03-24-windows-path-body-filter-no-bump.md](./2026-03-24-windows-path-body-filter-no-bump.md) | Windows 下 independent 发版误报无 bump 的根因与上游 issue 素材 |
| [repro-relizy-body-path-includes.mjs](./repro-relizy-body-path-includes.mjs)                       | 不依赖修改 `node_modules` 的路径匹配复现脚本                   |

在仓库根目录运行复现脚本（推荐，避免 Code Runner 在 Windows 上误用 `/usr/bin/env`）：

```bash
pnpm run repro:relizy-path
```

等价：

```bash
pnpm exec node docs/issues/relizy/repro-relizy-body-path-includes.mjs
```

### VS Code Code Runner 说明

脚本**不要**使用首行 `#!/usr/bin/env node`。部分环境下 Code Runner 会按 shebang 去执行 `/usr/bin/env`，在 Windows 上不存在该路径，报错信息在输出面板里会变成**乱码**（常见为 GBK 的「系统找不到指定的路径」被误解码）。

若仍要用 Code Runner：在设置里将 JavaScript 执行器改为直接调用 `node`（例如 `executorMap` 使用 `node`），或在集成终端里执行上面的 `pnpm run repro:relizy-path`。
