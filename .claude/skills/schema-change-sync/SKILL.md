---
name: schema-change-sync
description: 数据库 Schema 变更时的全项目同步检查清单。当修改 apps/type 中 schema.ts 的表字段、新增数据库表、或删除表时，使用此技能确保类型项目、数据库迁移、后端接口、前端页面、种子数据和技能文档全部同步更新，避免遗漏。
---

# Schema 变更同步 (Schema Change Sync)

## 1. 适用场景

当 `apps/type/src/business/**/schema.ts` 发生以下变更时，**必须**按本清单逐项检查并同步：

- **场景 A**: 现有表新增/删除/重命名字段
- **场景 B**: 新增数据库表
- **场景 C**: 删除数据库表

## 2. 同步检查清单

复制此清单跟踪进度：

```plain
Schema 变更同步进度：
- [ ] 1. Schema 文件 (Trinity Pattern)
- [ ] 2. 导出链完整性
- [ ] 3. 前端业务类型
- [ ] 4. 数据库迁移
- [ ] 5. 技能文档
- [ ] 6. 后端 API 接口
- [ ] 7. 种子数据
- [ ] 8. 前端列表页面
- [ ] 9. 前端表单组件
- [ ] 10. 前端 API Hook
```

### 2.1. Schema 文件 (Trinity Pattern)

**文件**: `apps/type/src/business/{domain}/{module}/schema.ts`

Schema 文件必须同时更新三个部分：

|  部分  |                内容                |                            示例                            |
| :----: | :--------------------------------: | :--------------------------------------------------------: |
| Part A |         Drizzle Table 定义         |           `pgTable("dt_cache_configs", { ... })`           |
| Part B | Zod Schemas (insert/select/update) |  `insertDtCacheConfigSchema`, `updateDtCacheConfigSchema`  |
| Part C |          TypeScript Types          | `DtCacheConfig`, `NewDtCacheConfig`, `UpdateDtCacheConfig` |

**注意**: update schema 手动使用 `z.object({...})`，新增字段需要手动添加对应的 optional 字段。

### 2.2. 导出链完整性

**仅新增表时需要**。确保从 schema.ts 到 `src/index.ts` 的完整导出链：

```plain
schema.ts → module/index.ts → domain/index.ts → business/index.ts → src/index.ts
```

每一层 `index.ts` 必须包含 `export * from "./xxx";`。

### 2.3. 前端业务类型（Schema 驱动）

> **重要**: 前端业务类型应从 Schema 推导生成，详见第 6 节规范。

**文件**: `apps/type/src/business/{domain}/{module}/schema.ts` 的 **Part C**

| 类型             | 生成位置         | 说明           |
| :--------------- | :--------------- | :------------- |
| `XxxListItem`    | schema.ts Part C | 列表页每行数据 |
| `XxxQueryParams` | schema.ts Part C | 搜索/筛选参数  |
| `XxxFormVO`      | schema.ts Part C | 表单数据对象   |
| Options 常量     | schema.ts Part C | 下拉选项       |

**迁移状态**: 存量独立 .ts 文件中的 Interface 类型应逐步迁移到 schema.ts（见 6.6 节）。

### 2.4. 数据库迁移

```bash
pnpm -F @01s-11comm/admin db:generate
```

检查生成的 `apps/admin/drizzle/xxxx_*.sql` 迁移文件内容是否正确。

### 2.5. 技能文档

|                              文件                               |                        更新内容                        |
| :-------------------------------------------------------------: | :----------------------------------------------------: |
|             `.claude/skills/neon-db-list/SKILL.md`              | 新增表: 添加条目；修改字段: 更新备注；删除表: 移除条目 |
| `.claude/skills/project-schema-registry/references/{domain}.md` |              更新对应领域的 Scenario 描述              |

### 2.6. 后端 API 接口

**文件**: `apps/admin/server/api/{业务路径}/*.ts`

