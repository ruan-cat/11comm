import type { OptionsType } from "plus-pro-components";

/** 报修设置 列表数据 */
export interface 报修设置_列表数据 {
	类型名称: string;
	报修设置类型: string;
	派单方式: string;
	区域: string;
	业主端展示: string;
	通知方式: string;
	是否回访: string;
	创建时间: string;
	状态: string;
	备注: string;
}

/** 报修设置 列表查询_VO */
export interface 报修设置_列表查询_VO {
	类型名称?: string;
	派单方式?: string;
	报修设置类型?: string;
	区域?: string;
	是否回访?: string;
}

/** 报修设置类型选项 */
export const 报修设置类型Options: OptionsType = [
	{ label: "保洁单", value: "保洁单" },
	{ label: "维修单", value: "维修单" },
];

/** 派单方式选项 */
export const 派单方式Options: OptionsType = [
	{ label: "抢单", value: "抢单" },
	{ label: "指派", value: "指派" },
	{ label: "轮训", value: "轮训" },
];

/** 区域选项 */
export const 区域Options: OptionsType = [
	{ label: "房屋", value: "房屋" },
	{ label: "公共区域", value: "公共区域" },
	{ label: "车库", value: "车库" },
];

/** 回访设置选项 */
export const 回访设置Options: OptionsType = [
	{ label: "回访", value: "回访" },
	{ label: "不回访", value: "不回访" },
	{ label: "已评价不回访", value: "已评价不回访" },
];

/** 生成单条报修设置数据 */
function generateRandomSetting(index: number): 报修设置_列表数据 {
	const settingTypes = (Array.isArray(报修设置类型Options) ? 报修设置类型Options : []).map((item) =>
		String(item.value),
	);
	const orderTypes = (Array.isArray(派单方式Options) ? 派单方式Options : []).map((item) => String(item.value));
	const areaTypes = (Array.isArray(区域Options) ? 区域Options : []).map((item) => String(item.value));
	const visitTypes = (Array.isArray(回访设置Options) ? 回访设置Options : []).map((item) => String(item.value));

	const randomSettingType = settingTypes[Math.floor(Math.random() * settingTypes.length)];
	const randomOrderType = orderTypes[Math.floor(Math.random() * orderTypes.length)];
	const randomArea = areaTypes[Math.floor(Math.random() * areaTypes.length)];
	const randomVisit = visitTypes[Math.floor(Math.random() * visitTypes.length)];

	const createDate = new Date(2024, 9, Math.floor(Math.random() * 28) + 1);

	return {
		类型名称: `报修类型${index}`,
		报修设置类型: randomSettingType,
		派单方式: randomOrderType,
		区域: randomArea,
		业主端展示: Math.random() > 0.5 ? "是" : "否",
		通知方式: Math.random() > 0.5 ? "微信" : "短信",
		是否回访: randomVisit,
		创建时间: createDate.toISOString().replace("T", " ").slice(0, 19),
		状态: Math.random() > 0.2 ? "启用" : "停用",
		备注: `备注信息${index}`,
	};
}

/** 表格假数据 */
export const tableData: 报修设置_列表数据[] = Array.from({ length: 35 }, (_, index) =>
	generateRandomSetting(index + 1),
);
