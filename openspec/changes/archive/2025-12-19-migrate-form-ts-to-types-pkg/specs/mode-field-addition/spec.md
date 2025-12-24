## ADDED Requirements

**CRITICAL**: 在为表单 props 类型添加 mode 字段时，必须严格按照以下规范执行。

**执行顺序:**

1. **Step 1**: 识别所有表单 props 类型
2. **Step 2**: 检查是否已有 mode 字段
3. **Step 3**: 添加 mode 字段
4. **Step 4**: 验证类型检查

**步骤依赖关系:**

- Step 1 是识别阶段，找出所有需要修改的表单 props 类型
- Step 2 是检查阶段，避免重复添加
- Step 3 是实施阶段，为缺少 mode 字段的类型添加该字段
- Step 4 是验证阶段，确保添加正确

**验收标准:**

每个步骤完成后，必须满足对应 Requirement 中的所有 Scenarios。

---

### Requirement: 识别所有表单 props 类型 (Step 1)

系统 MUST 识别 `form.ts` 文件中的所有表单 props 类型定义。

**识别标准:**

表单 props 类型满足以下特征：

1. **命名模式** - 以 `FormProps` 结尾的接口
2. **导出接口** - 使用 `export interface` 定义
3. **包含表单数据** - 包含 `form` 和 `defaultValues` 属性

**典型命名模式:**

- `xxxFormProps`
- `xxxFormDialogProps`
- `xxxFormDrawerProps`

#### Scenario: 识别标准的表单 props 类型

- **GIVEN** 检查 form.ts 文件
- **WHEN** 发现以下代码：

```typescript
export interface FirstPartyFormProps {
	form: FirstPartyFormVO;
	defaultValues: FirstPartyFormVO;
}
```

- **THEN** 识别为表单 props 类型
- **AND** 记录名称为 `FirstPartyFormProps`
- **AND** 标记需要添加 mode 字段

#### Scenario: 识别不同命名变体

- **GIVEN** 检查 form.ts 文件
- **WHEN** 发现以下代码：

```typescript
export interface CancelFeeDialogProps {
	form: CancelFeeFormVO;
	defaultValues: CancelFeeFormVO;
}
```

- **THEN** 识别为表单 props 类型
- **AND** 即使不以 `FormProps` 结尾也应该包含
- **AND** 标记需要添加 mode 字段

#### Scenario: 排除非表单 props 类型

- **GIVEN** 检查接口定义
- **WHEN** 发现以下代码：

```typescript
export interface TableProps {
	data: any[];
	loading: boolean;
}
```

- **THEN** 不识别为表单 props 类型
- **AND** 理由：不包含表单数据和默认值

---

### Requirement: 检查是否已有 mode 字段 (Step 2)

系统 SHALL 对于识别出的表单 props 类型，检查是否已经包含了 mode 字段。

**检查标准:**

1. **已有 mode 字段** - 包含 `mode?: Mode` 或类似定义
2. **缺少 mode 字段** - 不包含任何模式相关的字段

**Mode 字段规范:**

- **字段名**: `mode`
- **类型**: `Mode`
- **可选性**: `?` (可选)
- **注释**: 表单模式

#### Scenario: 检查已有 mode 字段

- **GIVEN** 检查 `CancelFeeFormProps` 类型
- **WHEN** 发现以下定义：

```typescript
export interface CancelFeeFormProps {
	form: CancelFeeFormVO;
	defaultValues: CancelFeeFormVO;
	mode?: Mode;
}
```

- **THEN** 标记为已有 mode 字段
- **AND** 不需要再次添加
- **AND** 验证类型定义是否正确

#### Scenario: 检查缺少 mode 字段

- **GIVEN** 检查 `FirstPartyFormProps` 类型
- **WHEN** 发现以下定义：

```typescript
export interface FirstPartyFormProps {
	form: FirstPartyFormVO;
	defaultValues: FirstPartyFormVO;
}
```

- **THEN** 标记为缺少 mode 字段
- **AND** 需要添加该字段
- **AND** 记录在待修改列表中

#### Scenario: 检查错误的 mode 字段定义

- **GIVEN** 检查表单 props 类型
- **WHEN** 发现以下定义：

