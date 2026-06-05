import type { CommunityNoticeFormVO } from "@01s-11comm/type";
import type { Mode } from "@/composables/use-mode";

/**
 * @description 小区公示表单 Props 类型
 * Community notice form props type
 */
export interface CommunityNoticeFormProps {
	/** 表单数据 Form data */
	form: CommunityNoticeFormVO;
	/** 表单组件重置时默认使用的对象 Default values for form reset */
	defaultValues: CommunityNoticeFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: CommunityNoticeFormVO = {
	noticeTitle: "",
	noticeType: "notification",
	validityStartTime: "",
	validityEndTime: "",
	status: "draft",
	summary: "",
	publisher: "",
	noticeTime: "",
};
