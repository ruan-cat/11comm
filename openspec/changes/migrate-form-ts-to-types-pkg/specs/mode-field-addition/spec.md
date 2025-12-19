# Mode 字段增加规范

## ADDED Requirements

**CRITICAL**: 在实施 mode 字段添加任务时，必须严格按照以下顺序执行，不允许跳步。

**执行顺序:**

1. **Step 1**: 字段定义（为所有 Props 接口添加 mode 字段）
2. **Step 2**: 类型检查（确保 mode 字段类型正确）
3. **Step 3**: 注释完善（添加 JSDoc 注释）
4. **Step 4**: 格式验证（验证字段格式规范）
5. **Step 5**: 功能测试（确保 mode 字段正常工作）

**步骤依赖关系:**

- Step 1 是添加阶段，为所有 Props 接口添加 mode 字段
- Step 2 是验证阶段，确保类型正确
- Step 3 是完善阶段，添加注释
- Step 4 是检查阶段，验证格式
- Step 5 是测试阶段，确保功能正常

**验收标准:**

每个步骤完成后，必须满足对应 Requirement 中的所有 Scenarios。

---

### Requirement: 字段定义 (Step 1)

系统 SHALL 为所有弹框组件的 Props 类型添加非必填的 `mode` 字段。

#### Scenario: 添加 mode 字段到类型项目中的 Props 接口

- **GIVEN** 类型项目中存在 `StaffInfoFormProps` 接口
- **WHEN** 添加 mode 字段
- **THEN** 接口包含 `mode?: Mode` 字段
- **AND** 字段标记为可选（使用 `?`）
- **AND** 类型使用 `Mode`（全局类型）

#### Scenario: 添加 mode 字段到 form.ts 中的 Props 接口

- **GIVEN** form.ts 文件中存在 `AddFormProps` 接口
- **WHEN** 添加 mode 字段
- **THEN** 接口包含 `mode?: Mode` 字段
- **AND** 字段标记为可选（使用 `?`）
- **AND** 类型使用 `Mode`

#### Scenario: 为多个 Props 接口添加 mode 字段

- **GIVEN** 文件中包含 `AddFormProps`、`EditFormProps`、`ViewFormProps` 三个接口
- **WHEN** 为每个接口添加 mode 字段
- **THEN** 所有三个接口都包含 `mode?: Mode` 字段
- **AND** 每个字段都标记为可选

#### Scenario: 更新已有 mode 字段的接口

- **GIVEN** 接口中已有 `mode?: string` 字段
- **WHEN** 更新字段类型
- **THEN** 改为 `mode?: Mode`
- **AND** 保留可选标记

---

### Requirement: 类型检查 (Step 2)

系统 SHALL 确保 mode 字段使用正确的类型。

#### Scenario: 验证 Mode 类型

- **GIVEN** 添加了 mode 字段
- **WHEN** 检查字段类型
- **THEN** 使用 `Mode` 类型（注意大小写）
- **AND** 不使用 `mode`（小写）或 `string` 类型

#### Scenario: 验证可选标记

- **GIVEN** 添加了 mode 字段
- **WHEN** 检查字段可选性
- **THEN** 使用 `mode?: Mode` 格式
- **AND** 不使用 `mode: Mode`（缺少 `?`）

#### Scenario: 验证全局类型

- **GIVEN** 使用 Mode 类型
- **WHEN** 检查导入
- **THEN** Mode 是全局类型，无需导入
- **AND** 如果项目配置要求导入，则从正确位置导入

#### Scenario: 类型检查命令通过

- **GIVEN** 完成 mode 字段添加
- **WHEN** 运行 `pnpm -F @01s-11comm/type typecheck`
- **THEN** 输出无报错
- **AND** 运行 `pnpm -F @01s-11comm/admin typecheck` 输出无报错

---

### Requirement: 注释完善 (Step 3)

系统 SHALL 为所有 mode 字段添加 JSDoc 注释。

#### Scenario: 添加字段注释

- **GIVEN** 接口中添加了 mode 字段
- **WHEN** 添加注释
- **THEN** 使用 `/** 表单模式 */` 作为注释
- **AND** 注释位置在字段定义之前

#### Scenario: 验证注释格式

- **GIVEN** 添加了 mode 字段注释
- **WHEN** 检查注释格式
- **THEN** 使用 `/** ... */` JSDoc 格式
- **AND** 注释内容简洁明了

#### Scenario: 验证注释位置

- **GIVEN** 接口中有多个字段
- **WHEN** 检查注释位置
- **THEN** mode 字段注释在其他字段之后
- **AND** 与前后字段有空行分隔

#### Scenario: 为所有接口添加注释

- **GIVEN** 多个接口都添加了 mode 字段
- **WHEN** 检查注释
- **THEN** 所有 mode 字段都包含注释
- **AND** 注释内容一致

---

### Requirement: 格式验证 (Step 4)

系统 SHALL 验证 mode 字段格式符合规范。

#### Scenario: 验证字段定义格式

- **GIVEN** mode 字段定义
- **WHEN** 检查格式
- **THEN** 使用 `mode?: Mode;` 格式
- **AND** 字段名使用 `mode`
- **AND** 使用 `?` 表示可选
- **AND** 类型使用 `Mode`
- **AND** 以分号结束

#### Scenario: 验证错误格式

- **GIVEN** 需要检查格式
- **WHEN** 验证字段定义
- **THEN** 不允许以下错误格式：
  - `mode: Mode;`（缺少 `?`）
  - `mode?: mode;`（类型小写）
  - `mode ? : Mode;`（空格位置错误）
  - `mode = Mode;`（使用等号）

