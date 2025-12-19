import type { ParkingLotFormVO, ParkingLotFormProps as ParkingLotFormPropsType, ParkingLotType, ParkingSpaceType } from "@01s-11comm/type";

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
 * 停车场表单 props - 向后兼容别名
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface 停车场表单Props extends ParkingLotFormPropsType {}
