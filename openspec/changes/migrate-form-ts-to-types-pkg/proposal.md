# 将全部后台项目的 form.ts 文件做迁移重构

## Why

当前后台项目中，form.ts 文件分散在各个业务模块中，存在的问题包括：

1. **业务类型重复定义**：相同的业务类型在多个地方重复定义，维护困难
2. **类型分散管理**：类型定义没有统一管理，散落在各个组件中
3. **中文命名不规范**：部分类型和字段使用中文命名，不符合 TypeScript 最佳实践
4. **公共选项未集中管理**：下拉选项数据在多个文件中重复定义
5. **弹框组件 Props 不一致**：缺少统一的 mode 字段支持

## What Changes

本变更将实现以下核心改动：

### 1. 业务类型统一管理

- 将 form.ts 中的业务类型迁移到 `apps/type/src/business/` 对应目录
- 按模块目录组织类型文件（与 `pages/` 目录结构对应）
- 统一管理所有业务类型定义

### 2. 命名规范化

- **BREAKING**: 所有业务类型字段名从中文切换为英文（驼峰命名法）
- 使用 JSDoc 注释提供中英文双语说明
- 保持类型后缀（FormVO、VO、DTO 等）不变

### 3. 公共选项集中管理

- 将跨模块重复的下拉选项迁移到 `apps/type/src/common/business-options.ts`
- 统一管理所有公共业务选项
- 避免重复定义，提高代码复用性

### 4. Props 接口标准化

- 为所有弹框组件的 Props 类型添加 `mode` 字段
- 支持表单模式切换（新增、编辑、查看等）
- 提高组件的可扩展性

## Impact

### 影响的规范

- **business-type-migration** - 业务类型迁移规范
- **common-options-migration** - 公共选项迁移规范
- **mode-field-addition** - Mode 字段添加规范

### 预期收益

- 减少代码重复，提高可维护性
- 建立统一的类型管理规范
- 提高代码质量和可读性
- 为后续功能扩展奠定基础

## Overview

本文档旨在对后台项目（apps/admin）中的所有 form.ts 文件进行全面迁移重构，将业务类型定义、下拉选项数据迁移到类型项目（apps/type）中，以实现类型定义的统一管理和复用。

## 背景

当前后台项目中，form.ts 文件分散在各个业务模块中，存在的问题包括：

1. **业务类型重复定义**：相同的业务类型在多个地方重复定义，维护困难
2. **类型分散管理**：类型定义没有统一管理，散落在各个组件中
3. **中文命名不规范**：部分类型和字段使用中文命名，不符合 TypeScript 最佳实践
4. **公共选项未集中管理**：下拉选项数据在多个文件中重复定义
5. **弹框组件 Props 不一致**：缺少统一的 mode 字段支持

## 目标

### 主要目标

1. **统一业务类型管理**：将 form.ts 中的业务类型迁移到类型项目的对应业务目录
2. **规范化命名**：将中文命名的类型和字段统一改为英文命名
3. **集中公共选项**：将下拉选项数据迁移到 `business-options.ts` 统一管理
4. **标准化 Props**：为所有弹框组件的 Props 类型添加 mode 字段

### 预期成果

- 完成所有 form.ts 文件的迁移重构
- 建立统一的类型管理规范
- 减少代码重复，提高可维护性
- 建立可扩展的类型管理机制

## 范围界定

### 涉及的文件范围

根据 `apps/admin/src/router/rank/rank-route-keys.ts` 中定义的 `RANK_ROUTE_KEYS` 数组，三级路由覆盖以下模块：

#### settingManage.organizeManage 三级路由（7个）
- `settingManage.organizeManage.staffInfo`
- `settingManage.organizeManage.orgInfo`
- `settingManage.organizeManage.workingSchedule`
- `settingManage.organizeManage.schedulingSetting`
- `settingManage.organizeManage.shiftSetting`
- `settingManage.organizeManage.rolePermission`
- `settingManage.organizeManage.dataPermission`

#### settingManage.systemManage 三级路由（5个）
- `settingManage.systemManage.changePassword`
- `settingManage.systemManage.systemConfig`
- `settingManage.systemManage.registerProtocol`
- `settingManage.systemManage.initializeCell`
- `settingManage.systemManage.communityConfiguration`

#### devTeam.menuManage 三级路由（3个）
- `devTeam.menuManage.catalog`
- `devTeam.menuManage.group`
- `devTeam.menuManage.item`

