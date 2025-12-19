import {
	CommunityNoticeFormVO,
	defaultCommunityNoticeForm,
	noticeTypeOptions,
	noticeStatusOptions,
	列表数据转表单数据,
} from "@01s-11comm/type";

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

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm = defaultCommunityNoticeForm;

/** 公示类型选项 */
export const 公示类型选项 = noticeTypeOptions;

/** 公示状态选项 */
export const 公示状态选项 = noticeStatusOptions;

export type { CommunityNoticeFormVO };
export { defaultCommunityNoticeForm, noticeTypeOptions, noticeStatusOptions, 列表数据转表单数据 };
