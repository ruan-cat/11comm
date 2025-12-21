## ADDED Requirements

**CRITICAL**: 在实施类型系统相关任务时，必须严格按照以下顺序执行，不允许跳步。

**执行顺序:**

1. **Step 1**: apps/type 包初始化（前置条件）
2. **Step 2**: 类型库基础类型文件（基础设施）
3. **Step 3**: 类型库初始化（初始化验证）
4. **Step 4**: 英文字段命名规范（命名规则）
5. **Step 5**: 类型文件组织结构（文件组织）
6. **Step 6**: 类型定义完整性（完整性要求）
7. **Step 7**: 原数据结构满足类型约束（类型约束验证）

**步骤依赖关系:**

- Step 1 是所有步骤的前置条件，必须最先完成
- Step 2-3 是基础设施步骤，在创建具体业务类型前必须完成
- Step 4-6 是类型定义规范，在编写每个业务类型时必须遵守
- Step 7 是最终验证步骤，确保类型与原数据的类型是约束的，不出现类型报错的

**验收标准:**

每个步骤完成后，必须满足对应 Requirement 中的所有 Scenarios。

---

### Requirement: apps/type 包初始化 (Step 1)

系统 SHALL 在 apps/type 目录下初始化独立的 TypeScript 类型库包，满足以下配置要求：

**目录结构：**

- 创建 src 目录作为类型源码目录
- 创建 src/index.ts 作为类型库入口文件
- 未来各业务模块类型文件将放置在 src/business/ 下

**package.json 配置：**

- 包名必须为 `@01s-11comm/type`（遵循 monorepo 命名规范）
- 必须设置 `"private": true"`（确保不会被发布到 npm）
- `main` 字段必须指向 `./src/index.ts`
- `types` 字段必须指向 `./src/index.ts`
- 必须配置 `exports` 字段，明确导出入口：
  ```json
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./src/index.ts"
    }
  }
  ```
- 必须包含 `typecheck` 脚本用于类型检查
- `devDependencies` 中必须包含 `typescript`
- `packageManager` 必须指定为 `pnpm@10.25.0`
- `engines.node` 必须指定为 `>=22.14.0`
- 版本号设置为 `1.0.0`

**tsconfig.json 配置：**

- `target` 和 `module` 必须设置为 `ESNext`
- `moduleResolution` 必须设置为 `bundler`
- 必须启用 `strict` 模式进行严格类型检查
- 必须设置 `noEmit: true`（这是纯类型库，不需要编译输出）
- 必须设置 `allowImportingTsExtensions: true`（允许导入 .ts 扩展名）
- `include` 必须包含 `src/**/*.ts`
- `exclude` 必须排除 `dist` 和 `node_modules`

**入口文件 src/index.ts：**

- 必须包含 JSDoc 文件说明注释
- 说明本文件作为业务类型的统一导出入口
- 提供注释示例，说明未来如何导出其他模块的类型
- 初始状态下可以是空的导出，等待后续模块添加

**其他包引用方式：**

- 其他包（如 `@01s-11comm/admin`）必须以生产环境依赖的方式引用此类型库
- 必须使用 pnpm 工作区协议安装，在 package.json 中配置为：`"@01s-11comm/type": "workspace:*"`
- 导入类型时使用 `import type { XXX } from '@01s-11comm/type'` 格式

#### Scenario: apps/type 包初始化成功

- **GIVEN** apps/type 目录为空
- **WHEN** 创建 package.json、tsconfig.json 和 src/index.ts
- **THEN** 目录结构符合规范
- **AND** pnpm install 可以正确识别此包
- **AND** 运行 `pnpm -F @01s-11comm/type typecheck` 无报错

#### Scenario: 其他包正确引用类型库

- **GIVEN** apps/type 已初始化
- **WHEN** 在 apps/admin/package.json 中添加 `"@01s-11comm/type": "workspace:*"`
- **AND** 运行 pnpm install
- **THEN** apps/admin 可以导入 @01s-11comm/type 的类型
- **AND** TypeScript 编译器识别类型，无报错

#### Scenario: 包配置验证通过

