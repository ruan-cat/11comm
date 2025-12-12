import type { OptionsType } from "../../../common";

/**
 * @description 公示类型
 * Notice type
 */
export type NoticeType = "通知" | "公告" | "提醒" | "活动" | "维修" | "安全";

/**
 * @description 小区公示列表数据
 * Community notice list item
 */
export interface CommunityNoticeListItem {
	/** 头部照片 Header image */
	headerImage: string;
	/** 公示标题 Notice title */
	noticeTitle: string;
	/** 公示类型 Notice type */
	noticeType: NoticeType;
	/** 公示时间 Notice time */
	noticeTime: string;
	/** 发布人 Publisher */
	publisher: string;
}

/**
 * @description 小区公示列表查询参数
 * Community notice list query parameters
 */
export interface CommunityNoticeQueryParams {
	/** 公示标题 Notice title */
	noticeTitle?: string;
	/** 公示类型 Notice type */
	noticeType?: NoticeType;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 公示类型选项
 * Notice type options
 */
export const noticeTypeOptions: OptionsType = [
	{ label: "通知", value: "通知" },
	{ label: "公告", value: "公告" },
	{ label: "提醒", value: "提醒" },
	{ label: "活动", value: "活动" },
	{ label: "维修", value: "维修" },
	{ label: "安全", value: "安全" },
];

