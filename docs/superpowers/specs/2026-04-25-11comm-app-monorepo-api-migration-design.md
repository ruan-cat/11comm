# 2026-04-25 11comm App 迁入 Monorepo 与唯一 Nitro API 设计

## 背景

当前存在两个长期分离的项目：

- `D:\code\ruan-cat\01s-11comm`：admin 后台 monorepo，包含 `apps/admin` 与 `apps/type`。
- `D:\code\ruan-cat\01s-11comm-app`：移动端 app 项目，包含独立前端、独立 Nitro legacy/mock 服务。

目标是把 `01s-11comm-app` 原封不动迁入 `01s-11comm`，作为 monorepo 内的子应用，并建立唯一、独立部署的 Nitro API 服务，同时支撑 admin 后台和 app 前端。

## 已确认决策

1. 唯一 Nitro API 服务放在 `apps/api`。
2. `01s-11comm-app` 迁入为 `apps/app`。
3. 迁入 app 时不保留原仓库 Git 历史，不使用 `git subtree`。
4. app 迁入采用快照复制：直接复制文件到 `apps/app`，后续在 monorepo 内治理。
5. 第一阶段以“原封不动迁入”为主，不立即拆解 app 内部结构。
6. `apps/type` 继续作为数据库 Schema、Zod Schema、TypeScript 类型的唯一事实来源。
7. Nitro 接口不新增任何鉴权逻辑，不引入 JWT、Token 校验、Neon Auth。

## 目标架构

```text
01s-11comm/
  apps/
    admin/   # pure-admin 后台前端
    app/     # 由 01s-11comm-app 快照复制迁入的移动端子应用
    api/     # 唯一 Nitro API 服务，独立启动、构建、部署
    type/    # Schema / Zod / Drizzle / TS 类型唯一事实来源
```

最终状态：

- admin 和 app 都通过配置指向 `apps/api`。
- `apps/admin/server` 与 `apps/app/server` 只作为迁移来源或临时兼容层，不作为长期生产 API。
- app legacy 路径 `/app/**`、`/callComponent/**` 先保留兼容，再逐步映射到规范 API。
- 新增和补齐 CRUD 时，以 admin 的 `rank-route-keys.ts` 三级业务路径作为 canonical 业务坐标。

## 迁移策略

采用“整仓快照迁入 + 影子 API + 渐进拆耦”。

### 阶段 1：快照迁入 app

把 `D:\code\ruan-cat\01s-11comm-app` 复制到：

```text
apps/app/
```

保留 app 的既有结构，包括：

- `src/**`
- `server/**`
- `env/**`
- `package.json`
- `vite.config.ts`
- `nitro.config.ts`
- `pages.config.ts`
- `manifest.config.ts`
- 现有脚本、配置和 mock 体系

只做 monorepo 必要适配，例如包名、workspace 识别、脚本入口、依赖安装策略。

### 阶段 2：建立 `apps/api` 影子服务

新增最小 Nitro 服务，先不迁移大业务：

- 健康检查
- CORS
- runtimeConfig
- 环境变量读取
- 数据库连接
- 统一响应基础类型
- 基础测试

所有 H3 API 必须从 `nitro/h3` 导入。

### 阶段 3：接入 app/admin 到统一 API

通过环境变量或代理配置，让两端可以指向 `apps/api`：

- admin 使用统一 API base URL，不再依赖生产同源 `/api`。
- app 短期保留 `/app/**`、`/callComponent/**` 旧路径契约。
- 不在这一阶段大改页面和业务组件。

### 阶段 4：迁移 app legacy API

把 `apps/app/server/**` 中的 legacy dispatcher、runtime endpoints、memory repository、模块接口逐步迁入 `apps/api`。

迁移顺序：

1. 保持旧路径行为一致。
2. 固定兼容测试。
3. 增加 adapter，把 app legacy 字段映射到统一 schema/DTO。
4. 再替换 mock/memory 数据源为真实数据库。

### 阶段 5：迁移 admin API 并补齐 CRUD

按 `apps/admin/src/router/rank/rank-route-keys.ts` 的三级业务路径迁移。

优先处理：

- `property-manage/expense-manage`
- `property-manage/house-property-manage`
- `property-manage/parking-manage`
- `property-manage/patrol-manage`
- `property-manage/repairs-manage`
- `operation-team`
- `dev-team/menu-manage`

每个业务路径逐步补齐：

- `list`
- `detail`
- `create`
- `update`
- `delete`
- 必要的业务 action

### 阶段 6：收口旧服务

确认 admin/app 都稳定消费 `apps/api` 后，再逐步退役：

- `apps/admin/server`
- `apps/app/server`

删除旧服务必须放在最后，且要有回滚路径。

## 第一阶段禁做清单

以下事项必须记录并严格避免：

1. 不使用 `git subtree` 迁入 app。
2. 不保留 `01s-11comm-app` 的历史提交。
3. 不在第一阶段重写 app 项目结构。
4. 不删除 `apps/app/server`。
5. 不删除 `apps/admin/server`。
6. 不立即合并两个现有 Nitro server。
7. 不把 app 当前 Nitro 直接定义为唯一后端。
8. 不把 admin 当前 Nitro 直接定义为唯一后端。
9. 不批量改写 app 的接口调用。
10. 不批量改写 admin 的页面和组件。
11. 不一次性补齐 100 个 admin 业务路径的 CRUD。
12. 不批量重命名数据库字段。
13. 不在 `apps/api` 内私自定义新的数据库表事实来源。
14. 不新增 JWT、Token 校验、Neon Auth 或任何接口鉴权。
15. 不从 `"h3"` 直接导入 H3 函数。
16. 不全局安装工具包。
17. 不让多个编辑子代理同时修改根级 `package.json`、`pnpm-lock.yaml`、`pnpm-workspace.yaml`、`turbo.json`、部署配置。
18. 不把 app mock/memory repository 当作最终生产数据源。
19. 不把 app legacy 字段直接污染 admin schema。
20. 不删除 legacy 路由 `/app/**`、`/callComponent/**`，先保留兼容。

## 风险控制

- 使用影子迁移：`apps/api` 先并行存在，旧服务先不删。
- 使用兼容路由：保留 app legacy 路径，新增规范路径。
- 使用显式 adapter：app 旧字段和 DB schema 字段之间必须有映射层。
- 使用环境变量切流：admin/app 的 API base URL 必须能回退。
- 使用分模块验收：每次只迁移少量业务路径。
- 使用 `apps/type` 作为唯一事实来源：所有 schema 变更按 Trinity Pattern 和导出链同步。

## 验收标准

第一阶段完成时必须满足：

- `apps/app` 存在，并保留原 app 主体结构。
- `apps/app` 不包含嵌套 `.git`。
- 根 workspace 能识别 `apps/app`。
- 迁入不破坏现有 `apps/admin` 与 `apps/type`。
- 用户既有暂存修改不被混入迁移提交。

`apps/api` 阶段完成时必须满足：

- API 可独立启动和构建。
- 健康检查可访问。
- 不依赖 admin Vite 或 app uni 编译。
- H3 API 均从 `nitro/h3` 导入。
- 不存在鉴权中间件或鉴权插件。
- 数据库连接通过请求事件和 runtimeConfig 安全读取。
