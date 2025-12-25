import type { CommunityManageMyFormVO } from "@01s-11comm/type";
import { type Mode } from "@/composables/use-mode";

/**
 * 我的小区管理表单 Props / My community management form props
 */
export interface CommunityManageMyFormProps {
	/** 表单数据 / Form data */
	form: CommunityManageMyFormVO;
	/** 表单组件重置时默认使用的对象 / Default values for form reset */
	defaultValues: CommunityManageMyFormVO;
	/** 弹框模式 / Dialog mode */
	mode?: Mode;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: CommunityManageMyFormVO = {
	province: "福建省",
	city: "",
	district: "",
	name: "",
	code: "",
	servicePhone: "",
	area: "",
	startTime: "",
	endTime: "",
	status: "operating",
};
