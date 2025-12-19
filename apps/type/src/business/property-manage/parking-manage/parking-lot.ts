import type { OptionsType } from "../../../common";
import type { Mode } from "../community-manage/my";

/**
 * @description parking-lot列表数据
 * ParkingLot list item
 */
export interface ParkingLotListItem {
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
 * @description parking-lot列表查询参数
 * ParkingLot list query parameters
 */
export interface ParkingLotQueryParams {
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
export const parkingLotStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

// ==================== 停车场表单类型 Parking Lot Form Types ====================

/** 停车场类型联合类型 Parking lot type union */
export type ParkingLotType = "地面停车场" | "地下停车场" | "立体停车场" | "路边停车位";

/** 车位类型联合类型 Parking space type union */
export type ParkingSpaceType = "标准车位" | "大型车位" | "无障碍车位" | "充电桩车位" | "访客车位";

/**
 * @description 停车场表单数据类型
 * Parking lot form data type
 */
export interface ParkingLotFormVO {
	/** 停车场编号 Parking lot number */
	parkingLotNumber: string;
	/** 停车场类型 Parking lot type */
	parkingLotType: ParkingLotType;
	/** 车位类型 Parking space type */
	parkingSpaceType: ParkingSpaceType;
	/** 外部编码 External code */
	externalCode: string;
	/** 备注 Remark */
	remark: string;
}

/**
 * @description 停车场表单 Props
 * Parking lot form props
 */
export interface ParkingLotFormProps {
	/** 表单数据 Form data */
	form: ParkingLotFormVO;
	/** 表单组件重置时默认使用的对象 Default values for form reset */
	defaultValues: ParkingLotFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
