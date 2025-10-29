/** 场地预约状态选项 */
export const 预约状态Options = [
	{ label: "待审核", value: "待审核" },
	{ label: "已通过", value: "已通过" },
	{ label: "已拒绝", value: "已拒绝" },
	{ label: "已取消", value: "已取消" },
] as const;

/** 场地类型选项 */
export const 场地类型Options = [
	{ label: "篮球馆", value: "篮球馆" },
	{ label: "羽毛球馆", value: "羽毛球馆" },
	{ label: "乒乓球馆", value: "乒乓球馆" },
	{ label: "网球馆", value: "网球馆" },
	{ label: "健身房", value: "健身房" },
	{ label: "瑜伽室", value: "瑜伽室" },
	{ label: "会议室", value: "会议室" },
	{ label: "多功能厅", value: "多功能厅" },
] as const;

/** 预约状态类型 */
export type 预约状态 = (typeof 预约状态Options)[number]["value"];

/** 场地类型类型 */
export type 场地类型 = (typeof 场地类型Options)[number]["value"];

/** 场地预约列表数据接口 */
export interface 场地预约_列表数据 {
	id: string;
	预约人: string;
	联系电话: string;
	预约时间: string;
	开始时间: string;
	结束时间: string;
	场地类型: 场地类型;
	预约状态: 预约状态;
	使用人数: number;
	备注: string;
	创建时间: string;
}

/** 场地预约表单数据接口 */
export interface 场地预约_VO {
	预约人: string;
	联系电话: string;
	预约时间: string;
	开始时间: string;
	结束时间: string;
	场地类型: 场地类型;
	预约状态: 预约状态;
	使用人数: number;
	备注: string;
}

/** 场地预约查询接口 */
export interface 场地预约_列表查询_VO {
	预约人?: string;
	联系电话?: string;
	预约时间?: string;
	场地类型?: 场地类型 | "";
	预约状态?: 预约状态 | "";
}

/** 生成随机字符串 */
function generateRandomString(length: number): string {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

/** 生成随机手机号 */
function generateRandomPhone(): string {
	const prefixes = ["138", "139", "150", "151", "180", "186", "188", "189"];
	const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
	let suffix = "";
	for (let i = 0; i < 8; i++) {
		suffix += Math.floor(Math.random() * 10);
	}
	return prefix + suffix;
}

/** 生成随机日期 */
function generateRandomDate(start: Date, end: Date): string {
	const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
	return date.toISOString().split("T")[0];
}

/** 生成随机时间 */
function generateRandomTime(): string {
	const hour = Math.floor(Math.random() * 24)
		.toString()
		.padStart(2, "0");
	const minute = Math.floor(Math.random() * 60)
		.toString()
		.padStart(2, "0");
	return `${hour}:${minute}`;
}

/** 场地预约假数据 */
export const tableData: 场地预约_列表数据[] = Array.from({ length: 35 }, (_, index) => {
	const now = new Date();
	const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
	const sixtyDaysLater = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

	return {
		id: (index + 1).toString().padStart(3, "0"),
		预约人: `用户${index + 1}`,
		联系电话: generateRandomPhone(),
		预约时间: generateRandomDate(thirtyDaysAgo, sixtyDaysLater),
		开始时间: generateRandomTime(),
		结束时间: generateRandomTime(),
		场地类型: 场地类型Options[Math.floor(Math.random() * 场地类型Options.length)].value,
		预约状态: 预约状态Options[Math.floor(Math.random() * 预约状态Options.length)].value,
		使用人数: Math.floor(Math.random() * 50) + 1,
		备注: index % 5 === 0 ? `备注信息${index + 1}` : "",
		创建时间: generateRandomDate(thirtyDaysAgo, now),
	};
});
