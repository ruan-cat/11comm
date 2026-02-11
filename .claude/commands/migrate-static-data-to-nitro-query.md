> **[DEPRECATED - Schema First Required]**
>
> **This command promotes a static interface-based workflow that conflicts with the new Schema-First architecture.**
>
> **New Requirement**: All type definitions must be created as **Zod Schemas + Drizzle Tables** in `apps/type/src/business/**/schema.ts`, NOT as static TypeScript interfaces.
>
> **指向新工作流**:
>
> - Design: `openspec/changes/full-stack-type-transformation/design.md`
> - Schema First 规范: 待创建
>
> **关键变更**:
>
> - ❌ Step 1: 不再创建 `{Page}ListItem` interface
> - ✅ Step 1: 应创建 `pgTable` + `createInsertSchema` (Zod)
> - ❌ Mock 数据: 不再使用静态 TypeScript 类型
> - ✅ Mock 数据: 使用 Drizzle Schema 推导的类型
>
> **在新架构下，请勿使用此指令。等待 Schema First 迁移指令发布。**

---

# migrate-static-data-to-nitro-query

将静态数据列表页迁移到 Nitro Query 模式的专用命令。

## 命令说明

此命令用于处理在 openspec 任务执行过程中遗漏的列表页面（"漏网之鱼"），将其从静态数据模式迁移到基于 Nitro + TanStack Query 的现代数据获取模式。

## 使用方法

```bash
/migrate-static-data-to-nitro-query <业务路径> <页面名称>
```

### 参数说明

- `<业务路径>`: 三级路由路径，格式如 `propertyManage.expenseManage.waterAndElectricityMeterReading`
- `<页面名称>`: 页面英文名称，格式如 `WaterAndElectricityMeterReading`

### 使用示例

```bash
/migrate-static-data-to-nitro-query propertyManage.expenseManage.waterAndElectricityMeterReading WaterAndElectricityMeterReading
```

---

## 核心原则（必须严格遵守）

### 最高原则

**只负责类型替换和变量名替换，不删改现有业务逻辑**

这是整个迁移工程的铁律。迁移过程中：

- ✅ 允许：中文变量名 → 英文变量名
- ✅ 允许：中文类型名 → 英文类型名
- ✅ 允许：`cloneDeep` → `structuredClone`
- ✅ 允许：添加新的数据获取逻辑（Hook）
- ✅ 允许：删除旧的 loadTableData 函数
- ❌ 禁止：修改或删除表单逻辑
- ❌ 禁止：修改或删除弹框逻辑
- ❌ 禁止：修改或删除业务函数
- ❌ 禁止：修改或删除验证逻辑

### 五个必须（CRITICAL）

1. **必须创建英文类型定义**
   - 所有字段名必须是英文驼峰命名
   - 每个字段必须有 JSDoc 注释：`/** 中文 English */`
   - 类型名格式：`{Page}ListItem`, `{Page}QueryParams`

2. **必须使用 Nitro v3 语法**

   ```typescript
   // ✅ 正确
   import { defineHandler, readBody } from "nitro/h3";
   export default defineHandler(async (event): Promise<JsonVO<PageDTO<T>>> => {
   	// ...
   });

   // ❌ 错误
   import { defineEventHandler, readBody } from "h3";
   export default defineEventHandler(async (event) => {
   	// ...
   });
   ```

3. **必须使用 filterDataByQuery 工具**

   ```typescript
   // ✅ 正确
   import { filterDataByQuery } from "server/utils/filter-data";
   const filteredData = filterDataByQuery(mockData, filters);

   // ❌ 错误 - 手动编写 filter 逻辑
   const filteredData = mockData.filter((item) => {
   	if (filters.name && !item.name.includes(filters.name)) return false;
   	return true;
   });
   ```

4. **必须给 API Hook 提供 initialParams**

   ```typescript
   // ✅ 正确
   export function useWaterMeterListQuery(initialParams: Partial<WaterMeterQueryParams>) {
   	return useListQuery<WaterMeterListItem, WaterMeterQueryParams>({
   		queryKeyPrefix: "water-meter-list",
   		apiUrl: "/api/property-manage/expense-manage/water-meter/list",
   		initialParams, // ✅ 必须传递
   	});
   }

   // ❌ 错误 - 没有 initialParams 参数
   export function useWaterMeterListQuery() {
   	return useListQuery<WaterMeterListItem, WaterMeterQueryParams>({
   		queryKeyPrefix: "water-meter-list",
   		apiUrl: "/api/property-manage/expense-manage/water-meter/list",
   	});
   }
   ```

5. **必须使用固定的搜索函数写法**

   ```typescript
   // ✅ 正确
   function handleReSearch() {
   	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
   	resetParams();
   }

   function handleSearch() {
   	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
   }

   // ❌ 错误 - 使用 cloneDeep
   function handleReSearch() {
   	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
   	doFetch();
   }
   ```

### 三个严禁（CRITICAL）

1. **严禁创建中文类型别名**

   ```typescript
   // ❌ 绝对禁止
   export type 巡检方式 = PatrolMethodType;
   export type 停车场表单_VO = ParkingLotFormVO;
   export const 费用类型 = contractTypeOptions;

   // ✅ 正确 - 直接使用英文类型
   export type PatrolMethodType = "manual" | "automatic";
   export type ParkingLotFormVO = {
   	/* ... */
   };
   export const feeTypeOptions = contractTypeOptions;
   ```

2. **严禁删除现有业务逻辑**

   必须保留的内容清单：
   - ✅ `useMode()` 和相关变量
   - ✅ `useToggle()` 和相关变量
   - ✅ `testAsync()` 函数
   - ✅ 表单实例代码（如 `ParkingLotFormInstance`）
   - ✅ `openDialog` 的完整按钮配置（取消、重置、提交）
   - ✅ `useDoBeforeClose` 调用
   - ✅ `const formComputed` 变量
   - ✅ `const props` 和 `const defaultValues`
   - ✅ 所有业务相关的计算属性
   - ✅ 所有业务相关的方法（新增、编辑、删除、导出等）

3. **严禁编写脚本批量处理**

   禁止使用以下方式：
   - ❌ Python 脚本进行正则替换
   - ❌ TypeScript/JavaScript 脚本批量修改
   - ❌ Bash 脚本批量删改

   必须：
   - ✅ 逐文件阅读并理解代码逻辑
   - ✅ 基于语义理解进行手工改写
   - ✅ 每个文件都要经过人工审核

---

## 完整迁移流程（8 步）

### Step 1: 创建类型定义文件（15 分钟）🔴 CRITICAL

**目标路径计算规则**：

```plain
业务路径: propertyManage.expenseManage.waterAndElectricityMeterReading
↓ 转换规则：
1. 去掉最后一段（页面级）
2. 第一段转 kebab-case: propertyManage → property-manage
3. 第二段转 kebab-case: expenseManage → expense-manage
↓ 结果
类型文件路径: apps/type/src/business/property-manage/expense-manage/{page}.ts
```

**文件内容模板**：

```typescript
/**
 * @file {页面中文名} 列表页类型定义
 * @description {Page} list page type definitions
 */

import type { BaseListQueryParams } from "../../../common";

/** {中文字段说明} {English field description} */
export type {Page}StatusType = "pending" | "approved" | "rejected";

/** {中文字段说明} {English field description} */
export interface {Page}ListItem {
  /** 主键 ID Primary key */
  id: string;

  /** 名称 Name */
  name: string;

  /** 状态 Status */
  status: {Page}StatusType;

  /** 创建时间 Create time */
  createTime: string;

  /** 更新时间 Update time */
  updateTime: string;

  /** 备注 Remarks */
  remarks?: string;
}

/** {中文字段说明} {English field description} */
export interface {Page}QueryParams extends BaseListQueryParams {
  /** 名称 Name */
  name?: string;

  /** 状态 Status */
  status?: {Page}StatusType;

  /** 开始日期 Start date */
  startDate?: string;

  /** 结束日期 End date */
  endDate?: string;
}

/** {中文字段说明} {English field description} */
export const {page}StatusOptions: OptionsType = [
  { label: "待审核", value: "pending" },
  { label: "已通过", value: "approved" },
  { label: "已拒绝", value: "rejected" },
];
```

