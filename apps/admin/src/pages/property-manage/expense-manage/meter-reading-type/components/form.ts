/**
 * @description 抄表类型表单VO
 * Meter reading type form VO
 */
export interface MeterReadingTypeFormVO {
	/** 名称 Name */
	name: string;
	/** 说明 Description */
	description: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: MeterReadingTypeFormVO = {
	name: "",
	description: "",
};

/**
 * 抄表类型表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface MeterTypeFormProps {
	/** 表单数据 */
	form: MeterReadingTypeFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: MeterReadingTypeFormVO;
}
