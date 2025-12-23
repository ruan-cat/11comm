# 迁移执行检查清单 (CHECKLIST)

> **使用说明**：迁移每个列表页时，按照此清单逐项检查，确保不遗漏关键步骤。
>
> **完成标准**：所有 🔴 [CRITICAL] 项必须全部通过，🟡 [IMPORTANT] 项建议通过。

---

## 📋 单页面完整迁移清单

### Step 1: 创建类型定义文件 (15 分钟) 🔴 [CRITICAL]

**文件路径**：`apps/type/src/business/{module}/{sub-module}/{page}.ts`

- [ ] 定义 `{Page}ListItem` 接口，所有字段为英文驼峰命名
- [ ] 定义 `{Page}QueryParams` 接口，继承 `BaseListQueryParams`
- [ ] 定义枚举类型（如需要）
- [ ] 导出 Options 常量（如需要）
- [ ] **关键检查**：每个字段都有 JSDoc 注释 `/** 中文 English */`
- [ ] **关键检查**：没有创建任何中文类型别名（如 `export type 巡检方式 = PatrolMethodType;`）
- [ ] **关键检查**：没有创建任何中文变量别名（如 `export const 费用类型 = contractTypeOptions;`）

**验收**：运行 `pnpm -F @01s-11comm/type typecheck` 无报错

---

### Step 2: 创建 Mock 数据文件 (10 分钟) 🟡 [IMPORTANT]

**文件路径**：`apps/admin/server/api/{module}/{sub-module}/{page}/mock-data.ts`

- [ ] 从 `@01s-11comm/type` 导入 `{Page}ListItem` 类型
- [ ] 创建 `mock{Page}Data` 数组，类型约束为 `{Page}ListItem[]`
- [ ] 数据量至少 20-50 条
- [ ] 所有字段名为英文

---

### Step 3: 创建 Nitro 接口文件 (20 分钟) 🔴 [CRITICAL]

**文件路径**：`apps/admin/server/api/{module}/{sub-module}/{page}/list.post.ts`

- [ ] **必须**：从 `nitro/h3` 导入 `defineHandler` 和 `readBody`（不是从 `h3`）
- [ ] **必须**：使用 `defineHandler`（不是 `defineEventHandler`）
- [ ] **必须**：使用 `filterDataByQuery` 工具函数进行数据筛选（不手动编写 filter 逻辑）
- [ ] **必须**：创建 `response` 变量并添加完整类型约束 `JsonVO<PageDTO<{Page}ListItem>>`
- [ ] 使用 `DEFAULT_PAGE_INDEX` 和 `DEFAULT_PAGE_SIZE` 常量
- [ ] 添加 JSDoc 注释，包含接口路径

**关键代码检查**：

```typescript
// ✅ 必须这样写
import { defineHandler, readBody } from "nitro/h3";
import { filterDataByQuery } from "server/utils/filter-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<T>>> => {
	const filteredData = filterDataByQuery(mockData, filters);

	const response: JsonVO<PageDTO<T>> = {
		/* ... */
	};
	return response;
});
```

**验收**：运行 `pnpm -F @01s-11comm/admin typecheck` 无报错

---

### Step 4: 创建前端 API Hook (10 分钟) 🔴 [CRITICAL]

**文件路径**：`apps/admin/src/api/{module}/{sub-module}/{page}/index.ts`

- [ ] **必须**：Hook 函数提供 `initialParams` 参数
- [ ] **必须**：参数类型为 `Partial<{Page}QueryParams>`
- [ ] 配置正确的 `queryKeyPrefix`
- [ ] 配置正确的 `apiUrl`

**关键代码检查**：

```typescript
// ✅ 必须这样写
export function use{Page}ListQuery(initialParams: Partial<{Page}QueryParams>) {
  return useListQuery<{Page}ListItem, {Page}QueryParams>({
    queryKeyPrefix: "xxx",
    apiUrl: "/api/.../list",
    initialParams, // ✅ 必须传递
  });
}
```

---

### Step 5: 改写列表页 (30 分钟) 🔴 [CRITICAL]

**文件路径**：`apps/admin/src/pages/{module}/{sub-module}/{page}/index.vue`

#### 5.1 导入和类型

- [ ] 导入类型和 Hook
- [ ] 从 `@01s-11comm/type` 导入业务类型和 Options

#### 5.2 数据获取 🔴 [CRITICAL]

- [ ] 定义 `plusSearchModelRef` 和 `plusSearchDefaultValues`
- [ ] 调用 `use{Page}ListQuery(plusSearchDefaultValues)`
- [ ] 解构 Hook 返回的 8 个变量/函数：
  - `tableData`
  - `pureTableProps`
  - `isFetching`
  - `updateParams`
  - `resetParams`
  - `doFetch`
  - `handlePageSizeChange`
  - `handleCurrentPageChange`

#### 5.3 搜索函数 🔴 [CRITICAL]

- [ ] 使用固定写法的 `handleReSearch` 函数
- [ ] 使用固定写法的 `handleSearch` 函数
- [ ] 使用 `structuredClone`（不是 `cloneDeep`）

**关键代码检查**：

```typescript
// ✅ 必须这样写
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}
```

#### 5.4 变量名替换 🔴 [CRITICAL]

**只做以下替换，不删除任何逻辑**：

- [ ] 中文变量名 → 英文变量名（如 `停车场表单` → `ParkingLotForm`）
- [ ] 中文类型名 → 英文类型名（如 `停车场表单_VO` → `ParkingLotFormVO`）
- [ ] `cloneDeep` → `structuredClone`

