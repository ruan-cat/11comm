## ADDED Requirements

**CRITICAL**: 在实施公共业务选项相关任务时，必须严格按照以下顺序执行，不允许跳步。

**执行顺序:**

1. **Step 1**: 公共业务下拉选择数组集中管理（识别公共选项）
2. **Step 2**: business-options.ts 文件结构（创建公共选项文件）
3. **Step 3**: 业务类型文件使用公共选项（类型文件集成）
4. **Step 4**: Admin 项目使用公共选项（Admin项目集成）
5. **Step 5**: 公共选项迁移验证（迁移验证）
6. **Step 6**: 迁移文档记录（文档记录）
7. **Step 7**: 后续新增公共选项流程（流程规范）

**步骤依赖关系:**

- Step 1 是识别阶段，找出需要集中管理的公共选项
- Step 2 是创建基础文件，所有公共选项的存放位置
- Step 3-4 是集成步骤，在各项目中使用公共选项
- Step 5 是验证步骤，确保迁移成功
- Step 6 是文档步骤，记录迁移过程
- Step 7 是流程规范，指导未来开发

**验收标准:**

每个步骤完成后，必须满足对应 Requirement 中的所有 Scenarios。

---

### Requirement: 公共业务下拉选择数组集中管理 (Step 1)

系统 SHALL 将跨模块、跨项目通用的业务下拉选择数组统一整合到 `apps/type/src/common/business-options.ts` 文件内，避免在多个业务类型文件中重复定义相同的选项数组。

**适用范围：**

- 在 `apps/type/src/business/` 目录下，多个业务类型文件中存在相同定义的下拉选择数组
- 该下拉选择数组满足 `OptionsType` 类型定义
- 该下拉选择数组的值和选项在不同业务场景下保持一致

**公共选项识别标准：**

系统 MUST 按以下标准识别公共业务选项：

1. **跨模块使用** - 同一选项数组在 2 个或以上的业务模块中出现
2. **内容完全一致** - 选项的 label 和 value 在所有出现的地方完全相同
3. **语义通用** - 选项表示的业务概念是通用的，而非特定模块专有的

**典型公共选项示例：**

- `合同类型Options` - 适用于合同管理的所有子模块（甲方管理、到期合同、合同草稿、合同变更等）
- `状态Options` - 启用/禁用等通用状态
- `审核状态Options` - 待审核/已通过/已拒绝等通用审核流程状态

#### Scenario: 识别重复的合同类型选项

- **GIVEN** 在 5 个不同的合同相关类型文件中发现相同的合同类型选项定义
- **AND** 这 5 个定义的内容完全一致：`物业服务合同`、`租赁合同`、`维修合同`
- **WHEN** 分析是否应该提取为公共选项
- **THEN** 判定为公共选项，应迁移到 `business-options.ts`
- **AND** 理由：跨多个子模块使用，内容一致，语义通用

#### Scenario: 排除模块专有选项

- **GIVEN** 某个选项数组仅在单个业务模块中使用
- **OR** 虽然在多处使用，但不同地方的选项内容存在差异
- **WHEN** 评估是否应该作为公共选项
- **THEN** 判定为非公共选项，应保留在各自的业务类型文件中
- **AND** 理由：不满足跨模块使用或内容一致的标准

---

### Requirement: business-options.ts 文件结构 (Step 2)

`apps/type/src/common/business-options.ts` 文件 SHALL 按以下规范组织：

**文件头部：**

- 必须包含 JSDoc 文件说明注释
- 说明本文件用于导出业务内共享通用的下拉选项数组
- 导入 `OptionsType` 类型：`import type { OptionsType } from "./OptionsType"`

**选项定义格式：**

- 每个选项数组必须包含 JSDoc 注释，说明选项的用途
- 注释格式：`/** @description {中文描述} {English description} */`
- 使用 `export const` 导出选项数组
- 选项数组变量名使用英文命名，**严格禁止使用中文变量名**
- **严格禁止：不允许创建任何向后兼容的中文变量别名**，如 `export const 费用类型 = contractTypeOptions;`
- 类型标注为 `OptionsType`

**示例：**

```typescript
/**
 * @file 业务共同类型定义
 * @description 导出业务内共享通用的下拉选项数组
 */

import type { OptionsType } from "./OptionsType";

/**
 * @description 合同类型
 * Contract type options
 */
export const contractTypeOptions: OptionsType = [
	{ label: "物业服务合同", value: "物业服务合同" },
	{ label: "租赁合同", value: "租赁合同" },
	{ label: "维修合同", value: "维修合同" },
];

/**
 * @description 审核状态选项
 * Audit status options
 */
export const auditStatusOptions: OptionsType = [
	{ label: "待审核", value: "待审核" },
	{ label: "已通过", value: "已通过" },
	{ label: "已拒绝", value: "已拒绝" },
];
```

#### Scenario: business-options.ts 文件创建正确

