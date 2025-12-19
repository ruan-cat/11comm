# 公共选项迁移规范

## ADDED Requirements

**CRITICAL**: 在实施公共选项迁移任务时，必须严格按照以下顺序执行，不允许跳步。

**执行顺序:**

1. **Step 1**: 公共选项识别（识别跨模块重复的下拉选项）
2. **Step 2**: 迁移到 business-options.ts（将公共选项迁移到统一文件）
3. **Step 3**: 更新业务类型文件（业务类型文件使用公共选项）
4. **Step 4**: 更新 form.ts 文件（Admin 项目使用公共选项）
5. **Step 5**: 验证迁移（确保迁移后功能正常）
6. **Step 6**: 文档记录（记录迁移过程和注意事项）

**步骤依赖关系:**

- Step 1 是识别阶段，找出需要集中管理的公共选项
- Step 2 是创建基础文件，所有公共选项的存放位置
- Step 3-4 是集成步骤，在各项目中使用公共选项
- Step 5 是验证步骤，确保迁移成功
- Step 6 是文档步骤，记录迁移过程

**验收标准:**

每个步骤完成后，必须满足对应 Requirement 中的所有 Scenarios。

---

### Requirement: 公共选项识别 (Step 1)

系统 SHALL 将跨模块、跨项目通用的业务下拉选择数组统一整合到 `apps/type/src/common/business-options.ts` 文件内，避免在多个业务类型文件中重复定义相同的选项数组。

#### Scenario: 识别跨模块使用的选项

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

#### Scenario: 验证选项内容一致性

- **GIVEN** 合同类型选项在两个文件中定义
- **AND** 一个文件中选项为 `["物业服务合同", "租赁合同"]`
- **AND** 另一个文件中选项为 `["物业服务合同", "维修合同"]`
- **WHEN** 检查选项内容一致性
- **THEN** 判定为不一致，不作为公共选项处理
- **AND** 需要手动统一选项内容后再迁移

---

### Requirement: 迁移到 business-options.ts (Step 2)

`apps/type/src/common/business-options.ts` 文件 SHALL 按规范组织公共选项。

#### Scenario: 创建 business-options.ts 文件

- **GIVEN** 需要创建 `apps/type/src/common/business-options.ts` 文件
- **WHEN** 按照规范创建文件
- **THEN** 文件包含正确的文件头部注释
- **AND** 导入了 `OptionsType` 类型
- **AND** 运行 `pnpm -F @01s-11comm/type typecheck` 无报错

#### Scenario: 添加公共选项定义

- **GIVEN** 识别出合同类型选项为公共选项
- **WHEN** 在 `business-options.ts` 中添加选项定义
- **THEN** 使用正确的 JSDoc 注释：`/** @description 合同类型选项 Contract type options */`
- **AND** 变量命名为英文：`export const contractTypeOptions: OptionsType = [...]`
- **AND** 保持选项内容与原始定义一致

#### Scenario: 验证选项格式

- **GIVEN** 在 `business-options.ts` 中添加选项
- **WHEN** 检查选项格式
- **THEN** 每个选项对象包含 `label` 和 `value` 字段
- **AND** 选项数组类型标注为 `OptionsType`
- **AND** 使用 `export const` 导出

---

### Requirement: 更新业务类型文件 (Step 3)

业务类型文件 SHALL 按规范使用公共业务选项。

#### Scenario: 导入公共选项

- **GIVEN** `first-party.ts` 文件需要使用合同类型选项
- **WHEN** 重构文件以使用公共选项
- **THEN** 文件顶部添加导入语句：`import { contractTypeOptions } from "../../../common/business-options"`
- **AND** 路径层级根据文件位置调整，确保正确指向

#### Scenario: 删除重复定义

- **GIVEN** `expire.ts` 文件原本定义了 `expiredContractTypeOptions`
- **WHEN** 迁移到使用公共选项
- **THEN** 删除本地数组字面量定义
- **AND** 改为从 `business-options` 导入 `contractTypeOptions`
- **AND** 创建别名：`export const expiredContractTypeOptions = contractTypeOptions`

#### Scenario: 创建别名

