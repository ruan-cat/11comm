# 设计文档: 批量修复列表页代码写法规范

## Context

### 背景

项目中约 99 个列表页 (`index.vue`) 的代码写法不符合 `migrate-static-data-to-nitro-query` 迁移指南中 Step 5 的规范。这些列表页使用了错误的 API Hook 调用方式、手动实现了大量应该由 Hook 提供的功能,并残留了旧数据方案的代码。

### 约束

1. **依赖关系**: 必须在 `fix-api-hooks-missing-initial-params` 变更完成后才能开始
2. **类型安全**: 所有修改必须满足 TypeScript 严格类型检查
3. **功能完整性**: 修复后的列表页必须保持所有原有功能正常
4. **代码一致性**: 所有列表页必须遵循统一的代码模板
5. **工作量**: 约 99 个文件需要修改,需要高效的系统化方法

### 利益相关者

- 开发团队: 需要维护类型安全和代码一致性
- 用户: 依赖这些列表页的查询、搜索、分页功能
- 维护人员: 需要清晰一致的代码结构

## Goals / Non-Goals

### Goals

1. 修复所有列表页,使其正确调用 API Hook 并传递初始参数
2. 删除所有手动定义的分页相关代码
3. 统一搜索函数写法,使用 `structuredClone` 替代 `cloneDeep`
4. 删除所有旧数据方案残留代码(`test-data.ts`、`loadTableData`)
5. 确保类型检查通过: `pnpm typecheck` 无报错
6. 验证所有列表页功能正常

### Non-Goals

1. 不重构列表页的业务逻辑
2. 不优化列表页的性能
3. 不修改表格列配置或搜索字段配置
4. 不创建新的列表页或删除现有列表页
5. 不修改 `useListQuery` composable 的核心实现

## Decisions

### Decision 1: 采用标准模板系统化修复

**决策**: 使用固定的代码模板,对每个列表页执行标准化修复

**重要前提**: 本次修复必须遵守来自 `migrate-static-data-to-nitro-query` 任务的严格执行规范，避免删改多余内容。详细规范请参考 `specs/list-pages/spec.md` 的"列表页改造的严格执行规范"章节。

**核心原则**:
1. **职责范围限定**: 只进行变量名、类型名替换和特定代码删除，不删改业务逻辑
2. **保留现有逻辑**: 弹框函数、表单初始化、按钮配置等业务逻辑必须完整保留
3. **类型安全优先**: 使用全局类型，按照 `fix-type-error` 规范处理类型问题
4. **位置和格式不变**: `definePage` 宏位置、代码格式不允许修改

**修复清单**(每个文件):

1. **修复 API Hook 调用**:

   ```typescript
   // ❌ 错误
   const { tableData, total, pageIndex, pageSize, isLoading } = usePaymentReviewListQuery();

   // ✅ 正确
   const {
   	tableData,
   	pureTableProps,
   	isFetching,
   	updateParams,
   	resetParams,
   	doFetch,
   	handlePageSizeChange,
   	handleCurrentPageChange,
   } = usePaymentReviewListQuery(plusSearchDefaultValues);
   ```

2. **删除手动定义的代码**:

   ```typescript
   // ❌ 删除这些代码
   const pagination = computed<PaginationProps>(() => ({...}));
   const pureTableProps = ref<PureTableProps>({...});
   function handlePageSizeChange(newPageSize: number) {...}
   function handleCurrentPageChange(currentPage: number) {...}
   ```

3. **修复搜索函数**:

   ```typescript
   // ❌ 错误
   function handleReSearch() {
   	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
   	resetParams();
   }

   // ✅ 正确
   function handleReSearch() {
   	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
   	resetParams();
   }
   ```

4. **删除旧数据方案**:

   ```typescript
   // ❌ 删除这些代码
   import { tableData as allTableData } from "./test-data";
   async function loadTableData() {...}
   onMounted(async () => { await loadTableData(); });
   ```

5. **修复模板绑定**:

   ```vue
   <!-- ❌ 错误 -->
   <PureTable :data="tableData" :pagination="pagination" :loading="isLoading.value" />

   <!-- ✅ 正确 -->
   <PureTable
   	:="pureTableProps"
   	:loading="isFetching"
   	@page-size-change="handlePageSizeChange"
   	@page-current-change="handleCurrentPageChange"
   />
   ```

**理由**:

- ✅ 符合迁移指南 Step 5 规范
- ✅ 消除代码冗余和重复
- ✅ 提高类型安全性
- ✅ 易于批量修复和验证

**备选方案**:

- ❌ 保留手动实现的代码: 违反规范,增加维护成本
- ❌ 逐步迁移部分功能: 造成代码不一致,增加复杂度