|         变更点          |                                   说明                                    |
| :---------------------: | :-----------------------------------------------------------------------: |
| 列表接口 `list.post.ts` | select 查询包含新字段；映射函数处理字段名差异；querySchema 包含新筛选参数 |
|      新增/更新接口      |               `readValidatedBody` 使用的 Zod schema 已更新                |
|        新增表时         |           创建完整的 CRUD 接口文件 (list/create/update/delete)            |

### 2.7. 种子数据

**文件**: `apps/admin/server/db/seed-sql/{module}.ts`

- 导入 Mock 数据源
- 建立中文标签→英文枚举值的映射表（见第 3 节）
- 编写 `db.insert(table).values(records).toSQL()` 生成逻辑

### 2.8. 前端列表页面

**文件**: `apps/admin/src/pages/{业务路径}/index.vue`

|        变更点        |         说明         |
| :------------------: | :------------------: |
|      `columns`       | 表格列配置包含新字段 |
| `plusSearchColumns`  | 搜索栏包含新筛选条件 |
| `plusSearchModelRef` | 搜索默认值包含新字段 |

### 2.9. 前端表单组件

**文件**: `apps/admin/src/pages/{业务路径}/components/form.ts` + `form.vue`

|    文件    |                             变更点                             |
| :--------: | :------------------------------------------------------------: |
| `form.ts`  |                 `defaultForm` 包含新字段默认值                 |
| `form.vue` | `plusFormColumns` 包含新表单项；`plusFormRules` 包含新校验规则 |

### 2.10. 前端 API Hook

**文件**: `apps/admin/src/api/{业务路径}/index.ts`

- 修改字段时: 通常无需更改（Hook 透传参数）
- 新增表时: 创建 `useXxxListQuery` Hook

## 3. 字段名映射规范

### 3.1. DB 字段与前端类型字段的常见差异

后端 API 的映射函数需处理以下差异：

|  差异类型  | DB 字段 (Drizzle)  |  前端字段 (ListItem)   |
| :--------: | :----------------: | :--------------------: |
|    主键    |        `id`        | `xxxId` (如 `cacheId`) |
|  创建时间  | `createdAt` (Date) | `createTime` (string)  |
|  更新时间  | `updatedAt` (Date) | `updateTime` (string)  |
| 语义重命名 | `refreshStrategy`  |    `refreshPolicy`     |

日期格式化统一为 `YYYY-MM-DD HH:mm:ss`。

### 3.2. 枚举值映射规范

|  存储层  |              格式               |            示例            |
| :------: | :-----------------------------: | :------------------------: |
|  数据库  | 英文枚举值 (options 的 `value`) | `"enabled"`, `"scheduled"` |
| 前端展示 |  中文标签 (options 的 `label`)  |   `"启用"`, `"定时刷新"`   |

种子数据如果来自 Mock（使用中文标签），**必须**建立 label→value 映射表：

```typescript
const statusMap: Record<string, string> = {
	启用: "enabled",
	禁用: "disabled",
	维护中: "maintenance",
};
```

## 4. 场景速查表

### 4.1. 场景 A: 现有表新增字段

| 序号 |           检查项           |  必须  |
| :--: | :------------------------: | :----: |
|  1   | Schema 文件 Part A + B + C |   是   |
|  2   |  数据库迁移 `db:generate`  |   是   |
|  3   |        技能文档更新        |   是   |
|  4   |     后端 API 映射函数      |   是   |
|  5   |        前端业务类型        | 视情况 |
|  6   |          种子数据          | 视情况 |
|  7   |       前端列表/表单        | 视情况 |

### 4.2. 场景 B: 新增数据库表

全部 10 项检查项**均为必须**。额外注意：

- 导出链完整性（2.2）
- 创建完整 CRUD 接口（2.6）
- 创建前端 API Hook（2.10）

## 5. 实战示例

