# common-options-migration Specification

## Purpose
TBD - created by archiving change migrate-form-ts-to-types-pkg. Update Purpose after archive.
## Requirements
### Requirement: 识别 form.ts 文件中的下拉选项数组 (Step 1)

系统 MUST 识别 `form.ts` 文件中定义的所有下拉选项数组，并记录其使用情况。

**识别标准:**

下拉选项数组满足以下特征：

1. **类型符合 OptionsType** - 数组元素包含 `label` 和 `value` 属性
2. **导出为常量** - 使用 `export const` 定义
3. **用于表单配置** - 在表单组件中作为选项使用

**收集信息:**

对于每个识别的选项数组，记录：
- 选项数组名称
- 选项内容（label 和 value）
- 使用该选项的组件
- 所属业务模块

#### Scenario: 识别标准的下拉选项数组

- **GIVEN** 检查 form.ts 文件
- **WHEN** 发现以下代码：
```typescript
export const statusOptions: OptionsType = [
  { label: "启用", value: "启用" },
  { label: "禁用", value: "禁用" },
];
```
- **THEN** 识别为下拉选项数组
- **AND** 记录名称为 `statusOptions`
- **AND** 记录选项内容为启用/禁用

#### Scenario: 识别内联的选项定义

- **GIVEN** 检查 form.ts 文件
- **WHEN** 发现直接在表单配置中定义的选项：
```typescript
{
  label: "状态",
  prop: "status",
  valueType: "select",
  options: [
    { label: "启用", value: "启用" },
    { label: "禁用", value: "禁用" },
  ],
}
```
- **THEN** 识别为需要提取的下拉选项
- **AND** 建议将其提取为常量定义

#### Scenario: 记录选项使用情况

- **GIVEN** 识别出 `auditStatusOptions` 数组
- **WHEN** 分析其使用情况
- **THEN** 记录该选项在哪些表单字段中使用
- **AND** 记录是否在多个组件中使用
- **AND** 评估是否为公共选项的候选

---

### Requirement: 判断是否为公共选项 (Step 2)

基于收集的信息，系统 MUST 判断哪些下拉选项应该迁移到 `business-options.ts` 作为公共选项。

**公共选项判断标准:**

选项满足以下条件时应该作为公共选项：

1. **跨模块使用** - 在 2 个或以上的业务模块中出现
2. **内容完全一致** - 选项的 label 和 value 在所有地方完全相同
3. **语义通用** - 选项表示的业务概念是通用的

**典型公共选项:**

- **状态选项** - 启用/禁用、启用/停用等通用状态
- **审核状态选项** - 待审核/已通过/已拒绝等审核流程状态
- **合同类型选项** - 物业服务合同/租赁合同/维修合同等
- **性别选项** - 男/女/未知
- **是/否选项** - 是/否

#### Scenario: 识别通用的状态选项

- **GIVEN** 在多个 form.ts 文件中发现相同的状态选项
- **AND** 选项内容都是：`[{ label: "启用", value: "启用" }, { label: "禁用", value: "禁用" }]`
- **WHEN** 评估是否应该作为公共选项
- **THEN** 判定为公共选项
- **AND** 建议名称：`enableStatusOptions`
- **AND** 理由：跨多个模块使用，内容一致，语义通用

#### Scenario: 识别审核状态选项

- **GIVEN** 发现审核相关的选项
- **AND** 包含：待审核、已通过、已拒绝等状态
- **WHEN** 评估是否应该作为公共选项
- **THEN** 判定为公共选项
- **AND** 建议名称：`auditStatusOptions`
- **AND** 理由：审核流程是通用业务流程

#### Scenario: 排除模块特定选项

- **GIVEN** 发现某个选项仅在 expense-manage 模块使用
- **AND** 选项内容为特定的费用类型
- **WHEN** 评估是否应该作为公共选项
- **THEN** 判定为非公共选项
- **AND** 理由：模块特定，不具备通用性

---

### Requirement: 迁移到 business-options.ts 或业务类型文件 (Step 3)

系统 SHALL 根据判断结果，将下拉选项迁移到合适的位置。

**迁移规则:**

1. **公共选项** → `apps/type/src/common/business-options.ts`
2. **模块选项** → 对应的业务类型文件
3. **组件特定选项** → 保留在 form.ts 文件中

**迁移规范:**

