# 设计文档: 修复 API Hooks 缺少 initialParams 参数

## Context

### 背景

项目中约 99 个 API Hook 函数违反了 `migrate-static-data-to-nitro-query` 迁移指南中 Step 4 的规范要求,缺少必填的 `initialParams` 参数。这些函数基于 `useListQuery` composable 二次封装,为各个列表页提供数据查询功能。

### 约束

1. **类型安全**: 必须满足 TypeScript 严格类型检查
2. **向后兼容**: 修改后的 API Hook 需要与现有列表页组件兼容
3. **代码一致性**: 所有 API Hook 必须遵循统一的代码模板
4. **工作量**: 约 99 个文件需要修改,需要系统化的方法

### 利益相关者

- 开发团队: 需要维护类型安全和代码一致性
- 列表页功能: 依赖这些 API Hook 的约 99 个列表页
- 类型系统: `@01s-11comm/type` 包的类型定义

## Goals / Non-Goals

### Goals

1. 修复所有 API Hook 函数,添加必填的 `initialParams` 参数
2. 确保类型检查通过: `pnpm typecheck` 无报错
3. 统一代码格式,符合迁移指南 Step 4 规范
4. 保持代码可维护性和一致性

### Non-Goals

1. 不修改 `useListQuery` composable 的核心实现
2. 不改变列表页组件的现有功能
3. 不涉及业务逻辑的优化或重构
4. 不创建新的 API Hook 或列表页

## Decisions

### Decision 1: 采用标准模板批量修复

**决策**: 使用固定的代码模板,系统化地修复所有 API Hook 文件

**模板格式**:

```typescript
/**
 * @file {页面名称} API Hook
 * @description {Page Name} API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import type { {Page}ListItem, {Page}QueryParams } from "@01s-11comm/type";

/** API 路径 */
const API_URL = "/api/{module}/{sub-module}/{page}/list";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "{page}";

/**
 * {页面名称}列表查询 Hook
 * {Page Name} list query hook
 */
export function use{Page}ListQuery(initialParams: Partial<{Page}QueryParams>) {
	return useListQuery<{Page}ListItem, {Page}QueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}

export default use{Page}ListQuery;
```

**理由**:

- ✅ 符合迁移指南 Step 4 规范
- ✅ 保持代码一致性
- ✅ 易于批量修改和验证
- ✅ 类型安全,满足 TypeScript 要求

**备选方案**:

- ❌ 将 `initialParams` 设为可选参数: 违反规范要求,不解决根本问题
- ❌ 修改 `useListQuery` 使 `initialParams` 可选: 降低类型安全性,影响其他模块

### Decision 2: 按模块分组执行修复

**决策**: 按照路由模块结构,分 17 个组完成修复

**分组依据**:

1. `settingManage.organizeManage` (7 个文件)
2. `settingManage.systemManage` (5 个文件)
3. `devTeam.menuManage` (3 个文件)
4. `devTeam.cacheManage` (1 个文件)
5. `devTeam.configManage` (4 个文件)
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

**理由**:

- ✅ 与项目的路由结构保持一致
- ✅ 便于进度跟踪和验证
- ✅ 降低单次修改的复杂度
- ✅ 易于定位和修复错误

**备选方案**:

- ❌ 一次性修改所有文件: 风险高,难以验证
- ❌ 按字母顺序修改: 不符合业务逻辑,难以理解

### Decision 3: 使用 Edit 工具逐个修复

**决策**: 使用 `Edit` 工具对每个文件进行精确的字符串替换

**修改模式**:

```typescript
// 旧代码 (错误)
export function use{Page}ListQuery() {
	return useListQuery<{Page}ListItem, {Page}QueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
	});
}

// 新代码 (正确)
export function use{Page}ListQuery(initialParams: Partial<{Page}QueryParams>) {
	return useListQuery<{Page}ListItem, {Page}QueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams,
	});
}
```

**理由**:

- ✅ 精确控制修改内容
- ✅ 保留现有代码注释和格式
- ✅ 易于验证修改结果
- ✅ 避免引入新的错误