**必须检查项**：

- [ ] 所有字段名是英文驼峰命名
- [ ] 每个字段都有 JSDoc 注释（中文 + English）
- [ ] 接口名符合 `{Page}ListItem` 和 `{Page}QueryParams` 格式
- [ ] QueryParams 继承 `BaseListQueryParams`
- [ ] 没有任何中文类型别名
- [ ] 没有任何中文变量别名
- [ ] Options 类型约束为 `OptionsType`

**验收标准**：

```bash
pnpm -F @01s-11comm/type typecheck
# 必须无报错
```

---

### Step 2: 创建 Mock 数据文件（10 分钟）🟡 IMPORTANT

**目标路径计算规则**：

```plain
业务路径: propertyManage.expenseManage.waterAndElectricityMeterReading
↓ 转换规则：
1. 去掉最后一段（页面级）
2. 全部转 kebab-case
↓ 结果
Mock 文件路径: apps/admin/server/api/property-manage/expense-manage/{page}/mock-data.ts
```

**文件内容模板**：

```typescript
/**
 * @file {页面中文名} Mock 数据
 * @description {Page} mock data for development
 */

import type { {Page}ListItem } from "@01s-11comm/type";

/**
 * @description Mock {页面中文名}数据
 * Mock {page} data
 */
export const mock{Page}Data: {Page}ListItem[] = [
  {
    id: "1",
    name: "示例数据1",
    status: "pending",
    createTime: "2024-01-01 10:00:00",
    updateTime: "2024-01-01 10:00:00",
    remarks: "测试备注",
  },
  {
    id: "2",
    name: "示例数据2",
    status: "approved",
    createTime: "2024-01-02 11:00:00",
    updateTime: "2024-01-02 11:00:00",
  },
  // ... 至少 20-50 条数据
];
```

**必须检查项**：

- [ ] 从 `@01s-11comm/type` 导入类型
- [ ] 数组有完整类型约束：`{Page}ListItem[]`
- [ ] 数据量至少 20-50 条
- [ ] 所有字段名是英文
- [ ] 数据足够多样化（覆盖各种状态）

---

### Step 3: 创建 Nitro 接口文件（20 分钟）🔴 CRITICAL

**目标路径计算规则**：

```plain
业务路径: propertyManage.expenseManage.waterAndElectricityMeterReading
↓ 转换规则：
1. 去掉最后一段（页面级）
2. 全部转 kebab-case
↓ 结果
Nitro 文件路径: apps/admin/server/api/property-manage/expense-manage/{page}/list.post.ts
```

**文件内容模板**：

```typescript
/**
 * @api {post} /api/property-manage/expense-manage/{page}/list 获取{页面中文名}列表
 * @description Get {page} list with pagination and filters
 */

import type { JsonVO, PageDTO } from "@ruan-cat/utils";
import type { {Page}ListItem, {Page}QueryParams } from "@01s-11comm/type";
import { defineHandler, readBody } from "nitro/h3";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "server/constant";
import { filterDataByQuery } from "server/utils/filter-data";
import { mock{Page}Data } from "./mock-data";

export default defineHandler(
  async (event): Promise<JsonVO<PageDTO<{Page}ListItem>>> => {
    const body = await readBody<{Page}QueryParams>(event);
    const { pageIndex = DEFAULT_PAGE_INDEX, pageSize = DEFAULT_PAGE_SIZE } = body;

    /** 构建筛选条件 Build filter conditions */
    const filters: Array<{
      field: keyof {Page}ListItem;
      value: any;
      operator?: "equals" | "includes" | "range";
    }> = [];

    if (body.name) {
      filters.push({ field: "name", value: body.name, operator: "includes" });
    }

    if (body.status) {
      filters.push({ field: "status", value: body.status, operator: "equals" });
    }

    if (body.startDate || body.endDate) {
      filters.push({
        field: "createTime",
        value: { start: body.startDate, end: body.endDate },
        operator: "range",
      });
    }

    /** 使用工具函数筛选数据 Filter data using utility function */
    const filteredData = filterDataByQuery(mock{Page}Data, filters);

    /** 分页处理 Pagination */
    const start = (pageIndex - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredData.slice(start, end);

    /** 构建响应 Build response */
    const response: JsonVO<PageDTO<{Page}ListItem>> = {
      success: true,
      code: 200,
      message: "获取成功",
      data: {
        records: pageData,
        total: filteredData.length,
        pageIndex,
        pageSize,
      },
      timestamp: Date.now(),
    };

    return response;
  },
);
```

**必须检查项**：

- [ ] ✅ 从 `nitro/h3` 导入 `defineHandler` 和 `readBody`（不是从 `h3`）
- [ ] ✅ 使用 `defineHandler`（不是 `defineEventHandler`）
- [ ] ✅ 使用 `filterDataByQuery` 工具函数
- [ ] ✅ 创建 `response` 变量并添加完整类型约束
- [ ] ✅ 使用 `DEFAULT_PAGE_INDEX` 和 `DEFAULT_PAGE_SIZE` 常量
- [ ] ✅ 添加 JSDoc 注释，包含接口路径
- [ ] ✅ 所有筛选条件都通过 filters 数组传递
- [ ] ✅ 分页逻辑正确（slice 方法）

**验收标准**：

```bash
pnpm -F @01s-11comm/admin typecheck
# 必须无报错
```

---

### Step 4: 创建前端 API Hook（10 分钟）🔴 CRITICAL

**目标路径计算规则**：

```plain
业务路径: propertyManage.expenseManage.waterAndElectricityMeterReading
↓ 转换规则：
1. 去掉最后一段（页面级）
2. 全部转 kebab-case
↓ 结果
API 文件路径: apps/admin/src/api/property-manage/expense-manage/{page}/index.ts
```

**文件内容模板**：

```typescript
/**
 * @file {页面中文名} API Hooks
 * @description {Page} data fetching hooks
 */

import type { {Page}ListItem, {Page}QueryParams } from "@01s-11comm/type";
import { useListQuery } from "@/composables/use-list-query";

/**
 * @description 获取{页面中文名}列表
 * Get {page} list with TanStack Query
 * @param initialParams - 初始查询参数 Initial query parameters
 */
export function use{Page}ListQuery(
  initialParams: Partial<{Page}QueryParams>,
) {
  return useListQuery<{Page}ListItem, {Page}QueryParams>({
    queryKeyPrefix: "{module}-{page}-list",
    apiUrl: "/api/property-manage/expense-manage/{page}/list",
    initialParams,
  });
}
```

**必须检查项**：

- [ ] ✅ Hook 函数提供 `initialParams` 参数
- [ ] ✅ 参数类型为 `Partial<{Page}QueryParams>`
- [ ] ✅ 配置正确的 `queryKeyPrefix`（格式：`{module}-{page}-list`）
- [ ] ✅ 配置正确的 `apiUrl`（匹配 Nitro 接口路径）
- [ ] ✅ 必须传递 `initialParams`
- [ ] ✅ 泛型参数顺序正确：`<ListItem, QueryParams>`

**queryKeyPrefix 命名规范**：

```typescript
// 格式：{二级路由}-{页面名}-list
// 示例：
"expense-manage-water-meter-list"; // ✅ 正确
"water-meter-list"; // ❌ 错误 - 缺少模块名
"expenseManageWaterMeterList"; // ❌ 错误 - 不是 kebab-case
```

---

### Step 5: 改写列表页（30 分钟）🔴 CRITICAL

**目标路径计算规则**：

```plain
业务路径: propertyManage.expenseManage.waterAndElectricityMeterReading
↓ 转换规则：
全部转 kebab-case
↓ 结果
列表页路径: apps/admin/src/pages/property-manage/expense-manage/{page}/index.vue
```

#### 5.1 导入和类型

**必须添加的导入**：

