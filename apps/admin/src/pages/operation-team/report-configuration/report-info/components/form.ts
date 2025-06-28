const _报表类型 = ["组编号", "选项标题", "排序", "描述"] as const;

// 警告 这里仅为了演示 实际上的业务类型为 string
export type 报表类型 = (typeof _报表类型)[number];

// 警告 这里仅为了演示 实际上的业务类型应该都来自于 api 目录内
export interface 报表信息表单_VO {
	组编号: "测试报表组" | "巡检报表" | "营业报表" | "报修报表";
	选项标题: string;
	排序: string;
	描述: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 报表信息表单_VO = {
	组编号: "报修报表",
	选项标题: "",
	排序: "",
	描述: "",
};

/**
 * 报表信息表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ExpenseItemSettingFormProps {
	/** 表单数据 */
	form: 报表信息表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 报表信息表单_VO;
}
