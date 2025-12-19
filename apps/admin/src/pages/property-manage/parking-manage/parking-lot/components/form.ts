import type { Mode } from "@/composables/use-mode";
import type { ParkingLotFormVO, ParkingLotType, ParkingSpaceType } from "@01s-11comm/type";

// ==================== 向后兼容的类型别名 ====================

/** 停车场类型联合类型 - 向后兼容别名 */
export type 停车场类型 = ParkingLotType;

/** 车位类型联合类型 - 向后兼容别名 */
export type 车位类型 = ParkingSpaceType;

/** 停车场表单数据类型 - 向后兼容别名 */
export type 停车场表单_VO = ParkingLotFormVO;

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: ParkingLotFormVO = {
	parkingLotNumber: "",
	parkingLotType: "地下停车场",
	parkingSpaceType: "标准车位",
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

/** 向后兼容：停车场表单 Props */
export type 停车场表单Props = ParkingLotFormProps;
