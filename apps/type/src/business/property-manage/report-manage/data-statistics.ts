import type { OptionsType } from "../../../common";

/**
 * @description data-statistics列表数据
 * DataStatistics list item
 */
export interface DataStatisticsListItem {
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
 * @description data-statistics列表查询参数
 * DataStatistics list query parameters
 */
export interface DataStatisticsQueryParams {
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
 * @description 数据统计-欠费明细列表数据
 * Data statistics arrears details list item
 */
export interface DataStatisticsArrearsDetailsListItem {
	/** 房屋 House */
	house: string;
	/** 业主 Owner */
	owner: string;
	/** 欠费 Arrears */
	arrears: string;
	/** 物业费 Property fee */
	propertyFee: string;
	/** 押金 Deposit */
	deposit: string;
	/** 停车费 Parking fee */
	parkingFee: string;
	/** 煤气费 Gas fee */
	gasFee: string;
	/** 取暖费 Heating fee */
	heatingFee: string;
	/** 维修费 Maintenance fee */
	maintenanceFee: string;
	/** 服务费 Service fee */
	serviceFee: string;
	/** 其他 Other */
	other: string;
	/** 水费 Water fee */
	waterFee: string;
	/** 电费 Electricity fee */
	electricityFee: string;
	/** 租金 Rent */
	rent: string;
	/** 公摊费 Common area fee */
	commonAreaFee: string;
}

/**
 * @description 数据统计-欠费明细查询参数
 * Data statistics arrears details query parameters
 */
export interface DataStatisticsArrearsDetailsQueryParams {
	/** 房屋编号 House number */
	houseNumber?: string;
	/** 业主名称 Owner name */
	ownerName?: string;
	/** 手机号 Phone number */
	phoneNumber?: string;
}

/**
 * @description 数据统计-月实收明细列表数据
 * Data statistics monthly actual collection details list item
 */
export interface DataStatisticsMonthlyActualCollectionDetailsListItem {
	/** 房屋 House */
	house: string;
	/** 业主 Owner */
	owner: string;
	/** 欠费 Arrears */
	arrears: string;
	/** 实收 Actual collection */
	actualCollection: string;
	/** 费用名称 Fee name */
	feeName: string;
	/** 实收时间段 Actual collection period */
	actualCollectionPeriod: string;
	/** 收银员 Cashier */
	cashier: string;
	/** 交费时间 Payment time */
	paymentTime: string;
}

/**
 * @description 数据统计-月实收明细查询参数
 * Data statistics monthly actual collection details query parameters
 */
export interface DataStatisticsMonthlyActualCollectionDetailsQueryParams {
	/** 楼栋 Building */
	building?: string;
	/** 开始时间 Start time */
	startTime?: string;
	/** 结束时间 End time */
	endTime?: string;
}

/**
 * @description 数据统计-月欠费明细列表数据
 * Data statistics monthly arrears details list item
 */
export interface DataStatisticsMonthlyArrearsDetailsListItem {
	/** 房屋 House */
	house: string;
	/** 业主 Owner */
	owner: string;
	/** 费用名称 Fee name */
	feeName: string;
	/** 欠费时间段 Arrears period */
	arrearsPeriod: string;
	/** 欠费金额 Arrears amount */
	arrearsAmount: string;
}

/**
 * @description 数据统计-月欠费明细查询参数
 * Data statistics monthly arrears details query parameters
 */
export interface DataStatisticsMonthlyArrearsDetailsQueryParams {
	/** 楼栋 Building */
	building?: string;
	/** 开始时间 Start time */
	startTime?: string;
	/** 结束时间 End time */
	endTime?: string;
}

/**
 * @description 数据统计-实收明细列表数据
 * Data statistics actual collection details list item
 */
export interface DataStatisticsActualCollectionDetailsListItem {
	/** 房屋 House */
	house: string;
	/** 业主 Owner */
	owner: string;
	/** 实收 Actual collection */
	actualCollection: string;
	/** 物业费 Property fee */
	propertyFee: string;
	/** 押金 Deposit */
	deposit: string;
	/** 停车费 Parking fee */
	parkingFee: string;
	/** 煤气费 Gas fee */
	gasFee: string;
	/** 取暖费 Heating fee */
	heatingFee: string;
	/** 维修费 Maintenance fee */
	maintenanceFee: string;
	/** 服务费 Service fee */
	serviceFee: string;
	/** 其他 Other */
	other: string;
	/** 水费 Water fee */
	waterFee: string;
	/** 电费 Electricity fee */
	electricityFee: string;
	/** 租金 Rent */
	rent: string;
	/** 公摊费 Common area fee */
	commonAreaFee: string;
}

/**
 * @description 数据统计-实收明细查询参数
 * Data statistics actual collection details query parameters
 */
export interface DataStatisticsActualCollectionDetailsQueryParams {
	/** 房屋编号 House number */
	houseNumber?: string;
	/** 业主名称 Owner name */
	ownerName?: string;
	/** 手机号 Phone number */
	phoneNumber?: string;
}
