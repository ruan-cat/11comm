const _费用类型 = [
	"物业费",
	"押金",
	"停车费",
	"煤气费",
	"取暖费",
	"维修费",
	"服务费",
	"其他",
	"水费",
	"电费",
	"租金",
	"公摊费",
] as const;
export type 小区信息类型 = (typeof _费用类型)[number];

export interface 小区信息项修改表单_VO {
	省份: string;
	市州: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 小区信息项修改表单_VO = {
	省份: "福建省",
	市州: "",
};

/**
 * 费用项设置表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ExpenseItemSettingFormProps {
	/** 表单数据 */
	form: 小区信息项修改表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 小区信息项修改表单_VO;
}
