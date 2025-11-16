/** 选项项类型 */
interface OptionItem {
	label: string;
	value: string;
}

/** 工单池 列表数据 */
export interface 工单池_列表数据 {
	工单编码: string;
	位置: string;
	报修类型: string;
	维修类型: string;
	报修人: string;
	联系方式: string;
	预约开始结束时间: string;
	提交时间: string;
	提单时长: string;
	完成时间: string;
	状态: string;
	违规说明: string;
	备注: string;
}

/** 工单池 列表查询_VO */
export interface 工单池_列表查询_VO {
	工单编号?: string;
	报修人?: string;
	报修电话?: string;
	报修类型?: string;
	报修设置类型?: string;
	报修位置?: string;
	维修类型?: string;
	开始时间?: string;
	结束时间?: string;
}

/** 报修类型选项 */
export const 报修类型Options: OptionItem[] = [
	{
		label: "水管维修",
		value: "水管维修",
	},
	{
		label: "电路维修",
		value: "电路维修",
	},
	{
		label: "家电维修",
		value: "家电维修",
	},
	{
		label: "门窗维修",
		value: "门窗维修",
	},
	{
		label: "其他维修",
		value: "其他维修",
	},
];

/** 报修设置类型选项 */
export const 报修设置类型Options: OptionItem[] = [
	{
		label: "保洁单",
		value: "保洁单",
	},
	{
		label: "维修单",
		value: "维修单",
	},
];

/** 维修类型选项 */
export const 维修类型Options: OptionItem[] = [
	{
		label: "有偿服务",
		value: "有偿服务",
	},
	{
		label: "无偿服务",
		value: "无偿服务",
	},
	{
		label: "需要用料",
		value: "需要用料",
	},
	{
		label: "无需用料",
		value: "无需用料",
	},
];

/** 工单状态选项 */
export const 工单状态Options: OptionItem[] = [
	{
		label: "待处理",
		value: "待处理",
	},
	{
		label: "处理中",
		value: "处理中",
	},
	{
		label: "已完成",
		value: "已完成",
	},
	{
		label: "已取消",
		value: "已取消",
	},
];

/** 生成单个工单池数据 */
function generateRandomIssue(index: number): 工单池_列表数据 {
	const 报修类型Values = 报修类型Options.map((option) => option.value);
	const 维修类型Values = 维修类型Options.map((option) => option.value);
	const 状态Values = 工单状态Options.map((option) => option.value);

	const random报修类型 = 报修类型Values[Math.floor(Math.random() * 报修类型Values.length)];
	const random维修类型 = 维修类型Values[Math.floor(Math.random() * 维修类型Values.length)];
	const random状态 = 状态Values[Math.floor(Math.random() * 状态Values.length)];

	const startDate = new Date(2024, 9, Math.floor(Math.random() * 28) + 1);
	const endDate = new Date(startDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);

	return {
		工单编码: `WO${String(index).padStart(6, "0")}`,
		位置: `A栋${Math.floor(Math.random() * 10) + 1}单元${Math.floor(Math.random() * 20) + 1}01室`,
		报修类型: random报修类型,
		维修类型: random维修类型,
		报修人: `张${index}先生`,
		联系方式: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
		预约开始结束时间: `${startDate.toISOString().split("T")[0]} 至 ${endDate.toISOString().split("T")[0]}`,
		提交时间: startDate.toISOString().replace("T", " ").slice(0, 19),
		提单时长: `${Math.floor(Math.random() * 48) + 1}小时`,
		完成时间: random状态 === "已完成" ? endDate.toISOString().replace("T", " ").slice(0, 19) : "",
		状态: random状态,
		违规说明: random状态 === "已取消" ? "用户取消" : "",
		备注: `备注信息${index}`,
	};
}

/** 表格假数据 */
export const tableData: 工单池_列表数据[] = Array.from({ length: 35 }, (_, index) => generateRandomIssue(index + 1));
