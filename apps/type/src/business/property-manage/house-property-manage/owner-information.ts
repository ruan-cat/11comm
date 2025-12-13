import type { OptionsType } from "../../../common";

/**
 * @description owner-information列表数据
 * OwnerInformation list item
 */
export interface OwnerInformationListItem {
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
 * @description owner-information列表查询参数
 * OwnerInformation list query parameters
 */
export interface OwnerInformationQueryParams {
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
export const ownerInformationStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 业主信息表单VO
 * Owner information form VO
 */
export interface OwnerInformationFormVO {
	/** 人员类型 Personnel type */
	personnelType: string;
	/** 人员角色 Personnel role */
	personnelRole: string;
	/** 客户名称 Customer name */
	customerName: string;
	/** 联系手机 Contact phone */
	contactPhone: string;
	/** 性别 Gender */
	gender: string;
	/** 备用手机 Backup phone */
	backupPhone: string;
	/** 地址 Address */
	address: string;
	/** 门禁钥匙 Access key */
	accessKey: string;
	/** 身份证 ID card */
	idCard: string;
	/** 备注 Remark */
	remark: string;
}

/**
 * @description 人员类型选项
 * Personnel type options
 */
export const 人员类型Options: OptionsType = [
	{ label: "业主", value: "业主" },
	{ label: "租户", value: "租户" },
	{ label: "家属", value: "家属" },
];

/**
 * @description 人员角色选项
 * Personnel role options
 */
export const 人员角色Options: OptionsType = [
	{ label: "户主", value: "户主" },
	{ label: "家庭成员", value: "家庭成员" },
	{ label: "租客", value: "租客" },
];

/**
 * @description 性别选项
 * Gender options
 */
export const 性别Options: OptionsType = [
	{ label: "男", value: "男" },
	{ label: "女", value: "女" },
];
