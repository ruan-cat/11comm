<!--
    Actionable implementation tasks.
-->

## Phase 1: 基础设施升级 (Infrastructure Upgrade)

- [ ] **apps/type 依赖安装**
  - 进入 `apps/type` 目录。
  - 运行 `pnpm add drizzle-orm zod drizzle-zod` (作为 dependencies, 关键!)。
  - 检查 `package.json` 确保它们不在 `devDependencies` 中。
- [ ] **apps/type 配置检查**
  - 检查 `apps/type/package.json`，确保 `main` 或 `exports` 字段正确指向 `src/index.ts` (便于源码引用)。
  - 检查 `tsconfig.json` 确保 `composite: true` 或允许被引用。
  - **Reference**: 详见 `specs/infrastructure-config.md`。
- [ ] **apps/admin 依赖确认**
  - 进入 `apps/admin` 目录。
  - 运行 `pnpm add zod` (显式添加，用于前端直接引用)。
  - 确保 `apps/admin` 依然能正确引用 `@01s-11comm/type`。

## Phase 2: 试点迁移 - 运维团队 (Pilot: Operation Team)

> 目标：通过一个小模块验证完整的“三位一体”编写流程和构建链路。

- [ ] **创建 Schema 文件**
  - 新建 `apps/type/src/business/operation-team/schema.ts`。
  - 从 `apps/admin/server/db/schemas/operation-team.ts` (或其他对应位置) 复制表定义。
  - **Check**: 检查是否有 `pgEnum` 定义。如果名字可能与其他模块冲突，移动到 `apps/type/src/common/enums.ts`。
  - **Check**: 检查是否有 `json` 字段。如果有，必须在 Zod Schema 中显式定义其结构 (ref: `schema-standard.md`)。
  - 按照 `specs/schema-standard.md` 补充 Zod Schemas 和 Types。
- [ ] **导出与替换**
  - 修改 `apps/type/src/business/operation-team/index.ts`，导出新的 schema 内容。
  - 删除该文件中旧的手动 Interface 定义，或将其别名指向新 Type。
- [ ] **初步验证**
  - 在 `apps/admin` 中尝试 `import { OperationTeam } from "@01s-11comm/type"`，确认类型提示生效。
  - 尝试 `import { insertOperationTeamSchema } from "@01s-11comm/type"`，确认运行时对象存在。

## Phase 3: 核心迁移循环 (The Great Migration Loop)

> 提示：这是纯体力工作，请严格按照 `specs/schema-standard.md` 执行。
> 不需要一次性全部做完再提交，建议按一级模块分批次提交。

- [ ] **迁移: Property Manage (物业管理)**
  - [ ] `community-manage` (社区)
  - [ ] `house-property-manage` (房产)
  - [ ] `parking-manage` (停车)
  - [ ] `contract-manage` (合同)
  - [ ] `expense-manage` (费用 - _包含大量子表_)
  - [ ] `patrol-manage` (巡检)
  - [ ] `repairs-manage` (报修)
  - [ ] `report-manage` (报表)
- [ ] **迁移: Setting Manage (系统设置)**
  - [ ] `dictionary-manage` (字典)
  - [ ] `menu-manage` (菜单)
  - [ ] `role-manage` (角色)
  - [ ] `user-manage` (用户)
  - [ ] `system-manage` (系统)
- [ ] **迁移: Development Team (开发)**
  - [ ] `data-dict` (如果有)

## Phase 4: 后端切换与验证 (Switch & Verify)

> 此阶段风险最高，必须仔细检查 Diff。

- [ ] **Update Admin Drizzle Config**
  - 修改 `apps/admin/drizzle.config.ts` 中的 `schema` 路径，指向 `../../apps/type/src/business/**/schema.ts`。
- [ ] **Update DB Connection**
  - 修改 `apps/admin/server/db/index.ts`，从 `@01s-11comm/type/business` (或对应入口) 导入所有 Tables。
- [ ] **Schema Integrity Check**
  - 运行 `pnpm -F @01s-11comm/admin db:generate`。
  - **CRITICAL**: 检查输出。应该显示 "No changes detected"。
  - **CRITICAL**: 检查输出。应该显示 "No changes detected"。
  - 如果显示有变更（如 Drop/Create），说明迁移的 Schema 与原版不一致，**必须**修正 `apps/type` 中的代码直到一致。
- [ ] **Global Export Check**
  - 检查 `apps/type/src/index.ts` (或各级 index) 是否出现 "Exported variable has or is using name ... from external module but cannot be named" 错误。
  - 确保所有 Schema 下的导出变量名（`community`, `insertCommunitySchema`）是全局唯一的，没有重复命名。

## Phase 5: 全栈集成 (Full-Stack Integration)

- [ ] **Backend Integration**
  - 搜索 `apps/admin/server/api` 下使用旧 `readBody` 的接口。
  - 逐步替换为 `readValidatedBody(event, NewSchema.parse)`。
- [ ] **Frontend Integration**
  - 搜索 `apps/admin/src` 下手动定义的 Form Rules。
  - 逐步替换为 `toTypedSchema(NewSchema)` 或直接使用 `safeParse`。

## Phase 6: 清理 (Cleanup)

- [ ] **移除旧文件**
  - 删除 `apps/admin/server/db/schemas` 目录。
- [ ] **代码扫描**
  - 全局搜索是否还有残留的 `interface` 手动定义与 Schema 重复。
