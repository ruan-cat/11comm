---
name: type-project-organization
description: 规范类型项目（apps/type）的代码组织方式、导出语法和文件结构。用于解决类型导出冲突、创建统一导出入口、处理重复导出等问题。适用于类型项目开发、类型错误修复、代码规范实施场景。在处理类型项目的代码写法时，请使用本技能。
allowed-tools: Read, Edit, Grep, Glob, Bash, Write
---

# 类型项目代码组织规范技能

## 技能概述

此技能提供类型项目（apps/type）的完整代码组织规范，包括导出语法、文件结构、命名约定和最佳实践。确保类型系统的一致性、可维护性和可扩展性。

## 核心规范

### 1. 全量导出语法

**必须使用全量导出，不区分类型和变量。**

**错误写法：**

```typescript
export type * from "./expense-manage";
```

**正确写法：**

```typescript
export * from "./expense-manage";
```

### 2. 禁止逐个导出

**不允许逐个罗列导出项目。**

**错误写法：**

```typescript
export type { PatrolTaskFormVO, PatrolTaskFormProps, TaskListItem, TaskQueryParams } from "./task";
```

**正确写法：**

```typescript
export * from "./task";
```

### 3. 统一导出入口

**根据业务路径，在每一层级编写 index.ts 作为统一导出入口。**

#### 3.1 根目录导出（src/index.ts）

```typescript
// apps/type/src/index.ts
// 导出通用类型
export * from "./common";
// 导出业务类型
export * from "./business";
// 导出常量
export * from "./constant";
```

#### 3.2 业务模块导出（src/business/index.ts）

```typescript
// apps/type/src/business/index.ts
/**
 * @file 业务类型统一导出
 * @description 导出所有业务模块的类型定义
 */
export * from "./dev-team";
export * from "./operation-team";
export * from "./property-manage";
export * from "./setting-manage";
```

#### 3.3 子模块导出（src/business/property-manage/index.ts）

```typescript
// apps/type/src/business/property-manage/index.ts
// 社区管理模块
export * from "./community-manage";
// 房产管理模块
export * from "./house-property-manage";
// 合同管理模块
export * from "./contract-manage";
// 费用管理模块
export * from "./expense-manage";
// 停车管理模块
export * from "./parking-manage";
// 巡检管理模块
export * from "./patrol-manage";
// 报修管理模块
export * from "./repairs-manage";
// 报表管理模块
export * from "./report-manage";
```

#### 3.4 详细模块导出（src/business/property-manage/patrol-manage/index.ts）

```typescript
// apps/type/src/business/property-manage/patrol-manage/index.ts
export * from "./detail";
export * from "./item";
export * from "./path";
export * from "./plan";
export * from "./point";
export * from "./task";
```

### 5. 导入路径必须使用相对路径（禁止路径别名）

**`apps/type` 的所有 `.ts` 源文件中，MUST 使用相对路径导入，MUST NOT 使用 `@/` 路径别名。**

**原因**：`apps/type` 作为 workspace 依赖被 `apps/admin` 等项目消费。当消费端（如 admin）通过 Vite 构建时，构建工具使用的是**消费端项目自身的 `@/` 路径别名配置**（指向 `apps/admin/src/`），而非 type 项目的配置（指向 `apps/type/src/`）。这导致 `@/common` 被错误解析为 `apps/admin/src/common`，引发构建失败。

> `apps/type/tsconfig.json` 中的 `@/* → src/*` 别名仅在独立 `tsc --noEmit` 类型检查时生效，不影响 Vite 构建。

**错误写法：**

```typescript
import { primaryId, timestamps } from "@/common";
import { someHelper } from "@/business/utils";
```

**正确写法：**

```typescript
/** 从 src/business/<domain>/schema.ts 导入 common（向上两级） */
import { primaryId, timestamps } from "../../common";

/** 从 src/business/<domain>/<module>/schema.ts 导入 common（向上三级） */
import { primaryId, timestamps } from "../../../common";
```

**相对路径深度参考表：**

|                文件位置                 | 导入 common 的相对路径 |
| :-------------------------------------: | :--------------------: |
|    `src/business/<domain>/schema.ts`    |     `../../common`     |
| `src/business/<domain>/<mod>/schema.ts` |   `../../../common`    |
|         `src/business/utils.ts`         |      `../common`       |

### 6. 重复导出处理

**遇到导出冲突时，统一整理到公共文件，避免分散导出。**

#### 6.1 公共选项统一到 business-options.ts

对于公共的下拉选项变量，统一放在：

- `apps/type/src/common/business-options.ts`

**业务选项标准：**

