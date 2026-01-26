# form-module-exports Specification

## Purpose

TBD - created by archiving change no-form-ts-redundant-export. Update Purpose after archive.

## Requirements

### Requirement: form.ts 导出规范

后台项目中的 `form.ts` 文件 SHALL 只导出弹框组件所需的 Props 类型和默认表单数据,禁止作为类型和变量的二次导出中转站。

#### Scenario: 仅导出 Props 和 defaultForm

- **WHEN** 开发者查看任意 `apps/admin/src/pages/**/components/form.ts` 文件
- **THEN** 该文件只导出以下内容:
  - 形如 `xxxFormProps` 的弹框组件 Props 接口
  - 名为 `defaultForm` 的默认表单数据常量
- **AND** 不包含以下导出:
  - 来自 `@01s-11comm/type` 的类型和变量的二次导出(如 `export type { XXXFormVO }` 或 `export { xxxOptions }`)
  - 在 form.ts 内定义的业务类型(如 `XXXFormVO`、联合类型等)
  - 在 form.ts 内定义的下拉选项数组(如 `xxxOptions`)
  - 工具函数(如 `listDataToFormData`)

#### Scenario: 业务类型迁移到类型项目

- **WHEN** form.ts 中存在业务相关的类型或变量定义
- **THEN** 这些定义 SHALL 迁移到 `@01s-11comm/type` 项目中:
  - 形如 `XXXFormVO` 的类型定义 → `apps/type/src/business/{业务路径}/`
  - 形如 `xxxOptions` 的下拉选项 → `apps/type/src/common/business-options.ts`
  - 联合类型定义 → 对应业务路径或 `apps/type/src/common/business-types.ts`
- **AND** 类型项目的导出链路 SHALL 保持完整(各级 index.ts 正确导出)

#### Scenario: 调整导入路径

- **WHEN** `form.vue` 或 `index.vue` 需要使用业务类型或下拉选项
- **THEN** SHALL 直接从 `@01s-11comm/type` 导入,而不是从 `./form` 导入
- **AND** 从 `./form` 只导入 `xxxFormProps` 和 `defaultForm`

#### Scenario: 标准 form.ts 示例

- **GIVEN** 业务路径为 `dev-team/config-manage/item`
- **WHEN** 查看 `apps/admin/src/pages/dev-team/config-manage/item/components/form.ts`
- **THEN** 文件内容 SHALL 符合以下模式:

```typescript
import type { ConfigItemFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: ConfigItemFormVO = {
	configItemName: "",
	configItemCode: "",
	configItemType: "",
	// ... 其他字段
};

/** 配置项表单 Props */
export interface ConfigItemFormProps {
	/** 表单数据 */
	form: ConfigItemFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: ConfigItemFormVO;
}
```

- **AND** 不包含 `export type { ConfigItemFormVO }` 或 `export { xxxOptions }` 等二次导出

### Requirement: 类型项目组织规范

类型项目 SHALL 为后台项目提供全部业务类型和通用选项的统一导出。

#### Scenario: 业务类型按路径组织

- **WHEN** 需要为某个业务路径添加类型定义
- **THEN** SHALL 在 `apps/type/src/business/{一级路由}/{二级路由}/{三级路由}.ts` 中定义
- **AND** 通过各级 `index.ts` 逐级导出到 `apps/type/src/index.ts`
- **AND** 后台项目可以直接 `import type { XXX } from "@01s-11comm/type"`

#### Scenario: 通用选项统一管理

- **WHEN** 多个业务路径共用相同的下拉选项
- **THEN** SHALL 在 `apps/type/src/common/business-options.ts` 中统一定义
- **AND** 使用描述性的变量名(如 `auditStatusOptions`, `feeTypeOptions`)
- **AND** 对于别名需求,使用 `export const feeTypeOptions = expenseTypeOptions` 形式

#### Scenario: 解决导出冲突

- **GIVEN** 多个业务路径中存在同名的类型或变量
- **WHEN** 类型检查报告 "模块已导出同名成员" 错误
- **THEN** SHALL 将共用的类型或变量提取到 `apps/type/src/common/` 目录:
  - 下拉选项 → `business-options.ts`
  - 业务类型 → `business-types.ts`
- **AND** 从各业务路径的文件中移除重复定义

### Requirement: 验证和质量保证

所有 form.ts 文件的修改 SHALL 通过类型检查验证。

#### Scenario: 类型检查通过

- **WHEN** 完成 form.ts 文件的导出调整
- **THEN** 运行 `pnpm typecheck` SHALL 成功通过
- **AND** 运行 `pnpm -F @01s-11comm/admin typecheck` SHALL 成功通过
- **AND** 运行 `pnpm -F @01s-11comm/type typecheck` SHALL 成功通过

#### Scenario: 无遗留冗余导出

- **WHEN** 使用 Grep 搜索全部 form.ts 文件
- **THEN** 不应存在以下模式:
  - `export type { XXXFormVO }` (除 Props 类型外的类型导出)
  - `export { xxxOptions }` (选项的二次导出)
  - `export function listDataToFormData` (工具函数导出)
- **AND** 所有 `export` 语句应只包含 `xxxFormProps` 接口定义和 `defaultForm` 常量
