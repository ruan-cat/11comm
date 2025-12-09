# fdir 构建失败事故报告

## 1 背景

- 项目：@01s-11comm/admin（Vite + Nitro）
- CI 环境：GitHub Workflow，Node 22.14.0，命令 `pnpm run build` → `turbo vite:build:prod`
- 现象：CI 构建报错 `"createRequire" is not exported by "__vite-browser-external"`，指向 `fdir/dist/index.mjs`

## 2 事故经过

- CI 使用未锁定版本，安装到 `vite@7.2.7` 及其依赖链 `fdir@6.5.0`，产物中 `module` 被替换为 `__vite-browser-external`，`createRequire` 缺失导致构建失败。
- 本地构建（锁到 7.1.12）未复现；CI 环境首次触发时失败。
- 排查后在本地运行 `pnpm why fdir --filter @01s-11comm/admin` 确认 fdir 来自 Vite 与 tinyglobby 链路。

## 3 影响范围

- GitHub Workflow 上的 `pnpm run build`（turbo → @01s-11comm/admin#vite:build:prod）失败，阻塞管线。
- Cloudflare Worker 流水线未受影响（未使用 7.2.7）。

## 4 原因分析

- 没有锁文件且未设置 workspace 级 override，CI 直接装到最新的 `vite@7.2.7`。
- Vite 7.2.7 在 SSR 构建下将 Node 内置 `module` 映射到 `__vite-browser-external`，`createRequire` 缺失触发 Rollup 错误。
- 依赖链中多处间接引用 fdir，版本漂移无法通过单点升级规避。

## 5 处置与变更

- 在 `pnpm-workspace.yaml` 增加 overrides：`vite@7.1.12`、`tinyglobby@0.2.15`、`fdir@6.5.0`，统一全仓依赖版本。
- 移除根 `package.json` 的 overrides，避免重复配置。
- `apps/admin` 保持 `vite@7.1.12`，新增可传递 `NITRO_PRESET` 的构建脚本（仅 Vite 构建保留，已移除直接 `nitro build` 命令）。
- 本地验证：`pnpm -F @01s-11comm/admin vite:build:prod` 通过。

## 6 复现步骤

- 在无 overrides 的环境安装（或升级）到 `vite@7.2.7`，运行 `pnpm -F @01s-11comm/admin vite:build:prod`。
- 观察错误：`"createRequire" is not exported by "__vite-browser-external"` 指向 `fdir/dist/index.mjs`。

## 7 后续行动项

- 在 CI 重新安装依赖（应用 workspace overrides）：`pnpm install --filter @01s-11comm/admin --no-optional`。
- 重新运行 CI 构建验证。
- 解决遗留类型检查问题（当前 `vue-tsc` 报若干 “is not a module”），单独排期处理。
- 考虑补充锁文件或启用 pnpm deploy cache，进一步避免版本漂移。

## 8 风险与建议

- 风险：未来若上游 Vite/fdir 再次变更，仍可能在未锁版本时暴露新问题。
- 建议：保持 workspace overrides 或引入锁文件；在发布前固定 CLI 安装源与版本；必要时对 SSR 构建链路增加 smoke test。
