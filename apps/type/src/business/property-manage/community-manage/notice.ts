import type { OptionsType } from "../../../common";

/**
 * @description 公示类型
 * Notice type
 */
export type NoticeType = "通知" | "公告" | "提醒" | "活动" | "维修" | "安全";

/**
 * @description 公示状态类型
 * Notice status type
 */
export type NoticeStatus = "草稿" | "已发布" | "已过期";

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

/**
 * @description 公示状态选项
 * Notice status options
 */
export const noticeStatusOptions: OptionsType = [
	{ label: "草稿", value: "草稿" },
	{ label: "已发布", value: "已发布" },
	{ label: "已过期", value: "已过期" },
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
 * @description 小区公示表单 Props 类型
 * Community notice form props type
 */
export interface CommunityNoticeFormProps {
	/** 表单数据 Form data */
	form: CommunityNoticeFormVO;
	/** 表单组件重置时默认使用的对象 Default values for form reset */
	defaultValues: CommunityNoticeFormVO;
}

/**
 * @description 默认小区公示表单
 * Default community notice form
 */
export const defaultCommunityNoticeForm: CommunityNoticeFormVO = {
	noticeTitle: "",
	noticeType: "通知",
	validityStartTime: "",
	validityEndTime: "",
	status: "草稿",
	summary: "",
	publisher: "",
	noticeTime: "",
};

/**
 * @description 列表数据转表单数据
 * Convert list data to form data
 */
export function 列表数据转表单数据(row: CommunityNoticeListItem): CommunityNoticeFormVO {
	return {
		noticeTitle: row.noticeTitle,
		noticeType: row.noticeType,
		validityStartTime: "",
		validityEndTime: "",
		status: "已发布",
		summary: "",
		publisher: row.publisher,
		noticeTime: row.noticeTime,
	};
}
