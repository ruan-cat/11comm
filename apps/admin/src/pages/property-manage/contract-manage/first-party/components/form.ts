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
	/** 地址 */
	地址: string;
	/** 统一社会信用代码 */
	统一社会信用代码: string;
	/** 成立日期 */
	成立日期: string;
	/** 法定代表人 */
	法定代表人: string;
	/** 经营范围 */
	经营范围: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 合同甲方表单_VO = {
	甲方: "",
	甲方联系人: "",
	联系电话: "",
	地址: "",
	统一社会信用代码: "",
	成立日期: "",
	法定代表人: "",
	经营范围: "",
};

/**
 * 合同甲方表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface FirstPartyFormProps {
	/** 表单数据 */
	form: 合同甲方表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 合同甲方表单_VO;
}