- **GIVEN** apps/type/package.json 已创建
- **WHEN** 检查配置项
- **THEN** 包名为 @01s-11comm/type
- **AND** private 字段为 true
- **AND** main 和 types 字段指向 ./src/index.ts
- **AND** exports 字段配置正确
- **AND** 包含 typecheck 脚本

---

### Requirement: 类型库基础类型文件 (Step 2)

apps/type 类型库 SHALL 提供固定的基础类型文件：

**JsonVO 类型：**

- 必须在 src/json-vo.ts 文件中定义
- 类型定义必须与后端 JsonVO 泛型类完全一致
- 包含字段：code（状态码）、message（提示消息）、data（数据对象）

**PageDTO 类型：**

- 必须在 src/page-dto.ts 文件中定义
- 类型定义必须与后端 PageDTO 类完全一致
- 包含字段：pageIndex、pageSize、total、pages、rows

**类型导出：**

- src/index.ts 必须导出这两个基础类型
- 其他包可以直接导入：`import type { JsonVO, PageDTO } from '@01s-11comm/type'`

#### Scenario: JsonVO 类型定义正确

- **GIVEN** 创建 src/json-vo.ts
- **WHEN** 定义 JsonVO 接口
- **THEN** 接口包含 code: number
- **AND** 接口包含 message: string
- **AND** 接口包含 data: T 泛型参数
- **AND** 包含 JSDoc 注释说明

#### Scenario: PageDTO 类型定义正确

- **GIVEN** 创建 src/page-dto.ts
- **WHEN** 定义 PageDTO 接口
- **THEN** 接口包含 pageIndex: number
- **AND** 接口包含 pageSize: number
- **AND** 接口包含 total: number
- **AND** 接口包含 pages: number
- **AND** 接口包含 rows: T[] 泛型数组
- **AND** 包含 JSDoc 注释说明

#### Scenario: 基础类型可正常导入使用

- **GIVEN** src/index.ts 导出 JsonVO 和 PageDTO
- **WHEN** 在 apps/admin 中导入 `import type { JsonVO, PageDTO } from '@01s-11comm/type'`
- **THEN** TypeScript 编译器识别类型
- **AND** 可以使用嵌套泛型：`JsonVO<PageDTO<UserListItem>>`

---

### Requirement: 类型库初始化 (Step 3)

apps/type 类型库 SHALL 满足以下约束：

- 作为 monorepo 包发布，版本 1.0.0
- 提供 TypeScript 类型定义（.d.ts 文件）
- 从 @ruan-cat/utils 导出 JsonVO 和 PageDTO 类型
- 从 plus-pro-components 导出 OptionsType 类型
- 业务类型按模块目录组织，路径与 pages/ 对应

#### Scenario: 类型库构建成功

- **GIVEN** apps/type/package.json 配置正确
- **WHEN** 运行 pnpm -F @01s-11comm/type build
- **THEN** dist/ 目录生成 .js 和 .d.ts 文件
- **AND** package.json exports 字段配置正确

#### Scenario: 类型导入正常

- **GIVEN** apps/admin 依赖 @01s-11comm/type
- **WHEN** 在代码中导入 `import type { HouseChargeListItem } from "@01s-11comm/type"`
- **THEN** TypeScript 编译器识别类型，无报错
- **AND** IDE 提供类型提示和自动补全

---

### Requirement: 英文字段命名规范 (Step 4)

所有业务类型 MUST 使用英文字段名：

- 采用驼峰命名法（camelCase）
- 不允许出现任何中文变量名
- **严格禁止：不允许创建任何向后兼容的中文类型别名**，如 `export type 巡检方式 = PatrolMethodType;`
- **严格禁止：不允许为兼容中文字段而创建中文变量名或中文类型**
- 每个字段必须包含 JSDoc 注释，格式：`/** {中文} {English} */`
- 优先使用完整单词，避免缩写（除非是业界通用缩写如 ID、URL）
- 布尔类型字段使用 is/has/should 前缀

#### Scenario: 字段命名转换正确

- **GIVEN** 原字段名为 "费用项目"
- **WHEN** 迁移到类型文件
- **THEN** 字段名为 expenseItem
- **AND** JSDoc 注释为 `/** 费用项目 Expense item */`