```typescript
export interface XxxFormProps {
	form: XxxFormVO;
	defaultValues: XxxFormVO;
	mode: string; // 错误的类型
}
```

- **THEN** 标记需要修正
- **AND** 应该改为 `mode?: Mode`
- **AND** 注明可选性

---

### Requirement: 添加 mode 字段 (Step 3)

系统 SHALL 为缺少 mode 字段的表单 props 类型添加该字段。

**添加规范:**

1. **位置** - 在所有现有属性之后
2. **类型** - 使用 `Mode` 类型（全局类型，无需导入）
3. **可选性** - 使用 `?` 标记为可选
4. **注释** - 添加 JSDoc 注释说明

**添加格式:**

```typescript
/** 表单模式 */
mode?: Mode;
```

#### Scenario: 为标准表单 props 添加 mode 字段

- **GIVEN** `FirstPartyFormProps` 缺少 mode 字段
- **WHEN** 添加该字段
- **THEN** 更新为：

```typescript
export interface FirstPartyFormProps {
	form: FirstPartyFormVO;
	defaultValues: FirstPartyFormVO;

	/** 表单模式 */
	mode?: Mode;
}
```

- **AND** 字段位于最后
- **AND** 包含 JSDoc 注释
- **AND** 标记为可选

#### Scenario: 为复杂表单 props 添加 mode 字段

- **GIVEN** 表单 props 包含多个属性
- **WHEN** 添加 mode 字段
- **THEN** 在所有属性后添加
- **AND** 保持适当的空行
- **AND** 保持代码格式一致

#### Scenario: 修正错误的 mode 字段定义

- **GIVEN** 发现有错误的 mode 字段定义
- **WHEN** 修正该定义
- **THEN** 改为 `mode?: Mode`
- **AND** 确保类型正确
- **AND** 确保可选性正确

---

### Requirement: 验证类型检查 (Step 4)

系统 SHALL 在完成 mode 字段添加后，进行类型检查验证。

**验证内容:**

1. 类型定义正确
2. Mode 类型可用
3. 类型检查通过
4. 组件使用正确

#### Scenario: 验证 Mode 类型可用

- **GIVEN** 添加了 `mode?: Mode` 字段
- **WHEN** 运行类型检查
- **THEN** Mode 类型被正确识别
- **AND** 无 "cannot find name 'Mode'" 错误
- **AND** 类型推断正常工作

#### Scenario: 验证类型检查通过

- **GIVEN** 完成所有 mode 字段添加
- **WHEN** 运行 `pnpm -F @01s-11comm/admin typecheck`
- **THEN** 输出无类型错误
- **AND** 所有表单 props 类型定义正确
- **AND** 无相关类型警告

#### Scenario: 验证组件使用正确

- **GIVEN** 表单 props 添加了 mode 字段
- **WHEN** 检查使用该 props 的组件
- **THEN** 组件能够正确接收 mode 属性
- **AND** 组件内部可以正确使用 mode 值
- **AND** TypeScript 类型推断正常

---

### Requirement: 批量处理规范

系统 SHALL 在需要处理大量 form.ts 文件时，遵循以下批量处理规范。

**处理策略:**

1. **分批处理** - 按模块分批处理，避免一次性修改过多文件
2. **逐步验证** - 每完成一批立即进行类型检查
3. **记录进度** - 记录已处理和待处理的文件清单

#### Scenario: 按模块分批处理

- **GIVEN** 需要处理 property-manage 模块的所有 form.ts 文件
- **WHEN** 分批处理
- **THEN** 先处理 contract-manage 子模块
- **AND** 完成后进行类型检查验证
- **AND** 再处理下一个子模块

#### Scenario: 记录处理进度

- **GIVEN** 正在进行批量处理
- **WHEN** 完成一批文件
- **THEN** 记录已处理的文件列表
- **AND** 记录遇到的问题和解决方案
- **AND** 更新待处理文件列表

#### Scenario: 处理特殊情况

- **GIVEN** 发现特殊的表单 props 定义
- **WHEN** 无法确定是否需要添加 mode 字段
- **THEN** 标记为特殊情况
- **AND** 记录原因和上下文
- **AND** 单独评估处理方案