参考 `apps/admin/src/docs/reports/2026-02-13-schema-sync-progress.md`，记录了 `dtCacheConfigs` 表新增 5 个字段时的完整同步过程，涉及 7 类文件共 15 个文件的同步更改。

## 6. 前端业务类型生成规范（Schema 驱动）

> **迁移目标**: 逐步用 Schema 驱动的类型替换独立 Interface 文件中的类型，实现单一事实来源。

### 6.1. 类型体系架构

项目类型分为两个层次：

|    层次    | 类型名称                                     | 来源               | 示例                                |
| :--------: | :------------------------------------------- | :----------------- | :---------------------------------- |
| **DB 层**  | `Xxx`, `NewXxx`, `UpdateXxx`                 | schema.ts Part C   | `DtCacheConfig`, `NewDtCacheConfig` |
| **前端层** | `XxxListItem`, `XxxQueryParams`, `XxxFormVO` | **从 Schema 推导** | `DtCacheConfigListItem`             |

### 6.2. Schema 驱动的类型推导公式

在 `schema.ts` 的 **Part C** 中，除了生成 DB 类型外，还需要生成前端业务类型。推导公式如下：

#### 6.2.1. ListItem 类型推导

```typescript
// 从 Select 类型推导，移除系统字段，转换时间格式
export type DtCacheConfigListItem = Omit<DtCacheConfig, "createdAt" | "updatedAt" | "deletedAt"> & {
	createTime: string; // 从 createdAt 转换
	updateTime: string; // 从 updatedAt 转换
};
```

**推导规则**：

- 移除 `deletedAt`（软删除字段不展示）
- 将 `createdAt: Date` 转换为 `createTime: string`
- 将 `updatedAt: Date` 转换为 `updateTime: string`
- 主键 `id` 保留（无需转换为 `xxxId`，除非业务需要）

#### 6.2.2. QueryParams 类型推导

```typescript
// 继承分页参数，添加业务筛选字段
export interface DtCacheConfigQueryParams extends BaseListQueryParams {
	/** 缓存名称（模糊搜索） */
	cacheName?: string;
	/** 缓存类型 */
	cacheType?: string;
	/** 状态 */
	status?: string;
}
```

**推导规则**：

- 必须继承 `BaseListQueryParams`（包含 `pageIndex`, `pageSize`）
- 业务筛选字段从 Table 的可筛选列推导
- 使用可选字段（`?`）

#### 6.2.3. FormVO 类型推导

```typescript
// 基于 Insert 类型，添加展示用字段
export interface DtCacheConfigFormVO {
	/** 缓存编码 */
	cacheCode: string;
	/** 缓存名称 */
	cacheName: string;
	/** 缓存键 */
	cacheKey: string;
	/** 缓存类型 */
	cacheType?: string;
	/** 缓存分组 */
	cacheGroup?: string;
	/** 过期时间（秒） */
	expireTime?: number;
	/** 缓存描述 */
	description?: string;
	/** 刷新策略 */
	refreshStrategy?: string;
	/** 状态 */
	status?: string;
}
```

**推导规则**：

- 基于 `NewXxx` 类型
- 必填字段保留原类型
- 可选字段使用 `?`
- 不包含 `id`, `createdAt`, `updatedAt`

### 6.3. 字段映射规范

#### 6.3.1. 系统字段映射表

| DB 字段     | 前端字段     | 转换规则                                        |
| :---------- | :----------- | :---------------------------------------------- |
| `id`        | `id`         | 保持不变                                        |
| `createdAt` | `createTime` | `Date` → `string` (格式: `YYYY-MM-DD HH:mm:ss`) |
| `updatedAt` | `updateTime` | `Date` → `string` (格式: `YYYY-MM-DD HH:mm:ss`) |
| `deletedAt` | -            | **移除**（不展示）                              |
| `remark`    | `remark`     | 保持不变                                        |

