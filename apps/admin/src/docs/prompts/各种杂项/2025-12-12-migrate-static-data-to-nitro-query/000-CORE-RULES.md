# 核心规范一页纸 (CORE RULES)

> **目的**：提供最关键的迁移规范，确保子代理快速掌握核心要点，避免幻觉和返工。
>
> **阅读时间**：3分钟
>
> **适用场景**：执行 `/openspec:apply migrate-static-data-to-nitro-query` 任务前必读

---

## ⚠️ 核心原则

**最重要的一条原则**：**只负责类型替换和变量名替换，不删改现有业务逻辑**

---

## 🔴 必须做的5件事 (CRITICAL)

### 1. ✅ 使用 Nitro v3 标准写法

```typescript
// ✅ 正确：从 nitro/h3 导入
import { defineHandler, readBody } from "nitro/h3";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<T>>> => {
  // ... 实现
  const response: JsonVO<PageDTO<T>> = { /* ... */ };
  return response;
});
```

**关键点**：
- 从 `nitro/h3` 导入，不是 `h3`
- 使用 `defineHandler`，不是 `defineEventHandler`
- 创建 `response` 变量并添加完整类型约束

### 2. ✅ 使用通用工具函数

```typescript
// ✅ 正确：使用 filterDataByQuery 工具函数
import { filterDataByQuery } from "server/utils/filter-data";
const filteredData = filterDataByQuery(mockData, filters);
```

**禁止**：手动编写 `if (xxx) { filteredData = filteredData.filter(...) }` 逻辑

### 3. ✅ API Hook 必须提供 initialParams 参数

```typescript
// ✅ 正确：提供 initialParams 参数
export function useXxxListQuery(initialParams: Partial<XxxQueryParams>) {
  return useListQuery<XxxListItem, XxxQueryParams>({
    queryKeyPrefix: "xxx",
    apiUrl: "/api/.../list",
    initialParams, // ✅ 必须传递
  });
}
```

### 4. ✅ 列表页只做变量名替换

```typescript
// ✅ 正确：只替换变量名
const { modeText, setMode, isAdd } = useMode(); // ✅ 保留
const [isFetchingT, setIsLoadingT] = useToggle(false); // ✅ 保留

// 只需要做：
// - 停车场表单 → ParkingLotForm
// - 停车场表单Instance → ParkingLotFormInstance
// - cloneDeep → structuredClone
```

**禁止删除**：
- ❌ 弹框函数逻辑（useMode, useToggle, testAsync）
- ❌ 表单实例代码
- ❌ openDialog 按钮配置
- ❌ useDoBeforeClose 调用
- ❌ 重置按钮配置

### 5. ✅ 运行 typecheck 验证

```bash
pnpm -F @01s-11comm/type typecheck
pnpm -F @01s-11comm/admin typecheck
```

---

## 🔴 禁止做的3件事 (CRITICAL)

### 1. ❌ 不要创建中文类型别名

```typescript
// ❌ 错误：创建中文类型别名
export type 巡检方式 = PatrolMethodType;
export type 任务状态 = TaskStatusType;
export const 费用类型 = contractTypeOptions;

// ✅ 正确：直接使用英文类型
export type PatrolMethodType = "...";
export const contractTypeOptions: OptionsType = [...];
```

### 2. ❌ 不要删除现有的弹框/表单逻辑

```typescript
// ❌ 错误：删掉了 props 和 defaultValues
const parkingLotFormVO = isAdd.value ? structuredClone({}) : structuredClone({ ...row });

// ✅ 正确：保留完整结构
const parkingLotFormVO: ParkingLotFormVO = isAdd.value
  ? structuredClone(defaultForm)
  : structuredClone({ ...defaultForm, ...row, /* ... */ });

const props: ParkingLotFormProps = {
  form: parkingLotFormVO,
  defaultValues: parkingLotFormVO,
};
```

### 3. ❌ 不要手动编写 filter 逻辑

```typescript
// ❌ 错误：手动编写 filter
let filteredData = [...mockData];
if (configName) {
  filteredData = filteredData.filter(item => item.configName.includes(configName));
}

// ✅ 正确：使用工具函数
const filteredData = filterDataByQuery(mockData, filters);
```

---

## 🟡 重要注意事项 (IMPORTANT)

| 规范项 | 正确做法 | 错误做法 |
|:---|:---|:---|
| 深克隆函数 | `structuredClone` | ~~`cloneDeep`~~ |
| definePage 位置 | 在最上面 | ~~在 import 下面~~ |
| 表格列类型 | `TableColumnList` (全局) | ~~`TableColumns[]`~~ |
| Loading 状态 | `isFetching` | ~~`isLoading`~~ |
| 分页函数 | Hook 返回的函数 | ~~手动实现~~ |
| 搜索函数 | 固定写法（见下方） | ~~调用 loadTableData~~ |

**搜索函数固定写法**：

```typescript
/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
  plusSearchModel.value = structuredClone(plusSearchDefaultValues);
  resetParams();
}

/** 执行搜索 */
function handleSearch() {
  updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}
```

---

## 📋 快速检查清单 (5秒自检)

迁移单个列表页完成后，快速检查：

### Nitro 接口
- [ ] ✅ 从 `nitro/h3` 导入
- [ ] ✅ 使用 `filterDataByQuery`
- [ ] ✅ 创建 `response` 变量

### API Hook
- [ ] ✅ 提供 `initialParams` 参数

### 列表页
- [ ] ✅ 传递 `plusSearchDefaultValues` 给 Hook
- [ ] ✅ 保留了所有弹框/表单逻辑
- [ ] ✅ 只替换了变量名和类型名
- [ ] ✅ 删除了 test-data.ts 导入

### 类型检查
- [ ] ✅ `pnpm typecheck` 通过

---

## 🔗 详细文档链接

| 文档 | 用途 |
|:---|:---|
| [migration-guide.md](./index.md) | 完整迁移指南（10步骤） |
| [nitro-api/spec.md](../../../../../openspec/changes/migrate-static-data-to-nitro-query/specs/nitro-api/spec.md) | Nitro 接口详细规范 |
| [data-fetching/spec.md](../../../../../openspec/changes/migrate-static-data-to-nitro-query/specs/data-fetching/spec.md) | TanStack Query 详细规范 |
| [list-page-pattern/spec.md](../../../../../openspec/changes/migrate-static-data-to-nitro-query/specs/list-page-pattern/spec.md) | 列表页改造详细规范 |
| [.claude/agents/fix-type-error.md](../../../../../.claude/agents/fix-type-error.md) | 类型错误修复方法论 |

---

## 💡 遇到问题时的决策树

```
Q: 不确定是否应该删除某段代码？
A: 默认不删除，除非它是 test-data.ts 导入或 loadTableData 函数

Q: 不确定应该使用哪个类型？
A: 优先使用类型项目 (@01s-11comm/type) 的英文类型

Q: 不确定应该使用哪个函数？
A: 优先使用通用工具函数（filterDataByQuery、structuredClone、Hook 返回的函数）

Q: 遇到类型错误？
A: 先查看 fix-type-error.md，按照文档要求处理
```

---

## 📌 记住这句话

> **"只负责类型替换和变量名替换，不删改现有业务逻辑"**

遵循这个核心原则，就能避免 90% 的返工问题。
