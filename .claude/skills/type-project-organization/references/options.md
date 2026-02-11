# 业务选项管理参考 (Business Options Management Reference)

本参考文档规定了 `apps/type` 中共享业务选项（下拉菜单、枚举）的管理标准。

## 公共业务选项 (Common Business Options)

文件 `apps/type/src/common/business-options.ts` 整合了所有跨模块使用的业务下拉选项数据。

### 识别标准 (Identification Criteria)

如果一个业务选项满足以下**所有**条件，则必须移动到 `business-options.ts`：

1.  **跨模块使用**：在 2 个或更多不同的业务模块中使用。
2.  **内容相同**：`label` 和 `value` 对完全相同。
3.  **通用语义**：概念普遍适用（例如 "状态"、"审核状态"）。

### 文件结构标准 (File Structure Standard)

#### 头部 (Headers)

文件必须包含：

- 解释其用途的 JSDoc。
- 导入 `OptionsType`：`import type { OptionsType } from "./OptionsType";`

#### 选项定义 (Option Definition)

每个选项数组必须：

- 拥有包含描述的 JSDoc 注释。
- 使用 `export const` 导出。
- 使用 **英文变量名**（例如 `contractTypeOptions`）。
- 类型定义为 `OptionsType`。
- **禁止**：为了向后兼容而定义中文别名（例如 `export const 费用类型 = ...`）。

**示例：**

```typescript
/**
 * @description 合同类型选项
 * Contract type options
 */
export const contractTypeOptions: OptionsType = [
	{ label: "服务合同", value: "Service Contract" },
	{ label: "租赁合同", value: "Lease Contract" },
];
```

## 业务模块使用规范 (Usage by Business Modules)

### 类型包 (`apps/type`)

业务类型文件（例如 `src/business/contract/index.ts`）必须：

1.  从 `../../common/business-options` 导入公共选项。
2.  **删除** 本地的重复定义。
3.  如果需要，进行重导出或别名，但首选直接重导出。

```typescript
import { contractTypeOptions } from "../../common/business-options";
export { contractTypeOptions };
```

### 管理应用 (`apps/admin`)

前端应用必须：

1.  直接从 `@01s-11comm/type` 导入。
2.  将模块特定的选项名称替换为公共选项名称。

**示例：**

```typescript
import { contractTypeOptions } from "@01s-11comm/type";

const columns = [
	{
		label: "合同类型",
		prop: "type",
		options: contractTypeOptions,
	},
];
```

## 验证 (Validation)

1.  **无重复**：在 `src/business/` 中使用 grep 搜索数组字面量，确保不存在重新定义的选项。
2.  **类型检查**：运行 `pnpm -F @01s-11comm/type typecheck` 必须通过。
