/**
 * @description 物业公司类型
 * Property company type
 */
export type PropertyCompanyType = "国企" | "民企";

/**
 * @description 服务等级
 * Service level
 */
export type ServiceLevel = "一级" | "二级" | "三级";

/**
 * @description 运营状态
 * Operation status
 */
export type OperationStatus = "正常运营" | "暂停运营" | "已注销";

/**
 * @description 物业公司列表数据
 * Property company list item
 */
export interface PropertyCompanyListItem {
	/** 编号 Company ID */
	companyId: string;
	/** 名称 Company name */
	companyName: string;
	/** 地址 Address */
	address: string;
	/** 管理员 Administrator */
	administrator: string;
	/** 电话 Phone */
	phone: string;
	/** 公司法人 Legal representative */
	legalRepresentative: string;
	/** 成立日期 Establishment date */
	establishmentDate: string;
	/** 地标 Landmark */
	landmark: string;
	/** 创建时间 Creation time */
	createTime: string;
	/** 开通小区数量 Number of communities */
	communityCount: number;
	/** 公司类型 Company type */
	companyType: PropertyCompanyType;
	/** 服务等级 Service level */
	serviceLevel: ServiceLevel;
	/** 运营状态 Operation status */
	operationStatus: OperationStatus;
	/** 备注 Remarks */
	remarks: string;
}

/**
 * @description 物业公司列表查询参数
 * Property company list query parameters
 */
export interface PropertyCompanyQueryParams {
	/** 物业编号 Company ID */
	companyId?: string;
	/** 物业名称 Company name */
	companyName?: string;
	/** 物业电话 Phone */
	phone?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 物业公司表单数据类型 Property management company form data type
 */
export interface PropertyManagementCompanyFormVO {
	/** 物业公司编号 Company ID */
	code: string;
	/** 物业公司名称 Company name */
	name: string;
	/** 公司地址 Address */
	address: string;
	/** 联系电话 Phone */
	phone: string;
	/** 管理员姓名 Administrator */
	administrator: string;
	/** 公司法人代表 Legal representative */
	legalRepresentative: string;
	/** 公司成立日期 Establishment date */
	establishmentDate: string;
	/** 位置地标 Landmark */
	landmark: string;
	/** 开通小区数量 Number of communities */
	communityCount: number;
	/** 公司类型 Company type */
	companyType: string;
	/** 服务等级 Service level */
	serviceLevel: string;
	/** 运营状态 Operation status */
	operationStatus: string;
	/** 备注 Remarks */
	remarks: string;
}