- **GIVEN** 需要创建 `apps/type/src/common/business-options.ts` 文件
- **WHEN** 按照规范创建文件
- **THEN** 文件包含正确的文件头部注释
- **AND** 导入了 `OptionsType` 类型
- **AND** 每个选项数组都有 JSDoc 注释
- **AND** 选项数组使用 `export const` 导出
- **AND** 运行 `pnpm -F @01s-11comm/type typecheck` 无报错

---

### Requirement: 业务类型文件使用公共选项 (Step 3)

业务类型文件 SHALL 按以下规范使用公共业务选项：

**导入公共选项：**

- 必须从 `business-options.ts` 导入公共选项
- 导入语句格式：`import { contractTypeOptions } from "../../../common/business-options"`
- 路径层级根据文件位置调整，确保正确指向 `common/business-options.ts`

**删除重复定义：**

- 必须删除业务类型文件中与公共选项重复的本地定义
- 不允许保留重复的数组字面量定义

**提供模块特定别名：**

- 如果模块需要使用特定名称的选项变量，可以创建别名
- 别名通过直接赋值创建：`export const contractFirstPartyTypeOptions = contractTypeOptions`
- 或使用重导出语法：`export { contractTypeOptions }`
- 必须保留 JSDoc 注释说明该别名指向公共选项

**示例 1：创建别名**

```typescript
import type { OptionsType } from "../../../common";
import { contractTypeOptions } from "../../../common/business-options";

/**
 * @description 合同甲方类型选项
 * Contract first-party type options
 */
export const contractFirstPartyTypeOptions = contractTypeOptions;
```

**示例 2：重导出**

```typescript
import type { OptionsType } from "../../../common";
import { contractTypeOptions } from "../../../common/business-options";

/**
 * @description 合同类型选项（从公共选项导出）
 * Contract type options (exported from common options)
 */
export { contractTypeOptions };
```

#### Scenario: 业务类型文件正确导入公共选项

- **GIVEN** `first-party.ts` 文件需要使用合同类型选项
- **WHEN** 重构文件以使用公共选项
- **THEN** 文件顶部添加导入语句：`import { contractTypeOptions } from "../../../common/business-options"`
- **AND** 删除本地定义的选项数组
- **AND** 创建别名：`export const contractFirstPartyTypeOptions = contractTypeOptions`
- **AND** 保留 JSDoc 注释

#### Scenario: 删除重复定义

- **GIVEN** `expire.ts` 文件原本定义了 `expiredContractTypeOptions`
- **WHEN** 迁移到使用公共选项
- **THEN** 删除本地数组字面量定义
- **AND** 改为从 `business-options` 导入 `contractTypeOptions`
- **AND** 创建别名：`export const expiredContractTypeOptions = contractTypeOptions`

#### Scenario: 直接使用公共选项名称

- **GIVEN** `change.ts` 文件原本就使用 `contractTypeOptions` 名称
- **WHEN** 迁移到使用公共选项
- **THEN** 导入公共选项后直接重导出：`export { contractTypeOptions }`
- **AND** 不需要创建别名，因为名称已经一致

---

### Requirement: Admin 项目使用公共选项 (Step 4)

Admin 项目（`apps/admin`）SHALL 按以下规范使用公共业务选项：

**直接使用公共选项名称：**

- 不应该使用兼容性的 `as` 类型转换写法
- 应该直接使用公共选项的标准名称
- 所有导入必须从 `@01s-11comm/type` 包导入

**更新导入语句：**

- 将模块特定的选项名称（如 `draftContractTypeOptions`）替换为公共选项名称（如 `contractTypeOptions`）
- 导入格式：`import { contractTypeOptions } from "@01s-11comm/type"`

**更新使用处：**

- 在组件中使用选项数组的地方，将变量名替换为公共选项名称
- 例如：`options: draftContractTypeOptions` 改为 `options: contractTypeOptions`

**示例：**

**修改前：**

```vue
<script lang="ts" setup>
import { draftContractTypeOptions } from "@01s-11comm/type";

const plusFormColumns = ref<PlusColumn[]>([
	{
		label: "合同类型",
		prop: "contractType",
		valueType: "select",
		options: draftContractTypeOptions,
		// ...
	},
]);
</script>
```

**修改后：**

```vue
<script lang="ts" setup>
import { contractTypeOptions } from "@01s-11comm/type";

const plusFormColumns = ref<PlusColumn[]>([
	{
		label: "合同类型",
		prop: "contractType",
		valueType: "select",
		options: contractTypeOptions,
		// ...
	},
]);
</script>
```

#### Scenario: Admin 项目更新导入语句

- **GIVEN** Admin 项目中的表单组件使用 `draftContractTypeOptions`
- **WHEN** 重构为使用公共选项
- **THEN** 导入语句改为：`import { contractTypeOptions } from "@01s-11comm/type"`
- **AND** 不使用 `import { draftContractTypeOptions }`

#### Scenario: Admin 项目更新使用处

- **GIVEN** 表单配置中使用 `options: draftContractTypeOptions`
- **WHEN** 更新为公共选项名称
- **THEN** 改为 `options: contractTypeOptions`
- **AND** 不使用类型断言或 `as` 转换
- **AND** TypeScript 类型检查通过

