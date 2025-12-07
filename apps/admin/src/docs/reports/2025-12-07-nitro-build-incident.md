## 1 事故背景

- 管理端执行 `pnpm run build`（含 nitro/vite）连续失败，阻塞发布。
- 主要症状：`EISDIR` 导入目录、缺失 `@vue/compiler-sfc`、`@vue/shared` 解析失败，Nitro SSR 构建中断。

## 2 影响范围

- 管理端生产构建（vite + nitro SSR）无法产出可用包。
- 受影响分支：当前工作分支（未提及合并）。

## 3 关键时间线

- 发现：运行 `pnpm run build` 报 `Could not load ... build/src/store`，后续 `@vue/compiler-sfc` 缺失。
- 处置：
  - 修正 Nitro/Vite alias：补充 `components`、`composables`，并在 Nitro 使用 `import.meta.url` 保证路径解析。
  - 依赖补齐：新增 `@vue/compiler-sfc`、`@vue/shared`。
  - 还原导入习惯：保持原始 `components/...`、`composables/...` 入口，不强制 `index.ts` 后缀。
- 验证：`pnpm run build` 成功，Nitro SSR 构建通过。

## 4 根因分析

1. alias 解析偏移

- Nitro 默认基于 `build/utils.ts` 的路径解析，未传入 `import.meta.url` 时 `pathResolve` 错指向 `build/src`，导致 `EISDIR`。

2. 依赖缺失

- `unplugin-icons` 在 SSR 构建需要 `@vue/compiler-sfc`，项目未显式安装。
- Vite SSR 构建依赖 `@vue/shared`，未在 admin 包声明。

3. 导入调整策略不当

- 强制加 `index.ts` 后缀非必要，易引入额外路径歧义；保持约定式目录入口更稳定。

## 5 处置与修复

- 配置：
  - `apps/admin/build/utils.ts`：新增 alias `components`、`composables`。
  - `apps/admin/nitro.config.ts`：alias 同步且传入 `import.meta.url`，避免偏移。
- 依赖：
  - admin/package.json：新增 `@vue/compiler-sfc`、`@vue/shared`。
- 代码：
  - 恢复业务导入为约定入口（不强制 `index.ts` 后缀）。
- 验证：
  - 执行 `pnpm run build`（含 Nitro SSR）已通过，生成 `.output` 成功。

## 6 预防与改进

- Alias 对齐：将 tsconfig、Vite、Nitro 的 alias 长期保持一致，避免路径漂移。
- SSR 依赖白名单：将 SSR 必需依赖（如 `@vue/compiler-sfc`、`@vue/shared`）纳入 package.json 并定期审计。
- 构建前检查：在 CI 增加 `pnpm run build`（含 SSR）作为必跑项，提前暴露 alias/依赖问题。
- 变更策略：避免大规模后缀重写，优先修正 alias 与入口配置。

## 7 当前状态

- 管理端 `pnpm run build` 已通过，Nitro SSR 正常产物可运行。
- 无新增类型错误；后续如需扩展 alias，请同步到 Vite/Nitro/tsconfig。