#### Scenario: 验证接口结构

- **GIVEN** 完整的 Props 接口
- **WHEN** 检查接口结构
- **THEN** 字段顺序为：form、defaultValues、mode
- **AND** mode 字段位于接口末尾

#### Scenario: 验证注释与字段间距

- **GIVEN** 添加了 mode 字段和注释
- **WHEN** 检查间距
- **THEN** 注释与字段之间无空行
- **AND** mode 字段与前后字段有空行分隔

---

### Requirement: 功能测试 (Step 5)

系统 SHALL 确保 mode 字段能正常工作。

#### Scenario: 组件接收 mode 属性

- **GIVEN** 表单组件接收 Props
- **WHEN** 传递 mode 属性
- **THEN** 组件能正确接收 mode 属性
- **AND** 属性为可选，传递 undefined 也正常

#### Scenario: mode 属性可选性

- **GIVEN** 组件使用 Props 接口
- **WHEN** 不传递 mode 属性
- **THEN** TypeScript 不报错
- **AND** 组件能正常运行

#### Scenario: mode 属性默认值

- **GIVEN** 组件需要处理 mode 属性
- **WHEN** 获取 mode 值
- **THEN** 默认值为 undefined
- **AND** 可以在组件逻辑中设置默认值

#### Scenario: 不同 mode 值的处理

- **GIVEN** Mode 类型包含多个值（如 "add"、"edit"、"view"）
- **WHEN** 传递不同的 mode 值
- **THEN** 组件能正确处理不同值
- **AND** 根据 mode 值调整表单行为

---

## 字段定义规范

### 基本定义

```typescript
export interface ExampleFormProps {
	form: ExampleFormVO;
	defaultValues: ExampleFormVO;
	/** 表单模式 */
	mode?: Mode;
}
```

### 字段说明

**字段名：** `mode`
**类型：** `Mode`（全局类型）
**必填性：** 可选（使用 `?` 标识符）
**注释：** `/** 表单模式 */`

### JSDoc 注释格式

```typescript
/** 表单模式 */
mode?: Mode;
```

### 错误格式示例

```typescript
// 错误 1：缺少可选标记
export interface ExampleFormProps {
	form: ExampleFormVO;
	defaultValues: ExampleFormVO;
	mode: Mode;  // ✗ 错误
}

// 错误 2：类型错误
export interface ExampleFormProps {
	form: ExampleFormVO;
	defaultValues: ExampleFormVO;
	mode?: string;  // ✗ 错误
}

// 错误 3：类型大小写错误
export interface ExampleFormProps {
	form: ExampleFormVO;
	defaultValues: ExampleFormVO;
	mode?: mode;  // ✗ 错误
}

// 错误 4：缺少注释
export interface ExampleFormProps {
	form: ExampleFormVO;
	defaultValues: ExampleFormVO;
	mode?: Mode;  // ✗ 错误
}
```

## 完整示例

### 示例 1：员工信息表单

**修改前：**
```typescript
export interface StaffInfoFormProps {
	form: StaffInfoFormVO;
	defaultValues: StaffInfoFormVO;
}
```

**修改后：**
```typescript
export interface StaffInfoFormProps {
	form: StaffInfoFormVO;
	defaultValues: StaffInfoFormVO;
	/** 表单模式 */
	mode?: Mode;
}
```

### 示例 2：合同类型表单

**修改前：**
```typescript
export interface AddFormProps {
	form: ContractTypeFormVO;
	defaultValues: ContractTypeFormVO;
}
```

**修改后：**
```typescript
export interface AddFormProps {
	form: ContractTypeFormVO;
	defaultValues: ContractTypeFormVO;
	/** 表单模式 */
	mode?: Mode;
}
```

### 示例 3：已有 mode 字段的接口

**修改前：**
```typescript
export interface ExampleFormProps {
	form: ExampleFormVO;
	defaultValues: ExampleFormVO;
	mode?: string;  // 类型错误
}
```

**修改后：**
```typescript
export interface ExampleFormProps {
	form: ExampleFormVO;
	defaultValues: ExampleFormVO;
	/** 表单模式 */
	mode?: Mode;  // 类型正确
}
```

## 常见问题

### Q1: 是否需要导入 Mode 类型？

**A:** Mode 是全局类型，使用时无需导入（除非项目配置要求）。

### Q2: 如何处理多个 Props 接口？

**A:** 需要为每个 Props 接口都添加 mode 字段。

### Q3: mode 字段的默认值是什么？

**A:** mode 字段是可选的，默认值为 undefined。

### Q4: 如何在组件中使用 mode 字段？

**A:** 可以在组件逻辑中处理 mode 值，例如：
```typescript
const effectiveMode = computed(() => props.mode || "add");
```

## 注意事项

1. **全局类型**：`Mode` 是全局类型，使用时无需导入
2. **可选字段**：`mode` 字段必须标记为可选（使用 `?`）
3. **注释完整**：所有 `mode` 字段必须包含 JSDoc 注释
4. **格式一致**：所有 `mode` 字段使用相同的格式和注释
5. **类型正确**：所有 `mode` 字段使用 `Mode` 类型（注意大小写）

## 参考资料

1. `apps/admin/src/pages/property-manage/expense-manage/cancel-fee/components/form.ts` - 已包含 mode 字段的示例
2. `apps/type/src/business/` - 类型项目中的接口定义
3. `apps/admin/src/pages/*/components/form.ts` - 表单组件文件
