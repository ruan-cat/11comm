import type { OwnerVehicleFormVO } from "@01s-11comm/type";
import type { Mode } from "@/composables/use-mode";

// 重新导出类型
export type { OwnerVehicleFormVO };

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: OwnerVehicleFormVO = {
	licensePlate: "",
	carBrand: "",
	carType: "",
	color: "",
	licensePlateType: "",
	startTime: "",
	endTime: "",
	owner: "",
	parkingSpace: "",
	ownerVehicle: "",
	remark: "",
};

/**
 * 业主车辆表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface OwnerVehicleFormProps {
	/** 表单数据 */
	form: OwnerVehicleFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: OwnerVehicleFormVO;
	/** 表单模式 */
	mode?: Mode;
}