#### 6.3.2. 自定义字段映射

对于需要语义化重命名的字段，在 schema.ts 中使用 **类型断言** 或 **交叉类型**：

```typescript
// 示例：主键语义化映射
export type PtPatrolTaskListItem = Omit<PtPatrolTask, "id"> & {
	/** 任务ID */
	taskId: string;
};
```

### 6.4. 在 schema.ts 中生成前端类型

完整的 **Part C** 应该包含以下内容：

```typescript
// ==========================================
// Part C: TypeScript Types
// ==========================================

// --- DB 层类型 ---
export type DtCacheConfig = typeof dtCacheConfigs.$inferSelect;
export type NewDtCacheConfig = typeof dtCacheConfigs.$inferInsert;
export type UpdateDtCacheConfig = z.infer<typeof updateDtCacheConfigSchema>;

// --- 前端层类型（Schema 驱动） ---

/** 缓存配置列表数据 */
export type DtCacheConfigListItem = Omit<DtCacheConfig, "createdAt" | "updatedAt" | "deletedAt"> & {
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
};

/** 缓存配置查询参数 */
export interface DtCacheConfigQueryParams extends BaseListQueryParams {
	/** 缓存名称 */
	cacheName?: string;
	/** 缓存类型 */
	cacheType?: string;
	/** 状态 */
	status?: string;
}

/** 缓存配置表单数据 */
export interface DtCacheConfigFormVO {
	/** 缓存编码 */
	cacheCode: string;
	/** 缓存名称 */
	cacheName: string;
	/** 缓存键 */
	cacheKey: string;
	/** 缓存类型 */
	cacheType?: string;
	/** 缓存分组 */
	cacheGroup?: string;
	/** 过期时间（秒） */
	expireTime?: number;
	/** 缓存描述 */
	description?: string;
	/** 刷新策略 */
	refreshStrategy?: string;
	/** 状态 */
	status?: string;
}
```

### 6.5. Options 常量生成

对于枚举类型字段，使用 Zod Schema 的枚举值生成 Options：

```typescript
// --- Options 常量 ---

/** 缓存类型选项 */
export const dtCacheConfigTypeOptions: OptionsType = [
	{ label: "内存", value: "memory" },
	{ label: "Redis", value: "redis" },
	{ label: "本地", value: "local" },
];

/** 状态选项 */
export const dtCacheConfigStatusOptions: OptionsType = [
	{ label: "启用", value: "enabled" },
	{ label: "禁用", value: "disabled" },
	{ label: "维护中", value: "maintenance" },
];
```

**生成规则**：

- 从 Zod Schema 的 `.enum()` 推导
- 中文 `label` 需要人工补充
- 存储在 schema.ts 文件内（不再放在独立的 .ts 文件）

### 6.6. 迁移流程

#### 6.6.1. 迁移阶段划分

| 阶段        | 目标                | 操作                                  |
| :---------- | :------------------ | :------------------------------------ |
| **Phase 1** | 新增 Schema 时      | 直接在 schema.ts 中生成前端类型       |
| **Phase 2** | 存量 Interface 文件 | 逐步将前端类型迁移到 schema.ts        |
| **Phase 3** | 清理独立文件        | 删除已迁移的独立 .ts 文件中的重复类型 |

#### 6.6.2. Phase 1: 新增 Schema 时的操作步骤

**步骤 1**: 在 schema.ts Part C 中生成 DB 层类型

```typescript
export type DtCacheConfig = typeof dtCacheConfigs.$inferSelect;
export type NewDtCacheConfig = typeof dtCacheConfigs.$inferInsert;
export type UpdateDtCacheConfig = z.infer<typeof updateDtCacheConfigSchema>;
```

**步骤 2**: 推导并生成前端层类型