```typescript
<script setup lang="ts">
import type {
  {Page}ListItem,
  {Page}QueryParams,
  // 如需要下拉选项
  {Page}StatusType,
} from "@01s-11comm/type";
import {
  // 下拉选项变量
  {page}StatusOptions,
} from "@01s-11comm/type";
import { use{Page}ListQuery } from "@/api/property-manage/expense-manage/{page}";

// ... 其他导入保持不变
</script>
```

#### 5.2 数据获取 🔴 CRITICAL

**变量声明顺序（严格）**：

```typescript
/** 搜索表单引用 Search form ref */
const plusSearchModelRef = ref();

/** 搜索表单默认值 Search form default values */
const plusSearchDefaultValues: Partial<{Page}QueryParams> = {
  pageIndex: 1,
  pageSize: 10,
};

/** 搜索表单数据 Search form model */
const plusSearchModel = ref<Partial<{Page}QueryParams>>(
  structuredClone(plusSearchDefaultValues),
);

/** 列表数据查询 List data query */
const {
  tableData,
  pureTableProps,
  isFetching,
  updateParams,
  resetParams,
  doFetch,
  handlePageSizeChange,
  handleCurrentPageChange,
} = use{Page}ListQuery(plusSearchDefaultValues);
```

**必须检查项**：

- [ ] ✅ `plusSearchModelRef` 在最前面声明
- [ ] ✅ `plusSearchDefaultValues` 在第二位声明
- [ ] ✅ `plusSearchModel` 在第三位声明
- [ ] ✅ API Hook 调用在第四位
- [ ] ✅ 传递 `plusSearchDefaultValues` 给 Hook
- [ ] ✅ 解构出全部 8 个变量/函数
- [ ] ✅ 使用 `structuredClone` 不是 `cloneDeep`

**严禁的写法**：

```typescript
// ❌ 错误 1：顺序错误
const { tableData } = use{Page}ListQuery(plusSearchDefaultValues);
const plusSearchModelRef = ref();

// ❌ 错误 2：没有传递 initialParams
const { tableData } = use{Page}ListQuery();

// ❌ 错误 3：使用 cloneDeep
const plusSearchModel = ref(cloneDeep(plusSearchDefaultValues));

// ❌ 错误 4：没有解构全部 8 个值
const { tableData, pureTableProps } = use{Page}ListQuery(plusSearchDefaultValues);
```

#### 5.3 搜索函数 🔴 CRITICAL

**固定写法模板**：

```typescript
/**
 * @description 重置搜索
 * Reset search form
 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/**
 * @description 执行搜索
 * Execute search
 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}
```

**必须检查项**：

- [ ] ✅ `handleReSearch` 使用 `structuredClone`
- [ ] ✅ `handleReSearch` 调用 `resetParams()`
- [ ] ✅ `handleSearch` 调用 `updateParams`
- [ ] ✅ `handleSearch` 重置 `pageIndex: 1`
- [ ] ✅ 使用展开运算符 `...plusSearchModel.value`

**严禁的写法**：

```typescript
// ❌ 错误 1：使用 cloneDeep
function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

// ❌ 错误 2：调用 doFetch 而不是 resetParams
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	doFetch();
}

// ❌ 错误 3：没有重置 pageIndex
function handleSearch() {
	updateParams(plusSearchModel.value);
}

// ❌ 错误 4：调用 doFetch 而不是 updateParams
function handleSearch() {
	doFetch();
}
```

#### 5.4 变量名替换 🔴 CRITICAL

**允许的替换**：

1. **中文变量名 → 英文变量名**

   ```typescript
   // ✅ 允许
   const 停车场表单 = ref();  →  const parkingLotForm = ref();
   const 选中行 = ref([]);     →  const selectedRows = ref([]);
   ```

2. **中文类型名 → 英文类型名**

   ```typescript
   // ✅ 允许
   停车场表单_VO  →  ParkingLotFormVO
   停车场列表项   →  ParkingLotListItem
   ```

3. **cloneDeep → structuredClone**
   ```typescript
   // ✅ 允许
   import { cloneDeep } from "lodash-es";  →  删除此导入
   cloneDeep(obj)                          →  structuredClone(obj)
   ```

**禁止的操作**：

- ❌ 删除任何函数（除了 `loadTableData`）
- ❌ 删除任何计算属性
- ❌ 删除任何响应式变量
- ❌ 修改函数逻辑
- ❌ 修改计算属性逻辑

#### 5.5 禁止删除的内容 🔴 CRITICAL

**完整保留清单**：

```typescript
// ✅ 必须保留 - 模式管理
const { currentMode, modeText, setMode } = useMode();

// ✅ 必须保留 - 开关状态
const [isDialogOpen, toggleDialog] = useToggle(false);
const [isDrawerOpen, toggleDrawer] = useToggle(false);

// ✅ 必须保留 - 测试函数
async function testAsync() {
	// ... 保持原有逻辑
}

// ✅ 必须保留 - 表单实例
const parkingLotFormInstance = shallowRef<ParkingLotFormInstance>();

// ✅ 必须保留 - 表单配置
const formComputed = computed(() => ({
	mode: currentMode.value,
	defaultValues: selectedRow.value,
}));

const props = computed(() => ({
	mode: currentMode.value,
}));

const defaultValues = computed(() => selectedRow.value);

// ✅ 必须保留 - 弹框函数
function openDialog(mode: Mode, row?: any) {
	setMode(mode);

	addDialog({
		title: mode === "add" ? "新增" : "编辑",
		props: {
			formInline: row || {},
			mode,
		},
		width: "40%",
		draggable: true,
		fullscreen: false,
		closeOnClickModal: false,
		contentRenderer: () => h(ParkingLotForm, { ref: parkingLotFormInstance }),
		beforeClose: (action, done) => {
			useDoBeforeClose({
				action,
				done,
				formInstance: parkingLotFormInstance.value,
			});
		},
		footerButtons: [
			{
				label: "取消",
				type: "default",
				btnClick: ({ dialogOptions }) => {
					dialogOptions.visible = false;
				},
			},
			{
				label: "重置",
				type: "warning",
				btnClick: () => {
					parkingLotFormInstance.value?.resetFields();
				},
			},
			{
				label: "提交",
				type: "primary",
				btnClick: async ({ dialogOptions }) => {
					await parkingLotFormInstance.value?.submitForm();
					dialogOptions.visible = false;
					doFetch(); // ✅ 改为使用 doFetch
				},
			},
		],
	});
}

// ✅ 必须保留 - 业务方法
function handleAdd() {
	openDialog("add");
}

function handleEdit(row: any) {
	openDialog("edit", row);
}

async function handleDelete(row: any) {
	// ... 保持原有逻辑
}

function handleExport() {
	// ... 保持原有逻辑
}

function handleBatchDelete() {
	// ... 保持原有逻辑
}

// ✅ 必须保留 - 所有计算属性
const someComputedValue = computed(() => {
	// ... 保持原有逻辑
});
```

**检查要点**：

- [ ] ✅ 保留了 `useMode()` 和所有相关变量
- [ ] ✅ 保留了 `useToggle()` 和所有相关变量
- [ ] ✅ 保留了 `testAsync()` 函数
- [ ] ✅ 保留了表单实例代码
- [ ] ✅ 保留了 `openDialog` 的完整按钮配置
- [ ] ✅ 保留了 `useDoBeforeClose` 调用
- [ ] ✅ 保留了 `formComputed`、`props`、`defaultValues`
- [ ] ✅ 保留了所有业务方法（新增、编辑、删除、导出等）
- [ ] ✅ 保留了所有计算属性

#### 5.6 模板绑定 🟡 IMPORTANT

**必须的绑定**：

```vue
<template>
	<PureTable
		:data="tableData"
		:loading="isFetching"
		:pureTableProps="pureTableProps"
		@page-size-change="handlePageSizeChange"
		@page-current-change="handleCurrentPageChange"
	>
		<!-- 列定义保持不变 -->
	</PureTable>
</template>
```

**必须检查项**：

