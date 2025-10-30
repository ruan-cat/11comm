/** 车位申请 表单数据类型 */
export interface 车位申请_VO {
	申请ID: string;
	车牌号: string;
	停车位: string;
	汽车品牌: string;
	车辆类型: string;
	颜色: string;
	起租时间: string;
	结租时间: string;
	申请人: string;
	手机号: string;
	审核结果: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 车位申请_VO = {
	申请ID: "",
	车牌号: "",
	停车位: "",
	汽车品牌: "",
	车辆类型: "轿车",
	颜色: "白色",
	起租时间: "",
	结租时间: "",
	申请人: "",
	手机号: "",
	审核结果: "待审核",
};

/**
 * 车位申请表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface CarportApplyFormProps {
	/** 表单数据 */
	form: 车位申请_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 车位申请_VO;
}