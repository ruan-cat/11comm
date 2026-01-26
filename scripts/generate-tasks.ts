#!/usr/bin/env tsx

/**
 * @file 生成 migrate-static-data-to-nitro-query 任务清单
 * @description 自动生成包含所有 133 个三级路由的详细任务清单
 */

import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

/** ES 模块兼容：获取 __dirname */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** 路由配置接口 */
interface RouteConfig {
	/** 路由路径（点分隔） */
	path: string;
	/** 中文名称 */
	label: string;
	/** 文件路径（短横线分隔） */
	filePath: string;
}

/** 模块配置接口 */
interface ModuleConfig {
	/** 模块名称 */
	name: string;
	/** 中文标题 */
	title: string;
	/** 路由列表 */
	routes: RouteConfig[];
}

/**
 * 将驼峰命名转换为短横线命名
 * @example staffInfo -> staff-info
 */
function camelToKebab(str: string): string {
	return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * 将路由路径转换为文件路径
 * @example settingManage.organizeManage.staffInfo -> setting-manage/organize-manage/staff-info
 */
function routePathToFilePath(routePath: string): string {
	return routePath.split(".").map(camelToKebab).join("/");
}

/**
 * 生成路由配置
 */
function generateRouteConfig(routePath: string, label: string): RouteConfig {
	return {
		path: routePath,
		label,
		filePath: routePathToFilePath(routePath),
	};
}

/** 所有模块配置 */
const modules: ModuleConfig[] = [
	{
		name: "settingManage",
		title: "设置管理",
		routes: [
			generateRouteConfig("settingManage.organizeManage.staffInfo", "员工信息"),
			generateRouteConfig("settingManage.organizeManage.orgInfo", "组织信息"),
			generateRouteConfig("settingManage.organizeManage.workingSchedule", "排班表"),
			generateRouteConfig("settingManage.organizeManage.schedulingSetting", "排班设置"),
			generateRouteConfig("settingManage.organizeManage.shiftSetting", "班次设置"),
			generateRouteConfig("settingManage.organizeManage.rolePermission", "角色权限"),
			generateRouteConfig("settingManage.organizeManage.dataPermission", "数据权限"),
			generateRouteConfig("settingManage.systemManage.changePassword", "修改密码"),
			generateRouteConfig("settingManage.systemManage.systemConfig", "系统配置"),
			generateRouteConfig("settingManage.systemManage.registerProtocol", "注册协议"),
			generateRouteConfig("settingManage.systemManage.initializeCell", "初始化小区"),
			generateRouteConfig("settingManage.systemManage.communityConfiguration", "小区配置"),
		],
	},
	{
		name: "devTeam",
		title: "开发团队",
		routes: [
			generateRouteConfig("devTeam.menuManage.catalog", "菜单目录"),
			generateRouteConfig("devTeam.menuManage.group", "菜单组"),
			generateRouteConfig("devTeam.menuManage.item", "菜单项"),
			generateRouteConfig("devTeam.cacheManage.refreshCache", "刷新缓存"),
			generateRouteConfig("devTeam.configManage.type", "字典类型"),
			generateRouteConfig("devTeam.configManage.item", "配置项"),
			generateRouteConfig("devTeam.configManage.dictionary", "字典"),
			generateRouteConfig("devTeam.configManage.center", "配置中心"),
		],
	},
	{
		name: "operationTeam",
		title: "运营团队",
		routes: [
			generateRouteConfig("operationTeam.systemManage.changePassword", "修改密码"),
			generateRouteConfig("operationTeam.systemManage.systemConfig", "系统配置"),
			generateRouteConfig("operationTeam.systemManage.registerProtocol", "注册协议"),
			generateRouteConfig("operationTeam.systemManage.initializeCell", "初始化小区"),
			generateRouteConfig("operationTeam.systemManage.communityConfiguration", "小区配置"),
			generateRouteConfig("operationTeam.dataManage.communityInformation", "小区信息"),
			generateRouteConfig("operationTeam.dataManage.propertyManagementCompany", "物业公司"),
			generateRouteConfig("operationTeam.merchantManage.merchantInfo", "商户信息"),
			generateRouteConfig("operationTeam.merchantManage.merchantAdmin", "商户管理员"),
			generateRouteConfig("operationTeam.reportConfiguration.reportGroup", "报表组"),
			generateRouteConfig("operationTeam.reportConfiguration.reportInfo", "报表信息"),
			generateRouteConfig("operationTeam.reportConfiguration.reportComponent", "报表组件"),
		],
	},
	{
		name: "propertyManage",
		title: "物业管理",
		routes: [
			generateRouteConfig("propertyManage.communityManage.houseDecoration", "房屋装修"),
			generateRouteConfig("propertyManage.communityManage.buildingSpaceStructureDiagram", "楼栋结构图"),
			generateRouteConfig("propertyManage.communityManage.notice", "小区公示"),
			generateRouteConfig("propertyManage.communityManage.propertyRegister", "产权登记"),
			generateRouteConfig("propertyManage.communityManage.handingBusiness", "业务受理"),
			generateRouteConfig("propertyManage.communityManage.my", "我的"),
			generateRouteConfig("propertyManage.communityManage.parkingSpaceStructureDiagram", "车位结构图"),
			generateRouteConfig("propertyManage.contractManage.change", "合同变更"),
			generateRouteConfig("propertyManage.contractManage.draftContract", "起草合同"),
			generateRouteConfig("propertyManage.contractManage.expire", "到期合同"),
			generateRouteConfig("propertyManage.contractManage.firstParty", "合同甲方"),
			generateRouteConfig("propertyManage.contractManage.type", "合同类型"),
			generateRouteConfig("propertyManage.expenseManage.waterAndElectricityMeterReading", "水电抄表"),
			generateRouteConfig("propertyManage.expenseManage.vehicleCharge", "车辆收费"),
			generateRouteConfig("propertyManage.expenseManage.reminderForOverduePayments", "欠费催缴"),
			generateRouteConfig("propertyManage.expenseManage.reprintVoucher", "补打收据"),
			generateRouteConfig("propertyManage.expenseManage.overduePaymentInformation", "欠费信息"),
			generateRouteConfig("propertyManage.expenseManage.paymentReview", "缴费审核"),
			generateRouteConfig("propertyManage.expenseManage.refundReview", "退费审核"),
			generateRouteConfig("propertyManage.expenseManage.houseCharge", "房屋收费"),
			generateRouteConfig("propertyManage.expenseManage.meterReadingType", "抄表类型"),
			generateRouteConfig("propertyManage.expenseManage.discountType", "优惠类型"),
			generateRouteConfig("propertyManage.expenseManage.expenseSummaryTable", "费用汇总表"),
			generateRouteConfig("propertyManage.expenseManage.discountApply", "优惠申请"),
			generateRouteConfig("propertyManage.expenseManage.discountSetting", "折扣设置"),
			generateRouteConfig("propertyManage.expenseManage.contracteCharge", "合同收费"),
			generateRouteConfig("propertyManage.expenseManage.expenseItemSetting", "费用项目设置"),
			generateRouteConfig("propertyManage.expenseManage.cancelFee", "取消费用"),
			generateRouteConfig("propertyManage.housePropertyManage.house", "房屋管理"),
			generateRouteConfig("propertyManage.housePropertyManage.invoice", "发票"),
			generateRouteConfig("propertyManage.housePropertyManage.invoiceTitle", "发票抬头"),
			generateRouteConfig("propertyManage.housePropertyManage.ownerAccount", "业主账户"),
			generateRouteConfig("propertyManage.housePropertyManage.ownerInformation", "业主信息"),
			generateRouteConfig("propertyManage.housePropertyManage.ownerMember", "业主成员"),
			generateRouteConfig("propertyManage.housePropertyManage.ownersCommittee", "业委会"),
			generateRouteConfig("propertyManage.housePropertyManage.reserveVenue", "场地预约"),
			generateRouteConfig("propertyManage.housePropertyManage.reserveVenueOrder", "预约场馆订单"),
			generateRouteConfig("propertyManage.housePropertyManage.siteManagement", "场地管理"),
			generateRouteConfig("propertyManage.parkingManage.carportApply", "车位申请"),
			generateRouteConfig("propertyManage.parkingManage.carportInfo", "车位信息"),
			generateRouteConfig("propertyManage.parkingManage.ownerVehicle", "业主车辆"),
			generateRouteConfig("propertyManage.parkingManage.parkingLot", "停车场管理"),
			generateRouteConfig("propertyManage.patrolManage.detail", "巡检明细"),
			generateRouteConfig("propertyManage.patrolManage.item", "巡检项目"),
			generateRouteConfig("propertyManage.patrolManage.path", "巡检路线"),
			generateRouteConfig("propertyManage.patrolManage.plan", "巡检计划"),
			generateRouteConfig("propertyManage.patrolManage.point", "巡检点"),
			generateRouteConfig("propertyManage.patrolManage.task", "巡检任务"),
			generateRouteConfig("propertyManage.repairsManage.issues", "工单池"),
			generateRouteConfig("propertyManage.repairsManage.mandatoryReturnIssue", "强制回单"),
			generateRouteConfig("propertyManage.repairsManage.phoneReportRepairs", "电话报修"),
			generateRouteConfig("propertyManage.repairsManage.repairsHaveDone", "报修已办"),
			generateRouteConfig("propertyManage.repairsManage.repairsSetting", "报修设置"),
			generateRouteConfig("propertyManage.repairsManage.repairsTodo", "报修待办"),
			generateRouteConfig("propertyManage.repairsManage.returnVisit", "报修回访"),
			generateRouteConfig("propertyManage.reportManage.arrearsDetailsList", "欠费明细表"),
			generateRouteConfig("propertyManage.reportManage.dataStatistics", "数据统计"),
			generateRouteConfig("propertyManage.reportManage.depositReport", "押金报表"),
			generateRouteConfig("propertyManage.reportManage.expenseSummaryTable", "费用汇总表"),
			generateRouteConfig("propertyManage.reportManage.feeReminder", "费用提醒"),
			generateRouteConfig("propertyManage.reportManage.noChargeHouse", "未收费房屋"),
			generateRouteConfig("propertyManage.reportManage.outstandingFeesAnalysis", "欠费分析"),
			generateRouteConfig("propertyManage.reportManage.ownerPaymentDetails", "业主缴费明细"),
			generateRouteConfig("propertyManage.reportManage.patrolReport", "巡检报表"),
			generateRouteConfig("propertyManage.reportManage.paymentDetailsForm", "缴费明细表"),
			generateRouteConfig("propertyManage.reportManage.repairReportForm", "维修报告表"),
			generateRouteConfig("propertyManage.reportManage.repairReportsSummaryTable", "报修汇总表"),
			generateRouteConfig("propertyManage.reportManage.statementExpenses", "费用明细表"),
		],
	},
];

/**
 * 生成单个路由的任务清单
 */
function generateRouteTasks(route: RouteConfig, moduleIndex: number, routeIndex: number): string {
	const taskId = `${moduleIndex}.${routeIndex}`;

	return `
#### ${taskId} ${route.path}（${route.label}）

**路由路径**：\`${route.path}\`

- [ ] Task ${taskId}.1: 创建类型定义文件 \`apps/type/src/business/${route.filePath}.ts\`
- [ ] Task ${taskId}.2: 创建 Mock 数据文件 \`apps/admin/server/api/${route.filePath}/mock-data.ts\`
- [ ] Task ${taskId}.3: 创建 Nitro 接口文件 \`apps/admin/server/api/${route.filePath}/list.post.ts\`
- [ ] Task ${taskId}.4: 创建前端 API Hook \`apps/admin/src/api/${route.filePath}/index.ts\`
- [ ] Task ${taskId}.5: 改写列表页 \`apps/admin/src/pages/${route.filePath}/index.vue\`
- [ ] Task ${taskId}.6: 删除旧的假数据文件 \`apps/admin/src/pages/${route.filePath}/test-data.ts\`
- [ ] Task ${taskId}.7: 更新表单类型文件 \`apps/admin/src/pages/${route.filePath}/components/form.ts\`
- [ ] Task ${taskId}.8: 更新表单组件 \`apps/admin/src/pages/${route.filePath}/components/form.vue\`
- [ ] Task ${taskId}.9: 运行类型检查 \`pnpm typecheck\`
- [ ] Task ${taskId}.10: 测试验证
`.trim();
}

/**
 * 生成模块的所有任务
 */
function generateModuleTasks(module: ModuleConfig, moduleIndex: number): string {
	const tasks = module.routes.map((route, index) => generateRouteTasks(route, moduleIndex, index + 1)).join("\n\n");

	return `
### ${moduleIndex}. ${module.name}（${module.title}）- ${module.routes.length} 个三级路由

${tasks}
`.trim();
}

/**
 * 生成完整的任务清单
 */
function generateFullTasks(): string {
	const totalRoutes = modules.reduce((sum, module) => sum + module.routes.length, 0);
	const totalTasks = totalRoutes * 10;
	const estimatedHours = totalRoutes * 2.5;

	const moduleTasks = modules.map((module, index) => generateModuleTasks(module, index + 1)).join("\n\n");

	const progressTracking = modules
		.map((module, index) => `- [ ] ${module.name}: 0/${module.routes.length} (0%)`)
		.join("\n");

	const milestones = modules
		.map((module, index) => `- [ ] Milestone ${index + 1}: 完成 ${module.name} 模块（${module.routes.length} 个路由）`)
		.join("\n");

	return `# migrate-static-data-to-nitro-query 任务清单

## 任务概述

本任务清单用于迁移 ${totalRoutes} 个三级路由的列表页，从本地假数据迁移到 Nitro 后端 + TanStack Query 体系。

## 任务统计

- **总计三级路由数**：${totalRoutes} 个
- **总计任务数**：${totalTasks} 个（每个路由 10 个任务）
- **预计工时**：约 ${estimatedHours} 小时（每个路由约 2.5 小时）

## 任务分组

${moduleTasks}

## 任务执行规范

### 严格的执行顺序

对于每个三级路由，**必须严格按照以下顺序执行任务，不允许跳步**：

1. **类型定义层**（Task X.Y.1）- 必须首先完成，确保类型安全的基础
2. **数据层**（Task X.Y.2）- 依赖类型定义，创建 Mock 数据
3. **API 层**（Task X.Y.3）- 依赖类型定义和数据层，创建 Nitro 接口
4. **前端 Hook 层**（Task X.Y.4）- 依赖 API 层，封装数据查询逻辑
5. **列表页改造**（Task X.Y.5）- 依赖 Hook 层，使用新的数据获取方式
6. **清理旧代码**（Task X.Y.6）- 删除旧的假数据文件
7. **表单类型迁移**（Task X.Y.7 和 Task X.Y.8）- 更新表单相关文件，使用类型库
8. **类型检查**（Task X.Y.9）- 确保无类型报错
9. **测试验证**（Task X.Y.10）- 功能测试，验收标准检查

### 每个任务的详细要求

#### Task X.Y.1: 创建类型定义文件

**任务内容**：
- 定义 {Page}ListItem 接口（所有字段英文+JSDoc注释）
- 定义 {Page}QueryParams 接口（包含分页参数）
- 定义相关枚举类型（如 Status、Type 等）
- 导出 Options 常量（下拉选择用）

**验收标准**：
- ✅ 所有字段名为英文驼峰命名
- ✅ 每个字段有 JSDoc 注释（中文+英文）
- ✅ 枚举值保持中文
- ✅ Options 导出正确

#### Task X.Y.2: 创建 Mock 数据文件

**任务内容**：
- 导入 {Page}ListItem 类型
- 创建 mock{Page}Data 数组
- 数据量：至少 20-50 条
- 数据类型约束满足 {Page}ListItem

**验收标准**：
- ✅ 类型约束正确
- ✅ 数据字段名为英文
- ✅ 数据量充足（20-50条）

#### Task X.Y.3: 创建 Nitro 接口文件

**任务内容**：
- 导入必要的类型（JsonVO、PageDTO、{Page}ListItem、{Page}QueryParams）
- 使用 defineHandler 和 readBody（从 nitro/h3 导入）
- 实现筛选逻辑（字符串模糊匹配、枚举精确匹配）
- 实现分页逻辑（slice）
- 返回 JsonVO<PageDTO<{Page}ListItem>> 格式
- 添加 JSDoc 注释

**验收标准**：
- ✅ 使用 Nitro v3 写法
- ✅ 返回值有完整类型约束
- ✅ 筛选和分页逻辑正确
- ✅ 有 JSDoc 注释

#### Task X.Y.4: 创建前端 API Hook

**任务内容**：
- 定义 use{Page}ListQuery Hook
- 调用通用 useListQuery
- 配置 queryKeyPrefix（完整路径）
- 配置 apiUrl（对应 Nitro 接口路径）

**验收标准**：
- ✅ queryKeyPrefix 格式正确
- ✅ apiUrl 路径正确
- ✅ 类型泛型参数正确

#### Task X.Y.5: 改写列表页

**任务内容**：
- 导入类型和 Hook
- 使用 use{Page}ListQuery 获取数据
- 移除本地 test-data 导入
- 配置搜索和分页
- 使用 isLoading 控制 loading 状态
- 监听 data 变化更新 tableData

**验收标准**：
- ✅ 无 test-data 导入
- ✅ 使用 TanStack Query Hook
- ✅ 搜索和分页功能正常
- ✅ loading 状态正确

#### Task X.Y.6: 删除旧的假数据文件

**任务内容**：
- 删除 test-data.ts 文件
- 确保无任何文件引用

**验收标准**：
- ✅ 文件已删除
- ✅ 无导入引用报错

#### Task X.Y.7: 更新表单类型文件

**任务内容**：
- 从 @01s-11comm/type 导入类型
- 移除本地类型定义
- 使用类型库提供的 Options
- 字段名改为纯英文

**验收标准**：
- ✅ 所有类型从类型库导入
- ✅ 无本地类型定义
- ✅ Options 从类型库导入

#### Task X.Y.8: 更新表单组件

**任务内容**：
- 导入类型库的 Options
- 更新表单项配置
- 使用纯英文类型
- prop 字段名更新为英文

**验收标准**：
- ✅ Options 从类型库导入
- ✅ 表单项配置正确
- ✅ 类型约束正确

#### Task X.Y.9: 运行类型检查

**命令**：\`pnpm typecheck\`

**任务内容**：
- 运行类型检查
- 修复所有类型报错
- 确保类型库和 admin 项目无报错

**验收标准**：
- ✅ typecheck 通过
- ✅ 无类型报错

#### Task X.Y.10: 测试验证

**任务内容**：
- 启动开发服务器测试列表加载
- 测试搜索功能
- 测试分页功能
- 测试新增/编辑/删除功能
- 测试 loading 状态
- 测试错误处理

**验收标准**：
- ✅ 所有功能正常
- ✅ 无 console 报错
- ✅ 数据加载正确

### 总体验收标准

每个三级路由完成后，必须满足以下验收标准：

- ✅ 类型检查无报错（\`pnpm typecheck\`）
- ✅ 列表页初始加载正常
- ✅ 搜索功能正常
- ✅ 分页功能正常
- ✅ Loading 状态显示正确
- ✅ 错误处理正常
- ✅ 新增/编辑/删除功能正常
- ✅ 无旧的 test-data.ts 文件残留
- ✅ 所有类型从 @01s-11comm/type 导入
- ✅ 所有 Options 从类型库导入

## 进度追踪

### 总体进度

${progressTracking}
- **总计**: 0/${totalRoutes} (0%)

### 里程碑

${milestones}
- [ ] Milestone ${modules.length + 1}: 全部验证通过

## 参考文档

- [proposal.md](./proposal.md) - 变更提案
- [design.md](./design.md) - 技术设计
- [specs/nitro-api/spec.md](./specs/nitro-api/spec.md) - Nitro API 规范
- [specs/type-system/spec.md](./specs/type-system/spec.md) - 类型系统规范
- [specs/data-fetching/spec.md](./specs/data-fetching/spec.md) - 数据获取规范
- [specs/list-page-pattern/spec.md](./specs/list-page-pattern/spec.md) - 列表页模式规范
- [specs/common-business-options/spec.md](./specs/common-business-options/spec.md) - 公共业务选项规范

## 说明

本任务清单由脚本自动生成，包含所有 ${totalRoutes} 个三级路由的完整任务清单。

**生成时间**：${new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}
**脚本位置**：\`scripts/generate-tasks.ts\`

如需更新任务清单，请运行：\`pnpm tsx scripts/generate-tasks.ts\`
`;
}

/**
 * 主函数
 */
function main() {
	const outputPath = join(__dirname, "..", "openspec", "changes", "migrate-static-data-to-nitro-query", "tasks.md");

	const content = generateFullTasks();

	writeFileSync(outputPath, content, "utf-8");

	console.log("✅ 任务清单生成成功！");
	console.log(`📄 文件位置：${outputPath}`);
	console.log(`📊 统计信息：`);
	console.log(`   - 模块数：${modules.length}`);
	console.log(`   - 路由数：${modules.reduce((sum, m) => sum + m.routes.length, 0)}`);
	console.log(`   - 任务数：${modules.reduce((sum, m) => sum + m.routes.length, 0) * 10}`);
}

// 执行脚本
main();
