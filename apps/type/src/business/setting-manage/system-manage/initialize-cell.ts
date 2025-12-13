import type { OptionsType } from "../../../common";

/**
 * @description 初始化小区表单VO
 * Initialize cell form VO
 */
export interface InitializeCellFormVO {
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