#### Scenario: JSDoc 注释格式正确

- **GIVEN** 类型定义文件 house-charge.ts
- **WHEN** 检查所有字段注释
- **THEN** 每个字段都有 JSDoc 注释
- **AND** 注释格式为 `/** {中文描述} {English description} */`
- **AND** 中英文之间有一个空格分隔

#### Scenario: 枚举类型定义规范

- **GIVEN** 需要定义费用标识类型
- **WHEN** 创建类型定义
- **THEN** 使用 TypeScript 字面量联合类型：`type ExpenseIdentifier = "周期性费用" | "一次性费用"`
- **AND** 配套导出 Options 常量：`export const expenseIdentifierOptions: OptionsType = [...]`

#### Scenario: 严格禁止向后兼容的中文类型

- **GIVEN** 原代码中存在中文字段，需要迁移到英文字段
- **WHEN** 定义新的类型系统
- **THEN** **严格禁止**创建中文类型别名，如：
  ```typescript
  // ❌ 错误：不允许创建中文类型别名
  export type 巡检方式 = PatrolMethodType;
  export type 任务状态 = TaskStatusType;
  export type 巡检点状态 = PatrolPointStatusType;
  export type 巡查明细表单_VO = PatrolDetailFormVO;
  export type 巡查明细表单Props = PatrolDetailFormProps;
  ```
- **AND** 应该直接使用纯英文的业务类型：`PatrolMethodType`、`TaskStatusType` 等
- **AND** 不需要任何中文类型的兼容层，直接替换即可
- **AND** 如果其他文件使用了中文类型，应该直接修改那些文件使用英文类型

---

### Requirement: 类型文件组织结构 (Step 5)

类型文件 SHALL 按以下规则组织：

- 目录结构与 pages/ 目录完全对应
- 每个列表页对应一个独立类型文件
- 类型文件命名与页面目录名一致（kebab-case）
- 从 apps/type/index.ts 统一导出所有业务类型

#### Scenario: 目录结构对应关系

- **GIVEN** 页面路径 `src/pages/property-manage/expense-manage/house-charge/index.vue`
- **WHEN** 创建类型文件
- **THEN** 类型文件路径为 `apps/type/src/business/property-manage/expense-manage/house-charge.ts`
- **AND** 文件导出 HouseChargeListItem、HouseChargeQueryParams 等类型

#### Scenario: 类型统一导出

- **GIVEN** 所有业务类型文件已创建
- **WHEN** 从 apps/type/index.ts 导出
- **THEN** 支持以下导入方式：
  - `import type { HouseChargeListItem } from "@01s-11comm/type"`
  - `import type { CenterListItem, DictionaryListItem } from "@01s-11comm/type"`

---

### Requirement: 类型定义完整性 (Step 6)

每个列表页的类型文件 MUST 包含：

- ListItem 接口（列表数据项）
- QueryParams 接口（查询参数）
- 枚举类型（如 Status、Type 等）
- Options 常量（用于下拉选择）

#### Scenario: ListItem 接口定义

- **GIVEN** 房屋收费列表页
- **WHEN** 定义 HouseChargeListItem
- **THEN** 包含所有显示字段（expenseItem, expenseType, status 等）
- **AND** 所有字段都有 JSDoc 注释
- **AND** 字段类型准确（string、枚举类型等）

#### Scenario: QueryParams 接口定义

- **GIVEN** 列表页需要搜索和分页
- **WHEN** 定义 HouseChargeQueryParams
- **THEN** 包含所有筛选字段（可选属性）
- **AND** 必须包含 pageIndex: number 和 pageSize: number
- **AND** 筛选字段类型与 ListItem 对应字段一致

#### Scenario: Options 常量定义

- **GIVEN** 页面有下拉选择（如费用类型）
- **WHEN** 定义 expenseTypeOptions
- **THEN** 类型为 OptionsType（从 plus-pro-components 导入）
- **AND** 数组元素格式为 `{ label: string, value: string }`
- **AND** 导出为常量：`export const expenseTypeOptions: OptionsType = [...]`

