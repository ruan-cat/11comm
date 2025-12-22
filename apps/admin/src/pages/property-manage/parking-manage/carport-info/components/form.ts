import type { CarportInfoFormVO } from "@01s-11comm/type";
import type { Mode } from "@/composables/use-mode";

// 重新导出类型
export type { CarportInfoFormVO };

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: CarportInfoFormVO = {
	parkingLot: "",
	parkingSpace: "",
	parkingSpaceStatus: "",
	parkingSpaceType: "",
	area: "",
	ownerName: "",
	contactPhone: "",
	vehicleNumber: "",
	purchaseDate: "",
	expiryDate: "",
	monthlyRent: 0,
	remark: "",
};

/**
 * 车位信息表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface CarportInfoFormProps {
	/** 表单数据 */
	form: CarportInfoFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: CarportInfoFormVO;
	/** 表单模式 */
	mode?: Mode;
}
