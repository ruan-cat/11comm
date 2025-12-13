/**
 * 批量添加缺失的类型定义到 @01s-11comm/type 包
 * 这个脚本会自动添加所有缺失的VO类型和选项类型
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const typeBasePath = join(process.cwd(), "apps", "type", "src", "business");

/** 需要添加的类型定义映射 */
const typesToAdd = [
	{
		file: "property-manage/expense-manage/reprint-voucher.ts",
		types: `
/**
 * @description 补打收据表单VO
 * Reprint voucher form VO
 */
export interface 补打收据表单_VO {
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}`,
	},
	{
		file: "property-manage/house-property-manage/house.ts",
		types: `
/**
 * @description 房屋管理表单VO
 * House management form VO
 */
export interface 房屋管理表单_VO {
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}`,
	},
	{
		file: "property-manage/house-property-manage/invoice-title.ts",
		types: `
/**
 * @description 发票抬头表单VO
 * Invoice title form VO
 */
export interface 发票抬头表单_VO {
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}

/**
 * @description 发票类型选项
 * Invoice type options
 */
export const 发票类型选项: OptionsType = [
	{ label: "增值税专用发票", value: "增值税专用发票" },
	{ label: "增值税普通发票", value: "增值税普通发票" },
	{ label: "电子普通发票", value: "电子普通发票" },
];

/**
 * @description 发票抬头表单默认值
 * Invoice title form default values
 */
export const defaultForm: 发票抬头表单_VO = {
	name: "",
	status: "启用",
	remark: "",
};`,
	},
	{
		file: "property-manage/house-property-manage/invoice.ts",
		types: `
/**
 * @description 发票表单VO
 * Invoice form VO
 */
export interface 发票表单_VO {
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}

/**
 * @description 发票表单默认值
 * Invoice form default values
 */
export const defaultForm: 发票表单_VO = {
	name: "",
	status: "启用",
	remark: "",
};`,
	},
	{
		file: "property-manage/house-property-manage/owner-account.ts",
		types: `
/**
 * @description 业主账户表单VO
 * Owner account form VO
 */
export interface 业主账户表单_VO {
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}

/**
 * @description 账户类型选项
 * Account type options
 */
export const 账户类型选项: OptionsType = [
	{ label: "微信", value: "微信" },
	{ label: "支付宝", value: "支付宝" },
	{ label: "银行卡", value: "银行卡" },
	{ label: "现金", value: "现金" },
];

/**
 * @description 支付方式选项
 * Payment method options
 */
export const 支付方式选项: OptionsType = [
	{ label: "微信支付", value: "微信支付" },
	{ label: "支付宝支付", value: "支付宝支付" },
	{ label: "银行转账", value: "银行转账" },
	{ label: "现金支付", value: "现金支付" },
	{ label: "刷卡支付", value: "刷卡支付" },
];

/**
 * @description 业主账户表单默认值
 * Owner account form default values
 */
export const defaultForm: 业主账户表单_VO = {
	name: "",
	status: "启用",
	remark: "",
};`,
	},
	{
		file: "property-manage/house-property-manage/owner-information.ts",
		types: `
/**
 * @description 业主信息表单VO
 * Owner information form VO
 */
export interface 业主信息表单_VO {
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}`,
	},
	{
		file: "property-manage/house-property-manage/owner-member.ts",
		types: `
/**
 * @description 业主成员表单VO
 * Owner member form VO
 */
export interface 业主成员表单_VO {
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}`,
	},
	{
		file: "property-manage/house-property-manage/owners-committee.ts",
		types: `
/**
 * @description 业委会表单VO
 * Owners committee form VO
 */
export interface 业委会表单_VO {
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}`,
	},
	{
		file: "property-manage/house-property-manage/reserve-venue.ts",
		types: `
/**
 * @description 场地预约表单VO
 * Reserve venue form VO
 */
export interface 场地预约_VO {
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}`,
	},
	{
		file: "property-manage/parking-manage/carport-info.ts",
		types: `
/**
 * @description 车位信息表单VO
 * Carport info form VO
 */
export interface 车位信息_表单_VO {
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}`,
	},
	{
		file: "property-manage/parking-manage/owner-vehicle.ts",
		types: `
/**
 * @description 业主车辆表单VO
 * Owner vehicle form VO
 */
export interface 业主车辆表单_VO {
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}`,
	},
	{
		file: "property-manage/patrol-manage/item.ts",
		types: `
/**
 * @description 巡检项目表单VO
 * Patrol item form VO
 */
export interface 巡检项目表单_VO {
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}`,
	},
	{
		file: "property-manage/patrol-manage/path.ts",
		types: `
/**
 * @description 巡检路线表单数据
 * Patrol path form data
 */
export interface 巡检路线_表单数据 {
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}`,
	},
	{
		file: "property-manage/patrol-manage/plan.ts",
		types: `
/**
 * @description 巡检计划表单VO
 * Patrol plan form VO
 */
export interface 巡检计划表单_VO {
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}`,
	},
	{
		file: "operation-team/system-manage/community-configuration.ts",
		types: `
/**
 * @description 小区配置表单VO
 * Community configuration form VO
 */
export interface 小区配置表单_VO {
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}`,
	},
	{
		file: "operation-team/system-manage/initialize-cell.ts",
		types: `
/**
 * @description 初始化小区表单VO
 * Initialize cell form VO
 */
export interface 初始化小区表单_VO {
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}

/**
 * @description 单元格类型选项
 * Cell type options
 */
export const 单元格类型Options: OptionsType = [
	{ label: "文本", value: "文本" },
	{ label: "数字", value: "数字" },
	{ label: "日期", value: "日期" },
	{ label: "下拉", value: "下拉" },
];`,
	},
	{
		file: "operation-team/system-manage/system-config.ts",
		types: `
/**
 * @description 配置类型选项
 * Config type options
 */
export const 配置类型Options: OptionsType = [
	{ label: "系统配置", value: "系统配置" },
	{ label: "业务配置", value: "业务配置" },
	{ label: "接口配置", value: "接口配置" },
];

/**
 * @description 配置分组选项
 * Config group options
 */
export const 配置分组Options: OptionsType = [
	{ label: "基础配置", value: "基础配置" },
	{ label: "高级配置", value: "高级配置" },
	{ label: "安全配置", value: "安全配置" },
];`,
	},
	{
		file: "setting-manage/organize-manage/role-permission.ts",
		isNew: true,
		types: `import type { OptionsType } from "../../../common";

/**
 * @description 角色状态
 * Role status
 */
export type 角色状态 = "启用" | "禁用";

/**
 * @description 权限项
 * Permission item
 */
export interface 权限项 {
	/** 权限ID Permission ID */
	id: string;
	/** 权限名称 Permission name */
	name: string;
	/** 权限编码 Permission code */
	code: string;
	/** 是否选中 Is selected */
	selected: boolean;
}
`,
	},
	{
		file: "setting-manage/organize-manage/working-schedule.ts",
		isNew: true,
		types: `import type { OptionsType } from "../../../common";

/**
 * @description 排班类型
 * Schedule type
 */
export type ScheduleType = "morning" | "afternoon" | "evening" | "night" | "全天";
`,
	},
	{
		file: "setting-manage/system-manage/community-configuration.ts",
		isNew: true,
		types: `import type { OptionsType } from "../../../common";

/**
 * @description 小区配置表单VO
 * Community configuration form VO
 */
export interface 小区配置表单_VO {
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}
`,
	},
	{
		file: "setting-manage/system-manage/initialize-cell.ts",
		isNew: true,
		types: `import type { OptionsType } from "../../../common";

/**
 * @description 初始化小区表单VO
 * Initialize cell form VO
 */
export interface 初始化小区表单_VO {
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}
`,
	},
];

/** 处理单个文件 */
function processFile(filePath: string, typesToAppend: string, isNew: boolean = false) {
	const fullPath = join(typeBasePath, filePath);

	try {
		if (isNew) {
			// 创建新文件
			writeFileSync(fullPath, typesToAppend, "utf-8");
			console.log(`✅ 创建文件: ${filePath}`);
		} else {
			// 读取现有文件
			const content = readFileSync(fullPath, "utf-8");

			// 在文件末尾添加类型定义
			const newContent = content.trimEnd() + "\n" + typesToAppend + "\n";

			writeFileSync(fullPath, newContent, "utf-8");
			console.log(`✅ 更新文件: ${filePath}`);
		}
	} catch (error) {
		console.error(`❌ 处理文件失败 ${filePath}:`, error.message);
	}
}

/** 主函数 */
function main() {
	console.log("开始批量添加缺失的类型定义...\n");

	for (const { file, types, isNew = false } of typesToAdd) {
		processFile(file, types, isNew);
	}

	console.log("\n✨ 所有类型定义添加完成！");
}

main();