---

### Requirement: 类型与原数据结构兼容 (Step 7)

迁移后的类型定义 MUST 与原 test-data.ts 结构兼容：

- 字段数量一致（不增不减）
- 字段语义对应（中文→英文）
- 枚举值保持不变（仍使用中文值）
- 数据结构层级不变
- 不允许编写任何中文的中间变量，不允许编写任何中文的类型来兼容。

#### Scenario: 字段一一对应

- **GIVEN** 原 test-data.ts 的接口有 8 个字段
- **WHEN** 创建新类型 HouseChargeListItem
- **THEN** 新类型也有 8 个字段
- **AND** 每个字段都能找到原字段的对应关系

#### Scenario: 枚举值兼容性

- **GIVEN** 原字段 "费用标识" 值为 "周期性费用" | "一次性费用"
- **WHEN** 定义新类型 ExpenseIdentifier
- **THEN** 类型定义为 `type ExpenseIdentifier = "周期性费用" | "一次性费用"`
- **AND** 值仍为中文，不转换为英文

#### Scenario: 嵌套结构保持

- **GIVEN** 原数据无嵌套对象
- **WHEN** 迁移类型
- **THEN** 新类型也保持扁平结构
- **AND** 所有字段都是原始类型或枚举类型

---

## 8. 类型项目的代码组织方式与导出规范

### 8.1 在类型项目内，必须使用全量的导出语法

不要去区分是单独导出全部的类型，还是全部的变量。全部都批量导出来。

**错误写法：**

不要单独的导出类型，直接导出全部的代码。包括类型和变量。

```typescript
export type * from "./expense-manage";
```

**正确写法：**

直接导出全部内容即可。

```typescript
export * from "./expense-manage";
```

### 8.2 不允许逐个罗列的导出

**错误写法：**

```typescript
export type {
  PatrolTaskFormVO,
  PatrolTaskFormProps,
  TaskListItem,
  TaskQueryParams,
  PatrolTaskListItem,
  PatrolTaskQueryParams,
} from "./task";
```

**正确写法：**

直接全部导出即可。不要逐个罗列需要被导出的项目。

```typescript
export * from "./task";
```

### 8.3 在类型项目，根据业务路径，统一使用 index.ts 来统一作为导出入口

在类型项目内，使用了业务路径来依次组织代码的存放位置。为了逐级获取导出的项目，应该在每一个层级内编写 index.ts 来统一导出全部内容。包括类型和变量。

**正确 index.ts 与业务路径的文件组织关系如下：**

1. 路径 `src/index.ts`

```typescript
// apps/type/src/index.ts
// 导出通用类型
export * from "./common";
// 导出业务类型
export * from "./business";
// 导出常量
export * from "./constant";
```

2. 路径 `src/business/index.ts`

```typescript
// apps/type/src/business/index.ts
/**
 * @file 业务类型统一导出
 * @description 导出所有业务模块的类型定义
 */
export * from "./dev-team";
export * from "./operation-team";
export * from "./property-manage";
export * from "./setting-manage";
```

3. 路径 `src/business/property-manage/index.ts`

```typescript
// apps/type/src/business/property-manage/index.ts
// 社区管理模块
export * from "./community-manage";
// 房产管理模块
export * from "./house-property-manage";
// 合同管理模块
export * from "./contract-manage";
// 费用管理模块
export * from "./expense-manage";
// 停车管理模块
export * from "./parking-manage";
// 巡检管理模块
export * from "./patrol-manage";
// 报修管理模块
export * from "./repairs-manage";
// 报表管理模块
export * from "./report-manage";
```

4. 路径 `src/business/property-manage/patrol-manage/index.ts`

```typescript
// apps/type/src/business/property-manage/patrol-manage/index.ts
export * from "./detail";
export * from "./item";
export * from "./path";
export * from "./plan";
export * from "./point";
export * from "./task";
```

### 8.4 遇到类型错误时，重复的内容导出时的处理方式

比如这种错误：

```log
模块 "./community-manage" 已导出一个名为"auditStatusOptions"的成员。请考虑重新显式导出以解决歧义。
模块 "./community-manage" 已导出一个名为"feeTypeOptions"的成员。请考虑重新显式导出以解决歧义。
```

