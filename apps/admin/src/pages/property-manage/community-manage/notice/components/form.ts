import type { CommunityNoticeFormVO } from "@01s-11comm/type";
import { noticeTypeOptions, noticeStatusOptions } from "@01s-11comm/type";

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

export { noticeTypeOptions, noticeStatusOptions };

// TODO: 应该删除
/**
 * 列表数据转换为表单数据
 * @param listData 列表数据
 * @returns 表单数据
 */
export function listDataToFormData(listData: CommunityNoticeFormVO): CommunityNoticeFormVO {
	return { ...listData };
}
