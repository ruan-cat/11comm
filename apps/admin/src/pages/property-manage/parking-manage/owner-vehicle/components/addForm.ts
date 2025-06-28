/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 业主车辆添加表单_VO = {
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

/**
 * 业主车辆表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface OwnerVehicleAddFormProps {
	/** 表单数据 */
	form: 业主车辆添加表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 业主车辆添加表单_VO;
}
