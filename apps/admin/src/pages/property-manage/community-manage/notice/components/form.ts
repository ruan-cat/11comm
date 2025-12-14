import type { CommunityNoticeListItem } from "@01s-11comm/type";
import { noticeTypeOptions } from "@01s-11comm/type";

/** 公示类型 */
export type NoticeType = "通知" | "公告" | "提醒" | "活动" | "维修" | "安全";

/** 公示状态 */
export type NoticeStatus = "草稿" | "已发布" | "已过期";

export interface CommunityNoticeFormVO {
	/** 公示标题 */
	noticeTitle: string;
	/** 公示类型 */
	noticeType: NoticeType;
	/** 有效期开始 */
	validityStartTime: string;
	/** 有效期结束 */
	validityEndTime: string;
	/** 公示状态 */
	status: NoticeStatus;
	/** 公示内容摘要 */
	summary: string;
	/** 发布人 */
	publisher?: string;
	/** 发布时间 */
	noticeTime?: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: CommunityNoticeFormVO = {
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
 * 小区公示表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface CommunityNoticeFormProps {
	/** 表单数据 */
	form: CommunityNoticeFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: CommunityNoticeFormVO;
}

/** 公示状态选项 */
export const noticeStatusOptions = [
	{ label: "草稿", value: "草稿" },
	{ label: "已发布", value: "已发布" },
	{ label: "已过期", value: "已过期" },
];

/** 从列表数据转换为表单数据的辅助函数 */
export function 列表数据转表单数据(列表数据: CommunityNoticeListItem): CommunityNoticeFormVO {
	return {
		noticeTitle: 列表数据.noticeTitle,
		noticeType: 列表数据.noticeType as NoticeType,
		validityStartTime: "",
		validityEndTime: "",
		status: "草稿",
		summary: "",
		publisher: 列表数据.publisher,
		noticeTime: 列表数据.noticeTime,
	};
}

export { noticeTypeOptions };
