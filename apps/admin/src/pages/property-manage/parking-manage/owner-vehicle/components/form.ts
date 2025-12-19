import type { 业主车辆表单_VO, OwnerVehicleFormVO } from "@01s-11comm/type";
import type { Mode } from "@/composables/use-mode";

/** 业主车辆表单_VO - 向后兼容别名 */
export type 业主车辆表单_VO_Alias = 业主车辆表单_VO;

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

// 向后兼容 - 支持旧代码使用中文字段名
export const defaultFormChinese: 业主车辆表单_VO = {
	车牌号: "",
	汽车品牌: "",
	车类型: "",
	颜色: "",
	车牌类型: "",
	开始时间: "",
	结束时间: "",
	业主: "",
	车位: "",
	业主车辆: "",
	备注: "",
};

export interface OwnerVehicleFormPropsChinese {
	/** 表单数据 */
	form: 业主车辆表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 业主车辆表单_VO;
	/** 表单模式 */
	mode?: Mode;
}
