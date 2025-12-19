import type { CarportApplyFormVO, CarportApplyFormProps as CarportApplyFormPropsType } from "@01s-11comm/type";

/** 车位申请 表单数据类型 - 向后兼容别名 */
export type 车位申请_VO = CarportApplyFormVO;

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
 * 车位申请表单 props - 向后兼容别名
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface CarportApplyFormProps extends CarportApplyFormPropsType {}
