const _到期处理类型 = ["续签", "终止"] as const;

// 警告 这里仅为了演示 实际上的业务类型为 string
export type 到期处理类型 = (typeof _到期处理类型)[number];

// 警告 这里仅为了演示 实际上的业务类型应该都来自于 api 目录内
export interface 合同到期表单_VO {
	合同名称: string;
	合同编号: string;
	合同类型: string;
	甲方: string;
	甲方联系人: string;
	甲方联系电话: string;
	乙方: string;
	乙方联系人: string;
	乙方联系电话: string;
	经办人: string;
	经办电话: string;
	合同金额: string;
	开始时间: string;
	结束时间: string;
	签订时间: string;
	到期处理类型: 到期处理类型;
	处理人: string;
	说明: string;
	合同附件?: any[];
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 合同到期表单_VO = {
	合同名称: "",
	合同编号: "",
	合同类型: "",
	甲方: "",
	甲方联系人: "",
	甲方联系电话: "",
	乙方: "",
	乙方联系人: "",
	乙方联系电话: "",
	经办人: "",
	经办电话: "",
	合同金额: "",
	开始时间: "",
	结束时间: "",
	签订时间: "",
	到期处理类型: "续签",
	处理人: "",
	说明: "",
	合同附件: [],
};

/**
 * 合同到期表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface AddFormProps {
	/** 表单数据 */
	form: 合同到期表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 合同到期表单_VO;
}
