# 业务类型迁移规范

## ADDED Requirements

**CRITICAL**: 在实施业务类型迁移任务时，必须严格按照以下顺序执行，不允许跳步。

**执行顺序:**

1. **Step 1**: 目录映射与文件定位（根据 RANK_ROUTE_KEYS 确定迁移目标）
2. **Step 2**: 类型定义迁移（将 form.ts 中的业务类型迁移到类型项目）
3. **Step 3**: 命名规范化（将中文命名改为英文命名）
4. **Step 4**: JSDoc 注释保留（**必须完整保留所有注释说明，注释丢失视为迁移失败**）
5. **Step 5**: 导入路径更新（更新 form.ts 中的导入路径）
6. **Step 6**: 验证与测试（确保迁移后功能正常）

**步骤依赖关系:**

- Step 1 是定位阶段，确定所有需要迁移的文件
- Step 2 是迁移阶段，将业务类型移动到类型项目
- Step 3-4 是规范化阶段，确保命名和注释符合规范
- Step 5 是更新阶段，更新所有引用
- Step 6 是验证阶段，确保迁移成功

**验收标准:**

每个步骤完成后，必须满足对应 Requirement 中的所有 Scenarios。

---

### Requirement: 目录映射与文件定位 (Step 1)

系统 SHALL 根据 `RANK_ROUTE_KEYS` 数组中的三级路由，确定所有 form.ts 文件的迁移目标目录。

#### Scenario: 确定路由到目录的映射

- **GIVEN** 路由路径 `propertyManage.contractManage.firstParty`
- **WHEN** 确定迁移目录
- **THEN** 映射到 `apps/type/src/business/property-manage/contract-manage/`
- **AND** 文件命名为 `first-party.ts`

#### Scenario: 验证文件命名规范

- **GIVEN** 三级路由 `settingManage.organizeManage.staffInfo`
- **WHEN** 创建迁移文件
- **THEN** 文件路径为 `apps/type/src/business/setting-manage/organize-manage/staff-info.ts`
- **AND** 使用短横杠分隔的英文命名

---

## Requirement: 类型定义迁移 (Step 2)

系统 SHALL 将 form.ts 文件中的业务类型迁移到类型项目的对应目录。

#### Scenario: 迁移接口类型

- **GIVEN** form.ts 中定义了 `StaffInfoFormVO` 接口
- **WHEN** 迁移到类型项目
- **THEN** 在 `apps/type/src/business/.../staff-info.ts` 中创建相同接口
- **AND** 保留所有字段定义

#### Scenario: 保留默认值对象在 form.ts

- **GIVEN** form.ts 中定义了 `defaultForm` 常量
- **WHEN** 执行迁移
- **THEN** `defaultForm` 常量保留在 form.ts 文件内
- **AND** 不将 `defaultForm` 迁移到类型项目

#### Scenario: 迁移表单数据 Props 接口

- **GIVEN** form.ts 中定义了 `StaffInfoFormProps` 接口（表单数据相关）
- **WHEN** 迁移到类型项目
- **THEN** 在类型文件中创建相同接口
- **AND** 后续添加 `mode` 字段

#### Scenario: 保留弹框类型在 form.ts

- **GIVEN** form.ts 中定义了弹框相关的 Props 接口（如 `AddFormProps`, `EditFormProps`, `ViewFormProps`）
- **WHEN** 执行迁移
- **THEN** 弹框类型接口保留在 form.ts 文件内
- **AND** 不将弹框类型迁移到类型项目
- **AND** 弹框类型包括：新增弹框、编辑弹框、查看弹框等相关接口

---

## Requirement: 命名规范化 (Step 3)

系统 SHALL 将所有中文字段名和类型名改为英文命名。

#### Scenario: 类型名中文转英文

- **GIVEN** 类型名 `员工信息表单数据类型`
- **WHEN** 规范化命名
- **THEN** 改为 `StaffInfoFormVO`
- **AND** 使用 PascalCase 命名法

#### Scenario: 字段名中文转英文

- **GIVEN** 字段名 `员工姓名`
- **WHEN** 规范化命名
- **THEN** 改为 `name`
- **AND** 使用 camelCase 命名法

#### Scenario: 保留类型后缀

- **GIVEN** 类型名包含后缀 `FormVO`
- **WHEN** 规范化命名
- **THEN** 保留后缀不变
- **AND** 只修改业务部分

---

## Requirement: JSDoc 注释保留 (Step 4)

系统 SHALL 完整保留所有类型和字段的 JSDoc 注释，**注释丢失视为迁移失败**。

#### Scenario: 类型注释保留

- **GIVEN** 类型有 JSDoc 注释 `/** 员工信息表单数据类型 */`
- **WHEN** 迁移到类型项目
- **THEN** 保留原注释并添加英文翻译
- **AND** 格式为 `/** @description 中文描述 English description */`

