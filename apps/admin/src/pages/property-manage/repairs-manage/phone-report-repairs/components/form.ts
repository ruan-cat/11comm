// 警告 这里仅为了演示 实际上的业务类型应该都来自于 api 目录内
export interface 电话报修表单_VO {
	报修范围: "1" | "2";
	报修类型: "1" | "2";
	报修人: string;
	联系方式: string;
	预约时间: string;
	报修内容: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 电话报修表单_VO = {
	报修范围: "1",
	报修类型: "1",
	报修人: "",
	联系方式: "",
	预约时间: "",
	报修内容: "",
};

/**
 * 电话报修表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface PhoneRepairsFormProps {
	/** 表单数据 */
	form: 电话报修表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 电话报修表单_VO;
}
