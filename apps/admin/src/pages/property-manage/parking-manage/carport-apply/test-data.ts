import { type OptionsType } from "plus-pro-components";

/** 车位申请 表格数据类型 */
export interface 车位申请_列表数据 {
	申请ID: string;
	车牌号: string;
	停车位: string;
	汽车品牌: string;
	车辆类型: string;
	颜色: string;
	起租时间: string;
	结租时间: string;
	申请人: string;
	手机号: string;
	审核结果: string;
}

/** 车位申请 表单数据类型 */
export interface 车位申请_VO {
	申请ID: string;
	车牌号: string;
	停车位: string;
	汽车品牌: string;
	车辆类型: string;
	颜色: string;
	起租时间: string;
	结租时间: string;
	申请人: string;
	手机号: string;
	审核结果: string;
}

/** 车位申请 列表查询类型 */
export interface 车位申请_列表查询_VO {
	车牌号?: string;
	汽车品牌?: string;
	手机号?: string;
	审核结果?: string;
}

/** 审核结果选项 */
export const 审核结果Options: OptionsType = [
	{
		label: "待审核",
		value: "待审核"
	},
	{
		label: "待缴费",
		value: "待缴费"
	},
	{
		label: "完成",
		value: "完成"
	},
	{
		label: "申请失败",
		value: "申请失败"
	}
];

/** 车辆类型选项 */
export const 车辆类型Options: OptionsType = [
	{
		label: "轿车",
		value: "轿车"
	},
	{
		label: "SUV",
		value: "SUV"
	},
	{
		label: "MPV",
		value: "MPV"
	},
	{
		label: "跑车",
		value: "跑车"
	},
	{
		label: "货车",
		value: "货车"
	},
	{
		label: "面包车",
		value: "面包车"
	}
];

/** 汽车品牌选项 */
export const 汽车品牌Options: OptionsType = [
	{
		label: "大众",
		value: "大众"
	},
	{
		label: "丰田",
		value: "丰田"
	},
	{
		label: "本田",
		value: "本田"
	},
	{
		label: "奥迪",
		value: "奥迪"
	},
	{
		label: "宝马",
		value: "宝马"
	},
	{
		label: "奔驰",
		value: "奔驰"
	},
	{
		label: "比亚迪",
		value: "比亚迪"
	},
	{
		label: "特斯拉",
		value: "特斯拉"
	}
];

/** 车辆颜色选项 */
export const 车辆颜色Options: OptionsType = [
	{
		label: "白色",
		value: "白色"
	},
	{
		label: "黑色",
		value: "黑色"
	},
	{
		label: "银色",
		value: "银色"
	},
	{
		label: "红色",
		value: "红色"
	},
	{
		label: "蓝色",
		value: "蓝色"
	},
	{
		label: "灰色",
		value: "灰色"
	},
	{
		label: "黄色",
		value: "黄色"
	},
	{
		label: "绿色",
		value: "绿色"
	}
];

/** 单个表格数据项 */
const tableDataItem: 车位申请_列表数据 = {
	申请ID: "CAR202505280001",
	车牌号: "京A12345",
	停车位: "A-101",
	汽车品牌: "大众",
	车辆类型: "轿车",
	颜色: "白色",
	起租时间: "2025-05-01",
	结租时间: "2025-11-01",
	申请人: "张三",
	手机号: "13800138000",
	审核结果: "待审核"
};

/** 表格组件假数据 */
export const tableData: 车位申请_列表数据[] = Array(35)
	.fill(null)
	.map((_, index) => ({
		...tableDataItem,
		申请ID: `CAR202505${String(28000 + index + 1).padStart(4, "0")}`,
		车牌号: `${["京", "沪", "粤", "苏", "浙"][index % 5]}${["A", "B", "C", "D"][index % 4]}${String(Math.floor(Math.random() * 90000) + 10000)}`,
		停车位: `A-${String(Math.floor(index / 10) + 1).padStart(3, "0")}${String((index % 10) + 1).padStart(2, "0")}`,
		汽车品牌: (汽车品牌Options[index % 汽车品牌Options.length].label || "") as string,
		车辆类型: (车辆类型Options[index % 车辆类型Options.length].label || "") as string,
		颜色: (车辆颜色Options[index % 车辆颜色Options.length].label || "") as string,
		起租时间: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
		结租时间: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
		申请人: `申请人${index + 1}`,
		手机号: `1${String(3 + Math.floor(Math.random() * 7))}${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
		审核结果: (审核结果Options[index % 审核结果Options.length].label || "") as string
	}));