#### devTeam.cacheManage 三级路由（1个）
- `devTeam.cacheManage.refreshCache`

#### devTeam.configManage 三级路由（4个）
- `devTeam.configManage.type`
- `devTeam.configManage.item`
- `devTeam.configManage.dictionary`
- `devTeam.configManage.center`

#### operationTeam.systemManage 三级路由（5个）
- `operationTeam.systemManage.changePassword`
- `operationTeam.systemManage.systemConfig`
- `operationTeam.systemManage.registerProtocol`
- `operationTeam.systemManage.initializeCell`
- `operationTeam.systemManage.communityConfiguration`

#### operationTeam.dataManage 三级路由（2个）
- `operationTeam.dataManage.communityInformation`
- `operationTeam.dataManage.propertyManagementCompany`

#### operationTeam.merchantManage 三级路由（2个）
- `operationTeam.merchantManage.merchantInfo`
- `operationTeam.merchantManage.merchantAdmin`

#### operationTeam.reportConfiguration 三级路由（3个）
- `operationTeam.reportConfiguration.reportGroup`
- `operationTeam.reportConfiguration.reportInfo`
- `operationTeam.reportConfiguration.reportComponent`

#### propertyManage.communityManage 三级路由（7个）
- `propertyManage.communityManage.houseDecoration`
- `propertyManage.communityManage.buildingSpaceStructureDiagram`
- `propertyManage.communityManage.notice`
- `propertyManage.communityManage.propertyRegister`
- `propertyManage.communityManage.handingBusiness`
- `propertyManage.communityManage.my`
- `propertyManage.communityManage.parkingSpaceStructureDiagram`

#### propertyManage.contractManage 三级路由（5个）
-Manage.change`
- `propertyManage.contract `propertyManage.contractManage.draftContract`
- `propertyManage.contractManage.expire`
- `propertyManage.contractManage.firstParty`
- `propertyManage.contractManage.type`

#### propertyManage.expenseManage 三级路由（16个）
- `propertyManage.expenseManage.waterAndElectricityMeterReading`
- `propertyManage.expenseManage.vehicleCharge`
- `propertyManage.expenseManage.reminderForOverduePayments`
- `propertyManage.expenseManage.reprintVoucher`
- `propertyManage.expenseManage.overduePaymentInformation`
- `propertyManage.expenseManage.paymentReview`
- `propertyManage.expenseManage.refundReview`
- `propertyManage.expenseManage.houseCharge`
- `propertyManage.expenseManage.meterReadingType`
- `propertyManage.expenseManage.discountType`
- `propertyManage.expenseManage.expenseSummaryTable`
- `propertyManage.expenseManage.discountApply`
- `propertyManage.expenseManage.discountSetting`
- `propertyManage.expenseManage.contracteCharge`
- `propertyManage.expenseManage.expenseItemSetting`
- `propertyManage.expenseManage.cancelFee`

#### propertyManage.housePropertyManage 三级路由（10个）
- `propertyManage.housePropertyManage.house`
- `propertyManage.housePropertyManage.invoice`
- `propertyManage.housePropertyManage.invoiceTitle`
- `propertyManage.housePropertyManage.ownerAccount`
- `propertyManage.housePropertyManage.ownerInformation`
- `propertyManage.housePropertyManage.ownerMember`
- `propertyManage.housePropertyManage.ownersCommittee`
- `propertyManage.housePropertyManage.reserveVenue`
- `propertyManage.housePropertyManage.reserveVenueOrder`
- `propertyManage.housePropertyManage.siteManagement`

#### propertyManage.parkingManage 三级路由（4个）
- `propertyManage.parkingManage.carportApply`
- `propertyManage.parkingManage.carportInfo`
- `propertyManage.parkingManage.ownerVehicle`
- `propertyManage.parkingManage.parkingLot`

#### propertyManage.patrolManage 三级路由（6个）
- `propertyManage.patrolManage.detail`
- `propertyManage.patrolManage.item`
- `propertyManage.patrolManage.path`
- `propertyManage.patrolManage.plan`
- `propertyManage.patrolManage.point`
- `propertyManage.patrolManage.task`

#### propertyManage.repairsManage 三级路由（7个）
- `propertyManage.repairsManage.issues`
- `propertyManage.repairsManage.mandatoryReturnIssue`
- `propertyManage.repairsManage.phoneReportRepairs`
- `propertyManage.repairsManage.repairsHaveDone`
- `propertyManage.repairsManage.repairsSetting`
- `propertyManage.repairsManage.repairsTodo`
- `propertyManage.repairsManage.returnVisit`