### Decision 2: 按模块分组执行修复

**决策**: 按照路由模块结构,分 17 个组完成修复,每完成一个模块立即验证

**分组依据**:

1. `settingManage.organizeManage` (7 个文件)
2. `settingManage.systemManage` (5 个文件)
3. `devTeam.menuManage` (3 个文件)
4. `devTeam.cacheManage` (1 个文件)
5. `devTeam.configManage` (4 个文件,1 个已正确)
6. `operationTeam.systemManage` (5 个文件)
7. `operationTeam.dataManage` (2 个文件)
8. `operationTeam.merchantManage` (2 个文件)
9. `operationTeam.reportConfiguration` (3 个文件)
10. `propertyManage.communityManage` (7 个文件)
11. `propertyManage.contractManage` (5 个文件)
12. `propertyManage.expenseManage` (16 个文件)
13. `propertyManage.housePropertyManage` (10 个文件)
14. `propertyManage.parkingManage` (4 个文件)
15. `propertyManage.patrolManage` (6 个文件)
16. `propertyManage.repairsManage` (7 个文件)
17. `propertyManage.reportManage` (13 个文件)

**验证策略**:

- 每个模块修复完成后运行: `pnpm -F @01s-11comm/admin typecheck`
- 抽查 1-2 个文件验证代码格式
- 记录进度到 `tasks.md`

**理由**:

- ✅ 与项目的路由结构保持一致
- ✅ 便于进度跟踪和问题定位
- ✅ 降低单次修改的复杂度
- ✅ 早发现早修复,避免积累错误

**备选方案**:

- ❌ 一次性修改所有文件: 风险高,难以定位问题
- ❌ 按字母顺序修改: 不符合业务逻辑,难以验证

### Decision 3: 使用 Edit 工具精确修复

**决策**: 使用 `Edit` 工具对每个文件进行精确的代码修改,避免使用脚本批量替换

**修改方式**:

1. 读取文件当前内容
2. 识别需要修改的代码段
3. 使用 Edit 工具精确替换
4. 验证修改结果

**理由**:

- ✅ 精确控制修改内容
- ✅ 保留现有代码结构和注释
- ✅ 易于验证和调试
- ✅ 符合项目要求(CLAUDE.md 禁止编写批处理脚本)

**备选方案**:

- ❌ 使用脚本批量替换: 违反项目规范,可能引入错误
- ❌ 重写整个文件: 工作量大,可能丢失现有逻辑

### Decision 4: 依赖 API Hook 修复完成

**决策**: 本变更必须在 `fix-api-hooks-missing-initial-params` 完成后才能开始

**依赖原因**:

1. 列表页需要调用已修复的 API Hook
2. API Hook 必须接受 `initialParams` 参数
3. 如果 API Hook 未修复,列表页修复会失败

**验证依赖**:

```bash
# 确认所有 API Hook 已修复
pnpm -F @01s-11comm/admin typecheck | grep "Property 'initialParams' is required"
# 应该没有输出
```

**理由**:

- ✅ 避免重复工作
- ✅ 确保类型安全
- ✅ 降低修复失败率

## Risks / Trade-offs

### Risk 1: 大量文件修改可能引入功能缺陷

**风险**: 修改 99 个文件,可能不小心删除重要业务逻辑

**缓解措施**:

1. 每个文件修复前仔细阅读代码
2. 只删除明确的冗余代码(pagination、pureTableProps、分页函数等)
3. 保留所有业务逻辑(表单验证、数据处理、操作按钮等)
4. 每个模块修复后立即功能测试
5. 使用 Git 版本控制,便于回滚

### Risk 2: 依赖 API Hook 修复可能延迟进度

**风险**: 如果 API Hook 修复未完成,列表页修复无法开始

**缓解措施**:

1. 明确标记依赖关系
2. 优先完成 API Hook 修复
3. 在 API Hook 修复过程中准备列表页修复计划
4. 如必要,可以先修复部分已完成 API Hook 的列表页

### Risk 3: 搜索函数改动可能影响现有功能

**风险**: 从 `cloneDeep` 改为 `structuredClone` 可能影响深拷贝行为

**缓解措施**:

1. `structuredClone` 是原生 API,性能更好且行为标准
2. 搜索参数通常是简单对象,不涉及复杂数据结构
3. 每个模块修复后测试搜索和重置功能
4. 如发现问题,及时回滚并记录

### Risk 4: 删除 test-data.ts 可能影响某些特殊页面

**风险**: 某些列表页可能仍需要本地测试数据

**缓解措施**:

