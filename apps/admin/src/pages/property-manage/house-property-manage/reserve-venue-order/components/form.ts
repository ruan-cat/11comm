import type { ReserveVenueOrderFormVO } from "@01s-11comm/type";
import type { Mode } from "@/composables/use-mode";
import { reservedVenueOptions, reserveVenueOrderStatusOptions } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: ReserveVenueOrderFormVO = {
	orderNumber: "",
	venue: "",
	site: "",
	reserver: "",
	reservationPhone: "",
	reservationDate: "",
	reservationTime: "",
	receivableAmount: "",
	receivedAmount: "",
	paymentMethod: "",
	status: "",
	createTime: "",
	remark: "",
};

/**
 * 场地预约订单表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ReserveVenueOrderFormProps {
	/** 表单数据 */
	form: ReserveVenueOrderFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: ReserveVenueOrderFormVO;
	/** 表单模式 */
	mode?: Mode;
}
