<!-- 有意义的报告 不予删除 -->

# 全栈类型改造评估报告：基于 Neon DB Schema 的统一类型架构

## 1. 报告摘要 (Executive Summary)

本报告基于 `2026-02-05-init-neon-db-schema-exploration-report.md` 及当前项目架构，深度评估了将 `apps/type` 改造为全栈统一类型源（Single Source of Truth, SSOT）的可行性与实施路径。

**核心结论**：
建议实施**"Schema 迁移与类型左移"**策略。将目前位于 `apps/admin/server/db/schemas` 的数据库定义（Drizzle Schemas）完全迁移至 `apps/type` 项目中。使 `apps/type` 升级为**业务核心定义包**，同时提供运行时 Schema 对象（给服务端使用）和静态类型/验证规则（给前后端使用）。

---

## 2. 核心架构评估 (Architecture Assessment)

### 2.1 现状与问题

- **现状**：
  - `apps/admin` (Server): 拥有 Drizzle Schemas (DB 事实标准)。
  - `apps/type`: 拥有手动编写的 TypeScript Interfaces (前端业务事实标准)。
- **问题**：
  - **双重维护**：修改数据库字段后，必须手动同步 `apps/type` 中的接口定义，极易导致不同步。
  - **缺乏运行时验证**：纯 TS 类型在运行时丢失，无法用于 API 输入校验（Zod）。

### 2.2 改造目标：全栈统一类型架构

改造后的 `apps/type` 将承担以下角色：

1.  **数据库定义层**：包含所有 `pgTable` 定义。
2.  **验证规则层**：自动生成 `Zod` Schemas (Insert/Select/Patch)。
3.  **静态类型层**：自动推导 TS Types。

### 2.3 依赖关系变更

- **变更前**：`apps/admin` -> `apps/type` (仅类型)
- **变更后**：`apps/admin` -> `apps/type` (类型 + 运行时 Schema + Zod 验证器)

---

## 3. 详细改造实施方案 (Implementation Plan)

### Q2 & Q6: 如何对类型项目做改造？如何避免破坏性变更？

改造将分为三个阶段，采用**"增量替换"**策略以避免系统崩溃。

#### 阶段一：基础设施升级 (Infrastructure)

1.  在 `apps/type` 中安装必要的运行时依赖（见下文 Q3）。
2.  修改 `apps/type/tsconfig.json` 和 `package.json`，确保支持打包或直接引用 ESM 模块，因为它将不仅仅包含 `.d.ts`，还将包含实际的 `.js/.ts` 代码。

#### 阶段二：Schema 物理迁移 (Physical Migration)

1.  将 `apps/admin/server/db/schemas/*.ts` 移动到 `apps/type/src/schemas/`。
2.  在 `apps/type` 内部配置 Drizzle 字段定义。
3.  **关键步骤**：在 `apps/type` 中保留原有的 `src/business` 目录结构。
4.  修改 `apps/admin` 中的引用，将其指向 `@01s-11comm/type` 导出的 Schemas。

#### 阶段三：类型接入与替换 (Integration)

1.  在 `apps/type/src/business/` 的各个子文件中，不再手动定义 interface。
2.  改为使用 `drizzle-zod` 和 `z.infer` 重新导出类型，并**使用类型别名（Type Alias）兼容旧名称**。

**示例：兼容性改造**

```typescript
// apps/type/src/business/setting-manage/system-manage/index.ts

// 1. 引入 Schema
import { smSystemConfigs } from "../../../schemas/setting";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// 2. 生成 Zod Schema (用于运行时验证)
export const SystemConfigSchema = createSelectSchema(smSystemConfigs);

// 3. 推导 TS 类型 (用于静态检查)
export type SystemConfig = z.infer<typeof SystemConfigSchema>;

// 4. 兼容旧代码 (Adapter Pattern)
// 如果旧代码叫 ISystemConfig 或有不同结构，在这里做通过 Omit/Pick 做适配
export type ISystemConfig = SystemConfig;
```

---

## 4. 依赖库评估 (Dependency Requirements)

### Q3: 需要安装哪些依赖？

**必须安装 (Dependencies)**：
由于 `drizzle-orm` 定义的 Table 是运行时对象，`apps/type` 将变为运行时依赖。

- `drizzle-orm`: 核心 ORM 库。
- `drizzle-zod`:用于从 Table 定义生成 Zod Schema。
- `zod`: 核心验证库。

**可选安装**：

- `tRPC`: **不需要**。除非你计划重构整个 API 层。目前的 Nitro 全栈接口可以直接使用 Zod 做验证，引入 tRPC 复杂度过高。

**在 apps/type/package.json 中添加**：

```json
{
	"dependencies": {
		"drizzle-orm": "^0.38.4",
		"drizzle-zod": "^0.6.1",
		"zod": "^3.24.1",
		"@ruan-cat/utils": "^4.20.0"
	}
}
```

---

## 5. 数据库 Schema 增强 (Schema Enhancements)

### Q4: 数据库表 schemas 需要增加哪些内容？

目前的 Schema 定义主要关注数据库结构，为了暴露业务类型，建议增强以下规范：