- [ ] ✅ `:loading="isFetching"`（不是 `isLoading`）
- [ ] ✅ `@page-size-change="handlePageSizeChange"`
- [ ] ✅ `@page-current-change="handleCurrentPageChange"`
- [ ] ✅ `:data="tableData"`
- [ ] ✅ `:pureTableProps="pureTableProps"`

#### 5.7 删除旧代码 🔴 CRITICAL

**必须删除的内容**：

```typescript
// ❌ 删除 - 旧的静态数据导入
import { tableData as allTableData } from "./test-data";

// ❌ 删除 - 手动定义的 pagination
const pagination = computed(() => ({
	total: tableData.value.length,
	pageIndex: currentPage.value,
	pageSize: pageSize.value,
}));

// ❌ 删除 - 手动定义的 pureTableProps
const pureTableProps = ref({
	pagination: {
		total: 0,
		pageIndex: 1,
		pageSize: 10,
	},
});

// ❌ 删除 - loadTableData 函数
async function loadTableData() {
	// ... 所有内容都删除
}

// ❌ 删除 - 手动实现的分页函数
function handlePageSizeChange(size: number) {
	pageSize.value = size;
	loadTableData();
}

function handleCurrentPageChange(page: number) {
	currentPage.value = page;
	loadTableData();
}

// ❌ 删除 - onMounted 中的数据加载
onMounted(async () => {
	await loadTableData();
});
```

**检查要点**：

- [ ] ✅ 删除了 `import { tableData as allTableData } from "./test-data"`
- [ ] ✅ 删除了 `loadTableData` 函数
- [ ] ✅ 删除了手动定义的 `pagination` 计算属性
- [ ] ✅ 删除了手动定义的 `pureTableProps` ref
- [ ] ✅ 删除了手动实现的 `handlePageSizeChange`
- [ ] ✅ 删除了手动实现的 `handleCurrentPageChange`
- [ ] ✅ 删除了 `onMounted` 中的 `loadTableData()` 调用

#### 5.8 definePage 顺序 🔴 CRITICAL

**固定顺序模板**：

```vue
<script setup lang="ts">
definePage({
	name: "{PageName}",
	meta: {
		rank: xxx,
	},
});

// ✅ 导入语句必须在 definePage 之后
import type { xxx } from "xxx";
import { ref, computed } from "vue";
// ... 其他导入

// ✅ 变量声明
const plusSearchModelRef = ref();
// ... 其他代码
</script>
```

**必须检查项**：

- [ ] ✅ `definePage` 在文件最顶部
- [ ] ✅ 导入语句在 `definePage` 之后
- [ ] ✅ 变量声明在导入之后
- [ ] ✅ 没有改变 `definePage` 的任何配置

---

### Step 6: 删除旧的假数据文件（5 分钟）🟡 IMPORTANT

**目标路径计算规则**：

```plain
业务路径: propertyManage.expenseManage.waterAndElectricityMeterReading
↓ 转换规则：
全部转 kebab-case
↓ 结果
测试数据文件路径: apps/admin/src/pages/property-manage/expense-manage/{page}/test-data.ts
```

**执行步骤**：

1. **确认文件存在**

   ```bash
   # 检查文件是否存在
   ls apps/admin/src/pages/property-manage/expense-manage/{page}/test-data.ts
   ```

2. **检查是否有其他文件引用**

   ```bash
   # 使用 Grep 工具搜索引用
   grep -r "from \"./test-data\"" apps/admin/src/pages/property-manage/expense-manage/{page}/
   ```

3. **删除文件**
   ```bash
   rm apps/admin/src/pages/property-manage/expense-manage/{page}/test-data.ts
   ```

**必须检查项**：

- [ ] ✅ 确认 test-data.ts 文件已删除
- [ ] ✅ 确认没有任何文件引用该文件
- [ ] ✅ index.vue 中已删除 `import { tableData } from "./test-data"`

---

### Step 7: 运行类型检查（5 分钟）🔴 CRITICAL

**检查命令**：

```bash
# 1. 检查类型项目
pnpm -F @01s-11comm/type typecheck

# 2. 检查 Admin 项目
pnpm -F @01s-11comm/admin typecheck
```

**常见错误排查**：

#### 错误 1：找不到类型

```log
Cannot find name 'WaterMeterListItem'
```

**解决方案**：

- 检查是否从 `@01s-11comm/type` 导入
- 检查类型项目的 index.ts 是否正确导出
- 检查类型名拼写是否正确

#### 错误 2：类型不匹配

```log
Type 'string' is not assignable to type 'WaterMeterStatusType'
```

**解决方案**：

- 检查枚举类型定义是否正确
- 检查 mock 数据是否使用了正确的枚举值
- 检查接口参数类型是否正确

#### 错误 3：导入冲突

```log
Import declaration conflicts with local declaration of 'auditStatusOptions'
```

**解决方案**：

- 检查是否有重复定义
- 将公共选项移到 `apps/type/src/common/business-options.ts`
- 删除本地定义，只从 type 项目导入

#### 错误 4：缺少必需属性

```log
Property 'initialParams' is missing in type
```

**解决方案**：

- 检查 API Hook 是否提供了 `initialParams` 参数
- 检查调用 Hook 时是否传递了参数

**必须检查项**：

- [ ] ✅ 类型项目无报错
- [ ] ✅ Admin 项目无报错
- [ ] ✅ 所有类型定义正确
- [ ] ✅ 所有导入正确

---

### Step 8: 功能测试（15 分钟）🔴 CRITICAL

**测试清单**：

#### 8.1 列表页初始加载

```bash
# 启动开发服务器
pnpm -F @01s-11comm/admin dev
```

**检查项**：

- [ ] ✅ 页面能正常打开
- [ ] ✅ 列表数据正常显示
- [ ] ✅ 分页信息正确显示
- [ ] ✅ Loading 状态正确显示
- [ ] ✅ 无控制台报错

#### 8.2 搜索功能

**操作步骤**：

1. 填写搜索条件
2. 点击"搜索"按钮
3. 检查列表数据是否按条件筛选
4. 检查分页是否重置为第一页

**检查项**：

- [ ] ✅ 搜索条件生效
- [ ] ✅ 列表数据正确筛选
- [ ] ✅ 分页重置为第一页
- [ ] ✅ Loading 状态正确

#### 8.3 重置功能

**操作步骤**：

1. 填写搜索条件
2. 点击"重置"按钮
3. 检查搜索表单是否恢复默认值
4. 检查列表数据是否恢复全量显示

**检查项**：

- [ ] ✅ 搜索表单恢复默认值
- [ ] ✅ 列表数据恢复全量
- [ ] ✅ 分页恢复默认值

#### 8.4 分页功能

**操作步骤**：

1. 切换每页显示数量
2. 检查列表数据是否重新加载
3. 切换页码
4. 检查列表数据是否正确分页

**检查项**：

- [ ] ✅ 每页大小调整正常
- [ ] ✅ 页码切换正常
- [ ] ✅ 数据正确分页显示
- [ ] ✅ 总条数显示正确

#### 8.5 业务功能（如有）

**新增功能**：

- [ ] ✅ 点击"新增"按钮能打开表单
- [ ] ✅ 表单显示正常
- [ ] ✅ 提交后列表刷新

**编辑功能**：

- [ ] ✅ 点击"编辑"按钮能打开表单
- [ ] ✅ 表单数据正确回显
- [ ] ✅ 提交后列表刷新

**删除功能**：

- [ ] ✅ 点击"删除"按钮有确认提示
- [ ] ✅ 确认后列表刷新

**导出功能**：

- [ ] ✅ 点击"导出"按钮能触发导出
- [ ] ✅ 导出文件格式正确

#### 8.6 控制台检查

**检查项**：

- [ ] ✅ 无任何报错
- [ ] ✅ 无任何警告
- [ ] ✅ 网络请求正常
- [ ] ✅ 请求参数正确
- [ ] ✅ 响应数据格式正确

---

## 类型组织规范

### 在类型项目内必须使用全量导出

**错误写法**：

