/**
 * @file 欠费明细表单类型定义
 * @description Arrears details form types
 */

import type { ArrearsDetailsFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: ArrearsDetailsFormVO = {
	feeNumber: "",
	roomNumber: "",
	owner: "",
	ownerPhone: "",
	area: "",
	feeItem: "",
	startTime: "",
	endTime: "",
	arrearsDuration: "",
	arrearsAmount: "",
};

/** 欠费明细表单 Props Arrears details form props */
export interface ArrearsDetailsFormProps {
	/** 表单数据 Form data */
	form: ArrearsDetailsFormVO;
	/** 表单组件重置时默认使用的对象 Default object used when form component is reset */
	defaultValues: ArrearsDetailsFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
