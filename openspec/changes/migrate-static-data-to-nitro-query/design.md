# 技术设计文档

## 1. Context

### 1.1 背景

当前项目有 98 个列表页使用本地假数据（`test-data.ts`），存在以下技术债务：

- 类型定义分散在各页面文件中
- 使用中文字段名，不符合国际化要求
- 前端本地过滤逻辑，无法模拟真实 API 行为
- 缺乏现代数据管理功能（缓存、重试、loading 状态）

### 1.2 利益相关者

- **前端开发团队**：需要维护 98 个列表页，期望统一数据获取方式
- **后端团队**：未来需要对接真实数据库，期望接口标准化
- **产品团队**：关注用户体验（loading 状态、错误提示）
- **QA 团队**：需要验证搜索、分页功能的正确性

### 1.3 约束条件

- **技术约束**：
  - 必须使用 Nitro 3.0.1-alpha.1（已安装）
  - 必须兼容现有的 @ruan-cat/utils 4.16.0
  - 必须支持 pnpm workspace monorepo
  - 必须通过 TypeScript 严格类型检查

- **业务约束**：
  - 不能破坏现有页面功能
  - 必须保持搜索和分页逻辑一致
  - 假数据内容不变（仅字段名英文化）

- **资源约束**：
  - 预计 12 周开发周期
  - 需要自动化工具减少手动工作
  - 优先迁移核心业务模块

---

## 2. Goals / Non-Goals

### 2.1 Goals

1. **统一类型系统** - 创建独立的 `apps/type` 包，集中管理所有业务类型
2. **全栈接口标准化** - 所有接口返回 `JsonVO<PageDTO<T>>` 格式
3. **现代数据管理** - 集成 TanStack Query，支持缓存、重试、loading
4. **英文化字段名** - 所有类型字段使用驼峰命名法，JSDoc 提供中英文说明
5. **前后端分离** - 假数据迁移到 server/api，为后续数据库对接做准备

### 2.2 Non-Goals

1. **对接真实数据库** - 本变更仅迁移假数据，不涉及数据库集成
2. **优化接口性能** - 不实现虚拟滚动、无限滚动等高级特性
3. **重构表单组件** - 仅迁移列表页数据获取，不改动表单逻辑
4. **多语言支持** - 仅在 JSDoc 注释中提供中英文，不实现 i18n
5. **旧数据迁移工具** - 不提供从旧版本数据自动迁移的工具

---

## 3. Technical Decisions

### 3.1 Decision: 使用 `apps/type` 作为独立 monorepo 包

**选择理由：**

- ✅ 类型可被多个应用共享（admin、mobile 等）
- ✅ 独立构建和版本管理
- ✅ 强制类型与业务逻辑分离
- ✅ 支持 TypeScript 的声明文件生成

**替代方案及拒绝理由：**

- ❌ **方案 A**: 类型放在 `apps/admin/src/types/` - 无法跨应用共享
- ❌ **方案 B**: 使用 npm 发布的外部包 - 增加发布流程复杂度，不适合快速迭代

**实施细节：**

```json
// apps/type/package.json
{
	"name": "@01s-11comm/type",
	"version": "1.0.0",
	"main": "./dist/index.js",
	"types": "./dist/index.d.ts",
	"exports": {
		".": {
			"import": "./dist/index.js",
			"types": "./dist/index.d.ts"
		},
		"./business/*": {
			"import": "./dist/business/*.js",
			"types": "./dist/business/*.d.ts"
		}
	}
}
```

```json
// apps/admin/package.json
{
	"dependencies": {
		"@01s-11comm/type": "workspace:*"
	}
}
```

---

### 3.2 Decision: 所有接口使用 POST 方法

**选择理由：**

- ✅ 统一接口规范，减少认知负担
- ✅ POST 支持复杂查询参数（避免 URL 长度限制）
- ✅ 与未来 GraphQL/RPC 风格接口保持一致
- ✅ 便于在请求体中传递筛选条件

**替代方案及拒绝理由：**