- 详细指南请参考 [options.md](references/options.md)。
- **英文命名**：使用 `contractTypeOptions`，禁止使用 `合同类型Options`。
- **禁止别名**：不要为了向后兼容而创建中文别名。
- **跨模块复用**：如果一个选项在超过 1 个模块中使用，请将其移动到此处。

示例：

```typescript
// apps/type/src/common/business-options.ts
/**
 * @description 审核状态选项
 * Audit status options
 */
export const auditStatusOptions: OptionsType = [
	{ label: "待审核", value: "待审核" },
	{ label: "已通过", value: "已通过" },
	{ label: "已拒绝", value: "已拒绝" },
];
```

#### 6.2 公共类型统一到 business-types.ts

对于公共的通用业务类型，统一放在：

- `apps/type/src/common/business-types.ts`

### 7. 核心基础设施配置

关于 `package.json` 和 `tsconfig.json` 的配置标准，请参考：

- [infrastructure.md](references/infrastructure.md)

## 使用场景

### 场景 1：创建新的类型文件

当创建新的业务类型时：

1. 在对应业务路径下创建 `.ts` 文件
2. 定义类型、常量和选项
3. 在同层级的 `index.ts` 中添加导出
4. 确保所有上层 `index.ts` 也包含此导出

### 场景 2：修复导出冲突

当遇到类似错误时：

```plain
模块 "./community-manage" 已导出一个名为"auditStatusOptions"的成员
```

**解决步骤：**

1. 识别重复的导出项
2. 将公共项迁移到 `apps/type/src/common/business-options.ts`
3. 在原始文件中移除重复项
4. 更新相关 index.ts 的导出

### 场景 3：重构现有类型

当重构现有类型结构时：

1. 分析当前导出结构
2. 识别可以统一的公共项
3. 重新组织文件结构
4. 更新所有相关 index.ts
5. 验证类型检查通过

## 最佳实践

### 推荐做法

- 使用 `export * from "./module"` 进行批量导出
- 为每个业务层级创建 index.ts
- 公共选项和类型统一到 common 目录
- 保持导出语句简洁明了
- **所有导入使用相对路径**（如 `../../common`），确保跨项目构建正确

### 避免做法

- 使用 `export type * from "./module"`
- 逐个列出导出项
- 在不同文件重复定义相同内容
- 使用复杂的选择性导出
- **使用 `@/` 路径别名导入**（会导致被其他项目消费时路径解析失败）

## 验证方法

### 运行类型检查

```bash
pnpm -F @01s-11comm/type typecheck
```

### 检查导出结构

```bash
# 查看导出结构
find apps/type/src -name "index.ts" -exec echo "=== {} ===" \; -exec cat {} \;
```

### 验证无重复导出

```bash
# 检查重复导出（需要手动审查）
pnpm -F @01s-11comm/type typecheck 2>&1 | grep -i "歧义\|conflict\|duplicate"
```

## 故障排除

### 问题 1：导出冲突

**症状：** TypeScript 报错提示成员重复导出

**解决方案：**

1. 识别冲突的导出项
2. 将公共项迁移到 common 目录
3. 清理重复的导出声明
4. 更新相关 index.ts

### 问题 2：找不到类型定义

**症状：** 导入类型时提示找不到

**解决方案：**

1. 检查 index.ts 是否包含对应导出
2. 验证文件路径是否正确
3. 确认类型文件是否存在
4. 检查上层 index.ts 的导出链

### 问题 3：导出链不完整

**症状：** 部分类型无法访问

**解决方案：**

1. 检查从根目录到目标文件的完整导出链
2. 确保每一层 index.ts 都包含下一层导出
3. 验证没有遗漏的中间层
4. 运行类型检查确认修复

### 问题 4：构建时路径别名解析失败（ENOENT）

**症状：** `apps/admin` 构建时报错 `Could not load .../apps/admin/src/common (imported by ../type/src/business/.../schema.ts): ENOENT`

**原因：** type 项目的源文件中使用了 `@/common` 路径别名。当 admin 项目通过 Vite 构建并解析 type 包源码时，`@/` 被解析为 admin 项目的 `src/` 目录，导致找不到文件。

**解决方案：**

1. 在 type 项目的源文件中，将 `@/` 路径别名替换为相对路径
2. 例如将 `import { primaryId } from "@/common"` 改为 `import { primaryId } from "../../common"`
3. 根据文件所在目录深度调整相对路径的 `../` 层级数
4. 运行 `pnpm -F @01s-11comm/type typecheck` 和 `pnpm build:admin` 验证修复

## 相关资源

- 类型项目目录：`apps/type/src/`
- 业务路径参考：`apps/admin/src/router/rank/rank-route-keys.ts`
- 类型错误修复：`fix-type-error` 子代理
- 基础配置：[infrastructure.md](references/infrastructure.md)
- 选项规范：[options.md](references/options.md)