```typescript
// ListItem: 移除系统字段，转换时间格式
export type DtCacheConfigListItem = Omit<DtCacheConfig, "createdAt" | "updatedAt" | "deletedAt"> & {
	createTime: string;
	updateTime: string;
};

// QueryParams: 继承 BaseListQueryParams
export interface DtCacheConfigQueryParams extends BaseListQueryParams {
	cacheName?: string;
	cacheType?: string;
	status?: string;
}

// FormVO: 基于 NewXxx，可选化
export type DtCacheConfigFormVO = Partial<NewDtCacheConfig> &
	Pick<NewDtCacheConfig, "cacheCode" | "cacheName" | "cacheKey">;
```

**步骤 3**: 导入必要的类型

```typescript
import type { BaseListQueryParams, OptionsType } from "../../../common";
```

**步骤 4**: 更新导出链

确保 `module/index.ts` 正确导出：

```typescript
export * from "./schema";
```

#### 6.6.3. Phase 2: 存量迁移操作步骤

**目标**: 将独立 .ts 文件中的 Interface 类型迁移到 schema.ts

**步骤 1**: 识别需要迁移的模块

```plain
现有独立 Interface 文件:
├── community-manage/
│   ├── notice.ts        → 迁移到 schema.ts Part C
│   ├── schema.ts
│   └── index.ts
├── patrol-manage/
│   ├── task.ts          → 迁移到 schema.ts Part C
│   ├── plan.ts
│   ├── schema.ts
│   └── index.ts
```

**步骤 2**: 在 schema.ts 中添加前端类型

参考 "6.4. 在 schema.ts 中生成前端类型" 添加类型定义。

**步骤 3**: 更新前端引用

在需要使用的地方，从 schema.ts 导入：

```typescript
// 旧写法（独立文件）
import type { PatrolTaskListItem, PatrolTaskQueryParams } from "./task";

// 新写法（Schema 驱动）
import type { PtPatrolTaskListItem, PtPatrolTaskQueryParams } from "../patrol-manage/schema";
```

**步骤 4**: 运行类型检查

```bash
pnpm -F @01s-11comm/type typecheck
```

**步骤 5**: 确认无类型错误后，标记旧文件为废弃

在独立 .ts 文件顶部添加废弃注释：

```typescript
/**
 * @deprecated 请从 schema.ts 导入 PtPatrolTaskListItem 类型
 * 此文件将在 Phase 3 中删除
 */
```

#### 6.6.4. Phase 3: 清理独立文件

当所有前端引用都迁移到 schema.ts 后：

1. **删除废弃的独立类型定义**
2. **保留必要的业务逻辑函数**（如 `noticeListDataToFormData`）
3. **更新导出链**

### 6.7. 迁移检查清单

```plain
前端业务类型迁移进度：
- [ ] 1. 在 schema.ts Part C 中生成 DB 层类型
- [ ] 2. 在 schema.ts Part C 中生成前端层类型（ListItem/QueryParams/FormVO）
- [ ] 3. 导入 BaseListQueryParams 和 OptionsType
- [ ] 4. 生成 Options 常量
- [ ] 5. 迁移类型别名（如 NoticeType、枚举类型）
- [ ] 6. 迁移业务逻辑函数（如 noticeListDataToFormData）
- [ ] 7. 处理继承关系（如 PatrolTaskListItem extends TaskListItem）
- [ ] 8. 更新后端 API 映射函数（mapToListItem）
- [ ] 9. 更新前端引用（form.ts、hooks、composables、Vue 组件）
- [ ] 10. 运行类型检查确认无错误
- [ ] 11. 标记旧文件为 @deprecated
- [ ] 12. 清理废弃的独立类型定义
```

### 6.8. 常见问题处理

#### Q1: 字段名需要语义化重命名怎么办？

**问题**: Schema 的 `id` 字段在前端需要显示为 `taskId`

**解决**: 使用交叉类型覆盖

```typescript
export type PtPatrolTaskListItem = Omit<PtPatrolTask, "id"> & {
	taskId: string;
};
```

