import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 修改小区相关设置项
 */
export interface CommunitySettingItem {
	/** 主键ID */
	csId: string;
	/** 设置值 */
	settingValue: string;
}

/**
 * 小区相关设置详情
 */
export interface CommunitySetting {
	/** 主键ID */
	csId?: string;
	/** 备注 */
	remark?: string;
	/** 名称 */
	settingName?: string;
	/** 设置值 */
	settingValue: string;
}

/**
 * 提交配置项修改值模型
 */
export interface ModifyCommunitySettingParams {
	/** 修改小区相关设置项 */
	settingItems: CommunitySettingItem[];
}

/**
 * 获取配置项数据查询参数
 */
export interface QueryCommunitySettingParams {
	/** 小区ID */
	communityId: string;
	/** 设置类型，用于筛选特定类别的配置项。例如：2002表示费用相关的配置项数据 */
	settingType: string;
}

/**
 * 获取配置项列表查询参数
 */
export interface QueryCommunitySettingKeyParams {
	/** 小区ID */
	communityId: string;
}

/**
 * 修改密码数据对象
 */
export interface ModifyStaffPwdParams {
	/** 新密码 */
	newPwd: string;
	/** 旧密码 */
	oldPwd: string;
	/** 用户ID */
	userId: string;
}

/**
 * 注册协议修改数据对象
 */
export interface UpdateRegisterProtocolParams {
	/** 商家注册协议 */
	merchantProtocol?: string;
	/** 数据状态，详细参考c_status表，S 保存，0 在用，1失效 */
	statusCd?: string;
	/** 用户注册协议 */
	userProtocol?: string;
}

/**
 * 系统配置修改数据对象
 */
export interface UpdateSystemInfoParams {
	/** 公司名称 */
	companyName?: string;
	/** 默认小区编号 */
	defaultCommunityId?: string;
	/** 静态url */
	imgUrl?: string;
	/** Logo地址 */
	logoUrl?: string;
	/** 商城地址 */
	mallUrl?: string;
	/** 业主标题 */
	ownerTitle?: string;
	/** 物业手机标题 */
	propertyTitle?: string;
	/** qq地图key */
	qqMapKey?: string;
	/** 副标题 */
	subSystemTitle?: string;
	/** 简写标题 */
	systemSimpleTitle?: string;
	/** 标题名称 */
	systemTitle?: string;
}

/**
 * 格式化数据查询参数
 */
export interface RemoveDataParams {
	/** 小区ID */
	communityId: string;
	/** 用户密码 */
	password: string;
}

/**
 * 获取小区列表查询参数
 */
export interface QueryCommunitiesParams {
	/** 小区id */
	communityId?: string;
	/** 小区名称 */
	name?: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
}

/**
 * 初始化小区数据传输模型
 */
export interface InitCommunityDTO {
	/** 城市编码 */
	cityCode: string;
	/** 小区id */
	communityId: string;
	/** 小区名称 */
	name: string;
	/** 附近地标 */
	nearbyLandmarks: string;
	/** 状态（说明：'业务状态 1000为待审核 1100审核完成 1200审核拒绝'） */
	state: string;
	/** 状态对应中文 */
	stateText?: string;
}

/**
 * 获取小区配置值
 */
export interface CommunitySettingKeyVO {
	/** 名称 */
	name?: string;
	/** 设置类型 */
	settingType?: string;
	/** 数据状态0正常1失效 */
	statusCd?: string;
}

// ==================== 接口函数 ====================

/**
 * 提交配置项修改接口
 * @description 修改小区相关设置项配置
 */
export function modifyCommunitySetting<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyCommunitySettingParams>({
		url: "/j3-system/community-setting/modify-communitysetting",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				settingItems: [],
			},
		},
		options,
	});
}

/**
 * 获取配置项数据接口
 * @description 根据小区ID和设置类型获取配置项数据
 */
export function queryCommunitySettingList<T = CommunitySetting[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryCommunitySettingParams>({
		url: "/j3-system/community-setting/query-communitysetting",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				communityId: "",
				settingType: "",
			},
		},
		options,
	});
}

/**
 * 获取配置项列表接口
 * @description 获取配置项列表
 */
export function queryCommunitySettingKeyList<T = CommunitySettingKeyVO[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryCommunitySettingKeyParams>({
		url: "/j3-system/community-setting/query-communitysettingkey",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				communityId: "",
			},
		},
		options,
	});
}

/**
 * 获取小区列表接口
 * @description 获取小区列表（分页+条件）
 */
export function queryCommunitiesList<T = PageDTO<InitCommunityDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryCommunitiesParams>({
		url: "/j3-system/init-community/query-coummunities",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				communityId: "",
				name: "",
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 修改密码接口
 * @description 修改员工密码
 */
export function modifyStaffPwd<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyStaffPwdParams>({
		url: "/j3-system/password/modify-staff-pwd",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				newPwd: "",
				oldPwd: "",
				userId: "",
			},
		},
		options,
	});
}

/**
 * 修改注册协议接口
 * @description 修改用户和商家注册协议内容
 */
export function updateRegisterProtocol<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, UpdateRegisterProtocolParams>({
		url: "/j3-system/register/update-register-protocol",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				merchantProtocol: "",
				statusCd: "",
				userProtocol: "",
			},
		},
		options,
	});
}

/**
 * 修改系统配置接口
 * @description 修改系统配置信息
 */
export function updateSystemInfo<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, UpdateSystemInfoParams>({
		url: "/j3-system/system-config/update-system-info",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				companyName: "",
				defaultCommunityId: "",
				imgUrl: "",
				logoUrl: "",
				mallUrl: "",
				ownerTitle: "",
				propertyTitle: "",
				qqMapKey: "",
				subSystemTitle: "",
				systemSimpleTitle: "",
				systemTitle: "",
			},
		},
		options,
	});
}

/**
 * 格式化数据接口
 * @description 格式化指定小区的数据
 */
export function removeData<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, RemoveDataParams>({
		url: "/j3-system/init-community/remove-data",
		httpParamWay: "query",
		config: {
			method: "DELETE",
			params: {
				communityId: "",
				password: "",
			},
		},
		options,
	});
}
