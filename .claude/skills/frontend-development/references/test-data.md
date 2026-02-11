# 测试数据参考 (Test Data Reference)

本参考文档规定了列表页面中 Mock 数据 (`test-data.ts`) 的标准。

## `test-data.ts` 核心规范 [CRITICAL]

本地 Mock 数据文件 (`test-data.ts`) **必须** 遵循以下规则：

### 1. 使用字面量数组，禁止生成器函数

**正确写法** ✅:

```typescript
export const tableData: UserListItem[] = [
	{ id: 1, name: "User A", status: "enabled" },
	{ id: 2, name: "User B", status: "disabled" },
	// ... 更多数据行
];
```

**错误写法** ❌:

```typescript
// ❌ 禁止使用生成器函数
export const tableData: UserListItem[] = Array.from({ length: 10 }, (_, i) => ({
	id: i + 1,
	name: `User ${i + 1}`,
	status: i % 2 === 0 ? "enabled" : "disabled",
}));
```

### 2. 字段对齐规范 [CRITICAL]

`test-data.ts`中的数据字段**必须**与对应页面的配置完全匹配：

- **列表配置**：与 `index.vue` 中的 `columns` 配置一致
- **搜索配置**：与 `index.vue` 中的搜索表单字段一致

#### 字段对齐检查清单

在创建或修改`test-data.ts`时，请确认：

- [ ] 所有`columns`中使用的`prop`在数据中都有对应字段
- [ ] 搜索表单中的筛选字段在数据中都存在
- [ ] 数据中的字段类型与类型定义 (`@01s-11comm/type`) 一致
- [ ] 枚举值与定义的`options`选项匹配

### 3. 下拉选项导出规范

下拉选项**必须**从同一文件导出，并使用`OptionsType`类型：

```typescript
import type { UserListItem, OptionsType } from "@01s-11comm/type";

/** 状态选项 */
export const statusOptions: OptionsType = [
	{ label: "启用", value: "enabled" },
	{ label: "禁用", value: "disabled" },
];

export const tableData: UserListItem[] = [
	{ id: 1, name: "User A", status: "enabled" },
	{ id: 2, name: "User B", status: "disabled" },
];
```

### 4. 数据量要求 [IMPORTANT]

Mock 数据**必须**包含足够的数据行以演示分页功能：

- **推荐数量**：约 **35 行**数据
- **最小数量**：至少 15 行
- **目的**：确保能够展示至少 2-3 页的分页效果

#### 为什么是 35 行？

- 默认`pageSize = 10`
- 35 行数据可以展示 4 页 (10 + 10 + 10 + 5)
- 足以测试"首页"、"上一页"、"下一页"、"末页"等分页功能

## make-list-page 约束

当使用`.claude/agents/make-list-page.md`代理生成列表页时，**必须**确保生成的`test-data.ts`满足以下约束：

1.  `tableData`使用字面量数组定义
2.  字段与列表/搜索配置完全一致
3.  下拉选项使用`OptionsType`并集中在同一文件
4.  数据量覆盖典型分页演示（约 35 条）

## 完整示例

```typescript
/**
 * @file 用户管理测试数据
 * @description User management test data
 */

import type { UserListItem, OptionsType } from "@01s-11comm/type";

/** 用户状态选项 */
export const statusOptions: OptionsType = [
	{ label: "启用", value: "enabled" },
	{ label: "禁用", value: "disabled" },
];

/** 用户角色选项 */
export const roleOptions: OptionsType = [
	{ label: "管理员", value: "admin" },
	{ label: "普通用户", value: "user" },
];

/** 用户列表测试数据 */
export const tableData: UserListItem[] = [
	{
		id: 1,
		name: "张三",
		username: "zhangsan",
		role: "admin",
		status: "enabled",
		createTime: "2024-01-01 09:00:00",
		updateTime: "2024-01-15 14:30:00",
	},
	{
		id: 2,
		name: "李四",
		username: "lisi",
		role: "user",
		status: "enabled",
		createTime: "2024-01-02 10:00:00",
		updateTime: "2024-01-16 15:30:00",
	},
	// ... 继续添加至约35条数据
	{
		id: 35,
		name: "王五35",
		username: "wangwu35",
		role: "user",
		status: "disabled",
		createTime: "2024-02-05 16:00:00",
		updateTime: "2024-02-20 09:30:00",
	},
];
```

## 常见错误与修复

### 错误 1：使用生成器函数

**问题**：

```typescript
export const tableData = Array.from({ length: 50 }, (_, i) =>  ({ id: i + 1, ... }));
```

**修复**：手动编写字面量数组。

### 错误 2：字段不匹配

**问题**：列表中使用`prop="userName"`，但数据中是`username`。

**修复**：统一字段命名，确保大小写和拼写一致。

### 错误 3：选项未导出

**问题**：在 Vue 组件中重新定义了`statusOptions`。

**修复**：从`test-data.ts`导出并导入使用。

### 错误 4：数据量不足

**问题**：只有 5 行数据，无法测试分页。

**修复**：补充至约 35 行数据。
