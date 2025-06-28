/**
 * 业主反馈视图对象
 * @description
 * 业主反馈的数据结构
 */
export interface OwnerFeedbackVO {
	/** 创建时间 */
	createTime: string;
	/** 用户名称 */
	objName: string;
	/** 房屋编号 */
	roomName: string;
	/** 状态描述 */
	state: string;
	/** 反馈内容 */
	title: string;
}

/**
 * 小区信息视图对象
 * @description
 * 小区信息数据
 */
export interface BusinessCommunityVO {
	/** 楼宇数量 */
	buildingCount: number;
	/** 房屋数量 */
	houseCount: number;
	/** 车位数量 */
	parkingCount: number;
	/** 登记住户数量 */
	residentCount: number;
	/** 商铺数量 */
	shopCount: number;
	/** 车辆数量 */
	vehicleCount: number;
}

/**
 * 投诉统计视图对象
 * @description
 * 投诉统计数据
 */
export interface ComplaintStatsVO {
	/** 已处理投诉数量 */
	processedComplaints: number;
	/** 处理中投诉数量 */
	processingComplaints: number;
	/** 全部投诉数量 */
	totalComplaints: number;
}

/**
 * 住户注册统计视图对象
 * @description
 * 住户注册统计数据
 */
export interface RegistrationStatsVO {
	/** 已绑定房屋的住户数量 */
	boundHouseCount: number;
	/** 已注册的住户数量 */
	registeredCount: number;
	/** 未绑定房屋的住户数量 */
	unboundHouseCount: number;
	/** 未注册的住户数量 */
	unregisteredCount: number;
}

/**
 * 报修统计视图对象
 * @description
 * 报修统计数据
 */
export interface RepairStatsVO {
	/** 全部报修数量 */
	allRepairs: number;
	/** 待派单数量 */
	pendingRepairs: number;
	/** 已处理数量 */
	processedRepairs: number;
	/** 处理中数量 */
	processingRepairs: number;
}

/**
 * 业主反馈接口
 * @description
 * 获取所有业主反馈信息列表
 */
export function dashboardConsoleAppraise<T = OwnerFeedbackVO[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T>({
		url: "/dashboard/console/appraise",
		options,
		httpParamWay: "query",
		config: {
			method: "GET",
			data: {},
		},
	});
}

/**
 * 小区信息接口
 * @description
 * 获取所有小区信息列表
 */
export function dashboardConsoleBusinessCommunity<T = BusinessCommunityVO[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T>({
		url: "/dashboard/console/business-community",
		options,
		httpParamWay: "query",
		config: {
			method: "GET",
			data: {},
		},
	});
}

/**
 * 投诉统计接口
 * @description
 * 获取所有投诉统计信息列表
 */
export function dashboardConsoleComplaintStats<T = ComplaintStatsVO[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T>({
		url: "/dashboard/console/complaint-stats",
		options,
		httpParamWay: "query",
		config: {
			method: "GET",
			data: {},
		},
	});
}

/**
 * 住户注册统计接口
 * @description
 * 获取所有住户注册统计信息列表
 */
export function dashboardConsoleRegisterStats<T = RegistrationStatsVO[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T>({
		url: "/dashboard/console/register-stats",
		options,
		httpParamWay: "query",
		config: {
			method: "GET",
			data: {},
		},
	});
}

/**
 * 报修统计接口
 * @description
 * 获取所有报修统计信息列表
 */
export function dashboardConsoleRepairStats<T = RepairStatsVO[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T>({
		url: "/dashboard/console/repair-stats",
		options,
		httpParamWay: "query",
		config: {
			method: "GET",
			data: {},
		},
	});
}
