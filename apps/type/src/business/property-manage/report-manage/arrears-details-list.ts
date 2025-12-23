/**
 * @file 欠费明细表类型定义
 * @description Arrears details list types
 */

import type { OptionsType, BaseListQueryParams } from "../../../common";

// ==================== 列表数据类型定义 ====================

/**
 * 欠费明细表列表数据
 * Arrears details list item
 */
export interface ArrearsDetailsListItem {
	/** 费用编号 Fee number */
	feeNumber: string;
	/** 房号 Room number */
	roomNumber: string;
	/** 业主 Owner */
	owner: string;
	/** 业主电话 Owner phone */
	ownerPhone: string;
	/** 面积 Area */
	area: string;
	/** 费用项 Fee item */
	feeItem: string;
	/** 开始时间 Start time */
	startTime: string;
	/** 结束时间 End time */
	endTime: string;
	/** 欠费时长 Arrears duration (days) */
	arrearsDuration: string;
	/** 欠费金额 Arrears amount */
	arrearsAmount: string;
}

/**
 * 欠费明细表查询参数
 * Arrears details list query parameters
 */
export interface ArrearsDetailsListQueryParams extends BaseListQueryParams {
	/** 费用大类 Fee category */
	feeNumber?: string;
	/** 房屋编号 Room number */
	roomNumber?: string;
	/** 开始时间 Start time */
	startTime?: string;
	/** 结束时间 End time */
	endTime?: string;
	/** 小区 Community */
	community?: string;
	/** 业主名称 Owner name */
	owner?: string;
}

// ==================== 表单类型定义 ====================

/**
 * 欠费明细表单数据类型
 * Arrears details form data type
 */
export interface ArrearsDetailsFormVO {
	/** 费用编号 Fee number */
	feeNumber: string;
	/** 房号 Room number */
	roomNumber: string;
	/** 业主 Owner */
	owner: string;
	/** 业主电话 Owner phone */
	ownerPhone: string;
	/** 面积 Area */
	area: string;
	/** 费用项 Fee item */
	feeItem: string;
	/** 开始时间 Start time */
	startTime: string;
	/** 结束时间 End time */
	endTime: string;
	/** 欠费时长 Arrears duration */
	arrearsDuration: string;
	/** 欠费金额 Arrears amount */
	arrearsAmount: string;
}

// TODO: 不允许将弹框的表单类型 迁移到@01s-11comm/type中
/**
 * 欠费明细表单 Props
 * Arrears details form props
 */
export interface ArrearsDetailsFormProps {
	/** 表单数据 Form data */
	form: ArrearsDetailsFormVO;
	/** 默认值 Default values */
	defaultValues: ArrearsDetailsFormVO;
}

// ==================== 默认表单对象 ====================

/** 默认表单 Default form */
export const defaultArrearsDetailsForm: ArrearsDetailsFormVO = {
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

// ==================== 选项定义 ====================

/**
 * 状态选项
 * Status options
 */
export const arrearsDetailsStatusOptions: OptionsType = [
	{ label: "已缴费", value: "已缴费" },
	{ label: "未缴费", value: "未缴费" },
	{ label: "部分缴费", value: "部分缴费" },
];