#### Scenario: 字段注释保留

- **GIVEN** 字段有注释 `/** 员工姓名 */`
- **WHEN** 迁移到类型项目
- **THEN** 保留原注释并添加英文翻译
- **AND** 格式为 `/** 员工姓名 Name */`

#### Scenario: 注释格式规范

- **GIVEN** 需要添加注释的类型
- **WHEN** 编写 JSDoc 注释
- **THEN** 使用 `/** ... */` 格式
- **AND** 保持中英文双语

#### Scenario: 注释完整性验证

- **GIVEN** 完成类型迁移
- **WHEN** 检查迁移后的类型文件
- **THEN** 所有原类型都有对应的 JSDoc 注释
- **AND** 所有原字段都有对应的 JSDoc 注释
- **AND** 注释内容与原始注释保持一致
- **AND** 如发现注释丢失，必须重新迁移

#### Scenario: 注释对比验证

- **GIVEN** 迁移前的 form.ts 文件和迁移后的类型文件
- **WHEN** 逐行对比注释
- **THEN** 类型注释数量一致
- **AND** 字段注释数量一致
- **AND** 注释内容完整保留

---

## Requirement: 导入路径更新 (Step 5)

系统 SHALL 更新 form.ts 文件中的导入路径，从类型项目导入类型。

#### Scenario: 更新类型导入

- **GIVEN** form.ts 中本地定义了 `StaffInfoFormVO`
- **WHEN** 更新导入路径
- **THEN** 改为 `import type { StaffInfoFormVO } from "@01s-11comm/type"`
- **AND** 移除本地类型定义

#### Scenario: 保留默认值在 form.ts

- **GIVEN** form.ts 中定义了 `defaultForm`
- **WHEN** 执行迁移
- **THEN** `defaultForm` 保持原有定义不变
- **AND** 不从类型项目导入默认值
- **AND** `defaultForm` 继续在 form.ts 中导出

#### Scenario: 验证导入路径

- **GIVEN** 更新后的 form.ts 文件
- **WHEN** 检查导入语句
- **THEN** 所有业务类型从 `@01s-11comm/type` 导入
- **AND** 弹框类型保留本地定义，不导入
- **AND** 使用正确的命名导入语法

#### Scenario: 保留弹框类型本地定义

- **GIVEN** form.ts 中的弹框类型（如 `AddFormProps`, `EditFormProps`）
- **WHEN** 执行迁移
- **THEN** 弹框类型继续在 form.ts 中本地定义
- **AND** 不从类型项目导入弹框类型
- **AND** 弹框类型可以引用已导入的业务类型

---

## Requirement: 验证与测试 (Step 6)

系统 SHALL 确保迁移后的类型能正常工作并通过类型检查。

#### Scenario: 类型项目类型检查

- **GIVEN** 完成业务类型迁移
- **WHEN** 运行 `pnpm -F @01s-11comm/type typecheck`
- **THEN** 输出无报错
- **AND** 所有类型导出正确

#### Scenario: Admin 项目类型检查

- **GIVEN** 更新 form.ts 导入路径
- **WHEN** 运行 `pnpm -F @01s-11comm/admin typecheck`
- **THEN** 输出无报错
- **AND** 所有类型引用正确

#### Scenario: 功能验证

- **GIVEN** 迁移完成的页面
- **WHEN** 启动 Admin 项目
- **THEN** 表单组件正常显示和使用
- **AND** 默认值正确初始化

---

## 目录映射表

| 路由模式 | 类型项目目录 |
|---------|-------------|
| `settingManage.organizeManage.*` | `apps/type/src/business/setting-manage/organize-manage/` |
| `settingManage.systemManage.*` | `apps/type/src/business/setting-manage/system-manage/` |
| `devTeam.menuManage.*` | `apps/type/src/business/dev-team/menu-manage/` |
| `devTeam.cacheManage.*` | `apps/type/src/business/dev-team/cache-manage/` |
| `devTeam.configManage.*` | `apps/type/src/business/dev-team/config-manage/` |
| `operationTeam.systemManage.*` | `apps/type/src/business/operation-team/system-manage/` |
| `operationTeam.dataManage.*` | `apps/type/src/business/operation-team/data-manage/` |
| `operationTeam.merchantManage.*` | `apps/type/src/business/operation-team/merchant-manage/` |
| `operationTeam.reportConfiguration.*` | `apps/type/src/business/operation-team/report-configuration/` |
| `propertyManage.communityManage.*` | `apps/type/src/business/property-manage/community-manage/` |
| `propertyManage.contractManage.*` | `apps/type/src/business/property-manage/contract-manage/` |
| `propertyManage.expenseManage.*` | `apps/type/src/business/property-manage/expense-manage/` |
| `propertyManage.housePropertyManage.*` | `apps/type/src/business/property-manage/house-property-manage/` |
| `propertyManage.parkingManage.*` | `apps/type/src/business/property-manage/parking-manage/` |
| `propertyManage.patrolManage.*` | `apps/type/src/business/property-manage/patrol-manage/` |
| `propertyManage.repairsManage.*` | `apps/type/src/business/property-manage/repairs-manage/` |
| `propertyManage.reportManage.*` | `apps/type/src/business/property-manage/report-manage/` |

