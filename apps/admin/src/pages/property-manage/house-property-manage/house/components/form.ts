import type { Mode } from "@/composables/use-mode";
import type { HouseManagementFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: HouseManagementFormVO = {
	house: "",
	floor: "",
	owner: "",
	type: "",
	houseArea: "",
	rent: "",
	houseStatus: "",
	validUntil: "",
};

/**
 * 房屋管理表单 props
 * House management form props
 */
export interface HouseManageFormProps {
	/** 表单数据 Form data */
	form: HouseManagementFormVO;
	/** 表单组件重置时默认使用的对象 Default values for form reset */
	defaultValues: HouseManagementFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
