import type { OptionsType } from "../../../common";

// ==================== 表单类型定义 ====================

/**
 * 欠费明细表单数据类型 / Arrears details form data type
 */
export interface ArrearsDetailsFormVO {
	/** 费用编号 / Fee number */
	feeNumber: string;
	/** 房号 / Room number */
	roomNumber: string;
	/** 业主 / Owner */
	owner: string;
	/** 业主电话 / Owner phone */
	ownerPhone: string;
	/** 面积 / Area */
	area: string;
	/** 费用项 / Fee item */
	feeItem: string;
	/** 开始时间 / Start time */
	startTime: string;
	/** 结束时间 / End time */
	endTime: string;
	/** 欠费时长 / Arrears duration */
	arrearsDuration: string;
	/** 欠费金额 / Arrears amount */
	arrearsAmount: string;
}

// ==================== 原有类型定义 ====================

/**
 * @description arrears-details-list列表数据
 * ArrearsDetailsList list item
 */
export interface ArrearsDetailsListListItem {
	/** ID */
	id: string;
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 备注 Remark */
	remark?: string;
}

/**
 * @description arrears-details-list列表查询参数
 * ArrearsDetailsList list query parameters
 */
export interface ArrearsDetailsListQueryParams {
	/** 名称 Name */
	name?: string;
	/** 状态 Status */
	status?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 状态选项
 * Status options
 */
export const arrearsDetailsListStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

// ==================== 默认表单对象 ====================

/** 默认表单 / Default form */
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

// ==================== 向后兼容的类型别名 ====================

/** 向后兼容：欠费明细表单_VO / Backward compatibility: 欠费明细表单_VO */
export type 欠费明细表单_VO = ArrearsDetailsFormVO;