- ❌ **方案 A**: 查询用 GET，增删改用 POST/PUT/DELETE - RESTful 风格但增加复杂度
- ❌ **方案 B**: 全部用 GET 并通过 query 参数传递 - URL 长度限制，不支持复杂对象

**实施细节：**

```typescript
// 必须要手动导入函数 在 nitro v3 版本内，必须在 nitro/h3 路径内手动导入函数
import { defineHandler, readBody } from "nitro/h3";

// server/api/property-manage/expense-manage/house-charge/list.post.ts
export default defineHandler(async (event): Promise<JsonVO<PageDTO<T>>> => {
	const body = await readBody<HouseChargeQueryParams>(event);
	// ...
});
```

---

### 3.3 Decision: 使用 TanStack Query 而非自建缓存

**选择理由：**

- ✅ 成熟的数据获取库，社区支持良好
- ✅ 内置缓存、重试、loading 状态管理
- ✅ 支持响应式查询（自动触发请求）
- ✅ 与 Vue 3 Composition API 完美集成
- ✅ 减少自建代码的维护成本

**替代方案及拒绝理由：**

- ❌ **方案 A**: 基于 Pinia + axios 自建缓存 - 需要大量自定义代码
- ❌ **方案 B**: 使用 VueUse 的 `useFetch` - 功能不如 TanStack Query 完善
- ❌ **方案 C**: 使用 SWR（React 生态）- 不适合 Vue 项目

**实施细节：**

```typescript
// src/main.ts
import { VueQueryPlugin } from "@tanstack/vue-query";

app.use(VueQueryPlugin, {
	queryClientConfig: {
		defaultOptions: {
			queries: {
				staleTime: 5 * 60 * 1000, // 5分钟
				gcTime: 10 * 60 * 1000, // 10分钟
				retry: 1,
				refetchOnWindowFocus: false,
			},
		},
	},
});
```

---

### 3.4 Decision: 字段名一步到位切换英文，不保留兼容层

**选择理由：**

- ✅ 避免长期维护兼容层的技术债
- ✅ 强制统一代码规范
- ✅ 简化类型定义
- ✅ 减少代码体积

**替代方案及拒绝理由：**

- ❌ **方案 A**: 同时保留中英文字段 - 增加维护成本，代码冗余
- ❌ **方案 B**: 使用字段别名映射 - 增加运行时开销，类型复杂度高
- ❌ **方案 C**: 渐进式迁移（部分页面保留中文）- 导致代码风格不一致

**风险缓解：**

- 提供详细的字段映射表
- 按模块增量迁移，每完成一个模块立即验证
- 编写自动化脚本辅助转换

---

### 3.5 Decision: 假数据迁移到 server/api，不保留在 pages/

**选择理由：**

- ✅ 实现真正的前后端分离
- ✅ 假数据与接口逻辑放在一起，便于维护
- ✅ 未来对接数据库只需修改 server 层
- ✅ 前端代码更清爽

**替代方案及拒绝理由：**

- ❌ **方案 A**: 保留在 pages/ 并由 Nitro 导入 - 破坏分层架构
- ❌ **方案 B**: 假数据直接写在接口文件内 - 代码可读性差，难以维护
- ❌ **方案 C**: 创建单独的 `apps/mock-data` 包 - 过度设计

---

## 4. Architecture

### 4.1 系统分层

```plain
┌─────────────────────────────────────────────────────────┐
│                   Browser (Vue 3 App)                    │
├─────────────────────────────────────────────────────────┤
│  Presentation Layer                                      │
│  - src/pages/**/index.vue (列表页组件)                   │
│  - src/pages/**/components/ (表单组件)                   │
├─────────────────────────────────────────────────────────┤
│  Data Fetching Layer (TanStack Query)                    │
│  - src/api/**/index.ts (Query Hooks)                     │
│  - src/composables/useListQuery.ts (通用模板)            │
├─────────────────────────────────────────────────────────┤
│  HTTP Client Layer                                       │
│  - @/utils/http (基于 @ruan-cat/utils 的 axios 封装)     │
├─────────────────────────────────────────────────────────┤
│  Type System (Cross-Cutting)                             │
│  - @01s-11comm/type (独立 TypeScript 包)                 │
│    - business/ (业务类型)                                │
│    - common/ (通用类型)                                   │
└─────────────────────────────────────────────────────────┘
                           ↓ HTTP POST
┌─────────────────────────────────────────────────────────┐
│                   Nitro Server (Node.js)                 │
├─────────────────────────────────────────────────────────┤
│  API Layer                                               │
│  - server/api/**/list.post.ts (接口处理器)               │
├─────────────────────────────────────────────────────────┤
│  Data Layer (Mock)                                       │
│  - server/api/**/mock-data.ts (假数据)                   │
│  - [Future] Database Connector                           │
└─────────────────────────────────────────────────────────┘
```

