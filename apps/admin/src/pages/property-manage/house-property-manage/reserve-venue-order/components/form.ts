/** 场地预约订单 表单数据类型 */
export interface 场地预约订单_VO {
	订单编号: string;
	场馆: string;
	场地: string;
	预约人: string;
	预约电话: string;
	预约日期: string;
	预约时间: string;
	应收金额: string;
	实收金额: string;
	支付方式: string;
	状态: string;
	创建时间: string;
	备注: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 场地预约订单_VO = {
	订单编号: "",
	场馆: "",
	场地: "",
	预约人: "",
	预约电话: "",
	预约日期: "",
	预约时间: "",
	应收金额: "",
	实收金额: "",
	支付方式: "",
	状态: "",
	创建时间: "",
	备注: "",
};

/**
 * 场地预约订单表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ReserveVenueOrderFormProps {
	/** 表单数据 */
	form: 场地预约订单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 场地预约订单_VO;
}
