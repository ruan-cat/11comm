# API Hooks 规范

## Purpose

本规范定义了项目中所有 API Hook 的统一标准，确保代码一致性、可维护性和类型安全。所有基于 `useListQuery` 的 API Hook 函数必须遵循此规范。

## ADDED Requirements

### Requirement: API Hook 函数必须提供 initialParams 参数

所有基于 `useListQuery` 的 API Hook 函数 MUST 接受 `initialParams` 参数,并将其传递给 `useListQuery` 配置对象。

#### Scenario: API Hook 函数签名正确

- **WHEN** 定义新的 API Hook 函数
- **THEN** 函数签名必须包含 `initialParams: Partial<{Page}QueryParams>` 参数
- **AND** 必须在 `useListQuery` 调用中传递 `initialParams` 配置项

#### Scenario: API Hook 符合类型约束

- **WHEN** TypeScript 类型检查运行
- **THEN** `useListQuery` 的配置对象必须满足 `UseListQueryOptions` 接口要求
- **AND** `initialParams` 字段不能缺失或为 undefined

#### Scenario: 列表页正确调用 API Hook

- **WHEN** 列表页组件使用 API Hook
- **THEN** 必须传递初始查询参数(通常是 `plusSearchDefaultValues`)
- **AND** Hook 返回的数据能正确反映初始参数

### Requirement: API Hook 代码格式统一

所有 API Hook 文件 MUST 遵循标准模板格式,确保代码一致性和可维护性。

#### Scenario: 文件结构符合模板

- **WHEN** 创建或修改 API Hook 文件
- **THEN** 文件必须包含标准的 JSDoc 注释(中英文)
- **AND** 必须按顺序定义: API_URL 常量、QUERY_KEY_PREFIX 常量、Hook 函数、default 导出
- **AND** Hook 函数命名遵循 `use{Page}ListQuery` 格式

#### Scenario: 类型导入正确

- **WHEN** 导入业务类型
- **THEN** 必须从 `@01s-11comm/type` 包导入 ListItem 和 QueryParams 类型
- **AND** 类型名称必须与页面功能匹配

#### Scenario: 代码注释完整

- **WHEN** 编写 API Hook 代码
- **THEN** 文件顶部必须包含 `@file` 和 `@description` JSDoc 注释
- **AND** Hook 函数必须包含中英文双语注释
- **AND** 常量定义必须有 JSDoc 注释说明用途
## Requirements
### Requirement: API Hook 函数必须提供 initialParams 参数

所有基于 `useListQuery` 的 API Hook 函数 MUST 接受 `initialParams` 参数,并将其传递给 `useListQuery` 配置对象。

#### Scenario: API Hook 函数签名正确

- **WHEN** 定义新的 API Hook 函数
- **THEN** 函数签名必须包含 `initialParams: Partial<{Page}QueryParams>` 参数
- **AND** 必须在 `useListQuery` 调用中传递 `initialParams` 配置项

#### Scenario: API Hook 符合类型约束

- **WHEN** TypeScript 类型检查运行
- **THEN** `useListQuery` 的配置对象必须满足 `UseListQueryOptions` 接口要求
- **AND** `initialParams` 字段不能缺失或为 undefined

#### Scenario: 列表页正确调用 API Hook

- **WHEN** 列表页组件使用 API Hook
- **THEN** 必须传递初始查询参数(通常是 `plusSearchDefaultValues`)
- **AND** Hook 返回的数据能正确反映初始参数

### Requirement: API Hook 代码格式统一

所有 API Hook 文件 MUST 遵循标准模板格式,确保代码一致性和可维护性。

#### Scenario: 文件结构符合模板

- **WHEN** 创建或修改 API Hook 文件
- **THEN** 文件必须包含标准的 JSDoc 注释(中英文)
- **AND** 必须按顺序定义: API_URL 常量、QUERY_KEY_PREFIX 常量、Hook 函数、default 导出
- **AND** Hook 函数命名遵循 `use{Page}ListQuery` 格式

#### Scenario: 类型导入正确

- **WHEN** 导入业务类型
- **THEN** 必须从 `@01s-11comm/type` 包导入 ListItem 和 QueryParams 类型
- **AND** 类型名称必须与页面功能匹配

#### Scenario: 代码注释完整

- **WHEN** 编写 API Hook 代码
- **THEN** 文件顶部必须包含 `@file` 和 `@description` JSDoc 注释
- **AND** Hook 函数必须包含中英文双语注释
- **AND** 常量定义必须有 JSDoc 注释说明用途

