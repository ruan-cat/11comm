/**
 * 合同甲方表单数据结构定义
 */

// 警告 这里仅为了演示 实际上的业务类型应该都来自于 api 目录内
export interface FirstPartyFormVO {
	/** 甲方名称 */
	partyA: string;
	/** 甲方联系人 */
	contactPerson: string;
	/** 联系电话 */
	contactPhone: string;
	/** 地址 */
	address: string;
	/** 统一社会信用代码 */
	creditCode: string;
	/** 成立日期 */
	establishmentDate: string;
	/** 法定代表人 */
	legalRepresentative: string;
	/** 经营范围 */
	businessScope: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: FirstPartyFormVO = {
	partyA: "",
	contactPerson: "",
	contactPhone: "",
	address: "",
	creditCode: "",
	establishmentDate: "",
	legalRepresentative: "",
	businessScope: "",
};

/**
 * 合同甲方表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface FirstPartyFormProps {
	/** 表单数据 */
	form: FirstPartyFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: FirstPartyFormVO;
}
