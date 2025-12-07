import type { OptionsType } from "plus-pro-components";

/** 车位信息列表数据 */
export interface 车位信息_列表数据 {
	序号?: number;
	停车场: string;
	车位: string;
	车位状态: string;
	车位类型: string;
	面积: string;
	业主姓名: string;
	联系电话: string;
	车辆号码: string;
	购买日期: string;
	到期日期: string;
	月租费用: number;
	备注: string;
}

/** 车位信息表单数据 */
export interface 车位信息_表单_VO {
	停车场: string;
	车位: string;
	车位状态: string;
	车位类型: string;
	面积: string;
	业主姓名: string;
	联系电话: string;
	车辆号码: string;
	购买日期: string;
	到期日期: string;
	月租费用: number;
	备注: string;
}

/** 车位信息 列表查询类型 */
export interface 车位信息_列表查询_VO {
	停车场?: string;
	车位?: string;
	车位状态?: string;
	车位类型?: string;
	业主姓名?: string;
	联系电话?: string;
	车辆号码?: string;
}

/** 车位状态选项 */
export const 车位状态Options: OptionsType = [
	{ label: "已售", value: "已售" },
	{ label: "待售", value: "待售" },
	{ label: "已租", value: "已租" },
	{ label: "空闲", value: "空闲" },
	{ label: "维修中", value: "维修中" },
];

/** 车位类型选项 */
export const 车位类型Options: OptionsType = [
	{ label: "标准车位", value: "标准车位" },
	{ label: "大型车位", value: "大型车位" },
	{ label: "机械车位", value: "机械车位" },
	{ label: "充电桩车位", value: "充电桩车位" },
	{ label: "无障碍车位", value: "无障碍车位" },
];

/** 停车场选项 */
export const 停车场Options: OptionsType = [
	{ label: "A区地下停车场", value: "A区地下停车场" },
	{ label: "B区地下停车场", value: "B区地下停车场" },
	{ label: "C区地面停车场", value: "C区地面停车场" },
	{ label: "D区立体停车场", value: "D区立体停车场" },
	{ label: "E区访客停车场", value: "E区访客停车场" },
];

/** 生成35条模拟数据 */
export const tableData: 车位信息_列表数据[] = Array.from({ length: 35 }, (_, index) => {
	const 停车场选项 = 停车场Options.map((item) => item.value);
	const 状态选项 = 车位状态Options.map((item) => item.value);
	const 类型选项 = 车位类型Options.map((item) => item.value);

	const 随机停车场 = String(停车场选项[Math.floor(Math.random() * 停车场选项.length)]);
	const 随机状态 = String(状态选项[Math.floor(Math.random() * 状态选项.length)]);
	const 随机类型 = String(类型选项[Math.floor(Math.random() * 类型选项.length)]);

	const 车位编号 = `${String.fromCharCode(65 + Math.floor(Math.random() * 5))}${String(Math.floor(Math.random() * 20) + 1).padStart(3, "0")}-${String(Math.floor(Math.random() * 100) + 1).padStart(3, "0")}`;

	// 生成随机日期
	const 生成日期 = (起始年: number, 起始月: number) => {
		const 日期 = new Date(起始年, 起始月 + Math.floor(Math.random() * 24), Math.floor(Math.random() * 28) + 1);
		return 日期.toISOString().split("T")[0];
	};

	// 生成随机姓名
	const 随机姓名 = [
		"张伟",
		"王芳",
		"李强",
		"刘洋",
		"陈静",
		"杨帆",
		"赵敏",
		"黄磊",
		"周婷",
		"吴鹏",
		"徐莉",
		"孙超",
		"朱艳",
		"马涛",
		"胡晓",
	][Math.floor(Math.random() * 15)];

	// 生成随机电话号码
	const 生成电话 = () => {
		const 号码 = [138, 139, 150, 151, 158, 159, 186, 188][Math.floor(Math.random() * 8)];
		const 后四位 = Math.floor(Math.random() * 10000)
			.toString()
			.padStart(4, "0");
		return `${号码}${后四位}${Math.floor(Math.random() * 10000)
			.toString()
			.padStart(4, "0")}`;
	};

	// 生成随机车牌号
	const 生成车牌 = () => {
		const 省份 = ["京", "沪", "粤", "苏", "浙", "鲁", "豫", "川"][Math.floor(Math.random() * 8)];
		const 字母 = String.fromCharCode(65 + Math.floor(Math.random() * 26));
		const 数字 = Math.floor(Math.random() * 100000)
			.toString()
			.padStart(5, "0");
		return `${省份}${字母}${数字}`;
	};

	// 生成随机面积
	const 面积 = (12 + Math.random() * 8).toFixed(1);

	// 生成随机月租费用
	const 月租费用 = Math.floor(200 + Math.random() * 300);

	return {
		序号: index + 1,
		停车场: 随机停车场,
		车位: 车位编号,
		车位状态: 随机状态,
		车位类型: 随机类型,
		面积: `${面积}㎡`,
		业主姓名: 随机状态 === "已售" || 随机状态 === "已租" ? 随机姓名 : "",
		联系电话: 随机状态 === "已售" || 随机状态 === "已租" ? 生成电话() : "",
		车辆号码: 随机状态 === "已租" ? 生成车牌() : "",
		购买日期: 随机状态 === "已售" ? 生成日期(2020, 0) : "",
		到期日期: 随机状态 === "已租" ? 生成日期(2024, 0) : "",
		月租费用: 随机状态 === "已租" ? 月租费用 : 0,
		备注: Math.random() > 0.7 ? ["靠近电梯", "位置宽敞", "监控覆盖", "照明良好"][Math.floor(Math.random() * 4)] : "",
	};
});
