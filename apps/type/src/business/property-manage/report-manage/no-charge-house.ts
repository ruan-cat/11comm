import type { OptionsType } from "../../../common";

/**
 * @description no-charge-house列表数据
 * NoChargeHouse list item
 */
export interface NoChargeHouseListItem {
	/** ID */
	id: string;
	/** 小区 Community */
	community: string;
	/** 楼栋 Building */
	building: string;
	/** 单元 Unit */
	unit: string;
	/** 房屋编号/合同名称 House number/Contract name */
	houseNumberContractName: string;
	/** 业主名称 Owner name */
	ownerName: string;
	/** 业主手机号 Owner phone */
	ownerPhone: string;
}

/**
 * @description no-charge-house列表查询参数
 * NoChargeHouse list query parameters
 */
export interface NoChargeHouseQueryParams {
	/** 房屋编号/合同名称 House number/Contract name */
	houseNumberContractName?: string;
	/** 业主名称 Owner name */
	ownerName?: string;
	/** 业主手机号 Owner phone */
	ownerPhone?: string;
	/** 小区 Community */
	community?: string;
	/** 楼栋 Building */
	building?: string;
	/** 单元 Unit */
	unit?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}
