# 构建与 fdir/Vite 事件复盘报告

## 01 背景

- 项目：@01s-11comm/admin（Vite + Nitro）
- CI 环境：GitHub Workflow，Node 22.14.0，命令 `pnpm run build` → `turbo vite:build:prod`
- 依赖焦点：Vite、tinyglobby、fdir 版本漂移导致 SSR 构建异常

## 02 事件摘要

- 事故：Vite 7.2.7 链路在 CI 构建中将 Node 内置 `module` 映射为 `__vite-browser-external`，`fdir/dist/index.mjs` 读取 `createRequire` 失败，导致构建中断。
- 验证分支：曾移除 overrides 升级到 Vite 7.2.7，本地构建可通过，但仍有 peer warnings，且 CI 未复核通过。

## 03 复现要点

- 条件：无 overrides，安装 Vite 7.2.7（及 tinyglobby/fdir），执行 `pnpm -F @01s-11comm/admin vite:build:prod`。
- 结果：Rollup 报错 `"createRequire" is not exported by "__vite-browser-external"`，指向 fdir。

## 04 处置与验证

- 版本覆盖：在 `pnpm-workspace.yaml` 重新启用 overrides，锁定 `vite@7.1.12`、`tinyglobby@0.2.15`、`fdir@6.5.0`；并保留 catalog 记录。
- 构建验证：使用覆盖后在本地 `pnpm -F @01s-11comm/admin vite:build:prod` 通过，未再触发 fdir 报错。
- 安装验证：`pnpm install --filter @01s-11comm/admin --no-optional --no-frozen-lockfile` 已执行，仍存在少量 peer warning（见下）。

## 05 当前决策

- 采用 workspace overrides 方案锁定 Vite 7.1.12 链路，避免 CI 版本漂移导致的 fdir 报错。
- 保留 `NITRO_PRESET` 构建脚本（含 GitHub/Cloudflare 预设），但关闭直接 `nitro build` 命令。

## 06 未消除的 peer warning（信息性）

- `@ruan-cat/generate-code-workspace` 期望 `tsx@4.19.3`，当前 4.21.0。
- `@ruan-cat/utils` 期望 `unplugin-vue-router@^0.12.0`，当前 0.19.0。
- `@leelaa/vitepress-plugin-extended` 期望 `vitepress@^2.0.0-alpha.6`，当前 1.6.4。
- `vite-plugin-vercel` 期望 `vite@^4.4||^5.0.2||^6`，现锁 7.1.12（覆盖后不再追求匹配）。

## 07 后续行动

- CI 复测：在当前 overrides 下运行 GitHub Workflow `pnpm run build` 确认无报错。
- 若需彻底消除 peer warning：决定是否降级/替换上述依赖或等待上游放宽 peer 约束。
- 类型检查遗留：`vue-tsc` “not a module” 系列需单独排期修复。
- 如将来再尝试 Vite 升级，需先在分支移除 overrides 验证，并确保 CI 同步通过后再落地。
