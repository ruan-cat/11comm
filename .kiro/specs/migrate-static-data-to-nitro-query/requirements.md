# Requirements Document

## Introduction

本需求文档描述了将 100 个列表页从本地假数据（test-data.ts）迁移到 Nitro 后端 + TanStack Query 数据获取体系的完整需求。这是一个破坏性变更（BREAKING CHANGE），将实现真正的前后端分离，统一类型系统，并引入现代化的数据管理能力。

## Glossary

- **列表页 (List Page)**: 显示数据列表的页面组件，位于 `apps/admin/src/pages/**/index.vue`
- **假数据 (Mock Data)**: 用于开发和测试的模拟数据，当前存储在 `test-data.ts` 文件中
- **类型库 (Type Library)**: 独立的 TypeScript 类型定义包 `@01s-11comm/type`
- **Nitro**: UnJS 提供的全栈服务端框架，用于创建 API 接口
- **TanStack Query**: Vue 3 数据获取和缓存库，提供响应式数据管理
- **业务路径 (Business Path)**: 基于三级路由的文件组织路径，如 `property-manage/expense-manage/house-charge`
- **Query Hook**: 基于 TanStack Query 封装的数据查询函数
- **JsonVO**: 统一的 JSON 响应包装类型
- **PageDTO**: 分页数据传输对象类型

## Requirements

### Requirement 1: 类型系统重构

**User Story:** 作为开发者，我希望有一个统一的类型系统，以便在多个应用间共享类型定义，减少重复代码。

#### Acceptance Criteria

1. WHEN 创建类型库时 THEN 系统 SHALL 在 `apps/type` 目录下初始化独立的 TypeScript 包
2. WHEN 定义业务类型时 THEN 系统 SHALL 使用英文驼峰命名法命名所有字段
3. WHEN 定义类型字段时 THEN 系统 SHALL 为每个字段提供 JSDoc 注释（包含中英文说明）
4. WHEN 组织类型文件时 THEN 系统 SHALL 按照业务路径的目录结构组织类型文件
5. WHEN 导出类型时 THEN 系统 SHALL 在每个层级使用 index.ts 统一导出

### Requirement 2: Nitro 服务端接口创建

**User Story:** 作为开发者，我希望创建标准化的服务端接口，以便前端能够通过 HTTP 请求获取数据。

#### Acceptance Criteria

1. WHEN 创建接口时 THEN 系统 SHALL 使用 POST 方法处理所有列表查询请求
2. WHEN 定义接口路径时 THEN 系统 SHALL 遵循 `/api/{module}/{sub-module}/{page}/list` 格式
3. WHEN 实现接口时 THEN 系统 SHALL 使用 Nitro v3 的 `defineHandler` 和 `readBody` 函数
4. WHEN 返回数据时 THEN 系统 SHALL 返回 `JsonVO<PageDTO<T>>` 统一格式
5. WHEN 处理查询参数时 THEN 系统 SHALL 实现字符串模糊匹配和枚举精确匹配
6. WHEN 处理分页时 THEN 系统 SHALL 支持 pageIndex 和 pageSize 参数

### Requirement 3: Mock 数据迁移

**User Story:** 作为开发者，我希望将假数据从前端迁移到服务端，以便实现真正的前后端分离。

#### Acceptance Criteria

1. WHEN 迁移假数据时 THEN 系统 SHALL 将数据从 `pages/*/test-data.ts` 移动到 `server/api/*/mock-data.ts`
2. WHEN 创建 Mock 数据时 THEN 系统 SHALL 使用类型库中定义的类型进行约束
3. WHEN 定义数据字段时 THEN 系统 SHALL 使用英文字段名
4. WHEN 提供数据量时 THEN 系统 SHALL 为每个接口提供至少 20-50 条测试数据

### Requirement 4: TanStack Query 集成

**User Story:** 作为开发者，我希望使用 TanStack Query 管理数据获取，以便获得缓存、重试、loading 状态等现代化特性。

#### Acceptance Criteria

1. WHEN 安装依赖时 THEN 系统 SHALL 安装 `@tanstack/vue-query` ^5.62.8
2. WHEN 初始化应用时 THEN 系统 SHALL 在 main.ts 中配置 VueQueryPlugin
3. WHEN 创建通用 Hook 时 THEN 系统 SHALL 实现 `useListQuery` 模板函数
4. WHEN 创建专用 Hook 时 THEN 系统 SHALL 为每个列表页创建 `use{Page}ListQuery` 函数
5. WHEN 配置缓存时 THEN 系统 SHALL 设置 staleTime 为 5 分钟，gcTime 为 10 分钟

### Requirement 5: 列表页改造

**User Story:** 作为开发者，我希望改造现有列表页使用新的数据获取方式，以便用户能够正常使用列表功能。