```typescript
// ❌ 不要单独导出类型
export type * from "./expense-manage";

// ❌ 不要逐个罗列
export type { PatrolTaskFormVO, PatrolTaskFormProps, TaskListItem } from "./task";
```

**正确写法**：

```typescript
// ✅ 直接全量导出
export * from "./expense-manage";
export * from "./task";
```

### index.ts 层级结构

#### 第一层：src/index.ts

```typescript
// apps/type/src/index.ts

/** 导出通用类型 Export common types */
export * from "./common";

/** 导出业务类型 Export business types */
export * from "./business";

/** 导出常量 Export constants */
export * from "./constant";
```

#### 第二层：src/business/index.ts

```typescript
// apps/type/src/business/index.ts

/** 开发团队模块 Dev team module */
export * from "./dev-team";

/** 运营团队模块 Operation team module */
export * from "./operation-team";

/** 物业管理模块 Property manage module */
export * from "./property-manage";

/** 设置管理模块 Setting manage module */
export * from "./setting-manage";
```

#### 第三层：src/business/property-manage/index.ts

```typescript
// apps/type/src/business/property-manage/index.ts

/** 社区管理模块 Community manage module */
export * from "./community-manage";

/** 房产管理模块 House property manage module */
export * from "./house-property-manage";

/** 合同管理模块 Contract manage module */
export * from "./contract-manage";

/** 费用管理模块 Expense manage module */
export * from "./expense-manage";

/** 停车管理模块 Parking manage module */
export * from "./parking-manage";

/** 巡检管理模块 Patrol manage module */
export * from "./patrol-manage";

/** 报修管理模块 Repairs manage module */
export * from "./repairs-manage";

/** 报表管理模块 Report manage module */
export * from "./report-manage";
```

#### 第四层：src/business/property-manage/{module}/index.ts

```typescript
// apps/type/src/business/property-manage/patrol-manage/index.ts

/** 巡检明细 Patrol detail */
export * from "./detail";

/** 巡检项目 Patrol item */
export * from "./item";

/** 巡检路线 Patrol path */
export * from "./path";

/** 巡检计划 Patrol plan */
export * from "./plan";

/** 巡检点位 Patrol point */
export * from "./point";

/** 巡检任务 Patrol task */
export * from "./task";
```

### 处理重复导出

**错误场景**：

```log
模块 "./community-manage" 已导出一个名为"auditStatusOptions"的成员。
请考虑重新显式导出以解决歧义。
```

**错误解决方案**：

```typescript
// ❌ 不要使用分散导出
export { patrolMethodOptions, patrolPointStatusOptions } from "./common";
export * from "./business/dev-team";
```

**正确解决方案**：

将公共选项移到 `apps/type/src/common/business-options.ts`：

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

/** 费用项名称选项 Expense item name options */
export const expenseItemNameOptions: OptionsType = [
	{ label: "物业费", value: "物业费" },
	{ label: "水电费", value: "水电费" },
	{ label: "停车费", value: "停车费" },
];

/** 费用类型选项别名 Fee type options alias */
export const feeTypeOptions = expenseTypeOptions;
```

然后在 `apps/type/src/common/index.ts` 中导出：

```typescript
// apps/type/src/common/index.ts

/** 业务选项 Business options */
export * from "./business-options";

/** 业务类型 Business types */
export * from "./business-types";

/** 基础类型 Base types */
export * from "./base-types";
```

---

## 后台项目 form.ts 规范

### 禁止导出类型

**错误写法**：

```typescript
// apps/admin/src/pages/property-manage/patrol-manage/task/components/form.ts

// ❌ 不要导出类型
export type { PatrolTaskFormVO };

import type { PatrolTaskFormVO } from "@01s-11comm/type";
```

**正确写法**：

```typescript
// apps/admin/src/pages/property-manage/patrol-manage/task/components/form.ts

// ✅ 只导入，不导出
import type { PatrolTaskFormVO } from "@01s-11comm/type";

// ✅ 本地使用
export interface PatrolTaskFormProps {
	mode: Mode;
	formInline: PatrolTaskFormVO;
}
```

### 禁止导出别名

**错误写法**：

```typescript
// ❌ 不要导出别名
export type { PatrolTaskFormVO as FormVO };
```

**正确写法**：

```typescript
// ✅ 直接使用原始类型
import type { PatrolTaskFormVO } from "@01s-11comm/type";

// ✅ 在本地类型定义中直接使用
export interface PatrolTaskFormProps {
	formInline: PatrolTaskFormVO;
}
```

### FormProps 不迁移到类型项目

**重要原则**：

FormProps 是表单组件特有的类型，**不应该**迁移到类型项目。

**正确做法**：

```typescript
// apps/admin/src/pages/property-manage/patrol-manage/task/components/form.ts

import type { PatrolTaskFormVO } from "@01s-11comm/type";
import type { Mode } from "@/composables/use-mode";

// ✅ FormProps 保留在 form.ts 中
export interface PatrolTaskFormProps {
	/** 模式 Mode */
	mode: Mode;

	/** 表单数据 Form data */
	formInline: PatrolTaskFormVO;
}

// ✅ FormInstance 也保留在 form.ts 中
export interface PatrolTaskFormInstance {
	submitForm: () => Promise<void>;
	resetFields: () => void;
}
```

---

## filterDataByQuery 工具使用

### 工具函数位置

```plain
apps/admin/server/utils/filter-data.ts
```

### 函数签名

```typescript
/**
 * @description 通用数据筛选工具
 * Generic data filtering utility
 */
export function filterDataByQuery<T>(
	data: T[],
	filters: Array<{
		field: keyof T;
		value: any;
		operator?: "equals" | "includes" | "range";
	}>,
): T[];
```

### 使用示例

#### 示例 1：简单等值筛选

```typescript
const filters = [{ field: "status", value: "approved", operator: "equals" }];

const result = filterDataByQuery(mockData, filters);
```

#### 示例 2：模糊匹配

```typescript
const filters = [{ field: "name", value: "张三", operator: "includes" }];

const result = filterDataByQuery(mockData, filters);
```

#### 示例 3：范围筛选

```typescript
const filters = [
	{
		field: "createTime",
		value: { start: "2024-01-01", end: "2024-12-31" },
		operator: "range",
	},
];

const result = filterDataByQuery(mockData, filters);
```

#### 示例 4：组合筛选

```typescript
const filters = [
	{ field: "name", value: "张三", operator: "includes" },
	{ field: "status", value: "approved", operator: "equals" },
	{
		field: "createTime",
		value: { start: "2024-01-01", end: "2024-12-31" },
		operator: "range",
	},
];

