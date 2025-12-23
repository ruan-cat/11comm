/**
 * @file 欠费明细表单类型定义
 * @description Arrears details form types
 */

import type { ArrearsDetailsFormProps } from "@01s-11comm/type";

/** 表单数据接口 Form data interface */
export type { ArrearsDetailsFormProps };

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