**备选方案**:

- ❌ 使用脚本批量替换: 可能引入语法错误,不符合项目要求(CLAUDE.md 禁止编写批处理脚本)
- ❌ 重写整个文件: 工作量大,可能丢失现有信息

## Risks / Trade-offs

### Risk 1: 大量文件修改可能引入错误

**风险**: 修改 99 个文件,可能出现拼写错误或遗漏

**缓解措施**:

1. 每个模块修复后立即运行类型检查
2. 使用标准模板,确保一致性
3. 抽查 5-10 个文件,验证格式正确性
4. 最终运行 `pnpm typecheck` 全局验证

### Risk 2: 列表页组件可能需要同步修改

**风险**: 某些列表页可能未正确传递 `initialParams` 参数

**缓解措施**:

1. 优先修复 API Hook,观察类型报错
2. 根据类型报错定位需要修改的列表页
3. 确保列表页传递 `plusSearchDefaultValues` 作为初始参数
4. 参考正确范例 (dev-team/config-manage/center)

### Risk 3: TypeScript 类型检查可能暴露其他问题

**风险**: 修复 `initialParams` 后,可能暴露其他类型定义问题

**缓解措施**:

1. 记录修复前的类型报错基线
2. 区分本次修复引入的报错和原有报错
3. 仅修复与 `initialParams` 相关的报错
4. 其他类型问题记录到新的 issue 或 OpenSpec 提案

## Migration Plan

### 阶段 1: 准备 (估计: 30 分钟)

1. 验证 `useListQuery` 接口定义
2. 检查正确范例 (`dev-team/config-manage/center/index.ts`)
3. 运行初始类型检查,记录基线

### 阶段 2: 批量修复 (估计: 分 17 个模块,每个模块 30-60 分钟)

1. 按模块顺序逐个修复
2. 每个模块修复后运行类型检查
3. 记录进度到 `tasks.md`

### 阶段 3: 验证 (估计: 30 分钟)

1. 运行全局类型检查: `pnpm typecheck`
2. 运行代码格式检查: `pnpm -F @01s-11comm/admin lint`
3. 抽查文件验证格式正确性

### 阶段 4: 文档 (估计: 15 分钟)

1. 更新技术文档
2. 创建修复报告 (如需要)
3. 归档 OpenSpec 变更

### 回滚计划

如果修复后出现问题:

1. 使用 Git 回滚到修复前的提交
2. 重新评估修复策略
3. 考虑分阶段修复,先修复部分模块

## Open Questions

1. ✅ **已解决**: 是否所有列表页都使用 `plusSearchDefaultValues` 作为初始参数?
   - **答**: 是的,根据迁移指南 Step 5,列表页应传递 `plusSearchDefaultValues`

2. ✅ **已解决**: 是否需要同步修改列表页组件?
   - **答**: 可能需要,取决于列表页当前是否正确调用 API Hook

3. ⏳ **待确认**: 是否有特殊情况不需要 `initialParams` 参数?
   - **建议**: 暂无,所有 API Hook 都应遵循规范

4. ⏳ **待确认**: 修复完成后是否需要更新其他相关文档?
   - **建议**: 如有必要,在 `apps/admin/src/docs/reports` 创建修复报告

## Implementation Notes

### 关键验收标准

1. ✅ 所有 API Hook 函数签名包含 `initialParams: Partial<{Page}QueryParams>` 参数
2. ✅ 所有 `useListQuery` 调用传递 `initialParams` 配置项
3. ✅ 类型检查通过: `pnpm typecheck` 无报错
4. ✅ 代码格式符合迁移指南 Step 4 规范
5. ✅ 文件注释完整(JSDoc 中英文双语)

### 参考文件

- 正确范例: `apps/admin/src/api/dev-team/config-manage/center/index.ts`
- 错误范例: `apps/admin/src/api/property-manage/expense-manage/payment-review/index.ts`
- 迁移指南: `openspec/changes/migrate-static-data-to-nitro-query/specs/migration-guide.md`
- useListQuery: `apps/admin/src/composables/use-list-query/index.ts`