### 4.2 数据流

```plain
1. 用户操作（点击搜索/分页）
   ↓
2. 更新 queryParams (ref)
   ↓
3. TanStack Query 监听 queryParams 变化
   ↓
4. 触发 queryFn（调用 http.post）
   ↓
5. Nitro 接口接收请求
   ↓
6. 读取 mock-data，筛选和分页
   ↓
7. 返回 JsonVO<PageDTO<T>>
   ↓
8. TanStack Query 更新 data (ref)
   ↓
9. watch(data) 触发，更新 tableData
   ↓
10. 表格组件重新渲染
```

### 4.3 目录结构对应关系

```plain
页面路径: src/pages/property-manage/expense-manage/house-charge/
         ↓
类型定义: apps/type/src/business/property-manage/expense-manage/house-charge.ts
         ↓
API Hook: src/api/property-manage/expense-manage/house-charge/index.ts
         ↓
Nitro 接口: server/api/property-manage/expense-manage/house-charge/list.post.ts
         ↓
假数据: server/api/property-manage/expense-manage/house-charge/mock-data.ts
```

---

## 5. Implementation Strategy

### 5.1 迁移顺序

```plain
Phase 1: 基础设施（1周）
  ├─ 初始化 apps/type
  ├─ 安装 @tanstack/vue-query
  ├─ 创建 useListQuery 模板
  └─ 试点：property-manage/expense-manage/house-charge

Phase 2: dev-team（1周）
  └─ 8 个页面（小模块，快速验证）

Phase 3: operation-team（2周）
  └─ 14 个页面（中等复杂度）

Phase 4: property-manage（6周）
  └─ 60 个页面（最大模块）

Phase 5: setting-manage（1周）
  └─ 7 个页面（配置类）

Phase 6: 验证清理（1周）
  ├─ 类型检查
  ├─ 功能测试
  ├─ 删除旧文件
  └─ 文档更新
```

### 5.2 单页面迁移步骤

**CRITICAL**: 迁移单个列表页时，必须严格按照以下顺序执行，不允许跳步。

#### 执行顺序概览

每个列表页的迁移包含 **10 个严格顺序的步骤**：

```plain
Step 1: 创建类型定义文件（15分钟）
Step 2: 创建 Mock 数据文件（10分钟）
Step 3: 创建 Nitro 接口文件（20分钟）
Step 4: 创建前端 API Hook（10分钟）
Step 5: 改写列表页（30分钟）
Step 6: 删除旧的假数据文件（5分钟）
Step 7: 更新表单类型文件（15分钟）
Step 8: 更新表单组件（15分钟）
Step 9: 运行类型检查（5分钟）
Step 10: 测试验证（15分钟）
```

**总计：** 2.5 小时/页面

#### 详细步骤说明

##### Step 1: 创建类型定义文件

**文件路径**：`apps/type/src/business/{module}/{sub-module}/{page}.ts`

**任务内容**：
- 定义 `{Page}ListItem` 接口（所有字段英文+JSDoc注释）
- 定义 `{Page}QueryParams` 接口（包含分页参数）
- 定义相关枚举类型（如 Status、Type 等）
- 导出 Options 常量（下拉选择用）

**验收标准**：
- ✅ 所有字段名为英文驼峰命名
- ✅ 每个字段有 JSDoc 注释（中文+英文）
- ✅ 枚举值保持中文
- ✅ Options 导出正确

