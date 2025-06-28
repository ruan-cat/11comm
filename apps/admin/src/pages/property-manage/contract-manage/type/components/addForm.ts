const _是否审核 = ["是", "否"] as const;

// 警告 这里仅为了演示 实际上的业务类型为 string
export type 是否审核 = (typeof _是否审核)[number];

// 警告 这里仅为了演示 实际上的业务类型应该都来自于 api 目录内
export interface 合同类型表单_VO {
	类型名称: string;
	是否审核: 是否审核;
	描述: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 合同类型表单_VO = {
	类型名称: "",
	是否审核: "是",
	描述: "",
};

/**
 * 合同类型表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface AddFormProps {
	/** 表单数据 */
	form: 合同类型表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 合同类型表单_VO;
}
