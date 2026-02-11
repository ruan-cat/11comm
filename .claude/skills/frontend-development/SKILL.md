---
name: frontend-development
description: 前端开发指南与模式，涵盖 `apps/admin` (Vue 3 + TypeScript) 的标准组件用法、文件组织和数据获取模式。
license: MIT
---

# 前端开发技能 (Frontend Development)

本技能为使用 **Vue 3**、**TypeScript** 和项目 **UI 组件库**开发前端应用（`apps/admin`）提供指导。

## 核心原则 (Core Principles)

1.  **框架 (Framework)**: **Vue 3** (Composition API) + **TypeScript**。
2.  **状态管理 (State Management)**: 全局状态使用 `pinia`，本地状态使用 `ref`/`reactive`。
3.  **样式 (Styling)**: 使用 **Tailwind CSS** 或 scoped CSS。避免使用内联样式。
4.  **类型安全 (Type Safety)**: 严格使用 TypeScript。禁止 `any`。从类型注册表 (Type Registry) 导入类型。

## 标准模式 (Standard Patterns)

### 列表页面与数据获取 (List Pages & Data Fetching)

- **列表页模式**: 严格的变量声明顺序（Model Ref -> Defaults -> Model -> Hooks）。
- **API Hooks**: 使用 `useListQuery` 配合 `initialParams`。
- **搜索功能**: 使用 `structuredClone` 进行重置。
- **Mock 数据**: 在 `test-data.ts` 中使用字面量数组。
- **参考文档**: [列表页模式](references/list-page-pattern.md) | [API 数据获取](references/api-data-fetching.md) | [测试数据](references/test-data.md)

### 表单 (`form.ts`)

- **导出内容**: 仅导出 `Props` 接口和 `defaultForm` 常量。
- **Props 规范**: **必须**包含 `mode?: Mode` 字段。
- **导入规范**: 业务类型必须从 `@01s-11comm/type` 导入。
- **参考文档**: [表单标准](references/form-standards.md)

## 目录结构 (Directory Structure)

- `src/pages`: 页面组件，按路由组织。
- `src/components`: 可复用 UI 组件。
- `src/composables`: 逻辑复用（Hooks）。
- `src/api`: API 定义文件。

## 常见任务 (Common Tasks)

- **创建列表页**: 如果可用，请使用 `make-list-page` 代理。
- **添加表单**: 确保 `form.ts` 遵循标准导出和 Props 规范。

## 参考文档 (References)

- **[列表页模式](references/list-page-pattern.md)** - 变量声明顺序和响应式依赖规范。
- **[API 数据获取](references/api-data-fetching.md)** - `useListQuery` Hook 标准和集成方法。
- **[表单标准](references/form-standards.md)** - `form.ts` 导出规范和 Props 要求。
- **[测试数据](references/test-data.md)** - Mock 数据文件标准和规范。
