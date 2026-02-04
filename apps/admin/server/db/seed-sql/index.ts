export * from "./types";
export * from "./id-map";
export * from "./utils";
export * from "./community";
export * from "./setting";
export * from "./house-property";
export * from "./patrol";
export * from "./contract";
export * from "./parking";
export * from "./expense";
export * from "./repairs";
export * from "./operation";
export * from "./dev";
export * from "./report";

import { SeedModuleConfig } from "./types";
import { generateCommunitySql } from "./community";
import { generateSettingSql } from "./setting";
import { generateHousePropertySql } from "./house-property";
import { generatePatrolSql } from "./patrol";
import { generateContractSql } from "./contract";
import { generateParkingSql } from "./parking";
import { generateExpenseSql } from "./expense";
import { generateRepairsSql } from "./repairs";
import { generateOperationSql } from "./operation";
import { generateDevSql } from "./dev";
import { generateReportSql } from "./report";

export const seedModuleConfigs: SeedModuleConfig[] = [
	{
		id: "00-dev",
		name: "dev",
		displayName: "开发配置基础数据",
		dependencies: [],
		generator: generateDevSql,
	},
	{
		id: "01-community",
		name: "community",
		displayName: "社区管理基础数据",
		dependencies: [],
		generator: generateCommunitySql,
	},
	{
		id: "02-setting",
		name: "setting",
		displayName: "系统设置与组织架构",
		dependencies: ["01-community"],
		generator: generateSettingSql,
	},
	{
		id: "03-house-property",
		name: "house-property",
		displayName: "房产与业主数据",
		dependencies: ["01-community"],
		generator: generateHousePropertySql,
	},
	{
		id: "04-operation",
		name: "operation",
		displayName: "运营管理数据",
		dependencies: ["01-community"],
		generator: generateOperationSql,
	},
	{
		id: "05-contract",
		name: "contract",
		displayName: "合同管理数据",
		dependencies: ["03-house-property"],
		generator: generateContractSql,
	},
	{
		id: "06-parking",
		name: "parking",
		displayName: "停车管理数据",
		dependencies: ["03-house-property"],
		generator: generateParkingSql,
	},
	{
		id: "07-expense",
		name: "expense",
		displayName: "费用管理数据",
		dependencies: ["06-parking", "05-contract"],
		generator: generateExpenseSql,
	},
	{
		id: "08-patrol",
		name: "patrol",
		displayName: "巡检管理数据",
		dependencies: ["03-house-property", "02-setting"],
		generator: generatePatrolSql,
	},
	{
		id: "09-repairs",
		name: "repairs",
		displayName: "报修管理数据",
		dependencies: ["03-house-property", "02-setting"],
		generator: generateRepairsSql,
	},
	{
		id: "10-report",
		name: "report",
		displayName: "报表中心数据",
		dependencies: ["07-expense"],
		generator: generateReportSql,
	},
];
