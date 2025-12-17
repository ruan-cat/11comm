import type { BaseListQueryParams } from "../../../common";

/**
 * 系统配置信息
 */
export interface SystemConfig {
	/** 标题名称 */
	title: string;
	/** 副标题 */
	subtitle: string;
	/** 简写名称 */
	shortName: string;
	/** 公司名称 */
	companyName: string;
	/** logo地址 */
	logoUrl: string;
	/** 静态url */
	staticUrl: string;
	/** 默认小区编号 */
	defaultCommunityCode: string;
	/** 业主标题 */
	ownerTitle: string;
	/** 物业手机标题 */
	propertyMobileTitle: string;
	/** qq地图key */
	qqMapKey: string;
	/** 商城地址 */
	mallUrl: string;
}

/**
 * 系统配置列表查询参数
 * @description 虽然只有一个配置，但为了保持接口统一，仍然定义此接口
 */
export interface SystemConfigListQuery extends BaseListQueryParams {
	/** 标题名称 */
	title?: string;
}
