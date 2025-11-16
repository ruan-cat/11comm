import type { 补打收据表单_VO } from "../test-data";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 补打收据表单_VO = {
	收据ID: "",
	收据编号: "",
	费用类型: "",
	费用项: "",
	房屋: "",
	业主: "",
	车位: "",
	总金额: "",
	缴费时间: "",
	打印份数: 1,
	打印备注: "",
};

/**
 * 补打收据表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ReprintVoucherFormProps {
	/** 表单数据 */
	form: 补打收据表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 补打收据表单_VO;
}
