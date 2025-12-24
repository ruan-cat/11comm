import type { Mode } from "@/composables/use-mode";
import type { CarportApplyFormVO } from "@01s-11comm/type";
export type { CarportApplyFormVO };

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: CarportApplyFormVO = {
	applicationId: "",
	licensePlate: "",
	parkingSpace: "",
	carBrand: "",
	vehicleType: "轿车",
	color: "白色",
	startLeaseTime: "",
	endLeaseTime: "",
	applicant: "",
	phoneNumber: "",
	reviewResult: "待审核",
};

/**
 * 车位申请表单 props
 * @description 车位申请表单属性
 */
export interface CarportApplyFormProps {
	/** 表单数据 Form data */
	form: CarportApplyFormVO;
	/** 表单组件重置时默认使用的对象 Default values for form reset */
	defaultValues: CarportApplyFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
