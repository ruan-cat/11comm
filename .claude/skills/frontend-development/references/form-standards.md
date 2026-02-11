# 表单标准参考 (Form Standards)

本参考文档规定了 `form.ts` 文件和表单组件的标准。

## `form.ts` 导出规范

组件目录下的 `form.ts` 文件 (`src/pages/**/components/form.ts`) **只允许** 导出：

1.  **表单 Props 接口** (例如 `UserFormProps`)
2.  **默认表单数据** (`defaultForm` 常量)

**禁止导出的内容**：

- 来自 `@01s-11comm/type` 的类型重导出 (Re-exports)。
- 选项数组的重导出。
- 工具函数。

**所有业务类型和选项必须直接从 `@01s-11comm/type` 导入。**

## 表单 Props 标准

所有表单 Props 接口 **必须** 包含 `mode` 字段。

```typescript
import type { UserFormVO } from "@01s-11comm/type";

/** 默认表单数据 */
export const defaultForm: UserFormVO = {
	// ... 字段
};

/** 表单 Props */
export interface UserFormProps {
	form: UserFormVO;
	defaultValues: UserFormVO;
	/** 表单模式 (add/edit/view) */
	mode?: Mode;
}
```

## 表单组件使用

在使用表单组件时，必须传递 `mode` 属性。

```vue
<UserForm :form="formData" :default-values="defaultFormData" :mode="currentMode" />
```
