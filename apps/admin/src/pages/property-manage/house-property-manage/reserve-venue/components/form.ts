import type { Mode } from "@/composables/use-mode";
import type { ReserveVenueFormVO } from "@01s-11comm/type";

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

/**
 * 场地预约表单 props
 * Reserve venue form props
 */
export interface ReserveVenueFormProps {
	/** 表单数据 Form data */
	form: ReserveVenueFormVO;
	/** 表单组件重置时默认使用的对象 Default values for form reset */
	defaultValues: ReserveVenueFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
