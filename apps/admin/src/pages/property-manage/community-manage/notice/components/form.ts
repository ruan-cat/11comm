import {
	CommunityNoticeFormVO,
	CommunityNoticeFormProps,
	defaultCommunityNoticeForm,
	noticeTypeOptions,
	noticeStatusOptions,
	列表数据转表单数据,
} from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm = defaultCommunityNoticeForm;

/** 公示类型选项 */
export const 公示类型选项 = noticeTypeOptions;

/** 公示状态选项 */
export const 公示状态选项 = noticeStatusOptions;

export type { CommunityNoticeFormVO, CommunityNoticeFormProps };
export { defaultCommunityNoticeForm, noticeTypeOptions, noticeStatusOptions, 列表数据转表单数据 };