#### Scenario: 避免兼容性写法

- **GIVEN** 可以通过创建别名来保持向后兼容
- **WHEN** 评估是否应该使用别名
- **THEN** 不应该在 admin 项目中创建别名
- **AND** 应该直接修改代码使用公共选项名称
- **AND** 理由：统一代码风格，避免增加维护成本

---

### Requirement: 公共选项迁移验证 (Step 5)

完成公共选项迁移后，系统 MUST 通过以下验证：

**类型检查：**

- 运行 `pnpm -F @01s-11comm/type typecheck` 无报错
- 运行 `pnpm -F @01s-11comm/admin typecheck` 无报错

**重复定义检查：**

- 在 `apps/type/src/business/` 目录下，不应该存在与 `business-options.ts` 中相同的选项数组定义
- 可以使用 Grep 工具搜索，确认没有重复的数组字面量

**导入链路验证：**

- Type 项目中的业务类型文件能够正确导入 `business-options.ts` 中的选项
- Admin 项目能够通过 `@01s-11comm/type` 导入公共选项
- IDE 能够正确识别类型并提供自动补全

#### Scenario: 类型检查通过

- **GIVEN** 完成公共选项迁移
- **WHEN** 运行类型检查命令
- **THEN** `pnpm -F @01s-11comm/type typecheck` 输出无报错
- **AND** `pnpm -F @01s-11comm/admin typecheck` 输出无报错

#### Scenario: 无重复定义

- **GIVEN** 已将合同类型选项迁移到 `business-options.ts`
- **WHEN** 在 `apps/type/src/business/` 下搜索 `物业服务合同`
- **THEN** 只在 `business-options.ts` 中找到定义
- **AND** 其他业务类型文件中只有导入和使用，没有重复定义

#### Scenario: Admin 项目功能正常

- **GIVEN** Admin 项目已更新为使用公共选项名称
- **WHEN** 启动 Admin 项目并访问相关页面
- **THEN** 下拉选择框正常显示选项
- **AND** 选项内容与迁移前保持一致
- **AND** 表单提交和数据查询功能正常

---

### Requirement: 迁移文档记录 (Step 6)

公共选项迁移 SHALL 包含以下文档记录：

**在 OpenSpec 规范中：**

- 本规范文件（`specs/common-business-options/spec.md`）记录公共选项迁移的要求
- 更新主 `proposal.md` 和 `design.md`，说明公共选项管理机制

**在代码注释中：**

- `business-options.ts` 文件头部注释说明文件用途
- 每个公共选项包含 JSDoc 注释说明适用范围

**迁移清单：**

- 记录哪些选项已被识别为公共选项
- 记录哪些业务类型文件已完成迁移
- 记录 Admin 项目中哪些文件已更新

#### Scenario: OpenSpec 规范完整

- **GIVEN** 完成公共选项迁移
- **WHEN** 检查 OpenSpec 文档
- **THEN** 存在 `specs/common-business-options/spec.md` 文件
- **AND** 文件内容符合 OpenSpec 格式要求
- **AND** 包含完整的 Requirements 和 Scenarios

#### Scenario: 代码注释完整

- **GIVEN** 打开 `business-options.ts` 文件
- **WHEN** 检查文件和选项的注释
- **THEN** 文件顶部有清晰的用途说明
- **AND** 每个选项数组都有 JSDoc 注释
- **AND** 注释包含中英文双语说明

---

### Requirement: 后续新增公共选项流程 (Step 7)

当发现新的公共业务选项时，SHALL 遵循以下流程：

**识别阶段：**

1. 开发者在编写业务类型时，检查是否有类似的选项定义
2. 搜索 `apps/type/src/business/` 目录，确认是否已存在重复定义
3. 如果在 2 个以上位置发现相同定义，判定为潜在公共选项

**决策阶段：**

1. 评估选项是否满足公共选项标准（跨模块、内容一致、语义通用）
2. 如果满足，准备将其迁移到 `business-options.ts`

**实施阶段：**

1. 在 `business-options.ts` 中添加新的公共选项定义
2. 更新所有使用该选项的业务类型文件，改为导入公共选项
3. 在 Admin 项目中搜索并更新使用处
4. 运行类型检查验证

**文档记录：**

1. 在本规范中记录新增的公共选项（如果适用）
2. 更新代码注释

#### Scenario: 发现新的公共选项

- **GIVEN** 开发者在编写 `parking-fee.ts` 时定义了费用类型选项
- **AND** 搜索发现在 `house-charge.ts` 和 `utility-bill.ts` 中也有相同定义
- **WHEN** 按照流程处理
- **THEN** 将费用类型选项迁移到 `business-options.ts`
- **AND** 更新 3 个业务类型文件使用公共选项
- **AND** 更新 Admin 项目中的相关引用

#### Scenario: 判断不适合作为公共选项

- **GIVEN** 某个选项数组仅在单个业务模块中使用
- **WHEN** 评估是否应该作为公共选项
- **THEN** 保留在业务类型文件中，不迁移到 `business-options.ts`
- **AND** 在代码注释中说明该选项为模块专有
