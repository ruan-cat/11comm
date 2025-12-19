import type { OptionsType } from "../../../common";

/**
 * @description 初始化小区表单VO
 * Initialize community form VO
 */
export interface InitializeCommunityFormVO {
	/** 小区ID Community ID */
	communityId: string;
	/** 小区名称 Community name */
	communityName: string;
	/** 附近地标 Nearby landmark */
	nearbyLandmark: string;
	/** 城市编码 City code */
	cityCode: string;
	/** 状态 Status */
	status: string;
}

/**
 * @description 初始化小区列表数据
 * Initialize community list item
 */
export interface InitializeCommunityListItem {
	/** 小区ID Community ID */
	communityId: string;
	/** 小区名称 Community name */
	communityName: string;
	/** 附近地标 Nearby landmark */
	nearbyLandmark: string;
	/** 城市编码 City code */
	cityCode: string;
	/** 状态 Status */
	status: string;
}

/**
 * @description 初始化小区列表查询参数
 * Initialize community list query parameters
 */
export interface InitializeCommunityQueryParams {
	/** 小区ID Community ID */
	communityId?: string;
	/** 小区名称 Community name */
	communityName?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}