**关键规范**：遵循 [specs/type-system/spec.md](./specs/type-system/spec.md)

##### Step 2: 创建 Mock 数据文件

**文件路径**：`apps/admin/server/api/{module}/{sub-module}/{page}/mock-data.ts`

**任务内容**：
- 导入 `{Page}ListItem` 类型
- 创建 `mock{Page}Data` 数组
- 数据量：至少 20-50 条
- 数据类型约束满足 `{Page}ListItem`

**验收标准**：
- ✅ 类型约束正确
- ✅ 数据字段名为英文
- ✅ 数据量充足

##### Step 3: 创建 Nitro 接口文件

**文件路径**：`apps/admin/server/api/{module}/{sub-module}/{page}/list.post.ts`

**任务内容**：
- 导入必要的类型（JsonVO、PageDTO、{Page}ListItem、{Page}QueryParams）
- 使用 `defineHandler` 和 `readBody`（从 nitro/h3 导入）
- 实现筛选逻辑（字符串模糊匹配、枚举精确匹配）
- 实现分页逻辑（slice）
- 返回 `JsonVO<PageDTO<{Page}ListItem>>` 格式
- 添加 JSDoc 注释

**验收标准**：
- ✅ 使用 Nitro v3 写法
- ✅ 返回值有完整类型约束
- ✅ 筛选和分页逻辑正确
- ✅ 有 JSDoc 注释

**关键规范**：遵循 [specs/nitro-api/spec.md](./specs/nitro-api/spec.md)

##### Step 4: 创建前端 API Hook

**文件路径**：`apps/admin/src/api/{module}/{sub-module}/{page}/index.ts`

**任务内容**：
- 定义 `use{Page}ListQuery` Hook
- 调用通用 `useListQuery`
- 配置 `queryKeyPrefix`（完整路径）
- 配置 `apiUrl`（对应 Nitro 接口路径）

**验收标准**：
- ✅ queryKeyPrefix 格式正确
- ✅ apiUrl 路径正确
- ✅ 类型泛型参数正确

**关键规范**：遵循 [specs/data-fetching/spec.md](./specs/data-fetching/spec.md)

##### Step 5: 改写列表页

**文件路径**：`apps/admin/src/pages/{module}/{sub-module}/{page}/index.vue`

**任务内容**：
- 导入类型和 Hook
- 使用 `use{Page}ListQuery` 获取数据
- 移除本地 test-data 导入
- 配置搜索和分页
- 使用 `isLoading` 控制 loading 状态
- 监听 data 变化更新 tableData

**验收标准**：
- ✅ 无 test-data 导入
- ✅ 使用 TanStack Query Hook
- ✅ 搜索和分页功能正常
- ✅ loading 状态正确

**关键规范**：遵循 [specs/list-page-pattern/spec.md](./specs/list-page-pattern/spec.md)

##### Step 6: 删除旧的假数据文件

**文件路径**：`apps/admin/src/pages/{module}/{sub-module}/{page}/test-data.ts`

**任务内容**：
- 删除文件
- 确保无任何文件引用

**验收标准**：
- ✅ 文件已删除
- ✅ 无导入引用报错

##### Step 7: 更新表单类型文件

**文件路径**：`apps/admin/src/pages/{module}/{sub-module}/{page}/components/form.ts`

**任务内容**：
- 从 `@01s-11comm/type` 导入类型
- 移除本地类型定义
- 使用类型库提供的 Options
- 字段名改为纯英文

**验收标准**：
- ✅ 所有类型从类型库导入
- ✅ 无本地类型定义
- ✅ Options 从类型库导入

##### Step 8: 更新表单组件

**文件路径**：`apps/admin/src/pages/{module}/{sub-module}/{page}/components/form.vue`

**任务内容**：
- 导入类型库的 Options
- 更新表单项配置
- 使用纯英文类型
- prop 字段名更新为英文

**验收标准**：
- ✅ Options 从类型库导入
- ✅ 表单项配置正确
- ✅ 类型约束正确

##### Step 9: 运行类型检查

**命令**：`pnpm typecheck`

