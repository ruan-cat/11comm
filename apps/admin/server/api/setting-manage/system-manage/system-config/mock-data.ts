/**
 * @file 系统配置假数据
 * @description System config mock data
 */

import type { SystemConfigListItem } from "@01s-11comm/type";

/**
 * 系统配置假数据
 * System config mock data
 */
export const mockSystemConfigData: SystemConfigListItem[] = [
	{
		configId: "SC001",
		title: "智慧社区管理系统",
		subtitle: "让社区生活更美好",
		shortName: "智慧社区",
		companyName: "11comm科技有限公司",
		logoUrl: "https://example.com/logo.png",
		staticUrl: "https://static.example.com",
		defaultCommunityCode: "COMMUNITY001",
		ownerTitle: "业主",
		propertyMobileTitle: "物业助手",
		qqMapKey: "ABCD1234567890EFGH",
		mallUrl: "https://mall.example.com",
	},
];
