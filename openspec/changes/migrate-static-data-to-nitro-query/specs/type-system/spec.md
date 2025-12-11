## ADDED Requirements

### Requirement: 类型库初始化

apps/type 类型库 SHALL 满足以下约束：

- 作为 monorepo 包发布，版本 1.0.0
- 提供 TypeScript 类型定义（.d.ts 文件）
- 从 @ruan-cat/utils 导出 JsonVO 和 PageDTO 类型
- 从 plus-pro-components 导出 OptionsType 类型
- 业务类型按模块目录组织，路径与 pages/ 对应

#### Scenario: 类型库构建成功

- **GIVEN** apps/type/package.json 配置正确
- **WHEN** 运行 pnpm -F @01s-11comm/type build
- **THEN** dist/ 目录生成 .js 和 .d.ts 文件
- **AND** package.json exports 字段配置正确

#### Scenario: 类型导入正常

- **GIVEN** apps/admin 依赖 @01s-11comm/type
- **WHEN** 在代码中导入 `import type { HouseChargeListItem } from "@01s-11comm/type"`
- **THEN** TypeScript 编译器识别类型，无报错
- **AND** IDE 提供类型提示和自动补全

---

### Requirement: 英文字段命名规范

所有业务类型 MUST 使用英文字段名：

- 采用驼峰命名法（camelCase）
- 不允许出现任何中文变量名
- 每个字段必须包含 JSDoc 注释，格式：`/** {中文} {English} */`
- 优先使用完整单词，避免缩写（除非是业界通用缩写如 ID、URL）
- 布尔类型字段使用 is/has/should 前缀

#### Scenario: 字段命名转换正确

- **GIVEN** 原字段名为 "费用项目"
- **WHEN** 迁移到类型文件
- **THEN** 字段名为 expenseItem
- **AND** JSDoc 注释为 `/** 费用项目 Expense item */`

#### Scenario: JSDoc 注释格式正确

- **GIVEN** 类型定义文件 house-charge.ts
- **WHEN** 检查所有字段注释
- **THEN** 每个字段都有 JSDoc 注释
- **AND** 注释格式为 `/** {中文描述} {English description} */`
- **AND** 中英文之间有一个空格分隔

#### Scenario: 枚举类型定义规范

- **GIVEN** 需要定义费用标识类型
- **WHEN** 创建类型定义
- **THEN** 使用 TypeScript 字面量联合类型：`type ExpenseIdentifier = "周期性费用" | "一次性费用"`
- **AND** 配套导出 Options 常量：`export const expenseIdentifierOptions: OptionsType = [...]`

---

### Requirement: 类型文件组织结构

类型文件 SHALL 按以下规则组织：

- 目录结构与 pages/ 目录完全对应
- 每个列表页对应一个独立类型文件
- 类型文件命名与页面目录名一致（kebab-case）
- 从 apps/type/index.ts 统一导出所有业务类型

#### Scenario: 目录结构对应关系

- **GIVEN** 页面路径 `src/pages/property-manage/expense-manage/house-charge/index.vue`
- **WHEN** 创建类型文件
- **THEN** 类型文件路径为 `apps/type/src/business/property-manage/expense-manage/house-charge.ts`
- **AND** 文件导出 HouseChargeListItem、HouseChargeQueryParams 等类型

#### Scenario: 类型统一导出

- **GIVEN** 所有业务类型文件已创建
- **WHEN** 从 apps/type/index.ts 导出
- **THEN** 支持以下导入方式：
  - `import type { HouseChargeListItem } from "@01s-11comm/type"`
  - `import type { CenterListItem, DictionaryListItem } from "@01s-11comm/type"`

---

### Requirement: 类型定义完整性

每个列表页的类型文件 MUST 包含：

- ListItem 接口（列表数据项）
- QueryParams 接口（查询参数）
- 枚举类型（如 Status、Type 等）
- Options 常量（用于下拉选择）

#### Scenario: ListItem 接口定义

- **GIVEN** 房屋收费列表页
- **WHEN** 定义 HouseChargeListItem
- **THEN** 包含所有显示字段（expenseItem, expenseType, status 等）
- **AND** 所有字段都有 JSDoc 注释
- **AND** 字段类型准确（string、枚举类型等）

#### Scenario: QueryParams 接口定义

- **GIVEN** 列表页需要搜索和分页
- **WHEN** 定义 HouseChargeQueryParams
- **THEN** 包含所有筛选字段（可选属性）
- **AND** 必须包含 pageIndex: number 和 pageSize: number
- **AND** 筛选字段类型与 ListItem 对应字段一致

#### Scenario: Options 常量定义

- **GIVEN** 页面有下拉选择（如费用类型）
- **WHEN** 定义 expenseTypeOptions
- **THEN** 类型为 OptionsType（从 plus-pro-components 导入）
- **AND** 数组元素格式为 `{ label: string, value: string }`
- **AND** 导出为常量：`export const expenseTypeOptions: OptionsType = [...]`

---

### Requirement: 类型与原数据结构兼容

迁移后的类型定义 MUST 与原 test-data.ts 结构兼容：

- 字段数量一致（不增不减）
- 字段语义对应（中文→英文）
- 枚举值保持不变（仍使用中文值）
- 数据结构层级不变

#### Scenario: 字段一一对应

- **GIVEN** 原 test-data.ts 的接口有 8 个字段
- **WHEN** 创建新类型 HouseChargeListItem
- **THEN** 新类型也有 8 个字段
- **AND** 每个字段都能找到原字段的对应关系

#### Scenario: 枚举值兼容性

- **GIVEN** 原字段 "费用标识" 值为 "周期性费用" | "一次性费用"
- **WHEN** 定义新类型 ExpenseIdentifier
- **THEN** 类型定义为 `type ExpenseIdentifier = "周期性费用" | "一次性费用"`
- **AND** 值仍为中文，不转换为英文

#### Scenario: 嵌套结构保持

- **GIVEN** 原数据无嵌套对象
- **WHEN** 迁移类型
- **THEN** 新类型也保持扁平结构
- **AND** 所有字段都是原始类型或枚举类型
