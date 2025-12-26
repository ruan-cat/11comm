import { type Mode } from "@/composables/use-mode";
import type { HouseDecorationStatusType, IsDelayedType, IsViolatedType, HouseDecorationFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: HouseDecorationFormVO = {
	houseNumber: "",
	contactName: "",
	contactPhone: "",
	decorationTime: "",
	applicationTime: "",
	decorationCompany: "",
	managerPhone: "",
	status: "待审核",
	isDelayed: "否",
	delayTime: "",
	isViolated: "否",
	violationDescription: "",
	remarks: "",
};

/**
 * 房屋装修表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface HouseDecorationFormProps {
	/** 表单数据 */
	form: HouseDecorationFormVO;

	/** 表单组件重置时默认使用的对象 */
	defaultValues: HouseDecorationFormVO;

	/** 表单模式 */
	mode?: Mode;
}
