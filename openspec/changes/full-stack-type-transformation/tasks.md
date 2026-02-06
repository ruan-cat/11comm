<!--
    Actionable implementation tasks.
    - Checkboxes [ ] for work to be done
    - Indented subtasks for detail
    - Critical path visualization
-->

## Phase 1: 基础设施设置 (Infrastructure Setup)

- [ ] **安装 apps/type 依赖**
  - 在 `apps/type` 中运行 `pnpm add drizzle-orm zod drizzle-zod`。
  - 确保 `apps/type/package.json` 将它们列在 `dependencies` (而非 dev) 中。
- [ ] **安装 apps/admin 依赖**
  - 在 `apps/admin` 中运行 `pnpm add zod`。
  - 确保 `apps/admin` 可以解析 `apps/type` 导入 (workspace 协议)。

## Phase 2: 试点迁移 (影子模式/Shadow Mode)

- [ ] **迁移 Operation Team (运维团队)**
  - 创建 `apps/type/src/business/operation-team/schema.ts` (或类似的现有路径)。
  - 从 `apps/admin` 复制 Drizzle table 定义。
  - 添加 `createInsertSchema` 和 `createSelectSchema`。
  - 导出 `Table`, `Schemas`, 和 `Types`。
- [ ] **验证试点**
  - 检查 `apps/type` 是否能正确构建/编译。
  - (可选) 创建一个临时的验证脚本。

## Phase 3: 批量 Schema 迁移 (Bulk Schema Migration)

<!-- 将所有 Tables 复制到 apps/type/src/business/.../schema.ts -->

- [ ] **迁移 Property Manage (物业管理)**
  - `community-manage` (社区管理)
  - `contract-manage` (合同管理)
  - `expense-manage` (费用管理)
  - `house-property-manage` (房产管理)
  - `parking-manage` (停车管理)
  - `patrol-manage` (巡检管理)
  - `repairs-manage` (报修管理)
  - `report-manage` (报表管理)
- [ ] **迁移 Setting Manage (系统设置)**
  - `dictionary-manage` (字典管理)
  - `menu-manage` (菜单管理)
  - `role-manage` (角色管理)
  - `system-manage` (系统管理)
  - `user-manage` (用户管理)
- [ ] **迁移 Development Team (开发团队)**
  - `data-dict` (数据字典 - 如适用)

## Phase 4: 后端切换验证 (Backend Switch & Verification)

- [ ] **更新 Drizzle Config**
  - 修改 `apps/admin/drizzle.config.ts` 指向 `schema: "../../apps/type/src/**/schema.ts"`。
- [ ] **更新 DB 连接**
  - 修改 `apps/admin/server/db/index.ts` 以从 `@01s-11comm/type` 导入 Schema。
- [ ] **验证 Schema 完整性**
  - 运行 `pnpm db:generate` 或 `drizzle-kit check` 确保没有意外的 Schema 变更 (diff 应为零)。

## Phase 5: 代码集成与重构 (Code Integration)

- [ ] **更新 Admin API**
  - 重构 `apps/admin/server/api` 端点，使用新的 Zod Schemas 配合 `readValidatedBody`。
- [ ] **更新前端表单**
  - 重构 Vue 组件，使用 Zod Schemas 进行验证。

## Phase 6: 清理 (Cleanup)

- [ ] **移除旧 Schemas**
  - 删除 `apps/admin/server/db/schemas`。
  - 验证确保没有对旧 Schema 路径的残留引用。
