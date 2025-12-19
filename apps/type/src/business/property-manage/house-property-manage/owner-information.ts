import type { OptionsType } from "../../../common";
import { personTypeOptions, personRoleOptions, genderOptions } from "../../../common/business-options";

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

// 人员类型选项、人员角色选项和性别选项已从 common/business-options 导入

// ==================== 兼容旧中文名称 ====================

/**
 * @description 人员类型选项（兼容性）
 * Personnel type options (for compatibility)
 */
export const 人员类型Options = personTypeOptions;

/**
 * @description 人员角色选项（兼容性）
 * Personnel role options (for compatibility)
 */
export const 人员角色Options = personRoleOptions;

/**
 * @description 性别选项（兼容性）
 * Gender options (for compatibility)
 */
export const 性别Options = genderOptions;

/**
 * @description 业主信息列表数据（兼容性中文名称）
 * OwnerInformation list item (for compatibility with Chinese names)
 */
export type 业主信息_列表数据 = OwnerInformationListItem;

/**
 * @description 业主信息列表查询参数（兼容性中文名称）
 * OwnerInformation query parameters (for compatibility with Chinese names)
 */
export type 业主信息_列表查询_VO = OwnerInformationQueryParams;

/**
 * @description 业主信息表单VO（兼容性中文名称）
 * Owner information form VO (for compatibility with Chinese names)
 */
export type 业主信息表单_VO = OwnerInformationFormVO;
