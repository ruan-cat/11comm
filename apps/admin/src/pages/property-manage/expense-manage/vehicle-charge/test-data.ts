import type { OptionsType } from "plus-pro-components";

/** 车辆收费表格数据类型 */
export interface 车辆收费_列表数据 {
	车牌号: string;
	"停车场(单位:号)": string;
	"车位(单位:号)": string;
	业主名称: string;
	联系方式: string;
	车位状态: string;
}

/** 车辆收费列表查询接口 */
export interface 车辆收费_列表查询_VO {
	"停车场-车位": string;
	车牌号: string;
	业主名称: string;
	车位状态: string;
}

/** 车位状态选项 */
export const 车位状态Options: OptionsType = [
	{ label: "正常", value: "正常" },
	{ label: "欠费", value: "欠费" },
	{ label: "车费释放", value: "车费释放" },
];

/** 车主姓名列表 */
const 车主姓名列表 = [
	"张伟", "王秀英", "李强", "刘敏", "陈杰", "杨丽", "赵勇", "黄芳", "周明", "吴婷",
	"徐军", "孙静", "马超", "朱晓", "胡波", "林红", "郭华", "何勇", "高敏", "梁军",
	"谢丽", "唐强", "韩雪", "冯勇", "于芳", "董鹏", "袁琳", "蒋涛", "蔡明", "杜娟",
	"田强", "白雪", "石磊", "程琳"
];

/** 停车场名称列表 */
const 停车场名称列表 = [
	"中心地下停车场", "东区地面停车场", "南区地下停车场", "北区立体停车场",
	"西区露天停车场", "商业区地下停车场", "住宅区地面停车场"
];

/** 联系方式前缀 */
const 手机号前缀 = ["138", "139", "150", "151", "152", "158", "159", "185", "186", "188"];

/** 生成35条车辆收费假数据 */
const tableDataItem: 车辆收费_列表数据 = {
	车牌号: "京A88888",
	"停车场(单位:号)": "中心地下停车场",
	"车位(单位:号)": "B1-088",
	业主名称: "张伟",
	联系方式: "13812345678",
	车位状态: "正常",
};

/** 表格数据 */
export const tableData: 车辆收费_列表数据[] = Array(35)
	.fill(null)
	.map((_, index) => {
		const 停车场索引 = index % 停车场名称列表.length;
		const 楼层 = Math.floor(index / 20) + 1; // B1, B2, B3
		const 区号 = String.fromCharCode(65 + (index % 4)); // A, B, C, D
		const 车位号 = String((index % 20) + 1).padStart(3, "0");
		const 车主姓名 = 车主姓名列表[index % 车主姓名列表.length];
		const 手机号后缀 = String(10000000 + Math.floor(Math.random() * 90000000));
		const selected手机号前缀 = 手机号前缀[Math.floor(Math.random() * 手机号前缀.length)];

		return {
			车牌号: `京A${String(80000 + index).padStart(5, "0")}`,
			"停车场(单位:号)": 停车场名称列表[停车场索引],
			"车位(单位:号)": `B${楼层}-${区号}${车位号}`,
			业主名称: 车主姓名,
			联系方式: `${selected手机号前缀}${手机号后缀}`,
			车位状态: String(车位状态Options[index % 3].value),
		};
	});