#### propertyManage.reportManage 三级路由（12个）
- `propertyManage.reportManage.arrearsDetailsList`
- `propertyManage.reportManage.dataStatistics`
- `propertyManage.reportManage.depositReport`
- `propertyManage.reportManage.expenseSummaryTable`
- `propertyManage.reportManage.feeReminder`
- `propertyManage.reportManage.noChargeHouse`
- `propertyManage.reportManage.outstandingFeesAnalysis`
- `propertyManage.reportManage.ownerPaymentDetails`
- `propertyManage.reportManage.patrolReport`
- `propertyManage.reportManage.paymentDetailsForm`
- `propertyManage.reportManage.repairReportForm`
- `propertyManage.reportManage.repairReportsSummaryTable`
- `propertyManage.reportManage.statementExpenses`

### 目标文件路径

每个三级路由对应的 form.ts 文件路径格式为：
`apps/admin/src/pages/{一级路由}/{二级路由}/{三级路由}/components/form.ts`

例如：
- `apps/admin/src/pages/setting-manage/organize-manage/staff-info/components/form.ts`
- `apps/admin/src/pages/property-manage/contract-manage/first-party/components/form.ts`

## 详细要求

### 要求 1：业务类型迁移

将 form.ts 文件中的业务类型迁移到类型项目的对应业务目录。

#### 目录映射规则

- `settingManage.organizeManage.*` → `apps/type/src/business/setting-manage/organize-manage/`
- `settingManage.systemManage.*` → `apps/type/src/business/setting-manage/system-manage/`
- `devTeam.menuManage.*` → `apps/type/src/business/dev-team/menu-manage/`
- `devTeam.cacheManage.*` → `apps/type/src/business/dev-team/cache-manage/`
- `devTeam.configManage.*` → `apps/type/src/business/dev-team/config-manage/`
- `operationTeam.systemManage.*` → `apps/type/src/business/operation-team/system-manage/`
- `operationTeam.dataManage.*` → `apps/type/src/business/operation-team/data-manage/`
- `operationTeam.merchantManage.*` → `apps/type/src/business/operation-team/merchant-manage/`
- `operationTeam.reportConfiguration.*` → `apps/type/src/business/operation-team/report-configuration/`
- `propertyManage.communityManage.*` → `apps/type/src/business/property-manage/community-manage/`
- `propertyManage.contractManage.*` → `apps/type/src/business/property-manage/contract-manage/`
- `propertyManage.expenseManage.*` → `apps/type/src/business/property-manage/expense-manage/`
- `propertyManage.housePropertyManage.*` → `apps/type/src/business/property-manage/house-property-manage/`
- `propertyManage.parkingManage.*` → `apps/type/src/business/property-manage/parking-manage/`
- `propertyManage.patrolManage.*` → `apps/type/src/business/property-manage/patrol-manage/`
- `propertyManage.repairsManage.*` → `apps/type/src/business/property-manage/repairs-manage/`
- `propertyManage.reportManage.*` → `apps/type/src/business/property-manage/report-manage/`

#### 迁移规则

1. **类型名称规范化**：
   - 将中文类型名称改为英文（如：`员工信息表单数据类型` → `StaffInfoFormVO`）
   - 保留原有的 VO、DTO、FormVO 等后缀
   - 使用 PascalCase 命名规范

2. **字段名称规范化**：
   - 将中文字段名改为英文（如：`员工姓名` → `name`）
   - 使用 camelCase 命名规范
   - 保留原有的注释说明

3. **保留 JSDoc 注释**：
   - 所有类型和字段的 JSDoc 注释必须保留
   - 保持中英文双语注释格式

4. **导入路径规范**：
   - 类型项目内的相对路径导入（如：`../../../common`）
   - Admin 项目的包导入（如：`@01s-11comm/type`）

#### 示例

**迁移前**（form.ts）：
```typescript
/** 员工信息表单数据类型 */
export interface StaffInfoFormVO {
	/** 员工姓名 */
	name: string;
	/** 性别 */
	gender: string;
	/** 职位 */
	position: string;
}
```

**迁移后**（apps/type/src/business/setting-manage/organize-manage/staff-info.ts）：
```typescript
/**
 * @description 员工信息表单数据类型
 * Staff info form data type
 */
export interface StaffInfoFormVO {
	/** 员工姓名 Name */
	name: string;
	/** 性别 Gender */
	gender: string;
	/** 职位 Position */
	position: string;
}
```

