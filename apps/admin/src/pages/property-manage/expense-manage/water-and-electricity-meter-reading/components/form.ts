const _费用类型 = ["水费", "电费", "煤气费"] as const;

// 警告 这里仅为了演示 实际上的业务类型为 string
export type 费用类型 = (typeof _费用类型)[number];

// 警告 这里仅为了演示 实际上的业务类型应该都来自于 api 目录内
export interface 水电抄表表单_VO {
	费用类型: 费用类型;
	收费项目: "动态水表" | "水表" | "电表" | "抄表";
	抄表类型: string;
	收费对象: string;
	上期度数: string;
	本期度数: string;
	上期读表时间: string;
	本期读表时间: string;
	备注?: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
// 添加抄表的弹窗表单显示默认值
export const defaultForm: 水电抄表表单_VO = {
	费用类型: "水费",
	收费项目: "动态水表",
	抄表类型: "抄表",
	收费对象: "111-1-12",
	上期度数: "10",
	本期度数: "50",
	上期读表时间: "2025-01-01 00:00:00",
	本期读表时间: "2025-01-01 00:00:00",
	备注: "",
};

/**
 * 水电抄表表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface WaterAndElectricityMeterReadingFormProps {
	/** 表单数据 */
	form: 水电抄表表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 水电抄表表单_VO;
}