const result = filterDataByQuery(mockData, filters);
```

### 在 Nitro 接口中使用

```typescript
export default defineHandler(async (event): Promise<JsonVO<PageDTO<WaterMeterListItem>>> => {
	const body = await readBody<WaterMeterQueryParams>(event);

	/** 构建筛选条件 */
	const filters: Array<{
		field: keyof WaterMeterListItem;
		value: any;
		operator?: "equals" | "includes" | "range";
	}> = [];

	// 名称模糊匹配
	if (body.name) {
		filters.push({ field: "name", value: body.name, operator: "includes" });
	}

	// 状态精确匹配
	if (body.status) {
		filters.push({ field: "status", value: body.status, operator: "equals" });
	}

	// 日期范围筛选
	if (body.startDate || body.endDate) {
		filters.push({
			field: "createTime",
			value: { start: body.startDate, end: body.endDate },
			operator: "range",
		});
	}

	/** 使用工具函数筛选 */
	const filteredData = filterDataByQuery(mockWaterMeterData, filters);

	// ... 分页处理
});
```

---

## 常见错误快速排查

### 类型检查报错

| 错误类型                       | 快速检查                       | 解决方案                             |
| :----------------------------- | :----------------------------- | :----------------------------------- |
| `Cannot find name 'xxx'`       | 检查是否从正确的模块导入类型   | 确认 `@01s-11comm/type` 导入路径正确 |
| `Type 'xxx' is not assignable` | 检查是否使用了正确的英文类型名 | 替换中文类型名为英文类型名           |
| `Import declaration conflicts` | 检查是否有重复导入或本地定义   | 移除重复定义，统一从 type 项目导入   |
| `Property 'xxx' is missing`    | 检查接口定义是否完整           | 补充缺失的必需属性                   |
| `Module not found`             | 检查类型项目的 index.ts 导出   | 确认类型已正确导出                   |
| `Duplicate identifier`         | 检查是否有重复的类型或变量定义 | 删除重复定义，保留一个               |

### 列表页数据不显示

| 问题现象       | 快速检查                         | 解决方案                                         |
| :------------- | :------------------------------- | :----------------------------------------------- |
| 页面空白       | 检查 Hook 是否传递 initialParams | 确认调用 Hook 时传递了 `plusSearchDefaultValues` |
| 无数据显示     | 检查 Nitro 接口路径              | 确认 `apiUrl` 与 Nitro 文件路径匹配              |
| 分页信息错误   | 检查 pureTableProps 绑定         | 确认 `:pureTableProps="pureTableProps"`          |
| Mock 数据为空  | 检查 mock-data.ts 文件           | 确认 mock 数据数组有足够数据                     |
| Loading 不消失 | 检查 isFetching 绑定             | 确认 `:loading="isFetching"`                     |

### 搜索/分页不工作

| 问题现象     | 快速检查                 | 解决方案                                    |
| :----------- | :----------------------- | :------------------------------------------ |
| 搜索无效果   | 检查 handleSearch 实现   | 确认使用 `updateParams` 而非 `doFetch`      |
| 重置无效果   | 检查 handleReSearch 实现 | 确认使用 `resetParams` 和 `structuredClone` |
| 分页无效果   | 检查分页函数绑定         | 确认使用 Hook 返回的分页函数                |
| 页码不重置   | 检查 handleSearch 参数   | 确认包含 `pageIndex: 1`                     |
| 手动分页残留 | 检查是否删除旧代码       | 删除手动实现的 `handlePageSizeChange` 等    |

### Nitro 接口报错

| 错误信息                           | 快速检查                   | 解决方案                           |
| :--------------------------------- | :------------------------- | :--------------------------------- |
| `defineHandler is not a function`  | 检查导入来源               | 从 `nitro/h3` 导入，不是 `h3`      |
| `filterDataByQuery is not defined` | 检查工具函数导入           | 从 `server/utils/filter-data` 导入 |
| 类型推断失败                       | 检查 response 变量类型约束 | 添加完整类型 `JsonVO<PageDTO<T>>`  |
| 分页数据错误                       | 检查 slice 参数            | 确认 `start` 和 `end` 计算正确     |

### 业务功能异常

| 问题现象     | 快速检查               | 解决方案                           |
| :----------- | :--------------------- | :--------------------------------- |
| 弹框无法打开 | 检查 openDialog 函数   | 确认函数完整保留                   |
| 表单数据丢失 | 检查 formComputed 定义 | 确认 `formComputed` 未被删除       |
| 提交后不刷新 | 检查提交按钮回调       | 确认使用 `doFetch()` 刷新列表      |
| 模式切换失败 | 检查 useMode 调用      | 确认 `useMode()` 未被删除          |
| 删除功能失效 | 检查业务方法保留       | 确认 `handleDelete` 等方法完整保留 |

---

## 验收标准

### 单页面迁移完成的定义

1. 🔴 所有 [CRITICAL] 检查项全部通过
2. 🟡 至少 80% 的 [IMPORTANT] 检查项通过
3. ✅ `pnpm typecheck` 无报错
4. ✅ 所有功能测试通过
5. ✅ 无控制台报错或警告

### 完整检查清单

#### 类型定义（Step 1）

- [ ] ✅ 创建了 `{Page}ListItem` 接口
- [ ] ✅ 创建了 `{Page}QueryParams` 接口
- [ ] ✅ 所有字段是英文驼峰命名
- [ ] ✅ 每个字段有 JSDoc 注释
- [ ] ✅ 没有中文类型别名
- [ ] ✅ 没有中文变量别名
- [ ] ✅ 类型项目 typecheck 通过

#### Mock 数据（Step 2）

- [ ] ✅ 从 `@01s-11comm/type` 导入类型
- [ ] ✅ 数组有类型约束 `{Page}ListItem[]`
- [ ] ✅ 数据量 20-50 条
- [ ] ✅ 所有字段名是英文

#### Nitro 接口（Step 3）

- [ ] ✅ 从 `nitro/h3` 导入 `defineHandler`
- [ ] ✅ 使用 `defineHandler` 不是 `defineEventHandler`
- [ ] ✅ 使用 `filterDataByQuery` 工具
- [ ] ✅ response 变量有完整类型约束
- [ ] ✅ 使用 `DEFAULT_PAGE_INDEX` 和 `DEFAULT_PAGE_SIZE`
- [ ] ✅ 有 JSDoc 注释
- [ ] ✅ Admin 项目 typecheck 通过

#### API Hook（Step 4）

- [ ] ✅ Hook 函数有 `initialParams` 参数
- [ ] ✅ 参数类型是 `Partial<{Page}QueryParams>`
- [ ] ✅ queryKeyPrefix 正确
- [ ] ✅ apiUrl 正确
- [ ] ✅ 传递了 initialParams

#### 列表页改写（Step 5）

- [ ] ✅ 导入了正确的类型和选项
- [ ] ✅ 变量声明顺序正确
- [ ] ✅ 传递了 initialParams 给 Hook
- [ ] ✅ 解构了 8 个变量/函数
- [ ] ✅ handleReSearch 使用固定写法
- [ ] ✅ handleSearch 使用固定写法
- [ ] ✅ 使用 structuredClone 不是 cloneDeep
- [ ] ✅ 保留了所有业务逻辑
- [ ] ✅ 保留了 useMode
- [ ] ✅ 保留了 useToggle
- [ ] ✅ 保留了 testAsync
- [ ] ✅ 保留了表单实例
- [ ] ✅ 保留了 openDialog 完整配置
- [ ] ✅ 保留了 formComputed
- [ ] ✅ 模板绑定正确
- [ ] ✅ 删除了旧的静态数据导入
- [ ] ✅ 删除了 loadTableData
- [ ] ✅ 删除了手动分页逻辑
- [ ] ✅ definePage 顺序正确

#### 删除旧文件（Step 6）

- [ ] ✅ 删除了 test-data.ts
- [ ] ✅ 确认无文件引用

#### 类型检查（Step 7）

- [ ] ✅ 类型项目无报错
- [ ] ✅ Admin 项目无报错

#### 功能测试（Step 8）

- [ ] ✅ 列表初始加载正常
- [ ] ✅ 搜索功能正常
- [ ] ✅ 重置功能正常
- [ ] ✅ 分页功能正常
- [ ] ✅ Loading 状态正确
- [ ] ✅ 业务功能正常（新增/编辑/删除）
- [ ] ✅ 无控制台报错

---

## 执行流程

### 1. 解析参数

从命令参数中提取：

- 业务路径（三级路由）
- 页面名称（PascalCase）

### 2. 计算文件路径

根据业务路径计算：

- 类型文件路径
- Mock 数据文件路径
- Nitro 接口文件路径
- API Hook 文件路径
- 列表页文件路径
- 测试数据文件路径

### 3. 执行 8 步迁移

按照 Step 1 到 Step 8 的顺序：

1. 创建类型定义
2. 创建 Mock 数据
3. 创建 Nitro 接口
4. 创建 API Hook
5. 改写列表页
6. 删除旧文件
7. 运行类型检查
8. 功能测试

### 4. 验收检查

确保所有验收标准通过。

### 5. 报告结果

生成迁移报告，包含：

- 迁移的文件列表
- 遇到的问题
- 解决方案
- 验收结果

---

## 注意事项

### 深度推理模式（Ultrathink Mode）

执行此命令时，请全程开启深度推理模式：

1. **深度推理**：投入充足的 Token 进行推理，不要急于输出代码
2. **代码理解**：充分理解现有代码的业务逻辑
3. **语义改写**：基于语义理解进行手工改写
4. **质量检查**：每个步骤完成后立即自查

### 幻觉抑制

为避免代码幻觉：

1. **重新读取**：完成一个阶段后重新读取规范文件
2. **逐文件处理**：一次只处理一个文件
3. **立即验证**：每个文件改完立即运行 typecheck
4. **人工审核**：所有改动都要基于阅读和理解

### 禁止行为

1. ❌ 禁止编写脚本批量处理
2. ❌ 禁止删除现有业务逻辑
3. ❌ 禁止创建中文类型别名
4. ❌ 禁止跳过任何验收步骤
5. ❌ 禁止在未理解代码的情况下修改

### 必须行为

1. ✅ 必须逐文件阅读和理解
2. ✅ 必须基于语义进行改写
3. ✅ 必须保留所有业务逻辑
4. ✅ 必须完成所有验收检查
5. ✅ 必须使用中文回复

---

## 路径转换规则

### 业务路径格式

```plain
一级.二级.三级
例如：propertyManage.expenseManage.waterAndElectricityMeterReading
```

### 转换规则

#### 规则 1：camelCase → kebab-case

```plain
propertyManage → property-manage
expenseManage → expense-manage
waterAndElectricityMeterReading → water-and-electricity-meter-reading
```

#### 规则 2：去除最后一段（页面级）

```plain
propertyManage.expenseManage.waterAndElectricityMeterReading
↓ 去除最后一段
propertyManage.expenseManage
```

#### 规则 3：拼接路径

**类型项目**：

```plain
apps/type/src/business/{一级-kebab}/{二级-kebab}/{三级-kebab}.ts
```

**后台项目（server）**：

```plain
apps/admin/server/api/{一级-kebab}/{二级-kebab}/{三级-kebab}/list.post.ts
apps/admin/server/api/{一级-kebab}/{二级-kebab}/{三级-kebab}/mock-data.ts
```

**后台项目（client）**：

```plain
apps/admin/src/api/{一级-kebab}/{二级-kebab}/{三级-kebab}/index.ts
apps/admin/src/pages/{一级-kebab}/{二级-kebab}/{三级-kebab}/index.vue
apps/admin/src/pages/{一级-kebab}/{二级-kebab}/{三级-kebab}/test-data.ts
```

### 转换示例

#### 示例 1

```plain
输入：propertyManage.expenseManage.waterAndElectricityMeterReading
页面名：WaterAndElectricityMeterReading

