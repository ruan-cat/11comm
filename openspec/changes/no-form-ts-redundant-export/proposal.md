# Change: 移除 form.ts 的冗余导出

## Why

后台项目（`apps/admin`）中的 `form.ts` 文件存在严重的模块导出冗余问题：

1. **form.ts 被滥用为二次导出中转站**：许多 `form.ts` 文件从 `@01s-11comm/type` 导入类型和变量后,又立即重新导出它们,导致 form.ts 承担了不应有的职责
2. **导出范围不受限制**:form.ts 文件导出了大量不必要的类型定义(如 `xxxFormVO`)、联合类型、下拉选项等,这些应该直接从类型项目中导入
3. **导出不一致**:部分 form.ts 包含了应该删除的工具函数(如 `listDataToFormData`)或在文件内定义的业务类型,这些应该迁移到类型项目

这些问题导致:

- 类型和变量的来源不清晰,维护困难
- 形成了不必要的依赖链条
- 违反了单一职责原则

## What Changes

### 1. 规范 form.ts 的导出范围

**form.ts 只允许导出以下内容:**

- 弹框组件的 Props 类型(形如 `xxxFormProps`)
- 固定命名的 `defaultForm` 变量

**禁止导出:**

- 来自 `@01s-11comm/type` 的类型和变量的二次导出
- 在 form.ts 内定义的业务类型(如 `xxxFormVO`、联合类型等)
- 在 form.ts 内定义的下拉选项(如 `xxxOptions`)
- 工具函数

### 2. 迁移业务类型到类型项目

将 form.ts 内定义的业务相关类型和变量迁移到 `@01s-11comm/type` 项目:

- 形如 `xxxFormVO` 或 `xxxFormData` 的类型 → `apps/type/src/business/{业务路径}/`
- 形如 `xxxOptions` 的下拉选择数组 → `apps/type/src/common/business-options.ts`
- 联合类型定义 → `apps/type/src/business/{业务路径}/` 或 `apps/type/src/common/business-types.ts`

### 3. 调整导入方式

在 `form.vue` 和 `index.vue` 中:

- 移除从 `./form` 路径导入的类型和变量(除了 `xxxFormProps` 和 `defaultForm`)
- 直接从 `@01s-11comm/type` 导入所需的类型和变量

## Impact

- **影响的规范**:无(此为代码清理和规范化任务)
- **影响的代码**:
  - `apps/admin/src/pages/**/components/form.ts` - 全部 form.ts 文件(约 86 个)
  - `apps/admin/src/pages/**/components/form.vue` - 全部 form.vue 文件
  - `apps/admin/src/pages/**/index.vue` - 全部列表页文件
  - `apps/type/src/business/**` - 类型项目的业务类型文件
  - `apps/type/src/common/business-options.ts` - 通用业务选项
  - `apps/type/src/common/business-types.ts` - 通用业务类型

## 执行顺序

1. 先处理类型项目,补充缺失的类型和变量定义
2. 然后处理 form.ts 文件,移除冗余导出并迁移业务类型
3. 接着处理 form.vue 和 index.vue,调整导入路径
4. 最后运行类型检查验证修改正确性