#### Q2: 前端只需要部分字段怎么办？

**问题**: ListItem 不需要 Schema 的所有字段

**解决**: 使用 `Pick` 或 `Omit`

```typescript
export type DtCacheConfigListItem = Pick<DtCacheConfig, "id" | "cacheCode" | "cacheName" | "cacheType" | "status"> & {
	createTime: string;
	updateTime: string;
};
```

#### Q3: 如何处理继承关系（如 PatrolTaskListItem extends TaskListItem）？

**问题**: 现有代码使用 `PatrolTaskListItem extends TaskListItem`

**解决**: 迁移后改为独立定义，消除继承依赖

```typescript
// 旧写法（独立文件）
export interface TaskListItem {
	id: string;
	name: string;
	status: string;
	createTime: string;
}

export interface PatrolTaskListItem extends TaskListItem {
	taskCode: string;
	patrolPlan: string;
}

// 新写法（Schema 驱动）- 全部独立定义，不依赖继承
export interface PtPatrolTaskListItem {
	id: string;
	taskCode: string;
	taskName: string;
	patrolPlan: string;
	status: string;
	createTime: string;
	updateTime: string;
}
```

**注意**: 继承关系会使类型推导复杂化，迁移后应使用独立定义。

#### Q4: 类型别名（如 NoticeType、MenuItemType）如何迁移？

**问题**: 独立文件中定义了类型别名

```typescript
// 独立文件中
export type NoticeType = "notification" | "announcement" | "reminder";
export type MenuItemType = "catalog" | "menu" | "button";
```

**解决**: 迁移到 schema.ts 的 Part C

```typescript
// schema.ts Part C
/** 公告类型 */
export type NoticeType = "notification" | "announcement" | "reminder" | "activity" | "maintenance" | "safety";

/** 菜单项类型 */
export type MenuItemType = "catalog" | "menu" | "button" | "interface";
```

#### Q5: 业务逻辑函数（如 noticeListDataToFormData）如何处理？

**问题**: 独立文件中存在数据转换函数

```typescript
// 独立文件中
export function noticeListDataToFormData(listData: CommunityNoticeListItem): CommunityNoticeFormVO {
	return {
		noticeTitle: listData.noticeTitle,
		// ...
	};
}
```

**解决**: 保留在独立文件中，不强制迁移到 schema.ts

- 业务逻辑函数（如数据转换、格式化）可以保留在独立文件
- 函数参数和返回值类型改为从 schema.ts 导入

```typescript
// 保留在独立文件中，但更新类型引用
import type { CmNoticeListItem, CmNoticeFormVO } from "./schema";

export function noticeListDataToFormData(listData: CmNoticeListItem): CmNoticeFormVO {
	return {
		noticeTitle: listData.noticeTitle,
		// ...
	};
}
```

#### Q6: 后端 API 映射函数需要更新吗？

**问题**: 当 ListItem 类型变化时，后端的映射函数也需要更新

**解决**: 检查并更新后端 API 的映射函数

```typescript
// 后端 API 中的映射函数
function mapToListItem(row: CmNotice): CmNoticeListItem {
	return {
		...row,
		createTime: row.createdAt ? format(row.createdAt, "yyyy-MM-dd HH:mm:ss") : "",
		updateTime: row.updatedAt ? format(row.updatedAt, "yyyy-MM-dd HH:mm:ss") : "",
	};
}
```

**注意**: 当 Schema 字段变化时，映射函数需要同步更新。

#### Q7: 前端引用范围有哪些？

**问题**: 需要更新哪些文件的引用？

**解决**: 检查以下位置的类型引用

| 位置        | 文件类型           | 示例                     |
| :---------- | :----------------- | :----------------------- |
| 表单组件    | `form.ts`          | `defaultForm: XxxFormVO` |
| 列表页面    | `index.vue`        | `columns` 配置           |
| API Hooks   | `api/xxx/index.ts` | 返回值类型               |
| Composables | `composables/*.ts` | 参数/返回值类型          |
| 其他组件    | `components/*.vue` | Props 类型               |