类型文件：
apps/type/src/business/property-manage/expense-manage/water-and-electricity-meter-reading.ts

Mock 数据：
apps/admin/server/api/property-manage/expense-manage/water-and-electricity-meter-reading/mock-data.ts

Nitro 接口：
apps/admin/server/api/property-manage/expense-manage/water-and-electricity-meter-reading/list.post.ts

API Hook：
apps/admin/src/api/property-manage/expense-manage/water-and-electricity-meter-reading/index.ts

列表页：
apps/admin/src/pages/property-manage/expense-manage/water-and-electricity-meter-reading/index.vue

测试数据：
apps/admin/src/pages/property-manage/expense-manage/water-and-electricity-meter-reading/test-data.ts
```

#### 示例 2

```plain
输入：propertyManage.patrolManage.task
页面名：PatrolTask

类型文件：
apps/type/src/business/property-manage/patrol-manage/task.ts

Mock 数据：
apps/admin/server/api/property-manage/patrol-manage/task/mock-data.ts

Nitro 接口：
apps/admin/server/api/property-manage/patrol-manage/task/list.post.ts

API Hook：
apps/admin/src/api/property-manage/patrol-manage/task/index.ts

列表页：
apps/admin/src/pages/property-manage/patrol-manage/task/index.vue

测试数据：
apps/admin/src/pages/property-manage/patrol-manage/task/test-data.ts
```

---

## 技术架构说明

### Nitro v3

**核心特性**：

- ✅ 从 `nitro/h3` 导入，不是 `h3`
- ✅ 使用 `defineHandler` 不是 `defineEventHandler`
- ✅ 完整的 TypeScript 支持
- ✅ 自动路由（基于文件名）

**文件命名规范**：

```plain
list.post.ts   → POST /api/.../list
list.get.ts    → GET /api/.../list
[id].get.ts    → GET /api/.../123
[id].delete.ts → DELETE /api/.../123
```

### TanStack Query（Vue Query）

**核心概念**：

- ✅ 自动缓存和重新验证
- ✅ 后台重新获取
- ✅ 乐观更新
- ✅ Loading 和 Error 状态管理
- ✅ 自动重试

**Hook 返回值（8 个）**：

```typescript
const {
  tableData,              // 列表数据
  pureTableProps,         // 表格属性（含分页）
  isFetching,             // 加载状态
  updateParams,           // 更新参数并重新获取
  resetParams,            // 重置参数并重新获取
  doFetch,                // 手动触发获取
  handlePageSizeChange,   // 每页大小改变
  handleCurrentPageChange, // 页码改变
} = useListQuery(...);
```

### Monorepo 类型系统

**核心理念**：

- ✅ 集中管理所有业务类型
- ✅ 类型和变量统一导出
- ✅ 禁止中文类型别名
- ✅ 禁止向后兼容的导出

**导出层级**：

```plain
src/index.ts
  ├─ common/index.ts
  │   ├─ business-options.ts  (公共选项)
  │   ├─ business-types.ts    (公共类型)
  │   └─ base-types.ts        (基础类型)
  ├─ business/index.ts
  │   ├─ property-manage/index.ts
  │   │   ├─ expense-manage/index.ts
  │   │   │   └─ water-meter.ts
  │   │   └─ patrol-manage/index.ts
  │   │       └─ task.ts
  │   └─ ...
  └─ constant/index.ts
```

---

## 完整代码示例

### 示例页面：水电表抄表

#### 类型定义

```typescript
// apps/type/src/business/property-manage/expense-manage/water-and-electricity-meter-reading.ts

/**
 * @file 水电表抄表列表页类型定义
 * @description Water and electricity meter reading list page type definitions
 */

import type { BaseListQueryParams } from "../../../common";

/** 抄表类型 Meter reading type */
export type MeterReadingType = "water" | "electricity" | "gas";

/** 抄表状态 Meter reading status */
export type MeterReadingStatusType = "pending" | "completed" | "abnormal";

/** 水电表抄表列表项 Water and electricity meter reading list item */
export interface WaterElectricityMeterReadingListItem {
	/** 主键 ID Primary key */
	id: string;

	/** 房屋名称 House name */
	houseName: string;

	/** 表计类型 Meter type */
	meterType: MeterReadingType;

	/** 上次读数 Last reading */
	lastReading: number;

	/** 本次读数 Current reading */
	currentReading: number;

	/** 用量 Usage */
	usage: number;

	/** 抄表日期 Reading date */
	readingDate: string;

	/** 抄表人 Reader */
	reader: string;

	/** 状态 Status */
	status: MeterReadingStatusType;

	/** 备注 Remarks */
	remarks?: string;

	/** 创建时间 Create time */
	createTime: string;

	/** 更新时间 Update time */
	updateTime: string;
}

/** 水电表抄表查询参数 Water and electricity meter reading query params */
export interface WaterElectricityMeterReadingQueryParams extends BaseListQueryParams {
	/** 房屋名称 House name */
	houseName?: string;

	/** 表计类型 Meter type */
	meterType?: MeterReadingType;

	/** 状态 Status */
	status?: MeterReadingStatusType;

	/** 开始日期 Start date */
	startDate?: string;

	/** 结束日期 End date */
	endDate?: string;
}

/** 表计类型选项 Meter type options */
export const meterTypeOptions: OptionsType = [
	{ label: "水表", value: "water" },
	{ label: "电表", value: "electricity" },
	{ label: "燃气表", value: "gas" },
];