## 命名转换示例

### 类型名转换

| 原中文命名 | 转换后英文命名 | 说明 |
|-----------|---------------|------|
| `员工信息表单数据类型` | `StaffInfoFormVO` | PascalCase，保留 FormVO 后缀 |
| `组织信息表单数据` | `OrgInfoFormVO` | PascalCase，保留 FormVO 后缀 |
| `合同甲方数据类型` | `FirstPartyFormVO` | PascalCase，保留 FormVO 后缀 |
| `收费项目设置` | `ExpenseItemSettingVO` | PascalCase，保留 VO 后缀 |

### 字段名转换

| 原中文字段名 | 转换后英文字段名 | 说明 |
|------------|-----------------|------|
| `员工姓名` | `name` | 使用 camelCase |
| `联系电话` | `contactPhone` | 使用 camelCase |
| `统一社会信用代码` | `creditCode` | 使用 camelCase |
| `成立日期` | `establishmentDate` | 使用 camelCase |
| `法定代表人` | `legalRepresentative` | 使用 camelCase |
| `经营范围` | `businessScope` | 使用 camelCase |

## 完整示例

### 迁移前（form.ts）

```typescript
/**
 * 合同甲方表单数据结构定义
 */

export interface FirstPartyFormVO {
	/** 甲方名称 */
	partyA: string;
	/** 甲方联系人 */
	contactPerson: string;
	/** 联系电话 */
	contactPhone: string;
	/** 地址 */
	address: string;
	/** 统一社会信用代码 */
	creditCode: string;
	/** 成立日期 */
	establishmentDate: string;
	/** 法定代表人 */
	legalRepresentative: string;
	/** 经营范围 */
	businessScope: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: FirstPartyFormVO = {
	partyA: "",
	contactPerson: "",
	contactPhone: "",
	address: "",
	creditCode: "",
	establishmentDate: "",
	legalRepresentative: "",
	businessScope: "",
};

/**
 * 合同甲方表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface FirstPartyFormProps {
	/** 表单数据 */
	form: FirstPartyFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: FirstPartyFormVO;
}
```

### 迁移后（first-party.ts）

```typescript
import type { OptionsType } from "../../../common";

/**
 * @description 合同甲方表单数据类型
 * First party form data type
 */
export interface FirstPartyFormVO {
	/** 甲方名称 Party A */
	partyA: string;
	/** 甲方联系人 Contact Person */
	contactPerson: string;
	/** 联系电话 Contact Phone */
	contactPhone: string;
	/** 地址 Address */
	address: string;
	/** 统一社会信用代码 Unified Social Credit Code */
	creditCode: string;
	/** 成立日期 Establishment Date */
	establishmentDate: string;
	/** 法定代表人 Legal Representative */
	legalRepresentative: string;
	/** 经营范围 Business Scope */
	businessScope: string;
}

/**
 * @description 合同甲方表单 props
 * First party form props
 */
export interface FirstPartyFormProps {
	/** 表单数据 Form data */
	form: FirstPartyFormVO;
	/** 表单组件重置时默认使用的对象 Default values */
	defaultValues: FirstPartyFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
```

### 更新后（form.ts）

```typescript
import type { FirstPartyFormVO, FirstPartyFormProps } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: FirstPartyFormVO = {
	partyA: "",
	contactPerson: "",
	contactPhone: "",
	address: "",
	creditCode: "",
	establishmentDate: "",
	legalRepresentative: "",
	businessScope: "",
};
```

## 注意事项

1. **保持兼容性**：迁移过程中确保不影响现有功能
2. **逐步迁移**：建议按模块逐步迁移，每完成一个模块进行验证
3. **备份重要**：在迁移前备份原始文件
4. **文档更新**：及时更新相关文档和注释
5. **测试验证**：每个阶段完成后进行充分测试
6. **注释完整性**：**必须确保所有 JSDoc 注释完整保留，注释丢失视为迁移失败**

## 参考资料

1. `apps/admin/src/router/rank/rank-route-keys.ts` - 路由配置
2. `apps/type/src/business/` - 类型项目业务目录
3. `apps/type/src/common/OptionsType.ts` - 选项类型定义
4. `openspec/changes/migrate-form-ts-to-types-pkg/specs/mode-field-addition/spec.md` - Mode 字段规范