**迁移步骤**:

1. 搜索所有使用旧类型的地方
2. 将导入路径从 `./task` 改为从 `./schema` 导入
3. 运行类型检查确认无错误

```typescript
export type DtCacheConfigListItem = Pick<DtCacheConfig, "id" | "cacheCode" | "cacheName" | "cacheType" | "status"> & {
	createTime: string;
	updateTime: string;
};
```

#### Q3: FormVO 需要额外的展示字段怎么办？

**问题**: 表单需要显示关联名称（如 `communityName`），但 Schema 只有 `communityId`

**解决**: 使用交叉类型扩展

```typescript
export interface CmNoticeFormVO extends Omit<NewCmNotice, "communityId"> {
	/** 社区名称（展示用） */
	communityName?: string;
	communityId?: string;
}
```

#### Q4: 如何处理日期格式转换？

**问题**: DB 返回 `Date` 类型，前端需要 `string`

**解决**: 在后端 API 的映射函数中处理

```typescript
function mapToListItem(row: CmNotice): CmNoticeListItem {
	return {
		...row,
		createTime: row.createdAt ? format(row.createdAt, "yyyy-MM-dd HH:mm:ss") : "",
		updateTime: row.updatedAt ? format(row.updatedAt, "yyyy-MM-dd HH:mm:ss") : "",
	};
}
```

### 6.9. 迁移示例：dtCacheConfigs

以 `dtCacheConfigs` 为例，展示完整的迁移过程：

**迁移前**（独立文件）:

```typescript
// apps/type/src/business/setting-manage/dictionary-manage/cache-config.ts (已废弃)
export interface DtCacheConfigListItem {
	cacheId: string;
	cacheCode: string;
	cacheName: string;
	// ...
}
```

**迁移后**（Schema 驱动）:

```typescript
// apps/type/src/business/setting-manage/dictionary-manage/schema.ts Part C

// DB 层类型
export type DtCacheConfig = typeof dtCacheConfigs.$inferSelect;
export type NewDtCacheConfig = typeof dtCacheConfigs.$inferInsert;
export type UpdateDtCacheConfig = z.infer<typeof updateDtCacheConfigSchema>;

// 前端层类型（新增）
export type DtCacheConfigListItem = Omit<DtCacheConfig, "createdAt" | "updatedAt" | "deletedAt"> & {
	createTime: string;
	updateTime: string;
};

export interface DtCacheConfigQueryParams extends BaseListQueryParams {
	cacheName?: string;
	cacheType?: string;
	status?: string;
}

export type DtCacheConfigFormVO = Partial<NewDtCacheConfig>;

// Options 常量（新增）
export const dtCacheConfigStatusOptions: OptionsType = [
	{ label: "启用", value: "enabled" },
	{ label: "禁用", value: "disabled" },
	{ label: "维护中", value: "maintenance" },
];
```

**前端引用更新**:

```typescript
// 旧
import type { DtCacheConfigListItem } from "./cache-config";

// 新
import type { DtCacheConfigListItem } from "@01s-11comm/type/setting-manage/dictionary-manage/schema";
```

## 7. 迁移状态追踪

记录各模块的迁移进度：

| 模块              | 状态      | 备注                  |
| :---------------- | :-------- | :-------------------- |
| dictionary-manage | ✅ 完成   | dtCacheConfigs 已迁移 |
| community-manage  | 🔄 进行中 | notice.ts 迁移中      |
| patrol-manage     | ⏳ 待开始 | task/plan/path 待迁移 |
| ...               | ⏳ 待开始 | -                     |

---

> **迁移原则**: 渐进式迁移，每次只处理一个模块，确保类型检查通过后再处理下一个模块。
