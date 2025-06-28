/**
 * 合同甲方表单数据结构定义
 */

// 警告 这里仅为了演示 实际上的业务类型应该都来自于 api 目录内
export interface 合同甲方表单_VO {
	/** 甲方名称 */
	甲方: string;
	/** 甲方联系人 */
	甲方联系人: string;
	/** 联系电话 */
	联系电话: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 合同甲方表单_VO = {
	甲方: "",
	甲方联系人: "",
	联系电话: "",
};

/**
 * 合同甲方表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface AddFormProps {
	/** 表单数据 */
	form: 合同甲方表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 合同甲方表单_VO;
}
