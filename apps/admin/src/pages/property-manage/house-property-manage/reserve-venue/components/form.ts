import type { ReserveVenueFormVO } from "@01s-11comm/type";
import { venueTypeOptions, reservationStatusOptions } from "@01s-11comm/type";

/** venueTypeOptions */
export { venueTypeOptions };

/** reservationStatusOptions */
export { reservationStatusOptions };

/**
 * 场地预约表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ReserveVenueFormProps {
	/** 表单数据 */
	form: ReserveVenueFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: ReserveVenueFormVO;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: ReserveVenueFormVO = {
	reserver: "",
	contactPhone: "",
	reservationTime: "",
	startTime: "",
	endTime: "",
	venueType: "会议室",
	reservationStatus: "待预约",
	numberOfUsers: 1,
	remark: "",
};
