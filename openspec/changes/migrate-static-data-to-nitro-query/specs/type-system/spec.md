## ADDED Requirements

## 实施顺序说明

**CRITICAL**: 在实施类型系统相关任务时，必须严格按照以下顺序执行，不允许跳步。

### 执行顺序

1. **Step 1**: apps/type 包初始化（前置条件）
2. **Step 2**: 类型库基础类型文件（基础设施）
3. **Step 3**: 类型库初始化（初始化验证）
4. **Step 4**: 英文字段命名规范（命名规则）
5. **Step 5**: 类型文件组织结构（文件组织）
6. **Step 6**: 类型定义完整性（完整性要求）
7. **Step 7**: 类型与原数据结构兼容（兼容性验证）

### 步骤依赖关系

- Step 1 是所有步骤的前置条件，必须最先完成
- Step 2-3 是基础设施步骤，在创建具体业务类型前必须完成
- Step 4-6 是类型定义规范，在编写每个业务类型时必须遵守
- Step 7 是最终验证步骤，确保类型与原数据兼容

### 验收标准

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
