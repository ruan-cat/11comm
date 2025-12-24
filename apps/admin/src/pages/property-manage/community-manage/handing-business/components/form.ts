import type { HandingBusinessListItem, HandingBusinessFormVO } from "@01s-11comm/type";
import { feeTypeOptions, handlingStatusOptions } from "@01s-11comm/type";

/** 导出类型供其他文件使用 */
export type { HandingBusinessFormVO };

/**
 * 业务受理表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface HandingBusinessFormProps {
	/** 表单数据 */
	form: HandingBusinessFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: HandingBusinessFormVO;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: HandingBusinessFormVO = {
	feeItem: "",
	feeId: "",
	feeType: "",
	amountReceivable: "",
	accountCreationTime: "",
	receivablePeriod: "",
	description: "",
	status: "待缴费",
};

/** 从列表数据转换为表单数据的辅助函数 */
export function listDataToFormData(listData: HandingBusinessListItem): HandingBusinessFormVO {
	return {
		feeItem: listData.feeItem,
		feeId: listData.feeId,
		feeType: listData.feeType,
		amountReceivable: listData.amountReceivable,
		accountCreationTime: listData.accountCreationTime,
		receivablePeriod: listData.receivablePeriod,
		description: listData.description,
		status: listData.status,
	};
}

/** 导出选项供其他文件使用 */
export { feeTypeOptions, handlingStatusOptions };
