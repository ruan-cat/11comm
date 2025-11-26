import type { 业务受理_列表数据 } from "../test-data";
import { 费用类型Options, 状态Options } from "../test-data";

/** 业务受理表单 VO */
export interface 业务受理表单_VO {
	费用项目: string;
	费用标识: string;
	费用类型: string;
	应收金额: string;
	建账时间: string;
	应收时间段: string;
	说明: string;
	状态: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 业务受理表单_VO = {
	费用项目: "",
	费用标识: "",
	费用类型: "",
	应收金额: "",
	建账时间: "",
	应收时间段: "",
	说明: "",
	状态: "待缴费",
};

/**
 * 业务受理表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface HandingBusinessFormProps {
	/** 表单数据 */
	form: 业务受理表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 业务受理表单_VO;
}

/** 从列表数据转换为表单数据的辅助函数 */
export function 列表数据转表单数据(列表数据: 业务受理_列表数据): 业务受理表单_VO {
	return {
		费用项目: 列表数据.费用项目,
		费用标识: 列表数据.费用标识,
		费用类型: 列表数据.费用类型,
		应收金额: 列表数据.应收金额,
		建账时间: 列表数据.建账时间,
		应收时间段: 列表数据.应收时间段,
		说明: 列表数据.说明,
		状态: 列表数据.状态,
	};
}

/** 导出选项供其他文件使用 */
export { 费用类型Options, 状态Options };