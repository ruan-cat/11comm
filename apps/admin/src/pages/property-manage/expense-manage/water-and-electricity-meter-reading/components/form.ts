import type { WaterAndElectricityMeterReadingFormVO } from "@01s-11comm/type";

/** 默认表单 Default form @description 对外导出用于其他场景使用 */
export const defaultForm: WaterAndElectricityMeterReadingFormVO = {
	expenseType: "水费",
	chargeItem: "水表",
	meterReadingType: "水表",
	chargeObject: "",
	lastReading: "0",
	currentReading: "0",
	lastReadingTime: "",
	currentReadingTime: "",
	remark: "",
};

/**
 * 水电抄表表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface WaterAndElectricityMeterReadingFormProps {
	/** 表单数据 Form data */
	form: WaterAndElectricityMeterReadingFormVO;
	/** 表单组件重置时默认使用的对象 Default values for form reset */
	defaultValues: WaterAndElectricityMeterReadingFormVO;
}
