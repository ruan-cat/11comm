
/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 车位信息_表单_VO = {
	停车场: "",
	车位: "",
	车位状态: "",
	车位类型: "",
	面积: "",
	业主姓名: "",
	联系电话: "",
	车辆号码: "",
	购买日期: "",
	到期日期: "",
	月租费用: 0,
	备注: "",
};

/**
 * 车位信息表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface CarportInfoFormProps {
	/** 表单数据 */
	form: 车位信息_表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 车位信息_表单_VO;
}
