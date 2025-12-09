# Vite 升级验证报告

## 01 变更概述
- 移除 `pnpm-workspace.yaml` 中对 `vite/tinyglobby/fdir` 的 overrides。
- 将 `apps/admin` 的 devDependency `vite` 升级到 `7.2.7`，并通过 `pnpm up` 同步 tinyglobby/fdir。

## 02 验证步骤
- 环境：分支 `chore/vite-upgrade-validation`，Node 22.14.0，pnpm 10.24.0。
- 执行 `pnpm -F @01s-11comm/admin vite:build:prod`（默认 nitro cloudflare preset）。
- 观察构建日志：无 `createRequire/__vite-browser-external/fdir` 报错，SSR/Nitro 均完成。

## 03 结果
- 构建通过，未再出现 fdir 相关错误。
- 出现若干 peer warning（vuepress、search-insights、stylelint-order 等），但不影响构建。

## 04 风险与后续
- 仍需在 CI 环境跑 `pnpm run build` 验证云端一致性。
- 历史 typecheck 报错未处理（若干 `.vue` 被视为非模块、@nolebase/ui Option.vue），需单独排期。
- 如需长期去掉 overrides，建议生成 `pnpm-lock.yaml` 固定已验证版本。 