- **GIVEN** 模块需要使用特定名称的选项变量
- **WHEN** 创建别名
- **THEN** 通过直接赋值创建：`export const contractFirstPartyTypeOptions = contractTypeOptions`
- **AND** 必须保留 JSDoc 注释说明该别名指向公共选项

#### Scenario: 重导出选项

- **GIVEN** `change.ts` 文件原本就使用 `contractTypeOptions` 名称
- **WHEN** 迁移到使用公共选项
- **THEN** 导入公共选项后直接重导出：`export { contractTypeOptions }`
- **AND** 不需要创建别名，因为名称已经一致

---

### Requirement: 更新 form.ts 文件 (Step 4)

Admin 项目 SHALL 按规范使用公共业务选项。

#### Scenario: 更新导入语句

- **GIVEN** Admin 项目中的表单组件使用 `draftContractTypeOptions`
- **WHEN** 重构为使用公共选项
- **THEN** 导入语句改为：`import { contractTypeOptions } from "@01s-11comm/type"`
- **AND** 不使用 `import { draftContractTypeOptions } as contractTypeOptions`

#### Scenario: 更新使用处

- **GIVEN** 表单配置中使用 `options: draftContractTypeOptions`
- **WHEN** 更新为公共选项名称
- **THEN** 改为 `options: contractTypeOptions`
- **AND** 不使用类型断言或 `as` 转换
- **AND** TypeScript 类型检查通过

#### Scenario: 导出公共选项

- **GIVEN** 在 form.ts 文件中使用公共选项
- **WHEN** 需要在其他地方使用
- **THEN** 在文件末尾添加导出：`export { contractTypeOptions }`
- **AND** 保持与导入语句一致

#### Scenario: 避免兼容性写法

- **GIVEN** 可以通过创建别名来保持向后兼容
- **WHEN** 评估是否应该使用别名
- **THEN** 不应该在 admin 项目中创建别名
- **AND** 应该直接修改代码使用公共选项名称
- **AND** 理由：统一代码风格，避免增加维护成本

---

### Requirement: 验证迁移 (Step 5)

完成公共选项迁移后，系统 MUST 通过以下验证。

#### Scenario: 类型项目类型检查

- **GIVEN** 完成公共选项迁移
- **WHEN** 运行类型检查命令
- **THEN** `pnpm -F @01s-11comm/type typecheck` 输出无报错
- **AND** `pnpm -F @01s-11comm/admin typecheck` 输出无报错

#### Scenario: 重复定义检查

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

#### Scenario: 导入链路验证

- **GIVEN** Type 项目中的业务类型文件
- **WHEN** 检查导入链路
- **THEN** 能够正确导入 `business-options.ts` 中的选项
- **AND** Admin 项目能够通过 `@01s-11comm/type` 导入公共选项
- **AND** IDE 能够正确识别类型并提供自动补全

---

### Requirement: 文档记录 (Step 6)

公共选项迁移 SHALL 包含以下文档记录。

#### Scenario: OpenSpec 规范完整

- **GIVEN** 完成公共选项迁移
- **WHEN** 检查 OpenSpec 文档
- **THEN** 存在 `specs/common-options-migration/spec.md` 文件
- **AND** 文件内容符合 OpenSpec 格式要求
- **AND** 包含完整的 Requirements 和 Scenarios

#### Scenario: 代码注释完整

- **GIVEN** 打开 `business-options.ts` 文件
- **WHEN** 检查文件和选项的注释
- **THEN** 文件顶部有清晰的用途说明
- **AND** 每个选项数组都有 JSDoc 注释
- **AND** 注释包含中英文双语说明

#### Scenario: 迁移清单记录

- **GIVEN** 完成公共选项迁移
- **WHEN** 创建迁移清单
- **THEN** 记录哪些选项已被识别为公共选项
- **AND** 记录哪些业务类型文件已完成迁移
- **AND** 记录 Admin 项目中哪些文件已更新

---

## 公共选项识别标准

### 识别条件

系统必须满足以下所有条件才能将选项认定为公共选项：

1. **跨模块使用**：同一选项数组在 2 个或以上的业务模块中出现
2. **内容完全一致**：选项的 label 和 value 在所有出现的地方完全相同
3. **语义通用**：选项表示的业务概念是通用的，而非特定模块专有的

### 典型公共选项示例

