# business-type-migration Specification

## Purpose
TBD - created by archiving change migrate-form-ts-to-types-pkg. Update Purpose after archive.
## Requirements
### Requirement: 识别需要迁移的业务类型 (Step 1)

系统 MUST 识别 `form.ts` 文件中需要迁移到类型包的业务类型，并按照迁移标准进行分类。

**迁移标准:**

业务类型满足以下条件时应该迁移到类型包：

1. **表单数据类型** - 形如 `xxxFormVO` 的接口定义
2. **业务实体类型** - 表示业务实体的类型定义
3. **请求/响应类型** - API 请求和响应相关的类型定义
4. **选项相关类型** - 下拉选项、状态选项等类型定义

**保留标准:**

以下内容应该保留在 `form.ts` 文件中，不迁移：

1. **defaultForm 常量** - `export const defaultForm: XXX = {}`
2. **表单 Props 类型** - `export interface xxxFormProps`
3. **组件特定类型** - 仅在当前组件使用的类型

#### Scenario: 识别表单数据类型

- **GIVEN** 检查 `property-manage/contract-manage/first-party/components/form.ts`
- **WHEN** 分析文件内容
- **THEN** 识别出 `FirstPartyFormVO` 接口需要迁移
- **AND** 该接口包含表单数据的完整定义
- **AND** 符合 `xxxFormVO` 的命名模式

#### Scenario: 识别不需要迁移的内容

- **GIVEN** 检查同一文件中的 `defaultForm` 常量
- **WHEN** 评估是否应该迁移
- **THEN** 判定为不需要迁移
- **AND** 理由：defaultForm 是组件特定的默认值，不属于业务类型
- **AND** `FirstPartyFormProps` 也不需要迁移
- **AND** 理由：表单 Props 是组件特定的类型

#### Scenario: 识别中文命名的类型

- **GIVEN** 发现有使用中文命名的类型或字段
- **WHEN** 记录需要规范化的内容
- **THEN** 标记该类型需要进行英文命名转换
- **AND** 记录字段名和类型名的中英文对照关系

---

### Requirement: 创建或更新类型包中的业务类型文件 (Step 2)

基于路由结构，系统 MUST 在 `apps/type/src/business/` 目录下创建与 form.ts 文件对应的业务类型文件。

**目录映射规则:**

Admin 项目路径 → Type 项目路径：
- `apps/admin/src/pages/xxx-manage/yyy-manage/zzz/components/form.ts`
- `apps/type/src/business/xxx-manage/yyy-manage/zzz.ts`

**文件创建标准:**

1. **继承现有内容**：如果目标文件已存在，应该保留现有内容
2. **添加类型导入**：导入 `OptionsType` 和其他必要类型
3. **保持命名一致**：文件名使用 kebab-case，类型名使用 PascalCase

#### Scenario: 创建新的业务类型文件

- **GIVEN** 需要为 `cancel-fee` 创建类型文件
- **WHEN** 创建 `apps/type/src/business/property-manage/expense-manage/cancel-fee.ts`
- **THEN** 文件包含必要的导入语句
- **AND** 文件使用 kebab-case 命名
- **AND** 运行 `pnpm -F @01s-11comm/type typecheck` 无报错

#### Scenario: 更新现有业务类型文件

- **GIVEN** `first-party.ts` 文件已存在
- **WHEN** 需要添加 `FirstPartyFormVO` 类型
- **THEN** 在现有文件末尾添加新的类型定义
- **AND** 保持原有内容不变
- **AND** 添加适当的 JSDoc 注释

#### Scenario: 确定正确的文件路径

- **GIVEN** Admin 路径为 `apps/admin/src/pages/operation-team/data-manage/community-information/components/form.ts`
- **WHEN** 确定类型包路径
- **THEN** 路径为 `apps/type/src/business/operation-team/data-manage/community-information.ts`
- **AND** 遵循相同的目录层级结构

---

### Requirement: 迁移业务类型到类型包 (Step 3)

系统 SHALL 将识别出的业务类型从 form.ts 文件迁移到类型包中，并进行必要的规范化处理。

**迁移规范:**

1. **保留 JSDoc 注释**：必须保留原有的 JSDoc 注释
2. **英文命名转换**：将中文命名转换为英文命名
3. **类型定义完整**：确保类型定义的完整性
4. **导出语句正确**：使用正确的 export 语法

**命名转换规则:**

- 类型名：使用 PascalCase，语义明确的英文命名
- 字段名：使用 camelCase，语义明确的英文命名
- 保留中文注释：在 JSDoc 中保留中文说明