#### 5.5 禁止删除的内容 🔴 [CRITICAL]

**检查以下内容是否都保留**：

- [ ] ✅ 保留了 `useMode()` 和相关变量
- [ ] ✅ 保留了 `useToggle()` 和相关变量
- [ ] ✅ 保留了 `testAsync()` 函数
- [ ] ✅ 保留了表单实例代码（如 `ParkingLotFormInstance`）
- [ ] ✅ 保留了 `openDialog` 的完整按钮配置（取消、重置、提交）
- [ ] ✅ 保留了 `useDoBeforeClose` 调用
- [ ] ✅ 保留了 `const formComputed` 变量
- [ ] ✅ 保留了 `const props` 和 `const defaultValues`

#### 5.6 模板绑定 🟡 [IMPORTANT]

- [ ] `<PureTable :loading="isFetching">` （不是 `isLoading`）
- [ ] `@page-size-change="handlePageSizeChange"`
- [ ] `@page-current-change="handleCurrentPageChange"`

#### 5.7 删除旧代码 🔴 [CRITICAL]

- [ ] 删除 `import { tableData as allTableData } from "./test-data"`
- [ ] 删除 `loadTableData` 函数
- [ ] 删除手动定义的 `pagination` 计算属性
- [ ] 删除手动定义的 `pureTableProps` ref
- [ ] 删除手动实现的 `handlePageSizeChange` 和 `handleCurrentPageChange`
- [ ] 删除 `onMounted(() => { await loadTableData(); })`

---

### Step 6: 删除旧的假数据文件 (5 分钟) 🟡 [IMPORTANT]

- [ ] 删除 `apps/admin/src/pages/{module}/{sub-module}/{page}/test-data.ts`
- [ ] 确认无任何文件引用该文件

---

### Step 7: 运行类型检查 (5 分钟) 🔴 [CRITICAL]

```bash
pnpm -F @01s-11comm/type typecheck
pnpm -F @01s-11comm/admin typecheck
```

- [ ] ✅ 类型项目无报错
- [ ] ✅ Admin 项目无报错

---

### Step 8: 功能测试 (15 分钟) 🔴 [CRITICAL]

- [ ] 列表页初始加载正常显示数据
- [ ] 搜索功能正常（筛选条件生效）
- [ ] 分页功能正常（页码切换、每页大小调整）
- [ ] Loading 状态正确显示
- [ ] 新增/编辑/删除功能正常（如有）
- [ ] 无 console 报错

---

## 🚨 常见错误快速排查

### 如果 typecheck 报错

| 错误类型                       | 快速检查                       |
| :----------------------------- | :----------------------------- |
| `Cannot find name 'xxx'`       | 检查是否从正确的模块导入类型   |
| `Type 'xxx' is not assignable` | 检查是否使用了正确的英文类型名 |
| `Import declaration conflicts` | 检查是否有重复导入或本地定义   |

### 如果列表页数据不显示

- [ ] 检查 Hook 是否传递了 `initialParams`
- [ ] 检查 Nitro 接口路径是否正确
- [ ] 检查 `pureTableProps` 是否正确绑定到 `<PureTable>`
- [ ] 检查 mock 数据是否有数据

### 如果搜索/分页不工作

- [ ] 检查是否使用了 Hook 返回的 `updateParams`
- [ ] 检查是否使用了 Hook 返回的分页函数
- [ ] 检查是否删除了手动实现的分页逻辑

---

## ✅ 完成标准

**单页面迁移完成的定义**：

1. 🔴 所有 [CRITICAL] 检查项全部通过
2. 🟡 至少 80% 的 [IMPORTANT] 检查项通过
3. ✅ `pnpm typecheck` 无报错
4. ✅ 所有功能测试通过
5. ✅ 无 console 报错或警告

---

## 📊 进度追踪模板

```markdown
## 迁移进度：{页面名称}

- [x] Step 1: 类型定义 ✅
- [x] Step 2: Mock 数据 ✅
- [x] Step 3: Nitro 接口 ✅
- [x] Step 4: API Hook ✅
- [x] Step 5: 列表页改写 ✅
- [x] Step 6: 删除旧文件 ✅
- [x] Step 7: 类型检查 ✅
- [x] Step 8: 功能测试 ✅

**完成时间**：YYYY-MM-DD HH:mm
**遇到的问题**：无 / {描述问题}
**解决方案**：无 / {描述解决方案}
```

---

## 🔗 相关文档

|    遇到问题    |                                                            查看文档                                                             |
| :------------: | :-----------------------------------------------------------------------------------------------------------------------------: |
| 不知道从哪开始 |                                            [000-CORE-RULES.md](./000-CORE-RULES.md)                                             |
|  需要详细步骤  |                                            [index.md (migration-guide)](./index.md)                                             |
| Nitro 接口写法 |         [nitro-api/spec.md](../../../../../openspec/changes/migrate-static-data-to-nitro-query/specs/nitro-api/spec.md)         |
| API Hook 写法  |     [data-fetching/spec.md](../../../../../openspec/changes/migrate-static-data-to-nitro-query/specs/data-fetching/spec.md)     |
|   列表页改造   | [list-page-pattern/spec.md](../../../../../openspec/changes/migrate-static-data-to-nitro-query/specs/list-page-pattern/spec.md) |
|  类型错误修复  |                       [.claude/agents/fix-type-error.md](../../../../../.claude/agents/fix-type-error.md)                       |
