import type { OptionsType, BaseListQueryParams } from "../../../common";

/**
 * @description 公示类型
 * Notice type
 */
export type NoticeType = "notification" | "announcement" | "reminder" | "activity" | "maintenance" | "safety";

/**
 * @description 公示状态类型
 * Notice status type
 */
export type NoticeStatus = "draft" | "published" | "expired";

/**
 * @description 小区公示列表数据
 * Community notice list item
 */
export interface CommunityNoticeListItem {
	/** 主键ID Primary key ID */
	id: string;
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
export interface CommunityNoticeQueryParams extends BaseListQueryParams {
	/** 公示标题 Notice title */
	noticeTitle?: string;
	/** 公示类型 Notice type */
	noticeType?: NoticeType;
}

/**
 * @description 公示类型选项
 * Notice type options
 */
export const noticeTypeOptions: OptionsType = [
	{ label: "通知", value: "notification" },
	{ label: "公告", value: "announcement" },
	{ label: "提醒", value: "reminder" },
	{ label: "活动", value: "activity" },
	{ label: "维修", value: "maintenance" },
	{ label: "安全", value: "safety" },
];

/**
 * @description 公示状态选项
 * Notice status options
 */
export const noticeStatusOptions: OptionsType = [
	{ label: "草稿", value: "draft" },
	{ label: "已发布", value: "published" },
	{ label: "已过期", value: "expired" },
];

/**
 * @description 小区公示表单数据类型
 * Community notice form data type
 */
export interface CommunityNoticeFormVO {
	/** 公示标题 Notice title */
	noticeTitle: string;
	/** 公示类型 Notice type */
	noticeType: NoticeType;
	/** 有效期开始 Validity start time */
	validityStartTime: string;
	/** 有效期结束 Validity end time */
	validityEndTime: string;
	/** 公示状态 Notice status */
	status: NoticeStatus;
	/** 公示内容摘要 Summary */
	summary: string;
	/** 发布人 Publisher */
	publisher?: string;
	/** 发布时间 Notice time */
	noticeTime?: string;
}

/**
 * @description 将列表数据转换为表单数据
 * Convert list data to form data
 */
export function noticeListDataToFormData(listData: CommunityNoticeListItem): CommunityNoticeFormVO {
	return {
		noticeTitle: listData.noticeTitle,
		noticeType: listData.noticeType,
		validityStartTime: "",
		validityEndTime: "",
		status: "draft",
		summary: "",
		publisher: listData.publisher,
		noticeTime: listData.noticeTime,
	};
}
