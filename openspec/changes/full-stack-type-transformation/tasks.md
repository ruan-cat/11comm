<!--
    全栈类型统一改造详细操作手册 (Detailed Operational Manual)
    严格遵循 "影子迁移 (Shadow Migration)" 策略。
-->

## Phase 1: 基础设施准备 (Sub-Agent A)

> **代理角色**: DevOps & 配置专家
> **目标**: 配置 `apps/type` 项目以支持运行时 Schema 定义，并确保编译链路正确。

- [ ] **1.1 升级 apps/type 依赖**
  - **动作**: 在 `apps/type` 中，确保以下包位于 `dependencies` (而不是 `devDependencies`):
    - `drizzle-orm`
    - `zod`
    - `drizzle-zod`
  - **命令**: `cd apps/type && pnpm add drizzle-orm zod drizzle-zod`
  - **验证**: 阅读 `apps/type/package.json` 进行确认。

- [ ] **1.2 配置 apps/type 导出 (Exports)**
  - **动作**: 更新 `apps/type/package.json`。
  - **要求**: 确保 `exports` 字段支持子路径导入（如果需要），或者至少 `.` 指向 `src/index.ts`。
  - **参考**: 详见 `specs/infrastructure-config/spec.md`。

- [ ] **1.3 配置 apps/admin 依赖**
  - **动作**: 在 `apps/admin` 中，确保 `zod` 作为直接依赖项安装。
  - **命令**: `cd apps/admin && pnpm add zod`

- [ ] **1.4 验证环境**
  - **动作**: 运行构建/类型检查循环，确保没有立即回归。
  - **命令**: `pnpm -F @01s-11comm/type typecheck`

## Phase 2: 试点迁移 - "运维管理/Operation Team" (Sub-Agent B)

> **代理角色**: 高级后端开发
> **目标**: 迁移一个隔离的单一模块 (`operation-team`) 以验证模式是否有效。

- [ ] **2.1 创建影子 Schema (Shadow Schema)**
  - **阅读源文件**: 阅读 `apps/admin/server/db/schemas/operation-team.ts`。
  - **创建目标文件**: 创建 `apps/type/src/business/operation-team/schema.ts`。
  - **实现细节**:
    - 使用 `specs/schema-standard/spec.md` 中的 **三位一体模式 (Trinity Pattern)** (Table + Zod + Type)。
    - 确保 **所有** 字段都从源表中完整迁移。
    - 确保 `json` 字段拥有严格的 Zod 定义。

- [ ] **2.2 对齐导出 (Export Alignment)**
  - **动作**: 编辑 `apps/type/src/business/operation-team/index.ts`。
  - **要求**: 添加 `export * from "./schema"`。
  - **清理**: 注释掉或删除任何与新推导类型 (Inferred Types) 冲突的旧 `interface` 定义。

- [ ] **2.3 消费者验证 (试点测试)**
  - **动作**: 在 `apps/admin/server/test_schema_import.ts` 创建一个临时测试文件 (不要提交)。
  - **代码**: 尝试从 `@01s-11comm/type` 导入 `insertOperationTeamSchema`。
  - **目标**: 确保导入工作正常，并且 TS 能正确识别类型。

## Phase 3: 全面迁移 (The Great Migration) (Sub-Agents C, D, E)

> **策略**: 按模块拆分。每个代理负责特定的业务领域。
> **核心原则**: 暂时 **不要** 修改 `apps/admin/server/db/schemas/*`。只在 `apps/type` 中创建 **新** 文件。

### Group 3.1: 物业管理 A (Sub-Agent C)

- [ ] **3.1.1 社区管理 (Community Manage)** (`apps/type/src/business/property-manage/community-manage/schema.ts`)
- [ ] **3.1.2 房产管理 (House Property)** (`apps/type/src/business/property-manage/house-property-manage/schema.ts`)
- [ ] **3.1.3 停车管理 (Parking Manage)** (`apps/type/src/business/property-manage/parking-manage/schema.ts`)

### Group 3.2: 物业管理 B (Sub-Agent D)

- [ ] **3.2.1 合同管理 (Contract Manage)** (`apps/type/src/business/property-manage/contract-manage/schema.ts`)
- [ ] **3.2.2 费用管理 (Expense Manage)** (`apps/type/src/business/property-manage/expense-manage/schema.ts`)
  - _注意_: 该模块可能包含多个表。将它们放在同一个 `schema.ts` 中，或者如果有必要则拆分，但必须统一导出。
- [ ] **3.2.3 报修管理 (Repairs Manage)** (`apps/type/src/business/property-manage/repairs-manage/schema.ts`)

### Group 3.3: 系统设置 (System Settings) (Sub-Agent E)

- [ ] **3.3.1 字典管理 (Dictionary)** (`apps/type/src/business/setting-manage/dictionary-manage/schema.ts`)
- [ ] **3.3.2 角色与用户 (Role & User)** (`apps/type/src/business/setting-manage/role-manage/schema.ts`, `user-manage/schema.ts`)
- [ ] **3.3.3 菜单与系统 (Menu & System)** (`apps/type/src/business/setting-manage/menu-manage/schema.ts`)

## Phase 4: 切换 (Switchover) (Sub-Agent F)

> **代理角色**: 架构师
> **目标**: 将现有的数据库配置切换到新的共享 Schema (Shared Schemas)。

- [ ] **4.1 更新 Drizzle 配置**
  - **文件**: `apps/admin/drizzle.config.ts`。
  - **变更**: 将 `schema` 指向 `../../apps/type/src/business/**/schema.ts`。
  - **参考**: `specs/infrastructure-config/spec.md`。

- [ ] **4.2 更新运行时数据库连接**
  - **文件**: `apps/admin/server/db/index.ts`。
  - **动作**: 将本地导入替换为 `@01s-11comm/type` 导入。
  - **代码**: `import * as schema from "@01s-11comm/type/business";` (或类似代码)。

- [ ] **4.3 完整性验证 (CRITICAL)**
  - **命令**: `pnpm -F @01s-11comm/admin db:generate` (或 `drizzle-kit check`)。
  - **成功条件**: 输出必须显示 "No changes detected"。
  - **失败处理**: 如果存在差异 (diffs)，编辑 `apps/type` schemas 以匹配实时 DB。在此阶段 **不要** 生成更改 DB 的迁移文件，除非是有意为之。

## Phase 5: 集成与清理 (Integration & Cleanup) (Sub-Agent G)

- [ ] **5.1 后端集成**
  - **目标**: `apps/admin/server/api`。
  - **任务**: 将手动 body 验证替换为 `readValidatedBody` 和 Zod Schemas。
- [ ] **5.2 前端集成**
  - **目标**: `apps/admin/src`。
  - **任务**: 在可能的情况下，使用 Zod Schemas 作为表单验证规则。

- [ ] **5.3 清理**
  - **动作**: 删除 `apps/admin/server/db/schemas` 目录。
  - **验证**: 运行完整的项目构建和类型检查。