**任务内容**：
- 运行类型检查
- 修复所有类型报错
- 确保类型库和 admin 项目无报错

**验收标准**：
- ✅ typecheck 通过
- ✅ 无类型报错

##### Step 10: 测试验证

**任务内容**：
- 启动开发服务器测试列表加载
- 测试搜索功能
- 测试分页功能
- 测试新增/编辑/删除功能
- 测试 loading 状态
- 测试错误处理

**验收标准**：
- ✅ 所有功能正常
- ✅ 无 console 报错
- ✅ 数据加载正确

#### 步骤依赖关系

- **Step 1-2**: 数据层基础，必须先完成
- **Step 3**: 依赖 Step 1-2，创建 API 接口
- **Step 4**: 依赖 Step 3，封装数据查询
- **Step 5**: 依赖 Step 4，页面集成
- **Step 6-8**: 清理和类型迁移，依赖 Step 5
- **Step 9**: 类型验证，确保所有步骤正确
- **Step 10**: 功能验证，最终确认

### 5.3 自动化策略

**Phase 1-2**: 手动迁移，积累经验和模板

**Phase 3-5**: 编写脚本自动化

推荐脚本：

1. `generate-types.js` - 自动生成类型文件
2. `generate-api.js` - 自动生成 Nitro 接口和 mock-data
3. `generate-hooks.js` - 自动生成 Query Hook

---

## 6. Data Model

### 6.1 类型定义规范

```typescript
// apps/type/src/business/{module}/{sub-module}/{page}.ts

// 1. 枚举类型（使用联合类型）
/** 费用标识 Expense identifier */
export type ExpenseIdentifier = "周期性费用" | "一次性费用";

// 2. 列表数据接口
/**
 * 房屋收费列表数据
 * House charge list item
 */
export interface HouseChargeListItem {
	/** 费用项目 Expense item */
	expenseItem: string;
	/** 费用标识 Expense identifier */
	expenseIdentifier: ExpenseIdentifier;
	// ...
}

// 3. 查询参数接口
/**
 * 房屋收费查询参数
 * House charge query parameters
 */
export interface HouseChargeQueryParams {
	/** 房屋编号 House number */
	houseNumber?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

// 4. 选项常量
/** 费用标识选项 Expense identifier options */
export const expenseIdentifierOptions: OptionsType = [
	{ label: "周期性费用", value: "周期性费用" },
	{ label: "一次性费用", value: "一次性费用" },
];
```

### 6.2 接口返回格式

```typescript
// JsonVO<PageDTO<T>> 结构
{
  "success": true,           // 请求是否成功
  "code": 200,               // HTTP 状态码
  "message": "查询成功",      // 提示消息
  "data": {                  // 分页数据
    "list": [...],           // T[] - 数据列表
    "total": 50,             // 总记录数
    "pageIndex": 1,          // 当前页码
    "pageSize": 10,          // 每页大小
    "totalPages": 5          // 总页数
  },
  "timestamp": 1234567890    // 时间戳
}
```

---

## 7. API Specification

### 7.1 接口路径规范

```plain
模式: /api/{module}/{sub-module}/{page}/list

示例:
/api/property-manage/expense-manage/house-charge/list
/api/dev-team/config-manage/center/list
/api/operation-team/data-manage/property-management-company/list
```

### 7.2 接口实现模板

```typescript
// 必须要手动导入函数 在 nitro v3 版本内，必须在 nitro/h3 路径内手动导入函数
import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, XXXListItem, XXXQueryParams } from "@01s-11comm/type";
import { mockXXXData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<XXXListItem>>> => {
	const body = await readBody<XXXQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, ...filters } = body;

	// 数据筛选
	let filteredData = [...mockXXXData];
	Object.keys(filters).forEach((key) => {
		if (filters[key]) {
			filteredData = filteredData.filter(/* 筛选逻辑 */);
		}
	});

	// 分页处理
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	// 4. 返回标准格式 必须要用完整的对象来约束返回的数据格式
	/** 返回标准格式 */
	const response: JsonVO<PageDTO<HouseChargeListItem>> = {
		success: true,
		code: 200,
		message: "查询成功",
		data: {
			list: pageData,
			total,
			pageIndex,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		},
	};

	return response;
});
```