1.  **精细化字段验证**：
    利用 Drizzle 的字段 API 增强 Zod 推导的准确性。

    ```typescript
    // 增加 length 限制，drizzle-zod 会自动生成 .max(100)
    name: varchar("name", { length: 100 }).notNull(),

    // 尽管 DB 是 varchar，但在应用层可能是 Email
    // 需要在生成 Zod Schema 后进行 refine (见后续)
    ```

2.  **分离常量定义**：
    将枚举值（如 `statusEnum`）严格定义在 `apps/type/src/common` 或 Schema 文件中，并作为 Zod Native Enum 导出，供前端下拉菜单使用。

---

## 6. 全栈业务类型组织封装 (Type Organization)

### Q5: 怎么组织封装到现在的类型项目内？

建议在 `apps/type` 内部采用 **"Schema 层"** + **"业务层"** 分层结构。

**目录结构建议**：

```text
apps/type/src/
├── schemas/                # [新增] 原始 Drizzle Table 定义 (从 admin 移入)
│   ├── common.ts
│   ├── community.ts
│   └── ...
├── business/               # [现有] 业务类型导出层
│   ├── property-manage/
│   │   └── index.ts        # 在这里将 Schema 转换为 Zod 和 TS 类型
│   └── ...
├── index.ts
└── common/
```

**封装策略**：
在 `business` 目录下，针对每个业务实体导出三种对象：

1.  **Table Schema**: `UserTable` (供后端 SQL 查询使用)
2.  **Zod Schema**: `UserSchema`, `CreateUserSchema` (供表单验证、API 校验使用)
3.  **TS Type**: `User`, `CreateUserPayload` (供组件 Props 定义使用)

---

## 7. Nitro 全栈接口集成 (Nitro Integration)

### Q7: 来自 schema 生成的业务类型，要怎么给 nitro 全栈接口使用？

Nitro 处理请求时，可以直接利用 `apps/type` 导出的 Zod Schema 进行运行时参数校验。

**服务端代码示例 (apps/admin/server/api/user/create.post.ts)**：

```typescript
import { smStaff } from "@01s-11comm/type/schemas"; // 导入 Table 用于数据库操作
import { CreateStaffSchema } from "@01s-11comm/type"; // 导入 Zod Schema 用于验证

export default defineEventHandler(async (event) => {
	// 1. 自动解析并验证 Body
	// 如果验证失败，readValidatedBody 会自动抛出 400 错误
	const body = await readValidatedBody(event, CreateStaffSchema.parse);

	// 2. 数据库操作 (类型安全：body 严格符合 smStaff 表结构)
	await db.insert(smStaff).values(body);

	return { success: true };
});
```

---

## 8. 前端类型安全保障 (Frontend Safety)

### Q8: 改造后的类型项目，要怎么确保前端的类型使用不会出现故障？

前端面临的最大风险是：数据库字段是 `nullable` 或 `date` 类型，而前端组件可能需要 `string` 或 `undefined`。

**保障措施**：

1.  **DTO (Data Transfer Object) 转换层**：
    不要直接把 DB Schema 暴露给所有组件。
    - **API 响应类型**：使用 `createSelectSchema` 生成的类型。通常后端返回的时间是 `Date` 对象还是 `ISO String`？Drizzle Driver 通常返回 Date 对象，但 JSON 序列化后是 String。
    - **处理 JSON 序列化问题**：
      由于网络传输会将 `Date` 变为 `string`，前端使用的类型应该对 Date 做特殊处理。
      ```typescript
      // 在 apps/type 中通过 z.preprocess 或 transform 处理
      export const StaffResponseSchema = createSelectSchema(smStaff, {
      	createdAt: z.string(), // 覆盖默认的 Date 类型，因为经过了 JSON 传输
      });
      ```

2.  **表单自动校验**：
    前端表单组件（如 Element Plus / Pure Admin）可以直接使用 Zod Schema 生成 rules。

    ```typescript
    import { toTypedSchema } from "@vee-validate/zod"; // 如果使用 vee-validate
    import { CreateStaffSchema } from "@01s-11comm/type";

    // 此时表单校验规则与数据库约束完全同步
    const rules = toTypedSchema(CreateStaffSchema);
    ```

3.  **严格的类型别名导出**：
    保持 `apps/type` 的 `export type` 命名不变。例如原先导出 `PatrolTaskItem`，改造后应确保依旧导出同名类型，只是其定义变成了 `z.infer<...>`。

## 9. 总结与下一步行动 (Conclusion & Next Steps)

**结论**：
该方案可行且必要。它将从根本上解决前后端类型定义不一致的问题，将开发模式从 "维护两套定义" 转变为 "维护一套 Schema，全栈自动生成"。

**下一步行动建议**：

1.  **Backups**: 备份当前 `apps/type`。
2.  **Move**: 此刻即可开始将 `apps/admin/server/db/schemas` 移动到 `apps/type/src/schemas`。
3.  **Dependencies**: 在 `apps/type` 安装 `drizzle-orm` (peerdeps 或 deps) 和 `drizzle-zod`, `zod`。
4.  **Codegen**: 编写一个简单的脚本或手动更新 `apps/type` 的导出文件。
