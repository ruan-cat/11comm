## ADDED Requirements

### Requirement: 清理类型项目的冗余 FormVO 导出

类型项目的业务模块 `index.ts` 文件中 SHALL 移除所有 `export type { XXXFormVO }` 的选择性导出，改用全量导出 `export * from "./xxx"`。

#### Scenario: 清理 contract-manage 模块导出

- **WHEN** 处理 `apps/type/src/business/property-manage/contract-manage/index.ts`
- **THEN** 将所有选择性导出改为全量导出 `export * from "./模块名"`

### Requirement: 删除中文类型别名

类型项目中 SHALL 删除所有使用中文命名的类型别名，如 `export type 巡查明细表单_VO = PatrolDetailFormVO`。

#### Scenario: 删除巡检管理中文别名

- **WHEN** 在类型项目中找到中文命名的类型别名
- **THEN** 直接使用原始英文类型，删除中文别名定义

### Requirement: 清理后台项目 form.ts 的冗余导出

后台项目的 `form.ts` 文件中 SHALL 删除所有 `export type { XXXFormVO }` 行。

#### Scenario: 删除 patrol-manage 任务表单导出

- **WHEN** 处理 `apps/admin/src/pages/property-manage/patrol-manage/task/components/form.ts`
- **THEN** 删除第 2 行的 `export type { PatrolTaskFormVO }`

### Requirement: 清理后台项目的选择性导出别名

后台项目的 `form.ts` 文件中 SHALL 删除所有类型别名的重新导出定义。

#### Scenario: 清理 index.ts 中的类型导出别名

- **WHEN** 后台项目文件中有类似 `export type { XXX as FormVO }` 的导出
- **THEN** 直接使用原始类型 XXX，删除别名导出