1. 仔细检查每个 `test-data.ts` 的使用情况
2. 确认数据已迁移到 Nitro Mock 数据
3. 如发现特殊情况,保留该文件并记录原因
4. 优先删除已确认迁移完成的文件

## Migration Plan

### 阶段 1: 准备 (估计: 30 分钟)

1. 确认 `fix-api-hooks-missing-initial-params` 变更已完成
2. 阅读迁移指南 Step 5
3. 检查正确范例和错误范例
4. 运行初始类型检查,记录基线

### 阶段 2: 批量修复 (估计: 分 17 个模块,每个模块 1-3 小时)

1. 按模块顺序逐个修复
2. 每个文件执行 5 步修复清单
3. 每个模块完成后立即验证类型和功能
4. 记录进度到 `tasks.md`

**单个文件修复流程** (估计: 15-30 分钟/文件):

1. 读取文件 (2 分钟)
2. 修复 API Hook 调用 (5 分钟)
3. 删除手动代码 (5 分钟)
4. 修复搜索函数和模板 (5 分钟)
5. 删除旧数据方案 (3 分钟)
6. 验证修改结果 (5-10 分钟)

### 阶段 3: 全局验证 (估计: 1 小时)

1. 运行全局类型检查: `pnpm typecheck`
2. 运行代码格式检查: `pnpm -F @01s-11comm/admin lint`
3. 抽查 10-15 个文件验证格式
4. 启动开发服务器,测试 5-10 个列表页

### 阶段 4: 功能测试 (估计: 2 小时)

1. 测试每个模块的代表性列表页
2. 验证搜索、重置、分页功能
3. 检查 Loading 状态
4. 确认无 console 报错

### 阶段 5: 文档和归档 (估计: 30 分钟)

1. 更新技术文档
2. 创建修复报告(如需要)
3. 归档 OpenSpec 变更

### 回滚计划

如果修复后出现严重问题:

1. 使用 Git 回滚到修复前的提交
2. 分析问题原因
3. 调整修复策略
4. 考虑分更小的批次修复

## Open Questions

1. ✅ **已解决**: 是否所有列表页都需要传递 `plusSearchDefaultValues`?
   - **答**: 是的,这是规范要求

2. ✅ **已解决**: 是否所有 `test-data.ts` 文件都需要删除?
   - **答**: 是的,数据已迁移到 Nitro Mock 数据

3. ⏳ **待确认**: 是否有特殊列表页不遵循标准模板?
   - **建议**: 先修复标准列表页,特殊情况单独处理

4. ⏳ **待确认**: 修复完成后是否需要更新最佳实践文档?
   - **建议**: 是的,在迁移指南中补充常见问题和注意事项

## Implementation Notes

### 关键验收标准

1. ✅ 所有列表页正确调用 API Hook 并传递 `plusSearchDefaultValues`
2. ✅ 删除所有手动定义的 `pagination`、`pureTableProps`、分页函数
3. ✅ 使用 `isFetching` 而非 `isLoading`
4. ✅ 使用 `structuredClone` 而非 `cloneDeep`
5. ✅ 删除所有 `test-data.ts` 文件和相关导入
6. ✅ 类型检查通过: `pnpm typecheck` 无报错
7. ✅ 所有列表页功能正常(搜索、分页、加载)

### 参考文件

- 正确范例: `apps/admin/src/pages/dev-team/config-manage/center/index.vue`
- 错误范例: `apps/admin/src/pages/property-manage/expense-manage/payment-review/index.vue`
- 迁移指南: `openspec/changes/migrate-static-data-to-nitro-query/specs/migration-guide.md` Step 5
- useListQuery: `apps/admin/src/composables/use-list-query/index.ts`

### 修复模式标准模板

```vue
<script setup lang="ts">
// 1. 正确的搜索表单初始化
const plusSearchModelRef: FieldValues & Partial<{Page}QueryParams> = {
	// 搜索字段...
};
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

// 2. 正确的 API Hook 调用
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

// 3. 正确的搜索函数
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}
</script>

<template>
	<PureTable
		:="pureTableProps"
		:columns="dynamicColumns"
		:size="size"
		:loading="isFetching"
		@page-size-change="handlePageSizeChange"
		@page-current-change="handleCurrentPageChange"
	/>
</template>
```

### 常见错误和修复

| 错误                        | 修复方法                                     |
| --------------------------- | -------------------------------------------- |
| Hook 未传递 `initialParams` | 添加 `plusSearchDefaultValues` 参数          |
| 手动定义 `pagination`       | 删除,使用 Hook 返回的 `pureTableProps`       |
| 使用 `isLoading`            | 改为 `isFetching`                            |
| 使用 `cloneDeep`            | 改为 `structuredClone`                       |
| 导入 `test-data.ts`         | 删除导入和文件                               |
| 手动实现分页函数            | 删除,使用 Hook 返回的 `handlePageSizeChange` |