### 要求 2：公共选项迁移

将 form.ts 文件中的下拉选项数据迁移到 `apps/type/src/common/business-options.ts` 统一管理。

#### 迁移规则

1. **识别公共选项**：
   - 在 2 个或以上业务模块中出现的相同选项数组
   - 选项内容完全一致
   - 语义通用，非特定模块专有

2. **文件结构**：
   - 所有公共选项统一存放在 `apps/type/src/common/business-options.ts`
   - 使用 `export const` 导出
   - 每个选项数组包含 JSDoc 注释

3. **命名规范**：
   - 使用英文命名，禁止中文变量名
   - 遵循 `业务概念 + Options` 格式（如：`contractTypeOptions`）

4. **集成规范**：
   - 业务类型文件从 `business-options.ts` 导入公共选项
   - Admin 项目从 `@01s-11comm/type` 导入公共选项
   - 删除重复的本地定义

#### 示例

**迁移前**（form.ts）：
```typescript
/** 合同类型选项 */
export const contractTypeOptions = [
	{ label: "物业服务合同", value: "物业服务合同" },
	{ label: "租赁合同", value: "租赁合同" },
	{ label: "维修合同", value: "维修合同" },
];
```

**迁移后**（business-options.ts）：
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

**form.ts 使用**：
```typescript
import { contractTypeOptions } from "@01s-11comm/type";
export { contractTypeOptions };
```

### 要求 3：Mode 字段添加

为所有弹框组件的 Props 类型添加非必填的 `mode` 字段。

#### 添加规则

1. **字段定义**：
   - 字段名：`mode`
   - 类型：`Mode`（全局类型，无需导入）
   - 必填性：可选（使用 `?`）

2. **JSDoc 注释**：
   - 添加字段说明：`/** 表单模式 */`

3. **适用场景**：
   - 所有 form.ts 中的 Props 接口
   - 包括但不限于：`AddFormProps`、`EditFormProps`、`ViewFormProps` 等

#### 示例

**修改前**：
```typescript
export interface StaffInfoFormProps {
	form: StaffInfoFormVO;
	defaultValues: StaffInfoFormVO;
}
```

**修改后**：
```typescript
export interface StaffInfoFormProps {
	form: StaffInfoFormVO;
	defaultValues: StaffInfoFormVO;
	/** 表单模式 */
	mode?: Mode;
}
```

## 实施计划

### 阶段 1：业务类型迁移（50+ 文件）
按模块分组，逐步迁移所有三级路由对应的 form.ts 文件中的业务类型到类型项目。

### 阶段 2：公共选项迁移
识别重复的下拉选项，迁移到 `business-options.ts`，并更新所有引用。

### 阶段 3：Mode 字段添加
为所有 Props 接口添加 `mode` 字段，确保类型一致性。

### 阶段 4：验证与测试
- 运行类型检查：`pnpm -F @01s-11comm/type typecheck`
- 运行类型检查：`pnpm -F @01s-11comm/admin typecheck`
- 验证所有文件的导入导出正确性

## 风险与缓解

### 风险 1：类型兼容性问题
**风险**：迁移过程中可能出现类型不兼容
**缓解**：
- 逐步迁移，每完成一个模块进行类型检查
- 保留原有类型作为过渡（可选导出）

### 风险 2：导入路径错误
**风险**：迁移后导入路径不正确
**缓解**：
- 使用自动化工具验证导入路径
- 建立导入路径规范文档

### 风险 3：中文命名遗漏
**风险**：部分中文命名未完全替换
**缓解**：
- 建立命名规范检查清单
- 使用 ESLint 规则辅助检查

## 成功标准

1. **完成度**：100% 的 form.ts 文件完成迁移重构
2. **类型检查**：通过 `pnpm typecheck` 无报错
3. **代码规范**：所有类型和字段使用英文命名
4. **公共选项**：所有重复选项迁移到 `business-options.ts`
5. **Props 一致性**：所有 Props 接口包含 `mode` 字段

## 参考资料

1. `apps/admin/src/router/rank/rank-route-keys.ts` - 路由配置
2. `openspec/changes/migrate-static-data-to-nitro-query/specs/common-business-options/spec.md` - 公共选项迁移规范
3. `apps/type/src/` - 类型项目结构
4. `apps/type/src/common/business-options.ts` - 公共选项文件示例
