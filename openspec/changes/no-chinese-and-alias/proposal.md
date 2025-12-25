# Change: 移除中文命名和中间变量别名

## Why

类型项目（`apps/type`）和后台项目（`apps/admin`）中存在以下问题需要解决：

1. **向后兼容的中文类型别名**：部分类型使用了中文命名（如 `巡查明细表单_VO`、`报修回访_列表数据`），这些类型应该直接使用英文类型名
2. **中文选项变量名称**：部分选项变量使用了中文命名（如 `报修类型Options`、`维修类型Options`），应该使用英文命名
3. **类型别名冗余**：如 `FormVO` 类型的别名定义应该删除，直接使用原始类型

**重要说明：** 本任务**不涉及** form.ts 文件的 FormVO 导出清理工作，该工作已由 `no-form-ts-redundant-export` 任务完成。

## What Changes

### 1. 类型项目修改

- 删除所有向后兼容的中文类型别名定义
- 清理 `apps/type/src/business/*/index.ts` 中的选择性导出，改用全量导出（如果存在）
- 将中文命名的选项变量重命名为英文（在 `apps/type/src/common/business-options.ts` 中）

### 2. 后台项目修改

- 清理后台项目中所有使用中文类型的地方，换成对应的英文类型
- 修复因中文类型替换导致的类型错误
- 修复因选项变量重命名导致的引用错误

## Impact

- **影响的规范**：无（此为代码清理任务）
- **影响的代码**：
  - `apps/type/src/business/**/index.ts` - 类型导出清理
  - `apps/type/src/common/business-options.ts` - 中文选项变量重命名
  - 后台项目中引用中文类型和选项的所有文件（主要是 Vue 文件）
  - **不影响** `apps/admin/src/pages/**/components/form.ts` 的导出结构（已由其他任务处理）

## 与 no-form-ts-redundant-export 任务的关系

### 1. 任务边界

- **no-form-ts-redundant-export**：负责清理 form.ts 的冗余导出，迁移业务类型到类型项目
- **no-chinese-and-alias**（本任务）：负责清理中文类型名称和别名，修复类型引用

### 2. 执行依赖

本任务应该在 `no-form-ts-redundant-export` 任务**基本完成**后执行，因为：
- `no-form-ts-redundant-export` 已经完成了 form.ts 的导出清理
- `no-form-ts-redundant-export` 遗留的部分类型错误（约 172 个）中，很多是中文类型相关的问题
- 本任务将处理这些中文类型问题，作为 `no-form-ts-redundant-export` 的补充

### 3. 避免冲突的约束

- **禁止修改 form.ts 的导出结构**：form.ts 只应导出 `xxxFormProps` 和 `defaultForm`，不要添加或删除其他导出
- **禁止重复迁移类型**：如果类型已经在类型项目中存在，直接使用，不要重复创建
- **禁止修改已完成的类型项目结构**：类型项目的 index.ts 导出链路已由 `no-form-ts-redundant-export` 完成，不要修改

## 执行顺序

1. 先处理类型项目中的中文类型别名和选项变量重命名
2. 然后处理后台项目中的中文类型引用替换
3. 最后验证类型检查是否通过