---

## 严格执行规范说明

本节详细说明在执行列表页修复时必须遵守的严格规范，这些规范来自 `migrate-static-data-to-nitro-query` 任务的实践总结。

### 职责范围界定

**允许修改的内容**:
1. 中文变量名 -> 英文变量名
2. 中文类型名 -> 英文类型名（来自 `@01s-11comm/type`）
3. `cloneDeep` -> `structuredClone`
4. 删除 `test-data.ts` 导入和 `loadTableData` 函数
5. 删除手动定义的 `pagination`、`pureTableProps`、分页函数

**严格禁止修改的内容**:
1. 弹框函数逻辑（`useMode`、`testAsync` 等）
2. 弹框实例创建逻辑
3. 表单 `props` 和 `defaultValues` 的定义
4. 按钮配置对象的业务逻辑（取消、重置、提交按钮的完整配置）
5. 表单字段的默认值和回退逻辑（`row?.field || defaultForm.field`）
6. `definePage` 宏的位置（必须在所有 import 之上）
7. 全局类型的使用（`TableColumnList`、`PureTableBarProps`）
8. 全局函数的导入（不要导入 `getRouteRank`）

### 关键注意事项

#### 1. 弹框处理规范

**错误做法（严格禁止）**:
- 删除表单实例声明
- 删除 `props` 和 `defaultValues` 变量
- 将 `defaultForm` 改成空对象 `{}`
- 删除表单字段的回退逻辑
- 删除按钮配置中的任何业务逻辑（如 `formComputed`、`useDoBeforeClose`、重置按钮）

**正确做法**:
- 只替换变量名和类型名
- 保留所有业务逻辑结构
- 保留完整的按钮配置（取消、重置、提交三个按钮）
- 保留 `defaultForm` 的使用和展开
- 保留字段回退逻辑

#### 2. 类型处理规范

**错误做法（严格禁止）**:
- 手动导入 `TableColumns` 类型替换 `TableColumnList`
- 删除 `PureTableBarProps` 类型约束
- 导入全局函数 `getRouteRank`
- 胡乱修改类型定义

**正确做法**:
- 使用全局类型 `TableColumnList` 和 `PureTableBarProps`
- 按照 `fix-type-error` 代理的规范处理类型错误
- 从 `@01s-11comm/type` 导入业务类型
- 保持全局函数和全局类型的使用方式不变

#### 3. 代码格式规范

**错误做法（严格禁止）**:
- 将 `definePage` 宏移动到 import 语句下方
- 修改 `definePage` 宏的内容
- 改变变量声明的顺序（`plusSearchModelRef` -> `plusSearchDefaultValues` -> `plusSearchModel` 必须在 API Hook 之前）

**正确做法**:
- 保持 `definePage` 宏在文件最上方
- 保持搜索表单变量的声明顺序
- 保持代码注释和格式

### 修复验证清单

每个文件修复后，必须通过以下验证：

1. ✅ 保留了弹框函数逻辑（`useMode`、`testAsync`）
2. ✅ 保留了弹框实例声明（`{Form}Instance`）
3. ✅ 保留了 `props` 和 `defaultValues` 变量
4. ✅ 保留了 `defaultForm` 的使用和展开
5. ✅ 保留了三个按钮的完整配置
6. ✅ `definePage` 宏在所有 import 之上
7. ✅ 使用全局类型 `TableColumnList` 和 `PureTableBarProps`
8. ✅ 未导入全局函数 `getRouteRank`
9. ✅ 只进行了变量名、类型名替换和特定代码删除
10. ✅ 未删减任何业务逻辑

### 常见错误案例

详细的错误案例和正确示例请参考 `specs/list-pages/spec.md` 的"列表页改造的严格执行规范"章节。

**特别注意**:
- 不要"添油加醋"：不要添加本来没有的代码
- 不要"画蛇添足"：不要修改不属于职责范围的代码
- 不要"自作主张"：严格按照规范执行，不要自己发挥

### 参考规范文档

- 详细规范: `specs/list-pages/spec.md` - "列表页改造的严格执行规范"章节
- 类型错误处理: `.claude/agents/fix-type-error.md`
- 迁移指南: `openspec/changes/migrate-static-data-to-nitro-query/specs/migration-guide.md` Step 5
- 列表页规范: `openspec/changes/migrate-static-data-to-nitro-query/specs/list-page-pattern/spec.md`