---

## 8. Risks / Trade-offs

### 8.1 技术风险

|               风险               | 概率 | 影响 |         缓解措施         |
| :------------------------------: | :--: | :--: | :----------------------: |
| Nitro 与 Vite 开发服务器端口冲突 |  中  |  中  |  使用不同端口，配置代理  |
|   TanStack Query 学习曲线陡峭    |  低  |  低  |    提供详细文档和示例    |
|     类型库构建失败影响主应用     |  低  |  高  | CI 中单独构建 apps/type  |
|   字段名转换错误导致数据不显示   |  高  |  高  | 使用映射表，编写验证脚本 |

### 8.2 性能考虑

**优化项：**

- ✅ TanStack Query 自动缓存减少重复请求
- ✅ 分页减少单次数据量
- ✅ 使用 `staleTime` 避免频繁刷新

**暂不实现（留待后续）：**

- ❌ 虚拟滚动（数据量 <1000 条时不需要）
- ❌ 无限滚动（分页已足够）
- ❌ 预取（优化点不明显）

### 8.3 Trade-offs

**选择 A: 一步到位 vs 渐进式**

- ✅ 一步到位：代码风格统一，避免长期维护兼容层
- ❌ 渐进式：风险分散，但导致代码不一致

**最终选择：** 一步到位，但按模块分阶段迁移

**选择 B: 自动化 vs 手动**

- ✅ 自动化：节省时间，减少错误
- ❌ 手动：灵活性高，适合特殊情况

**最终选择：** Phase 1-2 手动，Phase 3-5 自动化

---

## 9. Migration Plan

### 9.1 回滚策略

**如果迁移失败：**

1. 保留原 `test-data.ts` 文件（不要立即删除）
2. 使用 git revert 回滚代码
3. 分析失败原因，修复后重新迁移

**检查点：**

- ✅ Phase 1 完成后，验证试点页面功能正常
- ✅ 每个模块完成后，运行 typecheck 和功能测试
- ✅ 发现问题立即停止，不继续迁移下一个模块

### 9.2 依赖管理

**构建顺序：**

```plain
1. apps/type (独立构建)
   ↓
2. apps/admin (依赖 apps/type)
```

**CI 配置：**

```yaml
# .github/workflows/ci.yml
jobs:
  build:
    steps:
      - name: Build type library
        run: pnpm -F @01s-11comm/type build
      - name: Build admin
        run: pnpm -F @01s-11comm/admin build
      - name: Type check
        run: pnpm -F @01s-11comm/admin typecheck
```

---

## 10. Open Questions

### 10.1 待澄清问题

- [x] **Q1**: 是否需要保留中文字段兼容层？
  - **A1**: 不需要，一步到位切换英文

- [x] **Q2**: 假数据是否需要保留在 pages/ 目录？
  - **A2**: 不需要，迁移到 server/api/

- [x] **Q3**: 是否需要接入真实数据库？
  - **A3**: 本变更不涉及，留待后续

- [ ] **Q4**: 自动化脚本由谁开发？
  - **待定**: 建议在 Phase 2 完成后，由主开发者编写

- [ ] **Q5**: 是否需要支持离线模式（Service Worker）？
  - **待定**: 与产品团队确认

### 10.2 后续优化方向

1. **性能优化**
   - 实现预取（prefetch）
   - 虚拟滚动（大数据量场景）

2. **用户体验**
   - 乐观更新（optimistic updates）
   - 骨架屏（Skeleton Screen）

3. **开发体验**
   - 类型自动生成脚本
   - 接口 Mock 数据自动同步

---

## 11. References

- [TanStack Query 文档](https://tanstack.com/query/latest/docs/vue/overview)
- [Nitro 文档](https://nitro.unjs.io/)
- [pnpm Workspace](https://pnpm.io/workspaces)
- [迁移计划报告](apps/admin/src/docs/reports/2025-12-12-static-data-migration-to-nitro-query-plan.md)
- [字段映射表](../proposal.md#impact)
