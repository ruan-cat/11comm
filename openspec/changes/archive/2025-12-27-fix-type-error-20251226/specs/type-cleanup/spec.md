# type-cleanup 规范增量

## ADDED Requirements

### Requirement: 修复 FieldValues 类型转换错误

当业务类型需要与 FieldValues 组合使用时，SHALL 使用 `as unknown as` 双重类型断言进行转换，以避免因缺少索引签名导致的类型错误。

#### Scenario: 表单组件类型转换

- **WHEN** 在 Vue 组件中需要将业务表单类型转换为 `FieldValues & BusinessFormVO`
- **THEN** 使用 `as unknown as FieldValues & BusinessFormVO` 进行类型断言
- **AND** 不修改业务类型定义，保持类型安全

### Requirement: 确保组合式函数正确导出所有方法

使用 `useListQuery` 等组合式函数时，SHALL 确保返回值类型定义包含所有实际返回的方法和属性，包括 `doFetch`。

#### Scenario: 列表查询组合式函数返回值

- **WHEN** 使用 `useListQuery` 组合式函数
- **THEN** 返回值类型必须包含 `doFetch` 方法定义
- **AND** 调用方能够正确解构和使用 `doFetch` 方法

### Requirement: 统一业务选项变量命名规范

业务选项变量 SHALL 使用英文驼峰命名，不得使用中文命名。所有选项变量应在类型项目的 `common/business-options.ts` 中统一定义和导出。

#### Scenario: 重命名中文选项变量

- **WHEN** 发现使用中文命名的选项变量（如 `提醒类型Options`）
- **THEN** 将其重命名为对应的英文驼峰命名（如 `reminderTypeOptions`）
- **AND** 在类型项目中添加或更新该选项的定义
- **AND** 更新所有使用该选项的后台项目文件

#### Scenario: 新增业务选项定义

- **WHEN** 后台项目需要使用某个业务选项但类型项目中不存在
- **THEN** 在 `apps/type/src/common/business-options.ts` 中添加该选项定义
- **AND** 确保选项使用英文驼峰命名
- **AND** 在 `apps/type/src/common/index.ts` 中导出该选项

### Requirement: 枚举类型值使用规范

枚举类型字段 SHALL 使用对应的英文枚举值或枚举常量，不得使用中文字符串或空字符串。

#### Scenario: 修复中文枚举值

- **WHEN** 枚举字段使用中文字符串值（如 `parkingLotType: "地下停车场"`）
- **THEN** 将其改为对应的英文枚举值（如 `parkingLotType: "underground"`）
- **AND** 确保值与类型定义中的枚举值匹配

#### Scenario: 修复空字符串枚举值

- **WHEN** 可选枚举字段初始值设为空字符串（如 `houseStatus: ""`）
- **THEN** 将其改为 `undefined`（如 `houseStatus: undefined`）
- **AND** 确保字段类型允许 `undefined` 值

### Requirement: import type 使用规范

对于运行时值（如常量、Options 变量），SHALL 使用普通 `import` 导入，不得使用 `import type` 导入。`import type` 仅用于纯类型定义。

#### Scenario: 修复 Options 导入方式

- **WHEN** Options 变量使用 `import type` 导入（如 `import type { expenseItemNameOptions }`）
- **THEN** 将其改为普通导入（如 `import { expenseItemNameOptions }`）
- **AND** 确保该变量可以在运行时使用

### Requirement: 补充业务类型定义

业务类型定义 SHALL 包含所有实际使用的属性。当发现类型定义缺失属性时，应及时补充到类型项目中。

#### Scenario: 补充列表项类型属性

- **WHEN** 列表项类型（如 `ReturnVisitListItem`）缺少某些属性
- **THEN** 在类型项目对应文件中补充这些属性定义
- **AND** 确保属性类型正确，使用可选标记 `?` 表示可选属性
- **AND** 运行类型检查验证修改正确

## MODIFIED Requirements

### Requirement: 清理类型项目的冗余 FormVO 导出

类型项目的业务模块 `index.ts` 文件中 SHALL 移除所有 `export type { XXXFormVO }` 的选择性导出，改用全量导出 `export * from "./xxx"`。所有缺失的类型定义应及时补充。

#### Scenario: 清理 contract-manage 模块导出

- **WHEN** 处理 `apps/type/src/business/property-manage/contract-manage/index.ts`
- **THEN** 将所有选择性导出改为全量导出 `export * from "./模块名"`

#### Scenario: 补充缺失的类型导出

- **WHEN** 后台项目导入类型时报错"模块中不存在指定的导出成员"
- **THEN** 检查类型项目中是否定义了该类型
- **AND** 如果类型存在但未导出，在对应的 `index.ts` 中添加导出
- **AND** 如果类型不存在，在对应模块中添加类型定义并导出