#### Acceptance Criteria

1. WHEN 改造列表页时 THEN 系统 SHALL 移除本地 test-data 导入
2. WHEN 获取数据时 THEN 系统 SHALL 使用对应的 Query Hook 获取数据
3. WHEN 显示加载状态时 THEN 系统 SHALL 使用 isLoading 控制 loading 显示
4. WHEN 数据变化时 THEN 系统 SHALL 通过 watch 监听 data 变化并更新 tableData
5. WHEN 搜索或分页时 THEN 系统 SHALL 更新 queryParams 触发自动重新请求

### Requirement 6: 表单组件更新

**User Story:** 作为开发者，我希望更新表单组件使用类型库的类型定义，以便保持类型一致性。

#### Acceptance Criteria

1. WHEN 更新表单类型文件时 THEN 系统 SHALL 从 `@01s-11comm/type` 导入所有类型
2. WHEN 移除本地类型时 THEN 系统 SHALL 删除 form.ts 中的本地类型定义
3. WHEN 使用选项数据时 THEN 系统 SHALL 从类型库导入 Options 常量
4. WHEN 更新表单组件时 THEN 系统 SHALL 使用英文字段名绑定表单项

### Requirement 7: 类型检查和验证

**User Story:** 作为开发者，我希望确保所有代码通过类型检查，以便在编译时发现类型错误。

#### Acceptance Criteria

1. WHEN 运行类型检查时 THEN 系统 SHALL 执行 `pnpm -F @01s-11comm/type typecheck` 无报错
2. WHEN 运行类型检查时 THEN 系统 SHALL 执行 `pnpm -F @01s-11comm/admin typecheck` 无报错
3. WHEN 构建类型库时 THEN 系统 SHALL 生成正确的 .d.ts 声明文件
4. WHEN 引用类型时 THEN 系统 SHALL 能够正确解析类型库的导出

### Requirement 8: 功能验证

**User Story:** 作为用户，我希望迁移后的列表页功能正常，以便能够正常使用系统。

#### Acceptance Criteria

1. WHEN 访问列表页时 THEN 系统 SHALL 正常加载并显示数据
2. WHEN 使用搜索功能时 THEN 系统 SHALL 根据筛选条件正确过滤数据
3. WHEN 切换分页时 THEN 系统 SHALL 正确显示对应页码的数据
4. WHEN 调整每页大小时 THEN 系统 SHALL 正确显示对应数量的数据
5. WHEN 数据加载中时 THEN 系统 SHALL 显示 loading 状态
6. WHEN 请求失败时 THEN 系统 SHALL 显示错误提示信息

### Requirement 9: 数据筛选逻辑

**User Story:** 作为开发者，我希望有统一的数据筛选逻辑，以便减少重复代码。

#### Acceptance Criteria

1. WHEN 筛选字符串字段时 THEN 系统 SHALL 使用模糊匹配（包含判断）
2. WHEN 筛选枚举字段时 THEN 系统 SHALL 使用精确匹配
3. WHEN 遇到空值时 THEN 系统 SHALL 自动忽略空字符串、null 和 undefined
4. WHEN 使用筛选工具时 THEN 系统 SHALL 使用 `filterDataByQuery` 通用函数
5. WHEN 筛选完成后 THEN 系统 SHALL 对结果进行分页处理

### Requirement 10: 迁移流程管理

**User Story:** 作为项目管理者，我希望按模块分阶段迁移，以便降低风险并及时发现问题。

#### Acceptance Criteria

1. WHEN 开始迁移时 THEN 系统 SHALL 按照 settingManage → devTeam → operationTeam → propertyManage 顺序迁移
2. WHEN 完成一个模块时 THEN 系统 SHALL 立即运行类型检查和功能测试
3. WHEN 发现问题时 THEN 系统 SHALL 停止迁移并修复问题后再继续
4. WHEN 迁移单个页面时 THEN 系统 SHALL 严格按照 10 个步骤的顺序执行
5. WHEN 更新进度时 THEN 系统 SHALL 及时更新 tasks.md 文件的任务状态

## Non-Functional Requirements

### Performance

- 列表页初始加载时间应在 2 秒内完成
- TanStack Query 缓存应减少 80% 的重复请求
- 分页切换应在 500ms 内完成

### Maintainability

- 所有类型定义集中在类型库中
- 接口实现遵循统一模板
- 代码注释完整，包含 JSDoc 说明

### Scalability

- 类型库支持多应用共享
- 接口设计支持未来对接真实数据库
- 数据筛选逻辑支持扩展新的字段类型

### Compatibility

- 必须兼容 Nitro 3.0.1-alpha.1
- 必须兼容 @ruan-cat/utils 4.16.0
- 必须支持 pnpm workspace monorepo
- 必须通过 TypeScript 严格类型检查
