import type { Mode } from "@/composables/use-mode";
import type { ParkingLotFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: ParkingLotFormVO = {
	parkingLotNumber: "",
	parkingLotType: "underground",
	parkingSpaceType: "standard",
	externalCode: "",
	remark: "",
};

/**
 * 停车场表单 Props
 * Parking lot form props
 */
export interface ParkingLotFormProps {
	/** 表单数据 Form data */
	form: ParkingLotFormVO;
	/** 表单组件重置时默认使用的对象 Default values for form reset */
	defaultValues: ParkingLotFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