- **合同类型选项**：物业服务合同、租赁合同、维修合同
- **审核状态选项**：待审核、已通过、已拒绝
- **费用标识选项**：是、否
- **性别选项**：男、女
- **状态选项**：启用、禁用
- **支付方式选项**：现金、刷卡、转账

## 文件结构规范

### business-options.ts 文件头部

```typescript
/**
 * @file 业务共同类型定义
 * @description 导出业务内共享通用的下拉选项数组
 */

import type { OptionsType } from "./OptionsType";
```

### 选项定义格式

```typescript
/**
 * @description 合同类型选项
 * Contract type options
 */
export const contractTypeOptions: OptionsType = [
	{ label: "物业服务合同", value: "物业服务合同" },
	{ label: "租赁合同", value: "租赁合同" },
	{ label: "维修合同", value: "维修合同" },
];
```

## 命名规范

### 变量命名规则

- 使用英文命名，禁止中文变量名
- 使用 camelCase 或 PascalCase 命名法
- 遵循 `{业务概念} + Options` 格式

**正确示例：**
```typescript
export const contractTypeOptions: OptionsType = [...];        // ✓ 正确
export const auditStatusOptions: OptionsType = [...];         // ✓ 正确
export const genderOptions: OptionsType = [...];              // ✓ 正确
```

**错误示例：**
```typescript
export const 合同类型选项: OptionsType = [...];                // ✗ 错误（中文命名）
export const ContractOptions: OptionsType = [...];            // ✗ 错误（不清晰）
```

## 完整示例

### 迁移前状态

**form.ts 1**（draft-contract/components/form.ts）：
```typescript
/** 合同类型选项 */
export const draftContractTypeOptions = [
	{ label: "物业服务合同", value: "物业服务合同" },
	{ label: "租赁合同", value: "租赁合同" },
	{ label: "维修合同", value: "维修合同" },
];
```

**form.ts 2**（first-party/components/form.ts）：
```typescript
/** 合同类型选项 */
export const firstPartyContractTypeOptions = [
	{ label: "物业服务合同", value: "物业服务合同" },
	{ label: "租赁合同", value: "租赁合同" },
	{ label: "维修合同", value: "维修合同" },
];
```

### 迁移后状态

**business-options.ts**：
```typescript
/**
 * @file 业务共同类型定义
 * @description 导出业务内共享通用的下拉选项数组
 */

import type { OptionsType } from "./OptionsType";

/**
 * @description 合同类型选项
 * Contract type options
 */
export const contractTypeOptions: OptionsType = [
	{ label: "物业服务合同", value: "物业服务合同" },
	{ label: "租赁合同", value: "租赁合同" },
	{ label: "维修合同", value: "维修合同" },
];
```

**draft-contract.ts**：
```typescript
import { contractTypeOptions } from "../../../common/business-options";

/**
 * @description 合同草稿类型选项（从公共选项导出）
 * Draft contract type options (exported from common options)
 */
export { contractTypeOptions as draftContractTypeOptions };
```

**first-party.ts**：
```typescript
import { contractTypeOptions } from "../../../common/business-options";

/**
 * @description 合同甲方类型选项（从公共选项导出）
 * First-party contract type options (exported from common options)
 */
export { contractTypeOptions as firstPartyContractTypeOptions };
```

**draft-contract/form.ts**：
```typescript
import { contractTypeOptions } from "@01s-11comm/type";

export { contractTypeOptions as draftContractTypeOptions };
```

**first-party/form.ts**：
```typescript
import { contractTypeOptions } from "@01s-11comm/type";

export { contractTypeOptions as firstPartyContractTypeOptions };
```

## 注意事项

1. **保持一致性**：所有公共选项必须使用相同的变量名和内容
2. **谨慎修改**：修改公共选项前需要评估影响范围
3. **及时验证**：每次修改后及时运行类型检查
4. **文档同步**：更新相关文档和注释
5. **测试充分**：确保迁移后功能正常

## 参考资料

1. `openspec/changes/migrate-static-data-to-nitro-query/specs/common-business-options/spec.md` - 原始公共选项规范
2. `apps/type/src/common/business-options.ts` - 公共选项文件示例
3. `apps/type/src/common/OptionsType.ts` - 选项类型定义
4. `apps/admin/src/router/rank/rank-route-keys.ts` - 路由配置
