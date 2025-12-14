const _费用类型 = ["押金", "停车费", "维修费", "服务费", "其他", "水费", "电费", "公摊费", "系统费用", "租金"] as const;

// 警告 这里仅为了演示 实际上的业务类型为 string
export type 费用类型 = (typeof _费用类型)[number];

/** 费用类型选项 */
export const feeTypeOptions = [
	{ label: "押金", value: "押金" },
	{ label: "停车费", value: "停车费" },
	{ label: "维修费", value: "维修费" },
	{ label: "服务费", value: "服务费" },
	{ label: "其他", value: "其他" },
	{ label: "水费", value: "水费" },
	{ label: "电费", value: "电费" },
	{ label: "公摊费", value: "公摊费" },
	{ label: "系统费用", value: "系统费用" },
	{ label: "租金", value: "租金" },
];

// 警告 这里仅为了演示 实际上的业务类型应该都来自于 api 目录内
export interface 车辆收费表单_VO {
	收费范围: "小区" | "停车场";
	费用类型: 费用类型;
	收费项目: string;
	车位状态?: "已出售" | "已出租";
	计费起始时间: string;
	计费结束时间: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 车辆收费表单_VO = {
	收费范围: "小区",
	费用类型: "停车费",
	收费项目: "",
	车位状态: "已出售",
	计费起始时间: "",
	计费结束时间: "",
};

/**
 * 车辆收费表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface VehicleChargeFormProps {
	/** 表单数据 */
	form: 车辆收费表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 车辆收费表单_VO;
}
