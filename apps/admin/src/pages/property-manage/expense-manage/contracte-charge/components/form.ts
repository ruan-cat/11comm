const _费用类型 = ["物业费", "押金", "煤气费", "取暖费", "维修费", "服务费", "其他", "系统费用", "租金"] as const;

// 警告 这里仅为了演示 实际上的业务类型为 string
export type 费用类型 = (typeof _费用类型)[number];

// 警告 这里仅为了演示 实际上的业务类型应该都来自于 api 目录内
export interface 合同收费表单_VO {
	费用类型: 费用类型;
	收费项目: string;
	合同状态: "待审核" | "审核中" | "审核完成";
	计费起始时间: string;
	计费结束时间: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 合同收费表单_VO = {
	费用类型: "物业费",
	收费项目: "***",
	合同状态: "待审核",
	计费起始时间: "2025-01-01",
	计费结束时间: "2025-12-31",
};

/**
 * 合同收费表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ContracteChargeFormProps {
	/** 表单数据 */
	form: 合同收费表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 合同收费表单_VO;
}
