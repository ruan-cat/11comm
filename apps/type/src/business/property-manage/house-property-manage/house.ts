import type { OptionsType } from "../../../common";
import { houseTypeOptions, houseStatusOptions } from "../../../common/business-options";

/**
 * @description 房屋状态
 * House status
 */
export type HouseStatus = "未销售" | "已入住" | "已交房" | "已装修" | "未入住" | "已出租" | "已出售" | "空闲" | "装修中";

/**
 * @description 房屋类型
 * House type
 */
export type HouseType = "住宅" | "办公室" | "宿舍" | "储物间";

/**
 * @description 房屋管理列表数据
 * House list item
 */
export interface HouseListItem {
	/** 房屋编号 House code */
	houseCode: string;
	/** 楼层 Floor */
	floor: string;
	/** 业主 Owner */
	owner: string;
	/** 类型 Type */
	houseType: HouseType;
	/** 房屋面积 House area */
	houseArea: string;
	/** 租金 Rent */
	rent: string;
	/** 房屋状态 House status */
	houseStatus: HouseStatus;
	/** 有效期 Valid until */
	validUntil: string;
	/** 业主成员 Owner members */
	ownerMembers: string;
	/** 业主车辆 Owner vehicles */
	ownerVehicles: string;
	/** 业主房屋 Owner houses */
	ownerHouses: string;
	/** 投诉 Complaints */
	complaints: string;
	/** 报修 Repairs */
	repairs: string;
	/** 房屋欠费 House arrears */
	houseArrears: string;
	/** 业主欠费 Owner arrears */
	ownerArrears: string;
	/** 房屋合同 House contract */
	houseContract: string;
}

/**
 * @description 房屋管理列表查询参数
 * House list query parameters
 */
export interface HouseQueryParams {
	/** 房屋编号 House code */
	houseCode?: string;
	/** 房屋状态 House status */
	houseStatus?: HouseStatus;
	/** 房屋类型 House type */
	houseType?: HouseType;
	/** 楼栋单元 Building unit */
	buildingUnit?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

// 房屋状态选项和房屋类型选项已从 common/business-options 导入

/**
 * @description 楼栋单元选项
 * Building unit options
 */
export const buildingUnitOptions: OptionsType = [
	{ label: "当前楼栋单元", value: "当前楼栋单元" },
	{ label: "全部楼栋单元", value: "全部楼栋单元" },
];

/**
 * @description 房屋管理表单VO
 * House management form VO
 */
export interface HouseManagementFormVO {
	/** 房屋 House */
	house: string;
	/** 楼层 Floor */
	floor: string;
	/** 业主 Owner */
	owner: string;
	/** 类型 Type */
	type: string;
	/** 房屋面积 House area */
	houseArea: string;
	/** 租金 Rent */
	rent: string;
	/** 房屋状态 House status */
	houseStatus: string;
	/** 有效期 Valid until */
	validUntil: string;
}

