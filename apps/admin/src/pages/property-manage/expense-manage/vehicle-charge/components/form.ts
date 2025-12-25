import type { VehicleChargeFormVO } from "@01s-11comm/type";

export type { VehicleChargeFormVO };

/**
 * 车辆收费表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface VehicleChargeFormProps {
	/** 表单数据 */
	form: VehicleChargeFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: VehicleChargeFormVO;
	/** 表单模式 */
	mode?: Mode;
}

/** 默认表单数据 */
export const defaultForm: VehicleChargeFormVO = {
	licensePlateNumber: "",
	ownerName: "",
	parkingSpaceStatus: "",
	chargeAmount: "",
	chargeTime: "",
	chargeMethod: "",
	remark: "",
};