#### Scenario: 迁移表单数据类型

- **GIVEN** 需要迁移 `FirstPartyFormVO` 类型
- **WHEN** 将类型迁移到类型包
- **THEN** 在类型文件中添加完整的类型定义
- **AND** 保留所有字段的 JSDoc 注释
- **AND** 使用英文命名：`contractFirstPartyFormVO`
- **AND** 导出类型：`export type ContractFirstPartyFormVO = FirstPartyFormVO;`

#### Scenario: 处理中文命名的字段

- **GIVEN** 发现有中文字段名如 `员工`、`时间`
- **WHEN** 转换为英文命名
- **THEN** `员工` → `employee`，`时间` → `time`
- **AND** 在 JSDoc 中保留中文说明
- **AND** 确保类型安全

#### Scenario: 迁移复杂的嵌套类型

- **GIVEN** 需要迁移包含嵌套对象的复杂类型
- **WHEN** 迁移到类型包
- **THEN** 保持嵌套结构完整
- **AND** 确保所有引用的类型都已正确导入或定义
- **AND** 类型检查通过

---

### Requirement: 更新 form.ts 文件导入 (Step 4)

系统 SHALL 在完成业务类型迁移后，更新 form.ts 文件以从类型包导入迁移的类型。

**导入规范:**

1. **使用包导入**：从 `@01s-11comm/type` 导入类型
2. **路径正确**：确保导入路径指向正确的类型文件
3. **类型别名**：为导入的类型创建适当的别名（如需要）
4. **删除旧定义**：删除已迁移的类型定义

**更新内容:**

1. **添加导入语句**：在文件顶部添加必要的导入
2. **更新类型引用**：更新所有使用该类型的地方
3. **创建类型别名**：保持向后兼容性
4. **保留本地内容**：保留 defaultForm 和 Props 类型

#### Scenario: 更新 form.ts 文件导入

- **GIVEN** 已将 `FirstPartyFormVO` 迁移到类型包
- **WHEN** 更新 form.ts 文件
- **THEN** 添加导入：`import type { ContractFirstPartyFormVO } from "@01s-11comm/type";`
- **AND** 创建类型别名：`type FirstPartyFormVO = ContractFirstPartyFormVO;`
- **AND** 删除原有的 `FirstPartyFormVO` 接口定义
- **AND** 保留 `defaultForm` 和 `FirstPartyFormProps`

#### Scenario: 处理多个类型的导入

- **GIVEN** 需要导入多个迁移的类型
- **WHEN** 添加导入语句
- **THEN** 使用单个导入语句：`import type { Type1, Type2, Type3 } from "@01s-11comm/type";`
- **AND** 或使用模块导入：`import type * as PropertyManage from "@01s-11comm/type/business/property-manage";`
- **AND** 根据使用场景选择合适的导入方式

#### Scenario: 验证导入路径正确性

- **GIVEN** 添加了新的导入语句
- **WHEN** 运行类型检查
- **THEN** `pnpm -F @01s-11comm/admin typecheck` 无报错
- **AND** IDE 能够正确识别类型
- **AND** 自动补全功能正常工作

---

### Requirement: 类型检查验证 (Step 5)

系统 SHALL 在完成业务类型迁移和导入更新后，进行全面的类型检查验证。

**验证标准:**

1. **Type 项目类型检查**：`pnpm -F @01s-11comm/type typecheck` 无报错
2. **Admin 项目类型检查**：`pnpm -F @01s-11comm/admin typecheck` 无报错
3. **功能验证**：相关页面功能正常
4. **类型引用正确**：所有类型引用都能正确解析

#### Scenario: Type 项目类型检查通过

- **GIVEN** 完成业务类型迁移
- **WHEN** 运行 `pnpm -F @01s-11comm/type typecheck`
- **THEN** 输出显示无类型错误
- **AND** 所有新添加的类型定义都正确
- **AND** 导入导出语句无问题

#### Scenario: Admin 项目类型检查通过

- **GIVEN** 完成 form.ts 文件更新
- **WHEN** 运行 `pnpm -F @01s-11comm/admin typecheck`
- **THEN** 输出显示无类型错误
- **AND** 所有类型引用都能正确解析
- **AND** 组件使用类型的地方无错误

#### Scenario: 页面功能验证

- **GIVEN** 完成类型迁移
- **WHEN** 启动 Admin 项目并访问相关页面
- **THEN** 页面正常加载
- **AND** 表单功能正常
- **AND** 数据提交和验证功能正常
- **AND** 控制台无类型相关错误