/** 抄表状态选项 Meter reading status options */
export const meterReadingStatusOptions: OptionsType = [
	{ label: "待抄表", value: "pending" },
	{ label: "已完成", value: "completed" },
	{ label: "异常", value: "abnormal" },
];
```

#### Mock 数据

```typescript
// apps/admin/server/api/property-manage/expense-manage/water-and-electricity-meter-reading/mock-data.ts

/**
 * @file 水电表抄表 Mock 数据
 * @description Water and electricity meter reading mock data for development
 */

import type { WaterElectricityMeterReadingListItem } from "@01s-11comm/type";

/**
 * @description Mock 水电表抄表数据
 * Mock water and electricity meter reading data
 */
export const mockWaterElectricityMeterReadingData: WaterElectricityMeterReadingListItem[] = [
	{
		id: "1",
		houseName: "A栋101室",
		meterType: "water",
		lastReading: 1250,
		currentReading: 1280,
		usage: 30,
		readingDate: "2024-01-15",
		reader: "张三",
		status: "completed",
		remarks: "正常抄表",
		createTime: "2024-01-15 10:00:00",
		updateTime: "2024-01-15 10:00:00",
	},
	{
		id: "2",
		houseName: "A栋102室",
		meterType: "electricity",
		lastReading: 3500,
		currentReading: 3680,
		usage: 180,
		readingDate: "2024-01-15",
		reader: "李四",
		status: "completed",
		createTime: "2024-01-15 11:00:00",
		updateTime: "2024-01-15 11:00:00",
	},
	{
		id: "3",
		houseName: "B栋201室",
		meterType: "water",
		lastReading: 980,
		currentReading: 990,
		usage: 10,
		readingDate: "2024-01-16",
		reader: "王五",
		status: "pending",
		createTime: "2024-01-16 09:00:00",
		updateTime: "2024-01-16 09:00:00",
	},
	// ... 更多数据
];
```

#### Nitro 接口

```typescript
// apps/admin/server/api/property-manage/expense-manage/water-and-electricity-meter-reading/list.post.ts

/**
 * @api {post} /api/property-manage/expense-manage/water-and-electricity-meter-reading/list 获取水电表抄表列表
 * @description Get water and electricity meter reading list with pagination and filters
 */

import type { JsonVO, PageDTO } from "@ruan-cat/utils";
import type { WaterElectricityMeterReadingListItem, WaterElectricityMeterReadingQueryParams } from "@01s-11comm/type";
import { defineHandler, readBody } from "nitro/h3";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "server/constant";
import { filterDataByQuery } from "server/utils/filter-data";
import { mockWaterElectricityMeterReadingData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<WaterElectricityMeterReadingListItem>>> => {
	const body = await readBody<WaterElectricityMeterReadingQueryParams>(event);
	const { pageIndex = DEFAULT_PAGE_INDEX, pageSize = DEFAULT_PAGE_SIZE } = body;

	/** 构建筛选条件 Build filter conditions */
	const filters: Array<{
		field: keyof WaterElectricityMeterReadingListItem;
		value: any;
		operator?: "equals" | "includes" | "range";
	}> = [];

	if (body.houseName) {
		filters.push({
			field: "houseName",
			value: body.houseName,
			operator: "includes",
		});
	}

	if (body.meterType) {
		filters.push({
			field: "meterType",
			value: body.meterType,
			operator: "equals",
		});
	}

	if (body.status) {
		filters.push({ field: "status", value: body.status, operator: "equals" });
	}

	if (body.startDate || body.endDate) {
		filters.push({
			field: "readingDate",
			value: { start: body.startDate, end: body.endDate },
			operator: "range",
		});
	}

	/** 使用工具函数筛选数据 Filter data using utility function */
	const filteredData = filterDataByQuery(mockWaterElectricityMeterReadingData, filters);

	/** 分页处理 Pagination */
	const start = (pageIndex - 1) * pageSize;
	const end = start + pageSize;
	const pageData = filteredData.slice(start, end);

	/** 构建响应 Build response */
	const response: JsonVO<PageDTO<WaterElectricityMeterReadingListItem>> = {
		success: true,
		code: 200,
		message: "获取成功",
		data: {
			records: pageData,
			total: filteredData.length,
			pageIndex,
			pageSize,
		},
		timestamp: Date.now(),
	};

	return response;
});
```

#### API Hook

```typescript
// apps/admin/src/api/property-manage/expense-manage/water-and-electricity-meter-reading/index.ts

/**
 * @file 水电表抄表 API Hooks
 * @description Water and electricity meter reading data fetching hooks
 */

import type { WaterElectricityMeterReadingListItem, WaterElectricityMeterReadingQueryParams } from "@01s-11comm/type";
import { useListQuery } from "@/composables/use-list-query";

/**
 * @description 获取水电表抄表列表
 * Get water and electricity meter reading list with TanStack Query
 * @param initialParams - 初始查询参数 Initial query parameters
 */
export function useWaterElectricityMeterReadingListQuery(
	initialParams: Partial<WaterElectricityMeterReadingQueryParams>,
) {
	return useListQuery<WaterElectricityMeterReadingListItem, WaterElectricityMeterReadingQueryParams>({
		queryKeyPrefix: "expense-manage-water-electricity-meter-reading-list",
		apiUrl: "/api/property-manage/expense-manage/water-and-electricity-meter-reading/list",
		initialParams,
	});
}
```

#### 列表页（关键部分）

```vue
<script setup lang="ts">
definePage({
	name: "WaterAndElectricityMeterReading",
	meta: {
		rank: 123,
	},
});

import type {
	WaterElectricityMeterReadingListItem,
	WaterElectricityMeterReadingQueryParams,
	MeterReadingType,
	MeterReadingStatusType,
} from "@01s-11comm/type";
import { meterTypeOptions, meterReadingStatusOptions } from "@01s-11comm/type";
import { useWaterElectricityMeterReadingListQuery } from "@/api/property-manage/expense-manage/water-and-electricity-meter-reading";
import { ref, computed } from "vue";

/** 搜索表单引用 Search form ref */
const plusSearchModelRef = ref();

/** 搜索表单默认值 Search form default values */
const plusSearchDefaultValues: Partial<WaterElectricityMeterReadingQueryParams> = {
	pageIndex: 1,
	pageSize: 10,
};

/** 搜索表单数据 Search form model */
const plusSearchModel = ref<Partial<WaterElectricityMeterReadingQueryParams>>(structuredClone(plusSearchDefaultValues));

/** 列表数据查询 List data query */
const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useWaterElectricityMeterReadingListQuery(plusSearchDefaultValues);

/**
 * @description 重置搜索
 * Reset search form
 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/**
 * @description 执行搜索
 * Execute search
 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

// ... 其他业务逻辑保持不变
</script>

<template>
	<div class="water-electricity-meter-reading-page">
		<!-- 搜索表单 -->
		<PlusSearch
			v-model="plusSearchModel"
			ref="plusSearchModelRef"
			:default-values="plusSearchDefaultValues"
			@search="handleSearch"
			@reset="handleReSearch"
		>
			<!-- 搜索字段配置 -->
		</PlusSearch>

		<!-- 数据表格 -->
		<PureTable
			:data="tableData"
			:loading="isFetching"
			:pureTableProps="pureTableProps"
			@page-size-change="handlePageSizeChange"
			@page-current-change="handleCurrentPageChange"
		>
			<!-- 列定义 -->
		</PureTable>
	</div>
</template>
```

---

## 总结

此命令严格遵循 `migrate-static-data-to-nitro-query` 任务的全部规范，包括：

- ✅ 核心原则：只做类型/变量替换，不删业务逻辑
- ✅ 五个必须：英文类型、Nitro v3、filterDataByQuery、initialParams、固定搜索写法
- ✅ 三个严禁：禁止中文别名、禁止删业务逻辑、禁止脚本批处理
- ✅ 8 步流程：类型定义 → Mock → Nitro → Hook → 列表页 → 删旧文件 → 类型检查 → 测试
- ✅ 类型组织：全量导出、层级结构、处理重复
- ✅ 质量保障：完整验收标准、错误排查、深度推理

使用此命令时，请严格按照流程执行，确保每个步骤都通过验收检查。