- 保持 JSDoc 注释
- 使用英文命名
- 保持 OptionsType 类型
- 正确导出

#### Scenario: 迁移公共选项到 business-options.ts

- **GIVEN** `auditStatusOptions` 判定为公共选项
- **WHEN** 迁移到 `business-options.ts`
- **THEN** 添加到文件末尾：
```typescript
/**
 * @description 审核状态选项
 * Audit status options
 */
export const auditStatusOptions: OptionsType = [
  { label: "待审核", value: "待审核" },
  { label: "已通过", value: "已通过" },
  { label: "已拒绝", value: "已拒绝" },
];
```
- **AND** 保持英文命名
- **AND** 包含中英文注释

#### Scenario: 迁移模块选项到业务类型文件

- **GIVEN** `expenseTypeOptions` 仅在 expense-manage 模块使用
- **WHEN** 迁移到对应业务类型文件
- **THEN** 添加到 `apps/type/src/business/property-manage/expense-manage/common.ts`
- **AND** 或添加到具体的业务文件中
- **AND** 保持模块内可见性

#### Scenario: 处理重复的选项定义

- **GIVEN** 发现多个模块定义了相同的选项
- **WHEN** 迁移到 business-options.ts
- **THEN** 删除所有重复的定义
- **AND** 使用统一的公共选项名称
- **AND** 更新所有引用

---

### Requirement: 更新 form.ts 文件导入 (Step 4)

系统 SHALL 在完成选项迁移后，更新 form.ts 文件以从正确的位置导入选项。

**导入规范:**

1. **公共选项**：从 `@01s-11comm/type` 直接导入
2. **模块选项**：从具体的业务类型文件导入
3. **保留组件选项**：不需要导入

**更新步骤:**

1. 删除原有的选项定义
2. 添加正确的导入语句
3. 更新使用该选项的地方

#### Scenario: 导入公共选项

- **GIVEN** `auditStatusOptions` 已迁移到 business-options.ts
- **WHEN** 更新 form.ts 文件
- **THEN** 添加导入：`import { auditStatusOptions } from "@01s-11comm/type";`
- **AND** 删除原有的 `auditStatusOptions` 定义
- **AND** 确保使用处正常工作

#### Scenario: 导入模块特定选项

- **GIVEN** `expenseTypeOptions` 已迁移到业务类型文件
- **WHEN** 更新 form.ts 文件
- **THEN** 添加导入：`import { expenseTypeOptions } from "@01s-11comm/type/business/property-manage/expense-manage";`
- **AND** 或使用相对路径导入
- **AND** 根据项目规范选择导入方式

#### Scenario: 处理选项别名

- **GIVEN** 原文件使用 `localAuditStatusOptions` 名称
- **WHEN** 导入公共选项
- **THEN** 创建别名：`export const localAuditStatusOptions = auditStatusOptions;`
- **AND** 或直接使用公共选项名称
- **AND** 根据实际情况选择策略

---

### Requirement: 类型检查验证 (Step 5)

系统 SHALL 在完成下拉选项迁移和导入更新后，进行全面的类型检查验证。

**验证内容:**

1. 类型检查通过
2. 选项正确显示
3. 表单功能正常
4. 无重复定义

#### Scenario: 验证类型检查

- **GIVEN** 完成选项迁移
- **WHEN** 运行类型检查
- **THEN** `pnpm -F @01s-11comm/type typecheck` 无报错
- **AND** `pnpm -F @01s-11comm/admin typecheck` 无报错
- **AND** 所有选项数组的类型都正确

#### Scenario: 验证选项显示

- **GIVEN** 完成选项迁移
- **WHEN** 启动 Admin 项目
- **THEN** 下拉框正确显示选项
- **AND** 选项内容与迁移前一致
- **AND** 选项值的类型正确

#### Scenario: 验证表单功能

- **GIVEN** 完成选项迁移
- **WHEN** 测试表单提交
- **THEN** 表单能够正确提交选项值
- **AND** 数据验证正常
- **AND** 后台能正确接收选项值

#### Scenario: 验证无重复定义

- **GIVEN** 完成选项迁移
- **WHEN** 搜索重复的选项定义
- **THEN** 公共选项只在 business-options.ts 中定义
- **AND** 模块选项只在对应的业务文件中定义
- **AND** form.ts 文件中没有重复的数组字面量定义