你不应该使用分散导出的方式来解决类型故障，你应该把这些公共的，相通的类型或变量，统一放在一个文件内导出。

- 对于公共的下拉选项式的变量，应该放在 `apps/type/src/common/business-options.ts` 文件内统一整理，并导出。
- 对于公共的，通用的业务类型，应该放在 `apps/type/src/common/business-types.ts` 文件内统一整理，并导出。

**对于上述错误，正确的做法是统一放在 `apps/type/src/common/business-options.ts` 内并导出：**

```typescript
// apps/type/src/common/business-options.ts
/**
 * @description 审核状态选项
 * Audit status options
 */
export const auditStatusOptions: OptionsType = [
  { label: "待审核", value: "待审核" },
  { label: "已通过", value: "已通过" },
  { label: "已拒绝", value: "已拒绝" },
];

/** 费用项名称选项 Expense item name options */
export const expenseItemNameOptions: OptionsType = [
  { label: "物业费", value: "物业费" },
  { label: "水电费", value: "水电费" },
  { label: "停车费", value: "停车费" },
  { label: "维修费", value: "维修费" },
];

/** 费用类型选项别名 Fee type options alias */
export const feeTypeOptions = expenseTypeOptions;
```

**错误写法：**

不要弄这种复杂的逐项导出，阅读很不美观，难以处理。

```typescript
// 导出通用类型 - 先导出 common
export * from "./common";
// 导出业务类型 - 后导出 business，避免冲突时使用命名导出
export {
  patrolMethodOptions,
  patrolPointStatusOptions,
  returnVisitStatusOptions,
} from "./common";
// 选择性导出业务模块，避免重复导出
export * from "./business/dev-team";
export * from "./business/operation-team";
export * from "./business/property-manage";
export * from "./business/setting-manage";
// 导出常量
export * from "./constant";
```

**正确写法：**

```typescript
// 导出通用类型
export * from "./common";
// 导出业务类型
export * from "./business";
// 导出常量
export * from "./constant";
```

### 8.5 不要将非业务类型迁移到类型项目内，特别是表单弹框组件类型

**背景说明：**

对于形如 `xxxxxxFormProps` 格式的类型，这些类型都是表单弹框类型，不是业务类型。你不应该将弹框组件的类型迁移到类型项目内。

**错误示例：**

```ts
// apps\type\src\business\property-manage\report-manage\repair-reports-summary-table.ts
/**
 * 报修汇总表表单属性
 * Repair reports summary table form props
 */
export interface RepairReportsSummaryTableFormProps {
	/** 表单数据 Form data */
	form: RepairReportsSummaryTableFormData;
	/** 表单组件重置时默认使用的对象 Default object used when form component is reset */
	defaultValues: RepairReportsSummaryTableFormData;
	/** 表单模式 Form mode */
	mode?: "add" | "edit" | "info";
}
```

**正确做法：**

1. 根据业务路径，迁移到对应的 `form.ts` 内。
2. 在 `form.ts` 内导入固定写法的 `import { type Mode } from "@/composables/use-mode";` 类型。
3. 将 `mode` 字段的类型，统一换成 `Mode` 类型。

```ts
// apps\admin\src\pages\property-manage\report-manage\repair-reports-summary-table\components\form.ts
import { type Mode } from "@/composables/use-mode";
/**
 * 报修汇总表表单属性
 * Repair reports summary table form props
 */
export interface RepairReportsSummaryTableFormProps {
	/** 表单数据 Form data */
	form: RepairReportsSummaryTableFormData;
	/** 表单组件重置时默认使用的对象 Default object used when form component is reset */
	defaultValues: RepairReportsSummaryTableFormData;
	/** 表单模式 Form mode */
	mode?: Mode;
}
```

**关键要点：**

- 表单弹框组件类型应该位于客户端代码的 `form.ts` 文件中，而不是类型项目中
- `Mode` 类型是客户端代码内全局导入的类型，直接使用即可
- 避免在类型项目中出现业务无关的表单组件类型
